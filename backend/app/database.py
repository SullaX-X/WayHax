from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base, Session


DATABASE_URL = "postgresql+psycopg2://postgres:ansar09595@localhost:5432/WayHax"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()