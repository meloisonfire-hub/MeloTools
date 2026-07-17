import socket

import pytest

from melotools.security import UnsafeTarget, resolve_public_host, safe_calculate, validate_public_url


@pytest.mark.parametrize(
    "expression, expected",
    [
        ("(2 + 3) * 4", 20),
        ("10 / 4", 2.5),
        ("2 ** 8", 256),
        ("10 % 3", 1),
    ],
)
def test_safe_calculate(expression, expected):
    assert safe_calculate(expression) == expected


@pytest.mark.parametrize("expression", ["__import__('os')", "2 ** 999", "[1, 2]", "1 << 3"])
def test_safe_calculate_rejects_unsafe_expressions(expression):
    with pytest.raises((SyntaxError, ValueError)):
        safe_calculate(expression)


def test_private_url_is_rejected(monkeypatch):
    monkeypatch.setattr(
        socket,
        "getaddrinfo",
        lambda *_args, **_kwargs: [(socket.AF_INET, socket.SOCK_STREAM, 6, "", ("127.0.0.1", 80))],
    )
    with pytest.raises(UnsafeTarget):
        validate_public_url("http://example.test/admin")


def test_public_url_is_accepted(monkeypatch):
    monkeypatch.setattr(
        socket,
        "getaddrinfo",
        lambda *_args, **_kwargs: [(socket.AF_INET, socket.SOCK_STREAM, 6, "", ("93.184.216.34", 443))],
    )
    assert validate_public_url("https://example.com/video") == "https://example.com/video"
    assert resolve_public_host("example.com").addresses == ("93.184.216.34",)


@pytest.mark.parametrize("url", ["file:///etc/passwd", "ftp://example.com/a", "http://user:pass@example.com/"])
def test_unsupported_urls_are_rejected(url):
    with pytest.raises(UnsafeTarget):
        validate_public_url(url)

