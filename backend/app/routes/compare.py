from flask import Blueprint, jsonify, request
from app.services.allergen_engine import analyze_allergens
from app.services.nutrition_engine import compare_nutrition

compare_bp = Blueprint('compare', __name__)


@compare_bp.route('/api/compare', methods=['POST'])
def compare_products():
    """Compare two products' allergen and nutrition data."""
    data = request.get_json()
    if not data:
        return jsonify({'error': 'No data provided'}), 400

    product_a = data.get('product_a')
    product_b = data.get('product_b')

    if not product_a or not product_b:
        return jsonify({'error': 'Two products are required for comparison'}), 400

    user_allergens = data.get('user_allergens', [])

    # Allergen analysis for both
    allergens_a = analyze_allergens(
        ingredients_text=product_a.get('ingredients', ''),
        allergen_statement=product_a.get('allergen_statement', ''),
        user_allergens=user_allergens
    )
    allergens_b = analyze_allergens(
        ingredients_text=product_b.get('ingredients', ''),
        allergen_statement=product_b.get('allergen_statement', ''),
        user_allergens=user_allergens
    )

    # Nutrition comparison
    nutrition_comparison = compare_nutrition(
        product_a.get('nutrition', {}),
        product_b.get('nutrition', {})
    )

    return jsonify({
        'product_a': {
            'name': product_a.get('name', 'Product A'),
            'allergen_analysis': allergens_a,
            'nutrition': product_a.get('nutrition', {})
        },
        'product_b': {
            'name': product_b.get('name', 'Product B'),
            'allergen_analysis': allergens_b,
            'nutrition': product_b.get('nutrition', {})
        },
        'nutrition_comparison': nutrition_comparison,
        'disclaimer': (
            'This comparison assists label interpretation only. '
            'Neither product is declared safe or unsafe. '
            'Always verify the actual packaging.'
        )
    })
