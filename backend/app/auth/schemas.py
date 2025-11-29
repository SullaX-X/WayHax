<<<<<<< HEAD
from pydantic import BaseModel, EmailStr, Field, model_validator
=======
from pydantic import BaseModel, EmailStr, Field
>>>>>>> 9ee180f22f4de2aff5af43109ce0370c8150a798
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
<<<<<<< HEAD
    email: str
=======
>>>>>>> 9ee180f22f4de2aff5af43109ce0370c8150a798
    role: str 
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

class AuthLogin(BaseModel):
    login: str | None = Field(default=None, min_length=3, max_length=25)
    email: EmailStr | None = Field(default=None, max_length=100)
    password: str = Field(min_length=8, max_length=128, strip_whitespace=True)
<<<<<<< HEAD
    role: str = Field(description="Роль пользователя: 'Студент' или 'Организатор'")
    
    @model_validator(mode='after')
    def check_login_or_email(self):
        if not self.login and not self.email:
            raise ValueError('Необходимо указать логин или email')
        return self
=======
    role: str
>>>>>>> 9ee180f22f4de2aff5af43109ce0370c8150a798
