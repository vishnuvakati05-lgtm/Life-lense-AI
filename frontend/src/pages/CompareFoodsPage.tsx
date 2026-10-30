import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Scale,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  ArrowLeftRight,
  Flame,
  Activity,
  Layers,
  Info
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { analyzeLabelData } from '../services/api';

export const CompareFoodsPage: React.FC = () => {
  const navigate = useNavigate();
  const { language, setActiveAnalysis, setCurrentProductContext } = useApp();

  const presets = [
    {
      label: 'Rolled Oats vs Instant Noodles',
      itemA: {
        name: 'Whole Grain Rolled Oats',
        badge: 'Single Ingredient',
        badgeColor: 'bg-[#EEF8DC] text-[#174B38] border-[#D7EDB2]',
        calories: 389,
        sugar: 1.0,
        addedSugar: 0.0,
        satFat: 1.2,
        sodium: 2,
        protein: 13.5,
        fibre: 10.1,
        additivesCount: 0,
        additivesList: 'None (100% Whole Rolled Oats)',
        allergens: 'Oats (May contain traces of wheat gluten)',
        ingredients: '100% Whole Grain Rolled Oats.'
      },
      itemB: {
        name: 'Instant Masala Noodles',
        badge: 'Ultra-Processed',
        badgeColor: 'bg-[#FEF8ED] text-[#966114] border-[#F9DEAA]',
        calories: 427,
        sugar: 2.1,
        addedSugar: 1.5,
        satFat: 6.8,
        sodium: 1020,
        protein: 8.0,
        fibre: 2.5,
        additivesCount: 4,
        additivesList: 'INS 621 (MSG), INS 319 (TBHQ), INS 412, INS 500',
        allergens: 'Wheat (Gluten), Soy, Mustard',
        ingredients: 'Wheat Flour (Maida), Palm Oil, Salt, Wheat Gluten, Thickener (INS 412), Acidity Regulators [INS 501(i), INS 500(i)], Flavour Enhancer (INS 621), Antioxidant (INS 319).'
      }
    },
    {
      label: 'Bakery Cookies vs Zero-Sugar Soda',
      itemA: {
        name: 'Choco-Chip Bakery Cookies',
        badge: 'High Sugar & Fat',
        badgeColor: 'bg-[#FDF3F2] text-[#9B2C26] border-[#F8CAC7]',
        calories: 495,
        sugar: 32.0,
        addedSugar: 28.5,
        satFat: 10.5,
        sodium: 290,
        protein: 6.2,
        fibre: 1.8,
        additivesCount: 3,
        additivesList: 'INS 503(ii), INS 500(ii), INS 322 Lecithin',
        allergens: 'Wheat, Milk, Soy',
        ingredients: 'Refined Wheat Flour, Sugar, Edible Vegetable Fat (Palm Oil), Chocolate Chips, Raising Agents [INS 503(ii), INS 500(ii)], Emulsifier [INS 322].'
      },
      itemB: {
        name: 'Zero-Sugar Citrus Soda',
        badge: 'Additive Dense / Zero Sugar',
        badgeColor: 'bg-[#EEF8DC] text-[#174B38] border-[#D7EDB2]',
        calories: 1,
        sugar: 0.0,
        addedSugar: 0.0,
        satFat: 0.0,
        sodium: 45,
        protein: 0.0,
        fibre: 0.0,
        additivesCount: 6,
        additivesList: 'INS 330, INS 331, INS 955 (Sucralose), INS 950 (Ace-K), INS 211, INS 102',
        allergens: 'None declared',
        ingredients: 'Carbonated Water, Acidity Regulators (INS 330, INS 331), Sweeteners (INS 955, INS 950), Preservative (INS 211), Caffeine (80 mg), Stabilizer (INS 415), Synthetic Food Colour (INS 102).'
      }
    }
  ];

  const [activePresetIndex, setActivePresetIndex] = useState(0);
  const activePair = presets[activePresetIndex];
  const { itemA, itemB } = activePair;

  const sodiumRatio = Math.round(itemB.sodium / Math.max(itemA.sodium, 1));

  const handleInspect = async (product: typeof itemA) => {
    try {
      const res = await analyzeLabelData({
        product_name: product.name,
        ingredients: product.ingredients,
        allergen_statement: product.allergens,
        language
      });
      setActiveAnalysis(res);
      setCurrentProductContext({
        product_name: product.name,
        ingredients: product.ingredients,
        allergen_statement: product.allergens,
        nutrition: {
          calories: `${product.calories} kcal`,
          total_sugars: `${product.sugar} g`,
          sodium: `${product.sodium} mg`
        }
      });
      navigate('/results');
    } catch (e) {
      console.error(e);
      navigate('/scan');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20 animate-fade-in">

      {/* 10. PRODUCT COMPARISON HEADER */}
      <div className="bg-white p-7 sm:p-10 rounded-3xl border border-[#E6E7E0] shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-[#174B38] font-bold text-xs uppercase tracking-wider">
          <Scale className="w-4 h-4 text-[#174B38] shrink-0" />
          <span>Product Comparison</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black font-['Plus_Jakarta_Sans',sans-serif] text-[#174B38] tracking-tight">
          Side-by-Side Formulation Battle
        </h1>
        <p className="text-xs sm:text-sm text-[#78837B] leading-relaxed max-w-xl">
          Compare nutritional metrics, sodium, saturated fat, fibre, and synthetic additives between two packaged food formulations.
        </p>

        {/* Preset Selector */}
        <div className="flex flex-wrap gap-2 pt-2">
          {presets.map((p, idx) => (
            <button
              key={idx}
              onClick={() => setActivePresetIndex(idx)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${activePresetIndex === idx
                ? 'bg-[#174B38] text-white shadow-2xs'
                : 'bg-[#F8F8F2] text-[#78837B] hover:bg-[#EEF8DC] hover:text-[#174B38]'
                }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Delta Callout Banner */}
      <div className="bg-[#174B38] text-white p-6 rounded-3xl shadow-sm border border-[#216149] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-white/10 flex items-center justify-center shrink-0">
            <ArrowLeftRight className="w-5 h-5 text-[#D7EDB2]" />
          </div>
          <div>
            <h3 className="font-['Plus_Jakarta_Sans',sans-serif] font-bold text-sm text-white">
              Sodium & Additive Differential
            </h3>
            <p className="text-xs text-[#D7EDB2] mt-0.5">
              {itemB.name} contains <strong>{sodiumRatio}× more sodium</strong> ({itemB.sodium} mg vs {itemA.sodium} mg) and <strong>{itemB.additivesCount} functional additives</strong>.
            </p>
          </div>
        </div>
        <span className="text-xs font-bold uppercase bg-[#D7EDB2] text-[#174B38] px-3.5 py-1.5 rounded-xl self-start sm:self-center">
          Comparison Verified
        </span>
      </div>

      {/* Side-by-Side Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Product A */}
        <div className="bg-white p-7 rounded-3xl border border-[#E6E7E0] shadow-xs space-y-5 card-hover flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider bg-[#EEF8DC] text-[#174B38] px-3 py-1 rounded-full border border-[#D7EDB2]">
                Product A
              </span>
              <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${itemA.badgeColor}`}>
                {itemA.badge}
              </span>
            </div>

            <h2 className="font-['Plus_Jakarta_Sans',sans-serif] font-black text-xl text-[#202923]">{itemA.name}</h2>

            <div className="space-y-2.5 pt-1 text-xs">
              <div className="flex justify-between py-1.5 border-b border-[#E6E7E0]">
                <span className="text-[#78837B] font-semibold">Calories</span>
                <span className="font-bold text-[#174B38]">{itemA.calories} kcal</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#E6E7E0]">
                <span className="text-[#78837B] font-semibold">Total Sugars (Added)</span>
                <span className="font-bold text-[#174B38]">{itemA.sugar} g ({itemA.addedSugar} g)</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#E6E7E0]">
                <span className="text-[#78837B] font-semibold">Saturated Fat</span>
                <span className="font-bold text-[#174B38]">{itemA.satFat} g</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#E6E7E0]">
                <span className="text-[#78837B] font-semibold">Sodium</span>
                <span className="font-bold text-[#174B38]">{itemA.sodium} mg</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#E6E7E0]">
                <span className="text-[#78837B] font-semibold">Protein & Fibre</span>
                <span className="font-bold text-[#174B38]">{itemA.protein} g / {itemA.fibre} g</span>
              </div>
              <div className="py-2 border-b border-[#E6E7E0] space-y-1">
                <span className="text-[#78837B] font-semibold block">Declared Additives</span>
                <span className="font-medium text-[#202923] block">{itemA.additivesList}</span>
              </div>
              <div className="py-1.5 space-y-1">
                <span className="text-[#78837B] font-semibold block">Allergen Flags</span>
                <span className="font-medium text-[#966114] block">{itemA.allergens}</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => handleInspect(itemA)}
            className="w-full py-3 bg-[#174B38] hover:bg-[#0F3527] text-white text-xs font-bold rounded-2xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
          >
            <span>Analyze Product A Report</span>
            <ArrowRight className="w-4 h-4 text-[#D7EDB2]" />
          </button>
        </div>

        {/* Product B */}
        <div className="bg-white p-7 rounded-3xl border border-[#E6E7E0] shadow-xs space-y-5 card-hover flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider bg-[#FEF8ED] text-[#966114] px-3 py-1 rounded-full border border-[#F9DEAA]">
                Product B
              </span>
              <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${itemB.badgeColor}`}>
                {itemB.badge}
              </span>
            </div>

            <h2 className="font-['Plus_Jakarta_Sans',sans-serif] font-black text-xl text-[#202923]">{itemB.name}</h2>

            <div className="space-y-2.5 pt-1 text-xs">
              <div className="flex justify-between py-1.5 border-b border-[#E6E7E0]">
                <span className="text-[#78837B] font-semibold">Calories</span>
                <span className="font-bold text-[#174B38]">{itemB.calories} kcal</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#E6E7E0]">
                <span className="text-[#78837B] font-semibold">Total Sugars (Added)</span>
                <span className="font-bold text-[#174B38]">{itemB.sugar} g ({itemB.addedSugar} g)</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#E6E7E0]">
                <span className="text-[#78837B] font-semibold">Saturated Fat</span>
                <span className="font-bold text-[#D95C55]">{itemB.satFat} g</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#E6E7E0]">
                <span className="text-[#78837B] font-semibold">Sodium</span>
                <span className="font-bold text-[#D95C55]">{itemB.sodium} mg</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#E6E7E0]">
                <span className="text-[#78837B] font-semibold">Protein & Fibre</span>
                <span className="font-bold text-[#174B38]">{itemB.protein} g / {itemB.fibre} g</span>
              </div>
              <div className="py-2 border-b border-[#E6E7E0] space-y-1">
                <span className="text-[#78837B] font-semibold block">Declared Additives</span>
                <span className="font-medium text-[#202923] block">{itemB.additivesList}</span>
              </div>
              <div className="py-1.5 space-y-1">
                <span className="text-[#78837B] font-semibold block">Allergen Flags</span>
                <span className="font-medium text-[#966114] block">{itemB.allergens}</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => handleInspect(itemB)}
            className="w-full py-3 bg-[#174B38] hover:bg-[#0F3527] text-white text-xs font-bold rounded-2xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
          >
            <span>Analyze Product B Report</span>
            <ArrowRight className="w-4 h-4 text-[#D7EDB2]" />
          </button>
        </div>
      </div>

      {/* Objectivity Notice */}
      <div className="p-4 bg-white rounded-2xl border border-[#E6E7E0] flex items-center gap-3 text-xs text-[#78837B]">
        <Info className="w-4 h-4 text-[#174B38] shrink-0" />
        <span>
          <strong>Scientific Objectivity Note:</strong> LifeLens AI presents comparative nutritional declarations objectively. Never claim one product is universally healthier based on incomplete packaging declarations.
        </span>
      </div>
    </div>
  );
};
