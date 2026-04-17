import json
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

# create a test on what to expect to occur from running the program.
def test_create_task():
  response = client.post("/tasks/", json = {"title": "Learn FastAPI", "description":"Build API"})
  assert response.status_code == 201
  data = response.json()
  assert data["title"] == "Learn FastAPI"
  assert data["completed"] is False
  assert "id" in data