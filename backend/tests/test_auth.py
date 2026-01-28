def test_register_user_success(client, db_session):
    payload = {
        "email": "testuser@example.com",
        "password": "StrongPassword123!",
        "name": "Test User"
    }

    response = client.post("/auth/register", json=payload)

    assert response.status_code == 201
    data = response.json()
    assert data["email"] == payload["email"]
    assert "password" not in data

    from app.models.user import User

    user = db_session.query(User).filter_by(email=payload["email"]).first()
    assert user is not None

    assert user.password_hash != payload["password"]
    assert user.password_hash.startswith("$2")

def test_register_user_duplicate_email(client):
    payload = {
        "email": "testuser@example.com",
        "password": "StrongPassword123!",
        "name": "Test User"
    }

    response = client.post("/auth/register", json=payload)

    assert response.status_code == 401

def test_login_with_correct_credentials(client):
    payload = {
        "email": "testuser@example.com",
        "password": "StrongPassword123!",
    }

    response = client.post("/auth/login", json=payload)

    assert response.status_code == 200
    data = response.json()
    assert data["message"] == "Login Successful"
    assert data["email"] == payload["email"]
    assert data["access_token"] is not None

def test_login_with_incorrect_credentials(client):
    payload = {
        "email": "testuser@example.com",
        "password": "NotStrongPassword123!",
    }

    response = client.post("/auth/login", json=payload)

    assert response.status_code == 401
    data = response.json()
    assert data["detail"] == "Invalid credentials"

def test_protected_route_requires_auth(client):
    response = client.get("/users/me")
    assert response.status_code == 401
    data = response.json()
    assert data["detail"] == "No authentication token provided in cookies."

def test_logout(client):
    payload = {
        "email": "testuser@example.com",
        "password": "StrongPassword123!",
    }

    response = client.post("/auth/login", json=payload)

    assert response.status_code == 200

    response2 = client.get("/users/me")
    assert response2.status_code == 200
    data = response2.json()
    assert data["user"]["user_id"] is not None
    assert data["user"]["email"] == payload["email"]
    assert data["budgets"] is not None
    assert data["transactions"] is not None

    response3 = client.post("auth/logout")
    data = response3.json()
    assert response3.status_code == 200
    assert data["message"] == "Logged out successfully"

    response4 = client.get("/users/me")
    assert response4.status_code == 401
    data = response4.json()
    assert data["detail"] == "No authentication token provided in cookies."




