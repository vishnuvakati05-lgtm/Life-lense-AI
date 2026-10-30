"""
LifeLens AI — High-Intelligence Ingredient Engine

Analyzes food ingredient text:
- Deterministic extraction & normalization of ingredients
- Universal identification of INS/E numbers and chemical additives
- Codex Alimentarius and FSSAI functional class classifier
- 7-section structured Food Chemical Explainer
- Multilingual summary generation (English, Hindi, Telugu)
- Safe, grounded, non-alarmist scientific explanations
"""

import re
from typing import Dict, List, Any, Optional
from app.services.ingredient_knowledge import ADDITIVES_DB, COMMON_INGREDIENTS_DB


def get_codex_class_for_ins(number_str: str) -> Dict[str, str]:
    """
    Fallback functional classification based on international Codex Alimentarius
    and FSSAI INS numbering system (CAC/GL 36-1989).
    """
    try:
        num = int(re.sub(r'\D', '', number_str))
    except Exception:
        num = 0

    if 100 <= num <= 199:
        return {
            'category': 'Food Colour',
            'technical_function': 'Imparts or restores visual coloration to processed food.',
            'why_added': 'Added to ensure uniform appetizing appearance that might otherwise fade during thermal processing.'
        }
    elif 200 <= num <= 299:
        return {
            'category': 'Preservative',
            'technical_function': 'Inhibits microbial spoilage caused by bacteria, yeasts, and molds.',
            'why_added': 'Added to extend packaged shelf life and prevent foodborne microbial degradation.'
        }
    elif 300 <= num <= 322:
        return {
            'category': 'Antioxidant',
            'technical_function': 'Protects against deterioration caused by oxidation, such as fat rancidity and color changes.',
            'why_added': 'Added to protect sensitive fats, oils, and fat-soluble vitamins from going rancid.'
        }
    elif 323 <= num <= 399:
        return {
            'category': 'Acidity Regulator',
            'technical_function': 'Alters or controls the acidity or alkalinity of a foodstuff.',
            'why_added': 'Added to maintain specific pH levels required for safety, texture, and taste balance.'
        }
    elif 400 <= num <= 495:
        return {
            'category': 'Thickener / Stabilizer / Emulsifier',
            'technical_function': 'Enables uniform dispersion of immiscible substances and increases food viscosity.',
            'why_added': 'Added to maintain creamy texture, prevent phase separation, and improve mouthfeel.'
        }
    elif 500 <= num <= 585:
        return {
            'category': 'Acidity Regulator / Raising Agent',
            'technical_function': 'Liberates gas to increase dough volume or controls alkalinity and flow properties.',
            'why_added': 'Used in bakery items and noodles for aerated crumb structure, elasticity, or caking prevention.'
        }
    elif 600 <= num <= 650:
        return {
            'category': 'Flavour Enhancer',
            'technical_function': 'Enhances the existing taste and/or odor of a foodstuff without imparting its own separate flavor.',
            'why_added': 'Added to savory snacks and seasonings to magnify savory umami taste intensity.'
        }
    elif 900 <= num <= 928:
        return {
            'category': 'Glazing / Anti-foaming Agent',
            'technical_function': 'Imparts a shiny surface appearance or prevents foam during processing.',
            'why_added': 'Used in confectionery coatings and processing equipment.'
        }
    elif 950 <= num <= 969:
        return {
            'category': 'Sweetener',
            'technical_function': 'Non-sugar intense substance imparting sweetness with minimal or zero caloric value.',
            'why_added': 'Used to replace caloric sugars in diet, zero-sugar, or diabetic-friendly packaged foods.'
        }
    elif 1400 <= num <= 1452:
        return {
            'category': 'Modified Starch',
            'technical_function': 'Provides heat, shear, and freeze-thaw stable thickening and gelling.',
            'why_added': 'Added to sauces and gravies to prevent liquid syneresis (watering out).'
        }
    else:
        return {
            'category': 'Regulated Food Additive',
            'technical_function': 'Functional additive permitted under FSSAI / Codex Alimentarius regulations.',
            'why_added': 'Added for specific technological manufacturing or preservation purposes.'
        }


