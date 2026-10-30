import React, { useState } from 'react';
import {
  Search,
  BookOpen,
  AlertCircle,
  ExternalLink,
  Sparkles,
  Zap,
  Info,
  ShieldCheck,
  CheckCircle2,
  Filter,
  History
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { explainChemical } from '../services/api';
import { ChemicalExplainerResult } from '../types';

export const IngredientExplorerPage: React.FC = () => {
  const { language } = useApp();
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<ChemicalExplainerResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState('All');
  const [recentExplored, setRecentExplored] = useState<string[]>(['INS 621', 'INS 319', 'INS 955']);

  const categories = [
    'All',
    'Flavour Enhancers',
    'Antioxidants',
    'Preservatives',
    'Sweeteners',
    'Acidity Regulators',
    'Emulsifiers & Thickeners',
    'Colours'
  ];

  const quickChips = [
    { label: 'INS 621 (MSG)', query: '621', category: 'Flavour Enhancers' },
    { label: 'INS 319 (TBHQ)', query: '319', category: 'Antioxidants' },
    { label: 'INS 211 (Sodium Benzoate)', query: '211', category: 'Preservatives' },
    { label: 'INS 202 (Potassium Sorbate)', query: '202', category: 'Preservatives' },
    { label: 'INS 330 (Citric Acid)', query: '330', category: 'Acidity Regulators' },
    { label: 'INS 331 (Sodium Citrates)', query: '331', category: 'Acidity Regulators' },
    { label: 'INS 102 (Tartrazine)', query: '102', category: 'Colours' },
    { label: 'INS 110 (Sunset Yellow)', query: '110', category: 'Colours' },
    { label: 'INS 955 (Sucralose)', query: '955', category: 'Sweeteners' },
    { label: 'INS 950 (Acesulfame K)', query: '950', category: 'Sweeteners' },
    { label: 'INS 322 (Lecithin)', query: '322', category: 'Emulsifiers & Thickeners' },
    { label: 'INS 412 (Guar Gum)', query: '412', category: 'Emulsifiers & Thickeners' },
    { label: 'INS 500 (Baking Soda)', query: '500', category: 'Acidity Regulators' },
    { label: 'INS 501 (Potassium Carbonate)', query: '501', category: 'Acidity Regulators' },
    { label: 'Palm Oil', query: 'palm oil', category: 'All' },
    { label: 'Caffeine', query: 'caffeine', category: 'All' },
  ];

  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const data = await explainChemical(searchQuery, language);
      setResult(data);
      const nameStr = data.name;
      if (data.found && nameStr) {
        setRecentExplored((prev) => Array.from(new Set([nameStr, ...prev])).slice(0, 5));
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to fetch explanation. Ensure the backend is reachable.');
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(query);
  };

  const filteredChips = activeCategoryFilter === 'All'
    ? quickChips
    : quickChips.filter(c => c.category === activeCategoryFilter);

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20 animate-fade-in">

      {/* 8. INGREDIENT EXPLORER SEARCH HEADER */}
      <div className="bg-white p-7 sm:p-10 rounded-3xl border border-[#E6E7E0] shadow-xs space-y-6">
        <div className="max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-2 bg-[#EEF8DC] px-3.5 py-1.5 rounded-full text-xs font-bold text-[#174B38] border border-[#D7EDB2]">
            <BookOpen className="w-3.5 h-3.5 text-[#174B38] shrink-0" />
            <span>Searchable Ingredient Research</span>
          </div>
          <h1 className="text-3xl font-black font-['Plus_Jakarta_Sans',sans-serif] text-[#174B38] tracking-tight">
            Ingredient Explorer
          </h1>
          <p className="text-xs sm:text-sm text-[#78837B] leading-relaxed">
            Search any food additive by ingredient name, INS number (e.g. 621, 319), or E-number to unpack technical functions and safety evaluations from <strong>FSSAI</strong>, <strong>WHO/JECFA</strong>, and <strong>EFSA</strong>.
          </p>
        </div>

        {/* Search Bar Input */}
        <form onSubmit={onSubmit} className="relative">
          <div className="relative flex items-center">
            <Search className="w-5 h-5 text-[#78837B] absolute left-4 pointer-events-none shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, INS number (e.g. 621, 319), or E-number (e.g. E322)..."
              className="w-full pl-12 pr-28 py-4 text-sm rounded-2xl border border-[#E6E7E0] bg-[#F8F8F2] focus:outline-none focus:border-[#174B38] shadow-inner transition-colors"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="absolute right-2 bg-[#174B38] hover:bg-[#0F3527] text-white font-['Plus_Jakarta_Sans',sans-serif] font-bold text-xs px-6 py-2.5 rounded-xl shadow-xs transition-all active:scale-95 cursor-pointer"
            >
              <span>Explain</span>
            </button>
          </div>
        </form>

        {/* Category Filters */}
        <div className="space-y-3 pt-1">
          <div className="flex items-center gap-2 text-xs font-bold text-[#78837B] uppercase tracking-wider">
            <Filter className="w-3.5 h-3.5 text-[#174B38] shrink-0" />
            <span>Filter Additives by Category:</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategoryFilter(cat)}
                className={`text-xs px-3 py-1.5 rounded-xl font-semibold transition-all cursor-pointer ${activeCategoryFilter === cat
                  ? 'bg-[#174B38] text-white shadow-2xs'
                  : 'bg-[#F8F8F2] text-[#78837B] hover:bg-[#EEF8DC] hover:text-[#174B38]'
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Suggestion Chips */}
        <div className="space-y-2 pt-1 border-t border-[#E6E7E0]">
          <span className="text-[11px] font-bold text-[#78837B] uppercase tracking-wider block">
            Popular Food Additives to Explore:
          </span>
          <div className="flex flex-wrap gap-2">
            {filteredChips.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setQuery(chip.query);
                  handleSearch(chip.query);
                }}
                className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-[#F8F8F2] hover:bg-[#EEF8DC] hover:text-[#174B38] text-[#78837B] border border-[#E6E7E0] transition-all card-hover cursor-pointer"
              >
                <span>{chip.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Recently Explored */}
        {recentExplored.length > 0 && (
          <div className="flex items-center gap-2 text-xs text-[#78837B] pt-1">
            <History className="w-3.5 h-3.5 text-[#174B38] shrink-0" />
            <span>Recently explored:</span>
            <div className="flex flex-wrap gap-1.5">
              {recentExplored.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setQuery(item);
                    handleSearch(item);
                  }}
                  className="underline hover:text-[#174B38] cursor-pointer"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="p-10 text-center bg-white rounded-3xl border border-[#E6E7E0] shadow-xs space-y-3">
          <div className="w-10 h-10 border-4 border-[#EEF8DC] border-t-[#174B38] rounded-full animate-spin mx-auto" />
          <p className="text-xs text-[#78837B]">Retrieving verified regulatory dossiers...</p>
        </div>
      )}

      {/* Error State */}
      {errorMsg && (
        <div className="bg-[#FDF3F2] border border-[#F8CAC7] text-[#9B2C26] p-4 rounded-2xl text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-[#D95C55]" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Not Found State */}
      {result && !result.found && (
        <div className="bg-white p-8 sm:p-10 rounded-3xl border border-[#E6E7E0] text-center space-y-3 shadow-xs">
          <AlertCircle className="w-10 h-10 text-[#E5A33A] mx-auto opacity-80" />
          <h3 className="font-['Plus_Jakarta_Sans',sans-serif] font-bold text-lg text-[#202923]">{result.message}</h3>
          <p className="text-xs text-[#78837B] max-w-md mx-auto leading-relaxed">{result.guidance}</p>
        </div>
      )}

      {/* 6-SECTION ELEGANT INGREDIENT INFORMATION PAGE */}
      {result && result.found && (
        <div className="bg-white rounded-3xl border border-[#E6E7E0] shadow-xs p-7 sm:p-10 space-y-7 animate-fade-in">
          {/* Header */}
          <div className="border-b border-[#E6E7E0] pb-5 space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="bg-[#174B38] text-white text-[11px] font-bold px-3 py-1 rounded-full">
                {result.ins_number || 'Regulated Additive'}
              </span>
              <span className="bg-[#EEF8DC] text-[#174B38] text-[11px] font-bold px-3 py-1 rounded-full border border-[#D7EDB2]">
                {result.category}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black font-['Plus_Jakarta_Sans',sans-serif] text-[#174B38] tracking-tight">
              {result.name}
            </h2>
          </div>

          {/* Section 1: What is it? */}
          <div className="space-y-1.5 p-5 rounded-2xl bg-[#F8F8F2] border border-[#E6E7E0]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#174B38] block">
              1. What is it?
            </span>
            <p className="text-xs sm:text-sm text-[#202923] leading-relaxed">
              {result.what_it_is}
            </p>
          </div>

          {/* Section 2: Why is it added? */}
          <div className="space-y-1.5 p-5 rounded-2xl bg-[#F8F8F2] border border-[#E6E7E0]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#174B38] block">
              2. Why is it added?
            </span>
            <p className="text-xs sm:text-sm text-[#202923] leading-relaxed">
              {result.why_it_is_added}
            </p>
          </div>

          {/* Section 3: Where is it commonly used? */}
          <div className="space-y-1.5 p-5 rounded-2xl bg-[#F8F8F2] border border-[#E6E7E0]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#174B38] block">
              3. Where is it commonly used?
            </span>
            <p className="text-xs sm:text-sm text-[#202923] leading-relaxed">
              Commonly utilized in packaged processed foods requiring {result.category?.toLowerCase() || 'technological functional properties'} such as savory snacks, confectionery, baked goods, beverages, or seasonings.
            </p>
          </div>

          {/* Section 4: What does the evidence say? */}
          <div className="space-y-1.5 p-5 rounded-2xl bg-[#EEF8DC] border border-[#D7EDB2]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#174B38] block">
              4. What does the evidence say? (FSSAI / WHO / EFSA / FDA)
            </span>
            <p className="text-xs sm:text-sm text-[#202923] leading-relaxed">
              {result.what_the_evidence_says}
            </p>
          </div>

          {/* Section 5: What are the limitations & concerns? */}
          <div className="space-y-1.5 p-5 rounded-2xl bg-[#FEF8ED] border border-[#F9DEAA]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#966114] block">
              5. What are the limitations & potential concerns?
            </span>
            <p className="text-xs sm:text-sm text-[#78350F] leading-relaxed">
              {result.potential_concerns || result.what_we_do_not_know}
            </p>
          </div>

          {/* Section 6: Sources */}
          {result.sources && result.sources.length > 0 && (
            <div className="pt-4 border-t border-[#E6E7E0] space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#174B38] block">
                6. Sources & Regulatory Citations
              </span>
              <div className="space-y-1.5">
                {result.sources.map((src, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-[#174B38]">
                    <span>• {src.title} ({src.publisher}, {src.year || 'Official'})</span>
                    {src.url && (
                      <a
                        href={src.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center hover:underline text-[#64A77A]"
                      >
                        <ExternalLink className="w-3.5 h-3.5 ml-1 shrink-0" />
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
};
