from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models.bond import MarketSource
from app.models.user import User
from app.schemas.user import UserOut
from app.schemas.source import SourceOut, SourceUpdate
from app.api.deps import require_admin

router = APIRouter(
    prefix="/api/admin",
    tags=["系统管理"],
    dependencies=[Depends(require_admin)],
)


@router.get("/sources", response_model=list[SourceOut])
async def get_sources(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(MarketSource).order_by(MarketSource.name))
    return result.scalars().all()


@router.put("/sources/{source_id}", response_model=SourceOut)
async def update_source(
    source_id: UUID,
    body: SourceUpdate,
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(MarketSource).where(MarketSource.id == source_id))
    source = result.scalar_one_or_none()
    if not source:
        raise HTTPException(status_code=404, detail="行情源不存在")

    if body.status is not None:
        if body.status not in ("online", "offline", "error"):
            raise HTTPException(status_code=400, detail="非法的状态值")
        source.status = body.status
    if body.is_enabled is not None:
        source.is_enabled = body.is_enabled
    if body.description is not None:
        source.description = body.description

    await db.flush()
    await db.refresh(source)
    return source


@router.get("/users", response_model=list[UserOut])
async def get_users(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).order_by(User.created_at))
    return result.scalars().all()
