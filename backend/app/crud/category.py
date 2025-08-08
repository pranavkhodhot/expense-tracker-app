from sqlalchemy.orm import Session
from app.models.category import Category  
from app.schemas.category import CategoryCreate 

def create_category(db: Session, category: CategoryCreate):
    db_category = Category(
        category_name=category.category_name,
    )
    db.add(db_category)
    db.commit()
    db.refresh(db_category) 
    return db_category

def get_category_by_name(db: Session, name: str):
    return db.query(Category).filter(Category.category_name == name).first()

def get_categories(db: Session, skip: int = 0, limit: int = 10):
    return db.query(Category).offset(skip).limit(limit).all()
