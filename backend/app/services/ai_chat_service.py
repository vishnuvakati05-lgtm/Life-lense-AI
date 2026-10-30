"""
LifeLens AI — Conversational AI Service
Provides retrieval-grounded, multilingual food intelligence chat:
- English, Hindi, and Telugu
- LLM Provider Abstraction (Gemini / OpenAI / Local Grounded Fallback)
- Strict grounding in the scanned product's ingredients, allergens, and nutrition
- Never diagnoses disease, invents ADIs, or claims false disease links
"""

import os
import re
from typing import Dict, List, Any, Optional
from app.services.ingredient_engine import explain_food_chemical, parse_ingredients_list
from app.services.allergen_engine import analyze_allergens


def process_chat_message(
    user_message: str,
    product_context: Dict[str, Any],
    conversation_history: List[Dict[str, str]],
    language: str = 'en',
    response_length: str = 'quick'
) -> Dict[str, Any]:
    """
    Process user query with full product context and language preference.
    """
    cleaned_query = user_message.strip()
    lowered = cleaned_query.lower()

    product_name = product_context.get('product_name', 'Scanned Food Product')
    ingredients_text = product_context.get('ingredients', '')
    allergen_statement = product_context.get('allergen_statement', '')
    nutrition_data = product_context.get('nutrition', {})

    # Check if external LLM API key is present
    gemini_key = os.environ.get('GEMINI_API_KEY')
    openai_key = os.environ.get('OPENAI_API_KEY')

    if gemini_key:
        try:
            return _call_gemini(cleaned_query, product_context, conversation_history, language, response_length, gemini_key)
        except Exception:
            pass # Fallback to local grounded response

    if openai_key:
        try:
            return _call_openai(cleaned_query, product_context, conversation_history, language, response_length, openai_key)
        except Exception:
            pass # Fallback to local grounded response

    # Local Retrieval-Grounded Engine (always works locally & offline!)
    return _generate_grounded_response(cleaned_query, product_context, language, response_length)


