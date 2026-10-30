"""
LifeLens AI — Nutrition Intelligence Engine

Deterministic nutrition analysis service.
Parses numeric values and units, handles serving sizes,
and provides transparent, evidence-based nutrition explanations.

Rules:
- Treat absent nutrient values as unknown, not zero
- Use documented, configurable reference criteria
- Explain the reason behind every nutrition suggestion
- Never diagnose disease or prescribe diets
"""

import re
from typing import Optional


# WHO/FDA Daily Reference Values (for general adult reference)
# These are configurable reference values, not medical prescriptions
DAILY_REFERENCE_VALUES = {
    'calories': {'value': 2000, 'unit': 'kcal', 'label': 'Calories'},
    'total_fat': {'value': 65, 'unit': 'g', 'label': 'Total Fat'},
    'saturated_fat': {'value': 20, 'unit': 'g', 'label': 'Saturated Fat'},
    'trans_fat': {'value': 0, 'unit': 'g', 'label': 'Trans Fat', 'note': 'WHO recommends minimizing'},
    'cholesterol': {'value': 300, 'unit': 'mg', 'label': 'Cholesterol'},
    'sodium': {'value': 2300, 'unit': 'mg', 'label': 'Sodium'},
    'total_carbohydrates': {'value': 300, 'unit': 'g', 'label': 'Total Carbohydrates'},
    'dietary_fiber': {'value': 25, 'unit': 'g', 'label': 'Dietary Fiber'},
    'total_sugars': {'value': 50, 'unit': 'g', 'label': 'Total Sugars'},
    'added_sugars': {'value': 25, 'unit': 'g', 'label': 'Added Sugars', 'note': 'WHO recommends limiting'},
    'protein': {'value': 50, 'unit': 'g', 'label': 'Protein'},
    'caffeine': {'value': 400, 'unit': 'mg', 'label': 'Caffeine', 'note': 'General adult guidance'},
}

# Sodium to salt conversion factor: salt (g) = sodium (mg) × 2.5 / 1000
SODIUM_TO_SALT_FACTOR = 2.5 / 1000  # mg sodium to g salt


def parse_nutrient_value(value_str) -> Optional[dict]:
    """
    Parse a nutrient value string into numeric value and unit.
    Handles formats like: "150 kcal", "12g", "500 mg", "2.5 g", "<1g", "15%"
    """
    if value_str is None:
        return None
    
    if isinstance(value_str, (int, float)):
        return {'value': float(value_str), 'unit': '', 'raw': str(value_str)}
    
    value_str = str(value_str).strip()
    if not value_str or value_str.lower() in ['', '-', 'n/a', 'na', 'nil', 'none', 'unknown']:
        return None
    
    # Handle "less than" patterns
    less_than = False
    if value_str.startswith('<') or value_str.lower().startswith('less than'):
        less_than = True
        value_str = re.sub(r'^<\s*|^less than\s*', '', value_str, flags=re.IGNORECASE)
    
    # Extract numeric value and unit
    match = re.match(r'([\d,.]+)\s*(%|kcal|kj|cal|g|mg|mcg|μg|ug|ml|l|iu)?', value_str, re.IGNORECASE)
    if match:
        num_str = match.group(1).replace(',', '')
        try:
            value = float(num_str)
            unit = (match.group(2) or '').lower()
            return {
                'value': value,
                'unit': unit,
                'less_than': less_than,
                'raw': value_str
            }
        except ValueError:
            return None
    
    return None


def convert_sodium_to_salt(sodium_mg: float) -> float:
    """Convert sodium (mg) to salt (g) using standard factor."""
    return round(sodium_mg * SODIUM_TO_SALT_FACTOR, 2)


def convert_salt_to_sodium(salt_g: float) -> float:
    """Convert salt (g) to sodium (mg) using standard factor."""
    return round(salt_g / SODIUM_TO_SALT_FACTOR, 1)


def calculate_per_100(value: float, serving_size_g: float) -> Optional[float]:
    """Calculate per-100g value from per-serving value."""
    if serving_size_g and serving_size_g > 0:
        return round((value / serving_size_g) * 100, 2)
    return None


