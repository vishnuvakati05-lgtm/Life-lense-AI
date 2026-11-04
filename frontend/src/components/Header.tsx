import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Camera,
  BookOpen,
  MessageSquare,
  Scale,
  Globe,
  Volume2,
  Menu,
  X,
  Info,
  User
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Language } from '../i18n/translations';

export const Header: React.FC = () => {
  const { language, setLanguage, fontSize, setFontSize, isSpeaking } = useApp();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
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
          <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
            <div className="w-10 h-10 rounded-2xl bg-[#174B38] text-white flex items-center justify-center shadow-xs transition-transform duration-200 group-hover:scale-105">
              <Camera className="w-5 h-5 text-[#D7EDB2]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl sm:text-2xl font-extrabold tracking-tight text-[#174B38] leading-none">
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
          <nav className="hidden lg:flex items-center gap-1 bg-white/90 backdrop-blur-md px-2.5 py-1.5 rounded-2xl border border-[#E6E7E0] shadow-2xs">
            {navLinks.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all duration-150 ${
                    isActive
                      ? 'bg-[#EEF8DC] text-[#174B38] font-bold shadow-2xs'
                      : 'text-[#6E7972] hover:text-[#1D2620] hover:bg-[#F8F8F2]'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-[#174B38]' : 'text-[#6E7972]'}`} />
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
              <Globe className="w-3.5 h-3.5 text-[#6E7972] ml-2 mr-1 hidden md:block shrink-0" />
              {languages.map((l) => {
                const isSelected = language === l.code;
                return (
                  <button
                    key={l.code}
                    onClick={() => setLanguage(l.code)}
                    className={`px-2.5 py-1 text-xs font-bold rounded-xl transition-all duration-150 cursor-pointer ${
                      isSelected
                        ? 'bg-[#174B38] text-white shadow-2xs'
                        : 'text-[#6E7972] hover:text-[#1D2620] hover:bg-[#F8F8F2]'
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
              className="px-2.5 py-1.5 rounded-xl text-xs font-bold text-[#6E7972] hover:text-[#1D2620] bg-white hover:bg-[#F8F8F2] border border-[#E6E7E0] transition-all shadow-2xs cursor-pointer"
            >
              <span className="font-mono font-bold">A{fontSize === 'large' ? '+' : fontSize === 'xlarge' ? '++' : ''}</span>
            </button>

            {/* Profile & Allergy Settings */}
            <Link
              to="/settings"
              title="Profile & Allergy Settings"
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border border-[#E6E7E0] bg-white hover:bg-[#F8F8F2] text-[#1D2620] hover:text-[#174B38] transition-colors shadow-2xs ${
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
              className="p-2 rounded-xl text-[#1D2620] hover:bg-[#F8F8F2] border border-[#E6E7E0] cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-t border-[#E6E7E0] bg-[#F8F8F2]/98 backdrop-blur-lg px-4 pt-3 pb-6 space-y-4 animate-fade-in shadow-lg">
          <div className="flex items-center justify-between pb-3 border-b border-[#E6E7E0]">
            <span className="text-xs font-bold text-[#6E7972] uppercase tracking-wider">
              Language
            </span>
            <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-[#E6E7E0]">
              {languages.map((l) => (
                <button
                  key={l.code}
                  onClick={() => setLanguage(l.code)}
                  className={`px-3 py-1 text-xs font-bold rounded-lg ${
                    language === l.code
                      ? 'bg-[#174B38] text-white'
                      : 'text-[#6E7972] hover:bg-[#F8F8F2]'
                  }`}
                >
                  {l.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1">
            {navLinks.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                    isActive
                      ? 'bg-[#EEF8DC] text-[#174B38] font-bold'
                      : 'text-[#1D2620] hover:bg-white'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#174B38]' : 'text-[#6E7972]'}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
            <Link
              to="/settings"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-[#1D2620] hover:bg-white"
            >
              <User className="w-4 h-4 text-[#6E7972]" />
              <span>Profile & Allergy Settings</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
