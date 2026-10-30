from flask import Blueprint, jsonify, request
import uuid
import os
from werkzeug.utils import secure_filename
from app.config import Config
from app.services.image_processor import validate_image, preprocess_image
from app.services.ocr_service import extract_text

scan_bp = Blueprint('scan', __name__)


def allowed_file(filename):
    """Check if file extension is allowed."""
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in Config.ALLOWED_EXTENSIONS


@scan_bp.route('/api/scan', methods=['POST'])
def scan_label():
    """Upload and process a food label image."""
    if 'image' not in request.files:
        return jsonify({'error': 'No image file provided'}), 400

    file = request.files['image']
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400

    if not allowed_file(file.filename):
        return jsonify({
            'error': 'Invalid file type',
            'message': f'Allowed types: {", ".join(Config.ALLOWED_EXTENSIONS)}'
        }), 400

    # Generate safe UUID filename
    ext = file.filename.rsplit('.', 1)[1].lower()
    safe_filename = f"{uuid.uuid4().hex}.{ext}"
    filepath = os.path.join(Config.UPLOAD_FOLDER, safe_filename)

    try:
        file.save(filepath)

        # Validate image (actually decode it)
        validation = validate_image(filepath)
        if not validation['valid']:
            os.remove(filepath)
            return jsonify({
                'error': 'Invalid image',
                'message': validation.get('message', 'Could not decode image')
            }), 400

        # Preprocess image
        processed_path = preprocess_image(filepath)

        # Extract text via OCR
        ocr_result = extract_text(processed_path)

        # Clean up processed temp file if different from original
        if processed_path != filepath and os.path.exists(processed_path):
            os.remove(processed_path)

        return jsonify({
            'scan_id': uuid.uuid4().hex,
            'image_path': safe_filename,
            'quality': validation.get('quality', {}),
            'extracted_text': ocr_result.get('full_text', ''),
            'ingredients': ocr_result.get('ingredients', ''),
            'allergen_statement': ocr_result.get('allergen_statement', ''),
            'nutrition_text': ocr_result.get('nutrition_text', ''),
            'confidence': ocr_result.get('confidence', None),
            'warnings': ocr_result.get('warnings', [])
        })

    except Exception as e:
        if os.path.exists(filepath):
            os.remove(filepath)
        return jsonify({'error': 'Scan failed', 'message': 'Image processing failed. Please try a clearer image.'}), 500


@scan_bp.route('/api/extract', methods=['POST'])
def extract_from_image():
    """Extract text from an already-uploaded image."""
    data = request.get_json()
    if not data or 'image_path' not in data:
        return jsonify({'error': 'No image path provided'}), 400

    # Prevent path traversal
    image_name = os.path.basename(data['image_path'])
    filepath = os.path.join(Config.UPLOAD_FOLDER, image_name)

    if not os.path.exists(filepath):
        return jsonify({'error': 'Image not found'}), 404

    try:
        processed_path = preprocess_image(filepath)
        ocr_result = extract_text(processed_path)

        if processed_path != filepath and os.path.exists(processed_path):
            os.remove(processed_path)

        return jsonify({
            'extracted_text': ocr_result.get('full_text', ''),
            'ingredients': ocr_result.get('ingredients', ''),
            'allergen_statement': ocr_result.get('allergen_statement', ''),
            'nutrition_text': ocr_result.get('nutrition_text', ''),
            'confidence': ocr_result.get('confidence', None),
            'warnings': ocr_result.get('warnings', [])
        })
    except Exception:
        return jsonify({'error': 'Extraction failed'}), 500
