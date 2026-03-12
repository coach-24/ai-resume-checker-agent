"""
analysis_service.py
Place this at: backend/app/services/analysis_service.py
"""

from typing import Dict
from app.agents.resume_parser_agent import parse_resume
from app.agents.suggestion_agent import analyze_with_ai
from app.services.resume_validator import is_resume


async def run_analysis_pipeline(file_bytes: bytes, filename: str, job_description: str) -> Dict:

    # Step 1 — Parse the file
    parsed_resume = parse_resume(file_bytes, filename)
    resume_text = parsed_resume.get("text", "")

    if not resume_text.strip():
        raise RuntimeError(
            "Could not extract text from the file. "
            "Make sure it is not a scanned image PDF."
        )

    # Step 2 — Validate it's actually a resume
    valid, reason = is_resume(resume_text)
    if not valid:
        raise RuntimeError(reason)

    # Step 3 — Run AI analysis
    result = await analyze_with_ai(resume_text, job_description)

    return {
        "resume_score":      int(result.get("resume_score", 0)),
        "skill_match":       int(result.get("skill_match", 0)),
        "ats_compatibility": int(result.get("ats_compatibility", 0)),
        "keyword_match":     int(result.get("keyword_match", 0)),
        "potential_score":   int(result.get("potential_score", 0)),
        "matched_skills":    result.get("matched_skills", []),
        "missing_skills":    result.get("missing_skills", []),
        "section_health":    result.get("section_health", {
            "experience":   "missing",
            "skills":       "missing",
            "education":    "missing",
            "projects":     "missing",
            "achievements": "missing"
        }),
        "ats_issues":        result.get("ats_issues", []),
        "matched_keywords":  result.get("matched_keywords", []),
        "missing_keywords":  result.get("missing_keywords", []),
        "suggestions":       result.get("suggestions", []),
    }