def calculate_per_serving(value_per_100: float, serving_size_g: float) -> Optional[float]:
    """Calculate per-serving value from per-100g value."""
    if serving_size_g and serving_size_g > 0:
        return round((value_per_100 / 100) * serving_size_g, 2)
    return None


def analyze_nutrition(nutrition_data: dict) -> dict:
    """
    Analyze nutrition data and provide transparent explanations.
    
    Args:
        nutrition_data: Dict with nutrient names as keys and values/units
        
    Returns:
        Analysis result with parsed values, %DV, and explanations
    """
    if not nutrition_data:
        return {
            'nutrients': {},
            'serving_info': None,
            'explanations': ['No nutrition data available for analysis.'],
            'limitations': ['Nutrition information was not provided or could not be extracted.'],
            'caffeine_info': None
        }
    
    result = {
        'nutrients': {},
        'serving_info': None,
        'explanations': [],
        'limitations': [],
        'caffeine_info': None
    }
    
    # Parse serving size
    serving_size = nutrition_data.get('serving_size')
    serving_parsed = parse_nutrient_value(serving_size)
    if serving_parsed:
        result['serving_info'] = {
            'value': serving_parsed['value'],
            'unit': serving_parsed.get('unit', 'g'),
            'raw': serving_parsed.get('raw', str(serving_size))
        }
    
    # Parse each nutrient
    nutrient_mapping = {
        'calories': 'calories',
        'energy': 'calories',
        'total_fat': 'total_fat',
        'fat': 'total_fat',
        'saturated_fat': 'saturated_fat',
        'trans_fat': 'trans_fat',
        'cholesterol': 'cholesterol',
        'sodium': 'sodium',
        'salt': 'sodium',  # Will need conversion
        'total_carbohydrates': 'total_carbohydrates',
        'carbohydrates': 'total_carbohydrates',
        'carbs': 'total_carbohydrates',
        'dietary_fiber': 'dietary_fiber',
        'fiber': 'dietary_fiber',
        'fibre': 'dietary_fiber',
        'total_sugars': 'total_sugars',
        'sugars': 'total_sugars',
        'sugar': 'total_sugars',
        'added_sugars': 'added_sugars',
        'protein': 'protein',
        'caffeine': 'caffeine',
    }
    
    for raw_key, raw_value in nutrition_data.items():
        if raw_key in ('serving_size', 'servings_per_container'):
            continue
        
        normalized_key = raw_key.lower().strip().replace(' ', '_')
        mapped_key = nutrient_mapping.get(normalized_key)
        
        if not mapped_key:
            continue
        
        parsed = parse_nutrient_value(raw_value)
        if not parsed:
            result['nutrients'][mapped_key] = {
                'status': 'unknown',
                'raw_value': raw_value,
                'note': f'{DAILY_REFERENCE_VALUES.get(mapped_key, {}).get("label", mapped_key)}: value could not be parsed'
            }
            continue
        
        # Handle salt-to-sodium conversion
        if normalized_key == 'salt' and mapped_key == 'sodium':
            if parsed['unit'] in ('g', ''):
                parsed['value'] = convert_salt_to_sodium(parsed['value'])
                parsed['unit'] = 'mg'
                parsed['converted_from'] = f"{raw_value} salt"
        
        ref = DAILY_REFERENCE_VALUES.get(mapped_key, {})
        ref_value = ref.get('value')
        ref_label = ref.get('label', mapped_key)
        
        nutrient_info = {
            'value': parsed['value'],
            'unit': parsed.get('unit', ref.get('unit', '')),
            'status': 'known',
            'raw_value': raw_value,
        }
        
        if parsed.get('less_than'):
            nutrient_info['less_than'] = True
        if parsed.get('converted_from'):
            nutrient_info['converted_from'] = parsed['converted_from']
        
        # Calculate %DV if reference exists
        if ref_value and ref_value > 0:
            pct = round((parsed['value'] / ref_value) * 100, 1)
            nutrient_info['percent_daily_value'] = pct
            
            # Generate explanation
            if pct >= 20:
                level = 'high'
                nutrient_info['level'] = 'high'
                result['explanations'].append(
                    f"{ref_label}: {parsed['value']}{parsed.get('unit', '')} per serving "
                    f"is {pct}% of the daily reference value ({ref_value}{ref.get('unit', '')}), "
                    f"which is considered high."
                )
            elif pct <= 5:
                level = 'low'
                nutrient_info['level'] = 'low'
            else:
                level = 'moderate'
                nutrient_info['level'] = 'moderate'
        
        result['nutrients'][mapped_key] = nutrient_info
    
    # Distinguish total vs added sugars
    if 'total_sugars' in result['nutrients'] and 'added_sugars' in result['nutrients']:
        total = result['nutrients']['total_sugars'].get('value', 0)
        added = result['nutrients']['added_sugars'].get('value', 0)
        if total > 0 and added > 0:
            natural = total - added
            result['explanations'].append(
                f"Of the {total}g total sugars, {added}g are added sugars "
                f"and approximately {round(natural, 1)}g are naturally occurring."
            )
    
    # Sodium/salt info
    sodium_data = result['nutrients'].get('sodium', {})
    if sodium_data.get('status') == 'known':
        sodium_mg = sodium_data['value']
        salt_g = convert_sodium_to_salt(sodium_mg)
        sodium_data['equivalent_salt_g'] = salt_g
        result['explanations'].append(
            f"Sodium: {sodium_mg}mg is equivalent to approximately {salt_g}g of salt."
        )
    
    # Caffeine info
    caffeine_data = result['nutrients'].get('caffeine', {})
    if caffeine_data.get('status') == 'known':
        result['caffeine_info'] = {
            'amount_mg': caffeine_data['value'],
            'per_serving': True,
            'note': 'Caffeine content per serving as listed on label.'
        }
    
    # Add limitations
    if not result['nutrients']:
        result['limitations'].append('No recognizable nutrient values could be parsed.')
    
    missing_common = []
    for key in ['calories', 'total_fat', 'sodium', 'total_sugars', 'protein']:
        if key not in result['nutrients'] or result['nutrients'][key].get('status') == 'unknown':
            missing_common.append(DAILY_REFERENCE_VALUES.get(key, {}).get('label', key))
    
    if missing_common:
        result['limitations'].append(
            f"The following common nutrients were not found or could not be parsed: "
            f"{', '.join(missing_common)}. Missing values are treated as unknown, not zero."
        )
    
    return result


