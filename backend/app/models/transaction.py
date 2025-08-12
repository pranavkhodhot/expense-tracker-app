from sqlalchemy import Column, Integer, DateTime, func, ForeignKey, Date, String, Numeric
from app.database import Base
from sqlalchemy.orm import relationship

class Transaction(Base):
    __tablename__ = "transactions"

    transaction_id = Column(Integer, primary_key=True, index=True)
    transaction_name = Column(String, nullable=False)
    amount = Column(Numeric(10, 2), nullable=False)
    transaction_date = Column(Date, nullable=False, index=True)
    notes = Column(String)
    user_id = Column(Integer, ForeignKey("users.user_id"), index=True)
    category_id = Column(Integer, ForeignKey("categories.category_id"), index=True)
    recurring_transaction_id = Column(Integer, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    category = relationship("Category", back_populates="transactions")
    user = relationship("User", back_populates="transactions")
    recurring_transaction_id = Column(Integer, nullable=True)



    @property
    def category_name(self):
        return self.category.category_name if self.category else None

