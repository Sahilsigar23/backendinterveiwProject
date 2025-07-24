from pydantic import BaseModel
from typing import Optional

class UserCreate(BaseModel):
    username: str
    password: str

class UserLogin(BaseModel):
    username: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

class ProductBase(BaseModel):
    name: str
    type: str
    sku: str
    image_url: Optional[str] = None
    description: Optional[str] = None
    quantity: int
    price: float

class ProductCreate(ProductBase):
    pass

class ProductUpdateQuantity(BaseModel):
    quantity: int

class ProductOut(ProductBase):
    id: int
    class Config:
        orm_mode = True 