from fastapi import APIRouter
from ..models import CarePlan
from ..care_engine import compute_care_plan

router = APIRouter()


def _get_species_profiles():
    """Return mock species profiles for development."""
    return {
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
    species_profiles = _get_species_profiles()
    species_profile = species_profiles["sp_ficus_lyrata"]
    return compute_care_plan(species_profile, context)
    return compute_care_plan(species_profile, context)
