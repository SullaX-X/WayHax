from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import Base, engine
from app.auth.routes import router as auth_router
<<<<<<< HEAD
#from app.users.routes import router as users_router


# создаем таблицы в БД
=======

>>>>>>> 9ee180f22f4de2aff5af43109ce0370c8150a798
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="WayHax API",
    description="API для WayHax",
    version="1.0.0"
)

<<<<<<< HEAD
# настройка CORS для работы с фронтендом
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
=======
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
>>>>>>> 9ee180f22f4de2aff5af43109ce0370c8150a798
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

<<<<<<< HEAD
# подключаем роуты
app.include_router(auth_router, prefix="/auth", tags=["Authentication"])
#app.include_router(users_router, prefix="/users", tags=["Users"])


@app.get("/", tags=["Root"])
async def root():
    """Корневой эндпоинт API"""
    return {"message": "WayHax API", "version": "1.0.0"}
=======
app.include_router(auth_router, prefix="/auth", tags=["Authentication"])
>>>>>>> 9ee180f22f4de2aff5af43109ce0370c8150a798


