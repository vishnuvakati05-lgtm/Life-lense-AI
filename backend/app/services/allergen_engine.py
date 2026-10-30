"""
LifeLens AI — Allergen Safety Engine

Deterministic, testable allergen matching engine.
This is the highest-priority safety component.

Rules:
1. Normalize capitalization, whitespace, and punctuation.
2. Recognize known ingredient synonyms and derivatives.
3. Match user-selected allergens against extracted ingredients.
4. Inspect precautionary statements such as "may contain".
5. Handle compound ingredients (components listed in parentheses).
6. Distinguish direct ingredient evidence from precautionary warnings.
7. Identify ambiguous, incomplete, or unreadable label text.
8. Display the exact evidence behind each warning.
9. Never treat an absent match as proof that a food is allergen-free.
10. Never infer that an ingredient is absent merely because OCR failed to detect it.

Result categories:
- POTENTIAL_ALLERGEN_DETECTED: Direct ingredient match found
- PRECAUTIONARY_WARNING: Precautionary statement match found
- NO_LISTED_MATCH_FOUND: No match found (does NOT mean safe)
- UNABLE_TO_VERIFY: Cannot determine due to missing/unclear data
"""

import re
from typing import Optional
from app.services.allergen_dictionary import (
    ALLERGEN_DICTIONARY,
    PRECAUTIONARY_PATTERNS,
    CONTAINS_PATTERNS,
    get_allergen_display_name
)


def normalize_text(text: str) -> str:
    """Normalize text for matching: lowercase, collapse whitespace, strip."""
    if not text:
        return ""
    text = text.lower()
    text = re.sub(r'[^\w\s,;:()\-/.]', ' ', text)  # Keep meaningful punctuation
    text = re.sub(r'\s+', ' ', text)
    return text.strip()


def extract_compound_ingredients(text: str) -> list[str]:
    """
    Extract individual ingredients from compound ingredient text.
    Handles formats like: "Sugar, Milk Powder (Whole Milk, Lactose), Salt"
    and nested parentheses: "Chocolate (Cocoa Mass, Sugar, Milk Fat (Cream))"
    """
    if not text:
        return []
    
    ingredients = []
    # Split by commas, but respect parenthesized groups
    depth = 0
    current = ""
    for char in text:
        if char == '(':
            depth += 1
            current += char
        elif char == ')':
            depth -= 1
            current += char
        elif char == ',' and depth == 0:
            ingredient = current.strip()
            if ingredient:
                ingredients.append(ingredient)
                # Also extract sub-ingredients from parenthesized content
                sub_match = re.search(r'\((.+)\)', ingredient)
                if sub_match:
                    sub_text = sub_match.group(1)
                    sub_items = [s.strip() for s in sub_text.split(',')]
                    ingredients.extend(sub_items)
            current = ""
        else:
            current += char
    
    # Don't forget the last ingredient
    if current.strip():
        ingredient = current.strip()
        ingredients.append(ingredient)
        sub_match = re.search(r'\((.+)\)', ingredient)
        if sub_match:
            sub_text = sub_match.group(1)
            sub_items = [s.strip() for s in sub_text.split(',')]
            ingredients.extend(sub_items)
    
    return [i.strip() for i in ingredients if i.strip()]


def check_ingredient_match(ingredient: str, allergen_id: str) -> Optional[dict]:
    """
    Check if a single ingredient matches an allergen category.
    Returns match details or None.
    """
    if allergen_id not in ALLERGEN_DICTIONARY:
        return None
    
    allergen_data = ALLERGEN_DICTIONARY[allergen_id]
    normalized_ingredient = normalize_text(ingredient)
    
    if not normalized_ingredient:
        return None
    
    # Exact term match
    for term in allergen_data['terms']:
        term_lower = term.lower()
        if term_lower == normalized_ingredient:
            return {
                'matched_term': term,
                'original_ingredient': ingredient,
                'match_type': 'exact'
            }
    
    # Partial / substring match using partial_matches
    for partial in allergen_data.get('partial_matches', []):
        partial_lower = partial.lower()
        # Word boundary matching to avoid false positives
        pattern = r'\b' + re.escape(partial_lower) + r'\b'
        if re.search(pattern, normalized_ingredient):
            return {
                'matched_term': partial,
                'original_ingredient': ingredient,
                'match_type': 'partial'
            }
    
    return None


