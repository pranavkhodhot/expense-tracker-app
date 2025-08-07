-- Users table
CREATE TABLE IF NOT EXISTS users (
    user_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL, 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS categories (
    category_id INTEGER PRIMARY KEY AUTOINCREMENT,
    category_name TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS budgets (
    budget_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    category_id INTEGER,
    amount DECIMAL(10, 2) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(category_id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS recurring_transactions (
    recurring_transaction_id INTEGER PRIMARY KEY AUTOINCREMENT,
    transaction_name TEXT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    frequency TEXT NOT NULL,
    notes TEXT,
    start_date DATE NOT NULL,
    user_id INTEGER NOT NULL,
    category_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(category_id) ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS transactions (
    transaction_id INTEGER PRIMARY KEY AUTOINCREMENT,
    transaction_name TEXT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    transaction_date DATE NOT NULL,
    notes TEXT,
    user_id INTEGER NOT NULL,
    category_id INTEGER NOT NULL,
    recurring_transaction_id INTEGER, 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(category_id) ON DELETE RESTRICT,
    FOREIGN KEY (recurring_transaction_id) REFERENCES recurring_transactions(recurring_transaction_id) ON DELETE SET NULL
);

INSERT INTO users (user_id, name, email, password_hash) VALUES (1, 'Pranav', 'pranav@example.com', 'hashed_password_123');
INSERT INTO categories (category_id, category_name) VALUES (1, 'Groceries');
INSERT INTO categories (category_id, category_name) VALUES (2, 'Rent');
INSERT INTO categories (category_id, category_name) VALUES (3, 'Utilities');
INSERT INTO categories (category_id, category_name) VALUES (4, 'Entertainment');
INSERT INTO categories (category_id, category_name) VALUES (5, 'Transportation');
INSERT INTO categories (category_id, category_name) VALUES (6, 'Health');
INSERT INTO categories (category_id, category_name) VALUES (7, 'Dining Out');
INSERT INTO budgets (budget_id, user_id, category_id, amount, start_date, end_date) VALUES (1, 1, 1, 300.0, '2025-08-01', '2025-08-28');
INSERT INTO budgets (budget_id, user_id, category_id, amount, start_date, end_date) VALUES (2, 1, 2, 1200.0, '2025-08-01', '2025-08-28');
INSERT INTO budgets (budget_id, user_id, category_id, amount, start_date, end_date) VALUES (3, 1, 3, 150.0, '2025-08-01', '2025-08-28');
INSERT INTO budgets (budget_id, user_id, category_id, amount, start_date, end_date) VALUES (4, 1, 4, 100.0, '2025-08-01', '2025-08-28');
INSERT INTO transactions (transaction_id, transaction_name, amount, transaction_date, notes, user_id, category_id) 
VALUES (1, 'Whole Foods', 45.76, '2025-08-22', 'Weekly groceries', 1, 1);
INSERT INTO transactions (transaction_id, transaction_name, amount, transaction_date, notes, user_id, category_id) 
VALUES (2, 'Monthly Rent', 1200.0, '2025-08-08', 'August rent', 1, 2);
INSERT INTO transactions (transaction_id, transaction_name, amount, transaction_date, notes, user_id, category_id) 
VALUES (3, 'Netflix', 15.49, '2025-08-13', 'Streaming', 1, 4);
INSERT INTO transactions (transaction_id, transaction_name, amount, transaction_date, notes, user_id, category_id) 
VALUES (4, 'Uber Ride', 23.85, '2025-08-26', 'To work', 1, 5);
INSERT INTO transactions (transaction_id, transaction_name, amount, transaction_date, notes, user_id, category_id) 
VALUES (5, 'Pharmacy', 8.99, '2025-08-24', 'Medication', 1, 6);
INSERT INTO transactions (transaction_id, transaction_name, amount, transaction_date, notes, user_id, category_id) 
VALUES (6, 'Dinner at Olive Garden', 42.6, '2025-08-17', 'Dinner with friends', 1, 7);