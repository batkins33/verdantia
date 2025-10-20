import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)


def test_get_care_plan():
    """Test getting care plan for a plant."""
    plant_id = "test_plant_123"
    response = client.get(f"/v1/plants/{plant_id}/care")
    
    assert response.status_code == 200
    
    data = response.json()
    assert data["plant_id"] == plant_id
    assert "next_water_at" in data
    assert "interval_days" in data
    assert "basis" in data
    assert "feed_plan" in data
    
    # Check data types
    assert isinstance(data["interval_days"], int)
    assert isinstance(data["basis"], dict)
    assert isinstance(data["feed_plan"], dict)
    assert data["interval_days"] > 0
