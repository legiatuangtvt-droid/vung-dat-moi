// ═══════════════════════════════════════════════════
//  HUMANOID — Detailed Procedural Model (PBR)
// ═══════════════════════════════════════════════════

// Shared materials (created once, reused by all humanoids)
const eyeWhiteM=mkPBR(new BABYLON.Color3(.95,.95,.95),.3,0);eyeWhiteM._shared=true;
const pupilM=mkPBR(new BABYLON.Color3(.08,.08,.08),.3,0);pupilM._shared=true;
const browM=mkPBR(new BABYLON.Color3(.15,.1,.07),.8,0);browM._shared=true;

function disposeHuman(root){
  root.getChildMeshes().forEach(m=>{
    if(m.material&&!m.material._shared){m.material.dispose();}
    m.material=null;
    shadowGen.removeShadowCaster(m);
    m.dispose();
  });
  root.getChildren().forEach(c=>{if(c.dispose)c.dispose();});
  root.dispose();
}

function mkHuman(isPlayer){
  const root=new BABYLON.TransformNode('human',scene);
  const pick=a=>a[Math.floor(Math.random()*a.length)];

  // ── Materials ──
  const skinC=pick(SKINS);
  const shirtC=isPlayer?new BABYLON.Color3(.14,.47,.93):pick(SHIRTS);
  const pantC=isPlayer?new BABYLON.Color3(.13,.2,.33):new BABYLON.Color3(.15+Math.random()*.1,.12+Math.random()*.08,.1+Math.random()*.06);
  const skinM=mkPBR(skinC,.65,0);
  const shirtM=mkPBR(shirtC,.7,0);
  const pantM=mkPBR(pantC,.75,0);
  const shoeM=mkPBR(new BABYLON.Color3(.12,.12,.12),.8,0);
  const hairC=pick(HAIR_COLORS);
  const hairM=mkPBR(hairC,.85,0);

  // ═══════════════════════════════════════
  //  WAIST PIVOT
  // ═══════════════════════════════════════
  const waist=new BABYLON.TransformNode('waist',scene);
  waist.parent=root;waist.position.y=.44;

  // Belt
  const belt=BABYLON.MeshBuilder.CreateCylinder('belt',{height:.04,diameterTop:.17,diameterBottom:.17,tessellation:8},scene);
  belt.material=shoeM;belt.parent=waist;belt.position.y=.02;

  // Belt buckle
  const buckle=BABYLON.MeshBuilder.CreateBox('buckle',{width:.03,height:.025,depth:.02},scene);
  buckle.material=mkPBR(new BABYLON.Color3(.7,.65,.3),.3,.6);buckle.parent=waist;buckle.position.set(0,.02,.085);

  // Abdomen
  const abdomen=BABYLON.MeshBuilder.CreateCylinder('abdomen',{height:.08,diameterTop:.18,diameterBottom:.16,tessellation:8},scene);
  abdomen.material=shirtM;abdomen.parent=waist;abdomen.position.y=.06;

  // Chest (wider for shoulders)
  const chest=BABYLON.MeshBuilder.CreateCylinder('chest',{height:.15,diameterTop:.23,diameterBottom:.19,tessellation:8},scene);
  chest.material=shirtM;chest.parent=waist;chest.position.y=.175;
  chest.castShadow=true;shadowGen.addShadowCaster(chest);

  // Shoulder caps
  const shldrL=BABYLON.MeshBuilder.CreateSphere('shldrL',{diameter:.065,segments:6},scene);
  shldrL.material=shirtM;shldrL.parent=waist;shldrL.position.set(-.135,.24,0);
  const shldrR=shldrL.clone('shldrR');shldrR.parent=waist;shldrR.position.x=.135;

  // Collar detail
  const collar=BABYLON.MeshBuilder.CreateTorus('collar',{diameter:.14,thickness:.015,tessellation:12},scene);
  collar.material=shirtM;collar.parent=waist;collar.position.y=.255;collar.rotation.x=Math.PI/2;

  // ═══════════════════════════════════════
  //  NECK + HEAD
  // ═══════════════════════════════════════
  const neckPivot=new BABYLON.TransformNode('neck',scene);
  neckPivot.parent=waist;neckPivot.position.y=.27;

  const neck=BABYLON.MeshBuilder.CreateCylinder('nk',{height:.06,diameter:.07,tessellation:8},scene);
  neck.material=skinM;neck.parent=neckPivot;neck.position.y=.03;

  const head=BABYLON.MeshBuilder.CreateSphere('head',{diameter:.22,segments:10},scene);
  head.material=skinM;head.parent=neckPivot;head.position.y=.14;
  head.castShadow=true;shadowGen.addShadowCaster(head);

  // ── Face ──
  // Eye whites
  const ewL=BABYLON.MeshBuilder.CreateSphere('ewL',{diameter:.04,segments:6},scene);
  ewL.material=eyeWhiteM;ewL.parent=neckPivot;ewL.position.set(-.04,.155,.085);
  const ewR=ewL.clone('ewR');ewR.parent=neckPivot;ewR.position.x=.04;

  // Pupils
  const eL=BABYLON.MeshBuilder.CreateSphere('eL',{diameter:.022,segments:5},scene);
  eL.material=pupilM;eL.parent=neckPivot;eL.position.set(-.04,.155,.1);
  const eR=eL.clone('eR');eR.parent=neckPivot;eR.position.x=.04;

  // Nose
  const nose=BABYLON.MeshBuilder.CreateBox('nose',{width:.025,height:.035,depth:.03},scene);
  nose.material=skinM;nose.parent=neckPivot;nose.position.set(0,.13,.1);

  // Eyebrows
  const browL=BABYLON.MeshBuilder.CreateBox('browL',{width:.04,height:.008,depth:.012},scene);
  browL.material=browM;browL.parent=neckPivot;browL.position.set(-.04,.175,.09);
  const browR=browL.clone('browR');browR.parent=neckPivot;browR.position.x=.04;

  // Ears
  const earL=BABYLON.MeshBuilder.CreateSphere('earL',{diameter:.04,segments:5},scene);
  earL.material=skinM;earL.parent=neckPivot;earL.position.set(-.115,.14,0);earL.scaling.z=.4;
  const earR=earL.clone('earR');earR.parent=neckPivot;earR.position.x=.115;

  // Mouth hint
  const mouth=BABYLON.MeshBuilder.CreateBox('mouth',{width:.04,height:.006,depth:.01},scene);
  mouth.material=mkPBR(new BABYLON.Color3(.6,.25,.2),.6,0);
  mouth.parent=neckPivot;mouth.position.set(0,.105,.095);

  // ── Hair ──
  const hairStyle=Math.floor(Math.random()*3);
  if(hairStyle===0){
    // Short crop
    const hair=BABYLON.MeshBuilder.CreateSphere('hair',{diameter:.23,segments:8,slice:.55},scene);
    hair.material=hairM;hair.parent=neckPivot;hair.position.set(0,.17,-.01);hair.rotation.x=-.15;
  }else if(hairStyle===1){
    // Medium swept back
    const hair=BABYLON.MeshBuilder.CreateSphere('hair',{diameter:.24,segments:8},scene);
    hair.material=hairM;hair.parent=neckPivot;hair.position.set(0,.18,-.025);
    hair.scaling.set(1,.85,1.15);
  }else{
    // Longer with ponytail
    const hair=BABYLON.MeshBuilder.CreateSphere('hair',{diameter:.24,segments:8},scene);
    hair.material=hairM;hair.parent=neckPivot;hair.position.set(0,.18,-.02);
    const tail=BABYLON.MeshBuilder.CreateCylinder('tail',{height:.1,diameterTop:.04,diameterBottom:.06,tessellation:6},scene);
    tail.material=hairM;tail.parent=neckPivot;tail.position.set(0,.1,-.09);tail.rotation.x=.4;
  }

  // ═══════════════════════════════════════
  //  ARMS (with elbows)
  // ═══════════════════════════════════════

  // -- Left arm --
  const armLP=new BABYLON.TransformNode('armLP',scene);
  armLP.parent=waist;armLP.position.set(-.16,.22,0);

  const uaL=BABYLON.MeshBuilder.CreateCylinder('uaL',{height:.13,diameterTop:.055,diameterBottom:.05,tessellation:7},scene);
  uaL.material=shirtM;uaL.parent=armLP;uaL.position.y=-.065;
  uaL.castShadow=true;shadowGen.addShadowCaster(uaL);

  const elbowLP=new BABYLON.TransformNode('elbowLP',scene);
  elbowLP.parent=armLP;elbowLP.position.y=-.14;

  // Elbow joint ball
  const ejL=BABYLON.MeshBuilder.CreateSphere('ejL',{diameter:.045,segments:5},scene);
  ejL.material=skinM;ejL.parent=elbowLP;ejL.position.y=0;

  const faL=BABYLON.MeshBuilder.CreateCylinder('faL',{height:.12,diameterTop:.045,diameterBottom:.038,tessellation:7},scene);
  faL.material=skinM;faL.parent=elbowLP;faL.position.y=-.065;

  // Hand (palm + thumb)
  const palmL=BABYLON.MeshBuilder.CreateBox('palmL',{width:.038,height:.032,depth:.045},scene);
  palmL.material=skinM;palmL.parent=elbowLP;palmL.position.set(0,-.14,.005);
  const thumbL=BABYLON.MeshBuilder.CreateBox('thumbL',{width:.014,height:.022,depth:.014},scene);
  thumbL.material=skinM;thumbL.parent=elbowLP;thumbL.position.set(.024,-.13,.018);

  // -- Right arm --
  const armRP=new BABYLON.TransformNode('armRP',scene);
  armRP.parent=waist;armRP.position.set(.16,.22,0);

  const uaR=BABYLON.MeshBuilder.CreateCylinder('uaR',{height:.13,diameterTop:.055,diameterBottom:.05,tessellation:7},scene);
  uaR.material=shirtM;uaR.parent=armRP;uaR.position.y=-.065;
  uaR.castShadow=true;shadowGen.addShadowCaster(uaR);

  const elbowRP=new BABYLON.TransformNode('elbowRP',scene);
  elbowRP.parent=armRP;elbowRP.position.y=-.14;

  const ejR=BABYLON.MeshBuilder.CreateSphere('ejR',{diameter:.045,segments:5},scene);
  ejR.material=skinM;ejR.parent=elbowRP;ejR.position.y=0;

  const faR=BABYLON.MeshBuilder.CreateCylinder('faR',{height:.12,diameterTop:.045,diameterBottom:.038,tessellation:7},scene);
  faR.material=skinM;faR.parent=elbowRP;faR.position.y=-.065;

  const palmR=BABYLON.MeshBuilder.CreateBox('palmR',{width:.038,height:.032,depth:.045},scene);
  palmR.material=skinM;palmR.parent=elbowRP;palmR.position.set(0,-.14,.005);
  const thumbR=BABYLON.MeshBuilder.CreateBox('thumbR',{width:.014,height:.022,depth:.014},scene);
  thumbR.material=skinM;thumbR.parent=elbowRP;thumbR.position.set(-.024,-.13,.018);

  // ═══════════════════════════════════════
  //  LEGS (with knees)
  // ═══════════════════════════════════════

  // -- Left leg --
  const legLP=new BABYLON.TransformNode('legLP',scene);
  legLP.parent=root;legLP.position.set(-.06,.38,0);

  const thL=BABYLON.MeshBuilder.CreateCylinder('thL',{height:.16,diameterTop:.075,diameterBottom:.06,tessellation:7},scene);
  thL.material=pantM;thL.parent=legLP;thL.position.y=-.08;
  thL.castShadow=true;shadowGen.addShadowCaster(thL);

  const kneeLP=new BABYLON.TransformNode('kneeLP',scene);
  kneeLP.parent=legLP;kneeLP.position.y=-.17;

  // Knee cap
  const kcL=BABYLON.MeshBuilder.CreateSphere('kcL',{diameter:.05,segments:5},scene);
  kcL.material=pantM;kcL.parent=kneeLP;kcL.position.set(0,0,.01);

  const cfL=BABYLON.MeshBuilder.CreateCylinder('cfL',{height:.15,diameterTop:.055,diameterBottom:.045,tessellation:7},scene);
  cfL.material=pantM;cfL.parent=kneeLP;cfL.position.y=-.08;

  // Foot (sole + toe)
  const soleL=BABYLON.MeshBuilder.CreateBox('soleL',{width:.055,height:.03,depth:.1},scene);
  soleL.material=shoeM;soleL.parent=kneeLP;soleL.position.set(0,-.165,.015);
  const toeL=BABYLON.MeshBuilder.CreateBox('toeL',{width:.05,height:.032,depth:.035},scene);
  toeL.material=shoeM;toeL.parent=kneeLP;toeL.position.set(0,-.16,.055);

  // -- Right leg --
  const legRP=new BABYLON.TransformNode('legRP',scene);
  legRP.parent=root;legRP.position.set(.06,.38,0);

  const thR=BABYLON.MeshBuilder.CreateCylinder('thR',{height:.16,diameterTop:.075,diameterBottom:.06,tessellation:7},scene);
  thR.material=pantM;thR.parent=legRP;thR.position.y=-.08;
  thR.castShadow=true;shadowGen.addShadowCaster(thR);

  const kneeRP=new BABYLON.TransformNode('kneeRP',scene);
  kneeRP.parent=legRP;kneeRP.position.y=-.17;

  const kcR=BABYLON.MeshBuilder.CreateSphere('kcR',{diameter:.05,segments:5},scene);
  kcR.material=pantM;kcR.parent=kneeRP;kcR.position.set(0,0,.01);

  const cfR=BABYLON.MeshBuilder.CreateCylinder('cfR',{height:.15,diameterTop:.055,diameterBottom:.045,tessellation:7},scene);
  cfR.material=pantM;cfR.parent=kneeRP;cfR.position.y=-.08;

  const soleR=BABYLON.MeshBuilder.CreateBox('soleR',{width:.055,height:.03,depth:.1},scene);
  soleR.material=shoeM;soleR.parent=kneeRP;soleR.position.set(0,-.165,.015);
  const toeR=BABYLON.MeshBuilder.CreateBox('toeR',{width:.05,height:.032,depth:.035},scene);
  toeR.material=shoeM;toeR.parent=kneeRP;toeR.position.set(0,-.16,.055);

  // ═══════════════════════════════════════
  //  PLAYER EXTRAS
  // ═══════════════════════════════════════
  if(isPlayer){
    // Backpack
    const bpM=mkPBR(new BABYLON.Color3(.35,.25,.15),.8,0);
    const bpBody=BABYLON.MeshBuilder.CreateBox('bpBody',{width:.12,height:.14,depth:.06},scene);
    bpBody.material=bpM;bpBody.parent=waist;bpBody.position.set(0,.15,-.11);
    const bpFlap=BABYLON.MeshBuilder.CreateBox('bpFlap',{width:.11,height:.035,depth:.05},scene);
    bpFlap.material=bpM;bpFlap.parent=waist;bpFlap.position.set(0,.23,-.1);

    // Straps
    const strapM=mkPBR(new BABYLON.Color3(.3,.2,.1),.8,0);
    const strapL=BABYLON.MeshBuilder.CreateBox('strapL',{width:.018,height:.18,depth:.012},scene);
    strapL.material=strapM;strapL.parent=waist;strapL.position.set(-.045,.15,-.065);
    const strapR=strapL.clone('strapR');strapR.parent=waist;strapR.position.x=.045;

    // Player ring
    const ring=BABYLON.MeshBuilder.CreateTorus('ring',{diameter:.5,thickness:.04,tessellation:24},scene);
    ring.material=mkPBR(new BABYLON.Color3(.3,.66,.87),.2,.5);ring.material.alpha=.5;
    ring.parent=root;ring.position.y=.03;ring.rotation.x=Math.PI/2;
    root.metadata={...root.metadata,ring};
  }

  // ═══════════════════════════════════════
  //  METADATA
  // ═══════════════════════════════════════
  root.metadata={...(root.metadata||{}),
    limbs:{waist,neckPivot,armLP,armRP,legLP,legRP,head,elbowLP,elbowRP,kneeLP,kneeRP},
    animTime:Math.random()*10,animState:'idle'};
  return root;
}

