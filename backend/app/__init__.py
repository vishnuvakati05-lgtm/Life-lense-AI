import os
from flask import Flask
from flask_cors import CORS
from app.config import Config
from app.models import init_db


def create_app():
    """Create and configure the Flask application."""
    app = Flask(__name__)
    app.config.from_object(Config)
    app.config['MAX_CONTENT_LENGTH'] = Config.MAX_CONTENT_LENGTH

    # Restricted CORS
    CORS(app, origins=Config.CORS_ORIGINS, supports_credentials=True)

    # Ensure upload directory exists
    os.makedirs(Config.UPLOAD_FOLDER, exist_ok=True)

    # Initialize database
    init_db()

    # Register blueprints
    from app.routes.health import health_bp
    from app.routes.profile import profile_bp
    from app.routes.scan import scan_bp
    from app.routes.analyze import analyze_bp
    from app.routes.barcode import barcode_bp
    from app.routes.compare import compare_bp
    from app.routes.history import history_bp
    from app.routes.explain import explain_bp
    from app.routes.chat import chat_bp
    from app.routes.voice import voice_bp

    app.register_blueprint(health_bp)
    app.register_blueprint(profile_bp)
    app.register_blueprint(scan_bp)
    app.register_blueprint(analyze_bp)
    app.register_blueprint(barcode_bp)
    app.register_blueprint(compare_bp)
    app.register_blueprint(history_bp)
    app.register_blueprint(explain_bp)
    app.register_blueprint(chat_bp)
    app.register_blueprint(voice_bp)

    # Global error handlers
    @app.errorhandler(400)
    def bad_request(e):
        return {'error': 'Bad request', 'message': str(getattr(e, 'description', e))}, 400

    @app.errorhandler(404)
    def not_found(e):
        return {'error': 'Not found'}, 404

    @app.errorhandler(413)
    def too_large(e):
        return {'error': 'File too large', 'message': 'Maximum file size is 10 MB'}, 413

    @app.errorhandler(500)
    def server_error(e):
        return {'error': 'Internal server error'}, 500

    return app
