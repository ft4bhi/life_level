from ninja import Router
from django.contrib.auth import get_user_model, authenticate
from django.http import HttpRequest
from rest_framework_simplejwt.tokens import RefreshToken
from .schemas import RegisterIn, TokenOut, UserOut, LoginIn

router = Router()
User = get_user_model()


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


@router.get("/me", response=UserOut)
def me(request: HttpRequest):
    """Return the currently authenticated user's info."""
    from core.auth import JWTAuth
    # Auth is handled at the API level via Ninja's auth param
    user = request.auth
    return {
        "id": user.id,
        "username": user.username,
        "email": user.email or "",
        "bio": user.bio,
        "avatar_url": user.avatar_url,
    }
