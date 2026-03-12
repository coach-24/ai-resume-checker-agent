import io
import re
from typing import Dict, List

SECTION_ALIASES = {
    "skills": {
        "skills",
        "technical skills",
        "core competencies",
        "programming languages",
        "tech stack",
    },
    "experience": {
        "experience",
        "work experience",
        "employment history",
        "professional experience",
        "internships",
        "internship experience",
    },
    "education": {
        "education",
        "academic background",
        "qualifications",
    },
    "projects": {
        "projects",
        "personal projects",
        "key projects",
        "academic projects",
    },
    "achievements": {
        "achievements",
        "accomplishments",
        "awards",
        "certifications",
        "certifications and awards",
    },
}


def parse_resume(file_bytes: bytes, filename: str) -> Dict:
    """
    Agent 1: Resume Parsing Agent
    Extracts text and detects resume sections from PDF or DOCX files.
    """
    text = ""

    try:
        if filename.lower().endswith(".pdf"):
            text = _extract_pdf(file_bytes)
        elif filename.lower().endswith(".docx"):
            text = _extract_docx(file_bytes)
        else:
            raise ValueError("Unsupported file format. Use PDF or DOCX.")
    except Exception as e:
        raise RuntimeError(f"Resume parsing failed: {str(e)}")

    sections = _detect_sections(text)

    return {
        "text": text,
        "skills": sections.get("skills", []),
        "education": sections.get("education", []),
        "experience": sections.get("experience", []),
        "projects": sections.get("projects", []),
        "achievements": sections.get("achievements", []),
    }


def _extract_pdf(file_bytes: bytes) -> str:
    import pdfplumber
    text_parts = []
    with pdfplumber.open(io.BytesIO(file_bytes)) as pdf:
        for page in pdf.pages:
            page_text = page.extract_text()
            if page_text:
                text_parts.append(page_text)
    return "\n".join(text_parts)


def _extract_docx(file_bytes: bytes) -> str:
    from docx import Document
    doc = Document(io.BytesIO(file_bytes))
    return "\n".join([para.text for para in doc.paragraphs if para.text.strip()])


def _detect_sections(text: str) -> Dict[str, List[str]]:
    """Detect sections by resume heading lines, not arbitrary content lines."""
    lines = text.split("\n")
    sections: Dict[str, List[str]] = {k: [] for k in SECTION_ALIASES}
    current_section = None

    for line in lines:
        line = line.strip()
        if not line:
            continue

        matched_section = _match_section_heading(line)
        if matched_section:
            current_section = matched_section
            continue

        if current_section:
            sections[current_section].append(line)

    return sections


def _match_section_heading(line: str) -> str | None:
    normalized = _normalize_heading(line)
    for section, aliases in SECTION_ALIASES.items():
        if normalized in aliases:
            return section
    return None


def _normalize_heading(line: str) -> str:
    normalized = line.lower().strip()
    normalized = re.sub(r"^[^\w]+|[^\w]+$", "", normalized)
    normalized = re.sub(r"[:|/-]+$", "", normalized).strip()
    normalized = re.sub(r"\s+", " ", normalized)
    return normalized