// ═══════════════════════════════════════════════════
//  ANIMATION
// ═══════════════════════════════════════════════════
function animHuman(root,dt){
  const md=root.metadata;if(!md||!md.limbs)return;
  const L=md.limbs,t=md.animTime,s=md.animState;

  // Reset joints
  L.waist.rotation.x=0;L.waist.rotation.z=0;
  L.elbowLP.rotation.x=0;L.elbowRP.rotation.x=0;
  L.kneeLP.rotation.x=0;L.kneeRP.rotation.x=0;

  if(s==='walk'){
    const sw=Math.sin(t*9);

    // Shoulder swing
    L.armLP.rotation.x=sw*.45;
    L.armRP.rotation.x=-sw*.45;

    // Elbow trailing bend
    L.elbowLP.rotation.x=-Math.max(0,sw)*.5-.1;
    L.elbowRP.rotation.x=-Math.max(0,-sw)*.5-.1;

    // Hip swing
    L.legLP.rotation.x=-sw*.45;
    L.legRP.rotation.x=sw*.45;

    // Knee lift on swing phase
    L.kneeLP.rotation.x=Math.max(0,-sw)*.6;
    L.kneeRP.rotation.x=Math.max(0,sw)*.6;

    // Body bob
    L.waist.position.y=.44+Math.abs(Math.sin(t*18))*.008;

    // Head nod
    L.neckPivot.rotation.x=sw*.02;

  }else if(s==='harvest'){
    const ch=Math.sin(t*7);

    // Right arm chop
    L.armRP.rotation.x=-1.8+ch*.7;
    L.elbowRP.rotation.x=-.8+ch*.5;

    // Left arm brace
    L.armLP.rotation.x=-.3;
    L.elbowLP.rotation.x=-.4;

    // Body lean
    L.waist.rotation.x=.12+Math.sin(t*7)*.08;

    // Legs braced
    L.legLP.rotation.x=.08;L.legRP.rotation.x=-.04;
    L.kneeLP.rotation.x=.15;L.kneeRP.rotation.x=.1;

  }else if(s==='build'){
    const hm=Math.sin(t*6);

    // Both arms hammer
    L.armLP.rotation.x=-1.6+hm*.4;
    L.armRP.rotation.x=-1.6+hm*.4;
    L.elbowLP.rotation.x=-.6+hm*.35;
    L.elbowRP.rotation.x=-.6+hm*.35;

    // Body lean
    L.waist.rotation.x=.1;

    // Legs braced
    L.legLP.rotation.x=.12;L.legRP.rotation.x=.12;
    L.kneeLP.rotation.x=.2;L.kneeRP.rotation.x=.2;

  }else if(s==='rest'){
    // Sitting pose
    L.legLP.rotation.x=-.8;L.legRP.rotation.x=-.8;
    L.kneeLP.rotation.x=1.2;L.kneeRP.rotation.x=1.2;

    L.armLP.rotation.x=.3;L.armRP.rotation.x=.3;
    L.elbowLP.rotation.x=-.6;L.elbowRP.rotation.x=-.6;

    L.waist.position.y=.32;
    L.waist.rotation.x=-.1+Math.sin(t*1.8)*.02;

  }else{
    // Idle
    const sw=Math.sin(t*1.5);
    L.armLP.rotation.x=sw*.04;
    L.armRP.rotation.x=-sw*.04;

    // Natural elbow resting bend
    L.elbowLP.rotation.x=-.08;
    L.elbowRP.rotation.x=-.08;

    L.legLP.rotation.x=0;L.legRP.rotation.x=0;
    L.kneeLP.rotation.x=0;L.kneeRP.rotation.x=0;

    // Breathing
    L.waist.position.y=.44+Math.sin(t*2)*.003;
  }
}
