"""
Severity Mapping Utility
Converts raw model probabilities to human-readable severity levels
"""

def map_severity(predictions):
    """
    Map raw model predictions to severity levels and structured results
    
    Args:
        predictions (dict): Raw model predictions with probabilities
        
    Returns:
        dict: Structured results with severity levels and confidence scores
    """
    results = {}
    
    # Map acne severity
    if 'acne' in predictions:
        results['acne'] = {
            'probability': float(predictions['acne']),
            'severity': get_severity_level(predictions['acne'], 'acne'),
            'confidence': calculate_confidence(predictions['acne']),
            'description': get_severity_description('acne', predictions['acne'])
        }
    
    # Map pores severity
    if 'pores' in predictions:
        results['pores'] = {
            'probability': float(predictions['pores']),
            'severity': get_severity_level(predictions['pores'], 'pores'),
            'confidence': calculate_confidence(predictions['pores']),
            'description': get_severity_description('pores', predictions['pores'])
        }
    
    # Map pigmentation severity
    if 'pigmentation' in predictions:
        results['pigmentation'] = {
            'probability': float(predictions['pigmentation']),
            'severity': get_severity_level(predictions['pigmentation'], 'pigmentation'),
            'confidence': calculate_confidence(predictions['pigmentation']),
            'description': get_severity_description('pigmentation', predictions['pigmentation'])
        }
    
    # Map skin tone classification
    if 'skin_tone' in predictions:
        results['skin_tone'] = {
            'classification': map_skin_tone(predictions['skin_tone']),
            'confidence': calculate_confidence(predictions['skin_tone']),
            'probability': float(predictions['skin_tone'])
        }
    
    return results

def get_severity_level(probability, concern_type='general'):
    """
    Convert probability to severity level
    
    Args:
        probability (float): Model probability (0-1)
        concern_type (str): Type of skin concern
        
    Returns:
        str: Severity level (mild, moderate, severe)
    """
    thresholds = get_severity_thresholds(concern_type)
    
    if probability < thresholds['mild']:
        return 'mild'
    elif probability < thresholds['moderate']:
        return 'moderate'
    else:
        return 'severe'

def get_severity_thresholds(concern_type):
    """
    Get severity thresholds for different concern types
    
    Args:
        concern_type (str): Type of skin concern
        
    Returns:
        dict: Thresholds for mild, moderate, severe
    """
    thresholds = {
        'acne': {
            'mild': 0.3,
            'moderate': 0.6
        },
        'pores': {
            'mild': 0.25,
            'moderate': 0.55
        },
        'pigmentation': {
            'mild': 0.2,
            'moderate': 0.5
        },
        'general': {
            'mild': 0.25,
            'moderate': 0.55
        }
    }
    
    return thresholds.get(concern_type, thresholds['general'])

def calculate_confidence(probability):
    """
    Calculate confidence score based on probability
    
    Args:
        probability (float): Model probability
        
    Returns:
        float: Confidence score (0-1)
    """
    # Higher confidence for extreme probabilities
    if probability < 0.1 or probability > 0.9:
        return 0.95
    elif probability < 0.2 or probability > 0.8:
        return 0.85
    elif probability < 0.3 or probability > 0.7:
        return 0.75
    else:
        return 0.65

def get_severity_description(concern_type, probability):
    """
    Get human-readable description of severity
    
    Args:
        concern_type (str): Type of skin concern
        probability (float): Model probability
        
    Returns:
        str: Description of severity
    """
    severity = get_severity_level(probability, concern_type)
    
    descriptions = {
        'acne': {
            'mild': 'Minor breakouts, few blemishes',
            'moderate': 'Visible acne, some inflammation',
            'severe': 'Extensive breakouts, significant inflammation'
        },
        'pores': {
            'mild': 'Minimal pore visibility',
            'moderate': 'Noticeable enlarged pores',
            'severe': 'Large, prominent pores'
        },
        'pigmentation': {
            'mild': 'Slight discoloration',
            'moderate': 'Visible dark spots or patches',
            'severe': 'Significant pigmentation issues'
        }
    }
    
    return descriptions.get(concern_type, {}).get(severity, f'{severity} {concern_type}')

def map_skin_tone(probability):
    """
    Map probability to skin tone classification
    
    Args:
        probability (float): Model probability
        
    Returns:
        str: Skin tone classification
    """
    if probability < 0.17:
        return 'very-fair'
    elif probability < 0.33:
        return 'fair'
    elif probability < 0.5:
        return 'medium'
    elif probability < 0.67:
        return 'olive'
    elif probability < 0.83:
        return 'dark'
    else:
        return 'very-dark'

def get_overall_severity(results):
    """
    Calculate overall severity from individual results
    
    Args:
        results (dict): Individual concern results
        
    Returns:
        str: Overall severity level
    """
    if not results:
        return 'normal'
    
    # Weight different concerns
    weights = {
        'acne': 0.4,
        'pores': 0.25,
        'pigmentation': 0.35
    }
    
    severity_scores = {
        'mild': 1,
        'moderate': 2,
        'severe': 3
    }
    
    total_score = 0
    total_weight = 0
    
    for concern, weight in weights.items():
        if concern in results:
            severity = results[concern].get('severity', 'mild')
            total_score += severity_scores[severity] * weight
            total_weight += weight
    
    if total_weight == 0:
        return 'normal'
    
    average_score = total_score / total_weight
    
    if average_score < 1.5:
        return 'mild'
    elif average_score < 2.5:
        return 'moderate'
    else:
        return 'severe'

def validate_predictions(predictions):
    """
    Validate prediction format and values
    
    Args:
        predictions (dict): Raw predictions
        
    Returns:
        bool: True if valid, False otherwise
    """
    if not isinstance(predictions, dict):
        return False
    
    required_fields = ['acne', 'pores', 'pigmentation', 'skin_tone']
    
    for field in required_fields:
        if field not in predictions:
            return False
        
        value = predictions[field]
        if not isinstance(value, (int, float)) or value < 0 or value > 1:
            return False
    
    return True 