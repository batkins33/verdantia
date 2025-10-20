import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)


def test_diagnose_success():
    """Test successful diagnosis with valid image."""
    # Create a mock image file
    files = {"image": ("test.jpg", b"fake image content", "image/jpeg")}
    
    response = client.post("/v1/diagnose", files=files)
    assert response.status_code == 200
    
    data = response.json()
    assert "top_species" in data
    assert "issues" in data
    assert "actions" in data
    assert "confidence_overall" in data
    assert isinstance(data["top_species"], list)
    assert isinstance(data["issues"], list)
    assert isinstance(data["actions"], list)


def test_diagnose_unsupported_format():
    """Test diagnosis with unsupported image format."""
    files = {"image": ("test.txt", b"not an image", "text/plain")}
    
    response = client.post("/v1/diagnose", files=files)
    assert response.status_code == 415
    assert "Unsupported image type" in response.json()["detail"]


def test_diagnose_rate_limit():
    """Test rate limiting (simplified - would need proper IP handling in real test)."""
    files = {"image": ("test.jpg", b"fake image content", "image/jpeg")}
    
    # Make 31 requests (should trigger rate limit at 30)
    responses = []
    for i in range(31):
        response = client.post("/v1/diagnose", files=files)
        responses.append(response)
    
    # At least one should be rate limited
    rate_limited = any(r.status_code == 429 for r in responses)
    assert rate_limited
