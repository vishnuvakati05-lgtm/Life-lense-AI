import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { translations, Language, TranslationKeys } from '../i18n/translations';
import { ScanResult, AnalysisResult, ScanRecord } from '../types';
import { fetchScanHistory } from '../services/api';

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: TranslationKeys;
  activeScan: ScanResult | null;
  setActiveScan: (scan: ScanResult | null) => void;
  activeAnalysis: AnalysisResult | null;
  setActiveAnalysis: (analysis: AnalysisResult | null) => void;
  currentProductContext: {
    product_name: string;
    ingredients: string;
    allergen_statement: string;
    nutrition: Record<string, any>;
  };
  setCurrentProductContext: React.Dispatch<React.SetStateAction<{
    product_name: string;
    ingredients: string;
    allergen_statement: string;
    nutrition: Record<string, any>;
  }>>;
  userAllergens: string[];
  setUserAllergens: React.Dispatch<React.SetStateAction<string[]>>;
  customAllergens: string[];
  setCustomAllergens: React.Dispatch<React.SetStateAction<string[]>>;
  fontSize: 'small' | 'medium' | 'large' | 'xlarge';
  setFontSize: (size: 'small' | 'medium' | 'large' | 'xlarge') => void;
  speechRate: number;
  setSpeechRate: (rate: number) => void;
  isSpeaking: boolean;
  speak: (text: string) => void;
  stopSpeaking: () => void;
  history: ScanRecord[];
  refreshHistory: () => Promise<void>;
  clearLocalHistory: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const DEFAULT_ALLERGENS = ['milk', 'peanuts', 'tree_nuts', 'wheat', 'soy', 'eggs'];

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Persistent language
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('lifelens_lang');
    return (saved === 'hi' || saved === 'te' || saved === 'en') ? saved : 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('lifelens_lang', lang);
  };

  const t = translations[language] as unknown as TranslationKeys;

  // Active scan & analysis state
  const [activeScan, setActiveScan] = useState<ScanResult | null>(null);
  const [activeAnalysis, setActiveAnalysis] = useState<AnalysisResult | null>(null);

  // Active product context for AI Food Chat
  const [currentProductContext, setCurrentProductContext] = useState({
    product_name: 'No product selected',
    ingredients: '',
    allergen_statement: '',
    nutrition: {},
  });

  // User allergen profile
  const [userAllergens, setUserAllergens] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('lifelens_allergens');
      return saved ? JSON.parse(saved) : DEFAULT_ALLERGENS;
    } catch {
      return DEFAULT_ALLERGENS;
    }
  });

  const [customAllergens, setCustomAllergens] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('lifelens_custom_allergens');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('lifelens_allergens', JSON.stringify(userAllergens));
  }, [userAllergens]);

  useEffect(() => {
    localStorage.setItem('lifelens_custom_allergens', JSON.stringify(customAllergens));
  }, [customAllergens]);

  // Accessibility Font size
  const [fontSize, setFontSizeState] = useState<'small' | 'medium' | 'large' | 'xlarge'>(() => {
    return (localStorage.getItem('lifelens_fontsize') as any) || 'medium';
  });

  const setFontSize = (size: 'small' | 'medium' | 'large' | 'xlarge') => {
    setFontSizeState(size);
    localStorage.setItem('lifelens_fontsize', size);
    document.documentElement.className = `font-${size}`;
  };

  useEffect(() => {
    document.documentElement.className = `font-${fontSize}`;
  }, [fontSize]);

  // Voice speech synthesis
  const [speechRate, setSpeechRate] = useState<number>(1.0);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  const speak = (text: string) => {
    if (!('speechSynthesis' in window)) {
      alert('Speech synthesis is not supported on this browser.');
      return;
    }

    window.speechSynthesis.cancel();
    if (!text.trim()) return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = speechRate;

    // Pick best voice for language
    const langCodes: Record<Language, string> = {
      en: 'en-US',
      hi: 'hi-IN',
      te: 'te-IN',
    };
    utterance.lang = langCodes[language] || 'en-US';

    const voices = window.speechSynthesis.getVoices();
    const matchingVoice = voices.find(v => v.lang.startsWith(langCodes[language].slice(0, 2)));
    if (matchingVoice) {
      utterance.voice = matchingVoice;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  // Scan History
  const [history, setHistory] = useState<ScanRecord[]>([]);

  const refreshHistory = async () => {
    const records = await fetchScanHistory();
    setHistory(records);
  };

  useEffect(() => {
    refreshHistory();
  }, []);

  const clearLocalHistory = () => {
    setHistory([]);
  };

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        t,
        activeScan,
        setActiveScan,
        activeAnalysis,
        setActiveAnalysis,
        currentProductContext,
        setCurrentProductContext,
        userAllergens,
        setUserAllergens,
        customAllergens,
        setCustomAllergens,
        fontSize,
        setFontSize,
        speechRate,
        setSpeechRate,
        isSpeaking,
        speak,
        stopSpeaking,
        history,
        refreshHistory,
        clearLocalHistory,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

