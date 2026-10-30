"""
LifeLens AI — OCR Service

Extracts text from food label images using Tesseract OCR.
Identifies ingredient lists, allergen statements, and nutrition information.
Never invents content — only extracts what is visible.
"""

import re
import pytesseract
from PIL import Image
from app.config import Config


# Configure Tesseract path if specified
if Config.TESSERACT_CMD:
    pytesseract.pytesseract.tesseract_cmd = Config.TESSERACT_CMD


def extract_text(image_path: str) -> dict:
    """
    Extract text from a food label image.
    
    Returns:
        dict with extracted text fields and confidence
    """
    result = {
        'full_text': '',
        'ingredients': '',
        'allergen_statement': '',
        'nutrition_text': '',
        'confidence': None,
        'warnings': []
    }
    
    try:
        img = Image.open(image_path)
        
        # Get detailed OCR data with confidence scores
        ocr_data = pytesseract.image_to_data(img, output_type=pytesseract.Output.DICT)
        
        # Build full text
        texts = []
        confidences = []
        for i, text in enumerate(ocr_data['text']):
            if text.strip():
                texts.append(text)
                conf = ocr_data['conf'][i]
                if isinstance(conf, (int, float)) and conf >= 0:
                    confidences.append(conf)
        
        full_text = ' '.join(texts)
        result['full_text'] = full_text
        
        # Calculate average confidence
        if confidences:
            avg_confidence = sum(confidences) / len(confidences)
            result['confidence'] = round(avg_confidence, 1)
            
            if avg_confidence < 40:
                result['warnings'].append(
                    'OCR confidence is low. The extracted text may contain errors. '
                    'Please review and correct before analysis.'
                )
            elif avg_confidence < 60:
                result['warnings'].append(
                    'OCR confidence is moderate. Some text may be inaccurate. '
                    'Please verify the extracted text.'
                )
        
        # Try to identify sections
        result['ingredients'] = _extract_ingredients_section(full_text)
        result['allergen_statement'] = _extract_allergen_statement(full_text)
        result['nutrition_text'] = _extract_nutrition_section(full_text)
        
        if not result['ingredients'] and not result['allergen_statement']:
            result['warnings'].append(
                'Could not automatically identify ingredient or allergen sections. '
                'The full extracted text is shown for manual review.'
            )
        
    except Exception as e:
        result['warnings'].append(
            f'OCR extraction encountered an issue. Please try uploading a clearer image.'
        )
    
    return result


def _extract_ingredients_section(text: str) -> str:
    """
    Try to extract the ingredients section from full text.
    Looks for common patterns like "Ingredients:", "Ingredients list:", etc.
    """
    if not text:
        return ''
    
    # Common ingredient section headers
    patterns = [
        r'(?:ingredients?\s*(?:list)?\s*[:;\-]?\s+)(.*?)(?=(?:nutrition|allergen|contains|storage|best before|manufactured|packed|net|serving|\Z))',
        r'(?:composition\s*[:;\-]?\s+)(.*?)(?=(?:nutrition|allergen|contains|storage|best before|\Z))',
    ]
    
    for pattern in patterns:
        match = re.search(pattern, text, re.IGNORECASE | re.DOTALL)
        if match:
            ingredients = match.group(1).strip()
            # Clean up
            ingredients = re.sub(r'\s+', ' ', ingredients)
            if len(ingredients) > 10:  # Reasonable minimum
                return ingredients
    
    return ''


def _extract_allergen_statement(text: str) -> str:
    """
    Try to extract allergen/contains statements.
    """
    if not text:
        return ''
    
    patterns = [
        r'(?:allergen[s]?\s*(?:information|advice|warning)?\s*[:;\-]?\s+)(.*?)(?=(?:nutrition|storage|best before|manufactured|\Z))',
        r'(?:contains\s*[:;\-]?\s+)(.*?)(?=(?:\.|nutrition|storage|best before|manufactured|\Z))',
        r'(?:allergy\s*(?:advice|information)\s*[:;\-]?\s+)(.*?)(?=(?:nutrition|storage|best before|\Z))',
        r'((?:may contain|contains traces|produced in a facility).*?)(?=(?:\.|nutrition|storage|best before|\Z))',
    ]
    
    statements = []
    for pattern in patterns:
        matches = re.finditer(pattern, text, re.IGNORECASE | re.DOTALL)
        for match in matches:
            stmt = match.group(1).strip() if match.lastindex else match.group(0).strip()
            stmt = re.sub(r'\s+', ' ', stmt)
            if len(stmt) > 3:
                statements.append(stmt)
    
    return '; '.join(statements) if statements else ''


def _extract_nutrition_section(text: str) -> str:
    """
    Try to extract the nutrition information section.
    """
    if not text:
        return ''
    
    patterns = [
        r'(?:nutrition(?:al)?\s*(?:information|facts|value[s]?|content)?\s*[:;]?\s*)(.*?)(?=(?:ingredients|allergen|storage|best before|manufactured|\Z))',
        r'(?:(?:per|each)\s*(?:serving|100\s*[gm]l?)\s*[:;]?\s*)(.*?)(?=(?:ingredients|allergen|storage|\Z))',
    ]
    
    for pattern in patterns:
        match = re.search(pattern, text, re.IGNORECASE | re.DOTALL)
        if match:
            nutrition = match.group(1).strip()
            nutrition = re.sub(r'\s+', ' ', nutrition)
            if len(nutrition) > 10:
                return nutrition
    
    return ''
