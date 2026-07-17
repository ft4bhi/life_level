from ninja import Router
from ninja.security import HttpBearer
from django.http import HttpRequest
from django.shortcuts import get_object_or_404
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from .models import Journal
from .schemas import JournalIn, JournalOut, JournalUpdateIn
from typing import List

router = Router()


class JWTAuth(HttpBearer):
    def authenticate(self, request, token: str):
        jwt_auth = JWTAuthentication()
        try:
            validated_token = jwt_auth.get_validated_token(token)
            user = jwt_auth.get_user(validated_token)
            return user
        except (InvalidToken, TokenError):
            return None


auth = JWTAuth()


@router.get("/", response=List[JournalOut], auth=auth)
def list_journals(request: HttpRequest):
    """List all journals for the authenticated user."""
    user = request.auth
    journals = Journal.objects.filter(user=user)
    return list(journals)


@router.post("/", response=JournalOut, auth=auth)
def create_journal(request: HttpRequest, payload: JournalIn):
    """Create a new journal entry."""
    user = request.auth
    journal = Journal.objects.create(
        user=user,
        title=payload.title,
        excerpt=payload.excerpt or "",
        content=payload.content or "",
        mood=payload.mood or "✨",
    )
    return journal


@router.get("/{journal_id}", response=JournalOut, auth=auth)
def get_journal(request: HttpRequest, journal_id: int):
    """Retrieve a single journal entry."""
    user = request.auth
    journal = get_object_or_404(Journal, id=journal_id, user=user)
    return journal


@router.put("/{journal_id}", response=JournalOut, auth=auth)
def update_journal(request: HttpRequest, journal_id: int, payload: JournalUpdateIn):
    """Update an existing journal entry."""
    user = request.auth
    journal = get_object_or_404(Journal, id=journal_id, user=user)
    if payload.title is not None:
        journal.title = payload.title
    if payload.excerpt is not None:
        journal.excerpt = payload.excerpt
    if payload.content is not None:
        journal.content = payload.content
    if payload.mood is not None:
        journal.mood = payload.mood
    journal.save()
    return journal


@router.delete("/{journal_id}", auth=auth)
def delete_journal(request: HttpRequest, journal_id: int):
    """Delete a journal entry."""
    user = request.auth
    journal = get_object_or_404(Journal, id=journal_id, user=user)
    journal.delete()
    return {"success": True}
