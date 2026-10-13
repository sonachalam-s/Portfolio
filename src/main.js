import * as THREE from 'three';
import './style.css';

// ---------- reveal ----------
const io=new IntersectionObserver(e=>e.forEach(x=>x.isIntersecting&&x.target.classList.add('in')),{threshold:.2});
document.querySelectorAll('.fade').forEach(el=>io.observe(el));

// ---------- 3D avatar ----------
const cv=document.getElementById('cv');
const R=new THREE.WebGLRenderer({canvas:cv,antialias:true,alpha:true});
R.setPixelRatio(Math.min(devicePixelRatio,2));
const S=new THREE.Scene(),C=new THREE.PerspectiveCamera(35,1,.1,60);
S.add(new THREE.AmbientLight(0xffffff,.55));
const key=new THREE.DirectionalLight(0xffffff,.9);key.position.set(2,4,5);S.add(key);
const p1=new THREE.PointLight(0x8b5cf6,2.4,14);p1.position.set(-2.5,2,-2);S.add(p1);
const p2=new THREE.PointLight(0xec4899,1.5,14);p2.position.set(3,1,-1.5);S.add(p2);
const M=(c,r=.5)=>new THREE.MeshStandardMaterial({color:c,roughness:r});
const add=(par,g,m,p=[0,0,0],s=[1,1,1])=>{const o=new THREE.Mesh(g,m);o.position.set(...p);o.scale.set(...s);par.add(o);return o};
const skin=M(0xb97a52,.6),hood=M(0x15151c,.8),white=M(0xf2f2f5,.4),dark=M(0x0a0a0a,.3);
const A=new THREE.Group();S.add(A);
// body
add(A,new THREE.SphereGeometry(.72,32,24),hood,[0,.55,0],[1,.95,.7]);
add(A,new THREE.CylinderGeometry(.17,.2,.35,16),skin,[0,1.2,0]);
add(A,new THREE.BoxGeometry(.8,.3,.6),M(0x1e1e28),[0,-.15,.05]);
[-1,1].forEach(s=>{
  add(A,new THREE.BoxGeometry(.3,.26,.95),M(0x2a2a36),[s*.24,.0,.55]);
  add(A,new THREE.CylinderGeometry(.12,.11,.85,12),M(0x2a2a36),[s*.24,-.4,1.0]);
  add(A,new THREE.BoxGeometry(.26,.14,.45),white,[s*.24,-.88,1.12]);
});
// head
const H=new THREE.Group();H.position.y=1.58;A.add(H);
add(H,new THREE.SphereGeometry(.5,40,32),skin,[0,0,0],[1,1.04,1]);
add(H,new THREE.SphereGeometry(.4,24,16),skin,[0,-.14,.08],[1.1,.9,1]); // jaw/cheeks
[-1,1].forEach(s=>{
  add(H,new THREE.SphereGeometry(.09,16,12),skin,[s*.5,-.02,0],[.5,1,.8]);   // ears
  add(H,new THREE.SphereGeometry(.075,16,12),white,[s*.17,-.02,.43],[1,1.05,.5]); // eyes
  add(H,new THREE.SphereGeometry(.04,12,10),dark,[s*.17,-.02,.465],[1,1,.5]);
  const br=add(H,new THREE.BoxGeometry(.2,.04,.04),dark,[s*.17,.1,.46]);br.rotation.z=s*.28;
});
add(H,new THREE.SphereGeometry(.07,16,12),skin,[0,-.1,.5],[1,.9,.9]);       // nose
const mouth=add(H,new THREE.TorusGeometry(.17,.028,10,24,Math.PI),M(0x4a1d14),[0,-.2,.44]);mouth.rotation.z=Math.PI;
add(H,new THREE.BoxGeometry(.24,.04,.02),white,[0,-.19,.45]);               // teeth
// cap
const cap=new THREE.Group();cap.position.y=.2;cap.rotation.x=-.2;H.add(cap);
add(cap,new THREE.SphereGeometry(.545,36,20,0,Math.PI*2,0,Math.PI/2),white);
const brim=add(cap,new THREE.CylinderGeometry(.56,.56,.035,32,1,false,-Math.PI/2,Math.PI),white,[0,.01,.18]);brim.rotation.x=.18;
// arms
const handsL=[],arms=[];
[-1,1].forEach(s=>{
  const sh=new THREE.Group();sh.position.set(s*.68,.85,0);A.add(sh);
  const arm=add(sh,new THREE.CylinderGeometry(.14,.12,1,14),hood);arm.geometry.translate(0,.5,0);arm.geometry.rotateX(Math.PI/2);
  const hand=add(A,new THREE.SphereGeometry(.13,16,12),skin,[s*.28,.64,1.0]);
  arms.push({sh,arm,hand});
});
// desk + laptop
const wood=M(0x2b2b36,.4);
add(A,new THREE.BoxGeometry(3.2,.07,1.2),M(0x101016,.3),[0,.5,1.15]);
[-1.5,1.5].forEach(x=>[.65,1.65].forEach(z=>add(A,new THREE.BoxGeometry(.06,1.4,.06),wood,[x,-.2,z])));
add(A,new THREE.BoxGeometry(1.0,.03,.7),M(0x2a2a36),[0,.55,1.0]);
const lid=add(A,new THREE.BoxGeometry(1.0,.7,.03),new THREE.MeshStandardMaterial({color:0xf472b6,emissive:0xec4899,emissiveIntensity:.55,roughness:.3}),[0,.93,1.35]);lid.rotation.x=-.12;
add(A,new THREE.CylinderGeometry(.9,.9,.05,40),M(0x0c0c12,.9),[0,-.95,.9]);
// chair back
add(A,new THREE.BoxGeometry(.95,1.1,.08),M(0xd8c3a0,.7),[0,.3,-.6]);
// stage glow
const ring=add(A,new THREE.RingGeometry(2.4,2.5,64),new THREE.MeshBasicMaterial({color:0x8b5cf6,transparent:true,opacity:.5,side:2}),[0,-.97,.4]);ring.rotation.x=-Math.PI/2;

