import re
from typing import Dict, List

REQUIRED_SECTIONS = ["skills"]
RECOMMENDED_SECTIONS = ["education"]
OPTIONAL_SECTIONS = ["achievements"]

ATS_NEGATIVE_PATTERNS = [
    (r"(table|column)", "Table-based layout may confuse ATS parsers"),
]

KEYWORD_DENSITY_THRESHOLD = 0.01


def analyze_ats(parsed_resume: Dict, extracted_skills: Dict) -> Dict:
    """
    Agent 3: ATS Analysis Agent
    """
    text = parsed_resume.get("text", "")
    issues: List[str] = []
    score = 100

    # Check required sections
    for section in REQUIRED_SECTIONS:
        if not parsed_resume.get(section):
            issues.append(f"Missing or empty '{section}' section")
            score -= 8

    # Check recommended sections
    for section in RECOMMENDED_SECTIONS:
        if not parsed_resume.get(section):
            issues.append(f"Consider adding a '{section}' section")
            score -= 4

    # Check optional sections
    for section in OPTIONAL_SECTIONS:
        if not parsed_resume.get(section):
            issues.append(f"Consider adding a '{section}' section")
            score -= 2

    # Experience OR projects — either is fine
    has_experience = bool(parsed_resume.get("experience"))
    has_projects = bool(parsed_resume.get("projects"))
    if not has_experience and not has_projects:
        issues.append("Add work experience or projects section")
        score -= 10

    # Keyword density
    words = re.findall(r'\b\w+\b', text.lower())
    total_words = len(words)
    skill_count = extracted_skills.get("skill_count", 0)

    if total_words > 0:
        density = skill_count / total_words
        if density < KEYWORD_DENSITY_THRESHOLD:
            issues.append("Low technical keyword density — add more specific skills")
            score -= 10

    # ATS unfriendly patterns
    for pattern, message in ATS_NEGATIVE_PATTERNS:
        if re.search(pattern, text):
            issues.append(message)
            score -= 5

    # Length check
    if total_words < 200:
        issues.append("Resume appears too short — add more detail")
        score -= 10
    elif total_words > 1200:
        issues.append("Resume may be too long — aim for 1 page if entry-level")
        score -= 3

    ats_score = max(0, min(100, score))

    return {
        "ats_score": ats_score,
        "issues": issues,
    }