from pydantic import BaseModel
from typing import List, Optional


class DiagnosisIssue(BaseModel):
    issue: str
    likelihood: str  # "low" | "medium" | "high"
    evidence: List[str] = []
    priority: int = 1


class DiagnosisAction(BaseModel):
    step: str
    priority: int = 1
    expected_window_hours: Optional[int] = None


class Diagnosis(BaseModel):
    top_species: List[dict]
    issues: List[DiagnosisIssue]
    actions: List[DiagnosisAction]
    confidence_overall: float


class Plant(BaseModel):
    id: str
    owner_id: str
    species_id: Optional[str] = None
    nickname: Optional[str] = None
    pot_size_cm: Optional[int] = None
    medium: Optional[str] = None
    container_material: Optional[str] = None
    light_env: Optional[str] = None


class CarePlan(BaseModel):
    plant_id: str
    next_water_at: str
    interval_days: int
    basis: dict
    feed_plan: dict
