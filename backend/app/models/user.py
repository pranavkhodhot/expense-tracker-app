from sqlalchemy import Column, Integer, String, DateTime, func
from app.database import Base
from sqlalchemy.orm import relationship

class User(Base):
    __tablename__ = "users"


    user_id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    transactions = relationship("Transaction", back_populates="user")
