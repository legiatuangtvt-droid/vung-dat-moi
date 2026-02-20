// ═══════════════════════════════════════════════════
//  NATURE OBJECTS (PBR)
// ═══════════════════════════════════════════════════
const natureNodes=[];
const treeMat=mkPBR(new BABYLON.Color3(.17,.4,.12),.82,0);
const trunkMat=mkPBR(new BABYLON.Color3(.35,.22,.1),.88,0);
const rockMat=mkPBR(new BABYLON.Color3(.45,.45,.5),.8,.05);
const bushMat=mkPBR(new BABYLON.Color3(.15,.5,.2),.82,0);

function mkTree(x,z){
  const root=new BABYLON.TransformNode('tree',scene);
  root.position.set(x,getH(x,z),z);
  const trunk=BABYLON.MeshBuilder.CreateCylinder('tr',{height:.6,diameterTop:.12,diameterBottom:.18,tessellation:6},scene);
  trunk.material=trunkMat;trunk.parent=root;trunk.position.y=.3;trunk.castShadow=true;shadowGen.addShadowCaster(trunk);
  const crown=BABYLON.MeshBuilder.CreateSphere('cr',{diameter:.7+Math.random()*.3,segments:6},scene);
  crown.material=treeMat;crown.parent=root;crown.position.y=.8+Math.random()*.2;crown.castShadow=true;shadowGen.addShadowCaster(crown);
  root.metadata={type:'tree',res:'wood',amt:3,label:'\u{1fab5} Gỗ (+3)'};
  natureNodes.push(root);return root;
}
function mkRock(x,z){
  const r=BABYLON.MeshBuilder.CreatePolyhedron('rock',{type:1,size:.2+Math.random()*.15},scene);
  r.material=rockMat;r.position.set(x,getH(x,z)+.15,z);r.rotation.set(Math.random(),Math.random(),Math.random());
  r.castShadow=true;shadowGen.addShadowCaster(r);
  r.metadata={type:'rock',res:'stone',amt:3,label:'\u{1faa8} Đá (+3)'};
  natureNodes.push(r);return r;
}
function mkBush(x,z){
  const b=BABYLON.MeshBuilder.CreateSphere('bush',{diameter:.35+Math.random()*.15,segments:5},scene);
  b.material=bushMat;b.position.set(x,getH(x,z)+.1,z);b.castShadow=true;shadowGen.addShadowCaster(b);
  b.metadata={type:'bush',res:'herbs',amt:2,label:'\u{1f331} Thảo dược (+2)'};
  natureNodes.push(b);return b;
}

// Initial spawn
for(let i=0;i<70;i++){const x=(Math.random()-.5)*34,z=(Math.random()-.5)*34;if(getH(x,z)>-.3)mkTree(x,z);}
for(let i=0;i<25;i++){const x=(Math.random()-.5)*34,z=(Math.random()-.5)*34;if(getH(x,z)>-.2)mkRock(x,z);}
for(let i=0;i<18;i++){const x=(Math.random()-.5)*34,z=(Math.random()-.5)*34;if(getH(x,z)>-.1)mkBush(x,z);}