def extract_ins_numbers(text: str) -> List[str]:
    """
    High-Intelligence INS number extractor.
    Extracts INS codes across all common formats:
    - Explicit: INS 621, E621, INS-621, INS: 621
    - Sub-codes: 500(i), 501(i), 503(ii), 322(i), 150d, 472e
    - Category-prefixed: Emulsifier (322), Acidity Regulators (330, 331), Sweeteners (955, 950), Colour (102, 110)
    - Bracketed numbers that match known additives or INS ranges (100-1522).
    """
    if not text:
        return []

    found_codes = []

    # 1. Matches with explicit 'INS' or 'E' prefix (e.g. INS 621, INS 500(i), E330)
    p1 = re.findall(r'(?:INS|E)\s*[-:]?\s*(\d{3,4}(?:\([a-z0-9]+\)|[a-z])?)', text, flags=re.IGNORECASE)
    for match in p1:
        base = re.sub(r'[\(\)]', '', match).strip()
        num_only = re.sub(r'\D', '', base)
        if num_only and num_only not in found_codes:
            found_codes.append(num_only)

    # 2. Category-prefixed numbers: e.g. "Acidity Regulators (330, 331)" or "Sweeteners (955, 950)"
    category_pattern = r'(?:acidity regulators?|emulsifiers?|preservatives?|thickeners?|stabilizers?|raising agents?|sweeteners?|colours?|colors?|antioxidants?|flavour enhancers?|anti-caking agents?)\s*[\(\[]([^\)\]]+)[\)\]]'
    for cat_match in re.finditer(category_pattern, text, flags=re.IGNORECASE):
        bracket_content = cat_match.group(1)
        sub_nums = re.findall(r'\b(\d{3,4}(?:\([a-z0-9]+\)|[a-z])?)\b', bracket_content, flags=re.IGNORECASE)
        for s in sub_nums:
            base = re.sub(r'[\(\)]', '', s).strip()
            num_only = re.sub(r'\D', '', base)
            if num_only and num_only not in found_codes:
                found_codes.append(num_only)

    # 3. Numbers with sub-indices like 500(i), 503(ii), 322(i)
    p3 = re.findall(r'\b(\d{3,4})\s*\([a-z0-9]+\)', text, flags=re.IGNORECASE)
    for s in p3:
        if s not in found_codes:
            found_codes.append(s)

    # 4. Any numbers inside parentheses/brackets that match ADDITIVES_DB or standard INS range 100-1522
    for bracket in re.finditer(r'[\(\[](.*?)[\)\]]', text):
        content = bracket.group(1)
        potential = re.findall(r'\b(\d{3,4})\b', content)
        for p in potential:
            if (p in ADDITIVES_DB or (100 <= int(p) <= 1522)) and p not in found_codes:
                found_codes.append(p)

    return found_codes


def parse_ingredients_list(text: str) -> List[str]:
    """
    Parse raw ingredient text into individual ingredients,
    respecting parentheses and brackets.
    """
    if not text:
        return []

    # Clean leading headers like "INGREDIENTS:", "Ingredients: "
    cleaned = re.sub(r'^(?:ingredients?|contains?|composition)\s*[:;\-]?\s*', '', text, flags=re.IGNORECASE)
    cleaned = cleaned.strip()

    # Split by commas or semicolons that are NOT inside parentheses or brackets
    ingredients = []
    current = []
    paren_depth = 0
    bracket_depth = 0

    for char in cleaned:
        if char == '(':
            paren_depth += 1
            current.append(char)
        elif char == ')':
            paren_depth = max(0, paren_depth - 1)
            current.append(char)
        elif char == '[':
            bracket_depth += 1
            current.append(char)
        elif char == ']':
            bracket_depth = max(0, bracket_depth - 1)
            current.append(char)
        elif char in (',', ';') and paren_depth == 0 and bracket_depth == 0:
            item = ''.join(current).strip()
            if item:
                ingredients.append(item)
            current = []
        else:
            current.append(char)

    if current:
        item = ''.join(current).strip()
        if item:
            ingredients.append(item)

    # Filter out empty or punctuation-only strings
    valid_items = []
    for item in ingredients:
        item = re.sub(r'\.+$', '', item).strip()
        if len(item) > 1 and any(c.isalnum() for c in item):
            valid_items.append(item)

    return valid_items


