import os
import tempfile
from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from typing import Dict
from ..models import Diagnosis, DiagnosisIssue, DiagnosisAction
from ..settings import get_settings

router = APIRouter()

# Simple in-memory rate limiter
rate_limit_store: Dict[str, list] = {}

def check_rate_limit(client_ip: str) -> None:
    """Check if client has exceeded rate limit (30 requests per 5 minutes)"""
    import time
    current_time = time.time()
    five_minutes_ago = current_time - 300  # 5 minutes in seconds
    
    # Clean old entries
    if client_ip in rate_limit_store:
        rate_limit_store[client_ip] = [
            timestamp for timestamp in rate_limit_store[client_ip]
            if timestamp > five_minutes_ago
        ]
    else:
        rate_limit_store[client_ip] = []
    
    # Check limit
    if len(rate_limit_store[client_ip]) >= 30:
        raise HTTPException(
            status_code=429,
            detail={
                "error": "Rate limit exceeded",
                "retry_after_s": int(300 - (current_time - rate_limit_store[client_ip][0]))
            }
        )
    
    # Add current request
    rate_limit_store[client_ip].append(current_time)


@router.post("/diagnose", response_model=Diagnosis)
async def diagnose(
    image: UploadFile = File(...),
    client_ip: str = "127.0.0.1"  # In production, get from request
):
    """Diagnose plant from uploaded image."""
    # Check rate limit
    check_rate_limit(client_ip)
    
    # Validate content type
    if image.content_type not in {"image/jpeg", "image/png", "image/webp"}:
        raise HTTPException(status_code=415, detail="Unsupported image type")
    
    # Create temporary file for processing
    temp_file = None
    try:
        # Create temporary file
        with tempfile.NamedTemporaryFile(delete=False, suffix=f".{image.content_type.split('/')[-1]}") as temp_file:
            content = await image.read()
            temp_file.write(content)
            temp_file_path = temp_file.name
        
        # Mock inference - in real app would use ML model
        return Diagnosis(
            top_species=[
                {"species_id": "sp_ficus_lyrata", "confidence": 0.76, "why": ["elliptic leaf", "pinnate venation"]},
                {"species_id": "sp_monstera_deliciosa", "confidence": 0.14},
                {"species_id": "sp_schefflera_arboricola", "confidence": 0.10}
            ],
            issues=[
                DiagnosisIssue(
                    issue="overwatering",
                    likelihood="high",
                    evidence=["lower-leaf chlorosis", "wet soil"],
                    priority=1
                )
            ],
            actions=[
                DiagnosisAction(
                    step="Let top 2–3 cm dry; increase airflow",
                    priority=1,
                    expected_window_hours=72
                ),
                DiagnosisAction(
                    step="Check pot drainage; avoid saucer pooling",
                    priority=2
                )
            ],
            confidence_overall=0.73
        )
    
    finally:
        # Clean up temporary file
        if temp_file and os.path.exists(temp_file_path):
            os.unlink(temp_file_path)
