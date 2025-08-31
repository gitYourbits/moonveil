import secrets
import hashlib


def generate_api_key() -> tuple[str, str, str]:
    """
    Returns (token, prefix, hashed_key).
    Token format: <prefix>.<secret>
    """
    prefix = secrets.token_urlsafe(9)[:12]
    secret = secrets.token_urlsafe(32)
    token = f"{prefix}.{secret}"
    hashed_key = hashlib.sha256(token.encode("utf-8")).hexdigest()
    return token, prefix, hashed_key


