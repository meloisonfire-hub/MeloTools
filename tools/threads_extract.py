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


def is_media_url(value: str) -> bool:
    value = (value or "").lower()
    return ".mp4" in value or ".m3u8" in value


def extract_urls_from_html(html: str) -> list[str]:
    if not html:
        return []
    out = []
    seen = set()
    html = html.replace("\\u002F", "/")
    patterns = [
        r"https:\\/\\/[^\"'\\s]+\\.(?:mp4|m3u8)[^\"'\\s]*",
        r"https://[^\"'\\s]+\\.(?:mp4|m3u8)[^\"'\\s]*",
    ]
    for pattern in patterns:
        for match in re.findall(pattern, html, flags=re.IGNORECASE):
            url = match.replace("\\/", "/")
            url = unquote(url)
            if not is_media_url(url):
                continue
            if url in seen:
                continue
            seen.add(url)
            out.append(url)
    return out


async def extract(url: str) -> dict:
    async with async_playwright() as p:
        browser = await p.chromium.launch(
            headless=True,
            args=["--no-sandbox", "--disable-dev-shm-usage"],
        )
        page = await browser.new_page(user_agent=USER_AGENT, locale="pt-BR")
        seen = []

        def remember(response):
            value = response.url
            if is_media_url(value):
                seen.append(value)

        page.on("response", remember)
        try:
            await page.goto(url, wait_until="domcontentloaded", timeout=60000)
            await page.wait_for_timeout(20000)
            try:
                await page.mouse.wheel(0, 800)
                await page.wait_for_timeout(1200)
            except Exception:
                pass
            videos = await page.eval_on_selector_all(
                "video",
                """
                (els) => els.map((v) => ({
                    src: v.currentSrc || v.src,
                    width: v.videoWidth || 0,
                    height: v.videoHeight || 0,
                    duration: Number.isFinite(v.duration) ? v.duration : 0
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
            html = await page.content()
            title = await page.title()
        finally:
            await page.close()
            await browser.close()

    ordered = []
    seen_src = set()
    for item in videos:
        src = item.get("src") if isinstance(item, dict) else str(item or "")
        if not src or not is_media_url(src) or src in seen_src:
            continue
        seen_src.add(src)
        ordered.append(item if isinstance(item, dict) else {"src": src, "width": 0, "height": 0, "duration": 0})
    for src in seen:
        if not src or not is_media_url(src) or src in seen_src:
            continue
        seen_src.add(src)
        ordered.append({"src": src, "width": 0, "height": 0, "duration": 0})
    for src in perf_urls or []:
        if not src or not is_media_url(src) or src in seen_src:
            continue
        seen_src.add(src)
        ordered.append({"src": src, "width": 0, "height": 0, "duration": 0})
    for src in extract_urls_from_html(html):
        if src in seen_src:
            continue
        seen_src.add(src)
        ordered.append({"src": src, "width": 0, "height": 0, "duration": 0})
    return {"ok": True, "title": title, "videos": ordered[:12]}


async def main():
    if len(sys.argv) < 2:
        print(json.dumps({"ok": False, "message": "missing url"}))
        return 2
    try:
        data = await extract(sys.argv[1])
        print(json.dumps(data, ensure_ascii=False))
        return 0
    except Exception as exc:
        print(json.dumps({"ok": False, "message": str(exc)}, ensure_ascii=False))
        return 1


if __name__ == "__main__":
    raise SystemExit(asyncio.run(main()))
