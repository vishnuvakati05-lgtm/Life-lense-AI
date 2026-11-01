import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Camera,
  BookOpen,
  ArrowRight,
  Zap,
  CheckCircle2,
  FileCheck2,
  Search,
  Scale,
  ShieldCheck,
  AlertTriangle,
  Sparkles,
  Info,
  ShieldAlert,
  Flame,
  Activity,
  MessageSquare,
  HelpCircle,
  Smartphone,
  ChevronDown,
  Layers,
  Check,
  Eye,
  ScanLine
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { analyzeLabelData } from '../services/api';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { language, setActiveAnalysis, setCurrentProductContext } = useApp();
  const [activeMockIndex, setActiveMockIndex] = useState(0);
  const [phoneTab, setPhoneTab] = useState<'scan' | 'analysis'>('scan');
  const [selectedDecrypter, setSelectedDecrypter] = useState<number>(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Curated packaged food formulations for instant 1-click evaluation
  const sampleProducts = [
    {
      name: 'Instant Masala Noodles',
      category: 'Savory Noodle Pack',
      calories: '427 kcal',
      sodium: '1020 mg',
      additivesCount: '4 Additives',
      highlightAdditives: ['INS 621 (MSG)', 'INS 319 (TBHQ)', 'INS 412 (Guar Gum)', 'INS 500(i)'],
      badgeColor: 'bg-[#FEF8ED] text-[#966114] border-[#F9DEAA]',
      ingredients: 'Wheat Flour (Maida), Palm Oil, Salt, Wheat Gluten, Mineral (Calcium Carbonate), Thickener (INS 412), Acidity Regulators [INS 501(i), INS 500(i)], Flavour Enhancer (INS 621), Antioxidant (INS 319).',
      allergen_statement: 'May contain Milk, Soy, and Mustard.',
      nutrition: {
        calories: '427 kcal',
        total_fat: '15.7 g',
        saturated_fat: '6.8 g',
        sodium: '1020 mg',
        total_carbohydrates: '63.5 g',
        total_sugars: '2.1 g',
        protein: '8.0 g'
      }
    },
    {
      name: 'Choco-Chip Bakery Cookies',
      category: 'Sweet Biscuit',
      calories: '495 kcal',
      sodium: '290 mg',
      additivesCount: '3 Additives',
      highlightAdditives: ['INS 503(ii)', 'INS 500(ii)', 'INS 322 Lecithin'],
      badgeColor: 'bg-[#FDF3F2] text-[#9B2C26] border-[#F8CAC7]',
      ingredients: 'Refined Wheat Flour, Sugar, Edible Vegetable Fat (Palm Oil), Chocolate Chips (Sugar, Cocoa Solids, Cocoa Butter, Emulsifier INS 322), Raising Agents [INS 503(ii), INS 500(ii)], Emulsifier [INS 322(i), INS 471], Iodised Salt.',
      allergen_statement: 'Contains Wheat, Milk, and Soy.',
      nutrition: {
        calories: '495 kcal',
        total_fat: '22.0 g',
        saturated_fat: '10.5 g',
        sodium: '290 mg',
        total_carbohydrates: '68.0 g',
        total_sugars: '32.0 g',
        protein: '6.2 g'
      }
    },
    {
      name: 'Zero-Sugar Citrus Soda',
      category: 'Carbonated Beverage',
      calories: '1 kcal',
      sodium: '45 mg',
      additivesCount: '5 Additives',
      highlightAdditives: ['INS 955 (Sucralose)', 'INS 950 (Acesulfame K)', 'INS 211', 'INS 102'],
      badgeColor: 'bg-[#F0FDF4] text-[#174B38] border-[#D7EDB2]',
      ingredients: 'Carbonated Water, Acidity Regulators (INS 330, INS 331), Sweeteners (INS 955, INS 950), Preservative (INS 211), Caffeine (80 mg), Stabilizer (INS 415), Synthetic Food Colour (INS 102).',
      allergen_statement: '',
      nutrition: {
        calories: '1 kcal',
        total_fat: '0 g',
        sodium: '45 mg',
        total_carbohydrates: '0.2 g',
        total_sugars: '0 g',
        caffeine: '80 mg'
      }
    }
  ];

  const handleTestSample = async (sample: typeof sampleProducts[0]) => {
    try {
      const res = await analyzeLabelData({
        product_name: sample.name,
        ingredients: sample.ingredients,
        allergen_statement: sample.allergen_statement,
        nutrition: sample.nutrition,
        language
      });
      setActiveAnalysis(res);
      setCurrentProductContext({
        product_name: sample.name,
        ingredients: sample.ingredients,
        allergen_statement: sample.allergen_statement,
        nutrition: sample.nutrition
      });
      navigate('/results');
    } catch (err) {
      console.error(err);
      navigate('/scan');
    }
  };

  const activeMock = sampleProducts[activeMockIndex];

  // Curated additives for the interactive instant decrypter sandbox
  const decrypterAdditives = [
    {
      code: 'INS 621',
      name: 'Monosodium Glutamate (MSG)',
      category: 'Flavour Enhancer (Umami)',
      whyAdded: 'Activates savory umami taste receptors on the tongue to intensify overall savoury aroma.',
      status: 'FSSAI & JECFA Approved',
      statusColor: 'bg-[#EEF8DC] text-[#174B38] border-[#D7EDB2]',
      safetyConsensus: 'Extensive evaluations by WHO/JECFA and US FDA confirm MSG is safe for general consumption when used within Good Manufacturing Practice.',
      commonFoods: 'Instant noodles, savory chips, soup powders, seasonings',
      wholeFoodAlt: 'Naturally occurring in aged tomatoes, parmesan cheese, kombu seaweed, and dried mushrooms'
    },
    {
      code: 'INS 319',
      name: 'TBHQ (Tertiary Butylhydroquinone)',
      category: 'Synthetic Antioxidant',
      whyAdded: 'Prevents vegetable oils from undergoing lipid peroxidation (rancidity) during storage.',
      status: 'Strict Max Limit: 200 mg/kg',
      statusColor: 'bg-[#FEF8ED] text-[#966114] border-[#F9DEAA]',
      safetyConsensus: 'Permitted in India (FSSAI) and the US within strict maximum legal thresholds. Not permitted in infant food formulations.',
      commonFoods: 'Fried instant noodles, commercial biscuits, edible oils, frozen fish',
      wholeFoodAlt: 'Natural mixed tocopherols (Vitamin E) or rosemary extract'
    },
    {
      code: 'INS 955',
      name: 'Sucralose',
      category: 'Non-Nutritive Sweetener',
      whyAdded: 'Provides sweetness ~600× that of sucrose with virtually zero caloric load.',
      status: 'Heat Stable & ADI 0-15 mg/kg',
      statusColor: 'bg-[#EEF8DC] text-[#174B38] border-[#D7EDB2]',
      safetyConsensus: 'Approved across 80+ nations. Does not raise blood glucose or cause dental caries.',
      commonFoods: 'Diet sodas, sugar-free yogurts, zero-calorie syrups, sports nutrition',
      wholeFoodAlt: 'Monk fruit extract, stevia leaf, or raw dates'
    },
    {
      code: 'INS 102',
      name: 'Tartrazine',
      category: 'Synthetic Azo Colour',
      whyAdded: 'Imparts a vivid lemon-yellow hue to processed beverages and confectionery.',
      status: 'Mandatory Label Warning in EU',
      statusColor: 'bg-[#FDF3F2] text-[#9B2C26] border-[#F8CAC7]',
      safetyConsensus: 'Permitted by FSSAI & FDA within limits. In the EU, packaged foods containing it must declare potential activity/attention effects in children.',
      commonFoods: 'Citrus candies, processed pickles, soft drinks, flavored powders',
      wholeFoodAlt: 'Curcumin (turmeric extract) or beta-carotene'
    },
    {
      code: 'INS 211',
      name: 'Sodium Benzoate',
      category: 'Antimicrobial Preservative',
      whyAdded: 'Inhibits yeasts, molds, and bacteria in acidic food and beverage formulations.',
      status: 'Codex Alimentarius Permitted',
      statusColor: 'bg-[#EEF8DC] text-[#174B38] border-[#D7EDB2]',
      safetyConsensus: 'Widely used in acidic foods (pH below 4.5). Should not be combined with high ascorbic acid (Vitamin C) under intense light/heat.',
      commonFoods: 'Carbonated drinks, fruit jams, salad dressings, tomato ketchups',
      wholeFoodAlt: 'Citric acid, pasteurization, and aseptic packaging'
    },
    {
      code: 'INS 322',
      name: 'Lecithin (Soy / Sunflower)',
      category: 'Natural Emulsifier',
      whyAdded: 'Prevents separation of cocoa butter and liquids, ensuring smooth uniform texture.',
      status: 'Generally Recognized as Safe',
      statusColor: 'bg-[#EEF8DC] text-[#174B38] border-[#D7EDB2]',
      safetyConsensus: 'Naturally present in egg yolks and soybeans. Completely safe; flagged primarily for soy allergy sufferers if derived from soy.',
      commonFoods: 'Chocolate bars, baked goods, margarine, infant cereals',
      wholeFoodAlt: 'Egg lecithin or sunflower lecithin'
    }
  ];

  const faqs = [
    {
      q: 'What are INS numbers and are all food additives dangerous?',
      a: 'INS stands for the International Numbering System adopted by Codex Alimentarius (WHO/FAO) and FSSAI. It is simply an international standardized index for food ingredients. Not all additives are dangerous chemicals — for example, Vitamin C is INS 300, Baking Soda is INS 500(ii), and Turmeric is INS 100(i). LifeLens AI distinguishes harmless culinary aids from additives with restrictive ADIs or potential sensitivities.'
    },
    {
      q: 'How does LifeLens AI ensure Zero Hallucinations?',
      a: 'Most AI apps feed an image directly into generative LLMs, which frequently fabricate unlisted ingredients. LifeLens AI employs a deterministic 2-barrier architecture: first, Tesseract OCR extracts the verbatim packaging text and presents an editable verification barrier; second, allergen detection and chemical code lookups are performed against deterministic regex dictionaries before any natural language explanation is produced.'
    },
    {
      q: 'Does LifeLens AI work for Indian foods and regional ingredients?',
      a: 'Yes! Our allergen dictionary is specifically tuned for Indian packaged foods and recognizes colloquial and Hindi/Telugu variants such as Maida (refined wheat), Moongphali (peanuts), Badam/Kaju (tree nuts), Anda (eggs), Sarson (mustard), and Til (sesame), including cross-contact warnings.'
    },
    {
      q: 'Can LifeLens AI diagnose my medical allergies?',
      a: 'No. LifeLens AI is an educational food intelligence tool designed to decode complex packaging terminology. It does not replace medical allergy testing, clinical advice, or the guarantee of zero cross-contact in unregulated facilities. Always inspect physical packaging and consult an allergist.'
    }
  ];

  return (
    <div className="space-y-20 pb-20 animate-fade-in max-w-7xl mx-auto">
      
      {/* ==========================================================================
          HERO SECTION — EDITORIAL ELEGANCE & SOPHISTICATED PRODUCT DEMONSTRATION
          ========================================================================== */}
      <section className="relative overflow-hidden rounded-3xl sm:rounded-[2.5rem] bg-[#174B38] text-white p-8 sm:p-12 lg:p-16 shadow-xl border border-[#216149]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-12 items-center relative z-10">
          
          {/* Left Column: Heading, Subtitle & CTAs */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 bg-[#EEF8DC]/15 backdrop-blur-sm px-4 py-1.5 rounded-full text-xs font-bold text-[#D7EDB2] border border-[#D7EDB2]/25 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-[#D7EDB2] animate-pulse" />
              <span>Multilingual Food Intelligence Platform</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black font-['Plus_Jakarta_Sans',sans-serif] tracking-tight leading-[1.12] text-white">
              Know What&apos;s Inside.<br />
              <span className="text-[#D7EDB2]">
                Make Smarter Food Choices.
              </span>
            </h1>

            <p className="text-sm sm:text-base text-[#D7EDB2]/90 leading-relaxed max-w-xl font-normal">
              Scan any food package, understand its ingredients and discover what goes into the food you eat — in <strong>English</strong>, <strong>हिन्दी</strong> and <strong>తెలుగు</strong>.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => navigate('/scan')}
                className="bg-[#D7EDB2] hover:bg-[#EEF8DC] text-[#174B38] font-['Plus_Jakarta_Sans',sans-serif] font-bold text-sm px-8 py-4 rounded-2xl shadow-md transition-all duration-150 active:scale-95 cursor-pointer flex items-center gap-2.5"
              >
                <Camera className="w-5 h-5 shrink-0 text-[#174B38]" />
                <span>Start Scanning</span>
              </button>

              <button
                onClick={() => navigate('/explore')}
                className="bg-white/10 hover:bg-white/15 text-white font-semibold text-sm px-7 py-4 rounded-2xl border border-white/20 transition-all backdrop-blur-sm flex items-center gap-2.5 cursor-pointer"
              >
                <BookOpen className="w-4 h-4 text-[#D7EDB2] shrink-0" />
                <span>Explore LifeLens</span>
              </button>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap gap-x-6 gap-y-2 pt-3 text-xs text-[#D7EDB2]/80 font-medium">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#D7EDB2] shrink-0" />
                FSSAI & Codex Aligned
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#D7EDB2] shrink-0" />
                Zero AI Hallucinations
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#D7EDB2] shrink-0" />
                100% Offline Core Logic
              </span>
            </div>
          </div>

          {/* Right Column: Realistic Smartphone Product Scanner Demo with Interactive Views */}
          <div className="lg:col-span-5 relative flex justify-center">
            
            {/* Phone Container */}
            <div className="relative w-full max-w-[370px] bg-white rounded-[2.5rem] p-4 shadow-2xl border-4 border-[#216149]/40 text-[#202923]">
              
              {/* Phone Speaker Notch / Dynamic Island */}
              <div className="w-24 h-4 bg-[#174B38]/15 rounded-full mx-auto mb-3 flex items-center justify-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#174B38]/40" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#174B38]/30" />
              </div>

              {/* Viewport Card */}
              <div className="bg-[#F8F8F2] rounded-3xl p-4 border border-[#E6E7E0] relative overflow-hidden space-y-3">
                
                {/* Header bar & Mode Selector */}
                <div className="flex items-center justify-between pb-2 border-b border-[#E6E7E0]">
                  <div className="flex items-center gap-1 bg-white p-0.5 rounded-xl border border-[#E6E7E0] text-[10px]">
                    <button
                      onClick={() => setPhoneTab('scan')}
                      className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                        phoneTab === 'scan' ? 'bg-[#174B38] text-white' : 'text-[#78837B]'
                      }`}
                    >
                      Viewfinder
                    </button>
                    <button
                      onClick={() => setPhoneTab('analysis')}
                      className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                        phoneTab === 'analysis' ? 'bg-[#174B38] text-white' : 'text-[#78837B]'
                      }`}
                    >
                      Dossier
                    </button>
                  </div>
                  <span className="text-[10px] font-mono bg-[#EEF8DC] text-[#174B38] font-bold px-2 py-0.5 rounded-full border border-[#D7EDB2]">
                    OCR: 98%
                  </span>
                </div>

                {phoneTab === 'scan' ? (
                  <>
                    {/* Viewfinder Mode */}
                    <div className="relative bg-white rounded-2xl p-4 border border-[#E6E7E0] overflow-hidden min-h-[220px] flex flex-col justify-between">
                      {/* Laser scan line */}
                      <div className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#64A77A] to-transparent shadow-[0_0_8px_#64A77A] animate-scan-sweep" />

                      {/* Camera Corner Brackets */}
                      <div className="absolute top-2 left-2 w-3.5 h-3.5 border-t-2 border-l-2 border-[#174B38]" />
                      <div className="absolute top-2 right-2 w-3.5 h-3.5 border-t-2 border-r-2 border-[#174B38]" />
                      <div className="absolute bottom-2 left-2 w-3.5 h-3.5 border-b-2 border-l-2 border-[#174B38]" />
                      <div className="absolute bottom-2 right-2 w-3.5 h-3.5 border-b-2 border-r-2 border-[#174B38]" />

                      {/* Packaging simulation */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] font-bold uppercase tracking-wider text-[#174B38] bg-[#EEF8DC] px-2 py-0.5 rounded-md">
                            {activeMock.category}
                          </span>
                          <div className="flex gap-1">
                            {sampleProducts.map((_, i) => (
                              <button
                                key={i}
                                onClick={() => setActiveMockIndex(i)}
                                className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
                                  i === activeMockIndex ? 'bg-[#174B38] w-4' : 'bg-[#D4D6CB]'
                                }`}
                                title={`Sample ${i + 1}`}
                              />
                            ))}
                          </div>
                        </div>
                        <h4 className="font-['Plus_Jakarta_Sans',sans-serif] font-black text-sm text-[#202923] mt-1">
                          {activeMock.name}
                        </h4>
                        <p className="text-[10px] text-[#78837B] font-mono leading-relaxed line-clamp-3 bg-[#F8F8F2] p-2 rounded-xl border border-[#E6E7E0]">
                          {activeMock.ingredients}
                        </p>
                      </div>

                      {/* Live OCR detection chip */}
                      <div className="pt-2 flex items-center justify-between text-[10px]">
                        <span className="text-[#174B38] font-bold flex items-center gap-1">
                          <ScanLine className="w-3.5 h-3.5 text-[#174B38]" />
                          <span>4 INS codes extracted</span>
                        </span>
                        <span className="text-[#78837B] text-[9px]">Tap formulation dots above</span>
                      </div>
                    </div>

                    {/* Floating UI Elements */}
                    <div className="space-y-2">
                      <div className="p-2.5 bg-white rounded-2xl border border-[#E6E7E0] flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#202923]">
                          <ShieldCheck className="w-4 h-4 text-[#174B38] shrink-0" />
                          <span>Additives Isolated</span>
                        </div>
                        <div className="flex gap-1">
                          {activeMock.highlightAdditives.slice(0, 2).map((a, i) => (
                            <span key={i} className="bg-[#EEF8DC] text-[#174B38] text-[9px] font-bold px-2 py-0.5 rounded-md border border-[#D7EDB2]">
                              {a.split(' ')[0]}
                            </span>
                          ))}
                        </div>
                      </div>

                      {activeMock.allergen_statement ? (
                        <div className="p-2.5 bg-[#FDF3F2] rounded-2xl border border-[#F8CAC7] flex items-center justify-between gap-2">
                          <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#9B2C26]">
                            <AlertTriangle className="w-3.5 h-3.5 text-[#D95C55] shrink-0" />
                            <span className="truncate max-w-[200px]">{activeMock.allergen_statement}</span>
                          </div>
                          <span className="text-[8px] font-black uppercase text-[#9B2C26] bg-white px-1.5 py-0.5 rounded border border-[#F8CAC7]">
                            Flagged
                          </span>
                        </div>
                      ) : (
                        <div className="p-2.5 bg-[#EEF8DC] rounded-2xl border border-[#D7EDB2] flex items-center gap-1.5 text-[11px] font-bold text-[#174B38]">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#174B38] shrink-0" />
                          <span>No allergen flags matched</span>
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    {/* Safety Dossier Mode */}
                    <div className="space-y-2.5 bg-white p-3 rounded-2xl border border-[#E6E7E0]">
                      <div className="flex items-center justify-between border-b border-[#E6E7E0] pb-2">
                        <span className="text-[10px] font-bold text-[#78837B] uppercase tracking-wider">
                          Additive Dossier
                        </span>
                        <span className="text-[9px] font-bold text-[#174B38] bg-[#EEF8DC] px-2 py-0.5 rounded-md">
                          Grounded in Codex & FSSAI
                        </span>
                      </div>

                      <div className="space-y-1.5">
                        {activeMock.highlightAdditives.map((add, idx) => (
                          <div key={idx} className="p-2 rounded-xl bg-[#F8F8F2] border border-[#E6E7E0] text-[10px] flex items-center justify-between">
                            <span className="font-bold text-[#202923]">{add}</span>
                            <span className="text-[9px] text-[#78837B]">Verified Code</span>
                          </div>
                        ))}
                      </div>

                      <div className="p-2 bg-[#F8F8F2] rounded-xl border border-[#E6E7E0] text-[10px] flex items-center justify-between">
                        <span className="text-[#78837B]">Nutrition Calorie Density</span>
                        <strong className="text-[#174B38] font-bold">{activeMock.calories}</strong>
                      </div>
                    </div>
                  </>
                )}

                {/* Action button inside phone */}
                <button
                  onClick={() => handleTestSample(activeMock)}
                  className="w-full py-2.5 bg-[#174B38] hover:bg-[#0F3527] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer"
                >
                  <span>Evaluate Full Formulation</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#D7EDB2]" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Ambient Subtle Glow */}
        <div className="absolute -right-24 -bottom-24 w-96 h-96 bg-[#D7EDB2]/10 rounded-full blur-3xl pointer-events-none" />
      </section>

      {/* ==========================================================================
          1-CLICK INTERACTIVE SAMPLE FORMULATIONS
          ========================================================================== */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-[#174B38] font-bold text-xs uppercase tracking-wider mb-1">
              <Zap className="w-4 h-4 text-[#174B38]" />
              <span>Instant Interactive Demos</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black font-['Plus_Jakarta_Sans',sans-serif] text-[#174B38] tracking-tight">
              Test Real Formulations in 1-Click
            </h2>
          </div>
          <p className="text-xs text-[#78837B] max-w-md">
            Click any packaged product below to simulate an instant scan, analyze INS additive codes, and test the deterministic allergen engine:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {sampleProducts.map((p, idx) => (
            <div
              key={idx}
              className="bg-white p-7 rounded-3xl border border-[#E6E7E0] card-hover flex flex-col justify-between space-y-6 shadow-xs"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${p.badgeColor}`}>
                    {p.category}
                  </span>
                  <span className="text-xs font-bold text-[#174B38] bg-[#EEF8DC] px-2.5 py-1 rounded-lg border border-[#D7EDB2]">
                    {p.additivesCount}
                  </span>
                </div>

                <div>
                  <h3 className="font-['Plus_Jakarta_Sans',sans-serif] font-black text-xl text-[#202923] leading-snug">
                    {p.name}
                  </h3>
                </div>

                {/* Additive Highlight Chips */}
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-[#78837B] uppercase tracking-wider block">
                    Key Declared Additives:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {p.highlightAdditives.map((add, aIdx) => (
                      <span key={aIdx} className="bg-[#F8F8F2] text-[#174B38] text-xs font-semibold px-2.5 py-1 rounded-lg border border-[#E6E7E0]">
                        {add}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Nutrition Row */}
                <div className="flex items-center gap-3 text-xs text-[#78837B] pt-3 border-t border-[#E6E7E0]">
                  <span className="flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5 text-[#E5A33A]" />
                    <strong className="text-[#202923]">{p.calories}</strong>
                  </span>
                  <span className="text-[#E6E7E0]">•</span>
                  <span className="flex items-center gap-1">
                    <Activity className="w-3.5 h-3.5 text-[#174B38]" />
                    <strong className="text-[#202923]">{p.sodium}</strong> sodium
                  </span>
                </div>
              </div>

              <button
                onClick={() => handleTestSample(p)}
                className="w-full py-3.5 bg-[#174B38] hover:bg-[#0F3527] text-white text-xs font-['Plus_Jakarta_Sans',sans-serif] font-bold rounded-2xl flex items-center justify-center gap-2 transition-all duration-150 active:scale-95 shadow-xs cursor-pointer"
              >
                <span>Run Intelligence Analysis</span>
                <ArrowRight className="w-4 h-4 text-[#D7EDB2]" />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* ==========================================================================
          INTERACTIVE ADDITIVE DECRYPTER SANDBOX
          ========================================================================== */}
      <section className="bg-white p-8 sm:p-12 rounded-3xl border border-[#E6E7E0] shadow-xs space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-[#EEF8DC] px-3.5 py-1.5 rounded-full text-xs font-bold text-[#174B38] border border-[#D7EDB2] mb-2">
              <Sparkles className="w-3.5 h-3.5 text-[#174B38]" />
              <span>Live Ingredient Decrypter</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black font-['Plus_Jakarta_Sans',sans-serif] text-[#174B38] tracking-tight">
              Tap Any Additive to Reveal Its True Purpose
            </h2>
          </div>
          <p className="text-xs text-[#78837B] max-w-md">
            Click any common additive below to inspect why food companies add it, what global health authorities decree, and its natural whole-food alternative:
          </p>
        </div>

        {/* Additive Selector Chips */}
        <div className="flex flex-wrap gap-2.5">
          {decrypterAdditives.map((item, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedDecrypter(idx)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                selectedDecrypter === idx
                  ? 'bg-[#174B38] text-white shadow-md'
                  : 'bg-[#F8F8F2] hover:bg-[#EEF8DC] text-[#78837B] hover:text-[#174B38] border border-[#E6E7E0]'
              }`}
            >
              <span>{item.code}</span>
              <span className="text-[10px] opacity-80 hidden sm:inline font-normal">({item.name.split(' ')[0]})</span>
            </button>
          ))}
        </div>

        {/* Decrypted Dossier Card */}
        {(() => {
          const current = decrypterAdditives[selectedDecrypter];
          return (
            <div className="bg-[#F8F8F2] p-6 sm:p-8 rounded-3xl border border-[#E6E7E0] space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E6E7E0] pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black font-mono bg-[#174B38] text-white px-2.5 py-0.5 rounded-md">
                      {current.code}
                    </span>
                    <span className="text-xs font-semibold text-[#78837B]">
                      {current.category}
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black font-['Plus_Jakarta_Sans',sans-serif] text-[#202923] mt-1">
                    {current.name}
                  </h3>
                </div>
                <span className={`text-xs font-bold px-3 py-1 rounded-full border self-start sm:self-center ${current.statusColor}`}>
                  {current.status}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="bg-white p-4 rounded-2xl border border-[#E6E7E0] space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#174B38]">
                    Why Manufacturers Add It:
                  </span>
                  <p className="text-[#202923] leading-relaxed">
                    {current.whyAdded}
                  </p>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-[#E6E7E0] space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#174B38]">
                    Global Safety Consensus:
                  </span>
                  <p className="text-[#202923] leading-relaxed">
                    {current.safetyConsensus}
                  </p>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-[#E6E7E0] space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#78837B]">
                    Common Food Categories:
                  </span>
                  <p className="text-[#78837B] leading-relaxed">
                    {current.commonFoods}
                  </p>
                </div>

                <div className="bg-[#EEF8DC] p-4 rounded-2xl border border-[#D7EDB2] space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#174B38]">
                    Whole-Food Clean Alternative:
                  </span>
                  <p className="text-[#174B38] font-semibold leading-relaxed">
                    {current.wholeFoodAlt}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <span className="text-[11px] text-[#78837B]">
                  Want complete 7-section chemical breakdowns and scientific study references?
                </span>
                <button
                  onClick={() => navigate('/explore')}
                  className="text-xs font-bold text-[#174B38] hover:text-[#0F3527] flex items-center gap-1.5 underline cursor-pointer"
                >
                  <span>Explore in Full Ingredient Directory</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })()}
      </section>

      {/* ==========================================================================
          VISUAL 4-STEP ZERO-HALLUCINATION PIPELINE
          ========================================================================== */}
      <section className="bg-white p-8 sm:p-12 rounded-3xl border border-[#E6E7E0] shadow-xs space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#174B38] bg-[#EEF8DC] px-4 py-1.5 rounded-full border border-[#D7EDB2]">
            Zero-Hallucination Pipeline
          </span>
          <h2 className="text-2xl sm:text-3xl font-black font-['Plus_Jakarta_Sans',sans-serif] text-[#174B38]">
            How LifeLens Protects What You Eat
          </h2>
          <p className="text-xs sm:text-sm text-[#78837B] leading-relaxed">
            We bridge camera vision with deterministic food regulations before involving generative AI.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              step: '01',
              title: 'Capture or Upload',
              desc: 'Live camera with blur and contrast assessment, or upload an existing packaging photo.',
              icon: Camera
            },
            {
              step: '02',
              title: 'OCR Text Extraction',
              desc: 'Tesseract OCR isolates ingredient lists, allergen declarations, and nutrition panels.',
              icon: Search
            },
            {
              step: '03',
              title: 'User Verification',
              desc: 'Review and edit raw OCR text so unreadable words are never hallucinated or assumed.',
              icon: FileCheck2
            },
            {
              step: '04',
              title: 'Intelligence & Chat',
              desc: 'Deterministic allergen matching, 7-section chemical explainer, and 3-language conversational AI.',
              icon: Sparkles
            }
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-[#F8F8F2] p-6 rounded-2xl border border-[#E6E7E0] space-y-3 relative group hover:border-[#D7EDB2] hover:bg-white transition-all shadow-2xs"
              >
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-black font-['Plus_Jakarta_Sans',sans-serif] text-[#64A77A]/40 group-hover:text-[#174B38] transition-colors">
                    {item.step}
                  </span>
                  <div className="w-10 h-10 rounded-xl bg-white text-[#174B38] flex items-center justify-center border border-[#E6E7E0] shadow-2xs">
                    <Icon className="w-4 h-4 text-[#174B38]" />
                  </div>
                </div>
                <h4 className="font-['Plus_Jakarta_Sans',sans-serif] font-bold text-sm text-[#202923]">
                  {item.title}
                </h4>
                <p className="text-xs text-[#78837B] leading-relaxed">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ==========================================================================
          DEEP CAPABILITIES GRID
          ========================================================================== */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-7 rounded-3xl border border-[#E6E7E0] space-y-3 shadow-xs card-hover">
          <div className="w-11 h-11 rounded-2xl bg-[#EEF8DC] flex items-center justify-center border border-[#D7EDB2]">
            <ShieldAlert className="w-5 h-5 text-[#174B38]" />
          </div>
          <h3 className="font-['Plus_Jakarta_Sans',sans-serif] font-bold text-lg text-[#202923]">
            Deterministic Allergen Engine
          </h3>
          <p className="text-xs text-[#78837B] leading-relaxed">
            Evaluates nested parentheticals, synonyms, and Indian terms (e.g. <em>Maida</em>, <em>Badam</em>, <em>Kaju</em>, <em>Anda</em>) against your personal profile. Distinguishes 4 exact regulatory states: Matched, Precautionary Warning, No Listed Match, and Unable to Verify.
          </p>
        </div>

        <div className="bg-white p-7 rounded-3xl border border-[#E6E7E0] space-y-3 shadow-xs card-hover">
          <div className="w-11 h-11 rounded-2xl bg-[#EEF8DC] flex items-center justify-center border border-[#D7EDB2]">
            <BookOpen className="w-5 h-5 text-[#174B38]" />
          </div>
          <h3 className="font-['Plus_Jakarta_Sans',sans-serif] font-bold text-lg text-[#202923]">
            7-Section Chemical Explainer
          </h3>
          <p className="text-xs text-[#78837B] leading-relaxed">
            Unpack any food chemical (e.g. <em>INS 621</em>, <em>INS 319</em>, <em>INS 211</em>) into 7 clear sections: Short Answer, What It Is, Why Added, Evidence, Concerns, What We Don&apos;t Know, and Sources.
          </p>
        </div>

        <div className="bg-white p-7 rounded-3xl border border-[#E6E7E0] space-y-3 shadow-xs card-hover">
          <div className="w-11 h-11 rounded-2xl bg-[#EEF8DC] flex items-center justify-center border border-[#D7EDB2]">
            <Sparkles className="w-5 h-5 text-[#174B38]" />
          </div>
          <h3 className="font-['Plus_Jakarta_Sans',sans-serif] font-bold text-lg text-[#202923]">
            3-Language Voice & AI Chat
          </h3>
          <p className="text-xs text-[#78837B] leading-relaxed">
            Converse via voice or text in <strong>English</strong>, <strong>हिन्दी</strong>, or <strong>తెలుగు</strong>. Audio responses use native device speech synthesis with zero voice recordings retained.
          </p>
        </div>
      </section>

      {/* ==========================================================================
          SCIENTIFIC GROUNDING & INTEGRITY CHECKLIST
          ========================================================================== */}
      <section className="bg-white p-8 sm:p-10 rounded-3xl border border-[#E6E7E0] space-y-6 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#174B38] text-white flex items-center justify-center shadow-xs">
            <ShieldCheck className="w-5 h-5 text-[#D7EDB2]" />
          </div>
          <div>
            <h3 className="font-['Plus_Jakarta_Sans',sans-serif] font-bold text-lg text-[#174B38]">
              Scientific Grounding & Integrity Standards
            </h3>
            <p className="text-xs text-[#78837B]">
              Strict algorithmic boundaries preventing generative hallucinations
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-[#78837B]">
          <div className="space-y-3 bg-[#F8F8F2] p-5 rounded-2xl border border-[#E6E7E0]">
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#174B38] shrink-0 mt-0.5" />
              <span>Preserves scientific INS/E-numbers and exact chemical identities across all languages.</span>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#174B38] shrink-0 mt-0.5" />
              <span>Distinguishes sodium from salt (2.5× conversion) and total sugars from added sugars.</span>
            </div>
          </div>

          <div className="space-y-3 bg-[#F8F8F2] p-5 rounded-2xl border border-[#E6E7E0]">
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#174B38] shrink-0 mt-0.5" />
              <span>Never labels synthetic ingredients toxic without peer-reviewed scientific consensus.</span>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#174B38] shrink-0 mt-0.5" />
              <span>Never diagnoses medical diseases, prescribes diets, or invents Acceptable Daily Intakes.</span>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================================================
          INTERACTIVE FAQ ACCORDION SECTION
          ========================================================================== */}
      <section className="bg-white p-8 sm:p-12 rounded-3xl border border-[#E6E7E0] shadow-xs space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-2 bg-[#EEF8DC] px-3.5 py-1.5 rounded-full text-xs font-bold text-[#174B38] border border-[#D7EDB2]">
            <HelpCircle className="w-3.5 h-3.5 text-[#174B38]" />
            <span>Answers & Clarity</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black font-['Plus_Jakarta_Sans',sans-serif] text-[#174B38]">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-[#78837B]">
            Evidence-based answers to how our food intelligence and allergen verification algorithms function.
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="border border-[#E6E7E0] rounded-2xl overflow-hidden transition-all bg-[#F8F8F2]"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-sm text-[#202923] hover:text-[#174B38] cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-[#78837B] shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180 text-[#174B38]' : ''}`} />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs text-[#78837B] leading-relaxed border-t border-[#E6E7E0]/60 bg-white">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ==========================================================================
          BOTTOM HIGH-IMPACT CTA BANNER
          ========================================================================== */}
      <section className="relative overflow-hidden rounded-3xl bg-[#174B38] text-white p-8 sm:p-14 shadow-xl border border-[#216149] text-center space-y-6">
        <div className="relative z-10 max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-[#D7EDB2] bg-[#EEF8DC]/15 px-3.5 py-1.5 rounded-full border border-[#D7EDB2]/25 inline-block">
            Start Understanding Your Food Today
          </span>
          <h2 className="text-3xl sm:text-4xl font-black font-['Plus_Jakarta_Sans',sans-serif] text-white tracking-tight">
            Ready to decode what you eat?
          </h2>
          <p className="text-xs sm:text-sm text-[#D7EDB2]/90 leading-relaxed font-normal">
            Take a picture of any packaging label or barcode to uncover hidden additives, allergens, and salt/sugar metrics with zero hallucinations.
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => navigate('/scan')}
              className="bg-[#D7EDB2] hover:bg-[#EEF8DC] text-[#174B38] font-['Plus_Jakarta_Sans',sans-serif] font-bold text-sm px-8 py-4 rounded-2xl shadow-md transition-all duration-150 active:scale-95 cursor-pointer flex items-center gap-2"
            >
              <Camera className="w-5 h-5 text-[#174B38]" />
              <span>Launch SmartScan</span>
            </button>
            <button
              onClick={() => navigate('/chat')}
              className="bg-white/10 hover:bg-white/15 text-white font-semibold text-sm px-7 py-4 rounded-2xl border border-white/20 transition-all cursor-pointer flex items-center gap-2"
            >
              <MessageSquare className="w-4 h-4 text-[#D7EDB2]" />
              <span>Ask AI Food Assistant</span>
            </button>
          </div>
        </div>

        {/* Ambient subtle decorative background circles */}
        <div className="absolute -left-12 -top-12 w-64 h-64 bg-[#D7EDB2]/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-[#64A77A]/10 rounded-full blur-2xl pointer-events-none" />
      </section>

    </div>
  );
};
