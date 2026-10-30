import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldAlert,
  AlertTriangle,
  CheckCircle,
  HelpCircle,
  Volume2,
  MessageSquare,
  Sparkles,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Info,
  BookOpen,
  Filter,
  Flame,
  Activity,
  ArrowRight,
  Settings,
  Scale
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ResultsPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    activeAnalysis,
    language,
    speak,
    stopSpeaking,
    isSpeaking,
    setCurrentProductContext
  } = useApp();

  const [expandedAdditives, setExpandedAdditives] = useState<Record<number, boolean>>({});
  const [ingredientFilter, setIngredientFilter] = useState<'all' | 'additives' | 'whole'>('all');
  const [servingUnit, setServingUnit] = useState<'serving' | '100g'>('serving');

  if (!activeAnalysis) {
    return (
      <div className="bg-white p-12 rounded-3xl border border-[#E6E7E0] text-center space-y-4 max-w-xl mx-auto mt-8 shadow-xs">
        <Info className="w-12 h-12 text-[#174B38] mx-auto shrink-0" />
        <h2 className="font-['Plus_Jakarta_Sans',sans-serif] font-black text-2xl text-[#174B38]">
          No Active Scan Record
        </h2>
        <p className="text-xs text-[#78837B]">
          Capture or upload a packaged food label first to generate an ingredient intelligence report.
        </p>
        <button
          onClick={() => navigate('/scan')}
          className="btn-primary"
        >
          Go to SmartScan
        </button>
      </div>
    );
  }

  const {
    product_name,
    overall_status,
    allergen_analysis,
    nutrition_analysis,
    ingredient_intelligence,
    short_summary,
    disclaimer
  } = activeAnalysis;

  const toggleAdditive = (idx: number) => {
    setExpandedAdditives((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const statusConfig = {
    POTENTIAL_ALLERGEN_DETECTED: {
      bg: 'bg-[#FDF3F2] border-[#F8CAC7] text-[#9B2C26]',
      icon: ShieldAlert,
      label: 'Potential Allergen Detected',
      subtext: 'Direct ingredient match found in declared components or known derivatives against your profile.'
    },
    PRECAUTIONARY_WARNING: {
      bg: 'bg-[#FEF8ED] border-[#F9DEAA] text-[#966114]',
      icon: AlertTriangle,
      label: 'Precautionary Cross-Contact Warning',
      subtext: 'Packaging indicates shared facility or equipment cross-contamination risk.'
    },
    NO_LISTED_MATCH_FOUND: {
      bg: 'bg-[#EEF8DC] border-[#D7EDB2] text-[#174B38]',
      icon: CheckCircle,
      label: 'No Listed Match Found',
      subtext: 'No matching allergens in declared ingredients. (Always inspect physical packaging).'
    },
    UNABLE_TO_VERIFY: {
      bg: 'bg-[#F5F3FF] border-[#DDD6FE] text-[#5B21B6]',
      icon: HelpCircle,
      label: 'Unable to Conclusively Verify',
      subtext: 'Text was partially obscured or unreadable. Inspect physical packaging.'
    }
  };

  const currentStatus = statusConfig[overall_status] || statusConfig.UNABLE_TO_VERIFY;
  const StatusIcon = currentStatus.icon;

  const handleReadAloud = () => {
    if (isSpeaking) {
      stopSpeaking();
    } else {
      const readText = `${product_name}. ${short_summary || ''}. Overall Status: ${currentStatus.label}.`;
      speak(readText);
    }
  };

  const handleAskAI = (contextQuery?: string) => {
    setCurrentProductContext({
      product_name,
      ingredients: activeAnalysis.extracted_ingredients,
      allergen_statement: activeAnalysis.extracted_allergen_statement,
      nutrition: nutrition_analysis?.nutrients || {}
    });
    navigate('/chat');
  };

  // Filter ingredients
  const filteredIngredients = ingredient_intelligence?.parsed_ingredients.filter((item) => {
    if (ingredientFilter === 'additives') return item.is_additive;
    if (ingredientFilter === 'whole') return !item.is_additive;
    return true;
  }) || [];

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20 animate-fade-in">
      
      {/* 5. INGREDIENT ANALYSIS DASHBOARD HEADER */}
      <div className="bg-white p-7 sm:p-10 rounded-3xl border border-[#E6E7E0] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#174B38] bg-[#EEF8DC] px-2.5 py-0.5 rounded-full border border-[#D7EDB2]">
              Verified Analysis
            </span>
            <span className="text-[10px] text-[#78837B] font-mono">
              Scan ID: {activeAnalysis.scan_id?.slice(0, 8)}
            </span>
          </div>

          <span className="text-xs font-bold text-[#78837B] uppercase tracking-wider block">
            Your Food Analysis
          </span>
          <h1 className="text-2xl sm:text-3xl font-black font-['Plus_Jakarta_Sans',sans-serif] text-[#174B38] tracking-tight">
            {product_name}
          </h1>
          <p className="text-xs text-[#78837B]">
            Grounded in physical label declaration & official food safety authorities.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Read Aloud Button */}
          <button
            onClick={handleReadAloud}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold border transition-all flex items-center gap-2 cursor-pointer ${
              isSpeaking
                ? 'bg-[#D95C55] text-white border-transparent shadow-xs'
                : 'bg-[#F8F8F2] hover:bg-[#EEF8DC] text-[#174B38] border-[#E6E7E0]'
            }`}
          >
            {isSpeaking ? (
              <>
                <div className="flex items-center gap-0.5 mr-1">
                  <span className="sound-bar !bg-white" />
                  <span className="sound-bar !bg-white" />
                  <span className="sound-bar !bg-white" />
                </div>
                <span>Stop Audio</span>
              </>
            ) : (
              <>
                <Volume2 className="w-4 h-4 text-[#174B38] shrink-0" />
                <span>Read Aloud</span>
              </>
            )}
          </button>

          <button
            onClick={() => handleAskAI()}
            className="btn-primary !py-2.5 !px-4 !text-xs !rounded-2xl"
          >
            <MessageSquare className="w-4 h-4 text-[#D7EDB2] shrink-0" />
            <span>Ask AI About This</span>
          </button>
        </div>
      </div>

      {/* PROMINENT AI SUMMARY PANEL: "Here's what you should know" */}
      {short_summary && (
        <div className="bg-[#EEF8DC]/60 border border-[#D7EDB2] p-7 rounded-3xl shadow-xs space-y-2">
          <div className="flex items-center gap-2 text-[#174B38] font-['Plus_Jakarta_Sans',sans-serif] font-bold text-sm">
            <Sparkles className="w-4 h-4 text-[#174B38] shrink-0" />
            <span>Here&apos;s what you should know:</span>
          </div>
          <p className="text-xs sm:text-sm text-[#202923] leading-relaxed">
            {short_summary}
          </p>
        </div>
      )}

      {/* 6. ALLERGEN SHIELD SAFETY PANEL */}
      <section className="space-y-4">
        <div className={`p-6 rounded-3xl border ${currentStatus.bg} shadow-xs space-y-2`}>
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-3 font-['Plus_Jakarta_Sans',sans-serif] font-black text-lg">
              <StatusIcon className="w-6 h-6 shrink-0" />
              <span>{currentStatus.label}</span>
            </div>
            <button
              onClick={() => navigate('/settings')}
              className="text-xs font-bold underline hover:opacity-80 flex items-center gap-1 cursor-pointer"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Edit Allergy Profile</span>
            </button>
          </div>
          <p className="text-xs sm:text-sm opacity-90 pl-9 leading-relaxed">
            {currentStatus.subtext}
          </p>
        </div>

        {/* Detailed Allergen Matches */}
        {allergen_analysis && allergen_analysis.matches.length > 0 && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E6E7E0] shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5 text-[#174B38] font-['Plus_Jakarta_Sans',sans-serif] font-bold text-base">
                <ShieldAlert className="w-5 h-5 text-[#D95C55] shrink-0" />
                <span>Allergen Evidence & Profile Findings</span>
              </div>
              <span className="text-xs text-[#78837B] font-mono">
                {allergen_analysis.matches.length} flags evaluated
              </span>
            </div>

            <div className="space-y-3">
              {allergen_analysis.matches.map((match, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl border border-[#E6E7E0] bg-[#F8F8F2] space-y-2 card-hover"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-['Plus_Jakarta_Sans',sans-serif] font-bold text-sm text-[#202923]">
                      {match.allergen_name}
                    </span>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                        match.status === 'POTENTIAL_ALLERGEN_DETECTED'
                          ? 'bg-[#FDF3F2] text-[#9B2C26] border-[#F8CAC7]'
                          : 'bg-[#FEF8ED] text-[#966114] border-[#F9DEAA]'
                      }`}
                    >
                      {match.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <p className="text-xs text-[#78837B]">{match.reason}</p>

                  {match.evidence.length > 0 && (
                    <div className="text-[11px] bg-white p-2.5 rounded-xl border border-[#E6E7E0] text-[#78837B] flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-[#202923]">Matched Keyword:</span>
                      {match.evidence.map((ev, i) => (
                        <span key={i} className="font-mono text-[#174B38] bg-[#EEF8DC] px-2 py-0.5 rounded-md border border-[#D7EDB2]">
                          &quot;{ev.matched_term || ev.precautionary_phrase}&quot; ({ev.match_type})
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* INGREDIENT INTELLIGENCE SECTION */}
      {ingredient_intelligence && (
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-['Plus_Jakarta_Sans',sans-serif] font-bold text-[#174B38] flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-[#174B38] shrink-0" />
                <span>Ingredient Cards ({ingredient_intelligence.total_ingredients} Listed)</span>
              </h2>
              <p className="text-xs text-[#78837B]">
                {ingredient_intelligence.additives_count} functional additives identified with verified regulatory records.
              </p>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 bg-white p-1 rounded-2xl border border-[#E6E7E0] self-start sm:self-center shadow-2xs">
              <button
                onClick={() => setIngredientFilter('all')}
                className={`px-3 py-1 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                  ingredientFilter === 'all'
                    ? 'bg-[#174B38] text-white shadow-2xs'
                    : 'text-[#78837B] hover:text-[#202923]'
                }`}
              >
                All ({ingredient_intelligence.total_ingredients})
              </button>
              <button
                onClick={() => setIngredientFilter('additives')}
                className={`px-3 py-1 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                  ingredientFilter === 'additives'
                    ? 'bg-[#174B38] text-white shadow-2xs'
                    : 'text-[#78837B] hover:text-[#174B38]'
                }`}
              >
                Additives ({ingredient_intelligence.additives_count})
              </button>
              <button
                onClick={() => setIngredientFilter('whole')}
                className={`px-3 py-1 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                  ingredientFilter === 'whole'
                    ? 'bg-[#174B38] text-white shadow-2xs'
                    : 'text-[#78837B] hover:text-[#174B38]'
                }`}
              >
                Whole Ingredients
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {filteredIngredients.map((item, idx) => {
              const isExpanded = expandedAdditives[idx];
              return (
                <div
                  key={idx}
                  className={`bg-white rounded-3xl border transition-all p-5 sm:p-6 space-y-3.5 card-hover ${
                    item.is_additive
                      ? 'border-[#D7EDB2] bg-gradient-to-b from-white to-[#EEF8DC]/20'
                      : 'border-[#E6E7E0]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-['Plus_Jakarta_Sans',sans-serif] font-bold text-base text-[#202923]">
                          {item.normalized_name}
                        </h3>
                        {item.ins_number && (
                          <span className="bg-[#174B38] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                            {item.ins_number}
                          </span>
                        )}
                        <span className="bg-[#EEF8DC] text-[#174B38] text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-[#D7EDB2]">
                          {item.category}
                        </span>
                      </div>
                      <p className="text-xs text-[#78837B] leading-relaxed pt-0.5">
                        <strong className="text-[#174B38]">Why Added: </strong>
                        {item.why_added}
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => handleAskAI(item.normalized_name)}
                        className="p-2 rounded-xl text-xs font-bold bg-[#F8F8F2] hover:bg-[#EEF8DC] text-[#174B38] border border-[#E6E7E0] transition-colors cursor-pointer"
                        title={`Ask AI about ${item.normalized_name}`}
                      >
                        <MessageSquare className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => toggleAdditive(idx)}
                        className="p-2 rounded-xl hover:bg-[#F8F8F2] text-[#78837B] hover:text-[#202923] transition-colors cursor-pointer"
                        title="Expand scientific breakdown"
                      >
                        {isExpanded ? <ChevronUp className="w-5 h-5 shrink-0" /> : <ChevronDown className="w-5 h-5 shrink-0" />}
                      </button>
                    </div>
                  </div>

                  {/* Expanded 7-Section Drawer */}
                  {isExpanded && (
                    <div className="pt-3 border-t border-[#E6E7E0] space-y-2.5 text-xs text-[#78837B] animate-fade-in bg-[#F8F8F2] p-4 rounded-2xl">
                      <div>
                        <span className="font-bold text-[#174B38] block">Technical Function:</span>
                        <span className="text-[#202923]">{item.technical_function}</span>
                      </div>
                      <div>
                        <span className="font-bold text-[#174B38] block">What Available Research Says:</span>
                        <span className="text-[#202923]">{item.safety_assessment}</span>
                      </div>
                      <div>
                        <span className="font-bold text-[#966114] block">Evidence & Potential Concerns:</span>
                        <span className="text-[#78350F]">{item.evidence_concerns}</span>
                      </div>
                      <div>
                        <span className="font-bold text-[#78837B] block">What We Do Not Know (Limitations):</span>
                        <span className="text-[#202923]">{item.what_we_do_not_know}</span>
                      </div>

                      {item.sources && item.sources.length > 0 && (
                        <div className="pt-2 border-t border-[#E6E7E0]">
                          <span className="font-bold text-[#174B38] block mb-1">Authoritative Citations:</span>
                          <div className="space-y-1">
                            {item.sources.map((src, sIdx) => (
                              <div key={sIdx} className="flex items-center gap-1.5 text-[11px] text-[#174B38]">
                                <span>• {src.title} ({src.publisher || 'FSSAI/WHO'})</span>
                                {src.url && (
                                  <a
                                    href={src.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="hover:underline inline-flex items-center ml-1 text-[#64A77A]"
                                  >
                                    <ExternalLink className="w-3 h-3 shrink-0" />
                                  </a>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* 9. NUTRITION LENS FACTS */}
      {nutrition_analysis && Object.keys(nutrition_analysis.nutrients).length > 0 && (
        <section className="bg-white p-7 sm:p-10 rounded-3xl border border-[#E6E7E0] shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-[#174B38] font-['Plus_Jakarta_Sans',sans-serif] font-bold text-lg">
              <Sparkles className="w-5 h-5 text-[#174B38] shrink-0" />
              <span>Nutrition Lens Facts</span>
            </div>
            <div className="flex items-center gap-1 bg-[#F8F8F2] p-1 rounded-xl border border-[#E6E7E0] text-xs font-semibold">
              <button
                onClick={() => setServingUnit('serving')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  servingUnit === 'serving' ? 'bg-[#174B38] text-white' : 'text-[#78837B]'
                }`}
              >
                Per Serving
              </button>
              <button
                onClick={() => setServingUnit('100g')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  servingUnit === '100g' ? 'bg-[#174B38] text-white' : 'text-[#78837B]'
                }`}
              >
                Per 100g / ml
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            {Object.entries(nutrition_analysis.nutrients).map(([key, info]: [string, any], idx) => {
              if (info.status === 'unknown') return null;
              return (
                <div key={idx} className="p-4 bg-[#F8F8F2] rounded-2xl border border-[#E6E7E0] space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#78837B] block">
                    {key.replace(/_/g, ' ')}
                  </span>
                  <span className="text-lg font-black font-['Plus_Jakarta_Sans',sans-serif] text-[#174B38] block">
                    {info.value} {info.unit}
                  </span>
                  {info.equivalent_salt_g && (
                    <span className="text-[10px] text-[#174B38] block font-semibold">
                      ≈ {info.equivalent_salt_g}g table salt (2.5×)
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Safety & Medical Disclaimer Note */}
      <div className="p-5 bg-[#F8F8F2] rounded-3xl border border-[#E6E7E0] text-xs text-[#78837B] leading-relaxed flex items-start gap-3">
        <Info className="w-5 h-5 text-[#174B38] shrink-0 mt-0.5" />
        <span>{disclaimer}</span>
      </div>
    </div>
  );
};
