from sqlalchemy import Column, Integer, DateTime, func, ForeignKey, Date
from app.database import Base
from sqlalchemy.orm import relationship

class Budget(Base):
    __tablename__ = "budgets"

    budget_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.user_id"))
    category_id = Column(Integer, ForeignKey("categories.category_id"))
    category = relationship("Category", back_populates="budgets")
    amount = Column(Integer, nullable=False)
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=False)

    @property
    def category_name(self):
        return self.category.category_name if self.category else None

