from flask import Blueprint, jsonify, request
from app.models import get_or_create_default_profile, update_profile, delete_profile
import json

profile_bp = Blueprint('profile', __name__)


@profile_bp.route('/api/profile', methods=['GET'])
def get_profile():
    """Get the current user profile."""
    profile = get_or_create_default_profile()
    # Parse JSON fields
    for field in ['allergens', 'custom_allergens']:
        if isinstance(profile.get(field), str):
            try:
                profile[field] = json.loads(profile[field])
            except (json.JSONDecodeError, TypeError):
                profile[field] = []
    return jsonify(profile)


@profile_bp.route('/api/profile', methods=['PUT'])
def update_user_profile():
    """Update the user profile."""
    data = request.get_json()
    if not data:
        return jsonify({'error': 'No data provided'}), 400
    
    profile = get_or_create_default_profile()
    updated = update_profile(profile['id'], data)
    if updated:
        for field in ['allergens', 'custom_allergens']:
            if isinstance(updated.get(field), str):
                try:
                    updated[field] = json.loads(updated[field])
                except (json.JSONDecodeError, TypeError):
                    updated[field] = []
        return jsonify(updated)
    return jsonify({'error': 'Profile not found'}), 404


@profile_bp.route('/api/profile', methods=['DELETE'])
def delete_user_profile():
    """Delete the user profile and all associated data."""
    profile = get_or_create_default_profile()
    delete_profile(profile['id'])
    return jsonify({'message': 'Profile and all associated data deleted'}), 200
