from fastapi import FastAPI
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from .database import engine, Base
from .routers import tasks

# Create database tables (if they do not already exist)
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Task Management API", version="1.0.0")

# Allow all hosts during development (Replit uses dynamic subdomains)
app.add_middleware(
    TrustedHostMiddleware,
    allowed_hosts=["*"],  # or use ["*.replit.dev", "localhost", "127.0.0.1"]
)

# Include the tasks router
app.include_router(tasks.router)

# Can also add logging and authentication links here


@app.get("/")
def root():
    return {
        "message": "Welcome to the Task Management API. Visit /docs for interactive documentation."
    }
