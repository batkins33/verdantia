from abc import ABC, abstractmethod
from typing import Dict


class WeatherService(ABC):
    """Abstract interface for weather services."""
    
    @abstractmethod
    def get_forecast(self, city: str) -> Dict:
        """Get weather forecast for a city."""
        pass


class MockWeatherService(WeatherService):
    """Mock weather service for development and testing."""
    
    def get_forecast(self, city: str) -> Dict:
        """Return deterministic mock weather data."""
        # Deterministic data based on city name
        city_hash = hash(city.lower()) % 100
        
        return {
            "city": city,
            "min_temp": 2 + (city_hash % 15),  # 2-16°C
            "max_temp": 15 + (city_hash % 20),  # 15-34°C
            "humidity": 25 + (city_hash % 50),  # 25-74%
            "conditions": ["sunny", "cloudy", "rainy", "partly_cloudy"][city_hash % 4],
            "wind_speed": 5 + (city_hash % 15),  # 5-19 km/h
            "pressure": 1000 + (city_hash % 50)  # 1000-1049 hPa
        }
