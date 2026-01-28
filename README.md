# 💰 Finance Tracker Web App

An intelligent **personal finance tracking platform** built with **FastAPI**, **Next.js**, and **PostgreSQL**, featuring **machine learning-based expense categorization**.

This project showcases a modern **full-stack architecture** with a scalable backend, a clean frontend UI, and a touch of AI for predictive analytics — designed to demonstrate strong backend engineering, database management, and ML integration skills.

---

## 🚀 Features

### 🧱 Backend (FastAPI + PostgreSQL)
- **RESTful API architecture** built using FastAPI and SQLAlchemy ORM.
- **User authentication** with password hashing and JWT-based session management.
- Full **CRUD support** for users, budgets, and transactions.
- **Database migrations** managed with Alembic for smooth version control.
- Optimized **PostgreSQL schema** with foreign key relationships and indexed queries.

### 💡 Machine Learning
- **Automatic transaction categorization** using a trained Logistic Regression model with TF-IDF vectorization.
- Model predicts expense categories (e.g., Groceries, Dining Out, Utilities) based on transaction names.
- Integrated inference endpoint for **real-time predictions** from the backend.

### 🧠 Data Visualization
- **Dashboard** visualizes budgets and spending trends with dynamic charts.
- Built using **Next.js + TypeScript** for a smooth, responsive frontend experience.
- Interactive **Pie charts** and **Line charts** powered by Chart.js.

---

## 🧩 Tech Stack

| Layer | Technologies |
|-------|---------------|
| **Frontend** | Next.js, TypeScript, Tailwind CSS, Chart.js |
| **Backend** | FastAPI, Python, SQLAlchemy, Alembic |
| **Database** | PostgreSQL (formerly SQLite) |
| **Machine Learning** | scikit-learn, pandas, numpy |
| **Auth** | JWT (JSON Web Tokens) |

---

## 🧠 Machine Learning Model Overview

| Step | Description |
|------|--------------|
| **Dataset** | Labeled transactions (`transaction_name`, `category_name`) |
| **Preprocessing** | TF-IDF vectorization of transaction text |
| **Model** | Logistic Regression trained on 1,000+ examples |
| **Integration** | Served via FastAPI endpoint for real-time category prediction |

**Example:**
```bash
POST /predict-category
{
  "transaction_name": "Starbucks Latte"
}

Response:
{
  "predicted_category": "Dining Out",
  "confidence": 0.87
}
```
## ⚙️ Installation and Setup

Follow these steps to set up and run the Finance Tracker locally:

1. Clone the Repository:
   ```bash
   git clone https://github.com/yourusername/finance-tracker-app.git
   cd finance-tracker-app/backend
   ```
2. Create and Activate Virtual Environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # macOS/Linux
   venv\Scripts\activate     # Windows
   ```
3. Install Dependencies:
   ```env
   pip install -r requirements.txt
   ```
4. Configure Environment Variables:
   Create .env file in the /backend directory
   ```bash
   DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/expense_tracker
   SECRET_KEY=your_jwt_secret_key
   ALGORITHM=HS256
   ACCESS_TOKEN_EXPIRE_MINUTES=30
   ```
5. Run Database Migrations
   ```bash
   alembic upgrade head
   ```
   
6. Start the Backend Server
  ```bash
  uvicorn app.main:app --reload
  ```
  Backend runs on http://127.0.0.1:8000

7. Start the Frontend
   ```bash
   cd ../frontend
   npm install
   npm run dev
   ```
