import pytest
from app import create_app


@pytest.fixture
def client():
    app = create_app()
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client


def test_health_endpoint(client):
    res = client.get('/api/health')
    assert res.status_code == 200
    assert res.json['status'] == 'healthy'


def test_explain_endpoint(client):
    res = client.post('/api/ingredient/explain', json={'query': 'INS 621', 'language': 'en'})
    assert res.status_code == 200
    assert res.json['found'] is True
    assert "Monosodium Glutamate" in res.json['name']
    assert "short_answer" in res.json


def test_analyze_endpoint(client):
    payload = {
        'product_name': 'Test Biscuit',
        'ingredients': 'Refined Wheat Flour, Sugar, Edible Palm Oil, Raising Agents [INS 503(ii), INS 500(ii)], Emulsifier (INS 322), Iodised Salt',
        'allergen_statement': 'Contains Wheat, Soy and Milk',
        'user_allergens': ['wheat', 'milk', 'peanuts'],
        'language': 'en'
    }
    res = client.post('/api/analyze', json=payload)
    assert res.status_code == 200
    data = res.json
    assert data['overall_status'] == 'POTENTIAL_ALLERGEN_DETECTED'
    assert 'ingredient_intelligence' in data
    assert data['ingredient_intelligence']['additives_count'] >= 2


def test_chat_endpoint_multilingual(client):
    payload_en = {
        'message': 'What does INS 500 do?',
        'product_context': {'product_name': 'Test Biscuit', 'ingredients': 'Wheat, Sugar, INS 500'},
        'language': 'en'
    }
    res_en = client.post('/api/chat', json=payload_en)
    assert res_en.status_code == 200
    assert 'answer' in res_en.json

    payload_hi = {
        'message': 'इसमें कौन से केमिकल हैं?',
        'product_context': {'product_name': 'Test Biscuit', 'ingredients': 'Wheat, Sugar, INS 500'},
        'language': 'hi'
    }
    res_hi = client.post('/api/chat', json=payload_hi)
    assert res_hi.status_code == 200
    assert 'answer' in res_hi.json