def check_precautionary_statements(text: str, allergen_id: str) -> Optional[dict]:
    """
    Check if precautionary statements mention a specific allergen.
    Returns precautionary match details or None.
    """
    if not text:
        return None
    
    normalized = normalize_text(text)
    allergen_data = ALLERGEN_DICTIONARY.get(allergen_id, {})
    
    for pattern in PRECAUTIONARY_PATTERNS:
        if pattern.lower() in normalized:
            # Found a precautionary statement — check if it mentions this allergen
            # Look for allergen terms after the precautionary phrase
            pattern_pos = normalized.find(pattern.lower())
            after_pattern = normalized[pattern_pos:]
            
            # Check allergen terms
            for term in allergen_data.get('terms', []):
                if term.lower() in after_pattern:
                    return {
                        'precautionary_phrase': pattern,
                        'matched_term': term,
                        'original_text': text[max(0, pattern_pos - 10):pattern_pos + len(pattern) + 50].strip(),
                        'match_type': 'precautionary'
                    }
            
            # Check partial matches
            for partial in allergen_data.get('partial_matches', []):
                p_pattern = r'\b' + re.escape(partial.lower()) + r'\b'
                if re.search(p_pattern, after_pattern):
                    return {
                        'precautionary_phrase': pattern,
                        'matched_term': partial,
                        'original_text': text[max(0, pattern_pos - 10):pattern_pos + len(pattern) + 50].strip(),
                        'match_type': 'precautionary'
                    }
    
    return None


def assess_text_quality(ingredients_text: str) -> dict:
    """
    Assess the quality and completeness of extracted ingredient text.
    Returns quality metrics and any concerns.
    """
    concerns = []
    
    if not ingredients_text or not ingredients_text.strip():
        return {
            'quality': 'missing',
            'concerns': ['No ingredient text available. Cannot verify allergen safety.'],
            'is_usable': False
        }
    
    text = ingredients_text.strip()
    
    # Check for very short text (likely incomplete)
    if len(text) < 10:
        concerns.append('Ingredient text appears very short and may be incomplete.')
    
    # Check for common OCR artifacts
    ocr_artifacts = ['|||', '###', '???', '***', '---']
    for artifact in ocr_artifacts:
        if artifact in text:
            concerns.append('Text contains possible OCR artifacts that may indicate reading errors.')
            break
    
    # Check for excessive special characters (OCR noise)
    special_ratio = len(re.findall(r'[^a-zA-Z0-9\s,;:()\-/.]', text)) / max(len(text), 1)
    if special_ratio > 0.15:
        concerns.append('Text contains unusual characters that may indicate OCR errors.')
    
    # Check if text seems cut off (no period or common ending)
    if len(text) > 50 and not text.rstrip().endswith(('.', ')', ']')):
        concerns.append('Ingredient list may be truncated or incomplete.')
    
    quality = 'good'
    if len(concerns) >= 2:
        quality = 'poor'
    elif len(concerns) == 1:
        quality = 'fair'
    
    return {
        'quality': quality,
        'concerns': concerns,
        'is_usable': True,
        'text_length': len(text)
    }


