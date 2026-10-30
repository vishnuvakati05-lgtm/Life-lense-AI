# LifeLens AI — Architecture & Technical Specifications

"Scan Smart. Understand What You Eat."

LifeLens AI is a food intelligence platform designed as a shared-codebase web, PWA, and Capacitor Android application backed by a Python Flask microservice.

---

## 1. System Overview

```
                      [ User Devices ]
             Web Browser / PWA / Android APK
                            │
               ┌────────────┴────────────┐
               │  React 19 + TypeScript  │
               │   Tailwind CSS (Vite)   │
               │ Framer Motion & Lucide  │
               └────────────┬────────────┘
                            │ REST JSON API
                            ▼
               ┌─────────────────────────┐
               │    Python Flask Server  │
               └────────────┬────────────┘
         ┌──────────────────┼──────────────────┐
         ▼                  ▼                  ▼
┌─────────────────┐ ┌───────────────┐ ┌──────────────────┐
│   OCR Engine    │ │ Deterministic │ │ Conversational   │
│ Tesseract / CV2 │ │ Safety Engine │ │ AI (Gemini/Local)│
└─────────────────┘ └───────┬───────┘ └──────────────────┘
                            │
          ┌─────────────────┴─────────────────┐
          ▼                                   ▼
┌──────────────────┐                ┌──────────────────┐
│  Allergen Lens   │                │ Ingredient & INS │
│ (FSSAI/FDA Rules)│                │  Knowledge Base  │
└──────────────────┘                └──────────────────┘
```

---

## 2. Core Pillars

### 2.1 SmartScan & OCR Pipeline
1. **Camera Capture / Upload**: Mobile-preferred rear-camera streaming via `navigator.mediaDevices.getUserMedia` with flash/torch control and drag-and-drop fallback.
2. **Quality Pre-Processing**: OpenCV blur detection (`cv2.Laplacian`), luminance assessment, and adaptive thresholding.
3. **Text Extraction**: Tesseract OCR engine (v5.4.0) extracts raw strings.
4. **User Verification**: Extracted text is presented in an editable review panel before analysis, preventing OCR hallucination.

### 2.2 Deterministic Ingredient & Allergen Engines
- Operates locally without requiring external paid LLM calls.
- Allergen verification adheres to strict 4-state logic:
  - `POTENTIAL_ALLERGEN_DETECTED`
  - `PRECAUTIONARY_WARNING`
  - `NO_LISTED_MATCH_FOUND` (Explicitly states: does *not* guarantee food is allergen-free)
  - `UNABLE_TO_VERIFY`
- Food Chemical Explainer returns a structured 7-section response for any INS or chemical entity:
  1. Short Answer
  2. What It Is
  3. Why Manufacturers Add It
  4. What The Evidence Says (FSSAI, WHO/JECFA, EFSA, FDA)
  5. Potential Concerns & Limitations
  6. What We Do Not Know
  7. Authoritative Sources

### 2.3 Multilingual Conversational AI
- Full 3-language capability: English, हिन्दी (Hindi), and తెలుగు (Telugu).
- Context-grounded in the active product's ingredients and nutrition.
- Supports Web Speech API for low-latency client speech-to-text (STT) and text-to-speech (TTS).

