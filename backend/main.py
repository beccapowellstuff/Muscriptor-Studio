"""MuScriptor Studio backend launcher."""

from __future__ import annotations

import argparse

import uvicorn

from muscriptor.transcription_model import TranscriptionModel

from backend.server import create_app


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Run the MuScriptor Studio backend")
    parser.add_argument("--host", default="127.0.0.1")
    parser.add_argument("--port", type=int, default=8222)
    parser.add_argument("--model", default="large")
    parser.add_argument("--device", default="auto")
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    device = None if args.device == "auto" else args.device

    print(f"Loading MuScriptor {args.model} on {args.device}...")
    model = TranscriptionModel.load_model(
        weights_path=args.model,
        device=device,
    )

    app = create_app(model)
    uvicorn.run(app, host=args.host, port=args.port)


if __name__ == "__main__":
    main()
