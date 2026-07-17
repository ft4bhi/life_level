from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class JournalIn(BaseModel):
    title: str
    excerpt: Optional[str] = ""
    content: Optional[str] = ""
    mood: Optional[str] = "✨"


class JournalOut(BaseModel):
    id: int
    title: str
    excerpt: str
    content: str
    mood: str
    created_at: datetime
    updated_at: datetime


class JournalUpdateIn(BaseModel):
    title: Optional[str] = None
    excerpt: Optional[str] = None
    content: Optional[str] = None
    mood: Optional[str] = None
