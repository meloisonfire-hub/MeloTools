#!/usr/bin/env python3
from pathlib import Path
import sys

TARGETS = [
    Path('/srv/melotools/templates/index.html'),
    Path('/srv/melotools/static/js/melotools-extra-tabs.js'),
    Path('/srv/melotools/app.py'),
]

ALLOW = [
    'oembed?url=',
    'jpe?g',
    '(\?|$)',
]

def suspicious(line: str) -> bool:
    if any(a in line for a in ALLOW):
        return False
    if '?' in line:
        return True
    if '??' in line:
        return True
    # Heuristic for common mojibake in PT-BR words
    for token in ['Voc?', 'est?', 'Respira??o', 'Classifica??o', 'avalia??o', 'sa?de', '?ndice', '?timo', 'h?bitos', 'saud?veis']:
        if token in line:
            return True
    return False

issues = []
for fp in TARGETS:
    if not fp.exists():
        continue
    for i, line in enumerate(fp.read_text(encoding='utf-8', errors='replace').splitlines(), 1):
        if suspicious(line):
            issues.append((str(fp), i, line[:220]))

if issues:
    print('FOUND_ISSUES', len(issues))
    for fp, ln, txt in issues[:200]:
        print(f'{fp}:{ln}: {txt}')
    sys.exit(2)

print('OK_NO_ENCODING_ISSUES')
