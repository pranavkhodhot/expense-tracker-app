from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.schemas import transaction as transaction_schema
from app.crud import transaction as transaction_crud
from app.database import get_db

router = APIRouter()

#CREATE TRANSACTION FOR USER
@router.post("/", response_model=transaction_schema.TransactionOut)
def create_tranaction(transaction: transaction_schema.TransactionCreate, db: Session = Depends(get_db)):
    return transaction_crud.create_transaction(db=db, transaction=transaction)

#GET ALL TRANSACTIONS FOR USER
@router.get("/", response_model=list[transaction_schema.TransactionOut])
def get_user_transactions(user_id: int = 1, db: Session = Depends(get_db)):
    return transaction_crud.get_transactions_for_user(db=db,user_id=user_id)

#DELETE TRANSACTION
@router.delete("/{transaction_id}")
def delete_transaction(transaction_id: int, db: Session = Depends(get_db)):
    db_transaction = transaction_crud.get_transaction(db=db, transaction_id=transaction_id)
    if not db_transaction:
        raise HTTPException(status_code=404, detail=f"No transaction exists with transaction_id: {transaction_id}")
    
    deleted_budget = transaction_crud.delete_transaction(db=db, transaction_id=transaction_id)
    return deleted_budget
    

@router.put("/{transaction_id}", response_model=transaction_schema.TransactionOut)
def update_transaction(
    transaction_id: int,
    transaction_update: transaction_schema.TransactionUpdate,
    db: Session = Depends(get_db)
):
    updated_transaction = transaction_crud.update_transaction(db=db, transaction_id=transaction_id, transaction_update=transaction_update)
    
    if not updated_transaction:
        raise HTTPException(status_code=404, detail=f"Transaction with ID {transaction_id} not found")
    
    return updated_transaction
'''
@router.get("/", response_model=list[user_schema.UserOut])
def get_active_budgets_for_user(db: Session, user_id: int):
    pass
'''