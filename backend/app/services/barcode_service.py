"""
LifeLens AI — Barcode Service

Looks up products using the Open Food Facts API.
Caches responses and handles missing/conflicting records.
"""

import requests
from datetime import datetime
from app.config import Config


# Simple in-memory cache (will be replaced with proper caching in production)
_barcode_cache = {}


def lookup_barcode(barcode: str) -> dict:
    """
    Look up a product by barcode using Open Food Facts.
    
    Returns:
        dict with product info or error details
    """
    barcode = str(barcode).strip()
    
    # Check cache
    if barcode in _barcode_cache:
        cached = _barcode_cache[barcode]
        cached['from_cache'] = True
        return cached
    
    try:
        url = f"{Config.OPEN_FOOD_FACTS_URL}/{barcode}.json"
        headers = {
            'User-Agent': 'LifeLensAI/1.0 (educational project)'
        }
        
        response = requests.get(url, headers=headers, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            
            if data.get('status') == 1 and data.get('product'):
                product = data['product']
                
                result = {
                    'found': True,
                    'barcode': barcode,
                    'product_name': product.get('product_name', 'Unknown'),
                    'brand': product.get('brands', ''),
                    'ingredients_text': product.get('ingredients_text', ''),
                    'allergens': product.get('allergens', ''),
                    'allergens_tags': product.get('allergens_tags', []),
                    'traces': product.get('traces', ''),
                    'traces_tags': product.get('traces_tags', []),
                    'nutrition': _extract_nutrition(product),
                    'image_url': product.get('image_url', ''),
                    'categories': product.get('categories', ''),
                    'source': 'Open Food Facts',
                    'retrieved_at': datetime.utcnow().isoformat(),
                    'from_cache': False,
                    'note': (
                        'This data is from the Open Food Facts community database. '
                        'Always verify against the actual product packaging.'
                    )
                }
                
                # Cache the result
                _barcode_cache[barcode] = result
                return result
            else:
                return {
                    'found': False,
                    'barcode': barcode,
                    'message': 'Product not found in Open Food Facts database.'
                }
        
        return {
            'found': False,
            'barcode': barcode,
            'message': f'Open Food Facts lookup returned status {response.status_code}.'
        }
        
    except requests.Timeout:
        return {
            'found': False,
            'barcode': barcode,
            'message': 'Barcode lookup timed out. Please try again.'
        }
    except requests.ConnectionError:
        return {
            'found': False,
            'barcode': barcode,
            'message': 'Could not connect to Open Food Facts. Check your internet connection.'
        }
    except Exception:
        return {
            'found': False,
            'barcode': barcode,
            'message': 'An error occurred during barcode lookup.'
        }


def _extract_nutrition(product: dict) -> dict:
    """Extract nutrition data from Open Food Facts product data."""
    nutriments = product.get('nutriments', {})
    
    nutrition = {}
    
    mapping = {
        'energy-kcal_serving': 'calories',
        'energy-kcal_100g': 'calories_per_100g',
        'fat_serving': 'total_fat',
        'fat_100g': 'total_fat_per_100g',
        'saturated-fat_serving': 'saturated_fat',
        'saturated-fat_100g': 'saturated_fat_per_100g',
        'carbohydrates_serving': 'total_carbohydrates',
        'carbohydrates_100g': 'total_carbohydrates_per_100g',
        'sugars_serving': 'total_sugars',
        'sugars_100g': 'total_sugars_per_100g',
        'fiber_serving': 'dietary_fiber',
        'fiber_100g': 'dietary_fiber_per_100g',
        'proteins_serving': 'protein',
        'proteins_100g': 'protein_per_100g',
        'sodium_serving': 'sodium',
        'sodium_100g': 'sodium_per_100g',
        'salt_serving': 'salt',
        'salt_100g': 'salt_per_100g',
    }
    
    for off_key, our_key in mapping.items():
        val = nutriments.get(off_key)
        if val is not None:
            nutrition[our_key] = val
    
    # Serving size
    serving = product.get('serving_size', '')
    if serving:
        nutrition['serving_size'] = serving
    
    return nutrition
