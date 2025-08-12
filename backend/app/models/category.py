from sqlalchemy import Column, Integer, String
from app.database import Base
from sqlalchemy.orm import relationship

class Category(Base):
    __tablename__ = "categories"

    category_id = Column(Integer, primary_key=True, index=True)
    category_name = Column(String, nullable=False, unique=True)
    budgets = relationship("Budget", back_populates="category")
    transactions = relationship("Transaction", back_populates="category")

