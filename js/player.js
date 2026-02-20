// ═══════════════════════════════════════════════════
//  PLAYER
// ═══════════════════════════════════════════════════
const playerMesh=mkHuman(true);
playerMesh.position.set(0,getH(0,0),0);

// Move marker
const markerMat=mkPBR(new BABYLON.Color3(.3,.66,.87),.2,.5);markerMat.alpha=0;
const marker=BABYLON.MeshBuilder.CreateTorus('marker',{diameter:.5,thickness:.03,tessellation:16},scene);
marker.material=markerMat;marker.rotation.x=Math.PI/2;marker.position.y=.05;
let markerFade=0;

function updatePlayer(dt){
  if(P.moving&&!P.busy){
    const dx=P.targetX-P.x,dz=P.targetZ-P.z,dist=Math.hypot(dx,dz);
    const arriveR=P.onArrive?1.2:.2;
    if(dist<arriveR){
      P.moving=false;playerMesh.metadata.animState='idle';G.player.action='Đứng yên';
      if(P.onArrive){const cb=P.onArrive;P.onArrive=null;cb();}
    }else{
      const spd=3.2*dt;P.x+=dx/dist*spd;P.z+=dz/dist*spd;
      P.x=Math.max(-18,Math.min(18,P.x));P.z=Math.max(-18,Math.min(18,P.z));
      playerMesh.rotation.y=Math.atan2(dx,dz);
      playerMesh.metadata.animState='walk';G.player.action='Di chuyển';
      G.player.energy=Math.max(0,G.player.energy-.015);
    }
  }
  playerMesh.position.set(P.x,getH(P.x,P.z),P.z);
  camera.target.set(P.x,getH(P.x,P.z)+.5,P.z);
  if(markerFade>0){markerFade-=dt*2;markerMat.alpha=Math.max(0,markerFade*.4);}
  if(playerMesh.metadata.ring)playerMesh.metadata.ring.material.alpha=.3+Math.sin(Date.now()*.003)*.12;
}

function playerMoveTo(x,z,cb){P.targetX=x;P.targetZ=z;P.moving=true;P.onArrive=cb||null;marker.position.set(x,getH(x,z)+.05,z);markerFade=1;}
