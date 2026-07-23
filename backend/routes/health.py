from typing import Any

import torch
from fastapi import APIRouter

from backend.core.muscriptor_engine import muscriptor_engine


router = APIRouter()


@router.get("/api/health")
def health() -> dict[str, Any]:
    cuda_available = torch.cuda.is_available()
    current_model_status, current_model_error = (
        muscriptor_engine.status_snapshot()
    )

    return {
        "status": "ready",
        "application": "MuScriptor Studio",
        "cuda_available": cuda_available,
        "device": (
            torch.cuda.get_device_name(0)
            if cuda_available
            else "CPU"
        ),
        "pytorch_version": str(torch.__version__),
        "cuda_version": torch.version.cuda or "Not available",
        "model": "MuScriptor Large",
        "model_status": current_model_status,
        "model_loaded": current_model_status == "ready",
        "model_error": current_model_error,
    }
