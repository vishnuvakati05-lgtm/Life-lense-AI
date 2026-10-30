import React, { useState } from 'react';
import {
  Settings,
  ShieldCheck,
  Globe,
  Volume2,
  Trash2,
  Plus,
  X,
  Play,
  Check,
  AlertTriangle,
  Sliders
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Language } from '../i18n/translations';

export const SettingsPage: React.FC = () => {
  const {
    language,
    setLanguage,
    userAllergens,
    setUserAllergens,
    customAllergens,
    setCustomAllergens,
    fontSize,
    setFontSize,
    speechRate,
    setSpeechRate,
    speak,
    clearLocalHistory
  } = useApp();

  const [newCustomAllergen, setNewCustomAllergen] = useState('');

  const standardAllergens = [
    { id: 'milk', label: 'Milk / Dairy', hi: 'दूध / डेयरी', te: 'పాలు / డెయిరీ' },
    { id: 'eggs', label: 'Eggs (Anda)', hi: 'अंडे (Anda)', te: 'గుడ్లు (Eggs)' },
    { id: 'peanuts', label: 'Peanuts (Moongphali)', hi: 'मूंगफली (Peanuts)', te: 'వేరుశెనగ (Peanuts)' },
    { id: 'tree_nuts', label: 'Tree Nuts (Badam, Kaju, Akhrot)', hi: 'मेवे (बादाम, काजू)', te: 'ట్రీ నట్స్ (బాదం, జీడిపప్పు)' },
    { id: 'soy', label: 'Soy / Soya', hi: 'सोया (Soy)', te: 'సోయా (Soy)' },
    { id: 'wheat', label: 'Wheat / Gluten (Maida, Atta)', hi: 'गेहूं / मैदा / ग्लूटेन', te: 'గోధుమ / మైదా / గ్లూటెన్' },
    { id: 'fish', label: 'Fish', hi: 'मछली (Fish)', te: 'చేప (Fish)' },
    { id: 'shellfish', label: 'Crustacean Shellfish', hi: 'शेलफिश', te: 'షెల్‌ఫిష్' },
    { id: 'sesame', label: 'Sesame (Til)', hi: 'तिल (Sesame)', te: 'నువ్వులు (Sesame)' },
    { id: 'mustard', label: 'Mustard (Sarson)', hi: 'सरसों (Mustard)', te: 'ఆవాలు (Mustard)' },
    { id: 'sulphites', label: 'Sulphites / Sulfur Dioxide', hi: 'सल्फाइट्स (Sulphites)', te: 'సల్ఫైట్స్' },
  ];

  const toggleAllergen = (id: string) => {
    setUserAllergens((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  };

  const handleAddCustom = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newCustomAllergen.trim().toLowerCase();
    if (trimmed && !customAllergens.includes(trimmed)) {
      setCustomAllergens((prev) => [...prev, trimmed]);
      setNewCustomAllergen('');
    }
  };

  const removeCustom = (item: string) => {
    setCustomAllergens((prev) => prev.filter((c) => c !== item));
  };

  const handleTestVoice = () => {
    const testText =
      language === 'hi'
        ? 'LifeLens AI आवाज़ परीक्षण। आपकी आवाज़ गति सेट हो गई है।'
        : language === 'te'
        ? 'LifeLens AI స్వర పరీక్ష. మీ మాట వేగం సెట్ చేయబడింది.'
        : 'LifeLens AI voice test. Your speech synthesis rate is configured.';
    speak(testText);
  };

  const handleDeleteAll = () => {
    if (window.confirm('Delete all stored preferences and local scan history? This action cannot be undone.')) {
      localStorage.clear();
      clearLocalHistory();
      setUserAllergens([]);
      setCustomAllergens([]);
      alert('All local profile data cleared.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20 animate-fade-in">
      
      {/* Settings Header */}
      <div className="bg-white p-7 sm:p-10 rounded-3xl border border-[#E6E7E0] shadow-xs space-y-2">
        <div className="flex items-center gap-2 text-[#174B38] font-bold text-xs uppercase tracking-wider mb-1">
          <Settings className="w-4 h-4 text-[#174B38] shrink-0" />
          <span>Profile & Safety Preferences</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black font-['Plus_Jakarta_Sans',sans-serif] text-[#174B38] tracking-tight">
          Settings & Allergen Profile
        </h1>
        <p className="text-xs sm:text-sm text-[#78837B] leading-relaxed">
          Configure your personal allergen checklist, primary language, voice rate, and local privacy controls.
        </p>
      </div>

      {/* Language Section */}
      <section className="bg-white p-7 rounded-3xl border border-[#E6E7E0] shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-[#174B38] font-['Plus_Jakarta_Sans',sans-serif] font-bold text-lg">
          <Globe className="w-5 h-5 text-[#174B38] shrink-0" />
          <span>Primary App & Voice Language</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { code: 'en', label: 'English', script: 'English', desc: 'Global English food standard' },
            { code: 'hi', label: 'हिन्दी', script: 'Hindi', desc: 'भारतीय मानक अनुवाद' },
            { code: 'te', label: 'తెలుగు', script: 'Telugu', desc: 'ప్రామాణిక తెలుగు వివరణ' }
          ].map((l) => {
            const isSelected = language === l.code;
            return (
              <button
                key={l.code}
                onClick={() => setLanguage(l.code as Language)}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'border-[#174B38] bg-[#EEF8DC] shadow-2xs'
                    : 'border-[#E6E7E0] hover:bg-[#F8F8F2]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-['Plus_Jakarta_Sans',sans-serif] font-bold text-base text-[#174B38]">
                    {l.label}
                  </span>
                  {isSelected && <Check className="w-4 h-4 text-[#174B38] shrink-0" />}
                </div>
                <p className="text-xs text-[#78837B] mt-1">{l.desc}</p>
              </button>
            );
          })}
        </div>
      </section>

      {/* Personal Allergen Profile Checklist */}
      <section className="bg-white p-7 rounded-3xl border border-[#E6E7E0] shadow-xs space-y-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[#174B38] font-['Plus_Jakarta_Sans',sans-serif] font-bold text-lg">
            <ShieldCheck className="w-5 h-5 text-[#174B38] shrink-0" />
            <span>Personal Allergen Profile Checklist</span>
          </div>
          <p className="text-xs text-[#78837B]">
            Select allergens you must avoid. LifeLens will cross-match every scanned label and flag direct components, derivatives, and regional Indian synonyms.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {standardAllergens.map((item) => {
            const isChecked = userAllergens.includes(item.id);
            return (
              <button
                key={item.id}
                onClick={() => toggleAllergen(item.id)}
                className={`p-3.5 rounded-2xl border flex items-center justify-between text-left transition-all cursor-pointer ${
                  isChecked
                    ? 'bg-[#FDF3F2] border-[#F8CAC7] text-[#9B2C26]'
                    : 'bg-[#F8F8F2] border-[#E6E7E0] hover:bg-[#EEF8DC] hover:text-[#174B38] text-[#202923]'
                }`}
              >
                <div className="space-y-0.5">
                  <span className="text-xs font-bold block">{item.label}</span>
                  <span className="text-[10px] text-[#78837B] block">
                    {language === 'hi' ? item.hi : language === 'te' ? item.te : 'Common allergen'}
                  </span>
                </div>
                <div
                  className={`w-5 h-5 rounded-lg flex items-center justify-center border transition-all ${
                    isChecked
                      ? 'bg-[#D95C55] border-[#D95C55] text-white'
                      : 'border-[#CBD5E1] bg-white'
                  }`}
                >
                  {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
              </button>
            );
          })}
        </div>

        {/* Custom Allergens Section */}
        <div className="pt-4 border-t border-[#E6E7E0] space-y-3">
          <label className="block text-xs font-bold text-[#202923]">
            Add Custom Allergens or Ingredients to Flag
          </label>
          <form onSubmit={handleAddCustom} className="flex gap-2">
            <input
              type="text"
              value={newCustomAllergen}
              onChange={(e) => setNewCustomAllergen(e.target.value)}
              placeholder="e.g. Palm Oil, Gelatin, MSG, Red 40..."
              className="flex-1 px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-[#E6E7E0] bg-[#F8F8F2] focus:outline-none focus:border-[#174B38]"
            />
            <button
              type="submit"
              className="px-5 py-2.5 bg-[#174B38] hover:bg-[#0F3527] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4 shrink-0" />
              <span>Add</span>
            </button>
          </form>

          {customAllergens.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-1">
              {customAllergens.map((item, idx) => (
                <span
                  key={idx}
                  className="bg-[#FDF3F2] text-[#9B2C26] border border-[#F8CAC7] text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5"
                >
                  <span>{item}</span>
                  <button
                    onClick={() => removeCustom(item)}
                    className="hover:text-black cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Voice Synthesis Settings */}
      <section className="bg-white p-7 rounded-3xl border border-[#E6E7E0] shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-[#174B38] font-['Plus_Jakarta_Sans',sans-serif] font-bold text-lg">
          <Volume2 className="w-5 h-5 text-[#174B38] shrink-0" />
          <span>Text-to-Speech (TTS) Voice Configuration</span>
        </div>
        <div className="space-y-4 max-w-md">
          <div>
            <div className="flex justify-between text-xs font-semibold mb-2 text-[#78837B]">
              <span>Speech Rate Speed</span>
              <span className="font-bold text-[#174B38]">{speechRate}×</span>
            </div>
            <input
              type="range"
              min="0.7"
              max="1.3"
              step="0.1"
              value={speechRate}
              onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
              className="w-full accent-[#174B38] cursor-pointer"
            />
          </div>

          <button
            onClick={handleTestVoice}
            className="px-4 py-2 bg-[#F8F8F2] hover:bg-[#EEF8DC] text-[#174B38] rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer border border-[#E6E7E0]"
          >
            <Play className="w-3.5 h-3.5 text-[#174B38] shrink-0" />
            <span>Test Voice Synthesis</span>
          </button>
        </div>
      </section>

      {/* Privacy & Data Clearance */}
      <section className="bg-white p-7 rounded-3xl border border-[#F8CAC7] space-y-3">
        <div className="flex items-center gap-2 text-[#D95C55] font-['Plus_Jakarta_Sans',sans-serif] font-bold text-base">
          <AlertTriangle className="w-5 h-5 shrink-0" />
          <span>Local Privacy & Storage Management</span>
        </div>
        <p className="text-xs text-[#78837B] leading-relaxed">
          LifeLens AI runs its deterministic engine and stores your allergy profile directly in your browser or device local storage. No persistent biometric voice recordings are stored.
        </p>
        <button
          onClick={handleDeleteAll}
          className="px-5 py-2.5 bg-[#D95C55] hover:bg-[#9B2C26] text-white text-xs font-bold rounded-xl flex items-center gap-2 transition-all cursor-pointer shadow-2xs"
        >
          <Trash2 className="w-3.5 h-3.5 shrink-0" />
          <span>Clear All Local Profile & History Data</span>
        </button>
      </section>
    </div>
  );
};
