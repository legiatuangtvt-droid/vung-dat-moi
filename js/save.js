// ═══════════════════════════════════════════════════
//  SAVE / LOAD (LocalStorage)
// ═══════════════════════════════════════════════════
const SAVE_KEY='vungdatmoi_save';

function saveGame(){
  const data={
    era:G.era,day:G.day,speed:G.speed,population:G.population,happiness:G.happiness,
    res:{...G.res},needLvl:{...G.needLvl},
    player:{hp:G.player.hp,energy:G.player.energy,x:P.x,z:P.z},
    buildings:G.buildings.map(b=>({id:b.id,x:b.x,z:b.z}))
  };
  try{
    localStorage.setItem(SAVE_KEY,JSON.stringify(data));
    showToast('\u{1f4be} \u0110\u00e3 l\u01b0u game!');
  }catch(e){showToast('\u274c L\u01b0u th\u1ea5t b\u1ea1i: '+e.message,true);}
}

function loadGame(){
  const raw=localStorage.getItem(SAVE_KEY);
  if(!raw){showToast('\u{1f4c2} Ch\u01b0a c\u00f3 b\u1ea3n l\u01b0u!',true);return;}
  try{
    const data=JSON.parse(raw);
    G.era=data.era;G.day=data.day;G.speed=data.speed||1;
    G.population=data.population;G.happiness=data.happiness;
    Object.assign(G.res,data.res);
    Object.assign(G.needLvl,data.needLvl);
    G.player.hp=data.player.hp;G.player.energy=data.player.energy;
    P.x=data.player.x;P.z=data.player.z;P.targetX=P.x;P.targetZ=P.z;P.moving=false;
    playerMesh.position.set(P.x,getH(P.x,P.z),P.z);
    // Remove old buildings
    G.buildings.forEach(b=>{if(b.mesh&&!b.mesh.isDisposed())b.mesh.dispose();});
    G.buildings=[];
    // Rebuild buildings
    data.buildings.forEach(bd=>{
      const def=BLDS.find(bl=>bl.id===bd.id);if(!def)return;
      const mesh=BABYLON.MeshBuilder.CreateBox('bld',{width:def.sz*.85,height:def.h,depth:def.sz*.85},scene);
      mesh.material=mkPBR(BABYLON.Color3.FromHexString(def.c),.7,.1);
      mesh.position.set(bd.x,getH(bd.x,bd.z)+def.h/2,bd.z);
      mesh.castShadow=true;shadowGen.addShadowCaster(mesh);mesh.receiveShadows=true;
      if(def.cat==='Nh\u00e0 \u1edf'&&def.era<3){
        const roof=BABYLON.MeshBuilder.CreateCylinder('roof',{height:def.h*.4,diameterTop:0,diameterBottom:def.sz*1.1,tessellation:4},scene);
        roof.material=mkPBR(new BABYLON.Color3(.55,.26,.07),.8,0);roof.parent=mesh;roof.position.y=def.h/2+def.h*.2;roof.rotation.y=Math.PI/4;
        shadowGen.addShadowCaster(roof);
      }
      G.buildings.push({id:bd.id,x:bd.x,z:bd.z,mesh});
    });
    checkEra();updateUI();
    showToast('\u{1f4c2} \u0110\u00e3 t\u1ea3i game th\u00e0nh c\u00f4ng!');
  }catch(e){showToast('\u274c T\u1ea3i th\u1ea5t b\u1ea1i: '+e.message,true);}
}

// Auto-save every 60 seconds
setInterval(saveGame,60000);
