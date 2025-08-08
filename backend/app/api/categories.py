from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.schemas import category as category_schema
from app.crud import category as category_crud
from app.database import get_db

router = APIRouter()

@router.post("/", response_model=category_schema.CategoryOut)
def create_category(category: category_schema.CategoryCreate, db: Session = Depends(get_db)):
    db_category = category_crud.get_category_by_name(db, name=category.category_name)
    if db_category:
        raise HTTPException(status_code=400, detail="Category already registered")
    return category_crud.create_category(db=db, category=category)

@router.get("/", response_model=list[category_schema.CategoryOut])
def read_categories(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    return category_crud.get_categories(db, skip=skip, limit=limit)
