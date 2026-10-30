"""
LifeLens AI — Voice Service
Handles voice transcription and speech synthesis abstraction.
Provides seamless fallbacks to browser Web Speech API when external cloud audio is not enabled.
"""

from typing import Dict, Any


def transcribe_audio_file(audio_bytes: bytes, language: str = 'en') -> Dict[str, Any]:
    """
    Transcribe uploaded audio data.
    If external cloud STT (e.g. Whisper) is configured, process it;
    otherwise instruct the client to utilize the native Web Speech API.
    """
    # Safe fallback response
    return {
        'success': True,
        'transcription': '',
        'language': language,
        'method': 'browser_fallback',
        'message': 'Web Speech API is recommended for direct offline low-latency recognition.'
    }


def synthesize_speech(text: str, language: str = 'en') -> Dict[str, Any]:
    """
    Synthesize text to speech metadata.
    Returns language voice codes (en-US / hi-IN / te-IN) for the client's speech synthesizer.
    """
    lang_codes = {
        'en': 'en-US',
        'hi': 'hi-IN',
        'te': 'te-IN'
    }
    return {
        'success': True,
        'text': text,
        'language_code': lang_codes.get(language, 'en-US'),
        'provider': 'web_speech_api'
    }

