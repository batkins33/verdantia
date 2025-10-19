from fastapi import FastAPI, UploadFile, File, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime, timedelta

app = FastAPI(title="Verdantia API", version="0.1.0")

# ---- Models ----
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

# ---- Endpoints ----
@app.get("/health")
def health():
    return {"status": "ok", "time": datetime.utcnow().isoformat() + "Z"}

@app.post("/v1/diagnose", response_model=Diagnosis)
async def diagnose(image: UploadFile = File(...)):
    if image.content_type not in {"image/jpeg","image/png","image/webp"}:
        raise HTTPException(status_code=415, detail="Unsupported image type")
    # Mock inference
    return Diagnosis(
        top_species=[
            {"species_id":"sp_ficus_lyrata","confidence":0.76,"why":["elliptic leaf","pinnate venation"]},
            {"species_id":"sp_monstera_deliciosa","confidence":0.14},
            {"species_id":"sp_schefflera_arboricola","confidence":0.10}
        ],
        issues=[
            {"issue":"overwatering","likelihood":"high","evidence":["lower-leaf chlorosis","wet soil"],"priority":1}
        ],
        actions=[
            {"step":"Let top 2–3 cm dry; increase airflow","priority":1,"expected_window_hours":72},
            {"step":"Check pot drainage; avoid saucer pooling","priority":2}
        ],
        confidence_overall=0.73
    )

@app.get("/v1/plants/{plant_id}/care", response_model=CarePlan)
def care(plant_id: str):
    now = datetime.utcnow()
    return CarePlan(
        plant_id=plant_id,
        next_water_at=(now + timedelta(days=8)).isoformat() + "Z",
        interval_days=8,
        basis={"species":"moderate","pot_cm":15,"medium":"soil","humidity":45,"light":"bright_indirect","weather":"heatwave"},
        feed_plan={"npk":"10-10-10","strength":"0.25x","cadence_days":30}
    )
