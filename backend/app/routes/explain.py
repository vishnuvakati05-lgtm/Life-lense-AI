from flask import Blueprint, jsonify, request
from app.services.ingredient_engine import explain_food_chemical

explain_bp = Blueprint('explain', __name__)


@explain_bp.route('/api/ingredient/explain', methods=['GET', 'POST'])
def explain_ingredient():
    """
    Dedicated Food Chemical Explainer:
    Accepts query (e.g. 'INS 621', '319', 'TBHQ', 'Aspartame') and language.
    Supports both POST json payload and GET query parameters.
    Returns 7-section structured breakdown.
    """
    if request.method == 'POST':
        data = request.get_json(silent=True) or {}
        query = data.get('query', '').strip()
        language = data.get('language', 'en')
    else:
        query = request.args.get('query', '').strip()
        language = request.args.get('lang', request.args.get('language', 'en'))

    if not query:
        return jsonify({
            'found': False,
            'error': 'No ingredient or query provided',
            'message': 'Please provide an ingredient name or INS code to explain.'
        }), 400

    result = explain_food_chemical(query, language=language)
    return jsonify(result)
