import sqlite3
import os
import json
import uuid
from datetime import datetime
from app.config import Config


def get_db():
    """Get a database connection."""
    db = sqlite3.connect(Config.DATABASE_PATH)
    db.row_factory = sqlite3.Row
    db.execute("PRAGMA journal_mode=WAL")
    db.execute("PRAGMA foreign_keys=ON")
    return db


def init_db():
    """Initialize the database schema."""
    db = get_db()
    db.executescript('''
        CREATE TABLE IF NOT EXISTS user_profiles (
            id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
            name TEXT DEFAULT 'Default',
            allergens TEXT DEFAULT '[]',
            custom_allergens TEXT DEFAULT '[]',
            language TEXT DEFAULT 'en',
            font_size TEXT DEFAULT 'medium',
            speech_rate REAL DEFAULT 1.0,
            created_at TEXT DEFAULT (datetime('now')),
            updated_at TEXT DEFAULT (datetime('now'))
        );

        CREATE TABLE IF NOT EXISTS scan_records (
            id TEXT PRIMARY KEY,
            profile_id TEXT,
            product_name TEXT,
            barcode TEXT,
            extracted_ingredients TEXT,
            extracted_nutrition TEXT,
            allergen_results TEXT,
            nutrition_analysis TEXT,
            image_path TEXT,
            data_source TEXT DEFAULT 'ocr',
            source_metadata TEXT DEFAULT '{}',
            created_at TEXT DEFAULT (datetime('now')),
            FOREIGN KEY (profile_id) REFERENCES user_profiles(id) ON DELETE SET NULL
        );

        CREATE TABLE IF NOT EXISTS saved_products (
            id TEXT PRIMARY KEY,
            profile_id TEXT,
            scan_id TEXT,
            product_name TEXT,
            barcode TEXT,
            saved_at TEXT DEFAULT (datetime('now')),
            FOREIGN KEY (profile_id) REFERENCES user_profiles(id) ON DELETE CASCADE,
            FOREIGN KEY (scan_id) REFERENCES scan_records(id) ON DELETE CASCADE
        );
    ''')
    db.commit()
    db.close()


def get_or_create_default_profile():
    """Get or create the default anonymous profile."""
    db = get_db()
    profile = db.execute('SELECT * FROM user_profiles WHERE name = ?', ('Default',)).fetchone()
    if not profile:
        profile_id = uuid.uuid4().hex
        db.execute(
            'INSERT INTO user_profiles (id, name) VALUES (?, ?)',
            (profile_id, 'Default')
        )
        db.commit()
        profile = db.execute('SELECT * FROM user_profiles WHERE id = ?', (profile_id,)).fetchone()
    db.close()
    return dict(profile)


def update_profile(profile_id, data):
    """Update a user profile."""
    db = get_db()
    fields = []
    values = []
    allowed = ['name', 'allergens', 'custom_allergens', 'language', 'font_size', 'speech_rate']
    for key in allowed:
        if key in data:
            fields.append(f'{key} = ?')
            val = data[key]
            if isinstance(val, (list, dict)):
                val = json.dumps(val)
            values.append(val)
    if fields:
        fields.append("updated_at = datetime('now')")
        values.append(profile_id)
        db.execute(
            f'UPDATE user_profiles SET {", ".join(fields)} WHERE id = ?',
            values
        )
        db.commit()
    profile = db.execute('SELECT * FROM user_profiles WHERE id = ?', (profile_id,)).fetchone()
    db.close()
    return dict(profile) if profile else None


def delete_profile(profile_id):
    """Delete a profile and its associated data."""
    db = get_db()
    db.execute('DELETE FROM saved_products WHERE profile_id = ?', (profile_id,))
    db.execute('DELETE FROM scan_records WHERE profile_id = ?', (profile_id,))
    db.execute('DELETE FROM user_profiles WHERE id = ?', (profile_id,))
    db.commit()
    db.close()


def save_scan(scan_data):
    """Save a scan record."""
    db = get_db()
    scan_id = scan_data.get('id', uuid.uuid4().hex)
    db.execute(
        '''INSERT INTO scan_records 
           (id, profile_id, product_name, barcode, extracted_ingredients, 
            extracted_nutrition, allergen_results, nutrition_analysis, 
            image_path, data_source, source_metadata)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)''',
        (
            scan_id,
            scan_data.get('profile_id'),
            scan_data.get('product_name', 'Unknown Product'),
            scan_data.get('barcode'),
            json.dumps(scan_data.get('extracted_ingredients', '')),
            json.dumps(scan_data.get('extracted_nutrition', {})),
            json.dumps(scan_data.get('allergen_results', [])),
            json.dumps(scan_data.get('nutrition_analysis', {})),
            scan_data.get('image_path'),
            scan_data.get('data_source', 'ocr'),
            json.dumps(scan_data.get('source_metadata', {}))
        )
    )
    db.commit()
    db.close()
    return scan_id


def get_scan_history(profile_id, limit=50):
    """Get scan history for a profile."""
    db = get_db()
    rows = db.execute(
        'SELECT * FROM scan_records WHERE profile_id = ? ORDER BY created_at DESC LIMIT ?',
        (profile_id, limit)
    ).fetchall()
    db.close()
    results = []
    for row in rows:
        d = dict(row)
        for field in ['extracted_ingredients', 'extracted_nutrition', 'allergen_results', 'nutrition_analysis', 'source_metadata']:
            if d.get(field):
                try:
                    d[field] = json.loads(d[field])
                except (json.JSONDecodeError, TypeError):
                    pass
        results.append(d)
    return results


def get_scan_by_id(scan_id):
    """Get a single scan record."""
    db = get_db()
    row = db.execute('SELECT * FROM scan_records WHERE id = ?', (scan_id,)).fetchone()
    db.close()
    if row:
        d = dict(row)
        for field in ['extracted_ingredients', 'extracted_nutrition', 'allergen_results', 'nutrition_analysis', 'source_metadata']:
            if d.get(field):
                try:
                    d[field] = json.loads(d[field])
                except (json.JSONDecodeError, TypeError):
                    pass
        return d
    return None


def delete_scan(scan_id):
    """Delete a scan record."""
    db = get_db()
    db.execute('DELETE FROM saved_products WHERE scan_id = ?', (scan_id,))
    db.execute('DELETE FROM scan_records WHERE id = ?', (scan_id,))
    db.commit()
    db.close()


def delete_all_history(profile_id):
    """Delete all scan history for a profile."""
    db = get_db()
    db.execute('DELETE FROM saved_products WHERE profile_id = ?', (profile_id,))
    db.execute('DELETE FROM scan_records WHERE profile_id = ?', (profile_id,))
    db.commit()
    db.close()
