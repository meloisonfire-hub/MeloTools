#!/usr/bin/env python3
from pathlib import Path

TARGETS = [
    Path('/srv/melotools/templates/index.html'),
    Path('/srv/melotools/static/js/melotools-extra-tabs.js'),
    Path('/srv/melotools/app.py'),
]

REPLACEMENTS = {
    'Voc?': 'Voc?',
    'voc?': 'voc?',
    'est?': 'est?',
    'sao': 's?o',
    'n?o': 'n?o',
    'N?o': 'N?o',
    'Respira??o': 'Respira??o',
    'respira??o': 'respira??o',
    'avalia??o': 'avalia??o',
    'cl?nica': 'cl?nica',
    'sa?de': 'sa?de',
    'Classifica??o': 'Classifica??o',
    'classifica??o': 'classifica??o',
    '?timo': '?timo',
    'h?bitos': 'h?bitos',
    'saud?veis': 'saud?veis',
    '?ndice': '?ndice',
    'menstrua??o': 'menstrua??o',
    'Ovula??o': 'Ovula??o',
    'ovula??o': 'ovula??o',
    'f?rtil': 'f?rtil',
    'pr?-menstrual': 'pr?-menstrual',
    'organiza??o': 'organiza??o',
    'sens?veis': 'sens?veis',
    'alimenta??o': 'alimenta??o',
    'orienta??o': 'orienta??o',
    'm?dica': 'm?dica',
    'seguran?a': 'seguran?a',
    'calend?rio': 'calend?rio',
    'come?ar': 'come?ar',
    'Presets de respira??o': 'Presets de respira??o',
    'Respira??o 4-7-8': 'Respira??o 4-7-8',
    'Respira??o 4-2-4': 'Respira??o 4-2-4',
}

for fp in TARGETS:
    if not fp.exists():
        continue
    text = fp.read_text(encoding='utf-8', errors='replace')
    for bad, good in REPLACEMENTS.items():
        text = text.replace(bad, good)
    fp.write_text(text, encoding='utf-8')

print('FIX_APPLIED')