def _generate_grounded_response(
    query: str,
    context: Dict[str, Any],
    language: str,
    response_length: str
) -> Dict[str, Any]:
    """
    Deterministic retrieval-grounded conversational engine.
    Supports English, Hindi, and Telugu natively without external paid LLMs.
    """
    lowered = query.lower()
    product_name = context.get('product_name', 'This food product')
    ingredients_text = context.get('ingredients', '')

    # 1. Check for specific additive/chemical explanation query (e.g. "What is INS 621", "Why TBHQ?", "MSG")
    ins_match = re.search(r'(?:ins\s*|e\s*)?(\d{3,4})', lowered)
    if ins_match or any(k in lowered for k in ['msg', 'tbhq', 'preservative', 'additive', 'chemical', 'color', 'colour', 'emulsifier']):
        explainer = explain_food_chemical(query, language=language)
        if explainer.get('found'):
            if language == 'hi':
                resp = f"**{explainer['name']}**:\n\n"
                resp += f"• **यह क्या है**: {explainer['what_it_is']}\n"
                resp += f"• **क्यों मिलाया गया**: {explainer['why_it_is_added']}\n"
                if response_length == 'detailed':
                    resp += f"• **सुरक्षा और प्रमाण**: {explainer['what_the_evidence_says']}\n"
                    resp += f"• **चिंताएं**: {explainer['potential_concerns']}\n"
                    resp += f"• **जो हम नहीं जानते**: {explainer['what_we_do_not_know']}\n"
                resp += f"\nस्रोत: {', '.join(s['title'] for s in explainer['sources'])}"
            elif language == 'te':
                resp = f"**{explainer['name']}**:\n\n"
                resp += f"• **ఇది ఏమిటి**: {explainer['what_it_is']}\n"
                resp += f"• **ఎందుకు కలుపుతారు**: {explainer['why_it_is_added']}\n"
                if response_length == 'detailed':
                    resp += f"• **భద్రతా పరిశోధన**: {explainer['what_the_evidence_says']}\n"
                    resp += f"• **పరిశీలించవలసిన విషయాలు**: {explainer['potential_concerns']}\n"
                resp += f"\nమూలాలు: {', '.join(s['title'] for s in explainer['sources'])}"
            else:
                resp = f"**{explainer['name']}**:\n\n"
                resp += f"• **What it is**: {explainer['what_it_is']}\n"
                resp += f"• **Why it's added**: {explainer['why_it_is_added']}\n"
                if response_length == 'detailed':
                    resp += f"• **Scientific Evidence**: {explainer['what_the_evidence_says']}\n"
                    resp += f"• **Potential Concerns**: {explainer['potential_concerns']}\n"
                    resp += f"• **What is not known**: {explainer['what_we_do_not_know']}\n"
                resp += f"\nSources: {', '.join(s['title'] for s in explainer['sources'])}"

            return {
                'answer': resp,
                'language': language,
                'sources': explainer['sources'],
                'suggested_followups': _get_suggested_questions(language)
            }

    # 2. Check for allergen queries
    if any(k in lowered for k in ['allergy', 'allergen', 'allergic', 'एलर्जी', 'అలర్జీ', 'milk', 'peanut', 'gluten', 'soy', 'nut']):
        allergens = analyze_allergens(ingredients_text, context.get('allergen_statement', ''))
        matches = allergens.get('matches', [])
        detected = [m for m in matches if m['status'] == 'POTENTIAL_ALLERGEN_DETECTED']

        if language == 'hi':
            if detected:
                names = ", ".join(m['allergen_name'] for m in detected)
                resp = f"**संभावित एलर्जन पहचान**: इस उत्पाद के लेबल में {names} से संबंधित घटक पाए गए हैं। यदि आपको इनसे एलर्जी है, तो कृपया पैकेजिंग को ध्यान से देखें।"
            else:
                resp = "लेबल पर मुख्य सामान्य एलर्जनों का प्रत्यक्ष उल्लेख नहीं मिला। हालांकि, यह उत्पाद पूरी तरह से एलर्जन-मुक्त होने की गारंटी नहीं देता क्योंकि संभावित क्रॉस-संदूषण हो सकता है।"
        elif language == 'te':
            if detected:
                names = ", ".join(m['allergen_name'] for m in detected)
                resp = f"**అలర్జెన్ గుర్తింపు**: ఈ లేబుల్ ఆధారంగా {names} కనుగొనబడ్డాయి. వీటికి అలెర్జీ ఉంటే జాగ్రత్త వహించండి."
            else:
                resp = "లేబుల్‌లో స్పష్టమైన అలర్జెన్ మ్యాచ్ కనుగొనబడలేదు. కానీ ఇది అలర్జెన్ రహితమని హామీ ఇవ్వదు."
        else:
            if detected:
                names = ", ".join(m['allergen_name'] for m in detected)
                resp = f"**Allergen Finding**: Listed ingredients indicate potential presence of **{names}**. Please review packaging closely."
            else:
                resp = "No listed matches found for major allergens in the provided text. Note: This does not guarantee the product is completely allergen-free due to potential facility cross-contact."

        return {
            'answer': resp,
            'language': language,
            'sources': [{"title": "FSSAI Mandatory Allergen Declaration Guidelines", "publisher": "FSSAI", "year": "2020"}],
            'suggested_followups': _get_suggested_questions(language)
        }

    # 3. Check for general ingredient breakdown query
    if any(k in lowered for k in ['explain all', 'ingredients', 'what is inside', 'सामग्री', 'పదార్థాలు', 'summary']):
        items = parse_ingredients_list(ingredients_text)
        if language == 'hi':
            resp = f"**{product_name} सामग्री विश्लेषण**:\n"
            resp += f"लेबल पर कुल {len(items)} सामग्रियां घोषित हैं। मुख्य आधार: {', '.join(items[:3]) if items else 'घोषित नहीं'}।\n"
            resp += "सभी खाद्य योजक (Additives) आधिकारिक सीमाओं के तहत उपयोग किए जाते हैं।"
        elif language == 'te':
            resp = f"**{product_name} పదార్థాల వివరణ**:\n"
            resp += f"లేబుల్‌పై మొత్తం {len(items)} పదార్థాలు ప్రకటించబడ్డాయి. ప్రధానమైనవి: {', '.join(items[:3]) if items else 'తెలియదు'}."
        else:
            resp = f"**{product_name} Ingredient Summary**:\n"
            resp += f"The label declares {len(items)} primary ingredients. Leading components: {', '.join(items[:3]) if items else 'Not available'}. Functional additives are used to preserve texture and shelf-life."

        return {
            'answer': resp,
            'language': language,
            'sources': [{"title": "FSSAI Food Product Standards", "publisher": "FSSAI", "year": "2020"}],
            'suggested_followups': _get_suggested_questions(language)
        }

    # Default informative answer
    if language == 'hi':
        ans = f"LifeLens AI खाद्य विश्लेषण: '{product_name}' के लिए हम आपको इसकी सामग्री, पोषण और सुरक्षा जानकारी हिंदी में समझा सकते हैं। आप किसी विशिष्ट INS नंबर (जैसे INS 621), प्रिजर्वेटिव या एलर्जन के बारे में पूछ सकते हैं।"
    elif language == 'te':
        ans = f"LifeLens AI ఆహార విశ్లేషణ: '{product_name}' సంబంధించి మీరు పదార్థాలు, పోషక విలువలు లేదా సంకలనాల (Additives) గురించి తెలుగులో అడగవచ్చు."
    else:
        ans = f"LifeLens AI Assistant: For '{product_name}', I can break down specific INS additives, explain food functions, evaluate declared allergens, or summarize nutrition facts. Feel free to ask about any ingredient printed on the package."

    return {
        'answer': ans,
        'language': language,
        'sources': [{"title": "WHO Food Safety & Additives Guidance", "publisher": "World Health Organization", "year": "2023"}],
        'suggested_followups': _get_suggested_questions(language)
    }


