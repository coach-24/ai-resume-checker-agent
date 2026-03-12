import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

load_dotenv()

from app.routes.resume_routes import router

app = FastAPI(
    title="AI Resume Checker API",
    description="Multi-agent AI pipeline for resume analysis",
    version="1.0.0",
)

raw_origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000")
allowed_origins = [o.strip() for o in raw_origins.split(",")]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router, prefix="/api")

@app.get("/")
def root():
    return {
        "message": "AI Resume Checker API is running",
        "docs": "/docs",
        "version": "1.0.0",
    }