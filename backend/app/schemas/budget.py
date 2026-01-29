from pydantic import BaseModel, ConfigDict
from datetime import date
from decimal import Decimal
from typing import Optional

class BudgetBase(BaseModel):
    category_id: int
    amount: Decimal


class BudgetCreate(BudgetBase):
    category_id: int
    amount: Decimal

class BudgetUpdate(BaseModel):
    amount: Optional[Decimal] = None

class BudgetOut(BudgetBase):
    budget_id: int
    category_name: str
    
    model_config = ConfigDict(from_attributes=True)
