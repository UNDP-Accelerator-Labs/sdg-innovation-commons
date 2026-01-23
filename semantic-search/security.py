"""Security utilities for API authentication and authorization."""
from datetime import datetime, timedelta
from typing import Optional
from fastapi import Security, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError, jwt
from passlib.context import CryptContext

from config import settings

# Security schemes
security_bearer = HTTPBearer()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """Create JWT access token."""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(hours=24)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(
        to_encode,
        settings.api_secret_key,
        algorithm=settings.api_algorithm
    )
    return encoded_jwt


def verify_token(token: str) -> dict:
    """Verify and decode JWT token."""
    try:
        payload = jwt.decode(
            token,
            settings.api_secret_key,
            algorithms=[settings.api_algorithm]
        )
        return payload
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )


async def verify_api_key(
    credentials: HTTPAuthorizationCredentials = Security(security_bearer)
) -> dict:
    """
    Verify API key from Authorization header.
    
    Accepts either:
    - JWT token (for authenticated Next.js requests)
    - Static API key (for internal service communication)
    """
    token = credentials.credentials
    
    # Try JWT verification first
    try:
        payload = verify_token(token)
        return payload
    except HTTPException:
        # If JWT fails, check if it's a valid static API key
        if token == settings.api_secret_key:
            return {"type": "api_key", "valid": True}
        
        # Neither JWT nor valid API key
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )


async def optional_auth(
    credentials: Optional[HTTPAuthorizationCredentials] = Security(security_bearer)
) -> Optional[dict]:
    """Optional authentication - allows public access but extracts auth if provided."""
    if credentials is None:
        return None
    
    try:
        return await verify_api_key(credentials)
    except HTTPException:
        # Don't fail on invalid auth for optional endpoints
        return None