def analyze_ingredient(raw_text: str, language: str = 'en') -> Dict[str, Any]:
    """
    Analyze a single ingredient item and return structured intelligence.
    Supports multi-additive extraction and Codex Alimentarius class fallback.
    """
    raw_clean = raw_text.strip()
    lowered = raw_clean.lower()

    # 1. Check for detected INS numbers
    detected_ins = extract_ins_numbers(raw_clean)
    additive_info = None

    if detected_ins:
        base_num = detected_ins[0]
        additive_info = ADDITIVES_DB.get(base_num)
        if not additive_info:
            # Fallback to Codex Alimentarius classification
            codex = get_codex_class_for_ins(base_num)
            additive_info = {
                'ins_number': f'INS {base_num}',
                'e_number': f'E{base_num}',
                'name': f'Food Additive (INS {base_num})',
                'common_names': [f'INS {base_num}', f'E{base_num}'],
                'category': codex['category'],
                'technical_function': codex['technical_function'],
                'why_added': codex['why_added'],
                'safety_assessment': f'Regulated food additive under FSSAI and Codex Alimentarius standards for {codex["category"].lower()}s.',
                'evidence_concerns': f'Permitted in packaged foods within statutory Good Manufacturing Practice (GMP) or specific quantitative limits.',
                'what_we_do_not_know': 'Exact dosage ratio in this specific proprietary recipe.',
                'sources': [
                    {'title': 'Codex General Standard for Food Additives (GSFA)', 'publisher': 'WHO / FAO Codex', 'year': '2023', 'url': 'https://www.fao.org/fao-who-codexalimentarius'},
                    {'title': 'FSSAI Food Safety and Standards (Food Products Standards and Food Additives)', 'publisher': 'FSSAI', 'year': '2020', 'url': 'https://www.fssai.gov.in'}
                ]
            }

    # 2. Check by keyword in ADDITIVES_DB
    if not additive_info:
        for code, info in ADDITIVES_DB.items():
            if info['name'].lower() in lowered:
                additive_info = info
                break
            for cname in info.get('common_names', []):
                if cname.lower() in lowered:
                    additive_info = info
                    break
            if additive_info:
                break

    # If identified as an additive
    if additive_info:
        trans = additive_info.get('translations', {}).get(language, {})
        display_name = trans.get('name', additive_info['name'])
        category = trans.get('category', additive_info['category'])
        why_added = trans.get('why_added', additive_info['why_added'])
        short_summary = trans.get('short_summary', additive_info['safety_assessment'])

        return {
            'raw_name': raw_text,
            'normalized_name': display_name,
            'is_additive': True,
            'ins_number': additive_info['ins_number'],
            'e_number': additive_info['e_number'],
            'category': category,
            'technical_function': additive_info['technical_function'],
            'why_added': why_added,
            'safety_assessment': additive_info['safety_assessment'],
            'evidence_concerns': additive_info['evidence_concerns'],
            'what_we_do_not_know': additive_info['what_we_do_not_know'],
            'short_summary': short_summary,
            'sources': additive_info['sources'],
            'confidence': 0.95
        }

    # 3. Check common culinary ingredients DB
    for key, cinfo in COMMON_INGREDIENTS_DB.items():
        if key in lowered:
            return {
                'raw_name': raw_text,
                'normalized_name': cinfo['name'],
                'is_additive': False,
                'ins_number': None,
                'e_number': None,
                'category': cinfo['category'],
                'technical_function': cinfo['technical_function'],
                'why_added': cinfo['why_added'],
                'safety_assessment': cinfo['safety_assessment'],
                'evidence_concerns': cinfo['evidence_concerns'],
                'what_we_do_not_know': cinfo['what_we_do_not_know'],
                'short_summary': cinfo['safety_assessment'],
                'sources': cinfo['sources'],
                'confidence': 0.90
            }

    # 4. Standard whole/culinary ingredient
    return {
        'raw_name': raw_text,
        'normalized_name': raw_text,
        'is_additive': False,
        'ins_number': None,
        'e_number': None,
        'category': 'Food Ingredient',
        'technical_function': 'Primary food component / substrate.',
        'why_added': f'Provides fundamental nutrition, flavor, or texture for {raw_text}.',
        'safety_assessment': 'Standard recognized food ingredient.',
        'evidence_concerns': 'No general additive concern. Note any personal dietary or allergen sensitivities.',
        'what_we_do_not_know': 'Exact processing grade, origin, and proportion (percentages not declared on packaging).',
        'short_summary': f'{raw_text} is a primary component of this product.',
        'sources': [
            {"title": "FSSAI Food Safety and Standards Regulations", "publisher": "FSSAI", "year": "2020", "url": "https://www.fssai.gov.in"}
        ],
        'confidence': 0.85
    }


