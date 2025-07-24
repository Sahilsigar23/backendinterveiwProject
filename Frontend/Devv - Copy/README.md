# Inventory Management Tool (Frontend)

A simple frontend application to manage inventory for a small business. Built with FastAPI and SQLite.

---

## 🚀 Features
- User registration and JWT authentication
- Add products
- Update product quantity
- Get products (with pagination)
- OpenAPI/Swagger docs (auto-generated)
- Automated API test script
- **Admin portal (HTML/JS, served at `/static/admin.html` via backend)**
- **Analytics endpoints for inventory stats**
- **Docker support for easy deployment**

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

### 4. Run the server (Locally)
```sh
uvicorn app.main:app --reload --port 8080
```
The API will be available at [http://localhost:8080](http://localhost:8080).

### 5. Run with Docker (Recommended)
Build and run the backend in a container:
```sh
docker build -t inventory-backend .
docker run -p 8080:8080 inventory-backend
```

---

## 🖥️ Admin Portal
- Access at: [http://localhost:8080/static/admin.html](http://localhost:8080/static/admin.html)
- Features: Login, view/add/update products, view analytics
- All actions require authentication (login with your registered user)

---

## 📚 API Documentation
Visit [http://localhost:8080/docs](http://localhost:8080/docs) for interactive Swagger UI (OpenAPI 3.1).

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

### Analytics
- **GET** `/analytics/summary` — Returns total inventory value and product count
- **GET** `/analytics/most-added` — Returns the product with the highest quantity
- Auth: Bearer JWT required

---

## 🧪 Automated API Testing

A Python script (`test_api.py`) is provided to automatically test all major API endpoints and flows.

### How to Use
1. Make sure your server is running on `http://localhost:8080`.
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
 