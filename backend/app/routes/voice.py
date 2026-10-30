from flask import Blueprint, jsonify, request
from app.services.voice_service import transcribe_audio_file, synthesize_speech

voice_bp = Blueprint('voice', __name__)


@voice_bp.route('/api/voice/transcribe', methods=['POST'])
def transcribe():
    """Transcribe speech audio."""
    language = request.form.get('language', 'en')
    if 'audio' in request.files:
        audio_file = request.files['audio']
        audio_bytes = audio_file.read()
    else:
        audio_bytes = b''

    result = transcribe_audio_file(audio_bytes, language=language)
    return jsonify(result)


@voice_bp.route('/api/voice/synthesize', methods=['POST'])
def synthesize():
    """Synthesize text into speech guidance / audio."""
    data = request.get_json() or {}
    text = data.get('text', '')
    language = data.get('language', 'en')

    result = synthesize_speech(text, language=language)
    return jsonify(result)

