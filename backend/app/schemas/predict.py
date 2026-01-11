from pydantic import BaseModel

class TransactionPredictionRequest(BaseModel):
    transaction_name: str
