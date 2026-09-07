import pytest
from sqlalchemy import create_engine, event
from sqlalchemy.orm import sessionmaker, Session
from app.db.base import Base
import app.models  # noqa: F401


@pytest.fixture(scope="function")
def db_engine():
    # Use SQLite in-memory with foreign key support for fast isolated tests
    engine = create_engine(
        "sqlite:///:memory:",
        connect_args={"check_same_thread": False},
        echo=False,
    )

    @event.listens_for(engine, "connect")
    def set_sqlite_pragma(dbapi_connection, connection_record):
        cursor = dbapi_connection.cursor()
        cursor.execute("PRAGMA foreign_keys=ON")
        cursor.close()

    Base.metadata.create_all(bind=engine)
    yield engine
    Base.metadata.drop_all(bind=engine)
    engine.dispose()


@pytest.fixture(scope="function")
def db_session(db_engine):
    connection = db_engine.connect()
    transaction = connection.begin()
    SessionTest = sessionmaker(bind=connection, autocommit=False, autoflush=False)
    session = SessionTest()

    yield session

    session.close()
    if transaction.is_active:
        transaction.rollback()
    connection.close()
