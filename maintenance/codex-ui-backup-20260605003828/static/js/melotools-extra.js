(function(){
  function findOut(form){
    return form.parentElement.querySelector('.mt-res');
  }
  function friendly(endpoint, data){
    if(data.url){
      return `Pronto. <a target="_blank" href="${data.url}">Baixar: ${data.filename||'resultado'}</a>`;
    }
    if(endpoint.includes('/api/dev/ipcalc') && data.result){
      return `Rede: ${data.result.network}
M?scara: ${data.result.mask}
Broadcast: ${data.result.broadcast}
Hosts: ${data.result.hosts}`;
    }
    if(endpoint.includes('/api/random/coin')) return `Resultado: ${String(data.result||'').toUpperCase()}`;
    if(endpoint.includes('/api/random/dice')) return `Resultado do dado: ${data.result}`;
    if(endpoint.includes('/api/random/')) return Array.isArray(data.result) ? 'Resultado: ' + data.result.join(', ') : `Resultado: ${data.result}`;
    if(endpoint.includes('/api/calc/')) return `Resultado: ${data.result}`;
    if(endpoint.includes('/api/dev/password')) return `Senha gerada: ${data.result}`;
    if(endpoint.includes('/api/dev/port-test')) return `Status da porta: ${data.result}`;
    if(endpoint.includes('/api/dev/dns')) return 'Consulta DNS conclu?da:
' + JSON.stringify(data.result, null, 2);
    if(endpoint.includes('/api/dev/whois')) return 'Consulta WHOIS conclu?da:
' + JSON.stringify(data.result, null, 2);
    if(endpoint.includes('/api/text/process')) return data.result;
    return (typeof data.result==='object') ? JSON.stringify(data.result,null,2) : (data.result || JSON.stringify(data.values||data));
  }
  async function onSubmit(ev){
    ev.preventDefault();
    const form=ev.currentTarget;
    const out=findOut(form); if(out) out.textContent='Processando...';
    try{
      const r=await fetch(form.dataset.endpoint,{method:'POST',body:new FormData(form)});
      const j=await r.json();
      if(!j.ok){ if(out) out.textContent=j.message||'N?o foi poss?vel concluir.'; return; }
      if(out) out.innerHTML=friendly(form.dataset.endpoint,j).replace(/
/g,'<br>');
    }catch(e){ if(out) out.textContent='Erro inesperado ao processar. Tente novamente.'; }
  }
  function bind(){
    document.querySelectorAll('form.mt-api-form').forEach((f)=>{ if(!f.__bound){ f.__bound=true; f.addEventListener('submit', onSubmit); }});
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', bind); else bind();

  let ti=null; const ts=document.getElementById('mt-timer-start');
  if(ts){ ts.onclick=()=>{ clearInterval(ti); let left=parseInt(document.getElementById('mt-timer-seconds').value||'0',10); const o=document.getElementById('mt-timer-out'); o.textContent=String(left); ti=setInterval(()=>{left--; o.textContent=String(left); if(left<=0){clearInterval(ti); o.textContent='Tempo encerrado';}},1000); }; }
  let si=null, sv=0; const s1=document.getElementById('mt-sw-start'), s2=document.getElementById('mt-sw-stop');
  if(s1&&s2){ s1.onclick=()=>{ if(si) return; si=setInterval(()=>{sv+=0.1; document.getElementById('mt-sw-out').textContent=sv.toFixed(1)+'s';},100); }; s2.onclick=()=>{ clearInterval(si); si=null; }; }
})();