def analyze_allergens(
    ingredients_text: str,
    allergen_statement: str = "",
    user_allergens: list[str] = None
) -> dict:
    """
    Main allergen analysis function.
    
    Args:
        ingredients_text: Extracted ingredient list text
        allergen_statement: Extracted allergen/contains statement
        user_allergens: List of allergen IDs from user profile
    
    Returns:
        Comprehensive allergen analysis result with evidence
    """
    if user_allergens is None:
        user_allergens = []
    
    # Combine ingredient text and allergen statement for comprehensive analysis
    combined_text = f"{ingredients_text} {allergen_statement}".strip()
    
    # Assess text quality
    text_quality = assess_text_quality(ingredients_text)
    
    # Parse individual ingredients
    individual_ingredients = extract_compound_ingredients(ingredients_text)
    
    matches = []
    limitations = []
    unable_to_verify = False
    
    # If no text available, everything is UNABLE_TO_VERIFY
    if not text_quality['is_usable']:
        unable_to_verify = True
        for allergen_id in user_allergens:
            matches.append({
                'allergen_id': allergen_id,
                'allergen_name': get_allergen_display_name(allergen_id),
                'status': 'UNABLE_TO_VERIFY',
                'evidence': [],
                'reason': 'No ingredient text available for analysis.'
            })
        limitations.append(
            'No ingredient text could be read. Cannot determine allergen presence. '
            'Please verify the actual packaging or contact the manufacturer.'
        )
        return {
            'matches': matches,
            'text_quality': text_quality,
            'limitations': limitations,
            'unable_to_verify': unable_to_verify,
            'ingredients_parsed': [],
            'total_ingredients_found': 0
        }
    
    # Add quality concerns to limitations
    if text_quality['concerns']:
        for concern in text_quality['concerns']:
            limitations.append(concern)
        if text_quality['quality'] == 'poor':
            unable_to_verify = True
    
    # Check each user allergen
    for allergen_id in user_allergens:
        if allergen_id not in ALLERGEN_DICTIONARY:
            # Custom allergen — do basic text search
            custom_match = _check_custom_allergen(allergen_id, combined_text)
            matches.append(custom_match)
            continue
        
        allergen_matches = []
        precautionary_matches = []
        
        # Check each individual ingredient
        for ingredient in individual_ingredients:
            match = check_ingredient_match(ingredient, allergen_id)
            if match:
                allergen_matches.append(match)
        
        # Check the allergen/contains statement
        if allergen_statement:
            # Check for direct mentions in contains statement
            contains_match = check_ingredient_match(allergen_statement, allergen_id)
            if contains_match:
                contains_match['match_type'] = 'contains_statement'
                allergen_matches.append(contains_match)
        
        # Check precautionary statements in both texts
        for text_source in [ingredients_text, allergen_statement]:
            prec_match = check_precautionary_statements(text_source, allergen_id)
            if prec_match:
                precautionary_matches.append(prec_match)
        
        # Determine status for this allergen
        if allergen_matches:
            status = 'POTENTIAL_ALLERGEN_DETECTED'
            evidence = [
                {
                    'type': 'ingredient_match',
                    'matched_term': m['matched_term'],
                    'found_in': m['original_ingredient'],
                    'match_type': m['match_type']
                }
                for m in allergen_matches
            ]
            reason = (
                f"Found potential {get_allergen_display_name(allergen_id)} "
                f"ingredient(s) in the label: "
                f"{', '.join(set(m['matched_term'] for m in allergen_matches))}"
            )
        elif precautionary_matches:
            status = 'PRECAUTIONARY_WARNING'
            evidence = [
                {
                    'type': 'precautionary',
                    'precautionary_phrase': m['precautionary_phrase'],
                    'matched_term': m['matched_term'],
                    'context': m.get('original_text', '')
                }
                for m in precautionary_matches
            ]
            reason = (
                f"A precautionary statement mentions {get_allergen_display_name(allergen_id)}. "
                f"This does not confirm presence but indicates possible cross-contamination."
            )
        else:
            status = 'NO_LISTED_MATCH_FOUND'
            evidence = []
            reason = (
                f"No {get_allergen_display_name(allergen_id)} ingredients were identified "
                f"in the extracted text. This does NOT guarantee the product is free of "
                f"this allergen. The ingredient list may be incomplete, or the allergen "
                f"may be present under an unrecognized name."
            )
        
        # Override to UNABLE_TO_VERIFY if text quality is poor
        if text_quality['quality'] == 'poor' and status == 'NO_LISTED_MATCH_FOUND':
            status = 'UNABLE_TO_VERIFY'
            reason = (
                f"The extracted text quality is poor. Cannot reliably determine "
                f"whether {get_allergen_display_name(allergen_id)} ingredients are present. "
                f"Please verify the actual packaging."
            )
        
        matches.append({
            'allergen_id': allergen_id,
            'allergen_name': get_allergen_display_name(allergen_id),
            'status': status,
            'evidence': evidence,
            'reason': reason
        })
    
    # Global limitations
    if not user_allergens:
        limitations.append(
            'No allergens selected in your profile. '
            'Add your allergens in Settings to get personalized warnings.'
        )
    
    limitations.append(
        'This analysis is based on extracted text and may not capture all ingredients. '
        'Always verify with the actual product packaging.'
    )
    
    return {
        'matches': matches,
        'text_quality': text_quality,
        'limitations': limitations,
        'unable_to_verify': unable_to_verify,
        'ingredients_parsed': individual_ingredients,
        'total_ingredients_found': len(individual_ingredients)
    }


def _check_custom_allergen(allergen_term: str, text: str) -> dict:
    """Check for a custom (user-defined) allergen term in text."""
    normalized = normalize_text(text)
    term_lower = allergen_term.lower().strip()
    
    pattern = r'\b' + re.escape(term_lower) + r'\b'
    found = re.search(pattern, normalized)
    
    if found:
        # Get context around the match
        start = max(0, found.start() - 20)
        end = min(len(normalized), found.end() + 20)
        context = normalized[start:end]
        
        return {
            'allergen_id': allergen_term,
            'allergen_name': allergen_term.title(),
            'status': 'POTENTIAL_ALLERGEN_DETECTED',
            'evidence': [{
                'type': 'custom_match',
                'matched_term': allergen_term,
                'context': context
            }],
            'reason': f'Found "{allergen_term}" in the ingredient text.'
        }
    
    return {
        'allergen_id': allergen_term,
        'allergen_name': allergen_term.title(),
        'status': 'NO_LISTED_MATCH_FOUND',
        'evidence': [],
        'reason': (
            f'"{allergen_term}" was not found in the extracted text. '
            f'This does NOT guarantee absence. Verify with the actual packaging.'
        )
    }
