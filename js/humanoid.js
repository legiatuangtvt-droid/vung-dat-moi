// ═══════════════════════════════════════════════════
//  HUMANOID (PBR Materials)
// ═══════════════════════════════════════════════════
function disposeHuman(root){
  root.getChildMeshes().forEach(m=>{
    if(m.material){m.material.dispose();m.material=null;}
    shadowGen.removeShadowCaster(m);
    m.dispose();
  });
  root.getChildren().forEach(c=>{if(c.dispose)c.dispose();});
  root.dispose();
}

function mkHuman(isPlayer){
  const root=new BABYLON.TransformNode('human',scene);
  const pick=a=>a[Math.floor(Math.random()*a.length)];
  const skinC=pick(SKINS),shirtC=isPlayer?new BABYLON.Color3(.14,.47,.93):pick(SHIRTS);
  const pantC=isPlayer?new BABYLON.Color3(.13,.2,.33):new BABYLON.Color3(.2,.17,.13);
  const skinM=mkPBR(skinC,.65,0),shirtM=mkPBR(shirtC,.7,0),pantM=mkPBR(pantC,.75,0);
  const shoeM=mkPBR(new BABYLON.Color3(.12,.12,.12),.8,0);

  // Waist pivot
  const waist=new BABYLON.TransformNode('waist',scene);waist.parent=root;waist.position.y=.44;

  // Torso
  const chest=BABYLON.MeshBuilder.CreateCylinder('chest',{height:.22,diameterTop:.2,diameterBottom:.19,tessellation:8},scene);
  chest.material=shirtM;chest.parent=waist;chest.position.y=.14;chest.castShadow=true;shadowGen.addShadowCaster(chest);

  // Neck
  const neckPivot=new BABYLON.TransformNode('neck',scene);neckPivot.parent=waist;neckPivot.position.y=.27;
  const neck=BABYLON.MeshBuilder.CreateCylinder('nk',{height:.06,diameter:.07,tessellation:8},scene);
  neck.material=skinM;neck.parent=neckPivot;neck.position.y=.03;

  // Head
  const head=BABYLON.MeshBuilder.CreateSphere('head',{diameter:.22,segments:10},scene);
  head.material=skinM;head.parent=neckPivot;head.position.y=.14;head.castShadow=true;shadowGen.addShadowCaster(head);

  // Eyes
  const eyeM=mkPBR(new BABYLON.Color3(.08,.08,.08),.3,0);
  const eL=BABYLON.MeshBuilder.CreateSphere('eL',{diameter:.03,segments:6},scene);
  eL.material=eyeM;eL.parent=neckPivot;eL.position.set(-.035,.15,.09);
  const eR=eL.clone('eR');eR.parent=neckPivot;eR.position.x=.035;

  // Arms
  const armLP=new BABYLON.TransformNode('armLP',scene);armLP.parent=waist;armLP.position.set(-.14,.23,0);
  const aL=BABYLON.MeshBuilder.CreateCylinder('aL',{height:.24,diameterTop:.055,diameterBottom:.045,tessellation:7},scene);
  aL.material=shirtM;aL.parent=armLP;aL.position.y=-.12;aL.castShadow=true;shadowGen.addShadowCaster(aL);
  const hL=BABYLON.MeshBuilder.CreateSphere('hL',{diameter:.05,segments:5},scene);hL.material=skinM;hL.parent=armLP;hL.position.y=-.26;

  const armRP=new BABYLON.TransformNode('armRP',scene);armRP.parent=waist;armRP.position.set(.14,.23,0);
  const aR=BABYLON.MeshBuilder.CreateCylinder('aR',{height:.24,diameterTop:.055,diameterBottom:.045,tessellation:7},scene);
  aR.material=shirtM;aR.parent=armRP;aR.position.y=-.12;aR.castShadow=true;shadowGen.addShadowCaster(aR);
  const hR=BABYLON.MeshBuilder.CreateSphere('hR',{diameter:.05,segments:5},scene);hR.material=skinM;hR.parent=armRP;hR.position.y=-.26;

  // Legs
  const legLP=new BABYLON.TransformNode('legLP',scene);legLP.parent=root;legLP.position.set(-.05,.38,0);
  const lL=BABYLON.MeshBuilder.CreateCylinder('lL',{height:.3,diameterTop:.07,diameterBottom:.05,tessellation:7},scene);
  lL.material=pantM;lL.parent=legLP;lL.position.y=-.15;lL.castShadow=true;shadowGen.addShadowCaster(lL);
  const fL=BABYLON.MeshBuilder.CreateBox('fL',{width:.05,height:.03,depth:.1},scene);
  fL.material=shoeM;fL.parent=legLP;fL.position.set(0,-.32,.015);

  const legRP=new BABYLON.TransformNode('legRP',scene);legRP.parent=root;legRP.position.set(.05,.38,0);
  const lR=BABYLON.MeshBuilder.CreateCylinder('lR',{height:.3,diameterTop:.07,diameterBottom:.05,tessellation:7},scene);
  lR.material=pantM;lR.parent=legRP;lR.position.y=-.15;lR.castShadow=true;shadowGen.addShadowCaster(lR);
  const fR=BABYLON.MeshBuilder.CreateBox('fR',{width:.05,height:.03,depth:.1},scene);
  fR.material=shoeM;fR.parent=legRP;fR.position.set(0,-.32,.015);

  // Player ring
  if(isPlayer){
    const ring=BABYLON.MeshBuilder.CreateTorus('ring',{diameter:.5,thickness:.04,tessellation:24},scene);
    ring.material=mkPBR(new BABYLON.Color3(.3,.66,.87),.2,.5);ring.material.alpha=.5;
    ring.parent=root;ring.position.y=.03;ring.rotation.x=Math.PI/2;
    root.metadata={...root.metadata,ring};
  }

  root.metadata={...(root.metadata||{}),limbs:{waist,neckPivot,armLP,armRP,legLP,legRP,head},animTime:Math.random()*10,animState:'idle'};
  return root;
}

function animHuman(root,dt){
  const md=root.metadata;if(!md||!md.limbs)return;
  const L=md.limbs,t=md.animTime,s=md.animState;
  L.waist.rotation.x=0;L.waist.rotation.z=0;

  if(s==='walk'){
    const sw=Math.sin(t*9);
    L.armLP.rotation.x=sw*.55;L.armRP.rotation.x=-sw*.55;
    L.legLP.rotation.x=-sw*.5;L.legRP.rotation.x=sw*.5;
    L.waist.position.y=.44+Math.abs(Math.sin(t*18))*.006;
    L.neckPivot.rotation.x=sw*.02;
  }else if(s==='harvest'){
    const ch=Math.sin(t*7);
    L.armRP.rotation.x=-2+ch*.8;L.armLP.rotation.x=-.4;
    L.waist.rotation.x=.1+Math.sin(t*7)*.08;
    L.legLP.rotation.x=.1;L.legRP.rotation.x=-.05;
  }else if(s==='build'){
    const hm=Math.sin(t*6);
    L.armLP.rotation.x=-1.8+hm*.45;L.armRP.rotation.x=-1.8+hm*.45;
    L.waist.rotation.x=.1;L.legLP.rotation.x=.15;L.legRP.rotation.x=.15;
  }else{
    const sw=Math.sin(t*1.5);
    L.armLP.rotation.x=sw*.04;L.armRP.rotation.x=-sw*.04;
    L.legLP.rotation.x=0;L.legRP.rotation.x=0;
    L.waist.position.y=.44;
  }
}
