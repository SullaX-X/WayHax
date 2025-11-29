from pydantic import BaseModel, EmailStr, Field
from datetime import datetime
from pydantic import ConfigDict

class AuthCreate(BaseModel):
    login: str = Field(min_length=3, max_length=25)
    role: str
    email: EmailStr = Field(max_length=100)
    password: str = Field(min_length=8, max_length=128, strip_whitespace=True)

class AuthRead(BaseModel):
    id: int
    login: str
    role: str 
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

class AuthLogin(BaseModel):
    login: str | None = Field(default=None, min_length=3, max_length=25)
    email: EmailStr | None = Field(default=None, max_length=100)
    password: str = Field(min_length=8, max_length=128, strip_whitespace=True)
    role: str = Field(description="Роль пользователя: 'Студент' или 'Организатор'")
    
