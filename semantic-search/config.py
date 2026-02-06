"""Configuration management for semantic search service."""
import os
from pathlib import Path
from typing import Optional, List
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field, AliasChoices
from dotenv import load_dotenv

# Explicitly load .env.development file before settings initialization
env_file = Path(__file__).parent / ".env.development"
if env_file.exists():
    load_dotenv(env_file)


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
    
    # Application Base URL (for generating document URLs)
    app_base_url: str = Field(
        default="http://localhost:3000",
        env="APP_BASE_URL"
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
    
    # Feature Flags
    enable_cache: bool = Field(default=True, env="ENABLE_CACHE")
    enable_snippets: bool = Field(default=True, env="ENABLE_SNIPPETS")
    short_snippets: bool = Field(default=True, validation_alias="SHORT_SNIPPETS")
    enable_chunk_hashing: bool = Field(default=True, validation_alias="ENABLE_CHUNK_HASHING")
    
    # Redis Configuration (for queue)
    redis_host: str = Field(default="localhost", env="REDIS_HOST")
    redis_port: int = Field(default=6379, env="REDIS_PORT")
    redis_password: Optional[str] = Field(default=None, env="REDIS_PASSWORD")
    
    # PostgreSQL Database (for index maintenance)
    db_host: Optional[str] = Field(default=None, validation_alias="GENERAL_DB_HOST")
    db_port: int = Field(default=5432, validation_alias="GENERAL_DB_PORT")
    db_user: Optional[str] = Field(default=None, validation_alias="GENERAL_DB_USER")
    db_password: Optional[str] = Field(default=None, validation_alias="GENERAL_DB_PASSWORD")
    db_name: Optional[str] = Field(default=None, validation_alias="GENERAL_DB_NAME")
    
    # Blog Database (separate database for blogs - optional)
    blogs_db_host: Optional[str] = Field(default=None, validation_alias=AliasChoices("BLOGS_DB_HOST", "BLOG_DB_HOST"))
    blogs_db_port: int = Field(default=5432, validation_alias=AliasChoices("BLOGS_DB_PORT", "BLOG_DB_PORT"))
    blogs_db_user: Optional[str] = Field(default=None, validation_alias=AliasChoices("BLOGS_DB_USER", "BLOG_DB_USER"))
    blogs_db_password: Optional[str] = Field(default=None, validation_alias=AliasChoices("BLOGS_DB_PASSWORD", "BLOG_DB_PASSWORD"))
    blogs_db_name: Optional[str] = Field(default="blogs", validation_alias=AliasChoices("BLOGS_DB_NAME", "BLOG_DB_NAME"))
    
    # Chunking Parameters (matches NLP API)
    chunk_size: int = Field(default=600, env="CHUNK_SIZE")
    chunk_padding: int = Field(default=20, env="CHUNK_PADDING")
    
    # Performance
    max_workers: int = Field(default=4, env="MAX_WORKERS")
    batch_size: int = Field(default=32, env="BATCH_SIZE")
    timeout: int = Field(default=600, env="TIMEOUT")
    
    # Collection Names (Dual Architecture - matches NLP API)
    @property
    def vec_collection_name(self) -> str:
        """Vector collection name for snippet embeddings."""
        return f"{self.qdrant_collection_name}_dot_vec"
    
    @property
    def data_collection_name(self) -> str:
        """Data collection name for document metadata."""
        return f"{self.qdrant_collection_name}_dot_data"
    
    @property
    def allowed_origins_list(self) -> List[str]:
        """Parse allowed origins from comma-separated string."""
        return [origin.strip() for origin in self.allowed_origins.split(",")]
    
    @property
    def jwt_secret(self) -> Optional[str]:
        """Get JWT secret from any of the possible environment variables."""
        return self.app_secret or self.nextauth_secret or self.jwt_secret_key
    
    model_config = SettingsConfigDict(
        case_sensitive=False,
        extra="ignore"
    )


# Global settings instance
settings = Settings()
