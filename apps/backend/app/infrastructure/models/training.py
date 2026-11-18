from __future__ import annotations

from datetime import date, datetime
from typing import TYPE_CHECKING
from uuid import UUID, uuid4

from sqlalchemy import Date, DateTime, ForeignKey, Text, UniqueConstraint
from sqlalchemy.dialects.postgresql import UUID as PostgresUUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.infrastructure.models.base import Base

if TYPE_CHECKING:
    from app.infrastructure.models.account import AppUser
    from app.infrastructure.models.planning import Routine


class RoutineSession(Base):
    """A historical training session recorded by one user on one day."""

    __tablename__ = "routine_session"
    __table_args__ = (
        UniqueConstraint(
            "user_id",
            "session_date",
            name="uq_routine_session_user_date",
        ),
    )

    id: Mapped[UUID] = mapped_column(
        PostgresUUID(as_uuid=True),
        primary_key=True,
        default=uuid4,
    )
    user_id: Mapped[UUID] = mapped_column(
        ForeignKey("app_user.id", ondelete="CASCADE"),
        nullable=False,
    )
    routine_id: Mapped[UUID | None] = mapped_column(
        ForeignKey("routine.id", ondelete="SET NULL"),
    )
    routine_name: Mapped[str] = mapped_column(Text, nullable=False)
    session_date: Mapped[date] = mapped_column(Date, nullable=False)
    started_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
    )
    ended_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True),
    )

    user: Mapped[AppUser] = relationship(back_populates="sessions")
    routine: Mapped[Routine | None] = relationship(back_populates="sessions")
