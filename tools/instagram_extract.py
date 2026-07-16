import asyncio
import json
import re
import sys
from urllib.parse import unquote

from playwright.async_api import async_playwright

USER_AGENT = (
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 "
    "Chrome/124.0.0.0 Safari/537.36"
)


def normalize_media_url(value: str) -> str:
    return (
        (value or "")
        .replace("\\u002F", "/")
        .replace("\\/", "/")
        .replace("\\u0026", "&")
    )


def is_instagram_cdn_url(value: str) -> bool:
    value = (value or "").lower()
    return "cdninstagram.com" in value or "fbcdn.net" in value


def is_video_url(value: str) -> bool:
    value = normalize_media_url(value).lower()
    return ".mp4" in value and is_instagram_cdn_url(value)


def is_image_url(value: str) -> bool:
    value = normalize_media_url(value).lower()
    if not is_instagram_cdn_url(value):
        return False
    return any(ext in value for ext in (".jpg", ".jpeg", ".png", ".webp"))


def media_key(value: str) -> str:
    value = normalize_media_url(value or "")
    return value.split("?", 1)[0]


def is_post_image_item(item: dict, trusted_meta: bool = False) -> bool:
    src = normalize_media_url((item or {}).get("src") or "")
    if not is_image_url(src):
        return False
    if trusted_meta:
        return True
    low_src = src.lower()
    alt = str((item or {}).get("alt") or "").lower()
    if any(token in alt for token in ("profile picture", "foto do perfil", "avatar", "comment", "coment")):
        return False
    if any(token in low_src for token in ("s150x150", "s320x320", "profile_pic", "profilepic")):
        return False
    try:
        width = int((item or {}).get("width") or 0)
        height = int((item or {}).get("height") or 0)
    except Exception:
        width = height = 0
    if width and height:
        if max(width, height) < 320:
            return False
        if width * height < 90000:
            return False
    return True


def append_unique(out: list, seen: set, item: dict) -> None:
    src = normalize_media_url((item or {}).get("src") or "")
    key = media_key(src)
    if not src or key in seen:
        return
    seen.add(key)
    copied = dict(item)
    copied["src"] = src
    out.append(copied)


def extract_urls_from_html(html: str, kind: str) -> list[str]:
    if not html:
        return []
    out = []
    seen = set()
    html = normalize_media_url(html)
    if kind == "video":
        patterns = [
            r"https:\\/\\/[^\"'\\s<>]+\\.mp4[^\"'\\s<>]*",
            r"https://[^\"'\\s<>]+\\.mp4[^\"'\\s<>]*",
        ]
        checker = is_video_url
    else:
        patterns = [
            r"https:\\/\\/[^\"'\\s<>]+\\.(?:jpg|jpeg|png|webp)[^\"'\\s<>]*",
            r"https://[^\"'\\s<>]+\\.(?:jpg|jpeg|png|webp)[^\"'\\s<>]*",
        ]
        checker = is_image_url
    for pattern in patterns:
        for match in re.findall(pattern, html, flags=re.IGNORECASE):
            url = unquote(normalize_media_url(match))
            if not checker(url):
                continue
            if url in seen:
                continue
            seen.add(url)
            out.append(url)
    return out


def load_instagram_cookies(cookies_path: str):
    cookies = []
    try:
        with open(cookies_path, "r", encoding="utf-8", errors="ignore") as fh:
            for line in fh:
                if not line or line.startswith("#") or "\t" not in line:
                    continue
                parts = line.rstrip("\n").split("\t")
                if len(parts) < 7:
                    continue
                domain, _, path, secure, _, name, value = parts[:7]
                if "instagram.com" not in domain:
                    continue
                cookies.append(
                    {
                        "name": name,
                        "value": value,
                        "domain": domain,
                        "path": path or "/",
                        "secure": secure.upper() == "TRUE",
                    }
                )
    except Exception:
        return []
    return cookies


