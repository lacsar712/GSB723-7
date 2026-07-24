from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel


class SourceOut(BaseModel):
    id: UUID
    name: str
    source_type: str
    status: str
    description: Optional[str] = None
    is_enabled: bool = True
    created_at: Optional[datetime] = None

    model_config = {"from_attributes": True}


class SourceUpdate(BaseModel):
    status: Optional[str] = None
    is_enabled: Optional[bool] = None
    description: Optional[str] = None
