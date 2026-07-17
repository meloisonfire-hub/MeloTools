from __future__ import annotations

import ast
import ipaddress
import operator
import socket
import urllib.parse
from dataclasses import dataclass


class UnsafeTarget(ValueError):
    """Raised when a public request points at a private or unsupported target."""


@dataclass(frozen=True)
class ResolvedTarget:
    hostname: str
    addresses: tuple[str, ...]


def _public_ip(raw: str) -> bool:
    try:
        address = ipaddress.ip_address(raw)
    except ValueError:
        return False
    return address.is_global


def resolve_public_host(hostname: str, port: int | None = None) -> ResolvedTarget:
    host = (hostname or "").strip().rstrip(".")
    if not host or len(host) > 253:
        raise UnsafeTarget("Host inválido.")

    try:
        rows = socket.getaddrinfo(host, port, type=socket.SOCK_STREAM)
    except socket.gaierror as exc:
        raise UnsafeTarget("Não foi possível resolver este host.") from exc

    addresses = tuple(sorted({row[4][0] for row in rows}))
    if not addresses or any(not _public_ip(value) for value in addresses):
        raise UnsafeTarget("Endereços locais, privados ou reservados não são permitidos.")
    return ResolvedTarget(hostname=host, addresses=addresses)


def validate_public_url(raw: str) -> str:
    value = (raw or "").strip()
    try:
        parsed = urllib.parse.urlsplit(value)
    except ValueError as exc:
        raise UnsafeTarget("URL inválida.") from exc

    if parsed.scheme.lower() not in {"http", "https"}:
        raise UnsafeTarget("Use somente URLs HTTP ou HTTPS.")
    if not parsed.hostname or parsed.username or parsed.password:
        raise UnsafeTarget("URL inválida ou com credenciais embutidas.")
    if parsed.port is not None and not 1 <= parsed.port <= 65535:
        raise UnsafeTarget("Porta inválida.")

    resolve_public_host(parsed.hostname, parsed.port)
    return urllib.parse.urlunsplit(parsed)


_BIN_OPS = {
    ast.Add: operator.add,
    ast.Sub: operator.sub,
    ast.Mult: operator.mul,
    ast.Div: operator.truediv,
    ast.Mod: operator.mod,
    ast.Pow: operator.pow,
}
_UNARY_OPS = {ast.UAdd: operator.pos, ast.USub: operator.neg}


def safe_calculate(expression: str) -> int | float:
    if len(expression) > 160:
        raise ValueError("Expressão muito longa.")
    tree = ast.parse(expression, mode="eval")

    def evaluate(node: ast.AST, depth: int = 0):
        if depth > 16:
            raise ValueError("Expressão muito complexa.")
        if isinstance(node, ast.Expression):
            return evaluate(node.body, depth + 1)
        if isinstance(node, ast.Constant) and type(node.value) in {int, float}:
            return node.value
        if isinstance(node, ast.BinOp) and type(node.op) in _BIN_OPS:
            left = evaluate(node.left, depth + 1)
            right = evaluate(node.right, depth + 1)
            if isinstance(node.op, ast.Pow) and abs(right) > 12:
                raise ValueError("Expoente muito grande.")
            result = _BIN_OPS[type(node.op)](left, right)
            if not isinstance(result, (int, float)) or abs(result) > 10**100:
                raise ValueError("Resultado fora do limite.")
            return result
        if isinstance(node, ast.UnaryOp) and type(node.op) in _UNARY_OPS:
            return _UNARY_OPS[type(node.op)](evaluate(node.operand, depth + 1))
        raise ValueError("Operação não permitida.")

    return evaluate(tree)

