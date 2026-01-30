from app.models.budget import Budget
from app.models.category import Category
from app.models.transaction import Transaction

def test_user_gets_correct_data(auth_client, db_session):
    category = Category(category_name="Groceries")
    db_session.add(category)
    db_session.commit()
    db_session.refresh(category)

    payload1 = {
        "category_id": category.category_id,
        "amount": 500,
    }

    response = auth_client.post("/budgets", json=payload1)

    assert response.status_code == 200

    payload2 = {
        "transaction_name": "Trader Joe's",
        "amount": 54.23,
        "transaction_date": "2025-01-10",
        "category_id": category.category_id,
        "notes": "Weekly groceries"
    }

    response = auth_client.post("/transactions", json=payload2)
    

    assert response.status_code == 200
    response = auth_client.get("/users/me")

    assert response.status_code == 200
    data = response.json()
    assert data["user"]["name"] == "test"
    assert data["user"]["email"] == "test@example.com"

    assert data["budgets"][0]["category_name"] == category.category_name
    assert data["budgets"][0]["amount"] == payload1["amount"]

    assert data["transactions"][0]["transaction_name"] == payload2["transaction_name"]
    assert data["transactions"][0]["amount"] == payload2["amount"]
    assert data["transactions"][0]["transaction_date"] == payload2["transaction_date"]
    assert data["transactions"][0]["category_name"] == category.category_name
    assert data["transactions"][0]["notes"] == payload2["notes"]

def test_cant_access_data_without_auth(client, db_session):
    response = client.get("/users/me")

    assert response.status_code == 401
    data = response.json()
    assert "No authentication token" in data['detail'] 
    