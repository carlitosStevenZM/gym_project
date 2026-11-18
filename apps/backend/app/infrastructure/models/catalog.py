from __future__ import annotations

from uuid import UUID, uuid4

from sqlalchemy import SmallInteger, Text
from sqlalchemy.dialects.postgresql import UUID as PostgresUUID
from sqlalchemy.orm import Mapped, mapped_column

from app.infrastructure.models.base import Base


class MuscleGroup(Base):
    """A global catalog group used to order exercise navigation."""

    __tablename__ = "muscle_group"

    id: Mapped[UUID] = mapped_column(
        PostgresUUID(as_uuid=True),
        primary_key=True,
        default=uuid4,
    )
    slug: Mapped[str] = mapped_column(Text, unique=True, nullable=False)
    name: Mapped[str] = mapped_column(Text, nullable=False)
    position: Mapped[int] = mapped_column(
        SmallInteger,
        unique=True,
        nullable=False,
    )
