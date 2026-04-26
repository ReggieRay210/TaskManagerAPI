# 🚀 Task Management API

[![Python Version](https://img.shields.io/badge/python-3.11%2B-blue)](https://www.python.org/downloads/)
[![FastAPI Version](https://img.shields.io/badge/fastapi-0.115.0-green)](https://fastapi.tiangolo.com/)
[![License](https://img.shields.io/badge/license-MIT-orange)](LICENSE)

A **production-inspired** REST API built with FastAPI that performs full CRUD (Create, Read, Update, Delete) operations on a SQLite database using SQLAlchemy ORM. This project is perfect for beginners learning backend development with Python and for anyone looking for a clean, modular FastAPI template.

## 🔗 Live Demo

> https://taskmanagerapi-u5v6.onrender.com/


## ✨ Features

- **Full CRUD Operations** – Create, view, update, and delete tasks.
- **Modular Architecture** – Separated routers, models, schemas, and CRUD logic for maintainability.
- **Data Validation** – Uses Pydantic models to validate request/response data.
- **Interactive Documentation** – Auto‑generated Swagger UI (`/docs`) and ReDoc (`/redoc`) endpoints.
- **Database ORM** – SQLAlchemy ORM with SQLite for easy local development.
- **Security** – `TrustedHostMiddleware` to prevent Host Header attacks.
- **Containerized** – Includes a `Dockerfile` for easy deployment and containerization.
- **Unit Tests** – Example test included with `pytest` to ensure reliability.

## 🔍 The Problem It Solves

As an IT Support Specialist, I noticed that help desk teams often lack a simple, shared task tracker for managing follow‑ups, escalations, or recurring issues. Existing tools were either too heavy (full ITSM suites) or too lightweight (sticky notes). This API was designed as the backend for a lightweight internal task board—something a small support team could use to assign, track, and close tickets without overhead. It’s my first step toward building tools that solve real operational friction.

## 🧠 Key Challenge & Solution

**Challenge:** During development, I struggled with making the SQLAlchemy models and Pydantic schemas stay in sync—especially when adding the `created_at` timestamp. My initial approach duplicated logic and caused validation errors.

**Solution:** I refactored to use SQLAlchemy’s `default=datetime.utcnow` at the model level and ensured the Pydantic schema excluded the field on input but included it on output. This separation of concerns (database vs. validation) is now reflected in the clean module structure you see here.

## 🛠️ Tech Stack

| Category          | Technology                                                                 |
| ----------------- | -------------------------------------------------------------------------- |
| **Framework**     | [FastAPI](https://fastapi.tiangolo.com/) – Modern, fast web framework      |
| **Server**        | [Uvicorn](https://www.uvicorn.org/) – ASGI server                          |
| **ORM**           | [SQLAlchemy](https://www.sqlalchemy.org/) – Database toolkit               |
| **Validation**    | [Pydantic](https://docs.pydantic.dev/) – Data validation                   |
| **Database**      | SQLite (lightweight, file‑based)                                           |
| **Testing**       | `pytest` + `httpx`                                                         |
| **Containerization** | Docker                                                                  |

## 📁 Project Structure

```
TaskManagerAPI/
├── app/
│   ├── __init__.py
│   ├── main.py          # FastAPI app configuration and middleware
│   ├── database.py      # Database connection setup
│   ├── models.py        # SQLAlchemy ORM models
│   ├── schemas.py       # Pydantic schemas for validation
│   ├── crud.py          # Database operation functions
│   └── routers/
│       ├── __init__.py
│       └── tasks.py     # API endpoints for tasks
├── tests/
│   ├── __init__.py
│   └── test_tasks.py    # Unit tests
├── requirements.txt     # Python dependencies
├── Dockerfile           # Containerization configuration
├── .gitignore
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Python 3.11 or higher installed
- `pip` package manager
- (Optional) Docker for containerized execution

### Local Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ReggieRay210/TaskManagerAPI.git
   cd TaskManagerAPI
   ```

2. **Create and activate a virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate      # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Run the application**
   ```bash
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

5. **Open your browser** and navigate to:
   - Interactive API docs: [http://localhost:8000/docs](http://localhost:8000/docs)
   - Alternative ReDoc docs: [http://localhost:8000/redoc](http://localhost:8000/redoc)

## 📡 API Endpoints

All endpoints are prefixed with `/tasks`.

| Method | Endpoint          | Description                       | Request Body Example (for POST/PUT)                      |
| ------ | ----------------- | --------------------------------- | -------------------------------------------------------- |
| POST   | `/tasks/`         | Create a new task                 | `{"title": "Buy milk", "description": "From the store"}` |
| GET    | `/tasks/`         | Retrieve all tasks (paginated)    | –                                                        |
| GET    | `/tasks/{id}`     | Retrieve a single task by ID      | –                                                        |
| PUT    | `/tasks/{id}`     | Update an existing task           | `{"title": "Updated title", "completed": true}`          |
| DELETE | `/tasks/{id}`     | Delete a task                     | –                                                        |

### Example Request (POST)

```bash
curl -X POST "http://localhost:8000/tasks/" \
     -H "Content-Type: application/json" \
     -d '{"title": "Learn FastAPI", "description": "Build a REST API"}'
```

### Example Response (201 Created)

```json
{
  "title": "Learn FastAPI",
  "description": "Build a REST API",
  "id": 1,
  "completed": false,
  "created_at": "2025-04-16T12:34:56.789123"
}
```

## 🧪 Running Tests

This project uses `pytest` for unit testing. To run the tests:

```bash
pytest
```

You should see output similar to:
```
======================== test session starts =========================
collected 1 item

tests/test_tasks.py .                                             [100%]

========================= 1 passed in 0.12s ==========================
```

## 🐳 Docker (Containerization)

To build and run the API inside a Docker container:

1. **Build the Docker image**
   ```bash
   docker build -t task-manager-api .
   ```

2. **Run the container**
   ```bash
   docker run -p 8000:8000 task-manager-api
   ```
The API will be available at `http://localhost:8000/docs`.

## 🚢 Deployment

This API can be easily deployed to cloud platforms like:

- **Render** (recommended for beginners) – Connect your GitHub repo and Render automatically detects the Python environment.
- **Railway** – Similar one‑click deployment.
- **Fly.io** – More advanced but offers a generous free tier.


## 🔮 Future Enhancements

- [ ] Add JWT authentication (user registration, login, protected routes)
- [ ] Add request logging and error handling middleware
- [ ] Switch to an async database driver (`databases` + `asyncpg`) for better concurrency
- [ ] Implement pagination metadata (total count, next/previous links)
- [ ] Add frontend (React/Next.js) to consume this API

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/ReggieRay210/TaskManagerAPI/issues) or submit a pull request.

## 📄 License

Distributed under the MIT License. See the `LICENSE` file for more information.

## 👤 Author

**Reginald Griffin II**

- GitHub: [@ReggieRay210](https://github.com/ReggieRay210)
- Portfolio: [built-by-reginald.vercel.app](https://built-by-reginald.vercel.app)
- LinkedIn: [Reginald Griffin II](https://www.linkedin.com/in/reginald-griffin-ii)

## 🙏 Acknowledgments

- Built with guidance from the FastAPI documentation and community.
- Inspired by real‑world backend patterns learned during the Datacom Forage simulation.
- Thanks to the open‑source projects that made this possible.
