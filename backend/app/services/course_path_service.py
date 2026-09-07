from typing import List
from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from app.repositories.course_repository import course_repository
from app.repositories.progress_repository import progress_repository
from app.schemas.course import (
    CoursePathResponse,
    CourseSummary,
    UnitPathResponse,
    SkillPathResponse,
    LessonPathResponse,
    SkillProgressSummary,
)


class CoursePathService:
    def get_course_path(
        self, db: Session, course_id: int, user_id: int
    ) -> CoursePathResponse:
        """
        Build the consolidated learning path in bounded queries without N+1.
        Derives sequential unlocking states for skills and lessons in-memory.
        """
        course = course_repository.get_course_path(db, course_id)
        if not course:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Course with ID {course_id} not found.",
            )

        # 1. Collect all skill and lesson IDs across the course
        all_skills = []
        all_skill_ids = []
        all_lesson_ids = []

        # Maintain linear order of skills across units for linear prerequisite unlocking
        for unit in course.units:
            for skill in unit.skills:
                all_skills.append(skill)
                all_skill_ids.append(skill.id)
                for lesson in skill.lessons:
                    all_lesson_ids.append(lesson.id)

        # 2. Batch fetch user progress records in exactly 2 queries
        skill_progress_map = progress_repository.get_skill_progress_map(
            db, user_id, all_skill_ids
        )
        lesson_progress_map = progress_repository.get_lesson_progress_map(
            db, user_id, all_lesson_ids
        )

        # 3. Derive sequential skill states
        # Skill 1 is available by default.
        # Skill N is unlocked only if Skill N-1 is completed.
        skill_status_map = {}
        previous_skill_completed = True

        for idx, skill in enumerate(all_skills):
            sp = skill_progress_map.get(skill.id)
            lessons_completed = sp.lessons_completed if sp else 0
            total_lessons = skill.total_lessons if skill.total_lessons > 0 else len(skill.lessons)

            if lessons_completed >= total_lessons and total_lessons > 0:
                skill_status = "completed"
                previous_skill_completed = True
            elif previous_skill_completed:
                if lessons_completed > 0:
                    skill_status = "in_progress"
                else:
                    skill_status = "available"
                previous_skill_completed = False
            else:
                skill_status = "locked"
                previous_skill_completed = False

            skill_status_map[skill.id] = (skill_status, lessons_completed, total_lessons, sp)

        # 4. Construct response structure with unit and lesson projections
        units_response: List[UnitPathResponse] = []

        for unit in course.units:
            skills_response: List[SkillPathResponse] = []

            for skill in unit.skills:
                skill_status, lessons_completed, total_lessons, sp = skill_status_map[skill.id]
                crown_level = sp.crown_level if sp else (1 if skill_status == "completed" else 0)
                progress_pct = int((lessons_completed / total_lessons) * 100) if total_lessons > 0 else 0

                # Derive lesson states within the skill
                lessons_response: List[LessonPathResponse] = []
                prev_lesson_completed = (skill_status != "locked")

                for l_idx, lesson in enumerate(skill.lessons):
                    lp = lesson_progress_map.get(lesson.id)
                    is_completed = lp.is_completed if lp else False
                    best_score = lp.best_score if lp else 0
                    attempts_count = lp.attempts_count if lp else 0

                    if is_completed:
                        lesson_status = "completed"
                        prev_lesson_completed = True
                    elif prev_lesson_completed:
                        lesson_status = "available"
                        prev_lesson_completed = False
                    else:
                        lesson_status = "locked"
                        prev_lesson_completed = False

                    lessons_response.append(
                        LessonPathResponse(
                            id=lesson.id,
                            title=lesson.title,
                            order_index=lesson.order_index,
                            xp_reward=lesson.xp_reward,
                            status=lesson_status,
                            is_completed=is_completed,
                            best_score=best_score,
                            attempts_count=attempts_count,
                        )
                    )

                skills_response.append(
                    SkillPathResponse(
                        id=skill.id,
                        title=skill.title,
                        description=skill.description,
                        icon_key=skill.icon_key,
                        node_type=skill.node_type,
                        order_index=skill.order_index,
                        status=skill_status,
                        progress=SkillProgressSummary(
                            lessons_completed=lessons_completed,
                            total_lessons=total_lessons,
                            progress_percentage=progress_pct,
                            crown_level=crown_level,
                        ),
                        lessons=lessons_response,
                    )
                )

            units_response.append(
                UnitPathResponse(
                    id=unit.id,
                    title=unit.title,
                    description=unit.description,
                    order_index=unit.order_index,
                    skills=skills_response,
                )
            )

        return CoursePathResponse(
            course=CourseSummary(
                id=course.id,
                code=course.code,
                title=course.title,
                source_language=course.source_language,
                target_language=course.target_language,
            ),
            units=units_response,
        )


course_path_service = CoursePathService()
