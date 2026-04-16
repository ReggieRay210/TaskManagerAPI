from sqlalchemy.orm import Session
from . import models, schemas


# Create
def create_task(db: Session, task: schemas.TaskCreate):
    db_task = models.Task(title=task.title, description=task.description)
    db.add(db_task)
    db.commit()
    db.refresh(db_task)  # get the auto-generated id and created_at information
    return db_task


# Read one task
def get_task(db: Session, task_id: int):
    return db.query(models.Task).filter(models.Task.id == task_id).first()


# Read all (with pagination)
def get_tasks(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Task).offset(skip).limit(limit).all()


# Update the database
def update_task(db: Session, task_id: int, task_update: schemas.TaskUpdate):
    db_task = get_task(db, task_id)
    if not db_task:
        return None
    # convert the updated data to a dictionary, ignoring fields that were not sent
    update_data = task_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_task, key, value)
    db.commit()
    db.refresh(db_task)
    return db_task


# Delete task from database.
def delete_task(db: Session, task_id: int):
    db_task = get_task(db, task_id)
    if db_task:
        db.delete(db_task)
        db.commit()
        return True
    return False
