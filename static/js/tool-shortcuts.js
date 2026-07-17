(function () {
  'use strict';

  var FAVORITES_KEY = 'melotools-favorite-tools-v1';
  var RECENTS_KEY = 'melotools-recent-tools-v1';
  var favoriteButton = document.getElementById('favoriteCurrentToolBtn');
  var favoriteRow = document.getElementById('favoriteTools');
  var recentRow = document.getElementById('recentTools');
  if (!favoriteButton || !favoriteRow || !recentRow) return;

  function load(key) {
    try { return JSON.parse(localStorage.getItem(key) || '[]'); } catch (_error) { return []; }
  }

  function save(key, items) {
    try { localStorage.setItem(key, JSON.stringify(items)); } catch (_error) { /* Storage is optional. */ }
  }

  function currentTool() {
    var selected = document.querySelector('.tool-tab.active[data-tab]:not(.is-hidden)');
    if (!selected) return null;
    return {
      id: selected.getAttribute('data-tab'),
      label: (selected.textContent || '').trim(),
      category: selected.getAttribute('data-category') || ''
    };
  }

  function openTool(item) {
    var original = document.querySelector('.tool-tab[data-tab="' + CSS.escape(item.id) + '"]');
    if (original) original.click();
  }

  function renderRow(row, items) {
    row.replaceChildren();
    row.classList.toggle('hidden', !items.length);
    items.forEach(function (item) {
      var button = document.createElement('button');
      button.type = 'button';
      button.className = 'tool-shortcut-chip';
      button.textContent = item.label;
      button.addEventListener('click', function () { openTool(item); });
      row.appendChild(button);
    });
  }

  function render() {
    var favorites = load(FAVORITES_KEY);
    var recents = load(RECENTS_KEY);
    renderRow(favoriteRow, favorites);
    renderRow(recentRow, recents);
    var active = currentTool();
    var selected = !!active && favorites.some(function (item) { return item.id === active.id; });
    favoriteButton.setAttribute('aria-pressed', selected ? 'true' : 'false');
    favoriteButton.textContent = selected ? '★ Remover dos favoritos' : '☆ Favoritar ferramenta atual';
  }

  document.addEventListener('click', function (event) {
    var tool = event.target.closest && event.target.closest('.tool-tab[data-tab]');
    if (!tool) return;
    var item = { id: tool.dataset.tab, label: tool.textContent.trim(), category: tool.dataset.category || '' };
    var recents = load(RECENTS_KEY).filter(function (saved) { return saved.id !== item.id; });
    recents.unshift(item);
    save(RECENTS_KEY, recents.slice(0, 5));
    window.setTimeout(render, 0);
  });

  favoriteButton.addEventListener('click', function () {
    var active = currentTool();
    if (!active) return;
    var favorites = load(FAVORITES_KEY);
    var index = favorites.findIndex(function (item) { return item.id === active.id; });
    if (index >= 0) favorites.splice(index, 1);
    else favorites.unshift(active);
    save(FAVORITES_KEY, favorites.slice(0, 8));
    render();
  });

  render();
})();
