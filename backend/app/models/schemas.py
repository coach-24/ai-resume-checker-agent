from pydantic import BaseModel
from typing import List, Dict


class SectionHealth(BaseModel):
    experience: str
    skills: str
    education: str
    projects: str
    achievements: str


class AnalysisResult(BaseModel):
    resume_score: int
    skill_match: int
    ats_compatibility: int
    keyword_match: int
    potential_score: int
    missing_skills: List[str]
    matched_skills: List[str]
    section_health: SectionHealth
    suggestions: List[str]
    ats_issues: List[str]
    matched_keywords: List[str]
    missing_keywords: List[str]