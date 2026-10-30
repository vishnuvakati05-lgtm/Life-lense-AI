import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  History,
  Trash2,
  Calendar,
  ArrowRight,
  Clock,
  Sparkles,
  Camera,
  Layers
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { clearScanHistory, analyzeLabelData } from '../services/api';

export const HistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const { history, clearLocalHistory, setActiveAnalysis, setCurrentProductContext, language } = useApp();

  const handleClear = async () => {
    if (window.confirm('Delete all stored scan history? This action cannot be undone.')) {
      await clearScanHistory();
      clearLocalHistory();
    }
  };

  const handleReanalyze = async (record: typeof history[0]) => {
    try {
      const res = await analyzeLabelData({
        product_name: record.product_name,
        ingredients: record.extracted_ingredients,
        language
      });
      setActiveAnalysis(res);
      setCurrentProductContext({
        product_name: record.product_name,
        ingredients: record.extracted_ingredients,
        allergen_statement: '',
        nutrition: {}
      });
      navigate('/results');
    } catch (e) {
      console.error(e);
      navigate('/scan');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20 animate-fade-in">
      
      {/* 12. DASHBOARD AND HISTORY HEADER */}
      <div className="bg-white p-7 sm:p-10 rounded-3xl border border-[#E6E7E0] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[#174B38] font-bold text-xs uppercase tracking-wider mb-1.5">
            <History className="w-4 h-4 text-[#174B38] shrink-0" />
            <span>Local Archive</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-['Plus_Jakarta_Sans',sans-serif] text-[#174B38] tracking-tight">
            Packaging Scan History
          </h1>
          <p className="text-xs text-[#78837B] mt-1">
            Review previous packaged food scans and allergen evaluations stored on this device.
          </p>
        </div>

        {history.length > 0 && (
          <button
            onClick={handleClear}
            className="text-xs font-bold text-[#D95C55] hover:bg-[#FDF3F2] border border-[#F8CAC7] px-4 py-2.5 rounded-2xl flex items-center gap-2 transition-colors self-start sm:self-center active:scale-95 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5 shrink-0" />
            <span>Clear Archive</span>
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="bg-white p-14 rounded-3xl border border-[#E6E7E0] text-center space-y-4 shadow-xs">
          <Clock className="w-12 h-12 text-[#174B38] mx-auto opacity-40 shrink-0" />
          <h3 className="font-['Plus_Jakarta_Sans',sans-serif] font-bold text-lg text-[#202923]">No Scans Stored Yet</h3>
          <p className="text-xs text-[#78837B] max-w-sm mx-auto leading-relaxed">
            Scan a packaging label using the camera or upload an image to begin building your personal ingredient intelligence archive.
          </p>
          <button
            onClick={() => navigate('/scan')}
            className="btn-primary"
          >
            <Camera className="w-4 h-4 text-[#D7EDB2]" />
            <span>Start First Scan</span>
          </button>
        </div>
      ) : (
        <div className="space-y-3.5">
          {history.map((record) => (
            <div
              key={record.id}
              className="bg-white p-6 rounded-3xl border border-[#E6E7E0] card-hover shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-['Plus_Jakarta_Sans',sans-serif] font-bold text-lg text-[#202923]">
                    {record.product_name}
                  </h3>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#EEF8DC] text-[#174B38] border border-[#D7EDB2]">
                    {record.data_source || 'Camera Scan'}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-xs text-[#78837B]">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 shrink-0" />
                    <span>{new Date(record.created_at).toLocaleDateString()}</span>
                  </span>
                  <span>•</span>
                  <span>ID: {record.id.slice(0, 8)}</span>
                </div>

                <p className="text-xs text-[#78837B] line-clamp-1 font-mono pt-1">
                  {record.extracted_ingredients}
                </p>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                <button
                  onClick={() => handleReanalyze(record)}
                  className="px-4 py-2 bg-[#F8F8F2] hover:bg-[#EEF8DC] hover:text-[#174B38] text-[#174B38] rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border border-[#E6E7E0]"
                >
                  <span>View Analysis</span>
                  <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
