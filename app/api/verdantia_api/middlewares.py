import time
import logging
from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import JSONResponse

logger = logging.getLogger(__name__)


def add_middlewares(app: FastAPI):
    """Add all middlewares to the FastAPI app."""
    
    @app.middleware("http")
    async def content_length_limit(request: Request, call_next):
        """Limit request content length to 10MB."""
        content_length = request.headers.get("content-length")
        if content_length:
            try:
                size_mb = int(content_length) / (1024 * 1024)
                if size_mb > 10:
                    return JSONResponse(
                        status_code=413,
                        content={"error": "Request too large", "max_size_mb": 10}
                    )
            except ValueError:
                pass  # Invalid content-length header, let it through
        
        response = await call_next(request)
        return response
    
    @app.middleware("http")
    async def timing_middleware(request: Request, call_next):
        """Add timing and logging middleware."""
        start_time = time.time()
        
        # Log request
        logger.info(f"Request: {request.method} {request.url.path}")
        
        response = await call_next(request)
        
        # Calculate processing time
        process_time = time.time() - start_time
        
        # Add timing header
        response.headers["X-Process-Time"] = str(process_time)
        
        # Log response
        logger.info(f"Response: {response.status_code} in {process_time:.3f}s")
        
        return response
