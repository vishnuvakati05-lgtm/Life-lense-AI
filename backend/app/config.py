import os
from dotenv import load_dotenv

load_dotenv()

# Detect default tesseract path on Windows
default_tess = None
win_tess_path = r'C:\Program Files\Tesseract-OCR\tesseract.exe'
if os.path.exists(win_tess_path):
    default_tess = win_tess_path


class Config:
    """Application configuration."""
    SECRET_KEY = os.environ.get('SECRET_KEY', os.urandom(32).hex())
    DATABASE_PATH = os.environ.get('DATABASE_PATH', os.path.join(os.path.dirname(os.path.dirname(__file__)), 'lifelens.db'))
    UPLOAD_FOLDER = os.environ.get('UPLOAD_FOLDER', os.path.join(os.path.dirname(os.path.dirname(__file__)), 'uploads'))
    MAX_CONTENT_LENGTH = 10 * 1024 * 1024  # 10 MB max upload
    ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'webp', 'bmp'}
    CORS_ORIGINS = os.environ.get('CORS_ORIGINS', 'http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173').split(',')
    OPEN_FOOD_FACTS_URL = 'https://world.openfoodfacts.org/api/v2/product'
    TESSERACT_CMD = os.environ.get('TESSERACT_CMD', default_tess)
    TEMP_IMAGE_RETENTION_SECONDS = 3600  # 1 hour
    RATE_LIMIT_PER_MINUTE = int(os.environ.get('RATE_LIMIT_PER_MINUTE', '30'))