def compare_nutrition(nutrition_a: dict, nutrition_b: dict) -> dict:
    """
    Compare nutrition data between two products.
    Only compares nutrients present in both products.
    """
    analysis_a = analyze_nutrition(nutrition_a)
    analysis_b = analyze_nutrition(nutrition_b)
    
    comparisons = []
    incomparable = []
    
    all_nutrients = set(list(analysis_a['nutrients'].keys()) + list(analysis_b['nutrients'].keys()))
    
    for nutrient in all_nutrients:
        a_data = analysis_a['nutrients'].get(nutrient, {})
        b_data = analysis_b['nutrients'].get(nutrient, {})
        
        a_known = a_data.get('status') == 'known'
        b_known = b_data.get('status') == 'known'
        
        label = DAILY_REFERENCE_VALUES.get(nutrient, {}).get('label', nutrient.replace('_', ' ').title())
        
        if a_known and b_known:
            a_val = a_data['value']
            b_val = b_data['value']
            diff = round(a_val - b_val, 2)
            
            comparison = {
                'nutrient': nutrient,
                'label': label,
                'product_a_value': a_val,
                'product_b_value': b_val,
                'unit': a_data.get('unit', ''),
                'difference': diff,
            }
            
            if diff > 0:
                comparison['note'] = f"Product A has {abs(diff)}{a_data.get('unit', '')} more {label.lower()} per serving."
            elif diff < 0:
                comparison['note'] = f"Product B has {abs(diff)}{a_data.get('unit', '')} more {label.lower()} per serving."
            else:
                comparison['note'] = f"Both products have the same {label.lower()} per serving."
            
            comparisons.append(comparison)
        else:
            reason = []
            if not a_known:
                reason.append('Product A')
            if not b_known:
                reason.append('Product B')
            incomparable.append({
                'nutrient': nutrient,
                'label': label,
                'reason': f"{' and '.join(reason)} does not have {label.lower()} data."
            })
    
    return {
        'comparisons': comparisons,
        'incomparable': incomparable,
        'note': 'Comparison is based on listed values. Products with different serving sizes may not be directly comparable.'
    }
