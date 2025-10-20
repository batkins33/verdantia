from fastapi import APIRouter, HTTPException
from ..models import CarePlan
from ..care_engine import compute_care_plan

router = APIRouter()

# Mock species profiles
SPECIES_PROFILES = {
    "sp_ficus_lyrata": {
        "species_id": "sp_ficus_lyrata",
        "common_name": "Fiddle Leaf Fig",
        "watering_needs": "moderate",
        "light_requirements": "bright_indirect"
    },
    "sp_monstera_deliciosa": {
        "species_id": "sp_monstera_deliciosa", 
        "common_name": "Swiss Cheese Plant",
        "watering_needs": "moderate",
        "light_requirements": "bright_indirect"
    },
    "sp_schefflera_arboricola": {
        "species_id": "sp_schefflera_arboricola",
        "common_name": "Umbrella Tree", 
        "watering_needs": "moderate",
        "light_requirements": "bright_indirect"
    }
}


@router.get("/plants/{plant_id}/care", response_model=CarePlan)
def get_care_plan(plant_id: str):
    """Get care plan for a specific plant."""
    # Mock context - in real app would fetch from database
    context = {
        "plant_id": plant_id,
        "pot_cm": 15,
        "medium": "soil",
        "humidity": 45,
        "light": "bright_indirect",
        "weather": "normal"
    }
    
    # Use first species profile as default
    species_profile = SPECIES_PROFILES["sp_ficus_lyrata"]
    
    return compute_care_plan(species_profile, context)