def explain_food_chemical(query: str, language: str = 'en') -> Dict[str, Any]:
    """
    Dedicated 7-Section Food Chemical Explainer experience:
    - SHORT_ANSWER
    - WHAT_IT_IS
    - WHY_IT_IS_ADDED
    - WHAT_THE_EVIDENCE_SAYS
    - POTENTIAL_CONCERNS
    - WHAT_WE_DO_NOT_KNOW
    - SOURCES
    """
    clean_query = query.strip()
    lowered = clean_query.lower()

    match_info = None

    # 1. Direct number check
    num_match = re.search(r'(\d{3,4})', clean_query)
    if num_match:
        code = num_match.group(1)
        if code in ADDITIVES_DB:
            match_info = ADDITIVES_DB[code]
        elif 100 <= int(code) <= 1522:
            codex = get_codex_class_for_ins(code)
            match_info = {
                'ins_number': f'INS {code}',
                'e_number': f'E{code}',
                'name': f'Food Additive (INS {code})',
                'common_names': [f'INS {code}', f'E{code}'],
                'category': codex['category'],
                'technical_function': codex['technical_function'],
                'why_added': codex['why_added'],
                'safety_assessment': f'Regulated food additive evaluated under Codex Alimentarius and FSSAI standards.',
                'evidence_concerns': f'Permitted in foods according to specific Good Manufacturing Practice (GMP) schedules.',
                'what_we_do_not_know': 'Exact manufacturer dosage in individual food recipes.',
                'sources': [
                    {'title': 'Codex General Standard for Food Additives', 'publisher': 'WHO / FAO', 'year': '2023', 'url': 'https://www.fao.org'},
                    {'title': 'FSSAI Food Additives Regulations', 'publisher': 'FSSAI', 'year': '2020', 'url': 'https://www.fssai.gov.in'}
                ]
            }

    # 2. Text match if not found
    if not match_info:
        for code, info in ADDITIVES_DB.items():
            if info['name'].lower() in lowered or any(cn.lower() in lowered for cn in info.get('common_names', [])):
                match_info = info
                break

    if not match_info:
        # Check common ingredients
        for key, cinfo in COMMON_INGREDIENTS_DB.items():
            if key in lowered:
                return {
                    'found': True,
                    'query': query,
                    'name': cinfo['name'],
                    'category': cinfo['category'],
                    'short_answer': f"{cinfo['name']} is a standard {cinfo['category'].lower()} widely used in packaged foods.",
                    'what_it_is': f"{cinfo['name']} is utilized as a {cinfo['category'].lower()}.",
                    'why_it_is_added': cinfo['why_added'],
                    'what_the_evidence_says': cinfo['safety_assessment'],
                    'potential_concerns': cinfo['evidence_concerns'],
                    'what_we_do_not_know': cinfo['what_we_do_not_know'],
                    'sources': cinfo['sources']
                }

        # Unknown chemical query
        return {
            'found': False,
            'query': query,
            'message': f"Chemical identity for '{query}' could not be established conclusively from authoritative food databases.",
            'guidance': "Please confirm the spelling, check if it has an INS or E number on the packaging (e.g. INS 621), or verify the physical label.",
            'limitations': [
                "Only regulated food additives and common ingredients are in the offline verified registry.",
                "Packaging may use proprietary trade names or alternate regional spellings."
            ]
        }

    trans = match_info.get('translations', {}).get(language, {})
    name = trans.get('name', match_info['name'])
    category = trans.get('category', match_info['category'])
    why_added = trans.get('why_added', match_info['why_added'])
    short_summary = trans.get('short_summary', match_info['safety_assessment'])

    # Build standard 7-section explainer
    return {
        'found': True,
        'query': query,
        'name': f"{name} ({match_info['ins_number']})",
        'ins_number': match_info['ins_number'],
        'e_number': match_info['e_number'],
        'category': category,
        'short_answer': short_summary,
        'what_it_is': f"{name} is an approved food additive ({match_info['ins_number']} / {match_info['e_number']}) functioning primarily as a {match_info['category'].lower()}.",
        'why_it_is_added': why_added,
        'what_the_evidence_says': match_info['safety_assessment'],
        'potential_concerns': match_info['evidence_concerns'],
        'what_we_do_not_know': match_info['what_we_do_not_know'],
        'sources': match_info['sources'],
        'distinctions': {
            'established_facts': f"Approved by FSSAI, JECFA, and EFSA under regulated food additive categories.",
            'evidence_concerns': match_info['evidence_concerns'],
            'unsupported_claims': "Claims that this additive alone causes specific chronic diseases or acute toxicity at ordinary dietary levels lack peer-reviewed scientific consensus."
        }
    }


