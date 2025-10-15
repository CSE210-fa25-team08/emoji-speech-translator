from pydantic import BaseModel

class Translation(BaseModel):
    """
    Pydantic model to represent a translation from emoji to speech or vice-versa.
    """
    emoji: str
    speech: str