import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Camera,
  Upload,
  RefreshCw,
  Sliders,
  AlertTriangle,
  CheckCircle,
  Barcode,
  ArrowRight,
  Sparkles,
  Info,
  RotateCw,
  FileCheck2,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { scanLabelImage, analyzeLabelData, lookupBarcodeOFF } from '../services/api';
import { ScanResult } from '../types';

export const SmartScanPage: React.FC = () => {
  const navigate = useNavigate();
  const { language, setActiveScan, setActiveAnalysis, setCurrentProductContext } = useApp();

  // Mode: 'camera' | 'upload' | 'barcode' | 'review'
  const [mode, setMode] = useState<'camera' | 'upload' | 'barcode' | 'review'>('camera');
  const [labelTab, setLabelTab] = useState<'ingredients' | 'front' | 'nutrition'>('ingredients');

  // Camera video stream
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [hasTorch, setHasTorch] = useState<boolean>(false);
  const [torchOn, setTorchOn] = useState<boolean>(false);

  // Upload & processing state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingStep, setLoadingStep] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Barcode input
  const [barcodeInput, setBarcodeInput] = useState<string>('');

  // Extracted data for user review
  const [extractedData, setExtractedData] = useState<{
    productName: string;
    ingredients: string;
    allergenStatement: string;
    nutritionText: string;
    confidence: number | null;
    warnings: string[];
    scanId?: string;
  }>({
    productName: 'Scanned Food Product',
    ingredients: '',
    allergenStatement: '',
    nutritionText: '',
    confidence: null,
    warnings: [],
  });

  // Start live camera
  useEffect(() => {
    if (mode === 'camera') {
      startCamera();
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [mode]);

  const startCamera = async () => {
    setCameraError(null);
    try {
      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: { ideal: 'environment' },
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
        audio: false,
      };

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }

      // Check torch capability
      const track = mediaStream.getVideoTracks()[0];
      const capabilities: any = track.getCapabilities ? track.getCapabilities() : {};
      if (capabilities.torch) {
        setHasTorch(true);
      }
    } catch (err: any) {
      console.warn('Camera access denied or unavailable:', err);
      setCameraError('Camera access was not granted or is unsupported. Please upload a photograph instead.');
      setMode('upload');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  const toggleTorch = async () => {
    if (!stream) return;
    const track = stream.getVideoTracks()[0];
    try {
      const newTorch = !torchOn;
      await (track as any).applyConstraints({
        advanced: [{ torch: newTorch }],
      });
      setTorchOn(newTorch);
    } catch (e) {
      console.warn('Torch toggle failed', e);
    }
  };

  // Capture snapshot from video stream
  const captureSnapshot = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], `label-capture-${Date.now()}.jpg`, { type: 'image/jpeg' });
        setSelectedFile(file);
        setImagePreview(URL.createObjectURL(file));
        stopCamera();
        handleProcessImage(file);
      }
    }, 'image/jpeg', 0.92);
  };

  // Handle file selection from gallery
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file));
      handleProcessImage(file);
    }
  };

  // Run OCR on backend
  const handleProcessImage = async (file: File) => {
    setIsLoading(true);
    setLoadingStep('Reading label & assessing clarity...');
    setErrorMsg(null);

    try {
      setLoadingStep('Extracting ingredients & declarations via OCR...');
      const scanResult: ScanResult = await scanLabelImage(file);
      setActiveScan(scanResult);

      setExtractedData({
        productName: 'Scanned Food Product',
        ingredients: scanResult.ingredients || scanResult.extracted_text,
        allergenStatement: scanResult.allergen_statement || '',
        nutritionText: scanResult.nutrition_text || '',
        confidence: scanResult.confidence,
        warnings: scanResult.warnings || [],
        scanId: scanResult.scan_id,
      });

      setMode('review');
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Image processing failed. Please ensure the label is well-lit and in focus.');
    } finally {
      setIsLoading(false);
      setLoadingStep('');
    }
  };

  // Barcode Lookup
  const handleBarcodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!barcodeInput.trim()) return;

    setIsLoading(true);
    setLoadingStep('Looking up product in Open Food Facts database...');
    setErrorMsg(null);

    try {
      const res = await lookupBarcodeOFF(barcodeInput.trim());
      if (res.found && res.ingredients_text) {
        setExtractedData({
          productName: res.product_name || 'Barcode Product',
          ingredients: res.ingredients_text,
          allergenStatement: res.allergens || '',
          nutritionText: JSON.stringify(res.nutrition || {}),
          confidence: 95,
          warnings: ['Data retrieved from Open Food Facts. Verify against physical packaging.'],
        });
        setMode('review');
      } else {
        setErrorMsg('Barcode not found in Open Food Facts database. Please take a photograph of the label instead.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Barcode lookup failed.');
    } finally {
      setIsLoading(false);
      setLoadingStep('');
    }
  };

  // Confirm review and analyze
  const handleConfirmAndAnalyze = async () => {
    if (!extractedData.ingredients.trim()) {
      setErrorMsg('Please confirm or paste the ingredient list before proceeding.');
      return;
    }

    setIsLoading(true);
    setLoadingStep('Identifying additives, checking allergens & generating explanation...');
    setErrorMsg(null);

    try {
      const analysis = await analyzeLabelData({
        product_name: extractedData.productName,
        ingredients: extractedData.ingredients,
        allergen_statement: extractedData.allergenStatement,
        language,
      });

      setActiveAnalysis(analysis);
      setCurrentProductContext({
        product_name: extractedData.productName,
        ingredients: extractedData.ingredients,
        allergen_statement: extractedData.allergenStatement,
        nutrition: {},
      });

      navigate('/results');
    } catch (err: any) {
      setErrorMsg(err.message || 'Analysis failed. Please verify the ingredient text.');
    } finally {
      setIsLoading(false);
      setLoadingStep('');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20 animate-fade-in">

      {/* Header Banner */}
      <div className="bg-white p-7 sm:p-10 rounded-3xl border border-[#E6E7E0] shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 bg-[#EEF8DC] px-3.5 py-1 rounded-full text-xs font-bold text-[#174B38] border border-[#D7EDB2]">
              <Camera className="w-3.5 h-3.5 text-[#174B38]" />
              <span>SmartScan Vision Engine</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black font-['Plus_Jakarta_Sans',sans-serif] text-[#174B38] tracking-tight">
              Let&apos;s understand what&apos;s inside.
            </h1>
            <p className="text-xs sm:text-sm text-[#78837B]">
              Choose how you want to scan: camera, photo upload, or barcode lookup.
            </p>
          </div>

          {/* 3 Prominent Actions Switcher */}
          {mode !== 'review' && (
            <div className="flex items-center bg-[#F8F8F2] p-1.5 rounded-2xl border border-[#E6E7E0] gap-1 self-start sm:self-center">
              <button
                onClick={() => setMode('camera')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${mode === 'camera'
                  ? 'bg-[#174B38] text-white shadow-2xs'
                  : 'text-[#78837B] hover:text-[#202923]'
                  }`}
              >
                <Camera className="w-3.5 h-3.5 shrink-0" />
                <span>1. Camera</span>
              </button>
              <button
                onClick={() => setMode('upload')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${mode === 'upload'
                  ? 'bg-[#174B38] text-white shadow-2xs'
                  : 'text-[#78837B] hover:text-[#202923]'
                  }`}
              >
                <Upload className="w-3.5 h-3.5 shrink-0" />
                <span>2. Upload</span>
              </button>
              <button
                onClick={() => setMode('barcode')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${mode === 'barcode'
                  ? 'bg-[#174B38] text-white shadow-2xs'
                  : 'text-[#78837B] hover:text-[#202923]'
                  }`}
              >
                <Barcode className="w-3.5 h-3.5 shrink-0" />
                <span>3. Barcode</span>
              </button>
            </div>
          )}
        </div>

        {/* Panel Tabs */}
        {mode !== 'review' && (
          <div className="flex items-center gap-2 overflow-x-auto pt-2 border-t border-[#E6E7E0] text-xs">
            <span className="text-[11px] text-[#78837B] font-bold uppercase tracking-wider pl-1">Target Panel:</span>
            {[
              { id: 'ingredients', label: 'Ingredients Label' },
              { id: 'front', label: 'Front Packaging' },
              { id: 'nutrition', label: 'Nutrition Table' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setLabelTab(tab.id as any)}
                className={`px-3 py-1 rounded-full border transition-all cursor-pointer ${labelTab === tab.id
                  ? 'bg-[#EEF8DC] text-[#174B38] border-[#D7EDB2] font-bold'
                  : 'bg-white text-[#78837B] border-[#E6E7E0] hover:bg-[#F8F8F2]'
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Error Banner */}
      {errorMsg && (
        <div className="bg-[#FDF3F2] border border-[#F8CAC7] text-[#9B2C26] p-4 rounded-2xl flex items-center gap-3 text-xs animate-fade-in">
          <AlertTriangle className="w-4 h-4 shrink-0 text-[#D95C55]" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Live Processing Progress Indicator */}
      {isLoading && (
        <div className="bg-white border border-[#D7EDB2] p-10 rounded-3xl text-center space-y-4 shadow-sm animate-fade-in">
          <div className="relative w-14 h-14 mx-auto">
            <div className="w-14 h-14 border-4 border-[#EEF8DC] border-t-[#174B38] rounded-full animate-spin" />
            <Sparkles className="w-5 h-5 text-[#174B38] absolute inset-0 m-auto animate-pulse" />
          </div>
          <div className="space-y-1">
            <h3 className="font-['Plus_Jakarta_Sans',sans-serif] font-bold text-lg text-[#174B38]">
              Analyzing Packaging Evidence
            </h3>
            <p className="text-xs text-[#78837B] font-mono">{loadingStep}</p>
          </div>
        </div>
      )}

      {/* MODE 1: CAMERA SCANNING VIEWPORT */}
      {mode === 'camera' && !isLoading && (
        <div className="bg-[#0F3527] rounded-3xl overflow-hidden shadow-xl border border-[#E6E7E0] relative flex flex-col items-center justify-center min-h-[460px]">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-auto max-h-[540px] object-cover"
          />

          {/* Subtle Viewport Frame */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center p-6">
            <div className="w-full max-w-md h-64 border border-[#D7EDB2]/60 rounded-3xl relative shadow-[0_0_0_9999px_rgba(15,53,39,0.55)] overflow-hidden">
              {/* Subtle laser sweep */}
              <div className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#D7EDB2] to-transparent shadow-[0_0_8px_#D7EDB2] animate-scan-sweep" />

              {/* Viewfinder brackets */}
              <span className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-[#D7EDB2]" />
              <span className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-[#D7EDB2]" />
              <span className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-[#D7EDB2]" />
              <span className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-[#D7EDB2]" />

              <span className="absolute bottom-3 inset-x-0 mx-auto w-fit bg-[#174B38]/90 backdrop-blur-sm text-[#D7EDB2] text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                Align {labelTab.toUpperCase()} In Frame
              </span>
            </div>
          </div>

          {/* Camera Controls Bar */}
          <div className="absolute bottom-6 left-0 right-0 flex items-center justify-center gap-6 z-10 px-4">
            {hasTorch && (
              <button
                onClick={toggleTorch}
                className={`p-3.5 rounded-full text-white backdrop-blur-md transition-all cursor-pointer ${torchOn ? 'bg-[#D7EDB2] text-[#174B38] shadow-md' : 'bg-black/40 hover:bg-black/60'
                  }`}
                title="Toggle Flashlight"
              >
                <Sliders className="w-5 h-5 shrink-0" />
              </button>
            )}

            {/* Central Capture Trigger */}
            <button
              onClick={captureSnapshot}
              className="w-18 h-18 rounded-full bg-white border-4 border-[#D7EDB2] flex items-center justify-center shadow-xl active:scale-95 transition-transform cursor-pointer"
              title="Capture Image"
            >
              <div className="w-13 h-13 rounded-full bg-[#174B38]" />
            </button>

            <button
              onClick={() => setMode('upload')}
              className="p-3.5 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-md transition-colors cursor-pointer"
              title="Upload Photo Instead"
            >
              <Upload className="w-5 h-5 shrink-0" />
            </button>
          </div>

          <canvas ref={canvasRef} className="hidden" />
        </div>
      )}

      {/* MODE 2: UPLOAD FOOD LABEL */}
      {mode === 'upload' && !isLoading && (
        <div className="bg-white p-8 sm:p-14 rounded-3xl border-2 border-dashed border-[#E6E7E0] hover:border-[#174B38] transition-colors text-center space-y-6 shadow-xs">
          <div className="w-16 h-16 rounded-2xl bg-[#EEF8DC] text-[#174B38] flex items-center justify-center mx-auto">
            <Upload className="w-8 h-8 text-[#174B38]" />
          </div>

          <div className="max-w-md mx-auto space-y-1.5">
            <h3 className="font-['Plus_Jakarta_Sans',sans-serif] font-bold text-xl text-[#202923]">
              Select Packaging Image
            </h3>
            <p className="text-xs text-[#78837B] leading-relaxed">
              Upload a clear photograph of the ingredient panel (JPG, PNG, WebP up to 10MB).
            </p>
          </div>

          <label className="inline-block bg-[#174B38] hover:bg-[#0F3527] text-white font-['Plus_Jakarta_Sans',sans-serif] font-bold text-xs px-8 py-3.5 rounded-2xl cursor-pointer shadow-xs transition-all active:scale-95">
            <span>Choose from Device</span>
            <input
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        </div>
      )}

      {/* MODE 3: BARCODE LOOKUP */}
      {mode === 'barcode' && !isLoading && (
        <div className="bg-white p-8 sm:p-10 rounded-3xl border border-[#E6E7E0] shadow-xs space-y-6">
          <div className="flex items-center gap-3 text-[#174B38] font-['Plus_Jakarta_Sans',sans-serif] font-bold text-xl">
            <Barcode className="w-6 h-6 text-[#174B38] shrink-0" />
            <span>Search via Barcode (EAN / UPC)</span>
          </div>

          <form onSubmit={handleBarcodeSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#202923] mb-1.5">
                Barcode Number
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={barcodeInput}
                  onChange={(e) => setBarcodeInput(e.target.value)}
                  placeholder="e.g. 8901030383847 or 5449000000996"
                  className="flex-1 px-4 py-3.5 text-sm rounded-2xl border border-[#E6E7E0] focus:outline-none focus:border-[#174B38] bg-[#F8F8F2]"
                />
                <button
                  type="submit"
                  className="bg-[#174B38] hover:bg-[#0F3527] text-white font-bold text-xs px-6 py-3.5 rounded-2xl transition-colors shadow-xs cursor-pointer"
                >
                  Lookup
                </button>
              </div>
            </div>
            <p className="text-[11px] text-[#78837B] leading-relaxed">
              Queries the global Open Food Facts database. You will be able to review and verify extracted ingredients before running safety analysis.
            </p>
          </form>
        </div>
      )}

      {/* MODE 4: OCR EXTRACTION REVIEW SCREEN (Zero-Hallucination Barrier) */}
      {mode === 'review' && !isLoading && (
        <div className="bg-white p-7 sm:p-10 rounded-3xl border border-[#E6E7E0] shadow-xs space-y-6 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#E6E7E0] gap-3">
            <div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-[#174B38] shrink-0" />
                <h2 className="font-['Plus_Jakarta_Sans',sans-serif] font-black text-xl text-[#174B38]">
                  Review & Verify Extracted Label
                </h2>
              </div>
              <p className="text-xs text-[#78837B] mt-0.5">
                Inspect the OCR output below. Correct any misread letters before generating safety intelligence.
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              {extractedData.confidence !== null && (
                <span
                  className={`text-xs font-bold px-3 py-1 rounded-full border ${extractedData.confidence > 65
                    ? 'bg-[#EEF8DC] text-[#174B38] border-[#D7EDB2]'
                    : 'bg-[#FEF8ED] text-[#966114] border-[#F9DEAA]'
                    }`}
                >
                  OCR Score: {extractedData.confidence}%
                </span>
              )}

              <button
                onClick={() => setMode('camera')}
                className="text-xs text-[#78837B] hover:text-[#202923] border border-[#E6E7E0] hover:bg-[#F8F8F2] px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5 shrink-0" />
                <span>Retake</span>
              </button>
            </div>
          </div>

          {/* Warnings List */}
          {extractedData.warnings.length > 0 && (
            <div className="bg-[#FEF8ED] border border-[#F9DEAA] p-4 rounded-2xl space-y-1">
              {extractedData.warnings.map((w, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs text-[#966114]">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-[#E5A33A]" />
                  <span>{w}</span>
                </div>
              ))}
            </div>
          )}

          {/* Review Input Fields */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#202923] mb-1">
                Product Name
              </label>
              <input
                type="text"
                value={extractedData.productName}
                onChange={(e) => setExtractedData({ ...extractedData, productName: e.target.value })}
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-[#E6E7E0] bg-[#F8F8F2] focus:outline-none focus:border-[#174B38]"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-[#202923]">
                  Ingredients Declaration (Directly Editable)
                </label>
                <span className="text-[11px] text-[#78837B]">
                  Comma-separated or parenthesized ingredients
                </span>
              </div>
              <textarea
                rows={5}
                value={extractedData.ingredients}
                onChange={(e) => setExtractedData({ ...extractedData, ingredients: e.target.value })}
                placeholder="e.g. Wheat Flour (Maida), Palm Oil, Sugar, Raising Agents [INS 503(ii), INS 500(ii)], Emulsifier [INS 322], Iodised Salt"
                className="w-full p-4 text-xs sm:text-sm rounded-2xl border border-[#E6E7E0] bg-[#F8F8F2] focus:outline-none focus:border-[#174B38] font-mono leading-relaxed shadow-inner"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#202923] mb-1">
                Declared Allergen / Contains Statement
              </label>
              <input
                type="text"
                value={extractedData.allergenStatement}
                onChange={(e) => setExtractedData({ ...extractedData, allergenStatement: e.target.value })}
                placeholder="e.g. Contains Wheat, Soy and Milk. May contain Tree Nuts."
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-[#E6E7E0] bg-[#F8F8F2] focus:outline-none focus:border-[#174B38]"
              />
            </div>
          </div>

          {/* Action Confirmation Button */}
          <div className="pt-4 border-t border-[#E6E7E0] flex justify-end">
            <button
              onClick={handleConfirmAndAnalyze}
              className="btn-primary"
            >
              <span>Confirm & Analyze Ingredients</span>
              <ArrowRight className="w-4 h-4 text-[#D7EDB2]" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
