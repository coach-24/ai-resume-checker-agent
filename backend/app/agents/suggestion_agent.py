import os
import json
import re
from typing import Dict
from dotenv import load_dotenv

load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")


async def analyze_with_ai(resume_text: str, job_description: str) -> Dict:

    if not GROQ_API_KEY:
        raise RuntimeError("GROQ_API_KEY is not set in .env file")

    from groq import Groq

    client = Groq(api_key=GROQ_API_KEY)

    resume_short = resume_text[:3000]
    jd_short = job_description[:500] if job_description.strip() else "General resume analysis"

    prompt = f"""You are an expert resume analyst. Analyze this resume for the given job.

RESUME:
{resume_short}

JOB DESCRIPTION:
{jd_short}

Return ONLY a valid JSON object, no explanation, no markdown:
{{
  "resume_score": <realistic 0-100 based on actual resume>,
  "skill_match": <0-100 based on skills vs job>,
  "ats_compatibility": <0-100 ATS friendliness>,
  "keyword_match": <0-100 keyword overlap>,
  "potential_score": <resume_score + 5 to 15, max 100>,
  "matched_skills": [<actual skills found in this resume>],
  "missing_skills": [<max 6 skills missing for this specific job>],
  "section_health": {{
    "experience": "<good|average|missing>",
    "skills": "<good|average|missing>",
    "education": "<good|average|missing>",
    "projects": "<good|average|missing>",
    "achievements": "<good|average|missing>"
  }},
  "ats_issues": [<real ATS issues in this resume, empty list if none>],
  "matched_keywords": [<job keywords found in resume>],
  "missing_keywords": [<important job keywords not in resume>],
  "suggestions": [<exactly 6 specific suggestions for THIS person's resume>]
}}"""

    try:
        response = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[
                {
                    "role": "system",
                    "content": "You are an expert resume analyst. Always respond with valid JSON only."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            temperature=0.1,
            max_tokens=1500,
        )

        raw_text = response.choices[0].message.content
        clean = re.sub(r"```(?:json)?|```", "", raw_text).strip()
        result = json.loads(clean)
        return result

    except json.JSONDecodeError as e:
        raise RuntimeError(f"AI returned invalid JSON: {str(e)}")
    except Exception as e:
        raise RuntimeError(f"AI analysis failed: {str(e)}")