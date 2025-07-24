# Inventory Management Tool (Backend)

A simple backend application to manage inventory for a small business. Built with FastAPI and SQLite.

---

## 🚀 Features
- User registration and JWT authentication
- Add products
- Update product quantity
- Get products (with pagination)
- OpenAPI/Swagger docs (auto-generated)
- Automated API test script

---

## 🛠️ Setup Instructions

### 1. Clone the repository
```sh
git clone <your-repo-url>
cd <repo-folder>
```

### 2. Install dependencies
```sh
pip install -r requirements.txt
```

### 3. Initialize the database
You can let the app auto-create tables, or run the SQL script:
```sh
sqlite3 inventory.db < db_init.sql
```

### 4. Run the server
```sh
uvicorn app.main:app --reload
```
The API will be available at [http://localhost:8000](http://localhost:8000).

### 5. API Documentation
Visit [http://localhost:8000/docs](http://localhost:8000/docs) for interactive Swagger UI (OpenAPI 3.1).

---

## 📦 API Endpoints

### Register
- **POST** `/register`
- Request: `{ "username": "string", "password": "string" }`
- Response: 201 Created or 409 Conflict

### Login
- **POST** `/login`
- Request: `{ "username": "string", "password": "string" }`
- Response: `{ "access_token": "...", "token_type": "bearer" }`

### Add Product
- **POST** `/products`
- Auth: Bearer JWT required
- Request: `{ "name": ..., "type": ..., "sku": ..., "image_url": ..., "description": ..., "quantity": ..., "price": ... }`
- Response: `{ "product_id": ..., "message": ... }`

### Update Product Quantity
- **PUT** `/products/{id}/quantity`
- Auth: Bearer JWT required
- Request: `{ "quantity": ... }`
- Response: `{ "id": ..., "quantity": ... }`

### Get Products
- **GET** `/products?skip=0&limit=10`
- Auth: Bearer JWT required
- Response: List of products

---

## 🧪 Automated API Testing

A Python script (`test_api.py`) is provided to automatically test all major API endpoints and flows.

### How to Use
1. Make sure your server is running on `http://localhost:8000`.
2. Install the required library:
   ```sh
   pip install requests
   ```
3. Run the script:
   ```sh
   python test_api.py
   ```
4. The script will print PASS/FAIL results for registration, login, product addition, quantity update, and product listing.

---

## 🧰 Postman Collection
- See `postman_collection.json` for ready-to-use API requests.
- Set the `base_url` and `access_token` variables as described in the documentation.

---

## ⚠️ Notes
- Change the JWT secret key in `app/auth.py` for production use.
- For production, use a more robust DB like PostgreSQL.
- All passwords are securely hashed using bcrypt.

---

