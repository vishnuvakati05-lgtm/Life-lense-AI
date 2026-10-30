from flask import Blueprint, jsonify, request
from app.models import get_or_create_default_profile, get_scan_history, get_scan_by_id, delete_scan, delete_all_history, save_scan

history_bp = Blueprint('history', __name__)


@history_bp.route('/api/history', methods=['GET'])
def get_history():
    """Get scan history."""
    profile = get_or_create_default_profile()
    limit = request.args.get('limit', 50, type=int)
    history = get_scan_history(profile['id'], limit=min(limit, 100))
    return jsonify({'history': history})


@history_bp.route('/api/history', methods=['POST'])
def save_to_history():
    """Save a scan to history."""
    data = request.get_json()
    if not data:
        return jsonify({'error': 'No data provided'}), 400

    profile = get_or_create_default_profile()
    data['profile_id'] = profile['id']
    scan_id = save_scan(data)
    return jsonify({'scan_id': scan_id, 'message': 'Saved'}), 201


@history_bp.route('/api/history/<scan_id>', methods=['GET'])
def get_history_item(scan_id):
    """Get a single scan from history."""
    scan = get_scan_by_id(scan_id)
    if scan:
        return jsonify(scan)
    return jsonify({'error': 'Scan not found'}), 404


@history_bp.route('/api/history/<scan_id>', methods=['DELETE'])
def delete_history_item(scan_id):
    """Delete a single scan from history."""
    delete_scan(scan_id)
    return jsonify({'message': 'Deleted'}), 200


@history_bp.route('/api/history', methods=['DELETE'])
def clear_history():
    """Delete all scan history."""
    profile = get_or_create_default_profile()
    delete_all_history(profile['id'])
    return jsonify({'message': 'All history deleted'}), 200