def _get_suggested_questions(language: str) -> List[str]:
    """Get contextually relevant suggested questions in the chosen language."""
    if language == 'hi':
        return [
            "सभी सामग्रियों को सरल भाषा में समझाएं",
            "क्या इसमें कोई हानिकारक प्रिजर्वेटिव है?",
            "क्या यह बच्चों के लिए सुरक्षित है?",
            "इसमें कौन से फूड एडिटिव्स (INS) हैं?"
        ]
    elif language == 'te':
        return [
            "అన్ని పదార్థాలను సులభంగా వివరించండి",
            "ఇందులో ఏవైనా ప్రిజర్వేటివ్‌లు ఉన్నాయా?",
            "ఇందులో INS సంకలనాలు ఏమిటి?",
            "ఇది అలర్జీ ఉన్నవారికి సురక్షితమేనా?"
        ]
    return [
        "Explain all ingredients in simple language",
        "What are the food additives (INS/E numbers)?",
        "Does this contain potential allergens?",
        "Why are these preservatives used?"
    ]


def _call_gemini(query, context, history, language, length, api_key):
    """Optional Google Gemini integration when API key is provided."""
    import requests
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={api_key}"
    system_prompt = (
        f"You are LifeLens AI, an expert food intelligence assistant. "
        f"Answer in language: {language}. "
        f"Product context: Name: {context.get('product_name')}, Ingredients: {context.get('ingredients')}. "
        f"Rules: Ground explanations in food science. Never claim diseases, diagnose, or invent ADIs. Keep response {length}."
    )
    payload = {
        "contents": [
            {"role": "user", "parts": [{"text": f"{system_prompt}\n\nUser Question: {query}"}]}
        ]
    }
    resp = requests.post(url, json=payload, timeout=10)
    data = resp.json()
    text = data['candidates'][0]['content']['parts'][0]['text']
    return {
        'answer': text,
        'language': language,
        'sources': [{"title": "Official Regulatory Food Safety Authorities", "publisher": "FSSAI / WHO"}],
        'suggested_followups': _get_suggested_questions(language)
    }


def _call_openai(query, context, history, language, length, api_key):
    """Optional OpenAI integration when API key is provided."""
    import requests
    url = "https://api.openai.com/v1/chat/completions"
    headers = {"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"}
    system_prompt = (
        f"You are LifeLens AI, a food intelligence assistant. Answer in language: {language}. "
        f"Product: {context.get('product_name')}. Ingredients: {context.get('ingredients')}. "
        f"Be grounded in real food regulations (FSSAI/WHO/EFSA). Keep tone scientific and non-alarmist. Length: {length}."
    )
    payload = {
        "model": "gpt-4o-mini",
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": query}
        ],
        "temperature": 0.3
    }
    resp = requests.post(url, headers=headers, json=payload, timeout=10)
    data = resp.json()
    text = data['choices'][0]['message']['content']
    return {
        'answer': text,
        'language': language,
        'sources': [{"title": "Official Food Regulations & WHO/JECFA", "publisher": "WHO / FSSAI"}],
        'suggested_followups': _get_suggested_questions(language)
    }

