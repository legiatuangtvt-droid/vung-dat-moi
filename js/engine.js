// ═══════════════════════════════════════════════════
//  BABYLON.JS ENGINE SETUP
// ═══════════════════════════════════════════════════
const canvas=document.getElementById('renderCanvas');
const engine=new BABYLON.Engine(canvas,true,{preserveDrawingBuffer:true,stencil:true});
const scene=new BABYLON.Scene(engine);

// Performance
scene.performancePriority=BABYLON.ScenePerformancePriority.Intermediate;
scene.clearColor=new BABYLON.Color4(.07,.10,.16,1);
scene.fogMode=BABYLON.Scene.FOGMODE_EXP2;
scene.fogDensity=.008;
scene.fogColor=new BABYLON.Color3(.07,.10,.16);
scene.ambientColor=new BABYLON.Color3(.25,.28,.35);

// Environment texture for PBR materials (required for proper lighting)
scene.environmentTexture=BABYLON.CubeTexture.CreateFromPrefilteredData(
  'https://assets.babylonjs.com/environments/environmentSpecular.env',scene);
scene.environmentIntensity=.6;

// Camera — ArcRotate (orbit around player)
const camera=new BABYLON.ArcRotateCamera('cam',Math.PI/4,.9,14,BABYLON.Vector3.Zero(),scene);
camera.attachControl(canvas,true);
camera.lowerRadiusLimit=4;camera.upperRadiusLimit=28;
camera.lowerBetaLimit=.3;camera.upperBetaLimit=1.4;
camera.wheelDeltaPercentage=.01;
camera.panningSensibility=0;

// ── LIGHTS ──
const hemi=new BABYLON.HemisphericLight('hemi',new BABYLON.Vector3(0,1,0),scene);
hemi.intensity=.7;hemi.diffuse=new BABYLON.Color3(.7,.78,.9);
hemi.groundColor=new BABYLON.Color3(.2,.22,.18);

const sun=new BABYLON.DirectionalLight('sun',new BABYLON.Vector3(-1,-2,-.5),scene);
sun.intensity=1.6;sun.diffuse=new BABYLON.Color3(1,.96,.88);

// ── SHADOWS ──
const shadowGen=new BABYLON.ShadowGenerator(2048,sun);
shadowGen.useBlurExponentialShadowMap=true;
shadowGen.blurKernel=16;
shadowGen.setDarkness(.4);

// ── POST PROCESSING ──
const pipeline=new BABYLON.DefaultRenderingPipeline('pipeline',true,scene,[camera]);
pipeline.bloomEnabled=true;pipeline.bloomThreshold=.7;pipeline.bloomWeight=.3;pipeline.bloomKernel=32;
pipeline.fxaaEnabled=true;
pipeline.imageProcessingEnabled=true;
pipeline.imageProcessing.toneMappingEnabled=true;
pipeline.imageProcessing.toneMappingType=BABYLON.ImageProcessingConfiguration.TONEMAPPING_ACES;
pipeline.imageProcessing.exposure=1.3;pipeline.imageProcessing.contrast=1.2;

// ── SKY ──
const skyMat=new BABYLON.StandardMaterial('skyMat',scene);
skyMat.backFaceCulling=false;
skyMat.diffuseColor=new BABYLON.Color3(0,0,0);
skyMat.specularColor=new BABYLON.Color3(0,0,0);
skyMat.emissiveColor=new BABYLON.Color3(.05,.08,.15);
const skybox=BABYLON.MeshBuilder.CreateBox('skybox',{size:200},scene);
skybox.material=skyMat;

// ═══════════════════════════════════════════════════
//  TERRAIN with PBR
// ═══════════════════════════════════════════════════
const GRID=40;
const ground=BABYLON.MeshBuilder.CreateGround('ground',{width:GRID,height:GRID,subdivisions:40,updatable:true},scene);
const groundMat=new BABYLON.PBRMaterial('groundMat',scene);
groundMat.albedoColor=new BABYLON.Color3(.2,.32,.16);
groundMat.roughness=.92;groundMat.metallic=0;
groundMat.environmentIntensity=.3;
ground.material=groundMat;
ground.receiveShadows=true;

// Height map function
function getH(x,z){return Math.sin(x*.3)*Math.cos(z*.3)*.6+Math.sin(x*.1+1)*Math.cos(z*.15)*1.2}

// Apply height map
const positions=ground.getVerticesData(BABYLON.VertexBuffer.PositionKind);
for(let i=0;i<positions.length;i+=3){
  positions[i+1]=getH(positions[i],positions[i+2]);
}
ground.updateVerticesData(BABYLON.VertexBuffer.PositionKind,positions);
ground.createNormals(false);

// Water
const waterMesh=BABYLON.MeshBuilder.CreateGround('water',{width:80,height:80},scene);
const waterMat=new BABYLON.PBRMaterial('waterMat',scene);
waterMat.albedoColor=new BABYLON.Color3(.08,.2,.32);
waterMat.roughness=.15;waterMat.metallic=.4;waterMat.alpha=.65;
waterMesh.material=waterMat;waterMesh.position.y=-.8;

// Grid lines
const gridLines=[];
for(let i=-GRID/2;i<=GRID/2;i++){
  gridLines.push([new BABYLON.Vector3(i,.02,-GRID/2),new BABYLON.Vector3(i,.02,GRID/2)]);
  gridLines.push([new BABYLON.Vector3(-GRID/2,.02,i),new BABYLON.Vector3(GRID/2,.02,i)]);
}
const gridMesh=BABYLON.MeshBuilder.CreateLineSystem('grid',{lines:gridLines},scene);
gridMesh.color=new BABYLON.Color3(.15,.25,.18);gridMesh.alpha=.15;

// ── HELPERS ──
function mkPBR(color,rough,metal){
  const m=new BABYLON.PBRMaterial('m'+Math.random(),scene);
  m.albedoColor=color;m.roughness=rough;m.metallic=metal||0;m.environmentIntensity=.3;return m;
}
