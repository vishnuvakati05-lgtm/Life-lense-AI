import os
from flask import Flask, redirect, jsonify, request
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

    # Register root routes
    @app.route('/')
    def root():
        """Root route: Redirect browsers to the Vite frontend (port 5173), or return API info."""
        accept_header = request.headers.get('Accept', '')
        if 'text/html' in accept_header:
            return redirect("http://localhost:5173", code=302)
        return jsonify({
            "service": "LifeLens AI Backend API",
            "status": "online",
            "frontend_url": "http://localhost:5173",
            "message": "LifeLens AI backend is running. Open http://localhost:5173 in your browser to access the website.",
            "endpoints": [
                "/api/scan", "/api/analyze", "/api/barcode",
                "/api/explain", "/api/chat", "/api/history", "/api/profile", "/health"
            ]
        })

    @app.route('/api')
    def api_index():
        """API directory listing."""
        return jsonify({
            "service": "LifeLens AI Backend API",
            "status": "online",
            "version": "1.0.0",
            "endpoints": [
                "/api/scan", "/api/analyze", "/api/barcode",
                "/api/explain", "/api/chat", "/api/history", "/api/profile", "/health"
            ]
        })

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
        return {
            'error': 'Not found',
            'message': 'Requested API endpoint does not exist. Visit http://localhost:5173 for the web application.',
            'available_endpoints': ['/api/scan', '/api/analyze', '/api/barcode', '/api/explain', '/api/chat', '/api/history', '/api/profile', '/health']
        }, 404

    @app.errorhandler(413)
    def too_large(e):
        return {'error': 'File too large', 'message': 'Maximum file size is 10 MB'}, 413

    @app.errorhandler(500)
    def server_error(e):
        return {'error': 'Internal server error'}, 500

    return app
