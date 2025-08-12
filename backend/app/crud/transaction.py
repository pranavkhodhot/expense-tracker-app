from sqlalchemy.orm import Session
from app.models.transaction import Transaction
from app.schemas.transaction import TransactionCreate, TransactionUpdate
from datetime import date
from sqlalchemy.orm import joinedload

def create_transaction(db: Session, transaction: TransactionCreate):
    db_transaction = Transaction(
        user_id=transaction.user_id,
        category_id=transaction.category_id,
        transaction_name=transaction.transaction_name,
        amount=float(transaction.amount),
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

# def get_existing_budget(db: Session, user_id: int, category_id: int, start_date: date, end_date: date):
#     return db.query(Budget).filter(
#         Budget.user_id == user_id,
#         Budget.category_id == category_id,
#         Budget.start_date == start_date,
#         Budget.end_date == end_date
#     ).first()

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
    
    for key, value in transaction_update.dict(exclude_unset=True).items():
        if key == "amount" and value is not None:
            value = float(value)
        setattr(transaction, key, value)
    
    db.commit()
    db.refresh(transaction)
    return transaction

