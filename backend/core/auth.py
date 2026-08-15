from ninja.security import HttpBearer
from django.contrib.auth import get_user_model
import jwt

User = get_user_model()

# PyJWKClient handles fetching, caching, and JWK key conversion automatically
_jwk_client = jwt.PyJWKClient(
    "https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com",
    cache_keys=True
)

class FirebaseAuth(HttpBearer):
    def authenticate(self, request, token: str):
        project_id = "crowed-ft4bhi"
        
        try:
            signing_key = _jwk_client.get_signing_key_from_jwt(token)
            
            decoded = jwt.decode(
                token,
                signing_key.key,
                algorithms=["RS256"],
                audience=project_id,
                issuer=f"https://securetoken.google.com/{project_id}"
            )
            
            uid = decoded.get("user_id") or decoded.get("uid") or decoded.get("sub")
            if not uid:
                return None

            email = decoded.get("email", "")
            name = decoded.get("name", "")
            
            user, created = User.objects.get_or_create(
                username=uid,
                defaults={
                    "email": email,
                    "first_name": name,
                }
            )
            return user
        except Exception as e:
            print(f"Firebase token verification failed: {e}")
            return None
