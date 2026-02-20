// ═══════════════════════════════════════════════════
//  MOUSE INTERACTION
// ═══════════════════════════════════════════════════
const cursorInfo=document.getElementById('cursor-info');

// Pointer move — tooltip + ghost building
scene.onPointerObservable.add(function(pi){
  const evt=pi.event;
  const pick=pi.pickInfo;
  cursorInfo.style.left=(evt.clientX+14)+'px';cursorInfo.style.top=(evt.clientY-10)+'px';

  if(ghostMesh&&pick.hit){
    const p=pick.pickedPoint;const gx=Math.round(p.x),gz=Math.round(p.z);
    ghostMesh.position.set(gx,getH(gx,gz)+(ghostMesh.getBoundingInfo?ghostMesh.getBoundingInfo().boundingBox.extendSize.y:0),gz);
  }

  // Tooltip
  if(pick.hit&&pick.pickedMesh){
    let md=pick.pickedMesh.metadata;
    if(!md){let p=pick.pickedMesh.parent;while(p&&!p.metadata?.type)p=p.parent;if(p)md=p.metadata;}
    if(G.selected){cursorInfo.style.display='block';cursorInfo.textContent='\u{1f528} Click \u0111\u1ec3 x\u00e2y';cursorInfo.style.color='var(--gold)';canvas.style.cursor='cell';}
    else if(md?.type){cursorInfo.style.display='block';cursorInfo.textContent=md.label||'Khai th\u00e1c';cursorInfo.style.color='var(--green)';canvas.style.cursor='pointer';}
    else{cursorInfo.style.display='block';cursorInfo.textContent='\u{1f6b6} Click di chuy\u1ec3n';cursorInfo.style.color='var(--dim)';canvas.style.cursor='crosshair';}
  }else{cursorInfo.style.display='none';canvas.style.cursor='default';}
},BABYLON.PointerEventTypes.POINTERMOVE);

// Pointer down — move / harvest / build
scene.onPointerObservable.add(function(pi){
  const evt=pi.event;
  if(evt.button!==0||P.busy)return;
  const pick=pi.pickInfo;
  if(!pick||!pick.hit)return;

  // Build mode
  if(G.selected){const p=pick.pickedPoint;const gx=Math.round(p.x),gz=Math.round(p.z);playerMoveTo(gx,gz,()=>placeBuilding(G.selected,gx,gz));return;}

  // Nature?
  let md=pick.pickedMesh?.metadata;
  if(!md){let p=pick.pickedMesh?.parent;while(p&&!p.metadata?.type)p=p.parent;if(p)md=p.metadata;}
  if(md?.type){
    const obj=pick.pickedMesh.metadata?.type?pick.pickedMesh:(()=>{let p=pick.pickedMesh.parent;while(p&&!p.metadata?.type)p=p.parent;return p;})();
    if(obj)playerMoveTo(obj.position.x,obj.position.z,()=>doHarvest(obj));
    return;
  }

  // Ground
  if(pick.pickedPoint)playerMoveTo(pick.pickedPoint.x,pick.pickedPoint.z,null);
},BABYLON.PointerEventTypes.POINTERDOWN);

function doHarvest(obj){
  if(obj.isDisposed()||P.busy)return;
  P.busy=true;G.player.action='Khai th\u00e1c';playerMesh.metadata.animState='harvest';
  playerMesh.rotation.y=Math.atan2(obj.position.x-P.x,obj.position.z-P.z);
  setTimeout(()=>{
    if(!obj.isDisposed()){
      const r=obj.metadata.res,a=obj.metadata.amt;
      G.res[r]=(G.res[r]||0)+a;
      if(obj.metadata.type==='tree')G.res.fiber=(G.res.fiber||0)+1;
      if(obj.metadata.type==='rock')G.res.clay=(G.res.clay||0)+1;
      const idx=natureNodes.indexOf(obj);if(idx>-1)natureNodes.splice(idx,1);
      obj.dispose();
      showToast('+'+a+' '+(RES.find(rs=>rs.id===r)?.icon||'')+' '+(RES.find(rs=>rs.id===r)?.name||r));
      G.player.energy=Math.max(0,G.player.energy-3);
    }
    P.busy=false;playerMesh.metadata.animState='idle';G.player.action='\u0110\u1ee9ng y\u00ean';updateUI();
  },900);
}

