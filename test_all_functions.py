from app import app
from PIL import Image
import io
import tempfile
from pathlib import Path
import segno
import subprocess
import imageio_ffmpeg


def mk_png(name='img.png', color=(255,255,255)):
    b = io.BytesIO()
    Image.new('RGB',(160,120), color).save(b, format='PNG')
    b.seek(0)
    return (b, name)


def mk_pdf(name='doc.pdf'):
    b = io.BytesIO()
    Image.new('RGB',(180,130),(250,250,250)).save(b, format='PDF')
    b.seek(0)
    return (b, name)


def mk_docx(name='a.docx'):
    # dummy binary accepted by endpoint for fallback path
    b = io.BytesIO(b'PK\x03\x04DUMMYDOCX')
    b.seek(0)
    return (b, name)


def mk_video(name='v.mp4'):
    with tempfile.NamedTemporaryFile(prefix='melotools-test-video-', suffix='.mp4', delete=False) as handle:
        tmp = Path(handle.name)
    ffmpeg = imageio_ffmpeg.get_ffmpeg_exe()
    cmd = [
        ffmpeg, '-y',
        '-f', 'lavfi', '-i', 'color=c=red:s=160x120:d=2',
        '-f', 'lavfi', '-i', 'anullsrc=channel_layout=stereo:sample_rate=44100',
        '-shortest',
        '-c:v', 'libx264', '-c:a', 'aac',
        str(tmp)
    ]
    try:
        subprocess.run(cmd, check=True, capture_output=True, text=True)
        data = tmp.read_bytes()
    finally:
        tmp.unlink(missing_ok=True)
    b = io.BytesIO(data)
    b.seek(0)
    return (b, name)


def mk_qr_png(name='qr.png', text='https://example.org'):
    b = io.BytesIO()
    segno.make(text).save(b, kind="png", scale=6)
    b.seek(0)
    return (b, name)


def post_file(c, url, data):
    return c.post(url, data=data, content_type='multipart/form-data')


c = app.test_client()
results = []

def check(name, resp):
    j = resp.json or {}
    ok = resp.status_code == 200 and j.get('ok') is True
    results.append((name, ok, resp.status_code, j))


def check_status(name, resp, expected_status):
    j = resp.json or {}
    ok = resp.status_code == expected_status
    results.append((name, ok, resp.status_code, j))

# Health
check('health', c.get('/health'))

# Online videos: unsupported protocols must be rejected before reaching yt-dlp.
check_status('online-download-blocks-unsupported-protocol', c.post('/api/online/download', data={'url':'mock://video','mode':'video','quality':'720'}), 400)
check_status('online-clip-blocks-unsupported-protocol', c.post('/api/online/clip', data={'url':'mock://video','start':'0','end':'1'}), 400)
check_status('instagram-invalid-post', c.post('/api/online/instagram-tools', data={'url':'https://instagram.com/p/abc/'}), 400)
check('online-link-qr', c.post('/api/links/qr-generate', data={'text':'https://example.com/v'}))

# Image
check('image-remove-bg', post_file(c, '/api/image/remove-bg', {'file': mk_png(), 'strength':'25'}))
check('image-resize', post_file(c, '/api/image/resize', {'file': mk_png(), 'width':'80', 'height':'60'}))
check('image-compress', post_file(c, '/api/image/compress', {'file': mk_png(), 'quality':'70'}))
check('image-convert', post_file(c, '/api/image/convert', {'file': mk_png(), 'format':'jpg'}))
check('image-crop', post_file(c, '/api/image/crop', {'file': mk_png(), 'x':'0','y':'0','width':'50','height':'50'}))
check('image-rotate', post_file(c, '/api/image/rotate', {'file': mk_png(), 'degrees':'90'}))
check('image-favicon', post_file(c, '/api/image/favicon', {'file': mk_png()}))
check('image-pixelate', post_file(c, '/api/image/pixelate', {'file': mk_png(), 'strength':'12'}))
check('image-pdf-to-png', post_file(c, '/api/documents/pdf-to-image', {'file': mk_pdf()}))

# Documents
check('docs-ocr', post_file(c, '/api/documents/ocr-pdf', {'file': mk_pdf()}))
check('docs-organize', post_file(c, '/api/documents/organize-pdf', {'files': [mk_pdf('a1.pdf'), mk_pdf('a2.pdf')]}))
check('docs-rotate', post_file(c, '/api/documents/rotate-pdf', {'file': mk_pdf(), 'degrees':'90'}))
check('docs-split', post_file(c, '/api/documents/split-pdf', {'file': mk_pdf(), 'pages_per_file':'1'}))
check('docs-compress', post_file(c, '/api/documents/compress-pdf', {'file': mk_pdf(), 'quality':'screen'}))
check('docs-protect', post_file(c, '/api/documents/protect-pdf', {'file': mk_pdf(), 'password':'1234'}))
check_status('docs-reject-invalid-docx', post_file(c, '/api/documents/word-to-pdf', {'file': mk_docx()}), 400)
check('docs-image-to-pdf', post_file(c, '/api/documents/image-to-pdf', {'files': [mk_png('i1.png'), mk_png('i2.png')]}))
check('docs-pdf-to-image', post_file(c, '/api/documents/pdf-to-image', {'file': mk_pdf()}))
check('docs-number-pages', post_file(c, '/api/documents/number-pages', {'file': mk_pdf(), 'position':'footer-right'}))
check('docs-remove-pages', post_file(c, '/api/documents/remove-pages', {'file': mk_pdf(), 'pages':'1'}))
check('docs-extract-pages', post_file(c, '/api/documents/extract-pages', {'file': mk_pdf(), 'pages':'1'}))

