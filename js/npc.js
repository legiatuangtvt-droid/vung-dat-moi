// ═══════════════════════════════════════════════════
//  NPC
// ═══════════════════════════════════════════════════
const npcs=[];
function spawnNPC(){const m=mkHuman(false);const a=Math.random()*Math.PI*2,d=3+Math.random()*8;const x=Math.cos(a)*d,z=Math.sin(a)*d;m.position.set(x,getH(x,z),z);npcs.push({mesh:m,x,z,state:'idle',tx:x,tz:z,timer:Math.random()*3,task:null,spd:.7+Math.random()*.4});}
function updateNPCs(dt){
  const tgt=Math.max(0,Math.min(25,G.population-1));
  while(npcs.length<tgt)spawnNPC();
  while(npcs.length>tgt){const n=npcs.pop();disposeHuman(n.mesh);}
  npcs.forEach(n=>{
    n.timer-=dt;
    if(n.state==='idle'&&n.timer<=0){const r=Math.random();if(r<.4){n.state='walk';n.tx=n.x+(Math.random()-.5)*8;n.tz=n.z+(Math.random()-.5)*8;}else if(r<.6&&natureNodes.length>0){let near=null,nd=999;natureNodes.forEach(t=>{if(!t.isDisposed()){const d=Math.hypot(t.position.x-n.x,t.position.z-n.z);if(d<nd){nd=d;near=t;}}});if(near&&nd<12){n.state='walk';n.tx=near.position.x;n.tz=near.position.z;n.task={type:'harvest',t:near};}else n.timer=2;}else{n.state='rest';n.timer=3+Math.random()*3;n.mesh.metadata.animState='rest';}}
    if(n.state==='walk'){const dx=n.tx-n.x,dz=n.tz-n.z,d=Math.hypot(dx,dz);if(d<.3){if(n.task?.type==='harvest'){n.state='harvest';n.timer=2+Math.random()*2;n.mesh.metadata.animState='harvest';}else{n.state='idle';n.timer=1+Math.random()*3;n.mesh.metadata.animState='idle';}n.task=null;}else{const s=n.spd*dt;n.x+=dx/d*s;n.z+=dz/d*s;n.mesh.position.set(n.x,getH(n.x,n.z),n.z);n.mesh.rotation.y=Math.atan2(dx,dz);n.mesh.metadata.animState='walk';}}
    if(n.state==='harvest'&&n.timer<=0){if(n.task?.t&&!n.task.t.isDisposed()){const t=n.task.t;G.res[t.metadata.res]=(G.res[t.metadata.res]||0)+t.metadata.amt;const idx=natureNodes.indexOf(t);if(idx>-1)natureNodes.splice(idx,1);t.dispose();}n.state='idle';n.timer=1;n.mesh.metadata.animState='idle';n.task=null;}
    if(n.state==='rest'&&n.timer<=0){n.state='idle';n.timer=.5;n.mesh.metadata.animState='idle';}
  });
}
