from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app import crud, schemas
from app.database import get_db

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/login")
def login_user(login_data: schemas.user.UserLogin, db: Session = Depends(get_db)):
    user = crud.user.authenticate_user(db, login_data.email, login_data.password)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

    return {
        "message": "Login successful",
        "user_id": user.user_id,
        "name": user.name,
        "email": user.email
    }
