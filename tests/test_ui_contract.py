import json
import re
from pathlib import Path

from app import app


ROOT = Path(__file__).resolve().parents[1]


def rendered_home() -> str:
    app.config.update(TESTING=True)
    response = app.test_client().get("/")
    assert response.status_code == 200
    return response.get_data(as_text=True)


def test_every_tool_button_has_exactly_one_panel():
    html = rendered_home()
    tool_ids = re.findall(r'class="[^"]*\btool-tab\b[^"]*"[^>]*data-tab="([^"]+)"', html)
    panel_ids = re.findall(r'<section\s+id="([^"]+)"\s+class="[^"]*\bsection\b', html)

    assert len(tool_ids) == 82
    assert len(tool_ids) == len(set(tool_ids))
    assert len(panel_ids) == len(set(panel_ids))
    assert set(tool_ids) == set(panel_ids)


def test_public_tool_count_matches_the_real_navigation():
    html = rendered_home()
    count = len(re.findall(r'class="[^"]*\btool-tab\b', html))

    assert count == 82
    assert 'aria-label="82 ferramentas totalmente grátis"' in html
    assert '<span data-tool-count>82</span>' in html
    assert "78 ferramentas" not in html


def test_language_picker_is_self_contained_and_accessible():
    html = rendered_home()

    assert "flagcdn.com" not in html
    assert "flag_url" not in html
    assert 'aria-haspopup="menu"' in html
    assert 'role="menuitemradio"' in html
    assert 'data-lang-option="pt"' in html
    assert 'data-lang-option="en"' in html
    assert 'data-lang-option="es"' in html
    assert 'data-lang-option="ko"' in html


def test_navigation_exposes_keyboard_and_direct_link_contracts():
    html = rendered_home()
    navigation_js = (ROOT / "static/js/melotools-extra-tabs.js").read_text(encoding="utf-8")
    shortcut_js = (ROOT / "static/js/tool-shortcuts.js").read_text(encoding="utf-8")

    assert 'role="toolbar"' in html
    assert 'id="toolNavigationStatus"' in html
    assert 'id="copyCurrentToolLinkBtn"' in html
    for key in ("ArrowRight", "ArrowLeft", "Home", "End"):
        assert key in navigation_js
    assert "pushState" in navigation_js
    assert "popstate" in navigation_js
    assert "url.hash = toolId" in shortcut_js


def test_timer_can_pause_resume_and_reset():
    html = rendered_home()
    navigation_js = (ROOT / "static/js/melotools-extra-tabs.js").read_text(encoding="utf-8")

    assert 'id="stop_calc_timer" type="button">Pausar</button>' in html
    assert 'id="reset_calc_timer" type="button">Reiniciar</button>' in html
    assert "var canResume =" in navigation_js
    assert "resetTimer.addEventListener('click', resetTimerAction)" in navigation_js


def test_manifest_is_valid_and_describes_the_current_product():
    manifest = json.loads((ROOT / "static/manifest.json").read_text(encoding="utf-8"))

    assert manifest["short_name"] == "MeloTools"
    assert "82 ferramentas" in manifest["description"]
    assert manifest["display"] == "standalone"
    assert {icon["sizes"] for icon in manifest["icons"]} == {"192x192", "512x512"}
