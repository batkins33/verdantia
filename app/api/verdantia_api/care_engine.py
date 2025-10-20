from datetime import datetime, timedelta
from .models import CarePlan


def compute_care_plan(species_profile: dict, context: dict) -> CarePlan:
    """Compute care plan based on species profile and environmental context."""
    # Mock implementation - in real app would use ML models
    plant_id = context.get("plant_id", "unknown")
    
    # Determine watering interval based on species
    species_id = species_profile.get("species_id", "unknown")
    interval_days = 7  # default
    
    if "ficus" in species_id.lower():
        interval_days = 8
    elif "monstera" in species_id.lower():
        interval_days = 6
    elif "schefflera" in species_id.lower():
        interval_days = 9
    
    # Adjust based on context
    if context.get("weather") == "heatwave":
        interval_days = max(1, interval_days - 2)
    elif context.get("humidity", 50) < 40:
        interval_days = max(1, interval_days - 1)
    
    now = datetime.utcnow()
    next_water_at = (now + timedelta(days=interval_days)).isoformat() + "Z"
    
    return CarePlan(
        plant_id=plant_id,
        next_water_at=next_water_at,
        interval_days=interval_days,
        basis={
            "species": species_profile.get("species_id", "unknown"),
            "pot_cm": context.get("pot_cm", 15),
            "medium": context.get("medium", "soil"),
            "humidity": context.get("humidity", 45),
            "light": context.get("light", "bright_indirect"),
            "weather": context.get("weather", "normal")
        },
        feed_plan={
            "npk": "10-10-10",
            "strength": "0.25x",
            "cadence_days": 30
        }
    )
