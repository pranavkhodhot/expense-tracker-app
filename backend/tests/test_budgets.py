from app.models.budget import Budget
from app.models.category import Category
from app.models.user import User


def test_create_budget(auth_client, db_session):
    category = Category(category_name="Groceries")
    db_session.add(category)
    db_session.commit()
    db_session.refresh(category)

    payload = {
        "category_id": category.category_id,
        "amount": 500,
    }

    response = auth_client.post("/budgets", json=payload)

    assert response.status_code == 200
    data = response.json()

    assert data["category_id"] == payload["category_id"]
    assert float(data["amount"]) == payload["amount"]
    assert data["category_name"] == category.category_name

    transaction = db_session.query(Budget).one()
    assert transaction.category_id == category.category_id

def test_create_budget_without_auth(client, db_session):
    category = Category(category_name="Groceries")
    db_session.add(category)
    db_session.commit()
    db_session.refresh(category)
    payload = {
        "category_id": category.category_id,
        "amount": 500,
    }

    response = client.post("/budgets", json=payload)

    assert response.status_code == 401

def test_create_existing_budget(auth_client, db_session):
    category = Category(category_name="Groceries")
    db_session.add(category)
    db_session.commit()
    db_session.refresh(category)

    payload = {
        "category_id": category.category_id,
        "amount": 500,
    }

    response = auth_client.post("/budgets", json=payload)
    assert response.status_code == 200
    
    payload = {
        "category_id": category.category_id,
        "amount": 500,
    }

    response = auth_client.post("/budgets", json=payload)
    assert response.status_code == 400
    data = response.json()
    assert data["detail"] == "A Budget already exists"

def test_update_budget(auth_client, db_session):
    category = Category(category_name="Groceries")
    db_session.add(category)
    db_session.commit()
    db_session.refresh(category)

    payload = {
        "category_id": category.category_id,
        "amount": 1500,
    }

    response = auth_client.post("/budgets", json=payload)

    assert response.status_code == 200
    data = response.json()
    budget = db_session.query(Budget).filter(Budget.budget_id == data['budget_id']).first()
    assert budget.amount == payload['amount']

    payload2 = {
        "category_id": category.category_id,
        "amount": 1500,
    }

    response = auth_client.put(f"/budgets/{data['budget_id']}", json=payload2)

    assert response.status_code == 200
    data = response.json()
    budget = db_session.query(Budget).filter(Budget.budget_id == data['budget_id']).first()
    assert budget.amount == payload2['amount']

def test_delete_budget(auth_client, db_session):
    category = Category(category_name="Groceries")
    db_session.add(category)
    db_session.commit()
    db_session.refresh(category)

    payload = {
        "category_id": category.category_id,
        "amount": 1500,
    }

    response = auth_client.post("/budgets", json=payload)

    assert response.status_code == 200
    data = response.json()
    budget = db_session.query(Budget).filter(Budget.budget_id == data['budget_id']).first()
    assert budget != None


    response = auth_client.delete(f"/budgets/{data['budget_id']}")

    assert response.status_code == 200
    data = response.json()
    budget = db_session.query(Budget).filter(Budget.budget_id == data['budget_id']).first()
    assert budget == None


def test_delete_update_invalid_budget(auth_client, db_session):
    category = Category(category_name="Groceries")
    db_session.add(category)
    db_session.commit()
    db_session.refresh(category)

    response = auth_client.delete(f"/budgets/9999")
    data = response.json()
    assert response.status_code == 404
    assert "No budget exists" in data["detail"]

    payload = {
        "category_id": category.category_id,
        "amount": 1500,
    }

    response = auth_client.put(f"/budgets/9999",json=payload)
    data = response.json()
    assert response.status_code == 404
    assert "No budget exists" in data["detail"]

def test_user_cant_access_another_user_budget(auth_client, db_session):
    category = Category(category_name="Groceries")
    db_session.add(category)
    db_session.commit()
    db_session.refresh(category)

    payload = {
        "category_id": category.category_id,
        "amount": 1500,
    }

    response = auth_client.post("/budgets", json=payload)
    data = response.json()
    budget_id = data['budget_id']

    payload = {
        "email": "another@example.com",
        "password": "123",
        "name": "Test User"
    }

    response = auth_client.post("/auth/register", json=payload)

    payload = {
        "email": "another@example.com",
        "password": "123",
    }

    response = auth_client.post("/auth/login", json=payload)
    
    response = auth_client.delete(f"/budgets/{budget_id}")
    assert response.status_code == 403
    data = response.json()
    assert "This budget does not belong to user" in data['detail']

    payload2 = {
        "category_id": category.category_id,
        "amount": 1500,
    }

    response = auth_client.put(f"/budgets/{budget_id}",json=payload2)
    assert response.status_code == 403
    data = response.json()
    assert "This budget does not belong to user" in data['detail']