from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware

# Import custom packages
from src.backend.translator import Translator
from src.backend.Translation import Translation

# Instantiate the translator agent
translator = Translator()

# Instantiate the FastAPI app
app = FastAPI()

# Allow frontend origins (e.g., local dev and deployed site)
origins = [
    "http://127.0.0.1:5501",  # your local frontend
    "http://localhost:5501",
    "https://emoji-speech-translator.saichaparala.com",  # optional: production
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,          # or ["*"] to allow all
    allow_credentials=True,
    allow_methods=["*"],            # GET, POST, OPTIONS, etc.
    allow_headers=["*"],            # Authorization, Content-Type, etc.
)

@app.get("/")
async def root() -> JSONResponse:
    """
    Defines the root endpoint of the FastAPI server.

    Returns:
        JSONResponse: The content served over the root endpoint
    """
    return JSONResponse(
        content={"message": "Hello! Welcome to the FastAPI server serving the Emoji-to-Speech translator!"},
        status_code=200,
    )

@app.get("/health")
async def health_check() -> JSONResponse:
    """
    Performs a health check for the FastAPI web server.
    
    Returns:
        JSONResponse: The current health of the FastAPI web server
    """
    return JSONResponse(
        content={"status": "healthy"},
        status_code=200,
    )

@app.get("/ready")
async def readiness_check() -> JSONResponse:
    """
    Performs a readiness check for the FastAPI web server.

    Returns:
        JSONResponse: The current readiness state of the FastAPI web server
    """
    return JSONResponse(
        content={"status": "ready"},
        status_code=200,
    )
    
@app.post("/translate")
async def translate(request: Request) -> JSONResponse:
    """
    Endpoint to perform emoji to natural language translation and vice-versa.

    Args:
        request: A request object containing the content to translate
        
    Returns:
        JSONResponse: The translation result
    """
    
    # Extract the payload from the request body
    payload = await request.json()
    
    # Check if the payload contains both mode and text fields
    if not (payload.get("mode") and payload.get("text")):
        raise HTTPException(
            detail="Invalid input: Both 'mode' and 'text' fields are required.",
            status_code=422
        )
        
    # Check if the payload only contains 2 fields one of each mode and text
    if set(payload.keys()) != set(["text", "mode"]) or len(payload.keys()) != 2:
       raise HTTPException(
            detail="Invalid input: Additional fields are present.",
            status_code=422
        ) 
    
    # Invoke the translator agent with the emoji text
    translation = translator.structured_output(
        Translation,
        str(payload),
    )
    
    # Return the structured response
    return JSONResponse(
        content={
            "emoji": translation.emoji,
            "speech": translation.speech
        },
        status_code=200
    )