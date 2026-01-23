"""Embedding generation using sentence transformers."""
import time
from typing import List, Optional
import numpy as np
from sentence_transformers import SentenceTransformer
import structlog

from config import settings

logger = structlog.get_logger()


class EmbeddingService:
    """Service for generating text embeddings."""
    
    def __init__(self):
        self.model: Optional[SentenceTransformer] = None
        self.model_name = settings.embedding_model
        self.device = settings.device
        self.dimension = settings.embedding_dimension
        
    def load_model(self):
        """Load the sentence transformer model."""
        if self.model is not None:
            logger.info("Model already loaded", model=self.model_name)
            return
        
        logger.info("Loading embedding model", model=self.model_name, device=self.device)
        start_time = time.time()
        
        try:
            self.model = SentenceTransformer(
                self.model_name,
                device=self.device
            )
            load_time = time.time() - start_time
            logger.info(
                "Model loaded successfully",
                model=self.model_name,
                load_time_seconds=round(load_time, 2)
            )
        except Exception as e:
            logger.error("Failed to load model", error=str(e), model=self.model_name)
            raise
    
    def generate_embedding(self, text: str) -> Optional[List[float]]:
        """
        Generate embedding for a single text.
        
        Args:
            text: Input text to embed
            
        Returns:
            List of floats representing the embedding, or None if generation fails
        """
        if not text or not text.strip():
            logger.warning("Empty text provided for embedding")
            return None
        
        if self.model is None:
            logger.error("Model not loaded")
            raise RuntimeError("Embedding model not loaded. Call load_model() first.")
        
        try:
            embedding = self.model.encode(
                text,
                convert_to_numpy=True,
                show_progress_bar=False
            )
            return embedding.tolist()
        except Exception as e:
            logger.error("Failed to generate embedding", error=str(e), text_length=len(text))
            return None
    
    def generate_embeddings(self, texts: List[str]) -> List[Optional[List[float]]]:
        """
        Generate embeddings for multiple texts in batch.
        
        Args:
            texts: List of input texts
            
        Returns:
            List of embeddings (some may be None if generation fails)
        """
        if not texts:
            return []
        
        if self.model is None:
            raise RuntimeError("Embedding model not loaded. Call load_model() first.")
        
        # Filter out empty texts but keep track of indices
        valid_indices = [i for i, text in enumerate(texts) if text and text.strip()]
        valid_texts = [texts[i] for i in valid_indices]
        
        if not valid_texts:
            logger.warning("No valid texts provided for embedding")
            return [None] * len(texts)
        
        try:
            start_time = time.time()
            embeddings = self.model.encode(
                valid_texts,
                convert_to_numpy=True,
                show_progress_bar=False,
                batch_size=32
            )
            encode_time = time.time() - start_time
            
            logger.info(
                "Generated embeddings",
                count=len(valid_texts),
                time_seconds=round(encode_time, 2)
            )
            
            # Map embeddings back to original positions
            results: List[Optional[List[float]]] = [None] * len(texts)
            for idx, valid_idx in enumerate(valid_indices):
                results[valid_idx] = embeddings[idx].tolist()
            
            return results
            
        except Exception as e:
            logger.error("Failed to generate embeddings", error=str(e), count=len(texts))
            return [None] * len(texts)
    
    def get_dimension(self) -> int:
        """Get the embedding dimension."""
        return self.dimension
    
    def is_loaded(self) -> bool:
        """Check if model is loaded."""
        return self.model is not None


# Global embedding service instance
embedding_service = EmbeddingService()