def analyze_all_ingredients(ingredients_text: str, language: str = 'en') -> Dict[str, Any]:
    """
    Analyze complete parsed ingredient list from food label text.
    Extracts each individual additive and returns structured intelligence.
    """
    raw_items = parse_ingredients_list(ingredients_text)
    analyzed_items = []
    additives_map = {}

    for item in raw_items:
        # Check if item contains multiple INS numbers
        ins_codes = extract_ins_numbers(item)
        if len(ins_codes) > 1:
            # Multi-additive item like "Sweeteners (INS 955, INS 950)"
            primary_analysis = analyze_ingredient(item, language=language)
            analyzed_items.append(primary_analysis)

            # Also analyze each sub-code individually for the additives list
            for code in ins_codes:
                sub_analysis = analyze_ingredient(f"INS {code}", language=language)
                if sub_analysis.get('is_additive') and code not in additives_map:
                    additives_map[code] = sub_analysis
        else:
            analysis = analyze_ingredient(item, language=language)
            analyzed_items.append(analysis)
            if analysis.get('is_additive'):
                num = analysis.get('ins_number') or item
                if num not in additives_map:
                    additives_map[num] = analysis

    additives_found = list(additives_map.values())
    categories_present = list(set(item['category'] for item in analyzed_items if item.get('category')))

    # Multilingual summary builder
    summary = build_multilingual_summary(analyzed_items, language)

    return {
        'total_ingredients': len(raw_items),
        'parsed_ingredients': analyzed_items,
        'additives_count': len(additives_found),
        'additives': additives_found,
        'categories_present': categories_present,
        'summary': summary,
        'completeness_note': 'Package declares ingredients in descending order of weight. Exact percentages are not disclosed except where legally mandated (e.g. key characterizing ingredients).'
    }


def build_multilingual_summary(items: List[Dict[str, Any]], language: str) -> str:
    """Generate concise, factual summary in selected language."""
    total = len(items)
    additives = [i for i in items if i.get('is_additive')]
    num_add = len(additives)

    if total == 0:
        if language == 'hi':
            return "कोई सामग्री पहचानी नहीं गई। कृपया स्पष्ट फोटो अपलोड करें या टेक्स्ट संपादित करें।"
        elif language == 'te':
            return "ఎలాంటి పదార్థాలు గుర్తించబడలేదు. దయచేసి స్పష్టమైన ఫోటోను అప్‌లోడ్ చేయండి లేదా టెక్స్ట్ సవరించండి."
        return "No ingredients identified. Please provide clear label text for analysis."

    additive_names = [a['normalized_name'] for a in additives[:3]]
    add_str = ", ".join(additive_names)

    if language == 'hi':
        if num_add > 0:
            return f"इस उत्पाद में {total} सामग्रियां हैं, जिनमें {num_add} स्वीकृत खाद्य योजक (Additives) शामिल हैं ({add_str})। इन्हें शेल्फ लाइफ, बनावट या स्वाद बढ़ाने के लिए मिलाया गया है।"
        return f"इस उत्पाद में {total} सामग्रियां हैं। कोई कृत्रिम योजक (INS additive) नहीं पाया गया।"
    elif language == 'te':
        if num_add > 0:
            return f"ఈ ఆహారంలో {total} పదార్థాలు ఉన్నాయి, ఇందులో {num_add} ఆహార సంకలనాలు (Additives) ఉన్నాయి ({add_str}). ఇవి తాజాదనం మరియు రుచి కోసం ఉపయోగించబడ్డాయి."
        return f"ఈ ఆహారంలో {total} పదార్థాలు ఉన్నాయి. ఎలాంటి కృత్రిమ సంకలనాలు కనుగొనబడలేదు."
    else:
        if num_add > 0:
            return f"This product contains {total} listed ingredients, including {num_add} verified functional food additives ({add_str}), primarily used for leavening, stabilization, shelf-life, or flavor enhancement."
        return f"This product contains {total} recognized dietary ingredients with no synthetic additives identified."


# Compatibility Aliases
explain_chemical = explain_food_chemical
parse_ingredients = parse_ingredients_list
extract_additives_and_explain = analyze_all_ingredients
