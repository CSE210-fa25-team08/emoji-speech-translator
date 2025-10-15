# tests/test_performance.py
import time
from fastapi.testclient import TestClient
from src.server import app

client = TestClient(app)

def test_translate_latency_under_5s():
    payload = {"mode": "emoji-to-speech", "text": "😀🎉"}
    t0 = time.perf_counter()
    resp = client.post("/translate", json=payload)
    elapsed_ms = (time.perf_counter() - t0) * 1000
    assert resp.status_code == 200
    assert elapsed_ms < 5000, f"Latency {elapsed_ms:.1f}ms exceeded threshold"
