from pydantic import BaseModel, EmailStr

class RegisterRequest(BaseModel):
    full_name: str
    email: EmailStr
    password: str

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"

class PublicUser(BaseModel):
    id: int
    full_name: str
    email: EmailStr

    class Config:
        from_attributes = True
