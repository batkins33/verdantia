from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_health():
    r = client.get('/health')
    assert r.status_code == 200
    assert r.json()['status'] == 'ok'

def test_care():
    r = client.get('/v1/plants/pl_001/care')
    assert r.status_code == 200
    data = r.json()
    assert 'next_water_at' in data
    assert data['interval_days'] > 0
