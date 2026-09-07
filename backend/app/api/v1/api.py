from fastapi import APIRouter
from app.api.v1.endpoints import (
    health,
    me,
    courses,
    lessons,
    profile,
    leaderboard,
    achievements,
)

api_router = APIRouter()
api_router.include_router(health.router, tags=["Health"])
api_router.include_router(me.router, tags=["User"])
api_router.include_router(courses.router, tags=["Courses"])
api_router.include_router(lessons.router, tags=["Lessons"])
api_router.include_router(profile.router, tags=["Profile"])
api_router.include_router(leaderboard.router, tags=["Leaderboard"])
api_router.include_router(achievements.router, tags=["Achievements"])
