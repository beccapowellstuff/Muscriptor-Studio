from contextlib import asynccontextmanager

from fastapi import FastAPI

from backend.core.muscriptor_engine import muscriptor_engine
from backend.routes.health import router as health_router
from backend.routes.transcription import router as transcription_router


@asynccontextmanager
async def lifespan(_: FastAPI):
    muscriptor_engine.start_background_loading()

    yield


app = FastAPI(
    title="MuScriptor Studio",
    version="0.1.0",
    lifespan=lifespan,
)

app.include_router(health_router)
app.include_router(transcription_router)