async def extract(url: str, cookies_path: str) -> dict:
    async with async_playwright() as p:
        browser = await p.chromium.launch(
            headless=True,
            args=["--no-sandbox", "--disable-dev-shm-usage"],
        )
        context = await browser.new_context(user_agent=USER_AGENT, locale="pt-BR")
        cookies = load_instagram_cookies(cookies_path)
        if cookies:
            try:
                await context.add_cookies(cookies)
            except Exception:
                pass
        page = await context.new_page()
        seen_videos = []
        seen_images = []

        def remember(response):
            value = normalize_media_url(response.url)
            if is_video_url(value):
                seen_videos.append(value)
            elif is_image_url(value):
                seen_images.append(value)

        page.on("response", remember)
        try:
            await page.goto(url, wait_until="domcontentloaded", timeout=60000)
            await page.wait_for_timeout(18000)
            for _ in range(8):
                clicked = await page.evaluate(
                    """
                    () => {
                      const scope = document.querySelector('main article') || document.querySelector('article') || document.querySelector('main') || document.body;

                      const rx = /next|avancar|avan??ar|proximo|pr??ximo|siguiente/i;

                      const candidates = Array.from(scope.querySelectorAll('[aria-label], button, div[role="button"]'));
                      const next = candidates.find((el) => {
                        const label = (el.getAttribute('aria-label') || el.textContent || '').trim();
                        const rect = el.getBoundingClientRect();
                        return rx.test(label) && rect.width > 0 && rect.height > 0;
                      });
                      if (!next) return false;
                      next.click();
                      return true;
                    }
                    """
                )
                if not clicked:
                    break
                await page.wait_for_timeout(1800)
            videos = await page.eval_on_selector_all(
                "main article video, article video",
                """
                (els) => els.map((v) => ({
                    src: v.currentSrc || v.src,
                    width: v.videoWidth || 0,
                    height: v.videoHeight || 0,
                    duration: Number.isFinite(v.duration) ? v.duration : 0
                  })).filter((item) => item.src)
                """,
            )
            images = await page.eval_on_selector_all(
                "main article img, article img",
                """
                (els) => els.map((img) => ({
                    src: img.currentSrc || img.src,
                    width: img.naturalWidth || img.width || 0,
                    height: img.naturalHeight || img.height || 0,
                    alt: img.alt || ''
                  })).filter((item) => item.src)
                """,
            )
            perf_urls = await page.evaluate(
                """
                () => performance.getEntriesByType('resource')
                  .map((x) => x && x.name ? x.name : '')
                  .filter(Boolean)
                """
            )
            meta_media = await page.evaluate(
                """
                () => Array.from(document.querySelectorAll('meta[property], meta[name]'))
                  .map((m) => ({
                    key: (m.getAttribute('property') || m.getAttribute('name') || '').toLowerCase(),
                    content: m.getAttribute('content') || ''
                  }))
                  .filter((m) => m.content)
                """
            )
            title = await page.title()
            html = await page.content()
        finally:
            await page.close()
            await context.close()
            await browser.close()

    ordered_videos = []
    seen_src = set()
    for item in videos:
        src = normalize_media_url(item.get("src") if isinstance(item, dict) else str(item or ""))
        if not src or not is_video_url(src) or media_key(src) in seen_src:
            continue
        append_unique(ordered_videos, seen_src, item if isinstance(item, dict) else {"src": src, "width": 0, "height": 0, "duration": 0})
    for meta in meta_media or []:
        if not isinstance(meta, dict) or "video" not in str(meta.get("key") or ""):
            continue
        src = normalize_media_url(meta.get("content") or "")
        if is_video_url(src):
            append_unique(ordered_videos, seen_src, {"src": src, "width": 0, "height": 0, "duration": 0})
    if not ordered_videos:
        for src in list(seen_videos or []) + list(perf_urls or []):
            src = normalize_media_url(src)
            if is_video_url(src):
                append_unique(ordered_videos, seen_src, {"src": src, "width": 0, "height": 0, "duration": 0})
        for src in extract_urls_from_html(html, "video"):
            if is_video_url(src):
                append_unique(ordered_videos, seen_src, {"src": src, "width": 0, "height": 0, "duration": 0})

    ordered_images = []
    seen_src = set()
    for meta in meta_media or []:
        if not isinstance(meta, dict) or "image" not in str(meta.get("key") or ""):
            continue
        src = normalize_media_url(meta.get("content") or "")
        item = {"src": src, "width": 0, "height": 0, "alt": "post image"}
        if is_post_image_item(item, trusted_meta=True):
            append_unique(ordered_images, seen_src, item)
    for item in images:
        src = normalize_media_url(item.get("src") if isinstance(item, dict) else str(item or ""))
        if not src or not isinstance(item, dict) or not is_post_image_item(item) or media_key(src) in seen_src:
            continue
        append_unique(ordered_images, seen_src, item)
    if not ordered_images:
        for src in list(seen_images or []) + list(perf_urls or []):
            item = {"src": normalize_media_url(src), "width": 0, "height": 0, "alt": ""}
            if is_post_image_item(item):
                append_unique(ordered_images, seen_src, item)
        for src in extract_urls_from_html(html, "image"):
            item = {"src": src, "width": 0, "height": 0, "alt": ""}
            if is_post_image_item(item):
                append_unique(ordered_images, seen_src, item)

    ordered_images.sort(key=lambda x: (int(x.get("width") or 0) * int(x.get("height") or 0)), reverse=True)
    return {"ok": True, "title": title, "videos": ordered_videos[:12], "images": ordered_images[:20]}


async def main():
    if len(sys.argv) < 2:
        print(json.dumps({"ok": False, "message": "missing url"}))
        return 2
    cookies_path = sys.argv[2] if len(sys.argv) >= 3 else "/srv/melotools/yt-cookies.txt"
    try:
        data = await extract(sys.argv[1], cookies_path)
        print(json.dumps(data, ensure_ascii=False))
        return 0
    except Exception as exc:
        print(json.dumps({"ok": False, "message": str(exc)}, ensure_ascii=False))
        return 1


if __name__ == "__main__":
    raise SystemExit(asyncio.run(main()))
