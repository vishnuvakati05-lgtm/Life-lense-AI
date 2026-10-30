import pytest
from app.services.allergen_engine import analyze_allergens
from app.services.nutrition_engine import (
    analyze_nutrition,
    convert_sodium_to_salt,
    convert_salt_to_sodium,
    parse_nutrient_value
)


def test_allergen_exact_match():
    ingredients = "Wheat flour, milk solids, refined sugar, soy lecithin, cashew nuts"
    allergens = ["milk", "wheat", "peanuts"]
    result = analyze_allergens(ingredients, "", allergens)

    detected = [m for m in result['matches'] if m['status'] == 'POTENTIAL_ALLERGEN_DETECTED']
    detected_ids = [m['allergen_id'] for m in detected]

    assert "milk" in detected_ids
    assert "wheat" in detected_ids
    assert "peanuts" not in detected_ids


def test_allergen_precautionary_statement():
    ingredients = "Sugar, vegetable oil, cocoa solids"
    statement = "Manufactured on equipment that also processes peanuts and tree nuts"
    allergens = ["peanuts"]
    result = analyze_allergens(ingredients, statement, allergens)

    peanut_match = next((m for m in result['matches'] if m['allergen_id'] == 'peanuts'), None)
    assert peanut_match is not None
    assert peanut_match['status'] == 'PRECAUTIONARY_WARNING'


def test_allergen_never_says_allergen_free():
    ingredients = "Apples, water, vitamin c"
    result = analyze_allergens(ingredients, "", ["peanuts"])
    assert result['matches'][0]['status'] == 'NO_LISTED_MATCH_FOUND'
    assert "allergen-free" not in result['matches'][0]['status'].lower()


def test_sodium_to_salt_conversion():
    sodium_mg = 400.0
    salt_g = convert_sodium_to_salt(sodium_mg)
    # salt = 400 * 2.5 / 1000 = 1.0g
    assert salt_g == 1.0
    assert convert_salt_to_sodium(salt_g) == 400.0


def test_parse_nutrient_value():
    res1 = parse_nutrient_value("150 kcal")
    assert res1['value'] == 150.0
    assert res1['unit'] == 'kcal'

    res2 = parse_nutrient_value("< 1g")
    assert res2['value'] == 1.0
    assert res2['less_than'] is True

    res3 = parse_nutrient_value("nil")
    assert res3 is None

