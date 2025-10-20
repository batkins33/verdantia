from fastapi import FastAPI
from datetime import datetime
from verdantia_api.routers import diagnose, plants, alerts
from verdantia_api.middlewares import add_middlewares

app = FastAPI(title="Verdantia API", version="0.1.0")

# Add middlewares
add_middlewares(app)

# Include routers
app.include_router(diagnose.router, prefix="/v1", tags=["diagnosis"])
app.include_router(plants.router, prefix="/v1", tags=["plants"])
app.include_router(alerts.router, prefix="/v1", tags=["alerts"])

@app.get("/health")
def health():
    return {"status": "ok", "time": datetime.utcnow().isoformat() + "Z"}
