from app.database import engine, Base
from app import models

# This is optional, the database will be created automatically 
# under the main.py file.

print("Creating database tables...")
Base.metadata.create_all(bind=engine)
print("Done! Database file: tasks.db")
