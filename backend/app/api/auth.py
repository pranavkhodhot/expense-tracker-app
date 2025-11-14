from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app import crud, schemas
from app.database import get_db
from app.core.security import create_access_token, ACCESS_TOKEN_EXPIRE_MINUTES
from datetime import timedelta
from fastapi.responses import JSONResponse

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/login")
def login_user(login_data: schemas.user.UserLogin, db: Session = Depends(get_db)):
    user = crud.user.authenticate_user(db, login_data.email, login_data.password)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    access_token = create_access_token({"sub": user.email})

    response_data = {
        "message": "Login successful",
        "access_token": access_token,
        "user_id": user.user_id,
        "name": user.name,
        "email": user.email,
    }

    response = JSONResponse(content=response_data)
    response.set_cookie(
        key="token",
        value=access_token,
        httponly=True,
        secure=False, 
        samesite="lax",
        max_age=3600
    )
    return response

@router.post("/register")
def register_user(register_data: schemas.user.UserCreate, db: Session = Depends(get_db)):
    user = crud.user.get_user_by_email(db, register_data.email)
    print(user)
    if user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Email already registered to an account")
    crud.user.create_user(db, register_data)
    return "User registered successful"

@router.post("/logout")
def logout_user():
    response = JSONResponse({"message": "Logged out successfully"})
    response.delete_cookie(key="token")
    return response