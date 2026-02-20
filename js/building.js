// ═══════════════════════════════════════════════════
//  BUILDING PLACEMENT
// ═══════════════════════════════════════════════════
let ghostMesh=null;
function updateGhost(bid){
  if(ghostMesh){ghostMesh.dispose();ghostMesh=null;}
  if(!bid)return;
  const b=BLDS.find(bl=>bl.id===bid);if(!b)return;
  ghostMesh=BABYLON.MeshBuilder.CreateBox('ghost',{width:b.sz*.9,height:b.h,depth:b.sz*.9},scene);
  const gm=new BABYLON.StandardMaterial('gm',scene);gm.diffuseColor=BABYLON.Color3.FromHexString(b.c);gm.alpha=.35;
  ghostMesh.material=gm;ghostMesh.position.y=-999;
}

function placeBuilding(bid,x,z){
  const b=BLDS.find(bl=>bl.id===bid);if(!b)return;
  const pd=Math.hypot(x-P.x,z-P.z);if(pd>6){showToast('Quá xa!',true);return;}
  for(const[r,a]of Object.entries(b.cost)){if((G.res[r]||0)<a){showToast('Thiếu '+(RES.find(rs=>rs.id===r)?.name||r)+'!',true);return;}}
  for(const[r,a]of Object.entries(b.cost))G.res[r]-=a;
  P.busy=true;G.player.action='Xây dựng';playerMesh.metadata.animState='build';
  setTimeout(()=>{
    const mesh=BABYLON.MeshBuilder.CreateBox('bld',{width:b.sz*.85,height:b.h,depth:b.sz*.85},scene);
    mesh.material=mkPBR(BABYLON.Color3.FromHexString(b.c),.7,.1);
    mesh.position.set(x,getH(x,z)+b.h/2,z);mesh.castShadow=true;shadowGen.addShadowCaster(mesh);mesh.receiveShadows=true;
    if(b.cat==='Nhà ở'&&b.era<3){
      const roof=BABYLON.MeshBuilder.CreateCylinder('roof',{height:b.h*.4,diameterTop:0,diameterBottom:b.sz*1.1,tessellation:4},scene);
      roof.material=mkPBR(new BABYLON.Color3(.55,.26,.07),.8,0);roof.parent=mesh;roof.position.y=b.h/2+b.h*.2;roof.rotation.y=Math.PI/4;
      shadowGen.addShadowCaster(roof);
    }
    G.buildings.push({id:b.id,x,z,mesh});
    if(b.pop)G.population+=b.pop;
    showToast(b.icon+' '+b.name+' đã xây xong!');
    P.busy=false;playerMesh.metadata.animState='idle';G.player.action='Đứng yên';
    G.player.energy=Math.max(0,G.player.energy-5);
    G.selected=null;updateGhost(null);checkEra();updateUI();
  },1200);
}
