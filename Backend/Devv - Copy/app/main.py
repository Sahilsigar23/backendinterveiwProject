from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from typing import List
from . import models, schemas, database, crud, auth
from fastapi.middleware.cors import CORSMiddleware
from jose import JWTError
import os
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(title="Inventory Management Tool")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

static_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "static")
app.mount("/static", StaticFiles(directory=static_dir), name="static")

@app.get("/favicon.ico")
async def favicon():
    return FileResponse(os.path.join(static_dir, "favicon.ico"))

def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

def get_current_user(token: str = Depends(OAuth2PasswordBearer(tokenUrl="login")), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    payload = auth.decode_access_token(token)
    if payload is None or "sub" not in payload:
        raise credentials_exception
    user = crud.get_user_by_username(db, payload["sub"])
    if user is None:
        raise credentials_exception
    return user

@app.get("/")
def read_root():
    return {"message": "Inventory Management Tool API is running."}

@app.post("/register", status_code=201)
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    crud.create_user(db, user)
    return {"message": "User registered successfully"}

@app.post("/login", response_model=schemas.Token)
def login(form_data: schemas.UserLogin, db: Session = Depends(get_db)):
    user = crud.authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(status_code=401, detail="Incorrect username or password")
    access_token = auth.create_access_token(data={"sub": user.username})
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/products", status_code=201)
def add_product(product: schemas.ProductCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    db_product = crud.create_product(db, product)
    return {"product_id": db_product.id, "message": "Product added successfully"}

@app.put("/products/{product_id}/quantity")
def update_quantity(product_id: int, payload: schemas.ProductUpdateQuantity, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    updated = crud.update_product_quantity(db, product_id, payload.quantity)
    return {"id": updated.id, "quantity": updated.quantity}

@app.get("/products", response_model=List[schemas.ProductOut])
def get_products(skip: int = 0, limit: int = 10, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    return crud.get_products(db, skip=skip, limit=limit) 