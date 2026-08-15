from ninja import Router, Schema
from django.contrib.auth import get_user_model, authenticate
from django.http import HttpRequest
from rest_framework_simplejwt.tokens import RefreshToken
from core.auth import FirebaseAuth
from .schemas import RegisterIn, TokenOut, UserOut, LoginIn


class ProfileUpdateIn(Schema):
    bio: str | None = None
    first_name: str | None = None

router = Router()
User = get_user_model()
auth = FirebaseAuth()


def get_tokens_for_user(user) -> dict:
    refresh = RefreshToken.for_user(user)
    return {
        "access": str(refresh.access_token),
        "refresh": str(refresh),
    }


@router.post("/register", response=TokenOut)
def register(request: HttpRequest, payload: RegisterIn):
    """Create a new user and return JWT tokens."""
    if User.objects.filter(username=payload.username).exists():
        from ninja.errors import HttpError
        raise HttpError(400, "Username already taken.")
    user = User.objects.create_user(
        username=payload.username,
        password=payload.password,
    )
    tokens = get_tokens_for_user(user)
    return tokens


@router.post("/login", response=TokenOut)
def login(request: HttpRequest, payload: LoginIn):
    """Authenticate a user and return JWT tokens."""
    user = authenticate(username=payload.username, password=payload.password)
    if not user:
        from ninja.errors import HttpError
        raise HttpError(401, "Invalid credentials")
    tokens = get_tokens_for_user(user)
    return tokens


@router.get("/me", response=UserOut, auth=auth)
def me(request: HttpRequest):
    """Return the currently authenticated user's info."""
    user = request.auth
    return {
        "id": user.id,
        "username": user.first_name or user.username,
        "email": user.email or "",
        "bio": user.bio,
        "avatar_url": user.avatar_url,
    }



@router.put("/me", response=UserOut, auth=auth)
def update_me(request: HttpRequest, payload: ProfileUpdateIn):
    """Update authenticated user's profile info."""
    user = request.auth
    if payload.bio is not None:
        user.bio = payload.bio
    if payload.first_name is not None:
        user.first_name = payload.first_name
    user.save()
    return {
        "id": user.id,
        "username": user.first_name or user.username,
        "email": user.email or "",
        "bio": user.bio,
        "avatar_url": user.avatar_url,
    }
