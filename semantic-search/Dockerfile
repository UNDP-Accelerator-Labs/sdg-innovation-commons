# Semantic Search Service Dockerfile
# Multi-stage build for optimized production image

# Stage 1: Builder - Install dependencies and download models
FROM python:3.11-slim as builder

WORKDIR /app

# Install build dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir --user -r requirements.txt

# Download and cache the embedding model
# This happens at build time so the image includes the model
ENV HF_HOME=/root/.cache/huggingface
ENV TRANSFORMERS_CACHE=/root/.cache/huggingface/transformers
ENV SENTENCE_TRANSFORMERS_HOME=/root/.cache/huggingface/sentence-transformers

# Pre-download the model to cache it in the image
RUN python -c "from sentence_transformers import SentenceTransformer; \
    model = SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2'); \
    print(f'Model loaded successfully with dimension: {model.get_sentence_embedding_dimension()}')"

# Stage 2: Runtime - Minimal production image
FROM python:3.11-slim

WORKDIR /app

# Install runtime dependencies only
RUN apt-get update && apt-get install -y \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Create non-root user first
RUN useradd -m -u 1000 appuser

# Copy Python packages from builder to user's home
COPY --from=builder /root/.local /home/appuser/.local
COPY --from=builder /root/.cache/huggingface /home/appuser/.cache/huggingface

# Set ownership
RUN chown -R appuser:appuser /home/appuser/.local /home/appuser/.cache

# Switch to non-root user
USER appuser

# Add local bin to PATH for appuser
ENV PATH=/home/appuser/.local/bin:$PATH

# Set environment variables for model caching
ENV HF_HOME=/home/appuser/.cache/huggingface
ENV TRANSFORMERS_CACHE=/home/appuser/.cache/huggingface/transformers
ENV SENTENCE_TRANSFORMERS_HOME=/home/appuser/.cache/huggingface/sentence-transformers
ENV PYTHONUNBUFFERED=1

# Copy application code
COPY --chown=appuser:appuser . .

# Expose port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD curl -f http://localhost:8000/health || exit 1

# Run the application
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "2"]
