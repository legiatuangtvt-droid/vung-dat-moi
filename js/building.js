// ═══════════════════════════════════════════════════
//  GLB MODEL LOADER
// ═══════════════════════════════════════════════════
const loadedModels={};

async function loadGLBFile(file){
  const url=URL.createObjectURL(file);
  const name=file.name.replace(/\.[^.]+$/,'');
  try{
    const result=await BABYLON.SceneLoader.ImportMeshAsync('','',url,scene,null,'.glb');
    URL.revokeObjectURL(url); // Fix memory leak
    const root=new BABYLON.TransformNode(name+'_root',scene);
    let bounds={min:new BABYLON.Vector3(Infinity,Infinity,Infinity),max:new BABYLON.Vector3(-Infinity,-Infinity,-Infinity)};
    result.meshes.forEach(m=>{
      if(m.getBoundingInfo){
        const b=m.getBoundingInfo().boundingBox;
        bounds.min=BABYLON.Vector3.Minimize(bounds.min,b.minimumWorld);
        bounds.max=BABYLON.Vector3.Maximize(bounds.max,b.maximumWorld);
      }
      m.parent=root;m.castShadow=true;shadowGen.addShadowCaster(m);m.receiveShadows=true;
    });
    const size=bounds.max.subtract(bounds.min);
    const maxDim=Math.max(size.x,size.y,size.z);
    if(maxDim>0)root.scaling=new BABYLON.Vector3(1/maxDim,1/maxDim,1/maxDim);
    root.setEnabled(false);
    loadedModels[name]={root,meshes:result.meshes,animations:result.animationGroups};
    showToast('\u2705 Model "'+name+'" \u0111\u00e3 n\u1ea1p th\u00e0nh c\u00f4ng!');
    updateGLBList();
    return name;
  }catch(e){
    URL.revokeObjectURL(url); // Clean up on error too
    showToast('\u274c L\u1ed7i n\u1ea1p '+file.name+': '+e.message,true);
    return null;
  }
}

function placeGLBModel(name,x,z){
  const tmpl=loadedModels[name];if(!tmpl)return;
  const clone=tmpl.root.clone(name+'_placed_'+Date.now(),null);
  clone.setEnabled(true);
  clone.position.set(x,getH(x,z),z);
  if(tmpl.animations?.length>0){tmpl.animations.forEach(ag=>{const c=ag.clone(ag.name+'_c');c.start(true);});}
  G.buildings.push({id:'custom_'+name,x,z,mesh:clone,isGLB:true});
  showToast('\u{1f4e6} \u0110\u00e3 \u0111\u1eb7t model "'+name+'"!');
  updateUI();
}

// GLB drag & drop + file input
const glbDrop=document.getElementById('glb-drop');
const glbInput=document.getElementById('glb-input');

glbDrop.addEventListener('dragover',e=>{e.preventDefault();glbDrop.classList.add('dragover');});
glbDrop.addEventListener('dragleave',()=>glbDrop.classList.remove('dragover'));
glbDrop.addEventListener('drop',e=>{e.preventDefault();glbDrop.classList.remove('dragover');[...e.dataTransfer.files].forEach(f=>{if(f.name.match(/\.(glb|gltf)$/i))loadGLBFile(f);});});
glbInput.addEventListener('change',e=>{[...e.target.files].forEach(f=>loadGLBFile(f));});
canvas.addEventListener('dragover',e=>e.preventDefault());
canvas.addEventListener('drop',e=>{e.preventDefault();[...e.dataTransfer.files].forEach(f=>{if(f.name.match(/\.(glb|gltf)$/i))loadGLBFile(f);});});

function updateGLBList(){
  const list=document.getElementById('glb-list');list.innerHTML='';
  Object.keys(loadedModels).forEach(name=>{
    const div=document.createElement('div');div.className='glb-item';
    div.innerHTML='\u{1f4e6} '+name+' <button onclick="G.selected=\'glb:'+name+'\';updateUI()">\u{1f528} \u0110\u1eb7t</button>';
    list.appendChild(div);
  });
}

// ═══════════════════════════════════════════════════
//  BUILDING PLACEMENT (procedural or GLB)
// ═══════════════════════════════════════════════════
let ghostMesh=null;
function updateGhost(bid){
  if(ghostMesh){ghostMesh.dispose();ghostMesh=null;}
  if(!bid)return;
  if(bid.startsWith('glb:')){
    const name=bid.slice(4);const tmpl=loadedModels[name];if(!tmpl)return;
    ghostMesh=tmpl.root.clone('ghost',null);ghostMesh.setEnabled(true);
    ghostMesh.getChildMeshes().forEach(m=>{if(m.material){const cm=m.material.clone('gm');cm.alpha=.4;m.material=cm;}});
    ghostMesh.position.y=-999;return;
  }
  const b=BLDS.find(bl=>bl.id===bid);if(!b)return;
  ghostMesh=BABYLON.MeshBuilder.CreateBox('ghost',{width:b.sz*.9,height:b.h,depth:b.sz*.9},scene);
  const gm=new BABYLON.StandardMaterial('gm',scene);gm.diffuseColor=BABYLON.Color3.FromHexString(b.c);gm.alpha=.35;
  ghostMesh.material=gm;ghostMesh.position.y=-999;
}

function placeBuilding(bid,x,z){
  if(bid.startsWith('glb:')){placeGLBModel(bid.slice(4),x,z);G.selected=null;updateGhost(null);return;}
  const b=BLDS.find(bl=>bl.id===bid);if(!b)return;
  const pd=Math.hypot(x-P.x,z-P.z);if(pd>6){showToast('Qu\u00e1 xa!',true);return;}
  for(const[r,a]of Object.entries(b.cost)){if((G.res[r]||0)<a){showToast('Thi\u1ebfu '+(RES.find(rs=>rs.id===r)?.name||r)+'!',true);return;}}
  for(const[r,a]of Object.entries(b.cost))G.res[r]-=a;
  P.busy=true;G.player.action='X\u00e2y d\u1ef1ng';playerMesh.metadata.animState='build';
  setTimeout(()=>{
    const mesh=BABYLON.MeshBuilder.CreateBox('bld',{width:b.sz*.85,height:b.h,depth:b.sz*.85},scene);
    mesh.material=mkPBR(BABYLON.Color3.FromHexString(b.c),.7,.1);
    mesh.position.set(x,getH(x,z)+b.h/2,z);mesh.castShadow=true;shadowGen.addShadowCaster(mesh);mesh.receiveShadows=true;
    if(b.cat==='\u004eh\u00e0 \u1edf'&&b.era<3){
      const roof=BABYLON.MeshBuilder.CreateCylinder('roof',{height:b.h*.4,diameterTop:0,diameterBottom:b.sz*1.1,tessellation:4},scene);
      roof.material=mkPBR(new BABYLON.Color3(.55,.26,.07),.8,0);roof.parent=mesh;roof.position.y=b.h/2+b.h*.2;roof.rotation.y=Math.PI/4;
      shadowGen.addShadowCaster(roof);
    }
    G.buildings.push({id:b.id,x,z,mesh});
    if(b.pop)G.population+=b.pop;
    showToast(b.icon+' '+b.name+' \u0111\u00e3 x\u00e2y xong!');
    P.busy=false;playerMesh.metadata.animState='idle';G.player.action='\u0110\u1ee9ng y\u00ean';
    G.player.energy=Math.max(0,G.player.energy-5);
    G.selected=null;updateGhost(null);checkEra();updateUI();
  },1200);
}
