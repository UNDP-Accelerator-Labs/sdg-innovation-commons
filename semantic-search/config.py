"""Configuration management for semantic search service."""
import os
from typing import Optional, List
from pydantic_settings import BaseSettings
from pydantic import Field


class Settings(BaseSettings):
    """Application settings."""
    
    # Qdrant Configuration
    qdrant_host: str = Field(default="localhost", env="QDRANT_HOST")
    qdrant_port: int = Field(default=6333, env="QDRANT_PORT")
    qdrant_grpc_port: int = Field(default=6334, env="QDRANT_GRPC_PORT")
    qdrant_api_key: Optional[str] = Field(default=None, env="QDRANT_API_KEY")
    qdrant_collection_name: str = Field(default="sdg_documents", env="QDRANT_COLLECTION_NAME")
    qdrant_use_https: bool = Field(default=False, env="QDRANT_USE_HTTPS")
    
    # API Security
    api_secret_key: str = Field(..., env="API_SECRET_KEY")
    api_algorithm: str = Field(default="HS256", env="API_ALGORITHM")
    
    # JWT Authentication (for Next.js integration)
    app_secret: Optional[str] = Field(default=None, env="APP_SECRET")
    nextauth_secret: Optional[str] = Field(default=None, env="NEXTAUTH_SECRET")
    jwt_secret_key: Optional[str] = Field(default=None, env="JWT_SECRET_KEY")
    
    # API Key for service-to-service communication
    semantic_search_api_key: Optional[str] = Field(default=None, env="SEMANTIC_SEARCH_API_KEY")
    
    allowed_origins: str = Field(
        default="http://localhost:3000",
        env="ALLOWED_ORIGINS"
    )
    
    # Service Configuration
    service_host: str = Field(default="0.0.0.0", env="SERVICE_HOST")
    service_port: int = Field(default=8000, env="SERVICE_PORT")
    log_level: str = Field(default="INFO", env="LOG_LEVEL")
    
    # Embedding Model
    embedding_model: str = Field(
        default="sentence-transformers/all-MiniLM-L6-v2",
        env="EMBEDDING_MODEL"
    )
    embedding_dimension: int = Field(default=384, env="EMBEDDING_DIMENSION")
    device: str = Field(default="cpu", env="DEVICE")
    
    # Redis Cache (optional)
    redis_host: str = Field(default="localhost", env="REDIS_HOST")
    redis_port: int = Field(default=6379, env="REDIS_PORT")
    redis_password: Optional[str] = Field(default=None, env="REDIS_PASSWORD")
    redis_db: int = Field(default=0, env="REDIS_DB")
    redis_enabled: bool = Field(default=True, env="REDIS_ENABLED")
    redis_ttl: int = Field(default=3600, env="REDIS_TTL")
    
    # Feature Flags
    enable_cache: bool = Field(default=True, env="ENABLE_CACHE")
    enable_snippets: bool = Field(default=True, env="ENABLE_SNIPPETS")
    short_snippets: bool = Field(default=True, env="SHORT_SNIPPETS")
    
    # Performance
    max_workers: int = Field(default=4, env="MAX_WORKERS")
    batch_size: int = Field(default=32, env="BATCH_SIZE")
    timeout: int = Field(default=600, env="TIMEOUT")
    
    @property
    def allowed_origins_list(self) -> List[str]:
        """Parse allowed origins from comma-separated string."""
        return [origin.strip() for origin in self.allowed_origins.split(",")]
    
    @property
    def jwt_secret(self) -> Optional[str]:
        """Get JWT secret from any of the possible environment variables."""
        return self.app_secret or self.nextauth_secret or self.jwt_secret_key
    
    class Config:
        env_file = ".env.development"
        case_sensitive = False


# Global settings instance
settings = Settings()
