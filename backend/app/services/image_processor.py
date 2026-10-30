"""
LifeLens AI — Image Processing Service

Handles image validation, quality assessment, and preprocessing for OCR.
Uses OpenCV and Pillow for image manipulation.
"""

import os
import cv2
import numpy as np
from PIL import Image
import uuid
from app.config import Config


def validate_image(filepath: str) -> dict:
    """
    Validate that a file is a real, decodable image.
    Returns validation result with quality metrics.
    """
    result = {'valid': False, 'quality': {}}
    
    try:
        # Try to open with Pillow (validates image format)
        with Image.open(filepath) as img:
            img.verify()
        
        # Re-open to get actual data (verify() can close the file)
        with Image.open(filepath) as img:
            width, height = img.size
            mode = img.mode
            fmt = img.format
        
        # Read with OpenCV for quality checks
        cv_img = cv2.imread(filepath)
        if cv_img is None:
            result['message'] = 'Could not decode image with OpenCV'
            return result
        
        # Basic quality checks
        quality = {
            'width': width,
            'height': height,
            'format': fmt,
            'mode': mode,
            'resolution_ok': width >= 200 and height >= 200,
            'blur_score': None,
            'brightness': None
        }
        
        # Check blur using Laplacian variance
        gray = cv2.cvtColor(cv_img, cv2.COLOR_BGR2GRAY)
        blur_score = cv2.Laplacian(gray, cv2.CV_64F).var()
        quality['blur_score'] = round(blur_score, 2)
        quality['is_blurry'] = blur_score < 50  # Threshold for blur detection
        
        # Check brightness
        brightness = np.mean(gray)
        quality['brightness'] = round(float(brightness), 2)
        quality['is_too_dark'] = brightness < 40
        quality['is_too_bright'] = brightness > 240
        
        # Build quality warnings
        warnings = []
        if quality['is_blurry']:
            warnings.append('Image appears blurry. OCR results may be less accurate.')
        if quality['is_too_dark']:
            warnings.append('Image appears too dark. Consider using better lighting.')
        if quality['is_too_bright']:
            warnings.append('Image appears overexposed. Consider reducing brightness.')
        if not quality['resolution_ok']:
            warnings.append('Image resolution is low. Higher resolution improves accuracy.')
        
        quality['warnings'] = warnings
        quality['overall'] = 'good' if not warnings else ('fair' if len(warnings) == 1 else 'poor')
        
        result['valid'] = True
        result['quality'] = quality
        
    except Exception as e:
        result['message'] = f'Invalid image file: could not decode'
    
    return result


def preprocess_image(filepath: str) -> str:
    """
    Preprocess image for better OCR results.
    Returns path to processed image.
    """
    try:
        img = cv2.imread(filepath)
        if img is None:
            return filepath
        
        # Convert to grayscale
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        
        # Apply adaptive threshold for better text contrast
        # This helps with varying lighting conditions on food labels
        denoised = cv2.fastNlMeansDenoising(gray, None, 10, 7, 21)
        
        # Adaptive thresholding for better text extraction
        thresh = cv2.adaptiveThreshold(
            denoised, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
            cv2.THRESH_BINARY, 15, 8
        )
        
        # Slight sharpening
        kernel = np.array([[-1, -1, -1],
                          [-1,  9, -1],
                          [-1, -1, -1]])
        sharpened = cv2.filter2D(thresh, -1, kernel)
        
        # Save processed image
        processed_filename = f"processed_{uuid.uuid4().hex}.png"
        processed_path = os.path.join(Config.UPLOAD_FOLDER, processed_filename)
        cv2.imwrite(processed_path, sharpened)
        
        return processed_path
        
    except Exception:
        # If preprocessing fails, return original
        return filepath
