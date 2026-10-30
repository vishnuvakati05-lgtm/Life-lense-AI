"""LifeLens AI — Backend Server Entry Point"""

import sys
import os

# Fix Windows console UTF-8 encoding issues (charmap cp1252 crashes)
if sys.platform.startswith("win"):
    try:
        if hasattr(sys.stdout, "reconfigure"):
            sys.stdout.reconfigure(encoding="utf-8", errors="replace")
        if hasattr(sys.stderr, "reconfigure"):
            sys.stderr.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass

# Set environment variable for child processes
os.environ["PYTHONIOENCODING"] = "utf-8"

from app import create_app

app = create_app()

if __name__ == '__main__':
    print("[WARNING] Running Flask development server. Do not use in production.")
    print("[READY] LifeLens AI backend starting at http://localhost:5000")
    try:
        # use_reloader=False prevents orphaned child processes on Windows with concurrently
        app.run(debug=True, host='0.0.0.0', port=5000, use_reloader=False)
    except OSError as e:
        if "10048" in str(e) or "address already in use" in str(e).lower():
            print("\n[ERROR] Port 5000 is already occupied by an active process.")
            print("[TIP] Run: taskkill /F /IM python.exe (or kill the existing process on port 5000) and retry.")
        else:
            print(f"\n[ERROR] Flask server failed to start: {e}")
        sys.exit(1)
