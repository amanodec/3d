import { Component, Suspense, useRef, useState } from 'react';
import type { ReactNode, RefObject } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import type { OrbitControls as OrbitControlsType } from 'three-stdlib';
import Architecture from './Architecture';
import type { Configuration, SceneMotion } from '../types';

type Props = { config:Configuration; motion:RefObject<SceneMotion>; interactive:boolean; compare:boolean; reset:number; reduced:boolean };
function Director({motion,interactive,reset,reduced}:Omit<Props,'config'|'compare'>) {
 const {camera,size,pointer}=useThree();
 const controls=useRef<OrbitControlsType>(null);
 const lastReset=useRef(-1); const wasInteractive=useRef(false); const transition=useRef(0);
 const destination=useRef(new THREE.Vector3()); const target=useRef(new THREE.Vector3()); const lookAt=useRef(new THREE.Vector3(-3.2,2.8,0));
 useFrame((_,dt)=>{
  const mobile=size.width<760; const p=motion.current.progress;
  if(interactive) {
   if(!wasInteractive.current || lastReset.current!==reset){transition.current=reduced?.01:1.6;lastReset.current=reset;}
   if(transition.current>0){
    transition.current-=dt;
    destination.current.set(mobile?25:19,mobile?18:14,mobile?30:24);target.current.set(mobile?0:3,mobile?5:2.8,0);
    camera.position.lerp(destination.current,reduced?1:1-Math.exp(-dt*5));
    controls.current?.target.lerp(target.current,reduced?1:1-Math.exp(-dt*5));controls.current?.update();
   }
   if(controls.current)controls.current.enabled=transition.current<=0;
   wasInteractive.current=true; return;
  }
  wasInteractive.current=false;
  if(motion.current.act===0){
   destination.current.set(mobile?32:20, mobile?24:14, mobile?38:23);
   target.current.set(mobile?0:-3.2,mobile?5:2.8,0);
   if(!reduced){destination.current.x+=pointer.x*.28+motion.current.reveal*1.4;destination.current.y+=pointer.y*.18;}
  }else{
   const angle=.78-p*1.35; const radius=(mobile?50:28)-Math.sin(p*Math.PI)*(mobile?5:6);
   destination.current.set(Math.sin(angle)*radius,mobile?24:12-Math.sin(p*Math.PI)*3,Math.cos(angle)*radius);
   target.current.set(mobile?0:-2,mobile?5:2.6,0);
  }
  camera.position.lerp(destination.current,1-Math.exp(-dt*4));lookAt.current.lerp(target.current,1-Math.exp(-dt*4));camera.lookAt(lookAt.current);controls.current?.target.copy(lookAt.current);
 });
 return <OrbitControls ref={controls} enabled={interactive} enableDamping dampingFactor={.07} enablePan={false} minDistance={14} maxDistance={55} minPolarAngle={Math.PI*.15} maxPolarAngle={Math.PI*.46} target={[2.4,1,0]} makeDefault/>;
}
function Lighting({config}: {config:Configuration}) {
 const sun=useRef<THREE.DirectionalLight>(null);const ambient=useRef<THREE.AmbientLight>(null);
 useFrame((_,dt)=>{ if(sun.current) sun.current.intensity=THREE.MathUtils.damp(sun.current.intensity,config.lighting==='Day'?3.3:2.3,3,dt); if(ambient.current)ambient.current.intensity=THREE.MathUtils.damp(ambient.current.intensity,config.lighting==='Day'?.95:.55,3,dt); });
 return <><ambientLight ref={ambient} intensity={.55}/><hemisphereLight args={['#d5ddc3','#544832',.8]}/><directionalLight ref={sun} position={[-7,12,8]} color="#ffe0af" intensity={2.3} castShadow shadow-mapSize={[2048,2048]} shadow-camera-left={-13} shadow-camera-right={13} shadow-camera-top={13} shadow-camera-bottom={-13} shadow-bias={-.0003} shadow-normalBias={.04}/><pointLight position={[1,1.65,-.5]} color="#ffc16b" intensity={config.lighting==='Dusk'?7:0.5} distance={7} decay={2}/><pointLight position={[-2,4.5,.6]} color="#ffd18c" intensity={config.lighting==='Dusk'?4:.3} distance={5} decay={2}/><directionalLight position={[7,6,-8]} color="#a9b5c4" intensity={1.8}/></>;
}
class Boundary extends Component<{children:ReactNode},{error:boolean}> {
 state={error:false};static getDerivedStateFromError(){return {error:true};}
 render(){return this.state.error?<div className="scene-fallback"><span>THE FORMA RESIDENCE</span><p>Your browser couldn’t start the 3D view.<br/>Enable hardware acceleration and reload to explore.</p><button onClick={()=>window.location.reload()}>Reload experience ↗</button></div>:this.props.children;}
}
export default function Scene(props:Props){
 const [ready,setReady]=useState(false);
 return <Boundary><div className={`scene ${ready?'is-ready':''}`} aria-label="Interactive 3D model of a modern two-storey home">
  {!ready&&<div className="scene-loading">CRAFTING YOUR PERSPECTIVE <span/></div>}
  <Canvas shadows dpr={[1,1.6]} camera={{position:[19,12,21],fov:38,near:.1,far:120}} gl={{antialias:true,alpha:true,powerPreference:'high-performance'}} onCreated={({gl})=>{gl.toneMapping=THREE.ACESFilmicToneMapping;gl.toneMappingExposure=1.1;setReady(true);}} fallback={<div className="scene-fallback">WebGL is unavailable. Try a browser with hardware acceleration.</div>}>
   <Suspense fallback={null}><Lighting config={props.config}/><Architecture config={props.config} motion={props.motion} compare={props.compare}/>
   <mesh rotation={[-Math.PI/2,0,0]} position={[0,-.95,0]} receiveShadow><planeGeometry args={[200,200]}/><shadowMaterial transparent opacity={.36}/></mesh>
   <Director {...props}/></Suspense>
  </Canvas>
 </div></Boundary>;
}
