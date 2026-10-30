"""
LifeLens AI — Unified Single-Command Runner
Launches both Python Backend (Flask on :5000) and Frontend (Vite on :5173) together.
Gracefully stops both services on Ctrl+C.
"""

import os
import sys
import subprocess
import time
import signal
from threading import Thread

# Force UTF-8 encoding for Python IO
os.environ["PYTHONIOENCODING"] = "utf-8"
if sys.platform == "win32" and hasattr(sys.stdout, "reconfigure"):
    try:
        sys.stdout.reconfigure(encoding='utf-8', errors='replace')
    except Exception:
        pass

ROOT_DIR = os.path.dirname(os.path.abspath(__file__))
BACKEND_DIR = os.path.join(ROOT_DIR, "backend")
FRONTEND_DIR = os.path.join(ROOT_DIR, "frontend")

# Colors for terminal output
CYAN = "\033[96m"
GREEN = "\033[92m"
YELLOW = "\033[93m"
RESET = "\033[0m"
BOLD = "\033[1m"


def safe_print(msg: str):
    """Safely print strings even on restrictive Windows code pages."""
    try:
        print(msg)
    except UnicodeEncodeError:
        print(msg.encode('ascii', errors='replace').decode('ascii'))


def stream_logs(pipe, prefix, color):
    """Read lines from subprocess pipe and print with colored prefix."""
    try:
        for line in iter(pipe.readline, ''):
            if line:
                clean_line = line.rstrip()
                safe_print(f"{color}[{prefix}]{RESET} {clean_line}")
    except (ValueError, OSError):
        pass


def main():
    safe_print(f"\n{BOLD}{GREEN}=================================================={RESET}")
    safe_print(f"{BOLD}{GREEN}  LifeLens AI -- Unified Development Environment  {RESET}")
    safe_print(f"{BOLD}{GREEN}  'Scan Smart. Understand What You Eat.'          {RESET}")
    safe_print(f"{BOLD}{GREEN}=================================================={RESET}\n")
    safe_print(f"{CYAN}-> Starting Flask Backend at  {BOLD}http://localhost:5000{RESET}")
    safe_print(f"{GREEN}-> Starting Vite Frontend at   {BOLD}http://localhost:5173{RESET}")
    safe_print(f"{YELLOW}-> Press Ctrl+C anytime to stop both services.{RESET}\n")

    # Determine command for npm
    npm_cmd = "npm.cmd" if sys.platform == "win32" else "npm"

    # Start Backend
    backend_proc = subprocess.Popen(
        [sys.executable, "run.py"],
        cwd=BACKEND_DIR,
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
        text=True,
        encoding='utf-8',
        errors='replace',
        bufsize=1
    )

    # Start Frontend
    frontend_proc = subprocess.Popen(
        [npm_cmd, "run", "dev"],
        cwd=FRONTEND_DIR,
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
        text=True,
        encoding='utf-8',
        errors='replace',
        bufsize=1
    )

    # Threads to stream output
    t_backend = Thread(target=stream_logs, args=(backend_proc.stdout, "BACKEND", CYAN), daemon=True)
    t_frontend = Thread(target=stream_logs, args=(frontend_proc.stdout, "FRONTEND", GREEN), daemon=True)

    t_backend.start()
    t_frontend.start()

    def cleanup(signum=None, frame=None):
        safe_print(f"\n{YELLOW}Stopping LifeLens AI backend & frontend...{RESET}")
        try:
            if sys.platform == "win32":
                subprocess.call(['taskkill', '/F', '/T', '/PID', str(backend_proc.pid)], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
                subprocess.call(['taskkill', '/F', '/T', '/PID', str(frontend_proc.pid)], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
            else:
                backend_proc.terminate()
                frontend_proc.terminate()
        except Exception:
            pass
        safe_print(f"{GREEN}Both services stopped successfully.{RESET}\n")
        sys.exit(0)

    signal.signal(signal.SIGINT, cleanup)
    if hasattr(signal, "SIGTERM"):
        signal.signal(signal.SIGTERM, cleanup)

    try:
        while True:
            time.sleep(0.5)
            if backend_proc.poll() is not None:
                safe_print(f"{YELLOW}Backend process terminated with code {backend_proc.returncode}{RESET}")
                cleanup()
            if frontend_proc.poll() is not None:
                safe_print(f"{YELLOW}Frontend process terminated with code {frontend_proc.returncode}{RESET}")
                cleanup()
    except KeyboardInterrupt:
        cleanup()


if __name__ == "__main__":
    main()
