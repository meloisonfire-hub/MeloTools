(function () {
  'use strict';

  var FAVORITES_KEY = 'melotools-favorite-tools-v1';
  var RECENTS_KEY = 'melotools-recent-tools-v1';
  var favoriteButton = document.getElementById('favoriteCurrentToolBtn');
  var shareButton = document.getElementById('copyCurrentToolLinkBtn');
  var currentName = document.getElementById('currentToolName');
  var favoriteRow = document.getElementById('favoriteTools');
  var recentRow = document.getElementById('recentTools');
  var toastContainer = document.getElementById('toastContainer');
  if (!favoriteButton || !shareButton || !currentName || !favoriteRow || !recentRow) return;

  function load(key) {
    try {
      var value = JSON.parse(localStorage.getItem(key) || '[]');
      return Array.isArray(value) ? value : [];
    } catch (_error) {
      return [];
    }
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

  function findTool(toolId) {
    return Array.prototype.find.call(document.querySelectorAll('.tool-tab[data-tab]'), function (tab) {
      return tab.dataset.tab === toolId;
    });
  }

  function openTool(item) {
    var original = findTool(item.id);
    if (original) original.click();
  }

  function validItems(items) {
    return items.filter(function (item) {
      return item && item.id && item.label && findTool(item.id);
    });
  }

  function renderRow(row, items) {
    row.replaceChildren();
    row.classList.toggle('hidden', !items.length);
    items.forEach(function (item) {
      var button = document.createElement('button');
      button.type = 'button';
      button.className = 'tool-shortcut-chip';
      button.textContent = item.label;
      button.setAttribute('aria-label', 'Abrir ' + item.label);
      button.addEventListener('click', function () { openTool(item); });
      row.appendChild(button);
    });
  }

  function render() {
    var favorites = validItems(load(FAVORITES_KEY)).slice(0, 8);
    var recents = validItems(load(RECENTS_KEY)).slice(0, 5);
    renderRow(favoriteRow, favorites);
    renderRow(recentRow, recents);
    var active = currentTool();
    var selected = !!active && favorites.some(function (item) { return item.id === active.id; });
    currentName.textContent = active ? active.label : 'Escolha uma ferramenta';
    favoriteButton.setAttribute('aria-pressed', selected ? 'true' : 'false');
    favoriteButton.setAttribute('aria-label', selected && active
      ? 'Remover ' + active.label + ' dos favoritos'
      : 'Adicionar ' + (active ? active.label : 'a ferramenta atual') + ' aos favoritos');
    favoriteButton.textContent = selected ? '★ Favorita' : '☆ Favoritar';
    shareButton.setAttribute('aria-label', 'Copiar link para ' + (active ? active.label : 'a ferramenta atual'));
  }

  function toolUrl(toolId) {
    var url = new URL(window.location.href);
    url.hash = toolId;
    return url.toString();
  }

  async function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return;
    }
    var input = document.createElement('textarea');
    input.value = text;
    input.setAttribute('readonly', '');
    input.style.position = 'fixed';
    input.style.opacity = '0';
    document.body.appendChild(input);
    input.select();
    var copied = document.execCommand('copy');
    input.remove();
    if (!copied) throw new Error('Não foi possível copiar o link.');
  }

  function showToast(message, type) {
    if (!toastContainer) return;
    var toast = document.createElement('div');
    toast.className = 'toast ' + (type || 'info');
    toast.setAttribute('role', type === 'error' ? 'alert' : 'status');
    toast.textContent = message;
    toastContainer.appendChild(toast);
    window.requestAnimationFrame(function () { toast.classList.add('show'); });
    window.setTimeout(function () {
      toast.classList.remove('show');
      window.setTimeout(function () { toast.remove(); }, 450);
    }, 2600);
  }

  document.addEventListener('click', function (event) {
    var tool = event.target.closest && event.target.closest('.tool-tab[data-tab]');
    if (!tool) return;
    var item = { id: tool.dataset.tab, label: tool.textContent.trim(), category: tool.dataset.category || '' };
    var recents = validItems(load(RECENTS_KEY)).filter(function (saved) { return saved.id !== item.id; });
    recents.unshift(item);
    save(RECENTS_KEY, recents.slice(0, 5));
    window.setTimeout(render, 0);
  });

  document.addEventListener('melotools:toolchange', render);

  favoriteButton.addEventListener('click', function () {
    var active = currentTool();
    if (!active) return;
    var favorites = validItems(load(FAVORITES_KEY));
    var index = favorites.findIndex(function (item) { return item.id === active.id; });
    if (index >= 0) {
      favorites.splice(index, 1);
      showToast('Removida dos favoritos.', 'info');
    } else {
      favorites.unshift(active);
      showToast('Ferramenta salva nos favoritos.', 'success');
    }
    save(FAVORITES_KEY, favorites.slice(0, 8));
    render();
  });

  shareButton.addEventListener('click', async function () {
    var active = currentTool();
    if (!active) return;
    try {
      await copyText(toolUrl(active.id));
      shareButton.textContent = 'Link copiado ✓';
      showToast('Link direto copiado.', 'success');
      window.setTimeout(function () { shareButton.textContent = 'Copiar link'; }, 2200);
    } catch (_error) {
      showToast('Não foi possível copiar o link.', 'error');
    }
  });

  render();
})();
