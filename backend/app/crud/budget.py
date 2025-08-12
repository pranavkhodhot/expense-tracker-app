from sqlalchemy.orm import Session
from app.models.budget import Budget
from app.schemas.budget import BudgetCreate, BudgetUpdate
from datetime import date
from sqlalchemy.orm import joinedload

def create_budget(db: Session, budget: BudgetCreate):
    db_budget = Budget(
        user_id=budget.user_id,
        category_id=budget.category_id,
        amount=float(budget.amount),
        start_date=budget.start_date,
        end_date=budget.end_date
    )
    db.add(db_budget)
    db.commit()
    db.refresh(db_budget) 
    return db_budget

def get_budgets_for_user(db: Session, user_id: int):
    return (
        db.query(Budget)
        .options(joinedload(Budget.category))
        .filter(Budget.user_id == user_id)
        .all()
    )

def get_budget(db: Session, budget_id: int):
    return db.query(Budget).filter(Budget.budget_id == budget_id).first()

def get_existing_budget(db: Session, user_id: int, category_id: int, start_date: date, end_date: date):
    return db.query(Budget).filter(
        Budget.user_id == user_id,
        Budget.category_id == category_id,
        Budget.start_date == start_date,
        Budget.end_date == end_date
    ).first()

def delete_budget(db: Session, budget_id: int):
    budget = db.query(Budget).filter(Budget.budget_id == budget_id).first()
    if budget:
        db.delete(budget)
        db.commit()
        return budget
    return None

def update_budget(db: Session, budget_id: int, budget_update: BudgetUpdate):
    budget = db.query(Budget).filter(Budget.budget_id == budget_id).first()
    if not budget:
        return None
    
    for key, value in budget_update.dict(exclude_unset=True).items():
        if key == "amount" and value is not None:
            value = float(value)
        setattr(budget, key, value)
    
    db.commit()
    db.refresh(budget)
    return budget

def get_active_budgets_for_user(db: Session, user_id: int):
    today = date.today()
    return (
        db.query(Budget)
        .filter(
            Budget.user_id == user_id,
            Budget.start_date <= today,
            Budget.end_date >= today
        )
        .all()
    )
