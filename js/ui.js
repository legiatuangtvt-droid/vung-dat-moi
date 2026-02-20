// ═══════════════════════════════════════════════════
//  UI
// ═══════════════════════════════════════════════════
function updateUI(){
  document.getElementById('era-label').textContent=ERAS[G.era].label;
  document.getElementById('pop-ct').textContent=G.population;
  const hc=document.getElementById('happy-ct');hc.textContent=G.happiness+'%';hc.style.color=G.happiness>60?'var(--green)':G.happiness>35?'var(--gold)':'var(--red)';
  document.getElementById('day-ct').textContent=G.day;
  const rb=document.getElementById('res-bar');rb.innerHTML='';
  RES.filter(r=>r.era<=G.era).forEach(r=>{const d=document.createElement('div');d.className='ri';d.innerHTML='<span>'+r.icon+'</span><span class="v">'+Math.floor(G.res[r.id]||0)+'</span>';d.title=r.name;rb.appendChild(d);});
  const bl=document.getElementById('build-list');bl.innerHTML='';
  const cats={};BLDS.forEach(b=>{if(!cats[b.cat])cats[b.cat]=[];cats[b.cat].push(b);});
  Object.entries(cats).forEach(([cat,bs])=>{const cd=document.createElement('div');cd.innerHTML='<div class="cat-l">'+cat+'</div>';bs.forEach(b=>{const locked=b.era>G.era;const cs=Object.entries(b.cost).map(([r,a])=>(RES.find(rs=>rs.id===r)?.icon||r)+a).join(' ');const btn=document.createElement('button');btn.className='bb'+(locked?' locked':'')+(G.selected===b.id?' active':'');btn.innerHTML='<span class="bi">'+b.icon+'</span><span><div class="bn">'+b.name+(locked?' \u{1f512}':'')+'</div><div class="bc">'+cs+'</div></span>';if(!locked)btn.onclick=()=>{G.selected=G.selected===b.id?null:b.id;updateGhost(G.selected);updateUI();};cd.appendChild(btn);});bl.appendChild(cd);});

  const ip=document.getElementById('info-panel');let h='<div class="isec"><div class="st">\u{1f465} Nhu C\u1ea7u</div>';
  NEEDS.filter(n=>n.era<=G.era).forEach(n=>{const v=Math.round(G.needLvl[n.id]||0);const c=v>60?'#55c87a':v>35?'#d4a843':'#e05555';h+='<div class="nr"><span class="ni">'+n.icon+'</span><span class="nl">'+n.name+'</span><div class="nb"><div class="nf" style="width:'+v+'%;background:'+c+'"></div></div><span class="nv">'+v+'%</span></div>';});
  h+='</div><div class="isec"><div class="st">\u{1f4ca} Th\u1ed1ng K\u00ea</div>';
  h+='<div class="sr"><span class="sl">C\u00f4ng tr\u00ecnh</span><span class="sv">'+G.buildings.length+'</span></div><div class="sr"><span class="sl">D\u00e2n NPC</span><span class="sv">'+npcs.length+'</span></div></div>';
  const ne=ERAS[G.era+1];h+='<div class="isec"><div class="st">\u{1f52c} Ti\u1ebfn \u0110\u1ed9</div>';
  if(ne){const p=Math.min(100,Math.round(G.population/ne.pop*100));h+='<div style="font-size:10px;color:var(--dim)">\u2192 <span style="color:var(--gold)">'+ne.name+'</span> ('+ne.pop+' d\u00e2n)</div><div class="nb" style="width:100%;margin-top:3px"><div class="nf" style="width:'+p+'%;background:var(--gold)"></div></div>';}
  else h+='<div style="font-size:10px;color:var(--gold)">\u{1f3c6} Max!</div>';
  h+='</div>';ip.innerHTML=h;
  document.getElementById('hp-bar').style.width=G.player.hp+'%';document.getElementById('hp-val').textContent=Math.round(G.player.hp);
  document.getElementById('ep-bar').style.width=G.player.energy+'%';document.getElementById('ep-val').textContent=Math.round(G.player.energy);
  document.getElementById('act-val').textContent=G.player.action;
}
function showToast(msg,err,gold){const t=document.getElementById('toast');t.textContent=msg;t.className='toast show'+(gold?' gold':'');if(err){t.style.borderColor='var(--red)';t.style.color='var(--red)';}setTimeout(()=>{t.className='toast';t.style.borderColor='';t.style.color='';},2200);}
function setSpeed(s){G.speed=s;}
