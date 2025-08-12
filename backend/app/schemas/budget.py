from pydantic import BaseModel
from datetime import date
from decimal import Decimal
from typing import Optional

class BudgetBase(BaseModel):
    category_id: int
    amount: Decimal
    start_date: date
    end_date: date

class BudgetCreate(BudgetBase):
    user_id: int 

class BudgetUpdate(BudgetBase):
    category_id: Optional[int] = None
    amount: Optional[Decimal] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None

class BudgetOut(BudgetBase):
    budget_id: int
    category_name: str
    
    class Config:
        orm_mode = True  
