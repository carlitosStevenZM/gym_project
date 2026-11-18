from __future__ import annotations

from datetime import datetime
from typing import TYPE_CHECKING
from uuid import UUID, uuid4

from sqlalchemy import DateTime, func
from sqlalchemy.dialects.postgresql import CITEXT
from sqlalchemy.dialects.postgresql import UUID as PostgresUUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.infrastructure.models.base import Base

if TYPE_CHECKING:
    from app.infrastructure.models.planning import Routine
    from app.infrastructure.models.training import RoutineSession


class AppUser(Base):
    """A user account that owns planning and training records."""

    __tablename__ = "app_user"

    id: Mapped[UUID] = mapped_column(
        PostgresUUID(as_uuid=True),
        primary_key=True,
        default=uuid4,
    )
    email: Mapped[str] = mapped_column(CITEXT(), unique=True, nullable=False)
    display_name: Mapped[str] = mapped_column(nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )
    deleted_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True),
    )

    routines: Mapped[list[Routine]] = relationship(back_populates="user")
    sessions: Mapped[list[RoutineSession]] = relationship(back_populates="user")
