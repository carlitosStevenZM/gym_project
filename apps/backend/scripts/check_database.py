import asyncio
from typing import final

from sqlalchemy import text

from app.infrastructure.database import engine


async def check_database() -> int:
    try:
        async with engine.connect() as connection:
            result = await connection.execute(
                text("SELECT current_database(), current_user")
            )
            print(f"Database connection successful:{result.one()} ")
            return 0
    except Exception as e:
        print(f"Database connection failed:{e}")
        return 1
    finally:
        await engine.dispose()


if __name__ == "__main__":
    raise SystemExit(asyncio.run(check_database()))
