from fastapi import APIRouter, Query, HTTPException
from typing import List
from ..models import DiagnosisIssue, DiagnosisAction
from ..services.weather import WeatherService, MockWeatherService

router = APIRouter()

# Initialize weather service
weather_service: WeatherService = MockWeatherService()


@router.get("/alerts")
def get_alerts(city: str = Query(..., description="City name for weather alerts")):
    """Get plant care alerts based on weather conditions."""
    try:
        forecast = weather_service.get_forecast(city)
        
        alerts = []
        
        # Check for frost risk
        if forecast.get("min_temp", 20) < 5:
            alerts.append({
                "type": "frost_risk",
                "severity": "high",
                "message": f"Frost risk detected in {city}. Move sensitive plants indoors.",
                "recommendations": [
                    "Move outdoor plants to sheltered location",
                    "Cover plants with frost cloth",
                    "Water plants before frost to protect roots"
                ]
            })
        
        # Check for low humidity
        if forecast.get("humidity", 50) < 30:
            alerts.append({
                "type": "low_humidity", 
                "severity": "medium",
                "message": f"Low humidity ({forecast.get('humidity', 0)}%) in {city}. Plants may need extra moisture.",
                "recommendations": [
                    "Increase watering frequency",
                    "Use humidity tray or humidifier",
                    "Group plants together to increase humidity"
                ]
            })
        
        return {
            "city": city,
            "alerts": alerts,
            "forecast_summary": {
                "temperature": f"{forecast.get('min_temp', 0)}°C - {forecast.get('max_temp', 0)}°C",
                "humidity": f"{forecast.get('humidity', 0)}%",
                "conditions": forecast.get("conditions", "unknown")
            }
        }
    
    except ValueError as e:
        raise HTTPException(status_code=400, detail=f"Invalid city name: {str(e)}")
    except ConnectionError as e:
        raise HTTPException(status_code=503, detail="Weather service unavailable")
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal server error")
