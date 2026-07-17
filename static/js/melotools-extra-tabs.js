(function(){
  function ready(fn){
    if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn);
    else fn();
  }

  function setupTabs(){
    var mainTabs = Array.prototype.slice.call(document.querySelectorAll('.main-tab'));
    var toolTabs = Array.prototype.slice.call(document.querySelectorAll('.tool-tab'));
    var sections = Array.prototype.slice.call(document.querySelectorAll('.section'));
    var searchWrap = byId('toolSearchWrap');
    var searchToggle = byId('toolSearchToggle');
    var searchInput = byId('toolSearchInput');
    var searchClear = byId('toolSearchClear');
    var searchMeta = byId('toolSearchMeta');
    var launcher = byId('toolLauncher');
    var launcherTitle = byId('toolLauncherTitle');
    var launcherResults = byId('toolSearchResults');
    var searchShortcut = byId('toolSearchShortcut');
    var searchQuery = '';
    var launcherItems = [];
    var highlightedIndex = -1;
    var categoryClasses = mainTabs.map(function(tab){ return 'mt-category-' + tab.dataset.category; });
    var toolAliases = {
      'tab-youtube': 'baixar download youtube audio mp3 link online',
      'tab-youtube-clip': 'recortar trecho baixar download youtube clipe',
      'tab-instagram-tools': 'baixar download instagram reels stories threads tiktok foto video',
      'tab-removebg': 'apagar tirar remover fundo background foto imagem transparente',
      'tab-compress': 'diminuir reduzir tamanho arquivo pdf leve',
      'tab-word2pdf': 'converter word doc docx documento pdf',
      'tab-img-compress': 'diminuir reduzir tamanho foto imagem leve',
      'tab-img-resize': 'mudar tamanho dimensao foto imagem',
      'tab-video-extract-audio': 'converter video mp3 extrair audio som',
      'tab-dev-password': 'criar gerar senha segura password',
      'tab-dev-json': 'validar organizar embelezar formatar json',
      'tab-links-qr-generate': 'criar gerar qr code qrcode link pix',
      'tab-links-qr-read': 'ler escanear abrir qr code qrcode',
      'tab-calc-percent': 'calcular desconto acrescimo porcentagem percentual'
    };

    function normalize(text){
      return String(text || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
    }

    function rawToolLabel(tab){
      return String(tab.textContent || tab.getAttribute('data-i18n') || tab.dataset.tab || '').trim();
    }

    function toolLabel(tab){
      return normalize(rawToolLabel(tab));
    }

    var categoryLabelMap = {};
    var categorySearchMap = {};
    function refreshCategoryLabels(){
      mainTabs.forEach(function(tab){
        var label = String(tab.textContent || tab.dataset.category || '').trim();
        categoryLabelMap[tab.dataset.category] = label;
        categorySearchMap[tab.dataset.category] = normalize(label);
      });
    }
    refreshCategoryLabels();

    function toolSearchScore(tab){
      var label = toolLabel(tab);
      var category = categorySearchMap[tab.dataset.category] || '';
      var aliases = normalize(toolAliases[tab.dataset.tab] || tab.getAttribute('data-search') || '');
      var haystack = label + ' ' + category + ' ' + aliases;
      var tokens = searchQuery.split(/\s+/).filter(Boolean);
      if(!tokens.every(function(token){ return haystack.indexOf(token) !== -1; })) return Infinity;
      if(label === searchQuery) return 0;
      if(label.indexOf(searchQuery) === 0) return 10 + label.length;
      if(label.indexOf(searchQuery) !== -1) return 30 + label.indexOf(searchQuery);
      if(aliases.indexOf(searchQuery) !== -1) return 60 + aliases.indexOf(searchQuery);
      if(category.indexOf(searchQuery) !== -1) return 90 + category.indexOf(searchQuery);
      return 120 + tokens.reduce(function(total, token){ return total + haystack.indexOf(token); }, 0);
    }

    function toolTabsFor(category){
      return toolTabs.filter(function(tab){
        return tab.dataset.category === category;
      });
    }

    function firstCategoryWithResults(){
      for(var i = 0; i < mainTabs.length; i += 1){
        var category = mainTabs[i].dataset.category;
        if(toolTabsFor(category).length) return category;
      }
      return null;
    }

    function centerActiveTab(tab){
      if(!tab || !tab.parentElement) return;
      var rail = tab.parentElement;
      if(rail.scrollWidth <= rail.clientWidth) return;
      var targetLeft = tab.offsetLeft - ((rail.clientWidth - tab.offsetWidth) / 2);
      var reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      window.requestAnimationFrame(function(){
        rail.scrollTo({ left: Math.max(0, targetLeft), behavior: reducedMotion ? 'auto' : 'smooth' });
      });
    }

    function setActiveShellState(category, tabId){
      if(!document.body) return;
      categoryClasses.forEach(function(name){ document.body.classList.remove(name); });
      if(category) document.body.classList.add('mt-category-' + category);
      document.body.classList.toggle('instagram-tools-active', tabId === 'tab-instagram-tools');
    }

    function activateTool(tabId){
      var target = toolTabs.find(function(tab){ return tab.dataset.tab === tabId; });
      if(!target) return;
      var category = target.dataset.category;
      toolTabs.forEach(function(tab){
        var active = tab === target;
        tab.classList.toggle('active', active);
        tab.setAttribute('aria-pressed', active ? 'true' : 'false');
      });
      sections.forEach(function(section){
        section.classList.toggle('show', section.id === tabId && section.dataset.category === category);
      });
      setActiveShellState(category, tabId);
      centerActiveTab(target);
      try { localStorage.setItem('melotools-active-tool', tabId); } catch(_e) {}
    }

    function applyToolVisibility(category){
      toolTabs.forEach(function(tab){
        var hidden = tab.dataset.category !== category;
        tab.classList.toggle('is-hidden', hidden);
      });
    }

    function activateCategory(category, preferredTool){
      var visible = toolTabsFor(category);
      if(!visible.length){
        var fallback = firstCategoryWithResults();
        if(!fallback) return;
        category = fallback;
        visible = toolTabsFor(category);
        if(!visible.length) return;
      }
      mainTabs.forEach(function(tab){
        var hasTools = toolTabsFor(tab.dataset.category).length > 0;
        tab.classList.toggle('is-hidden', !hasTools);
        var active = tab.dataset.category === category;
        tab.classList.toggle('active', active);
        tab.setAttribute('aria-pressed', active ? 'true' : 'false');
        if(active) centerActiveTab(tab);
      });
      applyToolVisibility(category);

      var saved = preferredTool;
      if(!saved){ try { saved = localStorage.getItem('melotools-active-tool'); } catch(_e) {} }
      var next = visible.find(function(tab){ return tab.dataset.tab === saved; }) || visible[0];
      try { localStorage.setItem('melotools-active-category', category); } catch(_e) {}
      if(next) activateTool(next.dataset.tab);
    }

    function readSavedTools(key){
      try {
        var value = JSON.parse(localStorage.getItem(key) || '[]');
        return Array.isArray(value) ? value : [];
      } catch(_e) {
        return [];
      }
    }

    function quickLauncherItems(){
      var items = [];
      var seen = {};
      function add(tabId, reason){
        if(!tabId || seen[tabId] || items.length >= 7) return;
        var tab = toolTabs.find(function(candidate){ return candidate.dataset.tab === tabId; });
        if(!tab) return;
        seen[tabId] = true;
        items.push({ tab: tab, reason: reason });
      }
      readSavedTools('melotools-favorite-tools-v1').slice(0, 3).forEach(function(item){ add(item.id, 'Favorito'); });
      readSavedTools('melotools-recent-tools-v1').slice(0, 3).forEach(function(item){ add(item.id, 'Recente'); });
      var activeCategory = mainTabs.find(function(tab){ return tab.classList.contains('active'); });
      if(activeCategory){
        toolTabsFor(activeCategory.dataset.category).slice(0, 4).forEach(function(tab){ add(tab.dataset.tab, 'Nesta categoria'); });
      }
      ['tab-compress', 'tab-removebg', 'tab-dev-json', 'tab-links-qr-generate'].forEach(function(tabId){ add(tabId, 'Sugestão'); });
      return items;
    }

    function matchingLauncherItems(){
      return toolTabs.map(function(tab){ return { tab: tab, score: toolSearchScore(tab), reason: '' }; })
        .filter(function(item){ return item.score !== Infinity; })
        .sort(function(a, b){
          if(a.score !== b.score) return a.score - b.score;
          return rawToolLabel(a.tab).localeCompare(rawToolLabel(b.tab), 'pt-BR');
        });
    }

    function setHighlightedResult(index){
      var options = launcherResults ? Array.prototype.slice.call(launcherResults.querySelectorAll('[role="option"]')) : [];
      if(!options.length){
        highlightedIndex = -1;
        if(searchInput) searchInput.removeAttribute('aria-activedescendant');
        return;
      }
      highlightedIndex = Math.max(0, Math.min(index, options.length - 1));
      options.forEach(function(option, optionIndex){
        var selected = optionIndex === highlightedIndex;
        option.classList.toggle('is-highlighted', selected);
        option.setAttribute('aria-selected', selected ? 'true' : 'false');
      });
      if(searchInput) searchInput.setAttribute('aria-activedescendant', options[highlightedIndex].id);
      options[highlightedIndex].scrollIntoView({ block: 'nearest' });
    }

    function renderLauncher(){
      if(!launcherResults) return;
      var allMatches = searchQuery ? matchingLauncherItems() : quickLauncherItems();
      launcherItems = allMatches.slice(0, 7);
      launcherResults.replaceChildren();
      if(launcherTitle){
        launcherTitle.textContent = searchQuery
          ? 'Melhores resultados'
          : (readSavedTools('melotools-recent-tools-v1').length ? 'Continue de onde parou' : 'Comece por aqui');
      }
      if(searchMeta){
        var count = allMatches.length;
        searchMeta.textContent = searchQuery
          ? (count === 0 ? 'Nenhum resultado' : count + (count === 1 ? ' resultado' : ' resultados'))
          : 'Acesso rápido';
      }
      launcherItems.forEach(function(item, index){
        var tab = item.tab;
        var option = document.createElement('div');
        var badge = document.createElement('span');
        var copy = document.createElement('span');
        var label = document.createElement('strong');
        var detail = document.createElement('small');
        var action = document.createElement('span');
        var categoryLabel = categoryLabelMap[tab.dataset.category] || tab.dataset.category;
        option.id = 'tool-search-option-' + index;
        option.className = 'tool-launcher-option';
        option.setAttribute('role', 'option');
        option.setAttribute('aria-selected', 'false');
        option.setAttribute('data-result-index', String(index));
        option.setAttribute('data-category', tab.dataset.category || '');
        option.setAttribute('aria-label', rawToolLabel(tab) + ', ' + categoryLabel + (item.reason ? ', ' + item.reason : ''));
        badge.className = 'tool-launcher-badge';
        badge.setAttribute('aria-hidden', 'true');
        badge.textContent = ({media:'SOC', image:'IMG', pdf:'PDF', video:'VID', text:'TXT', dev:'DEV', random:'RNG', calc:'123', wellness:'VIDA', clock:'TIME', links:'QR'})[tab.dataset.category] || 'MT';
        copy.className = 'tool-launcher-copy';
        label.textContent = rawToolLabel(tab);
        detail.textContent = (item.reason ? item.reason + ' · ' : '') + categoryLabel;
        action.className = 'tool-launcher-action';
        action.setAttribute('aria-hidden', 'true');
        action.textContent = 'Abrir ↵';
        copy.appendChild(label);
        copy.appendChild(detail);
        option.appendChild(badge);
        option.appendChild(copy);
        option.appendChild(action);
        launcherResults.appendChild(option);
      });
      if(!launcherItems.length){
        var empty = document.createElement('div');
        empty.className = 'tool-launcher-empty';
        empty.setAttribute('role', 'presentation');
        empty.innerHTML = '<strong>Nada por aqui ainda.</strong><span>Tente descrever a tarefa de outro jeito.</span>';
        launcherResults.appendChild(empty);
      }
      setHighlightedResult(launcherItems.length ? 0 : -1);
    }

    function openLauncher(){
      if(!launcher || !searchInput) return;
      launcher.hidden = false;
      if(searchWrap) searchWrap.classList.add('is-open');
      searchInput.setAttribute('aria-expanded', 'true');
      renderLauncher();
    }

    function closeLauncher(clearQuery){
      if(!launcher || !searchInput) return;
      launcher.hidden = true;
      if(searchWrap) searchWrap.classList.remove('is-open');
      searchInput.setAttribute('aria-expanded', 'false');
      searchInput.removeAttribute('aria-activedescendant');
      highlightedIndex = -1;
      if(clearQuery){
        searchInput.value = '';
        searchQuery = '';
        if(searchClear) searchClear.hidden = true;
        if(searchWrap) searchWrap.classList.remove('has-query');
      }
    }

    function selectLauncherResult(index){
      var item = launcherItems[index];
      if(!item || !item.tab) return;
      item.tab.click();
      closeLauncher(true);
      searchInput.focus();
    }

    function refreshSearch(){
      searchQuery = normalize(searchInput ? searchInput.value : '');
      if(searchClear) searchClear.hidden = !searchQuery;
      if(searchWrap) searchWrap.classList.toggle('has-query', !!searchQuery);
      openLauncher();
    }

    mainTabs.forEach(function(tab){ tab.addEventListener('click', function(){ activateCategory(tab.dataset.category); closeLauncher(true); }); });
    toolTabs.forEach(function(tab){ tab.addEventListener('click', function(){ activateCategory(tab.dataset.category, tab.dataset.tab); }); });

    if(searchToggle){
      searchToggle.addEventListener('click', function(){
        if(searchInput){ searchInput.focus(); openLauncher(); }
      });
    }

    if(searchInput){
      searchInput.addEventListener('input', refreshSearch);
      searchInput.addEventListener('search', refreshSearch);
      searchInput.addEventListener('focus', openLauncher);
      searchInput.addEventListener('click', function(){
        if(launcher.hidden) openLauncher();
      });
      searchInput.addEventListener('keydown', function(event){
        if(event.key === 'ArrowDown'){
          event.preventDefault();
          if(launcher.hidden) openLauncher();
          else setHighlightedResult(highlightedIndex + 1);
        } else if(event.key === 'ArrowUp'){
          event.preventDefault();
          if(launcher.hidden) openLauncher();
          else setHighlightedResult(highlightedIndex - 1);
        } else if(event.key === 'Enter' && !launcher.hidden && highlightedIndex >= 0){
          event.preventDefault();
          selectLauncherResult(highlightedIndex);
        } else if(event.key === 'Escape' && !launcher.hidden){
          event.preventDefault();
          closeLauncher(true);
        }
      });
    }
    if(searchClear){
      searchClear.addEventListener('click', function(){
        if(searchInput) searchInput.value = '';
        searchQuery = '';
        if(searchClear) searchClear.hidden = true;
        if(searchWrap) searchWrap.classList.remove('has-query');
        openLauncher();
        if(searchInput) searchInput.focus();
      });
    }
    if(launcherResults){
      launcherResults.addEventListener('mousemove', function(event){
        var option = event.target.closest && event.target.closest('[data-result-index]');
        if(option) setHighlightedResult(Number(option.dataset.resultIndex));
      });
      launcherResults.addEventListener('mousedown', function(event){
        var option = event.target.closest && event.target.closest('[data-result-index]');
        if(!option) return;
        event.preventDefault();
        selectLauncherResult(Number(option.dataset.resultIndex));
      });
    }
    document.addEventListener('mousedown', function(event){
      if(searchWrap && !searchWrap.contains(event.target)) closeLauncher(false);
    });
    document.addEventListener('click', function(event){
      if(!event.target.closest || !event.target.closest('[data-lang-option]')) return;
      window.setTimeout(function(){
        refreshCategoryLabels();
        if(launcher && !launcher.hidden) renderLauncher();
      }, 0);
    });
    document.addEventListener('keydown', function(event){
      var key = String(event.key || '').toLowerCase();
      var editable = event.target && (event.target.matches('input, textarea, select') || event.target.isContentEditable);
      if((event.ctrlKey || event.metaKey) && key === 'k'){
        event.preventDefault();
        searchInput.focus();
        openLauncher();
      } else if(key === '/' && !editable && !event.ctrlKey && !event.metaKey && !event.altKey){
        event.preventDefault();
        searchInput.focus();
        openLauncher();
      }
    });
    if(searchShortcut && /mac|iphone|ipad|ipod/i.test(navigator.userAgent || '')){
      var shortcutKeys = searchShortcut.querySelectorAll('kbd');
      if(shortcutKeys[0]) shortcutKeys[0].textContent = '⌘';
    }

    var initial = 'media';
    try { initial = localStorage.getItem('melotools-active-category') || 'media'; } catch(_e) {}
    if(!toolTabsFor(initial).length) initial = firstCategoryWithResults() || 'media';
    activateCategory(initial);
    document.body.classList.remove('mt-ui-loading');
    document.body.classList.add('mt-ui-ready');
  }


  async function postForm(url, formData){
    var res = await fetch(url, { method:'POST', body: formData });
    var data = {};
    try { data = await res.json(); } catch(_e) {}
    if(!res.ok || data.ok === false) throw new Error(data.message || 'Erro ao processar.');
    return data;
  }


  function wait(ms){
    return new Promise(function(resolve){ setTimeout(resolve, ms); });
  }

  async function getJson(url){
    var res = await fetch(url, { cache: 'no-store' });
    var data = {};
    try { data = await res.json(); } catch(_e) {}
    if(!res.ok || data.ok === false) throw new Error(data.message || 'Erro ao processar.');
    return data;
  }

  function rememberDownloadJob(jobId){
    try { localStorage.setItem('melotools-active-download-job', JSON.stringify({ job_id: jobId, created_at: Date.now() })); } catch(_e) {}
  }

  function forgetDownloadJob(){
    try { localStorage.removeItem('melotools-active-download-job'); } catch(_e) {}
  }

  function savedDownloadJob(){
    try {
      var raw = localStorage.getItem('melotools-active-download-job');
      if(!raw) return null;
      var data = JSON.parse(raw);
      if(!data || !data.job_id || Date.now() - (data.created_at || 0) > 7200000){
        forgetDownloadJob();
        return null;
      }
      return data.job_id;
    } catch(_e) { return null; }
  }

  async function pollJob(jobId, statusEl, label){
    var startedAt = Date.now();
    while(Date.now() - startedAt < 7200000){
      await wait(1000);
      var data = await getJson('/api/jobs/' + encodeURIComponent(jobId));
      if(data.status === 'done'){
        forgetDownloadJob();
        return data;
      }
      if(data.status === 'failed'){
        forgetDownloadJob();
        throw new Error(data.message || 'Não foi possível concluir este processamento.');
      }
      if(statusEl) statusEl.textContent = label || data.message || 'Processando...';
    }
    throw new Error('O processamento está demorando mais que o esperado. Tente novamente em alguns minutos.');
  }

  async function postJob(url, formData, statusEl, label){
    var started = await postForm(url, formData);
    if(!started.job_id) return started;
    rememberDownloadJob(started.job_id);
    return pollJob(started.job_id, statusEl, label);
  }

  function byId(id){ return document.getElementById(id); }
  function resultShouldEmphasize(el){
    if(!el || !el.id) return false;
    if(el.id === 'out_calc_timer' || el.id === 'out_calc_sw') return false;
    return /^(out_calc_|out_rnd_|out_dev_pass|out_dev_port|out_dev_uuid)/.test(el.id);
  }
  function resultIsLong(text){
    return String(text || '').length > 140 || String(text || '').indexOf('\n') !== -1;
  }
  function renderResultText(el, msg){
    if(!el) return;
    var text = String(msg || '');
    el.classList.remove('mt-result-emphasis', 'mt-result-long');
    if(text.trim()) el.classList.remove('hidden');
    if(resultIsLong(text)) el.classList.add('mt-result-long');
    if(resultShouldEmphasize(el) && !resultIsLong(text)){
      var idx = text.indexOf(':');
      el.classList.add('mt-result-emphasis');
      el.textContent = '';
      if(idx > 0){
        var label = document.createElement('span');
        label.className = 'mt-result-label';
        label.textContent = text.slice(0, idx + 1);
        var value = document.createElement('span');
        value.className = 'mt-result-value';
        value.textContent = text.slice(idx + 1).trim() || text;
        el.appendChild(label);
        el.appendChild(value);
      } else {
        var single = document.createElement('span');
        single.className = 'mt-result-value';
        single.textContent = text;
        el.appendChild(single);
      }
      return;
    }
    el.textContent = text;
  }
  function set(id,msg){ renderResultText(byId(id), msg); }
  function val(id){ var el = byId(id); return el ? el.value : ''; }
  function lines(v){ return (v || '').split(/\r?\n/).map(function(s){ return s.trim(); }).filter(Boolean); }

  function splitRawLines(text){ return String(text || '').split(/\r?\n/); }
  function base64EncodeUnicode(text){
    var bytes = new TextEncoder().encode(String(text || ''));
    var binary = '';
    bytes.forEach(function(b){ binary += String.fromCharCode(b); });
    return btoa(binary);
  }
  function base64DecodeUnicode(text){
    var clean = String(text || '').trim().replace(/\s+/g, '');
    var binary = atob(clean);
    var bytes = new Uint8Array(binary.length);
    for(var i = 0; i < binary.length; i += 1){ bytes[i] = binary.charCodeAt(i); }
    return new TextDecoder().decode(bytes);
  }
  function base64UrlDecodeUnicode(text){
    var clean = String(text || '').trim().replace(/-/g, '+').replace(/_/g, '/');
    clean += '='.repeat((4 - (clean.length % 4)) % 4);
    return base64DecodeUnicode(clean);
  }
  function makeUuidV4(){
    if(window.crypto && typeof window.crypto.randomUUID === 'function') return window.crypto.randomUUID();
    var bytes = new Uint8Array(16);
    if(window.crypto && typeof window.crypto.getRandomValues === 'function'){
      window.crypto.getRandomValues(bytes);
    } else {
      for(var i = 0; i < bytes.length; i += 1){ bytes[i] = Math.floor(Math.random() * 256); }
    }
    bytes[6] = (bytes[6] & 0x0f) | 0x40;
    bytes[8] = (bytes[8] & 0x3f) | 0x80;
    var hex = Array.from(bytes, function(b){ return b.toString(16).padStart(2, '0'); }).join('');
    return hex.slice(0,8) + '-' + hex.slice(8,12) + '-' + hex.slice(12,16) + '-' + hex.slice(16,20) + '-' + hex.slice(20);
  }
  function runRegexSearch(pattern, flags, text){
    if(!pattern) return 'Informe uma expressão regular para testar.';
    var safeFlags = String(flags || 'gi').replace(/[^dgimsuvy]/g, '');
    if(safeFlags.indexOf('g') === -1) safeFlags += 'g';
    var rx = new RegExp(pattern, safeFlags);
    var matches = [];
    var match;
    var guard = 0;
    while((match = rx.exec(text)) !== null && guard < 200){
      matches.push((matches.length + 1) + '. índice ' + match.index + ': "' + (match[0] || '(vazio)') + '"');
      if(match[0] === '') rx.lastIndex += 1;
      guard += 1;
    }
    if(!matches.length) return 'Nenhuma ocorrencia encontrada.';
    var suffix = guard >= 200 ? '\n\nResultado limitado a 200 ocorrências.' : '';
    return 'Ocorrências encontradas: ' + matches.length + '\n' + matches.join('\n') + suffix;
  }
  function buildLineDiff(leftText, rightText){
    var left = splitRawLines(leftText);
    var right = splitRawLines(rightText);
    if(left.join('\n') === right.join('\n')) return 'Os textos são iguais.';
    if(left.length * right.length > 40000) return 'Os textos são grandes demais para comparar no navegador. Tente trechos menores.';
    var dp = Array(left.length + 1);
    for(var i = 0; i <= left.length; i += 1){ dp[i] = Array(right.length + 1).fill(0); }
    for(i = left.length - 1; i >= 0; i -= 1){
      for(var j = right.length - 1; j >= 0; j -= 1){
        dp[i][j] = left[i] === right[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
      }
    }
    var out = [];
    i = 0; j = 0;
    while(i < left.length && j < right.length){
      if(left[i] === right[j]){ out.push('  ' + (left[i] || '(linha vazia)')); i += 1; j += 1; }
      else if(dp[i + 1][j] >= dp[i][j + 1]){ out.push('- ' + (left[i] || '(linha vazia)')); i += 1; }
      else { out.push('+ ' + (right[j] || '(linha vazia)')); j += 1; }
    }
    while(i < left.length){ out.push('- ' + (left[i] || '(linha vazia)')); i += 1; }
    while(j < right.length){ out.push('+ ' + (right[j] || '(linha vazia)')); j += 1; }
    return out.slice(0, 300).join('\n') + (out.length > 300 ? '\n\nResultado limitado a 300 linhas.' : '');
  }
  function formatTimestampResult(date){
    if(!(date instanceof Date) || isNaN(date.getTime())) return 'Data invalida. Revise o valor informado.';
    return [
      'Data local: ' + date.toLocaleString('pt-BR'),
      'Data ISO: ' + date.toISOString(),
      'Unix em segundos: ' + Math.floor(date.getTime() / 1000),
      'Unix em milissegundos: ' + date.getTime()
    ].join('\n');
  }

function on(id, fn){ var el = byId(id); if(el) el.addEventListener('click', fn); }
function guessPreviewType(path){
  var value = String(path || '').toLowerCase();
  if(/\.(png|jpe?g|gif|webp|bmp|svg|ico)(\?|$)/.test(value)) return 'image';
  if(/\.(mp4|webm|mov|m4v|ogg)(\?|$)/.test(value)) return 'video';
  if(/\.(mp3|wav|m4a|aac|oga|ogg)(\?|$)/.test(value)) return 'audio';
  if(/\.(pdf)(\?|$)/.test(value)) return 'pdf';
  return '';
}
function previewHref(url){ return String(url || '').replace('/results/', '/preview/'); }
function renderPreview(target, url, filename){
  if(!target || !url) return;
  var kind = guessPreviewType(filename || url);
  if(!kind) return;
  var src = previewHref(url);
  var wrap = document.createElement('div');
  wrap.className = 'mt-result-preview';
  if(kind === 'image'){
    var img = document.createElement('img');
    img.src = src;
    img.alt = filename || 'Pre-visualizacao';
    wrap.appendChild(img);
  } else if(kind === 'pdf'){
    var frame = document.createElement('iframe');
    frame.src = src + '#toolbar=0&navpanes=0&scrollbar=1';
    frame.loading = 'lazy';
    wrap.appendChild(frame);
  } else if(kind === 'video'){
    var video = document.createElement('video');
    video.src = src;
    video.controls = true;
    video.preload = 'metadata';
    wrap.appendChild(video);
  } else if(kind === 'audio'){
    var audio = document.createElement('audio');
    audio.src = src;
    audio.controls = true;
    audio.preload = 'metadata';
    wrap.appendChild(audio);
  }
  target.appendChild(wrap);
}
function renderFormattedResult(out, formatted){
  if(!out) return;
  if((formatted && (formatted.text || formatted.url)) || out.textContent) out.classList.remove('hidden');
  renderResultText(out, formatted.text || '');
  if(formatted.url){
    renderPreview(out, formatted.url, formatted.filename);
    var actions = document.createElement('div');
    actions.className = 'mt-result-actions';
    var a = document.createElement('a');
    a.href = formatted.url;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.className = 'btn alt';
    a.textContent = 'Abrir ou baixar arquivo';
    actions.appendChild(a);
    out.appendChild(actions);
  }
}

  function fileArray(fileList){
    return Array.prototype.slice.call(fileList || []).filter(function(file){ return file && file.name; });
  }

  function fileLabel(files){
    files = fileArray(files);
    if(!files.length) return 'Nenhum arquivo selecionado.';
    if(files.length === 1) return 'Arquivo selecionado: ' + files[0].name;
    return files.length + ' arquivos selecionados: ' + files.slice(0, 4).map(function(file){ return file.name; }).join(', ') + (files.length > 4 ? '...' : '');
  }

  function ensureFileSummary(drop){
    if(!drop) return null;
    var summary = drop.querySelector('.mt-file-summary');
    if(!summary){
      summary = document.createElement('div');
      summary.className = 'mt-file-summary';
      summary.setAttribute('aria-live', 'polite');
      drop.appendChild(summary);
    }
    return summary;
  }

  function syncFileSummary(input, drop){
    var summary = ensureFileSummary(drop || (input && input.closest('.drop')));
    if(summary) summary.textContent = fileLabel(input ? input.files : []);
  }

  function setInputFiles(input, files){
    if(!input || !files || !files.length) return false;
    var list = fileArray(files);
    if(!input.multiple) list = list.slice(0, 1);
    if(!list.length) return false;
    var dt = new DataTransfer();
    list.forEach(function(file){ dt.items.add(file); });
    input.files = dt.files;
    input.dispatchEvent(new Event('change', { bubbles: true }));
    return true;
  }

  function clipboardFiles(ev){
    var data = ev && ev.clipboardData;
    if(!data) return [];
    var files = fileArray(data.files);
    if(files.length) return files;
    return Array.prototype.slice.call(data.items || []).filter(function(item){
      return item.kind === 'file';
    }).map(function(item){ return item.getAsFile(); }).filter(Boolean);
  }

  function isInteractiveTarget(target){
    return !!(target && target.closest && target.closest('button, a, input, select, textarea, label, summary'));
  }

  function filePromptText(input){
    return input && input.multiple ? 'Selecione arquivos, arraste para esta area ou cole aqui' : 'Selecione arquivo, arraste para esta area ou cole aqui';
  }

  function ensureFilePicker(drop, input){
    if(!drop || !input) return;
    input.classList.add('mt-native-file-input');
    var field = input.closest('.mt-field');
    if(field) field.classList.add('mt-file-field');

    var existing = drop.querySelector('button[id^="choose"]');
    if(existing){
      existing.classList.add('mt-file-picker-button');
      return;
    }
    if(field && field.querySelector('.mt-file-picker')) return;

    var picker = document.createElement('div');
    picker.className = 'mt-file-picker';
    picker.innerHTML = '<span class="mt-file-picker-icon" aria-hidden="true"><svg viewBox="0 0 24 24" focusable="false"><path d="M6 2h8l5 5v15H6V2Zm7 1.75V8h4.25L13 3.75ZM8 12h8v2H8v-2Zm0 4h8v2H8v-2Z"/></svg></span>';
    var button = document.createElement('button');
    button.type = 'button';
    button.className = 'btn mt-file-picker-button';
    button.textContent = filePromptText(input);
    button.addEventListener('click', function(ev){
      ev.preventDefault();
      input.click();
    });
    picker.appendChild(button);
    input.insertAdjacentElement('afterend', picker);
  }

  function bindDropToFileInput(drop, input){
    if(!drop || !input || drop.dataset.mtFileDropBound === '1') return;
    drop.dataset.mtFileDropBound = '1';
    drop.classList.add('mt-file-drop-ready');
    if(!drop.hasAttribute('tabindex')) drop.setAttribute('tabindex', '0');
    ensureFilePicker(drop, input);
    syncFileSummary(input, drop);

    drop.addEventListener('click', function(ev){
      if(isInteractiveTarget(ev.target) && ev.target !== drop) return;
      input.click();
    });
    drop.addEventListener('keydown', function(ev){
      if(ev.key === 'Enter' || ev.key === ' '){
        ev.preventDefault();
        input.click();
      }
    });
    input.addEventListener('change', function(){ syncFileSummary(input, drop); });

    ['dragenter', 'dragover'].forEach(function(type){
      drop.addEventListener(type, function(ev){
        if(!ev.dataTransfer) return;
        ev.preventDefault();
        drop.classList.add('dragover', 'mt-file-dragover');
      });
    });
    ['dragleave', 'dragend'].forEach(function(type){
      drop.addEventListener(type, function(){ drop.classList.remove('dragover', 'mt-file-dragover'); });
    });
    drop.addEventListener('drop', function(ev){
      ev.preventDefault();
      drop.classList.remove('dragover', 'mt-file-dragover');
      var files = ev.dataTransfer ? fileArray(ev.dataTransfer.files) : [];
      if(setInputFiles(input, files)) drop.focus();
    });
    drop.addEventListener('paste', function(ev){
      var files = clipboardFiles(ev);
      if(!files.length) return;
      ev.preventDefault();
      setInputFiles(input, files);
    });
  }

  function bindFileDropZones(){
    document.querySelectorAll('.drop').forEach(function(drop){
      var input = drop.querySelector('input[type="file"]');
      if(input) bindDropToFileInput(drop, input);
    });
    document.addEventListener('paste', function(ev){
      var files = clipboardFiles(ev);
      if(!files.length) return;
      var focusedDrop = document.activeElement && document.activeElement.closest ? document.activeElement.closest('.drop') : null;
      var drop = focusedDrop || document.querySelector('.section.show .drop');
      if(!drop) return;
      var input = drop.querySelector('input[type="file"]');
      if(!input) return;
      ev.preventDefault();
      setInputFiles(input, files);
      drop.focus();
    });
  }

  function clearNode(node){
    if(node){
      node.classList.remove('hidden');
      node.innerHTML = '';
    }
  }

  function setNodeText(node, text, className){
    if(!node) return;
    node.classList.remove('hidden');
    if(className) node.className = className;
    renderResultText(node, text);
  }

  function appendDownloadCard(target, formatted, index){
    if(!target) return;
    var card = document.createElement('div');
    card.className = 'mt-file-result-card';
    var label = document.createElement('strong');
    label.textContent = formatted.filename || ('Resultado ' + index);
    card.appendChild(label);
    if(formatted.url){
      var a = document.createElement('a');
      a.href = formatted.url;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.className = 'btn alt';
      a.textContent = 'Abrir ou baixar';
      card.appendChild(a);
    } else if(formatted.text){
      var msg = document.createElement('span');
      msg.textContent = formatted.text;
      card.appendChild(msg);
    }
    target.appendChild(card);
  }

  function appendBatchActions(target){
    if(!target) return;
    var links = Array.prototype.slice.call(target.querySelectorAll('a[href]'));
    if(links.length <= 1) return;
    var actions = document.createElement('div');
    actions.className = 'mt-result-actions';
    var all = document.createElement('button');
    all.type = 'button';
    all.className = 'btn';
    all.textContent = 'Abrir todos';
    all.addEventListener('click', function(){
      links.forEach(function(link){ window.open(link.href, '_blank', 'noopener'); });
    });
    actions.appendChild(all);
    target.appendChild(actions);
  }

  async function submitLegacyFileTool(config){
    var input = byId(config.input);
    var status = byId(config.status);
    var output = byId(config.output);
    var err = byId(config.error);
    var files = fileArray(input ? input.files : []);
    if(!files.length){
      setNodeText(err || status || output, 'Selecione, arraste ou cole um arquivo para continuar.', 'errmsg');
      return;
    }
    if(err){ err.textContent = ''; err.classList.add('hidden'); }
    if(status) status.textContent = 'Processando...';
    clearNode(output);
    try{
      if(config.batch){
        var fd = new FormData();
        files.forEach(function(file){ fd.append(config.field || 'files', file, file.name); });
        if(config.extra) config.extra(fd);
        var data = await postForm(config.endpoint, fd);
        renderFormattedResult(output, formatResponse(data));
      } else {
        output.classList.add('mt-output-zone');
        for(var i = 0; i < files.length; i += 1){
          if(status) status.textContent = 'Processando ' + (i + 1) + ' de ' + files.length + '...';
          var single = new FormData();
          single.append(config.field || 'file', files[i], files[i].name);
          if(config.extra) config.extra(single);
          var item = await postForm(config.endpoint, single);
          appendDownloadCard(output, formatResponse(item), i + 1);
        }
        appendBatchActions(output);
      }
      if(status) status.textContent = files.length > 1 ? 'Arquivos prontos.' : 'Arquivo pronto.';
    } catch(error){
      var message = error && error.message ? error.message : 'Erro ao processar.';
      if(err) setNodeText(err, message, 'errmsg');
      else setNodeText(output || status, message, 'note mt-extra-result');
      if(status) status.textContent = '';
    }
  }

  function bindLegacyFileTools(){
    var configs = [
      { input: 'file', output: 'list', error: 'ocrErr', endpoint: '/api/documents/ocr-pdf', auto: true },
      { input: 'filesMerge', run: 'runMerge', output: 'mergeResult', status: 'mergeStatus', error: 'mergeErr', endpoint: '/api/documents/organize-pdf', field: 'files', batch: true },
      { input: 'filesRotate', run: 'runRotate', output: 'rotateOut', status: 'rotateStatus', error: 'rotateErr', endpoint: '/api/documents/rotate-pdf' },
      { input: 'fileSplit', run: 'runSplit', output: 'splitList', status: 'splitStatus', error: 'splitErr', endpoint: '/api/documents/split-pdf', extra: function(fd){
        var every = val('every') || '1';
        fd.append('pages_per_file', every);
      } },
      { input: 'filesCompress', run: 'runCompress', output: 'compressList', status: 'compressStatus', error: 'compressErr', endpoint: '/api/documents/compress-pdf' },
      { input: 'filesWord2Pdf', run: 'runWord2Pdf', output: 'word2pdfList', status: 'word2pdfStatus', error: 'word2pdfErr', endpoint: '/api/documents/word-to-pdf' },
      { input: 'filesProtect', run: 'runProtect', output: 'protectList', status: 'protectStatus', error: 'protectErr', endpoint: '/api/documents/protect-pdf', extra: function(fd){
        var p1 = val('protectPassword');
        var p2 = val('protectPassword2');
        if(p1 && p2 && p1 !== p2) throw new Error('As senhas nao conferem.');
        fd.append('password', p1);
      } },
      { input: 'filesPdf2Png', run: 'runPdf2Png', output: 'pdf2pngList', status: 'pdf2pngStatus', error: 'pdf2pngErr', endpoint: '/api/documents/pdf-to-image' },
      { input: 'filesRemoveBg', run: 'runRemoveBg', output: 'removeBgList', status: 'removeBgStatus', error: 'removeBgErr', endpoint: '/api/image/remove-bg', extra: function(fd){
        fd.append('strength', val('removeBgStrength') || '50');
      } },
      { input: 'fileVideo', run: 'runVideo', output: 'videoList', status: 'videoStatus', error: 'videoErr', endpoint: '/api/videos/split', extra: function(fd){
        fd.append('size_mb', val('sizeMb') || '100');
      } }
    ];
    configs.forEach(function(config){
      var input = byId(config.input);
      if(!input || input.dataset.mtLegacyBound === '1') return;
      input.dataset.mtLegacyBound = '1';
      var run = function(ev){
        if(ev) ev.preventDefault();
        submitLegacyFileTool(config);
      };
      if(config.auto) input.addEventListener('change', run);
      if(config.run) on(config.run, run);
      var choose = input.closest('.drop') ? input.closest('.drop').querySelector('button[type="button"]') : null;
      if(choose && !choose.dataset.mtChooseBound){
        choose.dataset.mtChooseBound = '1';
        choose.addEventListener('click', function(ev){ ev.preventDefault(); input.click(); });
      }
    });
  }

  function formatResponse(data){
    if(data.url){
      return { text: 'Concluído com sucesso. Arquivo: ' + (data.filename || 'resultado'), url: data.url, filename: data.filename || 'resultado' };
    }
    if(data.values){
      return { text: data.values.join('\n') };
    }
    return { text: data.result || data.message || 'Concluído.' };
  }

  async function runAction(url, payload, outputId){
    set(outputId, 'Processando...');
    try {
      var data = await postForm(url, payload);
      var formatted = formatResponse(data);
      var out = byId(outputId);
      if(!out) return;
      renderFormattedResult(out, formatted);
    } catch(err) {
      set(outputId, err.message || 'Erro ao processar.');
    }
  }

  function bindExtraForms(){
    document.querySelectorAll('.mt-extra-form').forEach(function(form){
      form.addEventListener('submit', async function(ev){
        ev.preventDefault();
        var result = form.closest('.section').querySelector('.mt-extra-result');
        result.textContent = 'Processando...';
        try {
          var data = await postForm(form.dataset.endpoint, new FormData(form));
          var formatted = formatResponse(data);
          renderFormattedResult(result, formatted);
        } catch(err) {
          result.textContent = err.message || 'Erro ao processar.';
        }
      });
    });
  }

  function bindRangeOutputs(){
    document.querySelectorAll('input[type="range"][data-output]').forEach(function(input){
      var out = byId(input.dataset.output);
      var sync = function(){ if(out) out.textContent = input.value; };
      input.addEventListener('input', sync);
      sync();
    });
  }


function bindQaFieldHints(){
  var hints = {
    youtubeUrl: { label: 'Link do vídeo online', help: 'Cole aqui o link do YouTube, TikTok ou outra plataforma suportada.', wide: true },
    youtubeClipUrl: { label: 'Link do vídeo para clipar', help: 'Cole o link e depois defina início e fim do trecho.', wide: true },
    protectPassword: { label: 'Senha do PDF', help: 'Use pelo menos 4 caracteres para proteger os arquivos.' },
    protectPassword2: { label: 'Repita a senha', help: 'Digite exatamente a mesma senha para confirmar.' },
    compressQuality: { label: 'Nível de compressão', help: 'Escolha entre máxima, alta, média ou baixa, conforme o resultado esperado.' },
    dev_cidr: { label: 'IP ou bloco CIDR', help: 'Ex.: 192.168.1.10/24', wide: true },
    dev_dns_host: { label: 'Domínio para consulta DNS', help: 'Ex.: exemplo.com', wide: true },
    dev_whois: { label: 'Domínio para consulta Whois', help: 'Ex.: exemplo.com', wide: true },
    txt_chars: { label: 'Texto para contar caracteres', help: 'Cole ou digite o conteúdo que será analisado.', wide: true },
    txt_words: { label: 'Texto para contar palavras', help: 'Cole ou digite o conteúdo que será analisado.', wide: true },
    txt_trimlines: { label: 'Texto com quebras de linha', help: 'O sistema vai juntar o conteúdo em uma linha contínua.', wide: true },
    txt_trimspaces: { label: 'Texto com espaços extras', help: 'O sistema vai limpar os espaços repetidos.', wide: true },
    txt_upper: { label: 'Texto para converter em MAIÚSCULAS', help: 'Cole o conteúdo que deve ficar em caixa alta.', wide: true },
    txt_lower: { label: 'Texto para converter em minúsculas', help: 'Cole o conteúdo que deve ficar em caixa baixa.', wide: true },
    txt_cap: { label: 'Texto para capitalizar', help: 'Cada palavra começa com letra maiúscula.', wide: true },
    txt_sort: { label: 'Lista para ordenar', help: 'Escreva um item por linha.', wide: true },
    txt_dedupe: { label: 'Lista com itens repetidos', help: 'Escreva um item por linha para remover duplicados.', wide: true },
    rnd_names: { label: 'Nomes para o sorteio', help: 'Escreva um nome por linha.', wide: true },
    rnd_pick: { label: 'Itens para escolher aleatoriamente', help: 'Escreva um item por linha.', wide: true },
    rnd_shuffle: { label: 'Lista para embaralhar', help: 'Escreva um item por linha.', wide: true },
    rnd_roulette: { label: 'Opções da roleta', help: 'Escreva uma opção por linha.', wide: true },
    calc_expr: { label: 'Expressão matemática', help: 'Ex.: (10+5)*2', wide: true },
    calc_d1: { label: 'Data inicial', help: 'Primeira data para comparar.' },
    calc_d2: { label: 'Data final', help: 'Segunda data para comparar.' },
    calc_birth: { label: 'Data de nascimento', help: 'Selecione a data para calcular a idade.', wide: true },
    maxmb: { label: 'Tamanho máximo por parte (MB)', help: 'Ex.: 6 MB por arquivo gerado.' },
    every: { label: 'Páginas por parte', help: 'Ex.: 5 páginas em cada arquivo.' },
    ranges: { label: 'Intervalos personalizados', help: 'Ex.: 1-3,7,10-12', wide: true },
    sizeMb: { label: 'Tamanho de cada parte (MB)', help: 'Ex.: 100 MB por arquivo de vídeo.' }
  };

  function wrapControl(control, meta){
    if(!control || control.closest('.mt-field')) return;
    var parent = control.parentNode;
    if(!parent) return;
    var previous = control.previousElementSibling;
    if(previous && previous.tagName && previous.tagName.toLowerCase() === 'label' && !previous.querySelector('input')){
      previous.remove();
    }
    var wrapper = document.createElement('div');
    wrapper.className = 'mt-field' + (meta.wide ? ' mt-field-wide' : '');
    var label = document.createElement('label');
    if(control.id) label.setAttribute('for', control.id);
    label.textContent = meta.label;
    wrapper.appendChild(label);
    parent.insertBefore(wrapper, control);
    wrapper.appendChild(control);
    if(meta.help){
      var small = document.createElement('small');
      small.className = 'mt-auto-hint';
      small.textContent = meta.help;
      wrapper.appendChild(small);
    }
  }

  Object.keys(hints).forEach(function(id){
    wrapControl(byId(id), hints[id]);
  });
}

function bindQaFlowTweaks(){
  var splitRadios = Array.prototype.slice.call(document.querySelectorAll('#tab-split input[name="mode"]'));
  if(splitRadios.length){
    var syncSplitRows = function(){
      splitRadios.forEach(function(radio){
        var row = radio.closest('.inputs');
        if(!row) return;
        row.classList.add('mt-choice-row');
        row.classList.toggle('is-active', radio.checked);
        row.querySelectorAll('input[type="number"], input[type="text"]').forEach(function(input){
          input.disabled = !radio.checked;
        });
      });
    };
    splitRadios.forEach(function(radio){ radio.addEventListener('change', syncSplitRows); });
    syncSplitRows();
  }

  var protectStatus = byId('protectStatus');
  var protectPassword = byId('protectPassword');
  var protectPassword2 = byId('protectPassword2');
  if(protectPassword && protectPassword2){
    var syncProtectHint = function(){
      if(!protectStatus) return;
      if(!protectPassword.value && !protectPassword2.value) return;
      if(protectPassword.value && protectPassword2.value && protectPassword.value !== protectPassword2.value){
        protectStatus.textContent = 'As senhas precisam ser iguais.';
      } else if(protectPassword.value.length > 0 && protectPassword.value.length < 4){
        protectStatus.textContent = 'Use pelo menos 4 caracteres para a senha.';
      } else if(protectPassword.value && protectPassword2.value && protectPassword.value === protectPassword2.value){
        protectStatus.textContent = 'Senha confirmada. Agora você pode proteger os PDFs.';
      }
    };
    protectPassword.addEventListener('input', syncProtectHint);
    protectPassword2.addEventListener('input', syncProtectHint);
  }
}

  function bindTextTools(){
    on('run_txt_chars', function(){ set('out_txt_chars', 'Total de caracteres: ' + val('txt_chars').length); });
    on('run_txt_words', function(){ set('out_txt_words', 'Total de palavras: ' + ((val('txt_words').trim().match(/\S+/g) || []).length)); });
    on('run_txt_trimlines', function(){ set('out_txt_trimlines', lines(val('txt_trimlines')).join(' ')); });
    on('run_txt_trimspaces', function(){ set('out_txt_trimspaces', val('txt_trimspaces').replace(/\s+/g,' ').trim()); });
    on('run_txt_upper', function(){ set('out_txt_upper', val('txt_upper').toUpperCase()); });
    on('run_txt_lower', function(){ set('out_txt_lower', val('txt_lower').toLowerCase()); });
    on('run_txt_cap', function(){ set('out_txt_cap', val('txt_cap').toLowerCase().replace(/(^|\s)\S/g,function(m){ return m.toUpperCase(); })); });
    on('run_txt_sort', function(){ set('out_txt_sort', lines(val('txt_sort')).sort(function(a,b){ return a.localeCompare(b,'pt-BR'); }).join('\n')); });
    on('run_txt_dedupe', function(){ var seen = {}; var result = []; lines(val('txt_dedupe')).forEach(function(x){ var k = x.toLowerCase(); if(!seen[k]){ seen[k]=true; result.push(x); } }); set('out_txt_dedupe', result.join('\n')); });
    on('run_txt_lorem', function(){ set('out_txt_lorem', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'); });
    on('run_txt_regex', function(){
      try { set('out_txt_regex', runRegexSearch(val('txt_regex_pattern'), val('txt_regex_flags'), val('txt_regex_text'))); }
      catch(err){ set('out_txt_regex', 'Regex inválida: ' + (err.message || 'revise o padrão informado.')); }
    });
    on('run_txt_diff', function(){ set('out_txt_diff', buildLineDiff(val('txt_diff_a'), val('txt_diff_b'))); });
  }

  function bindLinuxCommandDictionary(){
    var distroEl = byId('dev_linux_distro');
    var groupEl = byId('dev_linux_group');
    var listEl = byId('dev_linux_commands');
    var outEl = byId('out_dev_linux');
    if(!distroEl || !groupEl || !listEl) return;

    var db = {
      ubuntu: {
        nome: 'Ubuntu / Debian',
        essenciais: [
          { label: 'Atualizar índice de pacotes', cmd: 'sudo apt update' },
          { label: 'Atualizar sistema', cmd: 'sudo apt upgrade -y' },
          { label: 'Listar serviços ativos', cmd: 'systemctl --type=service --state=running' },
          { label: 'Espaço em disco', cmd: 'df -h' }
        ],
        pacotes: [
          { label: 'Instalar pacote', cmd: 'sudo apt install <pacote>' },
          { label: 'Remover pacote', cmd: 'sudo apt remove <pacote>' },
          { label: 'Buscar pacote', cmd: 'apt search <termo>' },
          { label: 'Listar instalados', cmd: 'apt list --installed' }
        ],
        rede: [
          { label: 'IP e interfaces', cmd: 'ip a' },
          { label: 'Rotas de rede', cmd: 'ip route' },
          { label: 'Testar conectividade', cmd: 'ping -c 4 8.8.8.8' },
          { label: 'Portas em escuta', cmd: 'ss -tulpen' }
        ],
        servicos: [
          { label: 'Status de serviço', cmd: 'systemctl status <servico>' },
          { label: 'Iniciar serviço', cmd: 'sudo systemctl start <servico>' },
          { label: 'Habilitar no boot', cmd: 'sudo systemctl enable <servico>' },
          { label: 'Reiniciar serviço', cmd: 'sudo systemctl restart <servico>' }
        ],
        logs: [
          { label: 'Logs do sistema', cmd: 'journalctl -xe' },
          { label: 'Logs de um serviço', cmd: 'journalctl -u <servico> -f' },
          { label: 'Falhas de autenticação', cmd: 'sudo tail -f /var/log/auth.log' },
          { label: '?ltimos boots', cmd: 'journalctl --list-boots' }
        ]
      },
      fedora: {
        nome: 'Fedora / RHEL',
        essenciais: [
          { label: 'Atualizar repositórios e pacotes', cmd: 'sudo dnf upgrade -y' },
          { label: 'Informações do sistema', cmd: 'hostnamectl' },
          { label: 'Espaço em disco', cmd: 'df -h' },
          { label: 'Processos ativos', cmd: 'ps aux --sort=-%mem | head' }
        ],
        pacotes: [
          { label: 'Instalar pacote', cmd: 'sudo dnf install <pacote>' },
          { label: 'Remover pacote', cmd: 'sudo dnf remove <pacote>' },
          { label: 'Buscar pacote', cmd: 'dnf search <termo>' },
          { label: 'Listar instalados', cmd: 'dnf list installed' }
        ],
        rede: [
          { label: 'Interfaces e IP', cmd: 'ip a' },
          { label: 'Conexões NetworkManager', cmd: 'nmcli con show' },
          { label: 'Teste DNS', cmd: 'dig <dominio>' },
          { label: 'Portas em escuta', cmd: 'ss -tulpen' }
        ],
        servicos: [
          { label: 'Status de serviço', cmd: 'systemctl status <servico>' },
          { label: 'Iniciar serviço', cmd: 'sudo systemctl start <servico>' },
          { label: 'Habilitar serviço', cmd: 'sudo systemctl enable <servico>' },
          { label: 'Ver falhas', cmd: 'systemctl --failed' }
        ],
        logs: [
          { label: 'Logs em tempo real', cmd: 'journalctl -f' },
          { label: 'Logs de serviço', cmd: 'journalctl -u <servico> -f' },
          { label: 'Mensagens de kernel', cmd: 'dmesg -T | tail -n 50' },
          { label: '?ltimos erros', cmd: 'journalctl -p err -b' }
        ]
      },
      arch: {
        nome: 'Arch Linux',
        essenciais: [
          { label: 'Atualização completa', cmd: 'sudo pacman -Syu' },
          { label: 'Espaço em disco', cmd: 'df -h' },
          { label: 'Processos ativos', cmd: 'ps aux --sort=-%cpu | head' },
          { label: 'Informações do kernel', cmd: 'uname -a' }
        ],
        pacotes: [
          { label: 'Instalar pacote', cmd: 'sudo pacman -S <pacote>' },
          { label: 'Remover pacote', cmd: 'sudo pacman -Rns <pacote>' },
          { label: 'Buscar pacote', cmd: 'pacman -Ss <termo>' },
          { label: 'Listar instalados', cmd: 'pacman -Q' }
        ],
        rede: [
          { label: 'Interfaces e IP', cmd: 'ip a' },
          { label: 'Roteamento', cmd: 'ip route' },
          { label: 'Conectividade', cmd: 'ping -c 4 1.1.1.1' },
          { label: 'Portas em escuta', cmd: 'ss -tulpen' }
        ],
        servicos: [
          { label: 'Status de serviço', cmd: 'systemctl status <servico>' },
          { label: 'Iniciar serviço', cmd: 'sudo systemctl start <servico>' },
          { label: 'Habilitar serviço', cmd: 'sudo systemctl enable <servico>' },
          { label: 'Reiniciar serviço', cmd: 'sudo systemctl restart <servico>' }
        ],
        logs: [
          { label: 'Logs do sistema', cmd: 'journalctl -xe' },
          { label: 'Logs de serviço', cmd: 'journalctl -u <servico> -f' },
          { label: 'Erros no boot atual', cmd: 'journalctl -p err -b' },
          { label: 'Kernel recente', cmd: 'dmesg -T | tail -n 80' }
        ]
      },
      opensuse: {
        nome: 'openSUSE',
        essenciais: [
          { label: 'Atualizar sistema', cmd: 'sudo zypper update -y' },
          { label: 'Repositórios configurados', cmd: 'zypper lr -u' },
          { label: 'Espaço em disco', cmd: 'df -h' },
          { label: 'CPU e memória', cmd: 'top' }
        ],
        pacotes: [
          { label: 'Instalar pacote', cmd: 'sudo zypper install <pacote>' },
          { label: 'Remover pacote', cmd: 'sudo zypper remove <pacote>' },
          { label: 'Buscar pacote', cmd: 'zypper search <termo>' },
          { label: 'Pacotes instalados', cmd: 'zypper se -i' }
        ],
        rede: [
          { label: 'Interfaces e IP', cmd: 'ip a' },
          { label: 'Rotas', cmd: 'ip route' },
          { label: 'Consulta DNS', cmd: 'dig <dominio>' },
          { label: 'Portas abertas', cmd: 'ss -tulpen' }
        ],
        servicos: [
          { label: 'Status de serviço', cmd: 'systemctl status <servico>' },
          { label: 'Iniciar serviço', cmd: 'sudo systemctl start <servico>' },
          { label: 'Habilitar serviço', cmd: 'sudo systemctl enable <servico>' },
          { label: 'Serviços falhos', cmd: 'systemctl --failed' }
        ],
        logs: [
          { label: 'Logs em tempo real', cmd: 'journalctl -f' },
          { label: 'Logs de serviço', cmd: 'journalctl -u <servico> -f' },
          { label: 'Mensagens do kernel', cmd: 'dmesg -T | tail -n 50' },
          { label: '?ltimos erros', cmd: 'journalctl -p err -b' }
        ]
      },
      alpine: {
        nome: 'Alpine',
        essenciais: [
          { label: 'Atualizar índice', cmd: 'sudo apk update' },
          { label: 'Atualizar pacotes', cmd: 'sudo apk upgrade' },
          { label: 'Espaço em disco', cmd: 'df -h' },
          { label: 'Processos ativos', cmd: 'ps aux' }
        ],
        pacotes: [
          { label: 'Instalar pacote', cmd: 'sudo apk add <pacote>' },
          { label: 'Remover pacote', cmd: 'sudo apk del <pacote>' },
          { label: 'Buscar pacote', cmd: 'apk search <termo>' },
          { label: 'Listar instalados', cmd: 'apk info -vv' }
        ],
        rede: [
          { label: 'Interfaces e IP', cmd: 'ip a' },
          { label: 'Rotas', cmd: 'ip route' },
          { label: 'Teste de conectividade', cmd: 'ping -c 4 8.8.8.8' },
          { label: 'Portas em escuta', cmd: 'ss -tulpen' }
        ],
        servicos: [
          { label: 'Status de serviço', cmd: 'rc-service <servico> status' },
          { label: 'Iniciar serviço', cmd: 'sudo rc-service <servico> start' },
          { label: 'Habilitar no boot', cmd: 'sudo rc-update add <servico>' },
          { label: 'Listar runlevels', cmd: 'rc-update show' }
        ],
        logs: [
          { label: 'Syslog principal', cmd: 'tail -f /var/log/messages' },
          { label: 'Kernel recente', cmd: 'dmesg | tail -n 50' },
          { label: 'Auth (se existir)', cmd: 'tail -f /var/log/auth.log' },
          { label: 'Logs de serviço OpenRC', cmd: 'rc-status -a' }
        ]
      }
    };

    function copyCommand(cmd){
      if(navigator.clipboard && navigator.clipboard.writeText){
        navigator.clipboard.writeText(cmd).then(function(){ set('out_dev_linux', 'Comando copiado: ' + cmd); }).catch(function(){ set('out_dev_linux', 'Copie manualmente: ' + cmd); });
      } else {
        set('out_dev_linux', 'Copie manualmente: ' + cmd);
      }
    }

    function render(){
      var distro = distroEl.value || 'ubuntu';
      var group = groupEl.value || 'essenciais';
      var data = (db[distro] && db[distro][group]) || [];
      listEl.innerHTML = '';
      data.forEach(function(item){
        var row = document.createElement('div');
        row.className = 'mt-linux-cmd-item';
        var left = document.createElement('div');
        left.className = 'mt-linux-cmd-main';
        var label = document.createElement('strong');
        label.textContent = item.label;
        var code = document.createElement('code');
        code.textContent = item.cmd;
        left.appendChild(label);
        left.appendChild(code);
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'btn alt';
        btn.textContent = 'Copiar';
        btn.addEventListener('click', function(){ copyCommand(item.cmd); });
        row.appendChild(left);
        row.appendChild(btn);
        listEl.appendChild(row);
      });
      set('out_dev_linux', 'Mostrando ' + data.length + ' comandos para ' + (db[distro].nome || distro) + ' em "' + group + '".');
    }

    on('run_dev_linux_show', render);
    on('run_dev_linux_random', function(){
      var distro = distroEl.value || 'ubuntu';
      var group = groupEl.value || 'essenciais';
      var data = (db[distro] && db[distro][group]) || [];
      if(!data.length){ set('out_dev_linux', 'Nenhum comando dispon\u00edvel neste grupo.'); return; }
      var pick = data[Math.floor(Math.random() * data.length)];
      set('out_dev_linux', 'Sugestão rápida: ' + pick.label + ' -> ' + pick.cmd);
    });
    distroEl.addEventListener('change', render);
    groupEl.addEventListener('change', render);
    render();
  }

  function bindVisualRandomTools(){
    var rouletteInput = byId('rnd_roulette');
    var rouletteCanvas = byId('rnd_roulette_canvas');
    var rouletteBtn = byId('run_rnd_roulette');
    var rouletteOut = byId('out_rnd_roulette');
    var rouletteAngle = 0;
    var roulettePalette = ['#1d4ed8','#0ea5e9','#f97316','#16a34a','#7c3aed','#db2777','#eab308','#14b8a6','#ef4444','#6366f1'];

    function rouletteOptions(){ return lines(val('rnd_roulette')).slice(0, 24); }

    function wrapRouletteLabel(ctx, text, maxWidth, maxLines){
      var safe = String(text || '').replace(/s+/g, ' ').trim();
      if(!safe) return [''];
      var words = safe.split(' ');
      var linesOut = [];
      var line = '';
      function pushLine(){ if(line) linesOut.push(line); line = ''; }

      for(var i=0;i<words.length;i+=1){
        var word = words[i];
        var test = line ? (line + ' ' + word) : word;
        if(ctx.measureText(test).width <= maxWidth){ line = test; continue; }
        if(!line){
          var partial = '';
          for(var c=0;c<word.length;c+=1){
            var t = partial + word[c];
            if(ctx.measureText(t + '?').width > maxWidth) break;
            partial = t;
          }
          linesOut.push(partial + (partial.length < word.length ? '?' : ''));
        } else {
          pushLine();
          i -= 1;
        }
        if(linesOut.length >= maxLines) break;
      }
      if(line && linesOut.length < maxLines) linesOut.push(line);
      if(linesOut.length > maxLines) linesOut = linesOut.slice(0, maxLines);
      if(linesOut.length === maxLines){
        var last = linesOut[maxLines - 1];
        if(ctx.measureText(last).width > maxWidth){
          while(last.length > 1 && ctx.measureText(last + '?').width > maxWidth){
            last = last.slice(0, -1);
          }
          linesOut[maxLines - 1] = last + '?';
        }
      }
      return linesOut;
    }

    function drawRoulette(opts){
      if(!rouletteCanvas) return;
      var ctx = rouletteCanvas.getContext('2d');
      var w = rouletteCanvas.width; var h = rouletteCanvas.height;
      var cx = w / 2; var cy = h / 2;
      var radius = Math.min(cx, cy) - 6;
      ctx.clearRect(0,0,w,h);
      ctx.save();
      ctx.beginPath();
      ctx.rect(0,0,w,h);
      ctx.clip();
      if(!opts.length){
        ctx.fillStyle = '#f1f5f9';
        ctx.beginPath(); ctx.arc(cx, cy, radius, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#334155';
        ctx.font = '600 16px Segoe UI';
        ctx.textAlign = 'center';
        ctx.fillText('Digite opções para montar a roleta', cx, cy + 6);
        return;
      }
      var slice = (Math.PI * 2) / opts.length;
      for(var i=0;i<opts.length;i+=1){
        var start = i * slice;
        var end = start + slice;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.arc(cx, cy, radius, start, end);
        ctx.closePath();
        ctx.fillStyle = roulettePalette[i % roulettePalette.length];
        ctx.fill();
        ctx.strokeStyle = 'rgba(255,255,255,0.9)';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(start + slice / 2);
        ctx.fillStyle = '#ffffff';
        ctx.font = (slice < 0.20 ? '700 9px Segoe UI' : (slice < 0.34 ? '700 10px Segoe UI' : '700 12px Segoe UI'));
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        var textRadius = radius * 0.63;
        var arcWidth = Math.max(52, radius * slice * 0.72);
        var maxLines = slice < 0.20 ? 1 : (slice < 0.34 ? 2 : 3);
        var labelLines = wrapRouletteLabel(ctx, opts[i], arcWidth, maxLines);
        var lineHeight = 13;
        var offsetY = -((labelLines.length - 1) * lineHeight) / 2;
        for(var li=0; li<labelLines.length; li+=1){
          ctx.fillText(labelLines[li], textRadius, offsetY + li * lineHeight);
        }
        ctx.restore();
      }
      ctx.beginPath();
      ctx.arc(cx, cy, 22, 0, Math.PI * 2);
      ctx.fillStyle = '#0f172a';
      ctx.fill();
      ctx.fillStyle = '#e2e8f0';
      ctx.font = '700 12px Segoe UI';
      ctx.textAlign = 'center';
      ctx.fillText('MELO', cx, cy + 4);
    }

    function spinRoulette(){
      var opts = rouletteOptions();
      if(opts.length < 2){ set('out_rnd_roulette', 'Informe pelo menos duas opções para girar a roleta.'); drawRoulette(opts); return; }
      var winner = Math.floor(Math.random() * opts.length);
      var sliceDeg = 360 / opts.length;
      var center = winner * sliceDeg + (sliceDeg / 2);
      var target = 270 - center;
      var currentNorm = ((rouletteAngle % 360) + 360) % 360;
      var delta = ((target - currentNorm) + 360) % 360;
      rouletteAngle += (6 + Math.floor(Math.random() * 4)) * 360 + delta;
      rouletteCanvas.style.transition = 'transform 4s cubic-bezier(.18,.8,.14,1)';
      rouletteCanvas.style.transform = 'rotate(' + rouletteAngle + 'deg)';
      rouletteBtn.disabled = true;
      set('out_rnd_roulette', 'Girando roleta...');
      setTimeout(function(){
        rouletteBtn.disabled = false;
        set('out_rnd_roulette', 'Resultado da roleta: ' + opts[winner]);
      }, 4050);
    }

    if(rouletteInput && rouletteCanvas && rouletteBtn){
      drawRoulette(rouletteOptions());
      rouletteInput.addEventListener('input', function(){ drawRoulette(rouletteOptions()); });
      rouletteBtn.addEventListener('click', spinRoulette);
    }

    var coinBtn = byId('run_rnd_coin');
    var coinVisual = byId('rnd_coin_visual');
    if(coinBtn && coinVisual){
      coinBtn.addEventListener('click', function(){
        var result = Math.random() < 0.5 ? 'Cara' : 'Coroa';
        var finalDeg = result === 'Cara' ? 0 : 180;
        coinVisual.classList.remove('is-flipping', 'show-tail');
        coinVisual.toggleAttribute('data-tail-result', result === 'Coroa');
        coinVisual.style.setProperty('--coin-turns', String(9 + Math.floor(Math.random() * 5)));
        coinVisual.style.setProperty('--coin-final', finalDeg + 'deg');
        void coinVisual.offsetWidth;
        coinVisual.classList.add('is-flipping');
        setTimeout(function(){
          coinVisual.classList.remove('is-flipping');
          coinVisual.classList.toggle('show-tail', result === 'Coroa');
        }, 1720);
        set('out_rnd_coin', 'Resultado da moeda: ' + result);
      });
    }

    var diceBtn = byId('run_rnd_dice');
    var diceVisual = byId('rnd_dice_visual');
    if(diceBtn && diceVisual){
      var cssDiceFaces = {
        1: 'rotateX(-12deg) rotateY(18deg) rotateZ(-2deg)',
        2: 'rotateX(-12deg) rotateY(-72deg) rotateZ(-2deg)',
        3: 'rotateX(-102deg) rotateY(18deg) rotateZ(-2deg)',
        4: 'rotateX(78deg) rotateY(18deg) rotateZ(-2deg)',
        5: 'rotateX(-12deg) rotateY(108deg) rotateZ(-2deg)',
        6: 'rotateX(-12deg) rotateY(198deg) rotateZ(-2deg)'
      };
      var dice3d = null;
      var dice3dReady = false;

      function renderDiceFaceTexture(THREE, value){
        var canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 256;
        var ctx = canvas.getContext('2d');
        var grd = ctx.createLinearGradient(0, 0, 256, 256);
        grd.addColorStop(0, '#ffffff');
        grd.addColorStop(0.58, '#f1f6fc');
        grd.addColorStop(1, '#d8e2ee');
        ctx.fillStyle = grd;
        ctx.fillRect(0, 0, 256, 256);
        ctx.strokeStyle = 'rgba(96, 124, 160, 0.42)';
        ctx.lineWidth = 8;
        ctx.strokeRect(8, 8, 240, 240);
        ctx.strokeStyle = 'rgba(255,255,255,0.72)';
        ctx.lineWidth = 3;
        ctx.strokeRect(22, 22, 212, 212);

        var spots = {
          1: [[128, 128]],
          2: [[78, 78], [178, 178]],
          3: [[78, 78], [128, 128], [178, 178]],
          4: [[78, 78], [178, 78], [78, 178], [178, 178]],
          5: [[78, 78], [178, 78], [128, 128], [78, 178], [178, 178]],
          6: [[78, 70], [78, 128], [78, 186], [178, 70], [178, 128], [178, 186]]
        };
        (spots[value] || spots[1]).forEach(function(pos){
          var pip = ctx.createRadialGradient(pos[0] - 5, pos[1] - 7, 2, pos[0], pos[1], 17);
          pip.addColorStop(0, '#5f7593');
          pip.addColorStop(0.62, '#17314f');
          pip.addColorStop(1, '#0e223c');
          ctx.fillStyle = pip;
          ctx.beginPath();
          ctx.arc(pos[0], pos[1], 16, 0, Math.PI * 2);
          ctx.fill();
        });

        var texture = new THREE.CanvasTexture(canvas);
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.anisotropy = 4;
        return texture;
      }

      function initWebglDice(){
        if(!window.Promise || !window.requestAnimationFrame) return Promise.resolve(null);
        return import('/static/js/vendor/three.module.js?v=0.165.0').then(function(THREE){
          var sceneEl = diceVisual.closest ? diceVisual.closest('.mt-dice-scene') : null;
          diceVisual.classList.add('mt-dice-webgl-host');
          if(sceneEl) sceneEl.classList.add('mt-dice-webgl-scene');
          diceVisual.setAttribute('data-face', '1');
          diceVisual.style.transform = '';

          var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
          renderer.setClearColor(0x000000, 0);
          renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
          renderer.domElement.className = 'mt-dice-webgl-canvas';
          renderer.domElement.setAttribute('aria-hidden', 'true');
          diceVisual.appendChild(renderer.domElement);

          var scene = new THREE.Scene();
          var camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
          camera.position.set(0, 0, 6.4);
          scene.add(new THREE.AmbientLight(0xffffff, 1.05));
          var key = new THREE.DirectionalLight(0xffffff, 1.35);
          key.position.set(4, 5, 6);
          scene.add(key);
          var fill = new THREE.DirectionalLight(0x9dbdf6, 0.46);
          fill.position.set(-4, -2, 5);
          scene.add(fill);

          var materials = [
            new THREE.MeshStandardMaterial({ map: renderDiceFaceTexture(THREE, 2), roughness: 0.62, metalness: 0.02 }),
            new THREE.MeshStandardMaterial({ map: renderDiceFaceTexture(THREE, 5), roughness: 0.62, metalness: 0.02 }),
            new THREE.MeshStandardMaterial({ map: renderDiceFaceTexture(THREE, 3), roughness: 0.62, metalness: 0.02 }),
            new THREE.MeshStandardMaterial({ map: renderDiceFaceTexture(THREE, 4), roughness: 0.62, metalness: 0.02 }),
            new THREE.MeshStandardMaterial({ map: renderDiceFaceTexture(THREE, 1), roughness: 0.62, metalness: 0.02 }),
            new THREE.MeshStandardMaterial({ map: renderDiceFaceTexture(THREE, 6), roughness: 0.62, metalness: 0.02 })
          ];
          var cube = new THREE.Mesh(new THREE.BoxGeometry(2.25, 2.25, 2.25), materials);
          scene.add(cube);

          var targetEuler = {
            1: { x: -0.28, y: 0.42, z: -0.04 },
            2: { x: -0.28, y: -Math.PI / 2 + 0.56, z: -0.05 },
            3: { x: Math.PI / 2 - 0.54, y: 0.34, z: -0.08 },
            4: { x: -Math.PI / 2 + 0.54, y: 0.34, z: -0.08 },
            5: { x: -0.28, y: Math.PI / 2 + 0.56, z: -0.05 },
            6: { x: -0.28, y: Math.PI + 0.48, z: -0.04 }
          };
          var currentFace = 1;
          var frame = 0;

          function easeOutCubic(t){ return 1 - Math.pow(1 - t, 3); }
          function resize(){
            var rect = diceVisual.getBoundingClientRect();
            var w = Math.max(120, Math.round(rect.width || 180));
            var h = Math.max(120, Math.round(rect.height || 180));
            renderer.setSize(w, h, false);
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
          }
          function render(){
            resize();
            renderer.render(scene, camera);
          }
          function setFace(face){
            var target = targetEuler[face] || targetEuler[1];
            currentFace = face;
            cube.rotation.set(target.x, target.y, target.z);
            diceVisual.setAttribute('data-face', String(face));
            render();
          }
          function roll(face){
            var start = { x: cube.rotation.x, y: cube.rotation.y, z: cube.rotation.z };
            var base = targetEuler[face] || targetEuler[1];
            var end = {
              x: base.x + Math.PI * 2 * (3 + Math.floor(Math.random() * 2)),
              y: base.y + Math.PI * 2 * (4 + Math.floor(Math.random() * 3)),
              z: base.z + Math.PI * 2 * (1 + Math.floor(Math.random() * 2))
            };
            var duration = 920;
            var started = performance.now();
            diceVisual.classList.add('is-rolling');
            cancelAnimationFrame(frame);

            function tick(now){
              var t = Math.min(1, (now - started) / duration);
              var e = easeOutCubic(t);
              cube.rotation.set(
                start.x + (end.x - start.x) * e,
                start.y + (end.y - start.y) * e,
                start.z + (end.z - start.z) * e
              );
              render();
              if(t < 1){
                frame = requestAnimationFrame(tick);
              } else {
                diceVisual.classList.remove('is-rolling');
                setFace(face);
              }
            }
            frame = requestAnimationFrame(tick);
          }

          if('ResizeObserver' in window){
            new ResizeObserver(render).observe(diceVisual);
          } else {
            window.addEventListener('resize', render);
          }

          setFace(currentFace);
          return { roll: roll, setFace: setFace };
        }).catch(function(){
          return null;
        });
      }

      function rollCssDice(result){
        var target = cssDiceFaces[result] || cssDiceFaces[1];
        diceVisual.classList.remove('is-rolling');
        diceVisual.setAttribute('data-face', String(result));
        void diceVisual.offsetWidth;
        diceVisual.classList.add('is-rolling');
        diceVisual.style.transform = 'rotateX(720deg) rotateY(900deg) rotateZ(180deg) ' + target;
        setTimeout(function(){
          diceVisual.classList.remove('is-rolling');
          diceVisual.style.transform = target;
        }, 820);
      }

      diceVisual.style.transform = cssDiceFaces[1];
      diceVisual.style.willChange = 'transform';
      initWebglDice().then(function(api){
        dice3d = api;
        dice3dReady = !!api;
      });

      diceBtn.addEventListener('click', function(){
        var result = Math.floor(Math.random() * 6) + 1;
        if(dice3dReady && dice3d){
          dice3d.roll(result);
        } else {
          rollCssDice(result);
        }
        set('out_rnd_dice', 'Resultado do dado: ' + result);
      });
    }
  }


  function showPartnerGiftPopup(payload){
    var days = Array.isArray(payload && payload.calendar) ? payload.calendar : [];
    if(!days.length) return;

    var pms = days.filter(function(day){ return day.phase === 'pms'; });
    if(!pms.length) return;

    var start = pms[0].date_br || pms[0].date || '';
    var end = pms[pms.length - 1].date_br || pms[pms.length - 1].date || '';

    var oldModal = byId('mtGiftModal');
    if(oldModal) oldModal.remove();

    var overlay = document.createElement('div');
    overlay.id = 'mtGiftModal';
    overlay.style.cssText = 'position:fixed;inset:0;background:rgba(15,23,42,.55);z-index:9999;display:flex;align-items:center;justify-content:center;padding:16px;';

    var card = document.createElement('div');
    card.style.cssText = 'max-width:560px;width:100%;background:#fff;border:1px solid #94a3b8;border-radius:10px;box-shadow:0 10px 30px rgba(0,0,0,.25);padding:18px;';

    var title = document.createElement('h3');
    title.textContent = 'Dica de mimos para esse período';
    title.style.cssText = 'margin:0 0 8px 0;font-size:20px;line-height:1.2;color:#0f172a;';

    var text = document.createElement('p');
    text.textContent = 'No período de ' + start + ' até ' + end + ', considere comprar estes mimos:';
    text.style.cssText = 'margin:0 0 12px 0;color:#1e293b;font-size:16px;line-height:1.5;';

    var link = document.createElement('a');
    link.href = 'https://meli.la/18bU5rT';
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.className = 'btn';
    link.textContent = 'Ver lista de presentes';
    link.style.marginRight = '8px';

    var close = document.createElement('button');
    close.type = 'button';
    close.className = 'btn alt';
    close.textContent = 'Fechar';

    close.addEventListener('click', function(){ overlay.remove(); });
    overlay.addEventListener('click', function(ev){ if(ev.target === overlay) overlay.remove(); });

    var actions = document.createElement('div');
    actions.appendChild(link);
    actions.appendChild(close);

    card.appendChild(title);
    card.appendChild(text);
    card.appendChild(actions);
    overlay.appendChild(card);
    document.body.appendChild(overlay);
  }

  function renderCycleCalendar(outId, boxId, payload){
    var out = byId(outId);
    var box = byId(boxId);
    if(!out || !box) return;
    box.innerHTML = '';
    var summary = payload && (payload.summary || payload.result || 'Calendário gerado.');
    set(outId, summary);
    var legend = document.createElement('div');
    legend.className = 'mt-cycle-legend';
    legend.innerHTML = '<span><i class="dot period"></i>Menstruação</span><span><i class="dot fertile"></i>Janela fértil</span><span><i class="dot ovulation"></i>Ovulação</span><span><i class="dot pms"></i>Sensibilidade pré-menstrual</span><span><i class="dot neutral"></i>Fase estável</span>';
    box.appendChild(legend);
    var grid = document.createElement('div');
    grid.className = 'mt-cycle-grid';
    var days = Array.isArray(payload.calendar) ? payload.calendar : [];
    days.forEach(function(day){
      var card = document.createElement('div');
      card.className = 'mt-cycle-day ' + (day.phase || 'neutral');
      var dt = document.createElement('strong'); dt.textContent = day.date_br || day.date || '';
      var lb = document.createElement('small'); lb.textContent = day.label || '';
      card.appendChild(dt); card.appendChild(lb);
      card.title = day.tip || day.label || '';
      grid.appendChild(card);
    });
    box.appendChild(grid);
    var tips = Array.isArray(payload.suggestions) ? payload.suggestions : [];
    if(tips.length){
      var tipsBox = document.createElement('div');
      tipsBox.className = 'mt-cycle-tips';
      var h = document.createElement('h4'); h.textContent = 'Sugestões de cuidado';
      tipsBox.appendChild(h);
      var ul = document.createElement('ul');
      tips.forEach(function(item){ var li = document.createElement('li'); li.textContent = item; ul.appendChild(li); });
      tipsBox.appendChild(ul);
      box.appendChild(tipsBox);
    }
  }

  function bindRemoteTools(){
    var unitMaps = {
      temperature: [
        { value: 'c', label: 'Celsius (C)' },
        { value: 'f', label: 'Fahrenheit (F)' },
        { value: 'k', label: 'Kelvin (K)' }
      ],
      weight: [
        { value: 'kg', label: 'Quilograma (kg)' },
        { value: 'g', label: 'Grama (g)' },
        { value: 'lb', label: 'Libra (lb)' }
      ],
      distance: [
        { value: 'm', label: 'Metro (m)' },
        { value: 'km', label: 'Quilometro (km)' },
        { value: 'cm', label: 'Centimetro (cm)' },
        { value: 'mi', label: 'Milha (mi)' }
      ],
      filesize: [
        { value: 'b', label: 'Byte (B)' },
        { value: 'kb', label: 'Kilobyte (KB)' },
        { value: 'mb', label: 'Megabyte (MB)' },
        { value: 'gb', label: 'Gigabyte (GB)' },
        { value: 'tb', label: 'Terabyte (TB)' }
      ]
    };

    function fillUnitSelect(selectId, items, preferred){
      var select = byId(selectId);
      if(!select) return;
      select.innerHTML = '';
      items.forEach(function(item){
        var opt = document.createElement('option');
        opt.value = item.value;
        opt.textContent = item.label;
        if(item.value === preferred) opt.selected = true;
        select.appendChild(opt);
      });
    }

    function syncGenericUnitSelects(){
      var type = val('calc_convert_type') || 'temperature';
      var items = unitMaps[type] || unitMaps.temperature;
      var fromSelect = byId('calc_from');
      var toSelect = byId('calc_to');
      var currentFrom = fromSelect && fromSelect.value;
      var currentTo = toSelect && toSelect.value;
      fillUnitSelect('calc_from', items, currentFrom && items.some(function(x){ return x.value === currentFrom; }) ? currentFrom : items[0].value);
      fillUnitSelect('calc_to', items, currentTo && items.some(function(x){ return x.value === currentTo; }) ? currentTo : items[Math.min(1, items.length - 1)].value);
      if(byId('calc_from').value === byId('calc_to').value && items.length > 1){
        byId('calc_to').value = items[1].value;
      }
    }

    var convertType = byId('calc_convert_type');
    if(convertType){
      syncGenericUnitSelects();
      convertType.addEventListener('change', syncGenericUnitSelects);
    }

    on('run_dev_pass', function(){
      var fd = new FormData();
      fd.append('length', val('dev_pass_len'));
      fd.append('with_symbols', val('dev_pass_sym'));
      runAction('/api/dev/password', fd, 'out_dev_pass');
    });
    on('run_dev_ipcalc', function(){ var fd = new FormData(); fd.append('cidr', val('dev_cidr')); runAction('/api/dev/ipcalc', fd, 'out_dev_ipcalc'); });
    on('run_dev_port', function(){ var fd = new FormData(); fd.append('host', val('dev_host')); fd.append('port', val('dev_port')); runAction('/api/dev/port-test', fd, 'out_dev_port'); });
    on('run_dev_dns', function(){ var fd = new FormData(); fd.append('host', val('dev_dns_host')); runAction('/api/dev/dns', fd, 'out_dev_dns'); });
    on('run_dev_whois', function(){ var fd = new FormData(); fd.append('domain', val('dev_whois')); runAction('/api/dev/whois', fd, 'out_dev_whois'); });
    on('run_dev_json', function(){
      try { set('out_dev_json', JSON.stringify(JSON.parse(val('dev_json_input')), null, 2)); }
      catch(err){ set('out_dev_json', 'JSON inválido: ' + (err.message || 'revise o conteúdo.')); }
    });
    on('run_dev_json_min', function(){
      try { set('out_dev_json', JSON.stringify(JSON.parse(val('dev_json_input')))); }
      catch(err){ set('out_dev_json', 'JSON inválido: ' + (err.message || 'revise o conteúdo.')); }
    });
    on('run_dev_base64', function(){
      try {
        var action = val('dev_base64_action');
        set('out_dev_base64', action === 'decode' ? base64DecodeUnicode(val('dev_base64_input')) : base64EncodeUnicode(val('dev_base64_input')));
      } catch(err){ set('out_dev_base64', 'Não foi possível converter. Confira se o Base64 está completo e válido.'); }
    });
    on('run_dev_url', function(){
      try {
        var action = val('dev_url_action');
        set('out_dev_url', action === 'decode' ? decodeURIComponent(val('dev_url_input')) : encodeURIComponent(val('dev_url_input')));
      } catch(err){ set('out_dev_url', 'Não foi possível converter. Confira caracteres especiais ou sinais de %.'); }
    });
    on('run_dev_hash', function(){
      var fd = new FormData();
      fd.append('text', val('dev_hash_input'));
      fd.append('algorithm', val('dev_hash_alg'));
      runAction('/api/dev/hash', fd, 'out_dev_hash');
    });
    on('run_dev_uuid', function(){
      var count = Math.max(1, Math.min(10, parseInt(val('dev_uuid_count') || '1', 10)));
      var ids = [];
      for(var i = 0; i < count; i += 1){ ids.push(makeUuidV4()); }
      set('out_dev_uuid', (count === 1 ? 'UUID gerado: ' : 'UUIDs gerados:\n') + ids.join('\n'));
    });
    on('run_dev_ts_now', function(){
      var now = new Date();
      var dateInput = byId('dev_ts_date');
      var valueInput = byId('dev_ts_value');
      if(valueInput) valueInput.value = Math.floor(now.getTime() / 1000);
      if(dateInput) dateInput.value = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
      set('out_dev_timestamp', formatTimestampResult(now));
    });
    on('run_dev_ts_to_date', function(){
      var raw = val('dev_ts_value').trim();
      if(!raw){ set('out_dev_timestamp', 'Informe um timestamp para converter.'); return; }
      var n = Number(raw);
      if(!isFinite(n)){ set('out_dev_timestamp', 'Timestamp inválido. Use apenas números.'); return; }
      var ms = Math.abs(n) < 100000000000 ? n * 1000 : n;
      set('out_dev_timestamp', formatTimestampResult(new Date(ms)));
    });
    on('run_dev_date_to_ts', function(){
      var raw = val('dev_ts_date');
      if(!raw){ set('out_dev_timestamp', 'Escolha uma data e hora para converter.'); return; }
      set('out_dev_timestamp', formatTimestampResult(new Date(raw)));
    });
    on('run_dev_jwt', function(){
      try {
        var token = val('dev_jwt_input').trim();
        var parts = token.split('.');
        if(parts.length < 2){ set('out_dev_jwt', 'JWT inválido. O formato esperado é header.payload.signature.'); return; }
        var header = JSON.parse(base64UrlDecodeUnicode(parts[0]));
        var payload = JSON.parse(base64UrlDecodeUnicode(parts[1]));
        set('out_dev_jwt', 'Cabeçalho:\n' + JSON.stringify(header, null, 2) + '\n\nPayload:\n' + JSON.stringify(payload, null, 2) + '\n\nAviso: assinatura não validada.');
      } catch(err){ set('out_dev_jwt', 'Não foi possível decodificar. Verifique se o token JWT está completo.'); }
    });

    on('run_rnd_names', function(){ var fd = new FormData(); fd.append('items', val('rnd_names')); runAction('/api/random/names', fd, 'out_rnd_names'); });
    on('run_rnd_numbers', function(){ var fd = new FormData(); fd.append('min', val('rnd_min')); fd.append('max', val('rnd_max')); runAction('/api/random/number', fd, 'out_rnd_numbers'); });
    on('run_rnd_pick', function(){ var fd = new FormData(); fd.append('items', val('rnd_pick')); runAction('/api/random/pick', fd, 'out_rnd_pick'); });
    on('run_rnd_shuffle', function(){ var fd = new FormData(); fd.append('items', val('rnd_shuffle')); runAction('/api/random/shuffle', fd, 'out_rnd_shuffle'); });

    function syncCalcDisplay(){
      var input = byId('calc_expr');
      var display = byId('calc_visual_display');
      if(display) display.textContent = (input && input.value.trim()) ? input.value.trim() : '0';
    }
    function runSimpleCalculator(){
      var fd = new FormData();
      fd.append('expression', val('calc_expr'));
      runAction('/api/calc/simple', fd, 'out_calc_simple');
    }
    var calcInput = byId('calc_expr');
    if(calcInput){
      calcInput.addEventListener('input', syncCalcDisplay);
      calcInput.addEventListener('keydown', function(ev){
        if(ev.key === 'Enter'){
          ev.preventDefault();
          runSimpleCalculator();
        }
      });
    }
    document.querySelectorAll('#tab-calc-simple [data-calc-value], #tab-calc-simple [data-calc-action]').forEach(function(btn){
      btn.addEventListener('click', function(){
        var input = byId('calc_expr');
        if(!input) return;
        var action = btn.getAttribute('data-calc-action');
        var value = btn.getAttribute('data-calc-value') || '';
        if(action === 'clear'){
          input.value = '';
          set('out_calc_simple', '');
        } else if(action === 'backspace'){
          input.value = input.value.slice(0, -1);
        } else if(action === 'equals'){
          runSimpleCalculator();
        } else if(value){
          input.value += value;
        }
        syncCalcDisplay();
        input.focus();
      });
    });
    syncCalcDisplay();
    on('run_calc_percent', function(){ var fd = new FormData(); fd.append('value', val('calc_val')); fd.append('percent', val('calc_pct')); runAction('/api/calc/percentage', fd, 'out_calc_percent'); });
    on('run_calc_rule3', function(){ var fd = new FormData(); fd.append('a', val('calc_a')); fd.append('b', val('calc_b')); fd.append('c', val('calc_c')); runAction('/api/calc/rule3', fd, 'out_calc_rule3'); });
    on('run_calc_convert', function(){ var fd = new FormData(); fd.append('convert_type', val('calc_convert_type')); fd.append('from_unit', val('calc_from')); fd.append('to_unit', val('calc_to')); fd.append('number', val('calc_num')); runAction('/api/calc/convert', fd, 'out_calc_convert'); });
    on('run_calc_temp', function(){ var fd = new FormData(); fd.append('convert_type', 'temperature'); fd.append('from_unit', val('calc_temp_from')); fd.append('to_unit', val('calc_temp_to')); fd.append('number', val('calc_temp_num')); runAction('/api/calc/convert', fd, 'out_calc_temp'); });
    on('run_calc_weight', function(){ var fd = new FormData(); fd.append('convert_type', 'weight'); fd.append('from_unit', val('calc_weight_from')); fd.append('to_unit', val('calc_weight_to')); fd.append('number', val('calc_weight_num')); runAction('/api/calc/convert', fd, 'out_calc_weight'); });
    on('run_calc_distance', function(){ var fd = new FormData(); fd.append('convert_type', 'distance'); fd.append('from_unit', val('calc_distance_from')); fd.append('to_unit', val('calc_distance_to')); fd.append('number', val('calc_distance_num')); runAction('/api/calc/convert', fd, 'out_calc_distance'); });
    on('run_calc_filesize', function(){ var fd = new FormData(); fd.append('convert_type', 'filesize'); fd.append('from_unit', val('calc_filesize_from')); fd.append('to_unit', val('calc_filesize_to')); fd.append('number', val('calc_filesize_num')); runAction('/api/calc/convert', fd, 'out_calc_filesize'); });
    on('run_calc_days', function(){ var fd = new FormData(); fd.append('date1', val('calc_d1')); fd.append('date2', val('calc_d2')); runAction('/api/calc/days-between', fd, 'out_calc_days'); });
    on('run_calc_age', function(){ var fd = new FormData(); fd.append('birth_date', val('calc_birth')); runAction('/api/calc/age', fd, 'out_calc_age'); });
    on('run_calc_cycle', async function(){
      var fd = new FormData();
      fd.append('last_period_date', val('calc_cycle_last'));
      fd.append('cycle_length', val('calc_cycle_len'));
      fd.append('period_length', val('calc_cycle_period'));
      fd.append('months', val('calc_cycle_months'));
      set('out_calc_cycle', 'Processando...');
      var box = byId('calc_cycle_calendar');
      if(box) box.innerHTML = '';
      try {
        var data = await postForm('/api/calc/cycle-support', fd);
        renderCycleCalendar('out_calc_cycle', 'calc_cycle_calendar', data);
        showPartnerGiftPopup(data);
      } catch(err){
        set('out_calc_cycle', err.message || 'Erro ao processar.');
      }
    });
    on('run_calc_cycle_women', async function(){ var fd = new FormData(); fd.append('last_period_date', val('calc_w_cycle_last')); fd.append('cycle_length', val('calc_w_cycle_len')); fd.append('period_length', val('calc_w_period_len')); fd.append('months', val('calc_w_months')); set('out_calc_cycle_women', 'Processando...'); var box = byId('calc_cycle_calendar_women'); if(box) box.innerHTML = ''; try { var data = await postForm('/api/calc/cycle-women', fd); renderCycleCalendar('out_calc_cycle_women', 'calc_cycle_calendar_women', data); } catch(err){ set('out_calc_cycle_women', err.message || 'Erro ao processar.'); } });
    on('run_well_bmi', async function(){
      var fd = new FormData();
      fd.append('weight', val('well_bmi_weight'));
      fd.append('height', val('well_bmi_height'));
      runAction('/api/wellness/bmi', fd, 'out_well_bmi');
    });

    var breathTimer = null;
    var breathIn = true;
    var breathSeq = [];
    var breathIdx = 0;

    function setBreathState(isIn, phaseText){
      breathIn = !!isIn;
      var ball = byId('well_breath_ball');
      var phase = byId('well_breath_phase');
      if(ball) ball.classList.toggle('is-in', breathIn);
      if(phase) phase.textContent = phaseText || (breathIn ? 'Inspire devagar...' : 'Expire devagar...');
      var msgs = [
        'Você está indo muito bem. Continue respirando.',
        'Um ciclo de cada vez. Você consegue.',
        'Respire com calma. Seu corpo está desacelerando.',
        'Tudo bem pausar. Você está cuidando de você.'
      ];
      set('out_well_breath', msgs[Math.floor(Math.random()*msgs.length)]);
    }

    function clearBreathTimer(){
      if(breathTimer){ clearTimeout(breathTimer); breathTimer = null; }
    }

    function runBreathStep(){
      if(!breathSeq.length) return;
      var step = breathSeq[breathIdx % breathSeq.length];
      setBreathState(step.state, step.label);
      breathIdx += 1;
      clearBreathTimer();
      breathTimer = setTimeout(runBreathStep, step.ms);
    }

    function setBreathPresetUI(type){
      var b478 = byId('run_well_breath_478');
      var b424 = byId('run_well_breath_424');
      if(b478){
        b478.classList.remove('alt');
        if(type !== '478') b478.classList.add('alt');
        b478.setAttribute('aria-pressed', type === '478' ? 'true' : 'false');
      }
      if(b424){
        b424.classList.remove('alt');
        if(type !== '424') b424.classList.add('alt');
        b424.setAttribute('aria-pressed', type === '424' ? 'true' : 'false');
      }
    }

    function startBreathingPreset(type){
      breathIdx = 0;
      if(type === '478'){
        breathSeq = [
          { label: 'Inspire por 4 segundos...', state: true, ms: 4000 },
          { label: 'Segure por 7 segundos...', state: true, ms: 7000 },
          { label: 'Expire por 8 segundos...', state: false, ms: 8000 }
        ];
        set('out_well_breath', 'Preset ativo: Respiração 4-7-8 (para relaxamento profundo).');
      } else {
        breathSeq = [
          { label: 'Inspire por 4 segundos...', state: true, ms: 4000 },
          { label: 'Segure por 2 segundos...', state: true, ms: 2000 },
          { label: 'Expire por 4 segundos...', state: false, ms: 4000 }
        ];
        set('out_well_breath', 'Preset ativo: Respiração 4-2-4 (neutralizar crises).');
      }
      setBreathPresetUI(type);
      runBreathStep();
    }

    function stopBreathing(){
      clearBreathTimer();
      var ball = byId('well_breath_ball');
      var phase = byId('well_breath_phase');
      if(ball) ball.classList.remove('is-in');
      if(phase) phase.textContent = 'Pronto para iniciar';
      set('out_well_breath', 'Respiração finalizada. Você fez um ótimo trabalho.');
    }

    on('run_well_breath_478', function(){ startBreathingPreset('478'); });
    on('run_well_breath_424', function(){ startBreathingPreset('424'); });
    on('run_well_breath_stop', function(){ setBreathPresetUI(''); stopBreathing(); });

  }

  function bindTimers(){
    function updateObsClockLinks(){
      var t = byId('calc_timer_sec');
      var timerLink = byId('obs_timer_link');
      var swLink = byId('obs_sw_link');
      if(timerLink){
        var sec = parseInt((t || {}).value || '60', 10);
        if(!sec || sec < 1) sec = 60;
        timerLink.setAttribute('href', '/timer/' + sec);
        timerLink.textContent = '/timer/' + sec;
      }
      if(swLink){
        swLink.setAttribute('href', '/cronometro');
        swLink.textContent = '/cronometro';
      }
    }

    var timerRef = null;
    var stopwatchRef = null;
    var timerEndAt = 0;
    var timerRemainingMs = 60000;
    var timerTotalMs = 60000;
    var stopwatchStartedAt = 0;
    var stopwatchElapsedMs = 0;
    var activeClockMode = null;
    var clockOverlay = null;
    var clockDisplay = null;
    var clockLabel = null;
    var clockHint = null;
    var clockExitBtn = null;
    var fsStartBtn = null;
    var fsPauseBtn = null;
    var fsStopBtn = null;
    var fsResetBtn = null;
    var clockControlHideTimer = null;
    var clockColor = '#39ff14';

    var colorChoices = [
      { label: 'Verde neon', value: '#39ff14' },
      { label: 'Vermelho', value: '#ff2b2b' },
      { label: 'Azul', value: '#2f7dff' },
      { label: '\u00c2mbar/laranja', value: '#ffad1f' },
      { label: 'Branco', value: '#f8fafc' }
    ];

    function pad2(n){ return String(Math.max(0, Math.floor(n))).padStart(2, '0'); }
    function formatClock(ms){
      ms = Math.max(0, Math.floor(Number(ms) || 0));
      var cs = Math.floor((ms % 1000) / 10);
      var totalSeconds = Math.floor(ms / 1000);
      var seconds = totalSeconds % 60;
      var minutes = Math.floor(totalSeconds / 60) % 60;
      var hours = Math.floor(totalSeconds / 3600);
      return pad2(hours) + ':' + pad2(minutes) + ':' + pad2(seconds) + ':' + pad2(cs);
    }

    function applyClockColor(color){
      clockColor = color || '#39ff14';
      if(clockDisplay) clockDisplay.style.setProperty('--clock-color', clockColor);
      document.querySelectorAll('.mt-clock-color-select').forEach(function(select){ select.value = clockColor; });
      document.querySelectorAll('.mt-clock-color-custom').forEach(function(input){ input.value = clockColor; });
    }

    function currentTimerMs(){
      if(timerRef) return Math.max(0, timerEndAt - performance.now());
      return timerRemainingMs;
    }
    function currentStopwatchMs(){
      if(stopwatchRef) return stopwatchElapsedMs + (performance.now() - stopwatchStartedAt);
      return stopwatchElapsedMs;
    }
    function currentClockMs(){ return activeClockMode === 'timer' ? currentTimerMs() : currentStopwatchMs(); }

    function setTimerOutput(ms, label){ set('out_calc_timer', (label ? label + ': ' : 'Tempo restante: ') + formatClock(ms)); }
    function setStopwatchOutput(ms){ set('out_calc_sw', formatClock(ms)); }

    function startTimerAction(){
      clearInterval(timerRef);
      var sec = parseInt((byId('calc_timer_sec') || {}).value || '0', 10);
      if(!sec || sec < 1){ set('out_calc_timer', 'Informe segundos válidos.'); return false; }
      timerTotalMs = sec * 1000;
      timerRemainingMs = timerTotalMs;
      timerEndAt = performance.now() + timerRemainingMs;
      setTimerOutput(timerRemainingMs);
      timerRef = setInterval(tickTimer, 31);
      return true;
    }

    function pauseTimerAction(){
      if(timerRef){ timerRemainingMs = currentTimerMs(); }
      clearInterval(timerRef);
      timerRef = null;
      setTimerOutput(timerRemainingMs, 'Temporizador pausado');
      updateOverlay();
    }

    function stopTimerAction(){
      clearInterval(timerRef);
      timerRef = null;
      timerRemainingMs = timerTotalMs || 0;
      setTimerOutput(timerRemainingMs, 'Temporizador parado');
      updateOverlay();
    }

    function resetTimerAction(){
      clearInterval(timerRef);
      timerRef = null;
      timerRemainingMs = timerTotalMs || ((parseInt((byId('calc_timer_sec') || {}).value || '0', 10) || 0) * 1000);
      setTimerOutput(timerRemainingMs, 'Temporizador zerado');
      updateOverlay();
    }

    function startSwAction(){
      if(stopwatchRef) return false;
      stopwatchStartedAt = performance.now();
      stopwatchRef = setInterval(tickStopwatch, 31);
      tickStopwatch();
      return true;
    }

    function pauseSwAction(){
      if(stopwatchRef){ stopwatchElapsedMs = currentStopwatchMs(); }
      clearInterval(stopwatchRef);
      stopwatchRef = null;
      setStopwatchOutput(stopwatchElapsedMs);
      updateOverlay();
    }

    function stopSwAction(){
      clearInterval(stopwatchRef);
      stopwatchRef = null;
      stopwatchElapsedMs = 0;
      stopwatchStartedAt = 0;
      setStopwatchOutput(0);
      updateOverlay();
    }

    function resetSwAction(){
      clearInterval(stopwatchRef);
      stopwatchRef = null;
      stopwatchElapsedMs = 0;
      stopwatchStartedAt = 0;
      setStopwatchOutput(0);
      updateOverlay();
    }

    function updateOverlay(){
      if(!clockOverlay || !clockDisplay) return;
      clockDisplay.textContent = formatClock(currentClockMs());
      clockDisplay.setAttribute('aria-label', clockDisplay.textContent);
    }

    function tickTimer(){
      var remaining = currentTimerMs();
      timerRemainingMs = remaining;
      setTimerOutput(remaining);
      updateOverlay();
      if(remaining <= 0){
        clearInterval(timerRef);
        timerRef = null;
        timerRemainingMs = 0;
        setTimerOutput(0, 'Tempo encerrado');
        if(clockOverlay) clockOverlay.classList.add('is-finished');
      }
    }

    function tickStopwatch(){ setStopwatchOutput(currentStopwatchMs()); updateOverlay(); }

    function ensureOverlay(){
      if(clockOverlay) return clockOverlay;
      clockOverlay = document.createElement('div');
      clockOverlay.className = 'mt-clock-fullscreen';
      clockOverlay.setAttribute('role', 'dialog');
      clockOverlay.setAttribute('aria-modal', 'true');
      clockOverlay.innerHTML = [
        '<div class="mt-clock-panel">',
          '<div class="mt-clock-display" style="--clock-color: ' + clockColor + '">00:00:00:00</div>',
          '<div class="mt-clock-fs-actions">',
            '<button class="btn" type="button" data-fs-action="start">Iniciar</button>',
            '<button class="btn alt" type="button" data-fs-action="pause">Pausar</button>',
            '<button class="btn alt" type="button" data-fs-action="stop">Parar</button>',
            '<button class="btn alt" type="button" data-fs-action="reset">Zerar</button>',
          '</div>',
        '</div>'
      ].join('');
      document.body.appendChild(clockOverlay);
      clockDisplay = clockOverlay.querySelector('.mt-clock-display');
      fsStartBtn = clockOverlay.querySelector('[data-fs-action="start"]');
      fsPauseBtn = clockOverlay.querySelector('[data-fs-action="pause"]');
      fsStopBtn = clockOverlay.querySelector('[data-fs-action="stop"]');
      fsResetBtn = clockOverlay.querySelector('[data-fs-action="reset"]');
      clockLabel = null;
      clockHint = null;
      clockExitBtn = null;
      if(fsStartBtn) fsStartBtn.addEventListener('click', function(){ revealClockControls(); if(activeClockMode === 'timer') startTimerAction(); else startSwAction(); });
      if(fsPauseBtn) fsPauseBtn.addEventListener('click', function(){ revealClockControls(); if(activeClockMode === 'timer') pauseTimerAction(); else pauseSwAction(); });
      if(fsStopBtn) fsStopBtn.addEventListener('click', function(){ revealClockControls(); if(activeClockMode === 'timer') stopTimerAction(); else stopSwAction(); });
      if(fsResetBtn) fsResetBtn.addEventListener('click', function(){ revealClockControls(); if(activeClockMode === 'timer') resetTimerAction(); else resetSwAction(); });
      clockOverlay.addEventListener('mousemove', function(ev){
        var h = window.innerHeight || document.documentElement.clientHeight || 0;
        if(h && ev.clientY >= (h - 140)) revealClockControls();
      });
      clockOverlay.addEventListener('touchstart', function(){ revealClockControls(); }, { passive: true });
      return clockOverlay;
    }

    function revealClockControls(){
      if(!clockOverlay) return;
      clockOverlay.classList.add('show-controls');
      if(clockControlHideTimer) clearTimeout(clockControlHideTimer);
      clockControlHideTimer = setTimeout(function(){
        if(clockOverlay) clockOverlay.classList.remove('show-controls');
      }, 1800);
    }

    function openClockFullscreen(mode){
      activeClockMode = mode;
      ensureOverlay();
      clockOverlay.classList.remove('is-finished');
      clockOverlay.classList.add('is-open');
      document.body.classList.add('mt-clock-lock');
      applyClockColor(clockColor);
      updateOverlay();
      var req = clockOverlay.requestFullscreen || clockOverlay.webkitRequestFullscreen || clockOverlay.msRequestFullscreen;
      if(req){ try { req.call(clockOverlay); } catch(_e) {} }
      setTimeout(function(){ if(clockDisplay) clockDisplay.focus && clockDisplay.focus(); }, 50);
    }

    function closeClockFullscreen(){
      if(!clockOverlay) return;
      if(clockControlHideTimer) clearTimeout(clockControlHideTimer);
      clockOverlay.classList.remove('is-open', 'is-finished', 'show-controls');
      document.body.classList.remove('mt-clock-lock');
      var isFull = document.fullscreenElement || document.webkitFullscreenElement || document.msFullscreenElement;
      if(isFull){
        var exit = document.exitFullscreen || document.webkitExitFullscreen || document.msExitFullscreen;
        if(exit){ try { exit.call(document); } catch(_e) {} }
      }
    }

    function buildClockControls(section, mode){
      if(!section || section.querySelector('.mt-clock-controls')) return;
      var controls = document.createElement('div');
      controls.className = 'mt-clock-controls';
      var colorId = 'mt_clock_color_' + mode;
      var customId = 'mt_clock_custom_' + mode;
      controls.innerHTML = [
        '<label class="mt-clock-field" for="' + colorId + '">Cor dos n\u00fameros',
          '<select id="' + colorId + '" class="mt-clock-color-select"></select>',
        '</label>',
        '<label class="mt-clock-field mt-clock-custom-field" for="' + customId + '">Cor personalizada',
          '<input id="' + customId + '" class="mt-clock-color-custom" type="color" value="' + clockColor + '">',
        '</label>',
        '<button class="btn mt-clock-fullscreen-btn" type="button" data-clock-mode="' + mode + '">Tela cheia</button>'
      ].join('');
      var select = controls.querySelector('select');
      colorChoices.forEach(function(item){
        var opt = document.createElement('option');
        opt.value = item.value;
        opt.textContent = item.label;
        select.appendChild(opt);
      });
      var actionRow = section.querySelector('.mt-action-row, .mt-form-row');
      if(actionRow) actionRow.insertAdjacentElement('afterend', controls);
      else section.appendChild(controls);
      select.value = clockColor;
      var custom = controls.querySelector('input[type="color"]');
      select.addEventListener('change', function(){ applyClockColor(select.value); });
      custom.addEventListener('input', function(){ applyClockColor(custom.value); });
      controls.querySelector('.mt-clock-fullscreen-btn').addEventListener('click', function(){ openClockFullscreen(mode); });
    }

    document.addEventListener('keydown', function(ev){
      if(ev.key === 'Escape' && clockOverlay && clockOverlay.classList.contains('is-open')) closeClockFullscreen();
    });

    buildClockControls(byId('tab-calc-timer'), 'timer');
    buildClockControls(byId('tab-calc-stopwatch'), 'stopwatch');
    setTimerOutput(timerRemainingMs);
    setStopwatchOutput(0);

    var startTimer = byId('run_calc_timer');
    if(startTimer){ startTimer.addEventListener('click', startTimerAction); }
    var stopTimer = byId('stop_calc_timer');
    if(stopTimer){ stopTimer.addEventListener('click', pauseTimerAction); }

    var timerRange = byId('calc_timer_sec');
    if(timerRange){
      timerRange.addEventListener('input', function(){
        if(timerRef) return;
        timerRemainingMs = (parseInt(timerRange.value || '0', 10) || 0) * 1000;
        timerTotalMs = timerRemainingMs;
        setTimerOutput(timerRemainingMs);
        updateOverlay();
        updateObsClockLinks();
      });
    }

    updateObsClockLinks();

    var startSw = byId('run_calc_sw');
    if(startSw){ startSw.addEventListener('click', startSwAction); }
    var stopSw = byId('stop_calc_sw');
    if(stopSw){ stopSw.addEventListener('click', pauseSwAction); }
    var resetSw = byId('reset_calc_sw');
    if(resetSw){ resetSw.addEventListener('click', resetSwAction); }
  }

  function bindOnlineDownloadTool(){
    var run = byId('runYoutube');
    var input = byId('youtubeUrl');
    var result = byId('youtubeResult');
    var status = byId('youtubeStatus');
    var err = byId('youtubeErr');
    var quality = byId('youtubeQuality');
    var bitrate = byId('youtubeBitrate');
    var options = byId('youtubeOptions');
    var videoOptions = byId('youtubeVideoOptions');
    var audioOptions = byId('youtubeAudioOptions');
    var modeInputs = Array.prototype.slice.call(document.querySelectorAll('input[name="youtubeMode"]'));
    if(!run || !input || !result) return;

    var analyzeTimer = null;
    var lastAnalyzed = '';

    function setSelectOptions(select, items, emptyLabel){
      if(!select) return;
      select.innerHTML = '';
      if(!items || !items.length){
        var empty = document.createElement('option');
        empty.value = 'best';
        empty.textContent = emptyLabel || 'Melhor dispon\u00edvel';
        select.appendChild(empty);
        return;
      }
      items.forEach(function(item, index){
        var opt = document.createElement('option');
        opt.value = item.value;
        opt.textContent = item.label;
        if(index === 0) opt.selected = true;
        select.appendChild(opt);
      });
    }

    function setLoadingFormats(message){
      setSelectOptions(quality, [{ value: 'best', label: message || 'Processando...' }]);
      setSelectOptions(bitrate, [{ value: 'best', label: message || 'Analisando \u00e1udio real...' }]);
    }

    function setAutomaticFormats(){
      setSelectOptions(quality, [{ value: 'best', label: 'Autom\u00e1tico: melhor dispon\u00edvel por link' }]);
      setSelectOptions(bitrate, [{ value: 'best', label: 'Autom\u00e1tico: melhor \u00e1udio por link' }]);
    }

    async function loadRealFormats(){
      var links = mediaLinks();
      if(!links.length){
        lastAnalyzed = '';
        setLoadingFormats('Cole um link para continuar');
        if(status) status.textContent = '';
        return;
      }
      if(links.length > 1){
        lastAnalyzed = links.join('\\n');
        setAutomaticFormats();
        if(status) status.textContent = 'V\u00e1rios links detectados: cada v\u00eddeo ser\u00e1 baixado na melhor qualidade dispon\u00edvel.';
        return;
      }
      var link = links[0];
      if(link === lastAnalyzed) return;
      lastAnalyzed = link;
      setLoadingFormats();
      if(status) status.textContent = 'Processando...';
      var fd = new FormData();
      fd.append('url', link);
      try {
        var data = await postForm('/api/online/formats', fd);
        setSelectOptions(quality, data.video || [], 'Melhor qualidade dispon\u00edvel');
        setSelectOptions(bitrate, data.audio || [], 'Melhor \u00e1udio dispon\u00edvel');
        if(status) status.textContent = 'Processando...';
      } catch(errObj) {
        setAutomaticFormats();
        if(status) status.textContent = '';
        if(err){ err.textContent = errObj.message || 'Não foi possível processar este link.'; err.classList.remove('hidden'); }
      }
    }

    setLoadingFormats('Cole um link para continuar');

    function syncDownloadOptions(){
      var mode = selectedMode();
      if(options) options.classList.remove('hidden');
      if(videoOptions) videoOptions.classList.toggle('hidden', mode !== 'video');
      if(audioOptions) audioOptions.classList.toggle('hidden', mode !== 'audio');
    }

    function showError(message){
      if(err){ err.textContent = message; err.classList.remove('hidden'); }
      if(status) status.textContent = '';
      result.classList.add('hidden');
    }
    function clearError(){
      if(err){ err.textContent = ''; err.classList.add('hidden'); }
    }
    function selectedMode(){
      var checked = document.querySelector('input[name="youtubeMode"]:checked');
      return checked && checked.value === 'mp3' ? 'audio' : 'video';
    }
    modeInputs.forEach(function(input){ input.addEventListener('change', syncDownloadOptions); });
    syncDownloadOptions();
    input.addEventListener('input', function(){
      clearTimeout(analyzeTimer);
      analyzeTimer = setTimeout(loadRealFormats, 650);
    });
    input.addEventListener('paste', function(){
      clearTimeout(analyzeTimer);
      analyzeTimer = setTimeout(loadRealFormats, 120);
    });
    function mediaLinks(){
      return String(input.value || '').split(/\s+/).map(function(x){ return x.trim(); }).filter(Boolean);
    }
    function renderMany(items){
      result.classList.remove('hidden');
      result.classList.add('mt-output-zone');
      result.innerHTML = '<strong>Downloads prontos:</strong>';
      var list = document.createElement('div');
      list.className = 'mt-result-actions';
      items.forEach(function(item, index){
        var a = document.createElement('a');
        a.href = item.url;
        a.className = 'btn alt';
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        a.textContent = 'Abrir ou baixar ' + (item.filename || ('arquivo ' + (index + 1)));
        list.appendChild(a);
      });
      result.appendChild(list);
    }

    async function resumePreviousDownload(){
      var jobId = savedDownloadJob();
      if(!jobId) return;
      clearError();
      result.classList.add('hidden');
      result.innerHTML = '';
      if(status) status.textContent = 'Retomando processamento...';
      run.disabled = true;
      try {
        var data = await pollJob(jobId, status, 'Processando...');
        if(status) status.textContent = 'Arquivo pronto.';
        renderFormattedResult(result, formatResponse(data));
        result.classList.remove('hidden');
      } catch(errObj) {
        showError(errObj.message || 'Não foi possível concluir este download agora.');
      } finally {
        run.disabled = false;
      }
    }
    resumePreviousDownload();

    run.addEventListener('click', async function(){
      var links = mediaLinks();
      if(!links.length){ showError('Cole pelo menos um link de v\u00eddeo.'); return; }
      clearError();
      if(links.length === 1 && links[0] !== lastAnalyzed){ await loadRealFormats(); }
      result.classList.add('hidden');
      result.innerHTML = '';
      if(status) status.textContent = 'Processando...';
      run.disabled = true;
      try {
        var readyFiles = [];
        for(var i = 0; i < links.length; i += 1){
          if(status) status.textContent = 'Processando ' + (i + 1) + ' de ' + links.length + '...';
          var fd = new FormData();
          fd.append('url', links[i]);
          fd.append('mode', selectedMode());
          fd.append('quality', quality && quality.value ? quality.value : '720');
          fd.append('bitrate', bitrate && bitrate.value ? bitrate.value : '192');
          var data = await postJob('/api/online/download-job', fd, status, 'Processando ' + (i + 1) + ' de ' + links.length + '...');
          readyFiles.push(data);
        }
        if(status) status.textContent = 'Conclu\u00eddo.';
        if(readyFiles.length === 1){
          renderFormattedResult(result, formatResponse(readyFiles[0]));
          result.classList.remove('hidden');
        } else {
          renderMany(readyFiles);
        }
      } catch(errObj) {
        showError(errObj.message || 'N\u00e3o foi poss\u00edvel baixar este v\u00eddeo agora.');
      } finally {
        run.disabled = false;
      }
    });
  }

  function removePublishedEmptyPlaceholders(){
    var fragments = [
      'Nenhuma ferramenta publicada',
      'publicada nesta categoria',
      'foi preservada',
      'futura do painel',
      'Esta área foi preservada',
      'Esta area foi preservada',
      'expansão futura do painel',
      'expansão futura do painel'
    ];

    function textOf(el){
      return (el && el.textContent ? el.textContent : '').replace(/\s+/g, ' ').trim();
    }
    function hasPlaceholderText(el){
      var text = textOf(el);
      return fragments.some(function(fragment){ return text.indexOf(fragment) !== -1; });
    }
    function hasRealToolControls(el){
      return !!(el && el.querySelector('form, input, select, textarea, button, canvas, video, audio, iframe, img, a[href]'));
    }

    document.querySelectorAll('.note, .drop, .mt-empty, .empty-state, .placeholder, p, div').forEach(function(el){
      if(!hasPlaceholderText(el)) return;
      if(hasRealToolControls(el)) return;
      el.remove();
    });
  }

  function watchPublishedEmptyPlaceholders(){
    removePublishedEmptyPlaceholders();
    var observer = new MutationObserver(function(){ removePublishedEmptyPlaceholders(); });
    observer.observe(document.body, { childList: true, subtree: true, characterData: true });
  }


  function bindInstagramTools(){
    var shell = document.querySelector('.instagram-workbench');
    var urlInput = byId('instagramUrl');
    var status = byId('instagramStatus');
    var err = byId('instagramErr');
    var result = byId('instagramResult');
    var progressRow = byId('instagramProgressRow');
    var progressText = byId('instagramProgressText');
    var pasteBtn = byId('instagramPaste');
    var clearBtn = byId('instagramClear');
    var cards = Array.prototype.slice.call(document.querySelectorAll('.instagram-action-card'));
    if(!urlInput || !cards.length) return;

    var labels = {
      video: 'Baixando vídeo...',
      videos: 'Montando carrossel...',
      transcript: 'Gerando transcrição...',
      images: 'Baixando imagens...',
      ocr: 'Executando OCR...'
    };

    function cleanUrl(){ return String(urlInput.value || '').trim(); }
    function setShellState(name, active){ if(shell) shell.classList.toggle(name, !!active); }
    function updateReadyState(){
      var hasLink = cleanUrl().length > 0;
      setShellState('has-link', hasLink);
      cards.forEach(function(card){ card.classList.toggle('is-ready', hasLink); });
      if(!hasLink && status) status.textContent = '';
    }
    function setBusy(active, current){
      setShellState('is-processing', active);
      cards.forEach(function(card){
        card.disabled = !!active;
        card.setAttribute('aria-busy', active ? 'true' : 'false');
        card.classList.toggle('is-running', !!active && card === current);
      });
      if(pasteBtn) pasteBtn.disabled = !!active;
      if(clearBtn) clearBtn.disabled = !!active;
      if(progressRow) progressRow.classList.toggle('hidden', !active);
    }
    function getStickyHeaderOffset(){
      var header = document.querySelector('.header');
      if(!header) return 18;
      var style = window.getComputedStyle(header);
      if(style.position !== 'sticky' && style.position !== 'fixed') return 18;
      var rect = header.getBoundingClientRect();
      var offset = Math.max(rect.bottom, 0) + 18;
      return Math.min(Math.max(offset, 18), 190);
    }
    function scrollNodeIntoSafeView(node){
      if(!node) return;
      var top = node.getBoundingClientRect().top + window.pageYOffset - getStickyHeaderOffset();
      var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      window.scrollTo({
        top: Math.max(0, top),
        behavior: reduceMotion ? 'auto' : 'smooth'
      });
    }
    function showError(message){
      setShellState('has-error', true);
      setShellState('has-result', false);
      if(err){ err.textContent = message || 'Não foi possível processar este link.'; err.classList.remove('hidden'); }
      if(status) status.textContent = '';
      if(progressRow) progressRow.classList.add('hidden');
      if(result){ result.classList.add('hidden'); result.innerHTML = ''; }
      window.requestAnimationFrame(function(){ scrollNodeIntoSafeView(err); });
    }
    function clearError(){
      setShellState('has-error', false);
      if(err){ err.textContent = ''; err.classList.add('hidden'); }
    }
    function resetResult(){
      setShellState('has-result', false);
      if(result){ result.classList.add('hidden'); result.innerHTML = ''; }
    }

    urlInput.addEventListener('input', function(){
      clearError();
      resetResult();
      updateReadyState();
      if(status) status.textContent = cleanUrl() ? 'Pronto.' : '';
    });

    if(clearBtn){
      clearBtn.addEventListener('click', function(){
        urlInput.value = '';
        clearError();
        resetResult();
        updateReadyState();
        urlInput.focus();
      });
    }

    if(pasteBtn){
      pasteBtn.addEventListener('click', async function(){
        clearError();
        try{
          if(navigator.clipboard && navigator.clipboard.readText){
            var text = await navigator.clipboard.readText();
            if(text){ urlInput.value = text.trim(); }
          }
          updateReadyState();
          if(status) status.textContent = cleanUrl() ? 'Link colado.' : 'Cole o link no campo.';
          urlInput.focus();
        } catch(_err){
          if(status) status.textContent = 'Cole manualmente com Ctrl+V.';
          urlInput.focus();
        }
      });
    }

    cards.forEach(function(card){
      card.addEventListener('click', async function(){
        var action = card.getAttribute('data-ig-action') || 'video';
        var url = cleanUrl();
        if(!url){
          showError('Cole um link do Instagram.');
          urlInput.focus();
          return;
        }
        clearError();
        resetResult();
        var label = labels[action] || 'Processando Instagram...';
        if(status) status.textContent = label;
        if(progressText) progressText.textContent = label;
        setBusy(true, card);
        try{
          var fd = new FormData();
          fd.append('url', url);
          fd.append('action', action);
          var data = await postForm('/api/online/instagram-tools', fd);
          if(status) status.textContent = 'Concluído.';
          if(result){
            renderFormattedResult(result, formatResponse(data));
            result.classList.remove('hidden');
            setShellState('has-result', true);
            window.requestAnimationFrame(function(){ scrollNodeIntoSafeView(result); });
          }
        } catch(error){
          showError(error && error.message ? error.message : 'Não foi possível processar este link do Instagram.');
        } finally {
          setBusy(false, null);
          updateReadyState();
        }
      });
    });

    updateReadyState();
  }

  function bindFullUiUxPolish(){
    var resultIds = [
      'list','mergeResult','rotateOut','splitList','compressList','word2pdfList','protectList','pdf2pngList','removeBgList',
      'youtubeResult','youtubeBatchList','youtubeClipResult','instagramResult','videoList'
    ];
    resultIds.forEach(function(id){
      var el = byId(id);
      if(!el) return;
      el.classList.add('mt-output-zone');
      el.setAttribute('aria-live', 'polite');
      el.setAttribute('role', 'status');
    });

    document.querySelectorAll('.mt-inline-result, .mt-extra-result, .errmsg, .small[id$="Status"]').forEach(function(el){
      el.setAttribute('aria-live', 'polite');
    });

    var labels = {
      file: 'Arquivos para OCR', filesMerge: 'Arquivos para organizar PDF', filesRotate: 'Arquivos para girar',
      fileSplit: 'PDF para particionar', filesCompress: 'PDFs para comprimir', filesWord2Pdf: 'Arquivos Word',
      filesProtect: 'PDFs para proteger', filesPdf2Png: 'PDFs para converter em PNG', filesRemoveBg: 'Imagens para remover fundo',
      fileVideo: 'Vídeo para dividir', youtubeUrl: 'Links de vídeo', youtubeClipUrl: 'Link do vídeo para clipar',
      instagramUrl: 'Link do Instagram', youtubeClipStart: 'Início do clipe', youtubeClipEnd: 'Fim do clipe',
      youtubeQuality: 'Qualidade do vídeo', youtubeBitrate: 'Qualidade do áudio', youtubeClipQuality: 'Qualidade do clipe',
      compressQuality: 'Nível de compressão', protectPassword: 'Senha do PDF', protectPassword2: 'Confirmação da senha',
      maxmb: 'Tamanho máximo por parte', every: 'Páginas por parte', ranges: 'Intervalos personalizados', sizeMb: 'Tamanho por parte em MB'
    };
    Object.keys(labels).forEach(function(id){
      var el = byId(id);
      if(el && !el.getAttribute('aria-label')) el.setAttribute('aria-label', labels[id]);
    });

    document.querySelectorAll('.section').forEach(function(section){
      section.classList.add('mt-section-polished');
      var title = section.querySelector('.title');
      if(title) title.classList.add('mt-tool-heading');
      var sub = section.querySelector('.sub');
      if(sub) sub.classList.add('mt-tool-subtitle');
    });

    document.querySelectorAll('.section .inputs').forEach(function(row){
      if(row.closest('.mt-card-form')) return;
      row.classList.add('mt-legacy-controls');
    });

    document.querySelectorAll('.section input[type="text"], .section input[type="number"], .section input[type="url"], .section input[type="date"], .section input[type="password"], .section select, .section textarea').forEach(function(el){
      if(!el.placeholder) return;
      if(el.placeholder.indexOf('...') !== -1) el.placeholder = el.placeholder.replace('...', '?');
    });
  }
  ready(function(){
    setupTabs();
    bindExtraForms();
    bindFileDropZones();
    bindLegacyFileTools();
    bindOnlineDownloadTool();
    bindInstagramTools();
    bindQaFieldHints();
    bindQaFlowTweaks();
    bindRangeOutputs();
    bindTextTools();
    bindRemoteTools();
    bindLinuxCommandDictionary();
    bindVisualRandomTools();
    bindTimers();
    bindFullUiUxPolish();
    watchPublishedEmptyPlaceholders();
  });
})();


(function(){
  document.addEventListener('click', async function(ev){
    var btn = ev.target && ev.target.closest ? ev.target.closest('.footer-pix-copy[data-copy-pix]') : null;
    if(!btn) return;
    var key = btn.getAttribute('data-copy-pix') || '';
    if(!key) return;
    var prev = btn.textContent;
    try{
      if(navigator.clipboard && navigator.clipboard.writeText){
        await navigator.clipboard.writeText(key);
      } else {
        var ta = document.createElement('textarea');
        ta.value = key; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); ta.remove();
      }
      btn.textContent = 'Copiado!';
      btn.classList.add('is-copied');
    }catch(_e){
      btn.textContent = 'Falhou';
      btn.classList.add('is-copied');
    }
    setTimeout(function(){ btn.textContent = prev; btn.classList.remove('is-copied'); }, 1800);
  });
})();
