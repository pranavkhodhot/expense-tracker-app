from sqlalchemy.orm import Session
from app.models.user import User  
from app.schemas.user import UserCreate 

# If you want password hashing later, uncomment and configure this:
# from passlib.context import CryptContext
# pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# def get_password_hash(password: str) -> str:
#     return pwd_context.hash(password)

def create_user(db: Session, user: UserCreate):
    """Creates a new user in the database."""
    # For now, store the raw password (not recommended for production)
    hashed_password = user.password  
    db_user = User(
        name=user.name,
        email=user.email,
        password_hash=hashed_password
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user) 
    return db_user

def get_user_by_email(db: Session, email: str):
    """Get a single user by email."""
    return db.query(User).filter(User.email == email).first()

def get_users(db: Session, skip: int = 0, limit: int = 10):
    """Get a list of users with pagination."""
    return db.query(User).offset(skip).limit(limit).all()
