from sqlalchemy.orm import Session
from app.models.budget import Budget
from app.models.transaction import Transaction
from app.schemas.budget import BudgetCreate, BudgetUpdate
from datetime import date, timedelta
from sqlalchemy.orm import joinedload

def create_budget(db: Session, budget: BudgetCreate):
    db_budget = Budget(
        user_id=budget.user_id,
        category_id=budget.category_id,
        amount=float(budget.amount)
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

def get_transaction_spent_on_budget(db: Session, budget_id: int):
    budget = db.query(Budget).filter(Budget.budget_id == budget_id).first()
    if not budget:
        return None
    b_category = budget.category_id
    b_user = budget.user_id
    start_date = date.today().replace(day=1)
    if start_date.month == 12:
        first_day_of_next_month = start_date.replace(year=start_date.year + 1, month=1, day=1)
    else:
        first_day_of_next_month = start_date.replace(month=start_date.month + 1, day=1)
    end_date = first_day_of_next_month - timedelta(days=1)
    print(start_date, end_date)
    return (
        db.query(Transaction).filter(
            Transaction.category_id == b_category,
            Transaction.user_id == b_user,
            Transaction.transaction_date >= start_date,
            Transaction.transaction_date <= end_date
        )
    ).all()

def get_total_spent_on_budget(db: Session, budget_id: int):
    budget_transactions = get_transaction_spent_on_budget(db=db,budget_id=budget_id)
    total_spent = 0
    for i in range (len(budget_transactions)):
        total_spent = total_spent + budget_transactions[i].amount

    return total_spent

def get_budget(db: Session, budget_id: int):
    return db.query(Budget).filter(Budget.budget_id == budget_id).first()

def get_existing_budget(db: Session, user_id: int, category_id: int):
    return db.query(Budget).filter(
        Budget.user_id == user_id,
        Budget.category_id == category_id
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

# def get_active_budgets_for_user(db: Session, user_id: int):
#     today = date.today()
#     return (
#         db.query(Budget)
#         .filter(
#             Budget.user_id == user_id,
#             Budget.start_date <= today,
#             Budget.end_date >= today
#         )
#         .all()
#     )
