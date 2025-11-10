from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.schemas import user as user_schema
from app.crud import user as user_crud
from app.database import get_db

router = APIRouter()

@router.post("/", response_model=user_schema.UserOut)
def create_user(user: user_schema.UserCreate, db: Session = Depends(get_db)):
    db_user = user_crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    return user_crud.create_user(db=db, user=user)

@router.get("/", response_model=list[user_schema.UserOut])
def read_users(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    return user_crud.get_users(db, skip=skip, limit=limit)

