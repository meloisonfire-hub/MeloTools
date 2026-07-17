from __future__ import annotations

import os

from flask_limiter import Limiter
from flask_limiter.util import get_remote_address


limiter = Limiter(
    key_func=get_remote_address,
    default_limits=[os.getenv("MELOTOOLS_DEFAULT_RATE_LIMIT", "180 per minute")],
    storage_uri=os.getenv("MELOTOOLS_RATE_LIMIT_STORAGE", "memory://"),
)

