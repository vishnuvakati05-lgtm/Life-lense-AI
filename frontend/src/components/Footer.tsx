import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Info, FileText, CheckCircle2, Camera, BookOpen, MessageSquare, Scale } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#F8F8F2] border-t border-[#E6E7E0] pt-14 pb-28 lg:pb-12 text-xs text-[#78837B] mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand & Vision */}
          <div className="space-y-3.5">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#174B38] text-white flex items-center justify-center font-bold shadow-xs">
                <ShieldCheck className="w-4 h-4 text-[#D7EDB2] shrink-0" />
              </div>
              <span className="font-['Plus_Jakarta_Sans',sans-serif] font-black text-lg text-[#174B38]">
                LifeLens AI
              </span>
            </div>
            <p className="text-[#78837B] leading-relaxed text-xs">
              Multilingual packaged food scanning, ingredient intelligence, and deterministic allergen detection.
            </p>
            <div className="inline-flex items-center gap-2 bg-white px-3 py-1 rounded-full border border-[#E6E7E0] text-[10px] font-bold text-[#174B38]">
              <span className="w-2 h-2 rounded-full bg-[#174B38] animate-ping" />
              <span>Offline Deterministic Core</span>
            </div>
          </div>

          {/* Quick Navigation Links */}
          <div className="space-y-3">
            <div className="font-['Plus_Jakarta_Sans',sans-serif] font-bold text-xs text-[#202923] uppercase tracking-wider">
              Navigation
            </div>
            <div className="flex flex-col gap-2">
              <Link to="/scan" className="hover:text-[#174B38] flex items-center gap-1.5 transition-colors">
                <Camera className="w-3.5 h-3.5 text-[#174B38] shrink-0" />
                <span>SmartScan Camera</span>
              </Link>
              <Link to="/explore" className="hover:text-[#174B38] flex items-center gap-1.5 transition-colors">
                <BookOpen className="w-3.5 h-3.5 text-[#174B38] shrink-0" />
                <span>Ingredient Explorer</span>
              </Link>
              <Link to="/chat" className="hover:text-[#174B38] flex items-center gap-1.5 transition-colors">
                <MessageSquare className="w-3.5 h-3.5 text-[#174B38] shrink-0" />
                <span>AI Food Assistant</span>
              </Link>
              <Link to="/compare" className="hover:text-[#174B38] flex items-center gap-1.5 transition-colors">
                <Scale className="w-3.5 h-3.5 text-[#174B38] shrink-0" />
                <span>Product Comparison</span>
              </Link>
              <Link to="/about" className="hover:text-[#174B38] flex items-center gap-1.5 transition-colors">
                <Info className="w-3.5 h-3.5 text-[#174B38] shrink-0" />
                <span>About & Methodology</span>
              </Link>
            </div>
          </div>

          {/* Regulatory Badges */}
          <div className="space-y-3">
            <div className="flex items-center gap-1.5 font-['Plus_Jakarta_Sans',sans-serif] font-bold text-xs text-[#202923] uppercase tracking-wider">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#174B38] shrink-0" />
              <span>Cited Regulatory Authorities</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {['FSSAI (India)', 'WHO / FAO JECFA', 'EFSA (Europe)', 'US FDA', 'Codex Alimentarius'].map((auth, idx) => (
                <span
                  key={idx}
                  className="bg-white px-2.5 py-1 rounded-lg border border-[#E6E7E0] text-[10px] font-semibold text-[#202923]"
                >
                  {auth}
                </span>
              ))}
            </div>
            <p className="text-[11px] text-[#78837B] leading-relaxed pt-1">
              Safety evaluations, Acceptable Daily Intakes (ADI), and permitted functions follow official regulatory decrees.
            </p>
          </div>

          {/* Legal / Safety Note */}
          <div className="space-y-3">
            <div className="flex items-center gap-1.5 font-['Plus_Jakarta_Sans',sans-serif] font-bold text-xs text-[#202923] uppercase tracking-wider">
              <FileText className="w-3.5 h-3.5 text-[#174B38] shrink-0" />
              <span>Safety & Medical Disclaimer</span>
            </div>
            <p className="text-[#78837B] leading-relaxed text-[11px]">
              LifeLens AI is an educational food label intelligence assistant. It does not provide medical diagnoses or guarantee the total absence of undeclared cross-contact allergens. Always inspect physical packaging and consult a certified healthcare professional.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-[#E6E7E0] flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-[#78837B]">
          <p>© 2026 LifeLens AI. Scan Smart. Understand What You Eat.</p>
          <div className="flex items-center gap-3">
            <span className="font-semibold text-[#174B38]">English • हिन्दी • తెలుగు</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