// ---------- scroll + mouse ----------
const K=[[0,1.7,3.0, 0,1.55,0, -1.0],[.3,1.66,2.6, 0,1.5,0, -1.1],[.3,1.4,6.8, 0,.5,0, -1.6]];
const mouse={x:0,y:0},cur=K[0].slice();
addEventListener('pointermove',e=>{mouse.x=e.clientX/innerWidth*2-1;mouse.y=e.clientY/innerHeight*2-1});
function resize(){R.setSize(innerWidth,innerHeight,false);C.aspect=innerWidth/innerHeight;C.updateProjectionMatrix()}
addEventListener('resize',resize);resize();
const v=new THREE.Vector3(),clk=new THREE.Clock();let blink=0;
function loop(){
  const t=clk.getElapsedTime();
  const p=Math.min(1,scrollY/(innerHeight*2)),k=p*2,a=k<1?K[0]:K[1],b=k<1?K[1]:K[2],f=k<1?k:k-1,e=f*f*(3-2*f);
  const wide=innerWidth>800;
  for(let i=0;i<7;i++){let tg=a[i]+(b[i]-a[i])*e;if(i==6&&!wide)tg*=.25;cur[i]+=(tg-cur[i])*.08}
  C.position.set(cur[0],cur[1],cur[2]);C.lookAt(cur[3],cur[4],cur[5]);A.position.x=cur[6];
  A.position.y=Math.sin(t*1.6)*.015;
  H.rotation.y+=((mouse.x*.5)-H.rotation.y)*.06;
  H.rotation.x+=((mouse.y*.25)-H.rotation.x)*.06;
  H.rotation.z=Math.sin(t*.8)*.03;
  mouth.scale.y=1+Math.sin(t*1.2)*.05;
  blink=(t%4<.12)?.1:1;H.children.forEach(c=>{if(c.geometry&&c.geometry.parameters&&c.geometry.parameters.radius===.075)c.scale.y=1.05*blink});
  A.updateMatrixWorld(true);
  arms.forEach((o,i)=>{o.hand.position.y=.64+Math.max(0,Math.sin(t*9+i*2))*.04;o.hand.position.z=1.0+Math.sin(t*3+i)*.02;
    o.hand.getWorldPosition(v);const w=o.sh.getWorldPosition(new THREE.Vector3());const d=v.clone().sub(w);
    o.sh.lookAt(v);o.arm.scale.y=d.length()});
  p1.intensity=2.2+Math.sin(t*2)*.3;
  R.render(S,C);requestAnimationFrame(loop);
}
loop();

