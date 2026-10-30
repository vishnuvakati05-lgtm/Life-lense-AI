from flask import Blueprint, jsonify, request
from app.services.allergen_engine import analyze_allergens
from app.services.nutrition_engine import analyze_nutrition
from app.services.ingredient_engine import analyze_all_ingredients
from app.models import get_or_create_default_profile, save_scan
import json
import uuid

analyze_bp = Blueprint('analyze', __name__)


@analyze_bp.route('/api/analyze', methods=['POST'])
def analyze_label():
    """Analyze extracted label data for allergens, nutrition, and ingredient intelligence."""
    data = request.get_json()
    if not data:
        return jsonify({'error': 'No data provided'}), 400

    ingredients_text = data.get('ingredients', '')
    allergen_statement = data.get('allergen_statement', '')
    nutrition_data = data.get('nutrition', {})
    product_name = data.get('product_name', 'Unknown Product')
    user_allergens = data.get('user_allergens', None)
    language = data.get('language', 'en')

    # Get user profile allergens if not provided
    if user_allergens is None:
        profile = get_or_create_default_profile()
        allergens_raw = profile.get('allergens', '[]')
        if isinstance(allergens_raw, str):
            try:
                user_allergens = json.loads(allergens_raw)
            except (json.JSONDecodeError, TypeError):
                user_allergens = []
        else:
            user_allergens = allergens_raw

    # 1. Analyze allergens deterministically
    allergen_results = analyze_allergens(
        ingredients_text=ingredients_text,
        allergen_statement=allergen_statement,
        user_allergens=user_allergens
    )

    # 2. Analyze nutrition facts
    nutrition_results = analyze_nutrition(nutrition_data)

    # 3. Analyze ingredient intelligence & additives
    ingredient_results = analyze_all_ingredients(ingredients_text, language=language)

    # Build response
    scan_id = data.get('scan_id', uuid.uuid4().hex)
    
    # Determine overall status
    has_detected = any(r['status'] == 'POTENTIAL_ALLERGEN_DETECTED' for r in allergen_results.get('matches', []))
    has_warning = any(r['status'] == 'PRECAUTIONARY_WARNING' for r in allergen_results.get('matches', []))
    has_unable = allergen_results.get('unable_to_verify', False)

    if has_detected:
        overall_status = 'POTENTIAL_ALLERGEN_DETECTED'
    elif has_warning:
        overall_status = 'PRECAUTIONARY_WARNING'
    elif has_unable:
        overall_status = 'UNABLE_TO_VERIFY'
    else:
        overall_status = 'NO_LISTED_MATCH_FOUND'

    response = {
        'scan_id': scan_id,
        'product_name': product_name,
        'overall_status': overall_status,
        'allergen_analysis': allergen_results,
        'nutrition_analysis': nutrition_results,
        'ingredient_intelligence': ingredient_results,
        'extracted_ingredients': ingredients_text,
        'extracted_allergen_statement': allergen_statement,
        'short_summary': ingredient_results.get('summary', ''),
        'limitations': allergen_results.get('limitations', []),
        'disclaimer': (
            'This analysis assists label interpretation only. '
            'It does not guarantee food safety. '
            'Always verify the actual physical packaging and consult a healthcare professional '
            'for severe dietary allergies.'
        )
    }

    # Save scan record
    try:
        profile = get_or_create_default_profile()
        save_scan({
            'id': scan_id,
            'profile_id': profile['id'],
            'product_name': product_name,
            'extracted_ingredients': ingredients_text,
            'extracted_nutrition': nutrition_data,
            'allergen_results': allergen_results,
            'nutrition_analysis': nutrition_results,
            'data_source': data.get('data_source', 'ocr')
        })
    except Exception:
        pass  # Non-fatal

    return jsonify(response)


@analyze_bp.route('/api/allergens/check', methods=['POST'])
def check_allergens_endpoint():
    """Deterministic standalone allergen check."""
    data = request.get_json() or {}
    ingredients_text = data.get('ingredients', '')
    allergen_statement = data.get('allergen_statement', '')
    user_allergens = data.get('user_allergens', [])
    result = analyze_allergens(ingredients_text, allergen_statement, user_allergens)
    return jsonify(result)


@analyze_bp.route('/api/nutrition/analyze', methods=['POST'])
def analyze_nutrition_endpoint():
    """Standalone nutrition analysis."""
    data = request.get_json() or {}
    nutrition_data = data.get('nutrition', {})
    result = analyze_nutrition(nutrition_data)
    return jsonify(result)
