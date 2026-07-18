from pydantic import BaseModel


class RegisterIn(BaseModel):
    username: str
    password: str


class LoginIn(BaseModel):
    username: str
    password: str


class TokenOut(BaseModel):
    access: str
    refresh: str


class UserOut(BaseModel):
    id: int
    username: str
    email: str
    bio: str
    avatar_url: str
