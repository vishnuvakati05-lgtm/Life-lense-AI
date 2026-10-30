# LifeLens AI — Automated & Manual Testing Guide

## 1. Automated Test Suite

Run backend test suite with Pytest:
```bash
cd backend
python -m pytest
```

### Coverage:
- `test_ingredient_engine.py`:
  - Ingredient string parsing with nested parentheses and brackets
  - Extraction of INS/E numbers (e.g. INS 500(ii), 503(ii), 621, 319)
  - 7-section structured Food Chemical Explainer verification
  - Multilingual summaries in English, Hindi, and Telugu
- `test_allergen_and_nutrition.py`:
  - Direct allergen match vs precautionary cross-contact detection
  - Guarantee that the system never reports an unverified food as "allergen-free"
  - Sodium-to-salt conversions and missing value handling
- `test_api_endpoints.py`:
  - Endpoints: `/api/health`, `/api/ingredient/explain`, `/api/analyze`, `/api/chat`

---

## 2. Frontend Production Verification

```bash
cd frontend
npm run build
```
Builds the Vite application with zero TypeScript and bundle errors.

---

## 3. OCR Quality Evaluation

Run synthetic label OCR verification:
```bash
cd backend
python -c "
from app.services.ocr_service import extract_text
# Tests Tesseract OCR accuracy on packaging imagery
"
```

