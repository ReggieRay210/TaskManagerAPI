from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, declarative_base

# 1. Database URL - tells SQLAlchemy where the database file lives.
SQLALCHEMY_DATABASE_URL = "sqlite:///./tasks.db"

# 2 Engine: the core interface to the database
# "check_same_thread = False" is required for SQLite to work with FastAPI's async nature.
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)

# 3. SessionLocal: a factory that creates new database sessions
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# 4. Base: a class that our table models will inherit from
Base = declarative_base()


# 5. Dependency: provides a session to reach request and closes it after
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
