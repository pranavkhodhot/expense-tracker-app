from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.schemas import budget as budget_schema
from app.crud import budget as budget_crud
from app.database import get_db

router = APIRouter()

#CREATE BUDGET FOR USER
@router.post("/", response_model=budget_schema.BudgetOut)
def create_budget(budget: budget_schema.BudgetCreate, db: Session = Depends(get_db)):
    db_budget = budget_crud.get_existing_budget(
        db,
        budget.user_id,
        budget.category_id,
        budget.start_date,
        budget.end_date
    )
    if db_budget:
        raise HTTPException(status_code=400, detail="A Budget already registered")
    return budget_crud.create_budget(db=db, budget=budget)

#GET ALL BUDGETS FOR USER
@router.get("/", response_model=list[budget_schema.BudgetOut])
def get_user_budgets(user_id: int = 1, db: Session = Depends(get_db)):
    return budget_crud.get_budgets_for_user(db=db,user_id=user_id)

#DELETE BUDGET
@router.delete("/{budget_id}")
def delete_budget(budget_id: int, db: Session = Depends(get_db)):
    db_budget = budget_crud.get_budget(db=db, budget_id=budget_id)
    if not db_budget:
        raise HTTPException(status_code=404, detail=f"No budget exists with budget_id: {budget_id}")
    
    deleted_budget = budget_crud.delete_budget(db=db, budget_id=budget_id)
    return deleted_budget
    

@router.put("/{budget_id}", response_model=budget_schema.BudgetOut)
def update_budget_endpoint(
    budget_id: int,
    budget_update: budget_schema.BudgetUpdate,
    db: Session = Depends(get_db)
):
    updated_budget = budget_crud.update_budget(db=db, budget_id=budget_id, budget_update=budget_update)
    
    if not updated_budget:
        raise HTTPException(status_code=404, detail=f"Budget with ID {budget_id} not found")
    
    return updated_budget
'''
@router.get("/", response_model=list[user_schema.UserOut])
def get_active_budgets_for_user(db: Session, user_id: int):
    pass
'''