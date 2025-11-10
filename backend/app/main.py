from fastapi import FastAPI
from app.api import users
from app.api import categories
from app.api import budgets
from app.api import transactions
from app.api import auth
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()

# ✅ Allow your frontend origin
origins = [
    "http://localhost:3000",  # React/Next dev server
    "http://127.0.0.1:3000"
]

# ✅ Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,          # URLs that can access the API
    allow_credentials=True,         # allow cookies/auth headers
    allow_methods=["*"],            # allow all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],            # allow all headers
)

app.include_router(users.router, prefix="/users", tags=["Users"])
app.include_router(categories.router, prefix="/categories", tags=["Categories"])
app.include_router(budgets.router, prefix="/budgets", tags=["Budgets"])
app.include_router(transactions.router, prefix="/transactions", tags=["Transactions"])
app.include_router(auth.router)




