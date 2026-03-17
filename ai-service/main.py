from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import nutrition, recommendations

app = FastAPI(
    title="ForkFit AI Service",
    description="Nutrition calculation, diet rule verification, and meal recommendations",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(nutrition.router)
app.include_router(recommendations.router)


@app.get("/")
def root():
    return {"message": "ForkFit AI Service is running", "version": "1.0.0"}
