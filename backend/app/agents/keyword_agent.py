import re
from typing import Dict, List

# Common stop words to filter out
STOP_WORDS = {
    "the", "a", "an", "and", "or", "but", "in", "on", "at", "to", "for",
    "of", "with", "by", "from", "as", "is", "was", "are", "were", "be",
    "been", "being", "have", "has", "had", "do", "does", "did", "will",
    "would", "could", "should", "may", "might", "shall", "can", "need",
    "must", "you", "we", "they", "he", "she", "it", "this", "that", "our",
    "your", "their", "its", "not", "no", "also", "just", "if", "then",
    "than", "so", "such", "both", "each", "more", "most", "other", "into",
    "through", "during", "before", "after", "above", "below", "between",
    "out", "up", "down", "about", "any", "all", "both", "few", "own",
    "per", "well", "very", "work", "team", "strong", "experience", "ability",
    "skills", "knowledge", "understanding", "role", "responsibilities", "using",
    "include", "including", "within", "across", "ensure", "provide"
}

MIN_KEYWORD_LENGTH = 3


def match_keywords(parsed_resume: Dict, job_description: str) -> Dict:
    """
    Agent 4: Keyword Matching Agent
    """
    resume_text = parsed_resume.get("text", "").lower()
    jd_text = job_description.lower()

    # If job description is too short, extract role-based keywords automatically
    if len(jd_text.strip()) < 30:
        jd_keywords = _infer_keywords_from_role(jd_text)
    else:
        jd_keywords = _extract_keywords(jd_text)

    matched: List[str] = []
    missing: List[str] = []

    for keyword in jd_keywords:
        pattern = r'\b' + re.escape(keyword) + r'\b'
        if re.search(pattern, resume_text):
            matched.append(keyword)
        else:
            missing.append(keyword)

    return {
        "matched_keywords": matched,
        "missing_keywords": missing,
        "total_jd_keywords": len(jd_keywords),
    }


def _infer_keywords_from_role(jd_text: str) -> List[str]:
    """Auto-expand short job descriptions into relevant keywords."""
    role_keywords = {
        "frontend": ["react", "javascript", "typescript", "css", "html", "vue", "angular", "tailwind", "webpack", "responsive design"],
        "backend": ["python", "node", "django", "fastapi", "flask", "sql", "postgresql", "rest api", "docker", "aws"],
        "fullstack": ["react", "javascript", "node", "sql", "mongodb", "rest api", "git", "docker"],
        "data": ["python", "pandas", "numpy", "sql", "machine learning", "tensorflow", "data analysis"],
        "ml": ["python", "tensorflow", "pytorch", "scikit-learn", "pandas", "numpy", "machine learning"],
        "devops": ["docker", "kubernetes", "ci/cd", "aws", "terraform", "linux", "jenkins"],
    }
    for role, keywords in role_keywords.items():
        if role in jd_text:
            return keywords
    # Default general keywords
    return ["python", "javascript", "sql", "git", "react", "communication", "teamwork"]
def _extract_keywords(text: str) -> List[str]:
    """Extract meaningful keywords from job description text."""
    # Extract multi-word technical phrases first
    phrases = re.findall(
        r'\b(?:machine learning|deep learning|rest api|ci[/\-]cd|object.oriented|'
        r'data science|cloud computing|version control|agile scrum|test driven|'
        r'system design|microservices|natural language processing|computer vision)\b',
        text
    )

    # Extract individual words
    words = re.findall(r'\b\w[\w\+\#\.]*\b', text)
    filtered_words = [
        w for w in words
        if w not in STOP_WORDS
        and len(w) >= MIN_KEYWORD_LENGTH
        and not w.isdigit()
    ]

    combined = phrases + filtered_words

    # Deduplicate preserving order
    seen = set()
    unique = []
    for kw in combined:
        if kw not in seen:
            seen.add(kw)
            unique.append(kw)

    # Return top 40 most relevant
    return unique[:40]
