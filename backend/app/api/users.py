from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.schemas import user as user_schema
from app.crud import user as user_crud
from app.crud import transaction as transaction_crud
from app.crud import budget as budget_crud
from app.models import user as user_model
from app.database import get_db
from app.core.dependencies import get_current_user

router = APIRouter()

@router.get("/me", status_code=200)
def get_user_dashboard(db: Session = Depends(get_db), current_user: user_model = Depends(get_current_user)):
    budgets = budget_crud.get_budgets_for_user(db, user_id=current_user.user_id)
    transactions = transaction_crud.get_transactions_for_user(db, user_id=current_user.user_id)

    transactions = sorted(transactions, key=lambda t: t.transaction_date, reverse=True)

    return {
        "user": {
            "user_id": current_user.user_id,
            "name": current_user.name,
            "email": current_user.email,
        },
        "budgets": [
            {
                "budget_id": b.budget_id,
                "category_name": b.category.category_name if b.category else None,
                "amount": float(b.amount),
                "amount_spent": budget_crud.get_total_spent_on_budget(db=db,budget_id=b.budget_id)
            } for b in budgets
        ],
        "transactions": [
            {
                "transaction_id": t.transaction_id,
                "transaction_name": t.transaction_name,
                "amount": float(t.amount),
                "transaction_date": t.transaction_date,
                "category_name": t.category.category_name if t.category else None,
                "notes": t.notes,
            } for t in transactions[:10]
        ]
    }

@router.post("/", response_model=user_schema.UserOut)
def create_user(user: user_schema.UserCreate, db: Session = Depends(get_db)):
    db_user = user_crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    return user_crud.create_user(db=db, user=user)

@router.get("/", response_model=list[user_schema.UserOut])
def read_users(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    return user_crud.get_users(db, skip=skip, limit=limit)

