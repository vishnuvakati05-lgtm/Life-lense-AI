from flask import Blueprint, jsonify, request
from app.services.barcode_service import lookup_barcode

barcode_bp = Blueprint('barcode', __name__)


@barcode_bp.route('/api/barcode', methods=['POST'])
@barcode_bp.route('/api/barcode/lookup', methods=['POST'])
def barcode_lookup():
    """Look up a product by barcode using Open Food Facts."""
    data = request.get_json()
    if not data or 'barcode' not in data:
        return jsonify({'error': 'No barcode provided'}), 400

    barcode = str(data['barcode']).strip()
    if not barcode:
        return jsonify({'error': 'Empty barcode'}), 400

    result = lookup_barcode(barcode)
    
    if result.get('found'):
        return jsonify(result)
    else:
        return jsonify({
            'found': False,
            'barcode': barcode,
            'message': result.get('message', 'Product not found in Open Food Facts database'),
            'suggestion': 'Try uploading a photo of the physical ingredient label instead.'
        }), 404
