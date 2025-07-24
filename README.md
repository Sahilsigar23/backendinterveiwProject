# Inventory Management Tool 

A simple inventory management system for small businesses, built with FastAPI and SQLite. Includes both backend APIs and a frontend admin portal.

---

## 🚀 Features
- User registration and JWT authentication
- Add, update, and list products
- Product analytics endpoints
- Admin portal (HTML/JS, served via FastAPI)
- OpenAPI/Swagger docs (auto-generated)
- Automated API test script
- Docker support for easy deployment

---

## 🗂️ Project Structure

```
assisgment/
  ├── assFrontend/Devv - Copy/   # Frontend (serves admin portal, API)
  │   ├── app/                    # FastAPI app code
  │   ├── static/                 # Admin HTML, JS, CSS
  │   ├── db_init.sql             # DB schema
  │   ├── requirements.txt        # Python dependencies
  │   ├── Dockerfile              # Docker support
  │   ├── test_api.py             # API test script
  │   └── ...
  └── assiback/Devv - Copy/      # Backend (API only)
      ├── app/                    # FastAPI app code
      ├── db_init.sql             # DB schema
      ├── requirements.txt        # Python dependencies
      ├── test_api.py             # API test script
      └── ...
```

---

## 🛠️ Setup Instructions (for both frontend and backend)

### 1. Clone the repository
```sh
git clone <your-repo-url>
cd <repo-folder>
```

### 2. Install dependencies (choose frontend or backend)
```sh
cd "assFrontend/Devv - Copy"   # or cd "assiback/Devv - Copy"
pip install -r requirements.txt
```

### 3. Initialize the database
You can let the app auto-create tables, or run the SQL script:
```sh
sqlite3 inventory.db < db_init.sql
```

### 4. Run the server
```sh
uvicorn app.main:app --reload --port 8080   # For frontend (admin portal + API)
uvicorn app.main:app --reload --port 8000   # For backend (API only)
```

- Frontend API: [http://localhost:8080/docs](http://localhost:8080/docs)
- Backend API: [http://localhost:8000/docs](http://localhost:8000/docs)
- Admin Portal: [http://localhost:8080/static/admin.html](http://localhost:8080/static/admin.html)

### 5. Docker (optional)
```sh
cd "assFrontend/Devv - Copy"
docker build -t inventory-backend .
docker run -p 8080:8080 inventory-backend
```

---

## 📦 API Endpoints (common)

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

### Analytics (frontend only)
- **GET** `/analytics/summary` — Returns total inventory value and product count
- **GET** `/analytics/most-added` — Returns the product with the highest quantity
- Auth: Bearer JWT required

---

## 🖥️ Admin Portal
- Access at: [http://localhost:8080/static/admin.html](http://localhost:8080/static/admin.html)
- Features: Login, view/add/update products, view analytics
- All actions require authentication (login with your registered user)

---

## 🧪 Automated API Testing

A Python script (`test_api.py`) is provided in both frontend and backend folders to automatically test all major API endpoints and flows.

### How to Use
1. Make sure your server is running on the correct port.
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
- See `postman_collection.json` in each folder for ready-to-use API requests.
- Set the `base_url` and `access_token` variables as described in the documentation.

---

## ⚠️ Notes
- Change the JWT secret key in `app/auth.py` for production use.
- For production, use a more robust DB like PostgreSQL.
- All passwords are securely hashed using bcrypt.

---

## 🤖 AI Assistance Disclosure

> **This project was developed with the assistance of AI (OpenAI GPT-4 via Cursor).**
> - AI was used to help design the project structure, generate code for FastAPI endpoints, database models, and schemas, and to write and improve documentation.
> - AI also assisted in debugging, automating test scripts, and providing step-by-step guidance for API testing (Postman, Swagger, and Python scripts).
> - All code and documentation were reviewed and tested by the developer.

If you have any questions about which parts were AI-assisted, please refer to the commit history or ask the developer directly.
