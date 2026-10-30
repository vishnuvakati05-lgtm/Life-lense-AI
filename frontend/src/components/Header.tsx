import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Camera,
  Home,
  BookOpen,
  MessageSquare,
  Scale,
  History,
  Settings,
  Globe,
  Volume2,
  Menu,
  X,
  Info,
  Sparkles,
  ArrowRight,
  User
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Language } from '../i18n/translations';

export const Header: React.FC = () => {
  const { language, setLanguage, fontSize, setFontSize, isSpeaking } = useApp();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/scan', label: 'SmartScan', icon: Camera },
    { path: '/explore', label: 'Ingredient Explorer', icon: BookOpen },
    { path: '/chat', label: 'AI Assistant', icon: MessageSquare },
    { path: '/compare', label: 'Compare', icon: Scale },
    { path: '/about', label: 'About', icon: Info },
  ];

  const languages: { code: Language; label: string; full: string }[] = [
    { code: 'en', label: 'EN', full: 'English' },
    { code: 'hi', label: 'हिन्दी', full: 'हिन्दी' },
    { code: 'te', label: 'తెలుగు', full: 'తెలుగు' },
  ];

  return (
    <header className="sticky top-0 z-50 pt-safe bg-[#F8F8F2]/95 backdrop-blur-md border-b border-[#E6E7E0] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Logo & Brand Identity */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0 group pl-1">
            <div className="w-10 h-10 rounded-2xl bg-[#174B38] text-white flex items-center justify-center shadow-xs transition-transform duration-200 group-hover:scale-105">
              <Camera className="w-5 h-5 text-[#D7EDB2]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl sm:text-2xl font-black font-['Plus_Jakarta_Sans',sans-serif] tracking-tight text-[#174B38] leading-none">
                  LifeLens
                </span>
                <span className="text-[10px] font-bold tracking-wider uppercase bg-[#EEF8DC] text-[#174B38] px-1.5 py-0.5 rounded-md border border-[#D7EDB2]">
                  AI
                </span>
              </div>
              <span className="text-[11px] font-medium text-[#78837B] hidden sm:block tracking-wide mt-0.5">
                Scan Smart. Understand What You Eat.
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 bg-white px-2 py-1.5 rounded-2xl border border-[#E6E7E0] shadow-2xs">
            {navLinks.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all duration-150 ${
                    isActive
                      ? 'bg-[#EEF8DC] text-[#174B38] font-bold shadow-2xs'
                      : 'text-[#78837B] hover:text-[#202923] hover:bg-[#F8F8F2]'
                  }`}
                >
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Action Controls */}
          <div className="hidden sm:flex items-center gap-2.5 shrink-0">
            {/* Live Audio indicator */}
            {isSpeaking && (
              <div className="flex items-center gap-1.5 bg-[#EEF8DC] text-[#174B38] px-3 py-1.5 rounded-full text-xs font-bold border border-[#D7EDB2] animate-pulse">
                <Volume2 className="w-3.5 h-3.5 text-[#174B38] shrink-0" />
                <span className="text-[11px]">Playing</span>
              </div>
            )}

            {/* Language Switcher */}
            <div className="flex items-center bg-white p-1 rounded-2xl border border-[#E6E7E0] shadow-2xs gap-0.5">
              <Globe className="w-3.5 h-3.5 text-[#78837B] ml-2 mr-1 hidden md:block shrink-0" />
              {languages.map((l) => {
                const isSelected = language === l.code;
                return (
                  <button
                    key={l.code}
                    onClick={() => setLanguage(l.code)}
                    className={`px-2.5 py-1 text-xs font-bold rounded-xl transition-all duration-150 cursor-pointer ${
                      isSelected
                        ? 'bg-[#174B38] text-white shadow-2xs'
                        : 'text-[#78837B] hover:text-[#202923] hover:bg-[#F8F8F2]'
                    }`}
                  >
                    {l.label}
                  </button>
                );
              })}
            </div>

            {/* Accessibility Font Size Toggle */}
            <button
              onClick={() => {
                const sizes: ('small' | 'medium' | 'large' | 'xlarge')[] = ['small', 'medium', 'large', 'xlarge'];
                const nextIdx = (sizes.indexOf(fontSize) + 1) % sizes.length;
                setFontSize(sizes[nextIdx]);
              }}
              title="Toggle Font Size"
              className="px-2.5 py-1.5 rounded-xl text-xs font-bold text-[#78837B] hover:text-[#202923] bg-white hover:bg-[#F8F8F2] border border-[#E6E7E0] transition-all shadow-2xs cursor-pointer"
            >
              <span className="font-mono font-bold">A{fontSize === 'large' ? '+' : fontSize === 'xlarge' ? '++' : ''}</span>
            </button>

            {/* Sign in / Profile */}
            <Link
              to="/settings"
              title="Profile & Allergy Settings"
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border border-[#E6E7E0] bg-white hover:bg-[#F8F8F2] text-[#202923] hover:text-[#174B38] transition-colors shadow-2xs ${
                location.pathname === '/settings' ? 'bg-[#EEF8DC] text-[#174B38] border-[#D7EDB2]' : ''
              }`}
            >
              <User className="w-3.5 h-3.5 text-[#174B38] shrink-0" />
              <span className="hidden md:inline">Profile</span>
            </Link>

            {/* Primary CTA Button: Start Scanning */}
            <Link
              to="/scan"
              className="btn-primary !py-2.5 !px-4 !text-xs !rounded-xl"
            >
              <Camera className="w-4 h-4 text-[#D7EDB2] shrink-0" />
              <span>Start Scanning</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex sm:hidden items-center gap-2">
            <Link
              to="/scan"
              className="p-2 rounded-xl bg-[#174B38] text-white shadow-2xs"
              aria-label="Scan"
            >
              <Camera className="w-5 h-5 text-[#D7EDB2]" />
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl border border-[#E6E7E0] bg-white text-[#202923] shadow-2xs cursor-pointer"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 shrink-0" /> : <Menu className="w-5 h-5 shrink-0" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-t border-[#E6E7E0] bg-white px-4 pt-3 pb-6 space-y-4 shadow-lg animate-fade-in">
          <div className="flex items-center justify-between pb-2 border-b border-[#E6E7E0]">
            <span className="text-xs font-bold text-[#78837B] uppercase tracking-wider">Select Language</span>
            <div className="flex items-center gap-1 bg-[#F8F8F2] p-1 rounded-xl">
              {languages.map((l) => (
                <button
                  key={l.code}
                  onClick={() => setLanguage(l.code)}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                    language === l.code ? 'bg-[#174B38] text-white' : 'text-[#78837B]'
                  }`}
                >
                  {l.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-1">
            {navLinks.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-[#EEF8DC] text-[#174B38] font-bold border border-[#D7EDB2]'
                      : 'text-[#78837B] hover:bg-[#F8F8F2]'
                  }`}
                >
                  <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-[#174B38]' : 'text-[#78837B]'}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
            <Link
              to="/history"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold text-[#78837B] hover:bg-[#F8F8F2]"
            >
              <History className="w-5 h-5 text-[#78837B] shrink-0" />
              <span>Scan History</span>
            </Link>
            <Link
              to="/settings"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold text-[#78837B] hover:bg-[#F8F8F2]"
            >
              <Settings className="w-5 h-5 text-[#78837B] shrink-0" />
              <span>Profile & Allergy Preferences</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
