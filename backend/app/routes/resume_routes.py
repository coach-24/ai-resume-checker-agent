from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from app.services.resume_service import validate_and_read_file
from app.services.analysis_service import run_analysis_pipeline
from app.models.schemas import AnalysisResult

router = APIRouter()


@router.post("/upload-resume", response_model=AnalysisResult)
async def upload_resume(
    file: UploadFile = File(...),
    job_description: str = Form(default=""),
):
    try:
        file_bytes = await validate_and_read_file(file)
        result = await run_analysis_pipeline(file_bytes, file.filename, job_description)

        if result is None:
            raise HTTPException(status_code=500, detail="Analysis returned empty result")

        return result

    except HTTPException:
        raise

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Analysis pipeline failed: {str(e)}",
        )