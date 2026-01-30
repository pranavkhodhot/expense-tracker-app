from sqlalchemy.orm import Session
from app.models.transaction import Transaction
from app.schemas.transaction import TransactionCreate, TransactionUpdate
from datetime import datetime
from sqlalchemy.orm import joinedload
from decimal import Decimal

def create_transaction(db: Session, transaction: TransactionCreate, user_id: int):
    db_transaction = Transaction(
        user_id=user_id,
        category_id=transaction.category_id,
        transaction_name=transaction.transaction_name,
        amount=Decimal(transaction.amount),
        transaction_date=transaction.transaction_date,
        notes=transaction.notes
    )
    db.add(db_transaction)
    db.commit()
    db.refresh(db_transaction) 
    return db_transaction

def get_transactions_for_user(db: Session, user_id: int):
    return (
        db.query(Transaction)
        .options(joinedload(Transaction.category))
        .filter(Transaction.user_id == user_id)
        .all()
    )

def get_transaction(db: Session, transaction_id: int):
    return db.query(Transaction).filter(Transaction.transaction_id == transaction_id).first()

def delete_transaction(db: Session, transaction_id: int):
    transaction = db.query(Transaction).filter(Transaction.transaction_id == transaction_id).first()
    if transaction:
        db.delete(transaction)
        db.commit()
        return transaction
    return None

def update_transaction(db: Session, transaction_id: int, transaction_update: TransactionUpdate):
    transaction = db.query(Transaction).filter(Transaction.transaction_id == transaction_id).first()
    if not transaction:
        return None
    
    for key, value in transaction_update.model_dump(exclude_unset=True).items():
        if key == "amount" and value is not None:
            value = float(value)
        setattr(transaction, key, value)
    
    db.commit()
    db.refresh(transaction)
    return transaction

