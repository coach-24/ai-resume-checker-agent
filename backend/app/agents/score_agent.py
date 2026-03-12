from typing import Dict


def calculate_scores(
    parsed_resume: Dict,
    extracted_skills: Dict,
    ats_result: Dict,
    keyword_result: Dict,
) -> Dict:
    """
    Agent 5: Score Calculation Agent
    Computes resume_score, skill_match, ats_compatibility, keyword_match.
    """

    # --- Skill Match Score ---
    resume_skills = set(s.lower() for s in extracted_skills.get("skills_detected", []))

    # Weight: more unique skills = higher match (cap at 100)
    skill_match = min(100, len(resume_skills) * 6)

    # --- ATS Compatibility Score ---
    ats_compatibility = ats_result.get("ats_score", 70)

    # --- Keyword Match Score ---
    total_jd_keywords = keyword_result.get("total_jd_keywords", 1)
    matched_count = len(keyword_result.get("matched_keywords", []))

    if total_jd_keywords > 0:
        keyword_match = int((matched_count / total_jd_keywords) * 100)
    else:
        keyword_match = 50  # neutral default if no JD provided

    # --- Section Health ---
    section_health = _evaluate_section_health(parsed_resume)

    # --- Overall Resume Score (weighted average) ---
    section_bonus = _section_bonus(section_health)
    resume_score = int(
        (skill_match * 0.30)
        + (ats_compatibility * 0.35)
        + (keyword_match * 0.25)
        + (section_bonus * 0.10)
    )
    resume_score = max(0, min(100, resume_score))

    # --- Potential Score (after improvements) ---
    potential_score = min(100, resume_score + 9)

    return {
        "resume_score": resume_score,
        "skill_match": skill_match,
        "ats_compatibility": ats_compatibility,
        "keyword_match": keyword_match,
        "potential_score": potential_score,
        "section_health": section_health,
    }


def _evaluate_section_health(parsed_resume: Dict) -> Dict:
    def grade(section_key: str) -> str:
        content = parsed_resume.get(section_key, [])
        if len(content) >= 3:
            return "good"
        elif len(content) >= 1:
            return "average"
        return "missing"

    def grade_experience() -> str:
        # Count projects as experience for students/freshers
        exp = parsed_resume.get("experience", [])
        proj = parsed_resume.get("projects", [])
        combined = exp + proj
        if len(combined) >= 3:
            return "good"
        elif len(combined) >= 1:
            return "average"
        return "missing"

    return {
        "experience": grade_experience(),
        "skills": grade("skills"),
        "education": grade("education"),
        "projects": grade("projects"),
        "achievements": grade("achievements"),
    }


def _section_bonus(section_health: Dict) -> int:
    """Convert section health to a 0–100 bonus score."""
    grade_map = {"good": 100, "average": 60, "missing": 0}
    scores = [grade_map.get(v, 0) for v in section_health.values()]
    return int(sum(scores) / len(scores)) if scores else 50
