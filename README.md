# LifeLens AI 🔍🥗
### "Scan Smart. Understand What You Eat."

LifeLens AI is a modern food intelligence platform available as a responsive website, an installable Progressive Web App (PWA), and an Android application built using Capacitor.

It empowers consumers to scan packaged food labels, decode food additives and INS/E-numbers, identify potential allergens, and ask follow-up questions through voice or text in **English**, **हिन्दी (Hindi)**, and **తెలుగు (Telugu)**.

---

## 🌟 Key Features

1. **SmartScan & OCR Engine**:
   - Live camera view with rear-camera preference on mobile devices and torch toggle.
   - Upload & dropzone fallback for pre-captured images.
   - Image pre-processing with OpenCV blur and luminance assessment.
   - Tesseract OCR text extraction.
   - **User Verification Review**: Allows users to inspect and correct extracted text before running analysis to eliminate hallucination.

2. **Deterministic Allergen Lens**:
   - User-configurable allergy profile (Milk, Eggs, Peanuts, Tree Nuts, Soy, Wheat/Gluten, Fish, Shellfish, Sesame, Mustard, Sulphites + custom allergens).
   - Clear 4-state result:
     - `POTENTIAL ALLERGEN MATCH`
     - `PRECAUTIONARY WARNING`
     - `NO LISTED MATCH FOUND`
     - `UNABLE TO VERIFY`
   - Explicit safety disclaimer: *Never claims a food is allergen-free based solely on an ingredient list.*

3. **Food Chemical Explainer ("Understand This Ingredient")**:
   - Structured 7-section scientific breakdown:
     1. Short Answer
     2. What It Is
     3. Why Manufacturers Add It
     4. What The Evidence Says (FSSAI, WHO/JECFA, EFSA, FDA)
     5. Potential Concerns & Limitations
     6. What We Do Not Know
     7. Authoritative Sources

4. **Three-Language Conversational Assistant**:
   - Persistent language selector (English, Hindi, Telugu).
   - Conversational AI grounded strictly in the currently scanned product's ingredients.
   - Native voice STT & TTS with Web Speech API.
   - Works 100% locally without requiring a paid LLM API key; optionally supports Gemini and OpenAI.

5. **Nutrition Lens & Barcode Lookup**:
   - Macro and micronutrients per serving and per 100g.
   - Transparent sodium-to-salt calculation.
   - Barcode camera and manual search via Open Food Facts.

---

## 📂 Project Structure

```
LifeLens-AI/
├── backend/
│   ├── app/
│   │   ├── routes/          # API endpoints (scan, analyze, explain, chat, barcode, history)
│   │   ├── services/        # OCR, Allergen Engine, Ingredient Engine, Nutrition Engine, Chat, Voice
│   │   ├── config.py        # Environment & Tesseract path auto-detection
│   │   ├── models.py        # SQLite schema & persistence
│   │   └── __init__.py      # Flask app factory & CORS configuration
│   ├── tests/               # Automated Pytest test suite (14 passing tests)
│   ├── requirements.txt     # Python backend dependencies
│   └── run.py               # Development server runner
├── frontend/
│   ├── src/
│   │   ├── components/      # Header, Footer, MobileBottomNav
│   │   ├── context/         # AppContext (global state, i18n, voice synthesis)
│   │   ├── pages/           # Home, SmartScan, Results, IngredientExplorer, AIFoodChat, Compare, History, Settings
│   │   ├── services/        # Typed API client
│   │   ├── types/           # TypeScript domain interfaces
│   │   └── i18n/            # Translations (English, Hindi, Telugu)
│   ├── capacitor.config.ts  # Capacitor Android configuration
│   └── package.json
├── knowledge_base/          # Additives, sources, and regulatory registry
├── docs/                    # Architecture, Privacy, Testing, and Deployment guides
├── .env.example
└── README.md
```

---

## 🚀 Quickstart Guide

### 1. Backend Server Setup
```bash
cd backend
pip install -r requirements.txt
python run.py
# Server runs on http://localhost:5000
```

### 2. Frontend Web Setup
```bash
cd frontend
npm install
npm run dev
# App runs on http://localhost:5173
```

### 3. Run Automated Tests
```bash
cd backend
python -m pytest
```

---

## 📱 Android App (Capacitor)
```bash
cd frontend
npm run build
npx cap add android
npx cap sync android
npx cap open android
```
Build and run the Android app in Android Studio.

---

## ⚖️ Scientific & Safety Grounding
LifeLens AI adheres to strict regulatory citations from:
- **FSSAI** (Food Safety and Standards Authority of India)
- **WHO / FAO JECFA** (Joint Expert Committee on Food Additives)
- **EFSA** (European Food Safety Authority)
- **US FDA** (Food and Drug Administration)

