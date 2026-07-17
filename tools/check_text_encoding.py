#!/usr/bin/env python3
from pathlib import Path
import sys


TARGETS = [
    Path("templates/index.html"),
    Path("static/js/melotools-extra-tabs.js"),
    Path("app.py"),
]

MOJIBAKE_TOKENS = (
    "\ufffd",
    "Ãƒ",
    "Ã‚",
    "â€“",
    "â€”",
    "â€œ",
    "â€",
    "ðŸ",
)


def suspicious(line: str) -> bool:
    return any(token in line for token in MOJIBAKE_TOKENS)


def main() -> int:
    issues = []
    for file_path in TARGETS:
        if not file_path.exists():
            continue
        text = file_path.read_text(encoding="utf-8", errors="strict")
        for line_number, line in enumerate(text.splitlines(), 1):
            if suspicious(line):
                issues.append((str(file_path), line_number))

    if issues:
        print(f"FOUND_ENCODING_ISSUES={len(issues)}")
        for file_path, line_number in issues[:200]:
            print(f"{file_path}:{line_number}")
        return 2

    print("OK_NO_ENCODING_ISSUES")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
