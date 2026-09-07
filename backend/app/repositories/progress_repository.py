from typing import List, Dict
from sqlalchemy import select
from sqlalchemy.orm import Session
from app.models.skill_progress import SkillProgress
from app.models.lesson_progress import LessonProgress


class ProgressRepository:
    def get_skill_progress_map(
        self, db: Session, user_id: int, skill_ids: List[int]
    ) -> Dict[int, SkillProgress]:
        """Fetch all skill progress records for a user and list of skills in one batched query."""
        if not skill_ids:
            return {}
        stmt = select(SkillProgress).where(
            SkillProgress.user_id == user_id,
            SkillProgress.skill_id.in_(skill_ids),
        )
        records = db.execute(stmt).scalars().all()
        return {r.skill_id: r for r in records}

    def get_lesson_progress_map(
        self, db: Session, user_id: int, lesson_ids: List[int]
    ) -> Dict[int, LessonProgress]:
        """Fetch all lesson progress records for a user and list of lessons in one batched query."""
        if not lesson_ids:
            return {}
        stmt = select(LessonProgress).where(
            LessonProgress.user_id == user_id,
            LessonProgress.lesson_id.in_(lesson_ids),
        )
        records = db.execute(stmt).scalars().all()
        return {r.lesson_id: r for r in records}


progress_repository = ProgressRepository()
