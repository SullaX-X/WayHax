from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse
from app.database import Base, engine
from app.auth.routes import router as auth_router
#from app.users.routes import router as users_router
import os


# создаем таблицы в БД
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="WayHax API",
    description="Монолитное Веб-приложение WayHax",
    version="1.0.0"
)

# настройка CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# настройка статики и шаблонов
static_dir = "app/static"
templates_dir = "app/templates"

if os.path.exists(static_dir):
    app.mount("/static", StaticFiles(directory=static_dir), name="static")

if os.path.exists(templates_dir):
    templates = Jinja2Templates(directory=templates_dir)
else:
    templates = None

# подключаем роуты
app.include_router(auth_router, prefix="/auth", tags=["Authentication"])
#app.include_router(users_router, prefix="/users", tags=["Users"])


@app.get("/", response_class=HTMLResponse, tags=["Root"])
async def root(request: Request):
    """Главная страница"""
    if templates:
        return templates.TemplateResponse("index.html", {"request": request})
    return HTMLResponse(content="<h1>Welcome to WayHax</h1><p>Templates not found</p>")


@app.get("/login", response_class=HTMLResponse, tags=["Pages"])
async def login_page(request: Request):
    """Страница входа"""
    if templates:
        return templates.TemplateResponse("login.html", {"request": request})
    return HTMLResponse(content="<h1>Login Page</h1><p>Templates not found</p>")


@app.get("/register", response_class=HTMLResponse, tags=["Pages"])
async def register_page(request: Request):
    """Страница регистрации"""
    if templates:
        return templates.TemplateResponse("register.html", {"request": request})
    return HTMLResponse(content="<h1>Register Page</h1><p>Templates not found</p>")


