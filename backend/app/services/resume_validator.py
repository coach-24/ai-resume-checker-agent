"""
resume_validator.py
Place this file at: backend/app/services/resume_validator.py
"""

import re

# Strong signals that this IS a resume
RESUME_KEYWORDS = [
    "experience", "education", "skills", "projects", "work",
    "university", "college", "degree", "bachelor", "master",
    "engineer", "developer", "internship", "employment",
    "objective", "summary", "certification", "achievement",
    "linkedin", "github", "email", "phone", "mobile",
    "gpa", "cgpa", "b.tech", "b.e", "m.tech", "mba",
    "worked", "developed", "designed", "implemented", "built",
    "proficient", "familiar", "languages", "frameworks",
]

# Strong signals that this is NOT a resume
NON_RESUME_KEYWORDS = [
    # Academic lab assignments
    "scope of the experiment",
    "experiment related code",
    "experiment steps",
    "final output",
    "registration number",
    "slot",
    "conclusion / result",
    # NLP / CS specific
    "constituency parse",
    "chunking",
    "cfg grammar",
    "regex parser",
    "deep parser",
    "shallow parsing",
    "parse tree",
    "unigram tagger",
    "bigram tagger",
    "trigram tagger",
    "brill tagger",
    "named entity recognition",
    "pos tagging",
    "word_tokenize",
    "ne_chunk",
    "pos_tag",
    # Generic academic
    "lab manual",
    "theorem",
    "hypothesis",
    "bibliography",
    "table of contents",
    "marks",
    # Invoices / contracts
    "invoice",
    "total amount",
    "gst",
    "hereby",
    "whereas",
    # Medical
    "diagnosis",
    "prescription",
]

# Single words that are near-certain non-resume indicators
NON_RESUME_SINGLE = [
    "assignment",
    "experiment",
    "practical",
]


def is_resume(text: str) -> tuple[bool, str]:
    """
    Returns (is_valid_resume, reason_message)
    """
    if not text or len(text.strip()) < 100:
        return False, "The document appears to be empty or too short to analyze."

    text_lower = text.lower()

    # Check strong multi-word non-resume phrases first
    for phrase in NON_RESUME_KEYWORDS:
        if phrase in text_lower:
            return False, (
                f"This doesn't look like a resume — it appears to be an academic "
                f"or official document (detected: '{phrase}'). "
                f"Please upload your personal resume (CV) in PDF or DOCX format."
            )

    # Check single-word hits (need 2+ to trigger)
    single_hits = [kw for kw in NON_RESUME_SINGLE if kw in text_lower]
    if len(single_hits) >= 2:
        return False, (
            "This document appears to be an academic assignment or report, not a resume. "
            "Please upload your personal resume (CV)."
        )

    # Check minimum resume signals
    resume_hits = [kw for kw in RESUME_KEYWORDS if kw in text_lower]
    if len(resume_hits) < 4:
        return False, (
            "This document doesn't appear to be a resume. "
            "A valid resume should contain sections like Skills, Education, "
            "Experience, or Projects. Please upload your resume."
        )

    # Check minimum length
    word_count = len(text.split())
    if word_count < 150:
        return False, (
            f"This document is too short to be a resume ({word_count} words). "
            "Please upload your complete resume."
        )

    return True, "Valid resume detected."
