import pytest

from app import RESULT_SIGNER, app, load_secret_key


def test_production_requires_a_readable_secret(tmp_path, monkeypatch):
    monkeypatch.delenv("MELOTOOLS_SECRET_KEY", raising=False)
    monkeypatch.setenv("MELOTOOLS_SECRET_KEY_FILE", str(tmp_path / "missing-secret"))
    monkeypatch.setenv("MELOTOOLS_REQUIRE_SECRET", "1")
    with pytest.raises(RuntimeError, match="Segredo de producao indisponivel"):
        load_secret_key()


def test_health_and_service_worker_routes_exist():
    app.config.update(TESTING=True)
    client = app.test_client()
    assert client.get("/health").status_code == 200
    assert any(rule.rule == "/sw.js" for rule in app.url_map.iter_rules())


def test_home_has_valid_professional_workspace_shell():
    app.config.update(TESTING=True)
    response = app.test_client().get("/")
    html = response.get_data(as_text=True)
    assert response.status_code == 200
    assert 'class="workspace-intro"' in html
    assert 'class="nav-rail-label"' in html
    assert 'id="toolSearchClear"' in html
    assert 'role="combobox"' in html
    assert 'id="toolLauncher"' in html
    assert 'role="listbox"' in html
    assert 'aria-controls="toolSearchResults"' in html
    assert 'id="toolNavigationStatus"' in html
    assert 'id="copyCurrentToolLinkBtn"' in html
    assert 'role="toolbar"' in html
    assert "ui-professional.css" in html
    assert html.count("<h1") == 1
    assert html.count("<section") == html.count("</section>")
    assert '<h2 class="title"></h2>' not in html


def test_private_port_scan_is_rejected():
    app.config.update(TESTING=True)
    response = app.test_client().post("/api/dev/port-test", data={"host": "127.0.0.1", "port": "80"})
    assert response.status_code == 400
    assert response.get_json()["ok"] is False


def test_result_download_requires_a_token_outside_testing(tmp_path, monkeypatch):
    monkeypatch.setattr("app.RESULT_DIR", tmp_path)
    (tmp_path / "sample.txt").write_text("safe", encoding="utf-8")
    app.config.update(TESTING=False)
    response = app.test_client().get("/results/sample.txt")
    assert response.status_code == 403


def test_result_download_accepts_a_valid_token(tmp_path, monkeypatch):
    monkeypatch.setattr("app.RESULT_DIR", tmp_path)
    (tmp_path / "sample.txt").write_text("safe", encoding="utf-8")
    app.config.update(TESTING=False)
    token = RESULT_SIGNER.dumps({"filename": "sample.txt"})
    response = app.test_client().get(f"/results/sample.txt?token={token}")
    assert response.status_code == 200
    assert response.headers["Cache-Control"].startswith("private, no-store")


def test_result_download_rejects_a_token_for_another_file(tmp_path, monkeypatch):
    monkeypatch.setattr("app.RESULT_DIR", tmp_path)
    (tmp_path / "sample.txt").write_text("safe", encoding="utf-8")
    app.config.update(TESTING=False)
    token = RESULT_SIGNER.dumps({"filename": "other.txt"})
    assert app.test_client().get(f"/results/sample.txt?token={token}").status_code == 403
