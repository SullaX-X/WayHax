from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.middleware.cors import CORSMiddleware
from app.database import Base, engine
from app.auth.routes import router as auth_router
#from app.users.routes import router as users_router


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
try:
    app.mount("/static", StaticFiles(directory="app/static"), name="static")
    templates = Jinja2Templates(directory="app/templates")
except Exception:
    # Если директории не существуют, пропускаем
    pass

# подключаем роуты
app.include_router(auth_router, prefix="/auth", tags=["Authentication"])
#app.include_router(users_router, prefix="/users", tags=["Users"])


@app.get("/", tags=["Root"])
async def root():
    return {
        "message": "Welcome to WayHax API",
        "version": "1.0.0",
        "docs": "/docs"
    }


