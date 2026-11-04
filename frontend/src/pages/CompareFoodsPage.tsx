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

  /* Helper: compute bar width percentage for visual comparison */
  const barPercent = (val: number, max: number) => Math.min((val / Math.max(max, 1)) * 100, 100);

  /* Nutrition rows for comparison table */
  const nutritionRows = [
    { label: 'Calories', valA: itemA.calories, valB: itemB.calories, unit: 'kcal', max: 600, higherIsWorse: true },
    { label: 'Total Sugars', valA: itemA.sugar, valB: itemB.sugar, unit: 'g', max: 40, higherIsWorse: true },
    { label: 'Added Sugar', valA: itemA.addedSugar, valB: itemB.addedSugar, unit: 'g', max: 35, higherIsWorse: true },
    { label: 'Saturated Fat', valA: itemA.satFat, valB: itemB.satFat, unit: 'g', max: 15, higherIsWorse: true },
    { label: 'Sodium', valA: itemA.sodium, valB: itemB.sodium, unit: 'mg', max: 1200, higherIsWorse: true },
    { label: 'Protein', valA: itemA.protein, valB: itemB.protein, unit: 'g', max: 20, higherIsWorse: false },
    { label: 'Fibre', valA: itemA.fibre, valB: itemB.fibre, unit: 'g', max: 15, higherIsWorse: false },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20 animate-fade-in">

      {/* 10. PRODUCT COMPARISON HEADER */}
      <div className="bg-gradient-to-br from-white to-[#EEF8DC]/30 p-7 sm:p-10 rounded-3xl border border-[#E6E7E0] shadow-soft space-y-4">
        <div className="flex items-center gap-2 text-[#174B38] font-bold text-xs uppercase tracking-wider">
          <Scale className="w-4 h-4 text-[#174B38] shrink-0" />
          <span>Product Comparison</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-[#174B38] tracking-tight">
          Side-by-Side Formulation Battle
        </h1>
        <p className="text-xs sm:text-sm text-[#6E7972] leading-relaxed max-w-xl">
          Compare nutritional metrics, sodium, saturated fat, fibre, and synthetic additives between two packaged food formulations.
        </p>

        {/* Preset Selector */}
        <div className="flex flex-wrap gap-2 pt-2">
          {presets.map((p, idx) => (
            <button
              key={idx}
              onClick={() => setActivePresetIndex(idx)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${activePresetIndex === idx
                ? 'bg-[#174B38] text-white shadow-soft'
                : 'bg-[#F8F8F2] text-[#6E7972] hover:bg-[#EEF8DC] hover:text-[#174B38] border border-[#E6E7E0]'
                }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Delta Callout Banner */}
      <div className="bg-gradient-to-r from-[#174B38] to-[#0E3326] text-white p-6 rounded-3xl shadow-elevated border border-[#216149] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center shrink-0">
            <ArrowLeftRight className="w-5 h-5 text-[#D7EDB2]" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-white">
              Sodium & Additive Differential
            </h3>
            <p className="text-xs text-[#D7EDB2] mt-0.5">
              {itemB.name} contains <strong>{sodiumRatio}× more sodium</strong> ({itemB.sodium} mg vs {itemA.sodium} mg) and <strong>{itemB.additivesCount} functional additives</strong>.
            </p>
          </div>
        </div>
        <span className="text-xs font-bold uppercase bg-[#D7EDB2] text-[#174B38] px-3.5 py-1.5 rounded-xl self-start sm:self-center shadow-sm">
          Comparison Verified
        </span>
      </div>

      {/* Nutrition Comparison Table with Visual Bars */}
      <div className="bg-white p-7 sm:p-10 rounded-3xl border border-[#E6E7E0] shadow-soft space-y-5">
        <div className="flex items-center gap-2 text-[#174B38] font-bold text-xs uppercase tracking-wider">
          <Activity className="w-4 h-4 text-[#174B38] shrink-0" />
          <span>Nutritional Comparison</span>
        </div>

        {/* Table Header */}
        <div className="grid grid-cols-[1fr_1fr_0.5fr_1fr] gap-3 text-[10px] font-bold uppercase tracking-wider text-[#6E7972] pb-2 border-b border-[#E6E7E0]">
          <span>Product A</span>
          <span className="text-center">Metric</span>
          <span></span>
          <span className="text-right">Product B</span>
        </div>

        {nutritionRows.map((row, idx) => {
          const maxVal = Math.max(row.valA, row.valB, 1);
          const pctA = barPercent(row.valA, row.max);
          const pctB = barPercent(row.valB, row.max);
          const aWorse = row.higherIsWorse ? row.valA > row.valB : row.valA < row.valB;
          const bWorse = row.higherIsWorse ? row.valB > row.valA : row.valB < row.valA;

          return (
            <div
              key={row.label}
              className={`grid grid-cols-[1fr_1fr_0.5fr_1fr] gap-3 items-center py-3 rounded-xl px-3 transition-all duration-200 ${
                idx % 2 === 0 ? 'bg-[#F8F8F2]' : 'bg-white'
              }`}
            >
              {/* A value + bar */}
              <div className="space-y-1">
                <span className={`text-xs font-bold ${aWorse ? 'text-[#D95C55]' : 'text-[#174B38]'}`}>
                  {row.valA} {row.unit}
                </span>
                <div className="w-full h-1.5 bg-[#E6E7E0] rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${aWorse ? 'bg-[#D95C55]' : 'bg-[#529367]'}`}
                    style={{ width: `${pctA}%` }}
                  />
                </div>
              </div>

              {/* Label */}
              <span className="text-xs font-semibold text-[#1D2620] text-center">{row.label}</span>

              {/* Unit */}
              <span className="text-[10px] text-[#98A39C] text-center">{row.unit}</span>

              {/* B value + bar */}
              <div className="space-y-1">
                <span className={`text-xs font-bold text-right block ${bWorse ? 'text-[#D95C55]' : 'text-[#174B38]'}`}>
                  {row.valB} {row.unit}
                </span>
                <div className="w-full h-1.5 bg-[#E6E7E0] rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 float-right ${bWorse ? 'bg-[#D95C55]' : 'bg-[#529367]'}`}
                    style={{ width: `${pctB}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Side-by-Side Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Product A */}
        <div className="bg-white p-7 rounded-3xl border border-[#E6E7E0] shadow-soft space-y-5 card-hover flex flex-col justify-between transition-all duration-200">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider bg-[#EEF8DC] text-[#174B38] px-3 py-1 rounded-full border border-[#D7EDB2]">
                Product A
              </span>
              <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${itemA.badgeColor}`}>
                {itemA.badge}
              </span>
            </div>

            <h2 className="font-black text-xl text-[#1D2620]">{itemA.name}</h2>

            <div className="space-y-0 pt-1 text-xs">
              {[
                { label: 'Calories', value: `${itemA.calories} kcal` },
                { label: 'Total Sugars (Added)', value: `${itemA.sugar} g (${itemA.addedSugar} g)` },
                { label: 'Saturated Fat', value: `${itemA.satFat} g` },
                { label: 'Sodium', value: `${itemA.sodium} mg` },
                { label: 'Protein & Fibre', value: `${itemA.protein} g / ${itemA.fibre} g` },
              ].map((row, i) => (
                <div key={row.label} className={`flex justify-between py-2.5 px-2 rounded-lg ${i % 2 === 0 ? 'bg-[#F8F8F2]' : ''}`}>
                  <span className="text-[#6E7972] font-semibold">{row.label}</span>
                  <span className="font-bold text-[#174B38]">{row.value}</span>
                </div>
              ))}
              <div className="py-2.5 px-2 bg-[#F8F8F2] rounded-lg space-y-1">
                <span className="text-[#6E7972] font-semibold block">Declared Additives</span>
                <span className="font-medium text-[#1D2620] block">{itemA.additivesList}</span>
              </div>
              <div className="py-2.5 px-2 space-y-1">
                <span className="text-[#6E7972] font-semibold block">Allergen Flags</span>
                <span className="font-medium text-[#966114] block">{itemA.allergens}</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => handleInspect(itemA)}
            className="w-full py-3 bg-[#174B38] hover:bg-[#0E3326] text-white text-xs font-bold rounded-2xl flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer shadow-soft"
          >
            <span>Analyze Product A Report</span>
            <ArrowRight className="w-4 h-4 text-[#D7EDB2]" />
          </button>
        </div>

        {/* Product B */}
        <div className="bg-white p-7 rounded-3xl border border-[#E6E7E0] shadow-soft space-y-5 card-hover flex flex-col justify-between transition-all duration-200">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider bg-[#FEF8ED] text-[#966114] px-3 py-1 rounded-full border border-[#F9DEAA]">
                Product B
              </span>
              <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${itemB.badgeColor}`}>
                {itemB.badge}
              </span>
            </div>

            <h2 className="font-black text-xl text-[#1D2620]">{itemB.name}</h2>

            <div className="space-y-0 pt-1 text-xs">
              {[
                { label: 'Calories', value: `${itemB.calories} kcal`, danger: false },
                { label: 'Total Sugars (Added)', value: `${itemB.sugar} g (${itemB.addedSugar} g)`, danger: false },
                { label: 'Saturated Fat', value: `${itemB.satFat} g`, danger: itemB.satFat > itemA.satFat },
                { label: 'Sodium', value: `${itemB.sodium} mg`, danger: itemB.sodium > itemA.sodium },
                { label: 'Protein & Fibre', value: `${itemB.protein} g / ${itemB.fibre} g`, danger: false },
              ].map((row, i) => (
                <div key={row.label} className={`flex justify-between py-2.5 px-2 rounded-lg ${i % 2 === 0 ? 'bg-[#F8F8F2]' : ''}`}>
                  <span className="text-[#6E7972] font-semibold">{row.label}</span>
                  <span className={`font-bold ${row.danger ? 'text-[#D95C55]' : 'text-[#174B38]'}`}>{row.value}</span>
                </div>
              ))}
              <div className="py-2.5 px-2 bg-[#F8F8F2] rounded-lg space-y-1">
                <span className="text-[#6E7972] font-semibold block">Declared Additives</span>
                <span className="font-medium text-[#1D2620] block">{itemB.additivesList}</span>
              </div>
              <div className="py-2.5 px-2 space-y-1">
                <span className="text-[#6E7972] font-semibold block">Allergen Flags</span>
                <span className="font-medium text-[#966114] block">{itemB.allergens}</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => handleInspect(itemB)}
            className="w-full py-3 bg-[#174B38] hover:bg-[#0E3326] text-white text-xs font-bold rounded-2xl flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer shadow-soft"
          >
            <span>Analyze Product B Report</span>
            <ArrowRight className="w-4 h-4 text-[#D7EDB2]" />
          </button>
        </div>
      </div>

      {/* Objectivity Notice */}
      <div className="p-5 bg-gradient-to-r from-white to-[#EEF8DC]/20 rounded-2xl border border-[#E6E7E0] shadow-soft flex items-center gap-3 text-xs text-[#6E7972]">
        <Info className="w-4 h-4 text-[#174B38] shrink-0" />
        <span>
          <strong className="text-[#1D2620]">Scientific Objectivity Note:</strong> LifeLens AI presents comparative nutritional declarations objectively. Never claim one product is universally healthier based on incomplete packaging declarations.
        </span>
      </div>
    </div>
  );
};
