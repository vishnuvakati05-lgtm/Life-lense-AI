import pytest
from app.services.ingredient_engine import (
    parse_ingredients_list,
    extract_ins_numbers,
    analyze_ingredient,
    explain_food_chemical,
    analyze_all_ingredients,
    explain_chemical,
    parse_ingredients,
    extract_additives_and_explain
)


def test_parse_ingredients_list_with_parentheses():
    text = "Ingredients: Wheat Flour (Maida), Refined Palm Oil, Sugar, Raising Agents [INS 503(ii), INS 500(ii)], Emulsifier (INS 322), Iodised Salt."
    items = parse_ingredients_list(text)
    assert len(items) >= 6
    assert any("Wheat Flour" in item for item in items)
    assert any("Raising Agents" in item for item in items)
    assert any("Emulsifier" in item for item in items)


def test_extract_ins_numbers_explicit_and_prefixed():
    # Tests both standard INS format and category-prefixed formats without 'INS'
    text1 = "Raising Agents [INS 503(ii), INS 500(ii)], Emulsifier [INS 322(i)], Flavour Enhancer (INS 621)"
    numbers1 = extract_ins_numbers(text1)
    assert "503" in numbers1
    assert "500" in numbers1
    assert "322" in numbers1
    assert "621" in numbers1

    text2 = "Emulsifier (322), Acidity Regulators (330, 331), Sweeteners (955, 950)"
    numbers2 = extract_ins_numbers(text2)
    assert "322" in numbers2
    assert "330" in numbers2
    assert "331" in numbers2
    assert "955" in numbers2
    assert "950" in numbers2


def test_analyze_msg_additive():
    result = analyze_ingredient("Flavour Enhancer (INS 621)", language="en")
    assert result['is_additive'] is True
    assert result['ins_number'] == "INS 621"
    assert result['category'] == "Flavour Enhancer"
    assert "umami" in result['technical_function'].lower()


def test_explain_food_chemical_7_sections():
    explainer = explain_food_chemical("INS 621", language="en")
    assert explainer['found'] is True
    assert "short_answer" in explainer
    assert "what_it_is" in explainer
    assert "why_it_is_added" in explainer
    assert "what_the_evidence_says" in explainer
    assert "potential_concerns" in explainer
    assert "what_we_do_not_know" in explainer
    assert "sources" in explainer
    assert len(explainer['sources']) > 0


def test_multilingual_ingredient_analysis():
    text = "Wheat Flour, Edible Palm Oil, Sugar, Raising Agent (INS 500), Salt"
    res_en = analyze_all_ingredients(text, language="en")
    res_hi = analyze_all_ingredients(text, language="hi")
    res_te = analyze_all_ingredients(text, language="te")

    assert res_en['total_ingredients'] == 5
    assert res_en['additives_count'] >= 1
    assert "सामग्रियां" in res_hi['summary']
    assert "పదార్థాలు" in res_te['summary']


def test_compound_multi_additive_extraction():
    soda = "Carbonated Water, Acidity Regulators (INS 330, INS 331), Sweeteners (INS 955, INS 950), Preservative (INS 211)"
    res = analyze_all_ingredients(soda, language="en")
    # Must capture both 330 and 331, and both 955 and 950, plus 211
    ins_found = [a['ins_number'] for a in res['additives']]
    assert "INS 330" in ins_found
    assert "INS 331" in ins_found
    assert "INS 955" in ins_found
    assert "INS 950" in ins_found
    assert "INS 211" in ins_found


def test_codex_fallback_classification():
    # 466 is Sodium carboxymethylcellulose (Thickener/Stabilizer)
    exp = explain_food_chemical("466", language="en")
    assert exp['found'] is True
    assert "Thickener" in exp['category']


def test_compatibility_aliases():
    assert explain_chemical == explain_food_chemical
    assert parse_ingredients == parse_ingredients_list
    assert extract_additives_and_explain == analyze_all_ingredients
