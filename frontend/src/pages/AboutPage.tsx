import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  CheckCircle2,
  BookOpen,
  Camera,
  Globe,
  Sparkles,
  Info,
  ArrowRight,
  HeartHandshake
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AboutPage: React.FC = () => {
  const navigate = useNavigate();
  const { language } = useApp();

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-20 animate-fade-in">
      {/* Hero Header */}
      <section className="bg-white p-8 sm:p-12 rounded-3xl border border-[#E6E7E0] shadow-xs space-y-4">
        <div className="inline-flex items-center gap-2 bg-[#EEF8DC] px-3.5 py-1.5 rounded-full text-xs font-bold text-[#174B38] border border-[#D7EDB2]">
          <ShieldCheck className="w-3.5 h-3.5 text-[#174B38] shrink-0" />
          <span>Our Mission & Scientific Foundation</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black font-['Plus_Jakarta_Sans',sans-serif] text-[#174B38] tracking-tight">
          Know What&apos;s Inside.<br />Make Smarter Food Choices.
        </h1>
        <p className="text-sm sm:text-base text-[#78837B] leading-relaxed max-w-2xl font-normal">
          LifeLens AI was built to demystify complex packaged food labels. By combining camera OCR, verified regulatory additive dictionaries, and conversational AI in English, Hindi, and Telugu, we empower consumers to understand exactly what they are eating.
        </p>
      </section>

      {/* Core Pillars */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-7 rounded-3xl border border-[#E6E7E0] space-y-3 card-hover">
          <div className="w-10 h-10 rounded-2xl bg-[#EEF8DC] text-[#174B38] flex items-center justify-center font-bold">
            <CheckCircle2 className="w-5 h-5 text-[#174B38] shrink-0" />
          </div>
          <h3 className="font-['Plus_Jakarta_Sans',sans-serif] font-bold text-lg text-[#202923]">
            Zero-Hallucination Core
          </h3>
          <p className="text-xs text-[#78837B] leading-relaxed">
            All allergen matches and INS additive lookups use deterministic matching logic and published regulatory limits before querying generative AI.
          </p>
        </div>

        <div className="bg-white p-7 rounded-3xl border border-[#E6E7E0] space-y-3 card-hover">
          <div className="w-10 h-10 rounded-2xl bg-[#EEF8DC] text-[#174B38] flex items-center justify-center font-bold">
            <Globe className="w-5 h-5 text-[#174B38] shrink-0" />
          </div>
          <h3 className="font-['Plus_Jakarta_Sans',sans-serif] font-bold text-lg text-[#202923]">
            Trilingual Accessibility
          </h3>
          <p className="text-xs text-[#78837B] leading-relaxed">
            Full support across English, हिन्दी, and తెలుగు. We preserve international chemical identifiers while translating practical explanations.
          </p>
        </div>

        <div className="bg-white p-7 rounded-3xl border border-[#E6E7E0] space-y-3 card-hover">
          <div className="w-10 h-10 rounded-2xl bg-[#EEF8DC] text-[#174B38] flex items-center justify-center font-bold">
            <HeartHandshake className="w-5 h-5 text-[#174B38] shrink-0" />
          </div>
          <h3 className="font-['Plus_Jakarta_Sans',sans-serif] font-bold text-lg text-[#202923]">
            Consumer Privacy First
          </h3>
          <p className="text-xs text-[#78837B] leading-relaxed">
            Your allergy profile and scanning history remain on your personal device. Audio synthesis is generated natively without retaining recordings.
          </p>
        </div>
      </section>

      {/* Regulatory Standards Section */}
      <section className="bg-white p-8 sm:p-10 rounded-3xl border border-[#E6E7E0] space-y-6">
        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl font-black font-['Plus_Jakarta_Sans',sans-serif] text-[#174B38]">
            Cited Regulatory Authorities
          </h2>
          <p className="text-xs text-[#78837B]">
            Our ingredient dossiers synthesize consensus from top health authorities worldwide:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-[#F8F8F2] border border-[#E6E7E0] space-y-1">
            <strong className="text-[#174B38] block text-sm">FSSAI (India)</strong>
            <p className="text-[#78837B]">
              Food Safety and Standards Authority of India (Food Products Standards and Food Additives Regulations).
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-[#F8F8F2] border border-[#E6E7E0] space-y-1">
            <strong className="text-[#174B38] block text-sm">WHO / FAO JECFA</strong>
            <p className="text-[#78837B]">
              Joint FAO/WHO Expert Committee on Food Additives (Acceptable Daily Intake & toxicological assessments).
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-[#F8F8F2] border border-[#E6E7E0] space-y-1">
            <strong className="text-[#174B38] block text-sm">EFSA (European Union)</strong>
            <p className="text-[#78837B]">
              European Food Safety Authority scientific panels on food contact materials and additives.
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-[#F8F8F2] border border-[#E6E7E0] space-y-1">
            <strong className="text-[#174B38] block text-sm">US FDA</strong>
            <p className="text-[#78837B]">
              United States Food and Drug Administration Generally Recognized As Safe (GRAS) schedules.
            </p>
          </div>
        </div>
      </section>

      {/* Safety & Medical Disclaimer */}
      <section className="bg-[#F8F8F2] p-6 rounded-3xl border border-[#E6E7E0] flex items-start gap-3.5 text-xs text-[#78837B] leading-relaxed">
        <Info className="w-5 h-5 text-[#174B38] shrink-0 mt-0.5" />
        <div>
          <strong className="text-[#202923] block mb-0.5">Medical & Safety Notice:</strong>
          LifeLens AI assists food label interpretation and provides educational context. It does not provide medical diagnoses, treatment recommendations, or guarantee complete absence of undeclared allergens or cross-contact contamination. Always inspect physical packaging and consult a certified medical professional for allergy management.
        </div>
      </section>

      {/* Action CTA */}
      <section className="text-center pt-4">
        <button
          onClick={() => navigate('/scan')}
          className="btn-primary"
        >
          <Camera className="w-4 h-4 shrink-0" />
          <span>Start Scanning Food Labels</span>
          <ArrowRight className="w-4 h-4 shrink-0 ml-1" />
        </button>
      </section>
    </div>
  );
};

