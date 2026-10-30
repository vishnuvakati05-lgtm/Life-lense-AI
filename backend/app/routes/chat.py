from flask import Blueprint, jsonify, request
from app.services.ai_chat_service import process_chat_message

chat_bp = Blueprint('chat', __name__)


@chat_bp.route('/api/chat', methods=['POST'])
def chat():
    """
    Multilingual conversational AI food assistant:
    Accepts user question, product context, conversation history, language, and response length.
    """
    data = request.get_json() or {}
    message = data.get('message', '').strip()
    product_context = data.get('product_context', {})
    history = data.get('history', [])
    language = data.get('language', 'en')
    response_length = data.get('response_length', 'quick')

    if not message:
        return jsonify({'error': 'Message is required'}), 400

    response = process_chat_message(
        user_message=message,
        product_context=product_context,
        conversation_history=history,
        language=language,
        response_length=response_length
    )

    return jsonify(response)

