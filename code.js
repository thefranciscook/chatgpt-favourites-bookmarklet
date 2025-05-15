javascript:(function(){
  function getChatUrl(){const m=window.location.pathname.match(/\/c\/[a-zA-Z0-9\-]+/);return m?window.location.origin+m[0]:window.location.href;}
  function getAssistantMessages(){return Array.from(document.querySelectorAll('[data-message-author-role="assistant"][data-message-id]'));}
  const LS_KEY='chatgpt_favorites_v1';
  function getFavorites(){try{return JSON.parse(localStorage.getItem(LS_KEY)||'[]');}catch{return[];}}
  function saveFavorites(favs){localStorage.setItem(LS_KEY,JSON.stringify(favs));}
  function decorateMessages(){
    getAssistantMessages().forEach(msg=>{
      if(msg.querySelector('.fav-star-bookmarklet'))return;
      const id=msg.getAttribute('data-message-id');
      const url=getChatUrl();
      const favs=getFavorites();
      const isFav=favs.some(f=>f.chatUrl===url&&f.messageId===id);
      const star=document.createElement('span');
      star.textContent=isFav?'⭐':'☆';
      star.className='fav-star-bookmarklet';
      star.style.cssText='cursor:pointer;font-size:1.3em;user-select:none;float:right;margin-left:0.5em;transition:color 0.2s;';
      star.title=isFav?"Remove from favorites":"Add to favorites";
      star.onclick=e=>{
        e.stopPropagation();
        let favs=getFavorites();
        if(favs.some(f=>f.chatUrl===url&&f.messageId===id)){
          favs=favs.filter(f=>!(f.chatUrl===url&&f.messageId===id));
          star.textContent='☆';
        }else{
          favs.push({chatUrl:url,messageId:id,snippet:msg.textContent.slice(0,80).replace(/\s+/g,' '),timestamp:Date.now()});
          star.textContent='⭐';
        }
        saveFavorites(favs);
        star.title=star.textContent==='⭐'?"Remove from favorites":"Add to favorites";
      };
      msg.insertBefore(star,msg.firstChild);
    });
  }
  const obs=new MutationObserver(()=>{setTimeout(decorateMessages,200);});
  obs.observe(document.body,{childList:true,subtree:true});
  decorateMessages();
  function chatTitleFromSnippet(snippets){
    if(snippets.length==1) return snippets[0].slice(0,32)+"...";
    let all=snippets.join(" ").split(" ").filter(w=>w.length>2);
    let freq={};all.forEach(w=>freq[w]=(freq[w]||0)+1);
    let common=Object.entries(freq).sort((a,b)=>b[1]-a[1]).slice(0,4).map(e=>e[0]);
    return common.length?common.join(" "):snippets[0].slice(0,32)+"...";
  }
  function showFavPanel(){
    if(document.getElementById('fav-panel-bookmarklet'))return;
    const panel=document.createElement('div');
    panel.id='fav-panel-bookmarklet';
    panel.style.cssText='position:fixed;top:64px;right:24px;z-index:99999;background:white;color:black;box-shadow:0 2px 16px #888;border-radius:12px;max-width:350px;width:92vw;padding:0.7em 0.8em;font-family:sans-serif;max-height:66vh;overflow:auto;font-size:13px;';
    panel.innerHTML='<div style="font-weight:bold;font-size:14px;margin-bottom:0.3em;">⭐ Favorites <button id="close-fav-bookmarklet" style="float:right;font-size:1.1em;border:none;background:transparent;cursor:pointer;">&times;</button></div><div style="margin-bottom:0.5em;"><button id="export-fav-bookmarklet" style="font-size:12px;margin-right:0.8em;">⬇️ Export</button><button id="import-fav-bookmarklet" style="font-size:12px;">⬆️ Import</button><input type="file" id="import-fav-file" accept="application/json" style="display:none;"></div><div id="fav-list-bookmarklet"></div>';
    document.body.appendChild(panel);
    document.getElementById('close-fav-bookmarklet').onclick=()=>panel.remove();
    // Export
    document.getElementById('export-fav-bookmarklet').onclick=function(){
      const favs=getFavorites();
      const blob=new Blob([JSON.stringify(favs,null,2)],{type:"application/json"});
      const url=URL.createObjectURL(blob);
      const a=document.createElement('a');
      a.href=url;a.download="chatgpt-favorites.json";
      document.body.appendChild(a);a.click();setTimeout(()=>{document.body.removeChild(a);URL.revokeObjectURL(url);},100);
    };
    // Import
    document.getElementById('import-fav-bookmarklet').onclick=function(){
      document.getElementById('import-fav-file').click();
    };
    document.getElementById('import-fav-file').onchange=function(e){
      const file=e.target.files[0];
      if(!file)return;
      const reader=new FileReader();
      reader.onload=function(ev){
        try{
          const imported=JSON.parse(ev.target.result);
          let favs=getFavorites();
          // Merge by (chatUrl, messageId), keeping newest
          const byKey={};
          favs.concat(imported).forEach(f=>{
            const key=f.chatUrl+"||"+f.messageId;
            if(!byKey[key]||f.timestamp>byKey[key].timestamp) byKey[key]=f;
          });
          const merged=Object.values(byKey);
          saveFavorites(merged);
          alert("Imported! Favorites merged: "+merged.length);
          renderFavList();
          decorateMessages();
        }catch(err){alert("Error importing favorites: "+err);}
      };
      reader.readAsText(file);
      this.value="";
    };
    renderFavList();
  }
  function renderFavList(){
    const favs=getFavorites().sort((a,b)=>b.timestamp-a.timestamp);
    const list=document.getElementById('fav-list-bookmarklet');
    if(!favs.length){list.innerHTML="<div style='color:#888;'>No favorites yet.</div>";return;}
    // Group by chatUrl
    let grouped={};
    favs.forEach(f=>{
      if(!grouped[f.chatUrl])grouped[f.chatUrl]=[];
      grouped[f.chatUrl].push(f);
    });
    list.innerHTML=Object.keys(grouped).map((chatUrl,idx)=>{
      const snippets=grouped[chatUrl].map(f=>f.snippet);
      const title=chatTitleFromSnippet(snippets);
      return `<div style="margin-bottom:0.4em;">
        <div style="font-weight:bold;font-size:13px;color:#3d5a80;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:95%;">${title}</div>
        <div style="margin-left:0.9em;">
          ${grouped[chatUrl].map(f=>`
            <div style="margin:0.3em 0 0.2em 0;padding:0.18em 0.2em;border-left:2px solid #eee;">
              <a href="${f.chatUrl}#${f.messageId}" class="fav-jump-link" style="font-size:12px;text-decoration:none;color:#222;">
                ${f.snippet.replace(/[<>"']/g,"")}
              </a>
              <button data-id="${f.messageId}" data-url="${f.chatUrl}" style="background:transparent;color:#d00;border:none;cursor:pointer;font-size:1.1em;margin-left:0.5em;" title="Remove from favorites">&times;</button>
            </div>
          `).join('')}
        </div>
      </div>`;
    }).join('');
    list.querySelectorAll('button[data-id]').forEach(btn=>{
      btn.onclick=function(e){
        e.preventDefault();
        let favs=getFavorites();
        favs=favs.filter(f=>!(f.chatUrl===btn.getAttribute('data-url')&&f.messageId===btn.getAttribute('data-id')));
        saveFavorites(favs);
        renderFavList();
        decorateMessages();
      };
    });
    list.querySelectorAll('.fav-jump-link').forEach(link=>{
      link.onclick=function(e){
        const[base,hash]=this.href.split('#');
        if(window.location.href.startsWith(base)){
          e.preventDefault();
          document.getElementById('fav-panel-bookmarklet')?.remove();
          setTimeout(()=>{
            const el=document.querySelector(`[data-message-id="${hash}"]`);
            if(el){
              el.scrollIntoView({behavior:"smooth",block:"center"});
              el.style.boxShadow="0 0 14px 4px gold";
              setTimeout(()=>el.style.boxShadow="",1500);
            }
          },80);
        }
      };
    });
  }
  if(!document.getElementById('fav-btn-bookmarklet')){
    const btn=document.createElement('button');
    btn.id='fav-btn-bookmarklet';
    btn.innerHTML='⭐ Favorites';
    btn.style.cssText='position:fixed;top:16px;right:24px;z-index:99999;background:#fff;color:#444;border-radius:2em;border:2px solid #ccc;font-size:0.97em;padding:0.23em 0.85em;box-shadow:0 2px 6px #888;cursor:pointer;';
    btn.onclick=showFavPanel;
    document.body.appendChild(btn);
  }
})();
