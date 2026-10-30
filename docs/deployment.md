# LifeLens AI — Deployment & Android Build Guide

## 1. Local Development Setup

### Backend (Python Flask)
```bash
cd backend
pip install -r requirements.txt
python run.py
# Server starts at http://localhost:5000
```

### Frontend (React + Vite)
```bash
cd frontend
npm install
npm run dev
# Vite dev server starts at http://localhost:5173
```

---

## 2. Capacitor Android Build

LifeLens AI uses Capacitor to compile the shared React frontend into a native Android APK.

### Steps:
1. Build frontend web assets:
```bash
cd frontend
npm run build
```
2. Initialize and sync Capacitor Android:
```bash
npx cap add android
npx cap sync android
```
3. Open in Android Studio:
```bash
npx cap open android
```
4. Build Debug or Release APK from Android Studio:
`Build > Build Bundle(s) / APK(s) > Build APK(s)`

### Android Permissions (configured in `AndroidManifest.xml`):
- `android.permission.CAMERA`: Required for live label scanning.
- `android.permission.RECORD_AUDIO`: Required for voice conversation.
- `android.permission.INTERNET`: Required for Open Food Facts barcode lookups.