// ---------- tech stack physics ----------
const tc=document.getElementById('ts'),x=tc.getContext('2d');
const L=['JS','DS','React','Next','Node','Three','Tableau','PowerBI','Python','CSS','Git','SQL','HTML','AWS','AI','MongoDB','Docker','ML'];
let W,Hh,balls=[],ptr={x:-999,y:-999},live=false,spawned=false;
function rs(){W=tc.width=tc.offsetWidth;Hh=tc.height=tc.offsetHeight}
addEventListener('resize',rs);rs();
const stackEl=document.getElementById('stack');
new IntersectionObserver(e=>{live=e[0].isIntersecting;if(live&&!spawned){spawned=true;L.forEach((l,i)=>{const r=(W>700?38:26)+Math.random()*18;balls.push({x:Math.random()*W,y:-r-i*60,vx:0,vy:0,r,l})})}},{threshold:.2}).observe(stackEl);
tc.addEventListener('pointermove',e=>{const b=tc.getBoundingClientRect();ptr.x=e.clientX-b.left;ptr.y=e.clientY-b.top});
tc.addEventListener('pointerleave',()=>ptr.x=-999);
function phys(){
  if(live){
    x.clearRect(0,0,W,Hh);
    balls.forEach(a=>{
      a.vy+=.35;a.vx*=.995;
      const dx=a.x-ptr.x,dy=a.y-ptr.y,d=Math.hypot(dx,dy);
      if(d<a.r+90){const f=(a.r+90-d)/90*2.2;a.vx+=dx/d*f;a.vy+=dy/d*f}
      a.x+=a.vx;a.y+=a.vy;
      if(a.x<a.r){a.x=a.r;a.vx*=-.7}if(a.x>W-a.r){a.x=W-a.r;a.vx*=-.7}
      if(a.y>Hh-a.r){a.y=Hh-a.r;a.vy*=-.55;if(Math.abs(a.vy)<.6)a.vy=0}
    });
    for(let i=0;i<balls.length;i++)for(let j=i+1;j<balls.length;j++){
      const a=balls[i],b=balls[j],dx=b.x-a.x,dy=b.y-a.y,d=Math.hypot(dx,dy)||1,m=a.r+b.r;
      if(d<m){const nx=dx/d,ny=dy/d,o=(m-d)/2;a.x-=nx*o;a.y-=ny*o;b.x+=nx*o;b.y+=ny*o;
        const rv=(b.vx-a.vx)*nx+(b.vy-a.vy)*ny;if(rv<0){const j2=rv*.8;a.vx+=j2*nx;a.vy+=j2*ny;b.vx-=j2*nx;b.vy-=j2*ny}}
    }
    balls.forEach(a=>{
      const g=x.createRadialGradient(a.x-a.r*.35,a.y-a.r*.4,a.r*.1,a.x,a.y,a.r);
      g.addColorStop(0,'#fff');g.addColorStop(.7,'#d9d6ee');g.addColorStop(1,'#8b7fc7');
      x.fillStyle=g;x.beginPath();x.arc(a.x,a.y,a.r,0,7);x.fill();
      x.fillStyle='#15151c';x.font='700 '+Math.max(11,a.r*.36)+'px Space Grotesk,system-ui,sans-serif';x.textAlign='center';x.textBaseline='middle';x.fillText(a.l,a.x,a.y);
    });
  }
  requestAnimationFrame(phys);
}
phys();
