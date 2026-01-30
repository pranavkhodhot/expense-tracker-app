from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.schemas import transaction as transaction_schema
from app.crud import transaction as transaction_crud
from app.database import get_db
from app.core.dependencies import get_current_user
from app.models.user import User
from app.crud import category as category_crud

router = APIRouter()

#CREATE TRANSACTION FOR USER
@router.post("/", response_model=transaction_schema.TransactionOut)
def create_tranaction(transaction: transaction_schema.TransactionCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if not category_crud.get_category_by_id(db=db, category_id=transaction.category_id):
        raise HTTPException(status_code=404, detail=f"No category exists with category_id: {transaction.category_id}")
    return transaction_crud.create_transaction(db=db, transaction=transaction, user_id=current_user.user_id)

#GET ALL TRANSACTIONS FOR USER
@router.get("/", response_model=list[transaction_schema.TransactionOut])
def get_user_transactions(db: Session = Depends(get_db), current_user: User = Depends(get_current_user),):
    return transaction_crud.get_transactions_for_user(db=db,user_id=current_user.user_id)

#DELETE TRANSACTION
@router.delete("/{transaction_id}")
def delete_transaction(transaction_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    db_transaction = transaction_crud.get_transaction(db=db, transaction_id=transaction_id)
    if not db_transaction:
        raise HTTPException(status_code=404, detail=f"No transaction exists with transaction_id: {transaction_id}")
    if db_transaction.user_id != current_user.user_id:
        raise HTTPException(status_code=403, detail=f"This transaction does not belong to user: {current_user.user_id}")
    
    deleted_budget = transaction_crud.delete_transaction(db=db, transaction_id=transaction_id)
    return deleted_budget
    

@router.put("/{transaction_id}", response_model=transaction_schema.TransactionOut)
def update_transaction(transaction_id: int, transaction_update: transaction_schema.TransactionUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    db_transaction = transaction_crud.get_transaction(db=db, transaction_id=transaction_id)
    if not db_transaction:
        raise HTTPException(status_code=404, detail=f"No transaction exists with transaction_id: {transaction_id}")
    if db_transaction.user_id != current_user.user_id:
        raise HTTPException(status_code=403, detail=f"This transaction does not belong to user: {current_user.user_id}")
    
    updated_transaction = transaction_crud.update_transaction(db=db, transaction_id=transaction_id, transaction_update=transaction_update)
    return updated_transaction
