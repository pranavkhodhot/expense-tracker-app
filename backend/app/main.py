from fastapi import FastAPI
from app.api import users
from app.api import categories
from app.api import budgets

app = FastAPI()

app.include_router(users.router, prefix="/users", tags=["Users"])
app.include_router(categories.router, prefix="/categories", tags=["Categories"])
app.include_router(budgets.router, prefix="/budgets", tags=["Budgets"])



