from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from .config import settings

engine = create_engine(
    settings.DATABASE_URL,
    connect_args={"check_same_thread": False} if "sqlite" in settings.DATABASE_URL else {}
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def init_db_schema():
    Base.metadata.create_all(bind=engine)
    # Check and add missing columns if using SQLite
    if "sqlite" in settings.DATABASE_URL:
        import sqlite3
        db_path = settings.DATABASE_URL.replace("sqlite:///", "")
        if "?" in db_path:
            db_path = db_path.split("?")[0]
        try:
            conn = sqlite3.connect(db_path)
            cur = conn.cursor()
            
            # Resumes columns
            cur.execute("PRAGMA table_info(resumes)")
            existing_resume_cols = {r[1] for r in cur.fetchall()}
            resume_cols_to_add = [
                ("target_company", "TEXT"),
                ("template_id", "TEXT DEFAULT 'classic-professional'"),
                ("is_master", "BOOLEAN DEFAULT 0"),
                ("is_archived", "BOOLEAN DEFAULT 0"),
                ("scoring_report", "TEXT DEFAULT '{}'"),
                ("styling_config", "TEXT DEFAULT '{}'"),
                ("sections_order", "TEXT DEFAULT '[]'"),
                ("content", "TEXT DEFAULT '{}'"),
                ("evidence_links", "TEXT DEFAULT '[]'"),
                ("tailoring_history", "TEXT DEFAULT '[]'"),
            ]
            for col_name, col_type in resume_cols_to_add:
                if col_name not in existing_resume_cols:
                    cur.execute(f"ALTER TABLE resumes ADD COLUMN {col_name} {col_type}")

            # Applications columns
            cur.execute("PRAGMA table_info(applications)")
            existing_app_cols = {r[1] for r in cur.fetchall()}
            app_cols_to_add = [
                ("resume_id", "TEXT"),
                ("resume_snapshot", "TEXT DEFAULT '{}'"),
            ]
            for col_name, col_type in app_cols_to_add:
                if col_name not in existing_app_cols:
                    cur.execute(f"ALTER TABLE applications ADD COLUMN {col_name} {col_type}")

            conn.commit()
            conn.close()
        except Exception as e:
            print(f"Warning during schema column check: {e}")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

