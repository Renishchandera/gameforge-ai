import os
from fastapi import Header, HTTPException, status

INTERNAL_API_KEY = os.getenv("INTERNAL_API_KEY")

def verify_internal_key(x_internal_key: str = Header(None)):
    if not INTERNAL_API_KEY:
        raise RuntimeError("INTERNAL_API_KEY not configured")

    if x_internal_key != INTERNAL_API_KEY:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Forbidden"
        )
