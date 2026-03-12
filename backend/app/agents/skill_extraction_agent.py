import re
from typing import Dict, List

SKILL_VOCABULARY = {
    "languages": [
        "python", "javascript", "typescript", "java", "c++", "c#", "go", "rust",
        "ruby", "php", "swift", "kotlin", "scala", "r", "matlab", "bash", "shell",
    ],
    "frameworks": [
        "react", "vue", "angular", "next.js", "nuxt", "django", "flask", "fastapi",
        "spring", "express", "nestjs", "laravel", "rails", "svelte", "gatsby",
    ],
    "tools": [
        "docker", "kubernetes", "git", "github", "gitlab", "jenkins", "terraform",
        "ansible", "nginx", "apache", "webpack", "vite", "linux", "aws", "azure",
        "gcp", "firebase", "vercel", "heroku", "ci/cd", "jira", "figma",
    ],
    "data": [
        "machine learning", "deep learning", "tensorflow", "pytorch", "scikit-learn",
        "pandas", "numpy", "sql", "postgresql", "mysql", "mongodb", "redis",
        "elasticsearch", "spark", "hadoop", "tableau", "power bi",
    ],
    "concepts": [
        "microservices", "rest api", "graphql", "agile", "scrum", "devops",
        "tdd", "clean architecture", "design patterns", "object oriented",
        "functional programming", "system design",
    ],
}


def extract_skills(parsed_resume: Dict) -> Dict:
    """
    Agent 2: Skill Extraction Agent
    Detects and normalizes technical skills from resume text.
    """
    full_text = parsed_resume.get("text", "").lower()
    section_skills = " ".join(parsed_resume.get("skills", [])).lower()
    combined = f"{full_text} {section_skills}"

    detected_skills = []

    for category, skills in SKILL_VOCABULARY.items():
        for skill in skills:
            pattern = r'\b' + re.escape(skill) + r'\b'
            if re.search(pattern, combined):
                detected_skills.append(_normalize(skill))

    seen = set()
    unique_skills = []
    for s in detected_skills:
        if s.lower() not in seen:
            seen.add(s.lower())
            unique_skills.append(s)

    return {
        "skills_detected": unique_skills,
        "skill_count": len(unique_skills),
    }


def _normalize(skill: str) -> str:
    overrides = {
        "next.js": "Next.js",
        "nuxt": "Nuxt.js",
        "ci/cd": "CI/CD",
        "rest api": "REST API",
        "graphql": "GraphQL",
        "nestjs": "NestJS",
        "fastapi": "FastAPI",
        "pytorch": "PyTorch",
        "tensorflow": "TensorFlow",
        "scikit-learn": "Scikit-Learn",
        "aws": "AWS",
        "gcp": "GCP",
    }
    return overrides.get(skill.lower(), skill.title())