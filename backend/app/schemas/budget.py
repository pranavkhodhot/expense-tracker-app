from pydantic import BaseModel
from datetime import date
from decimal import Decimal
from typing import Optional

class BudgetBase(BaseModel):
    category_id: int
    amount: Decimal


class BudgetCreate(BudgetBase):
    user_id: int 

class BudgetUpdate(BaseModel):
    amount: Optional[Decimal] = None

class BudgetOut(BudgetBase):
    budget_id: int
    category_name: str
    
    class Config:
        orm_mode = True  
