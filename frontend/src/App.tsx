import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { MobileBottomNav } from './components/MobileBottomNav';
import { HomePage } from './pages/HomePage';
import { SmartScanPage } from './pages/SmartScanPage';
import { ResultsPage } from './pages/ResultsPage';
import { IngredientExplorerPage } from './pages/IngredientExplorerPage';
import { AIFoodChatPage } from './pages/AIFoodChatPage';
import { CompareFoodsPage } from './pages/CompareFoodsPage';
import { HistoryPage } from './pages/HistoryPage';
import { SettingsPage } from './pages/SettingsPage';
import { AboutPage } from './pages/AboutPage';

export const App: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8F8F2] text-[#202923] font-body selection:bg-[#D7EDB2] selection:text-[#174B38]">
      <Header />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-32 lg:pb-12">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/scan" element={<SmartScanPage />} />
          <Route path="/results" element={<ResultsPage />} />
          <Route path="/explore" element={<IngredientExplorerPage />} />
          <Route path="/chat" element={<AIFoodChatPage />} />
          <Route path="/compare" element={<CompareFoodsPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/about" element={<AboutPage />} />
        </Routes>
      </main>
      <Footer />
      <MobileBottomNav />
    </div>
  );
};

export default App;
