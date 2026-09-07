import logging
from sqlalchemy.engine import Engine
from app.db.base import Base
from app.db.session import engine as default_engine
# Import models to register them on Base.metadata
import app.models  # noqa: F401

logger = logging.getLogger(__name__)


def create_tables(engine: Engine = default_engine) -> None:
    """Create all database tables defined in SQLAlchemy models."""
    logger.info("Creating database tables...")
    Base.metadata.create_all(bind=engine)
    logger.info("Database tables created successfully.")


def drop_tables(engine: Engine = default_engine) -> None:
    """Drop all database tables defined in SQLAlchemy models."""
    logger.info("Dropping database tables...")
    Base.metadata.drop_all(bind=engine)
    logger.info("Database tables dropped successfully.")


def reset_db(engine: Engine = default_engine) -> None:
    """Drop and recreate all database tables."""
    drop_tables(engine)
    create_tables(engine)


if __name__ == "__main__":
    create_tables()