# Videos (local file)
v1 = mk_video('v1.mp4')
v2 = mk_video('v2.mp4')
check('videos-split', post_file(c, '/api/videos/split', {'file': mk_video('vs.mp4'), 'size_mb':'2'}))
check('videos-cut', post_file(c, '/api/videos/cut', {'file': mk_video('vc.mp4'), 'start':'0', 'end':'1'}))
check('videos-join', post_file(c, '/api/videos/join', {'files': [v1, v2]}))
check('videos-compress', post_file(c, '/api/videos/compress', {'file': mk_video('vcomp.mp4'), 'crf':'30'}))
check('videos-convert', post_file(c, '/api/videos/convert', {'file': mk_video('vconv.mp4'), 'format':'webm'}))
check('videos-extract-audio', post_file(c, '/api/videos/extract-audio', {'file': mk_video('va.mp4')}))
check('videos-remove-audio', post_file(c, '/api/videos/remove-audio', {'file': mk_video('vr.mp4')}))
check('videos-gif', post_file(c, '/api/videos/gif', {'file': mk_video('vg.mp4'), 'start':'0', 'duration':'1'}))

# Text (10 actions)
text = 'um\ndois\ndois\ntres'
actions = ['chars','words','trim_lines','trim_spaces','upper','lower','capitalize','sort','dedupe','lorem']
for a in actions:
    check(f'text-{a}', c.post('/api/text/process', data={'text':text,'text_action':a}))

# Links/QR
check('links-qr-generate', c.post('/api/links/qr-generate', data={'text':'https://example.org'}))
check('links-qr-read', post_file(c, '/api/links/qr-read', {'file': mk_qr_png()}))

# Dev
check('dev-password', c.post('/api/dev/password', data={'length':'16','with_symbols':'true'}))
check('dev-hash', c.post('/api/dev/hash', data={'text':'MeloTools','algorithm':'sha256'}))
check('dev-ipcalc', c.post('/api/dev/ipcalc', data={'cidr':'10.0.0.10/24'}))
check_status('dev-port-blocks-private-target', c.post('/api/dev/port-test', data={'host':'127.0.0.1','port':'80'}), 400)
check_status('dev-dns-blocks-private-target', c.post('/api/dev/dns', data={'host':'localhost'}), 400)
check('dev-whois', c.post('/api/dev/whois', data={'domain':'example.com'}))

# Random
check('random-names', c.post('/api/random/names', data={'items':'ana\nbruno\ncarla'}))
check('random-number', c.post('/api/random/number', data={'min':'1','max':'10'}))
check('random-pick', c.post('/api/random/pick', data={'items':'a\nb\nc'}))
check('random-shuffle', c.post('/api/random/shuffle', data={'items':'a\nb\nc'}))
check('random-roulette', c.post('/api/random/roulette', data={'items':'a\nb\nc'}))
check('random-coin', c.post('/api/random/coin'))
check('random-dice', c.post('/api/random/dice', data={'faces':'20'}))

# Calculators
check('calc-simple', c.post('/api/calc/simple', data={'expression':'(2+3)*4'}))
check('calc-percentage', c.post('/api/calc/percentage', data={'value':'200','percent':'10'}))
check('calc-rule3', c.post('/api/calc/rule3', data={'a':'2','b':'4','c':'10'}))
check('calc-convert-temperature', c.post('/api/calc/convert', data={'convert_type':'temperature','from_unit':'c','to_unit':'f','number':'25'}))
check('calc-convert-weight', c.post('/api/calc/convert', data={'convert_type':'weight','from_unit':'kg','to_unit':'lb','number':'5'}))
check('calc-convert-distance', c.post('/api/calc/convert', data={'convert_type':'distance','from_unit':'km','to_unit':'m','number':'3'}))
check('calc-convert-filesize', c.post('/api/calc/convert', data={'convert_type':'filesize','from_unit':'mb','to_unit':'kb','number':'2'}))
check('calc-days', c.post('/api/calc/days-between', data={'date1':'2026-01-01','date2':'2026-01-11'}))
check('calc-age', c.post('/api/calc/age', data={'birth_date':'2000-01-01'}))

failed = [r for r in results if not r[1]]
print(f'TOTAL={len(results)} OK={len(results)-len(failed)} FAIL={len(failed)}')
for name, ok, code, payload in results:
    status = 'OK' if ok else 'FAIL'
    print(f'[{status}] {name} -> {code}')
    if not ok:
        print(payload)

if failed:
    raise SystemExit(1)