document.addEventListener('keydown',e=>{if(e.key==='Escape'){G.selected=null;updateGhost(null);updateUI();}});

// ═══════════════════════════════════════════════════
//  GAME TICK
// ═══════════════════════════════════════════════════
function gameTick(){
  if(G.speed===0)return;G.day++;
  const prod={};G.buildings.forEach(b=>{const d=BLDS.find(bl=>bl.id===b.id);if(d?.prod)Object.entries(d.prod).forEach(([k,v])=>prod[k]=(prod[k]||0)+v);});
  G.res.food=Math.max(0,G.res.food-G.population*.3+(prod.hunger||0)*2);
  G.res.water=Math.max(0,G.res.water-G.population*.2+(prod.thirst||0)*2);
  if(G.era>=2){G.res.iron=(G.res.iron||0)+G.buildings.filter(b=>b.id==='mine').length*.5;G.res.coal=(G.res.coal||0)+G.buildings.filter(b=>b.id==='mine').length*.3;G.res.coin=(G.res.coin||0)+G.population*.05;}
  if(G.era>=3){G.res.steel=(G.res.steel||0)+G.buildings.filter(b=>b.id==='factory').length*.3;}
  NEEDS.forEach(n=>{if(n.era>G.era)return;let v=G.needLvl[n.id]||50;v-=n.d*(G.population/10+1);if(prod[n.id])v+=prod[n.id]*3;if(n.id==='hunger'&&G.res.food>G.population)v+=2;if(n.id==='thirst'&&G.res.water>G.population)v+=2;G.needLvl[n.id]=Math.max(0,Math.min(100,v));});
  let tw=0,ws=0;NEEDS.forEach(n=>{if(n.era<=G.era){tw+=n.w;ws+=(G.needLvl[n.id]||50)*n.w;}});G.happiness=Math.round(ws/tw);
  if(G.happiness>70&&G.day%10===0)G.population+=Math.ceil(G.population*.05);
  if(G.happiness<30&&G.day%5===0&&G.population>1)G.population=Math.max(1,G.population-1);
  G.player.hp=Math.min(100,G.player.hp+.1);G.player.energy=Math.min(100,G.player.energy+.3);
  // Respawn nature every 5 days
  if(G.day%5===0){
    const trees=natureNodes.filter(n=>!n.isDisposed()&&n.metadata?.type==='tree').length;
    const rocks=natureNodes.filter(n=>!n.isDisposed()&&n.metadata?.type==='rock').length;
    const bushes=natureNodes.filter(n=>!n.isDisposed()&&n.metadata?.type==='bush').length;
    if(trees<40){const rx=(Math.random()-.5)*34,rz=(Math.random()-.5)*34;if(getH(rx,rz)>-.3)mkTree(rx,rz);}
    if(rocks<15){const rx=(Math.random()-.5)*34,rz=(Math.random()-.5)*34;if(getH(rx,rz)>-.2)mkRock(rx,rz);}
    if(bushes<10){const rx=(Math.random()-.5)*34,rz=(Math.random()-.5)*34;if(getH(rx,rz)>-.1)mkBush(rx,rz);}
  }
  checkEra();updateUI();
}
function checkEra(){for(let i=ERAS.length-1;i>=0;i--){if(G.population>=ERAS[i].pop&&G.era<i){G.era=i;showToast('\u{1f389} '+ERAS[i].label+'!',false,true);RES.forEach(r=>{if(r.era===i&&!G.res[r.id])G.res[r.id]=0;});break;}}}

// ═══════════════════════════════════════════════════
//  RENDER LOOP
// ═══════════════════════════════════════════════════
let tickAccum=0;
scene.registerBeforeRender(function(){
  const dt=engine.getDeltaTime()/1000;
  updatePlayer(dt);
  updateNPCs(dt*G.speed);
  [playerMesh,...npcs.map(n=>n.mesh)].forEach(h=>{if(h.metadata){h.metadata.animTime+=dt;animHuman(h,dt);}});
  if(G.speed>0){tickAccum+=dt;const iv=2/G.speed;while(tickAccum>=iv){tickAccum-=iv;gameTick();}}
  waterMat.alpha=.55+Math.sin(Date.now()*.001)*.08;
});

engine.runRenderLoop(()=>scene.render());
window.addEventListener('resize',()=>engine.resize());
updateUI();
