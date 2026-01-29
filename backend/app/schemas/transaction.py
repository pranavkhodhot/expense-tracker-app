from pydantic import BaseModel, ConfigDict
from datetime import date, datetime
from decimal import Decimal
from typing import Optional

class TransactionBase(BaseModel):
    transaction_name: str
    category_id: int
    amount: Decimal
    transaction_date: date
    notes: str

class TransactionCreate(BaseModel):
    transaction_name: str
    category_id: int
    amount: Decimal
    transaction_date: date
    notes: str

class TransactionUpdate(TransactionBase):
    transaction_name: Optional[str] = None
    category_id: Optional[int] = None
    amount: Optional[Decimal] = None
    transaction_date: Optional[date] = None
    notes: Optional[str] = None

class TransactionOut(TransactionBase):
    transaction_id: int
    category_name: str
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)
