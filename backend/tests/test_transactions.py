from app.models.transaction import Transaction
from app.models.category import Category
from app.models.user import User
from datetime import datetime
currentDateAndTime = datetime.now()
currentTime = currentDateAndTime.strftime("%H:%M:%S")
currentTime = filter(lambda x: x  != ":",currentTime)
currentTime = "".join(currentTime)


def test_create_transaction(auth_client, db_session):
    category = Category(category_name="Groceries")
    db_session.add(category)
    db_session.commit()
    db_session.refresh(category)

    payload = {
        "transaction_name": "Trader Joe's",
        "amount": 54.23,
        "transaction_date": "2025-01-10",
        "category_id": category.category_id,
        "notes": "Weekly groceries"
    }

    response = auth_client.post("/transactions", json=payload)

    assert response.status_code == 200
    data = response.json()

    assert data["transaction_name"] == payload["transaction_name"]
    assert float(data["amount"]) == payload["amount"]
    assert data["category_name"] == "Groceries"

    transaction = db_session.query(Transaction).one()
    assert transaction.category_id == category.category_id

    
def test_create_transaction_without_auth(client, db_session):
    category = Category(category_name="Groceries")
    db_session.add(category)
    db_session.commit()

    payload = {
        "transaction_name": "Trader Joe's",
        "amount": 20.00,
        "transaction_date": "2025-01-10",
        "category_id": category.category_id,
        "notes": "Groceries"
    }

    response = client.post("/transactions", json=payload)

    assert response.status_code == 401


def test_create_transaction_invalid_category(auth_client):
    payload = {
        "transaction_name": "Trader Joe's",
        "amount": 20.00,
        "transaction_date": "2025-01-10",
        "category_id": 9999, 
        "notes": "Groceries"
    }

    response = auth_client.post("/transactions", json=payload)

    assert response.status_code == 404
    assert "No category exists" in response.json()["detail"]


def test_update_transaction(auth_client, db_session):
    category = Category(category_name="Groceries")
    db_session.add(category)
    db_session.commit()
    db_session.refresh(category)

    payload = {
        "transaction_name": "Trader Joe's",
        "amount": 54.23,
        "transaction_date": "2025-01-10",
        "category_id": category.category_id,
        "notes": "Weekly groceries"
    }

    response = auth_client.post("/transactions", json=payload)

    assert response.status_code == 200
    data = response.json()
    payload = {
        "transaction_name": "Walmart",
        "amount": 64.23,
        "transaction_date": "2025-01-09",
        "category_id": category.category_id,
        "notes": "BiWeekly groceries"
    }

    response = auth_client.put(f"/transactions/{data['transaction_id']}",json=payload)
    assert response.status_code == 200
    data = response.json()

    assert data["transaction_name"] == payload["transaction_name"]
    assert float(data["amount"]) == payload["amount"]
    assert data["transaction_date"] == payload["transaction_date"]
    assert data["notes"] == payload["notes"]

def test_delete_transaction(auth_client, db_session):
    category = Category(category_name="Groceries")
    db_session.add(category)
    db_session.commit()
    db_session.refresh(category)

    payload = {
        "transaction_name": "Trader Joe's",
        "amount": 54.23,
        "transaction_date": "2025-01-10",
        "category_id": category.category_id,
        "notes": "Weekly groceries"
    }

    response = auth_client.post("/transactions", json=payload)

    assert response.status_code == 200
    data = response.json()

    transaction = db_session.query(Transaction).filter(Transaction.transaction_id == data['transaction_id']).first()
    assert transaction != None

    response = auth_client.delete(f"/transactions/{data['transaction_id']}")
    assert response.status_code == 200
    data2 = response.json()

    transaction = db_session.query(Transaction).filter(Transaction.transaction_id == data2['transaction_id']).first()

    assert transaction == None

def test_user_cant_access_another_user(auth_client, db_session):
    category = Category(category_name="Groceries")
    db_session.add(category)
    db_session.commit()
    db_session.refresh(category)

    payload = {
        "transaction_name": "Trader Joe's",
        "amount": 54.23,
        "transaction_date": "2025-01-10",
        "category_id": category.category_id,
        "notes": "Weekly groceries"
    }

    response = auth_client.post("/transactions", json=payload)
    data = response.json()
    transaction_id = data['transaction_id']

    payload = {
        "email": "another@example.com",
        "password": "StrongPassword123!",
        "name": "Test User"
    }

    response = auth_client.post("/auth/register", json=payload)

    payload = {
        "email": "another@example.com",
        "password": "StrongPassword123!",
    }

    response = auth_client.post("/auth/login", json=payload)
    
    response = auth_client.delete(f"/transactions/{transaction_id}")
    assert response.status_code == 403
    data = response.json()
    assert "This transaction does not belong to user" in data['detail']

    payload = {
        "transaction_name": "Walmart",
        "amount": 64.23,
        "transaction_date": "2025-01-09",
        "category_id": category.category_id,
        "notes": "BiWeekly groceries"
    }

    response = auth_client.put(f"/transactions/{transaction_id}",json=payload)
    assert response.status_code == 403
    data = response.json()
    assert "This transaction does not belong to user" in data['detail']