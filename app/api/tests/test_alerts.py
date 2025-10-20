import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)


def test_get_alerts():
    """Test getting alerts for a city."""
    response = client.get("/v1/alerts?city=Keller")
    
    assert response.status_code == 200
    
    data = response.json()
    assert "city" in data
    assert "alerts" in data
    assert "forecast_summary" in data
    assert data["city"] == "Keller"
    assert isinstance(data["alerts"], list)
    assert isinstance(data["forecast_summary"], dict)


def test_get_alerts_without_city():
    """Test getting alerts without city parameter."""
    response = client.get("/v1/alerts")
    
    # Should return 422 for missing required parameter
    assert response.status_code == 422


def test_alerts_structure():
    """Test that alerts have expected structure when present."""
    response = client.get("/v1/alerts?city=Keller")
    data = response.json()
    
    if data["alerts"]:  # If alerts are present
        alert = data["alerts"][0]
        assert "type" in alert
        assert "severity" in alert
        assert "message" in alert
        assert "recommendations" in alert
        assert isinstance(alert["recommendations"], list)
