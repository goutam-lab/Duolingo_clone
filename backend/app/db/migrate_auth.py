"""Migration utility to safely add authentication columns to existing users table."""
import logging
from sqlalchemy import text
from sqlalchemy.engine import Engine
from app.db.session import engine as default_engine

logger = logging.getLogger(__name__)


def migrate_auth_columns(engine: Engine = default_engine) -> None:
    """Safely adds auth columns to users table if they do not already exist."""
    with engine.connect() as conn:
        # Check existing columns
        result = conn.execute(text("PRAGMA table_info(users)"))
        existing_cols = {row[1] for row in result.fetchall()}

        if "password_hash" not in existing_cols:
            logger.info("Adding password_hash column to users table...")
            conn.execute(text("ALTER TABLE users ADD COLUMN password_hash VARCHAR(255)"))

        if "onboarding_completed" not in existing_cols:
            logger.info("Adding onboarding_completed column to users table...")
            conn.execute(text("ALTER TABLE users ADD COLUMN onboarding_completed BOOLEAN DEFAULT 0 NOT NULL"))

        if "experience_level" not in existing_cols:
            logger.info("Adding experience_level column to users table...")
            conn.execute(text("ALTER TABLE users ADD COLUMN experience_level VARCHAR(50)"))

        if "selected_course_id" not in existing_cols:
            logger.info("Adding selected_course_id column to users table...")
            conn.execute(text("ALTER TABLE users ADD COLUMN selected_course_id INTEGER REFERENCES courses(id) ON DELETE SET NULL"))

        conn.commit()
    logger.info("Auth columns migration verified.")


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    migrate_auth_columns()
