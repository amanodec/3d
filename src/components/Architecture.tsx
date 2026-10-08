import { useEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { accentColors, facadeColors, roofColors } from '../types';
import type { Configuration, SceneMotion } from '../types';

type Vec3 = [number, number, number];
function Block({ at, size, material, color = '#b7af97', ...props }: { at: Vec3; size: Vec3; material?: THREE.Material; color?: string; rotation?: Vec3 }) {
  return <mesh position={at} castShadow receiveShadow {...props}><boxGeometry args={size}/>{material ? <primitive object={material} attach="material"/> : <meshStandardMaterial color={color} roughness={.8}/>}</mesh>;
}
function Tree({ at, scale = 1, seed = 0 }: { at: Vec3; scale?: number; seed?: number }) {
  return <group position={at} scale={scale}>
    <mesh position={[0, 1.1, 0]} castShadow><cylinderGeometry args={[.065, .11, 2.2, 7]}/><meshStandardMaterial color="#61523b"/></mesh>
    {[0,1,2,3,4,5,6,7,8].map((i) => <mesh key={i} position={[Math.sin(i*2.4+seed)*.62, 2+Math.sin(i*1.6)*.48, Math.cos(i*2.4+seed)*.62]} scale={[.8,.65,.8]} castShadow><icosahedronGeometry args={[.76,1]}/><meshStandardMaterial color={['#575e36','#73744a','#626b40','#818159'][i%4]} roughness={1}/></mesh>)}
  </group>;
}
function Bush({ at, scale = 1 }: { at: Vec3; scale?: number }) {
 return <mesh position={at} scale={[scale,scale*.65,scale]} castShadow><icosahedronGeometry args={[.43,1]}/><meshStandardMaterial color="#4a5935" roughness={1}/></mesh>;
}
function Window({ at, width, height, side = false }: {at: Vec3; width: number; height: number; side?: boolean}) {
 return <group position={at} rotation={[0,side ? Math.PI/2:0,0]}>
  <mesh><boxGeometry args={[width,height,.035]}/><meshPhysicalMaterial color="#8b9d91" metalness={.32} roughness={.16} transparent opacity={.23} depthWrite={false}/></mesh>
  {Array.from({length: Math.ceil(width/1.15)+1},(_,i)=><Block key={i} at={[-width/2+i*width/Math.ceil(width/1.15),0,.03]} size={[.035,height+.05,.06]} color="#2f332d"/>)}
  <Block at={[0,height/2,0]} size={[width,.04,.08]} color="#32352e"/><Block at={[0,-height/2,0]} size={[width,.04,.08]} color="#32352e"/>
 </group>;
}
export default function Architecture({config,motion,compare}: {config:Configuration;motion:React.RefObject<SceneMotion>;compare:boolean}) {
 const materials = useMemo(() => ({ facade:new THREE.MeshStandardMaterial({color:facadeColors.Limestone,roughness:.87}), accent:new THREE.MeshStandardMaterial({color:accentColors['Natural Oak'],roughness:.68}), roof:new THREE.MeshStandardMaterial({color:roofColors.Slate,roughness:.8}), glow:new THREE.MeshStandardMaterial({color:'#ffe6ab',emissive:'#ffc57a',emissiveIntensity:2}) }),[]);
 const colors=useMemo(()=>({facade:new THREE.Color(),accent:new THREE.Color(),roof:new THREE.Color(),old:new THREE.Color('#878172')}),[]);
 useEffect(()=>()=>Object.values(materials).forEach(m=>m.dispose()),[materials]);
 useFrame((_,dt)=>{
   const t=compare ? 0 : motion.current.act===1 ? motion.current.progress : 1;
   colors.facade.set(facadeColors[config.facade]).lerp(colors.old,1-t);
   colors.accent.set(accentColors[config.accent]).lerp(new THREE.Color('#676757'),1-t);
   colors.roof.set(roofColors[config.roof]).lerp(new THREE.Color('#83735c'),1-t);
   const a=1-Math.exp(-dt*5);
   materials.facade.color.lerp(colors.facade,a);materials.accent.color.lerp(colors.accent,a);materials.roof.color.lerp(colors.roof,a);
   materials.glow.emissiveIntensity=THREE.MathUtils.damp(materials.glow.emissiveIntensity,(config.lighting==='Dusk'?2: .35)*(.2+t*.8),5,dt);
 });
 return <group position={[0,-.6,0]}>
  {/* A floating, cut-earth architectural site model. */}
  <Block at={[0,-.31,0]} size={[14.4,.55,10.2]} color="#464a36"/>
  <Block at={[0,-.015,0]} size={[14.5,.08,10.3]} color="#62664e"/>
  <Block at={[.3,.06,.25]} size={[10.6,.15,7.7]} color="#8d8974"/>
  <Block at={[0,.16,0]} size={[9.9,.18,5.7]} material={materials.facade}/>
  {/* Ground-floor pavilion and furnished interior. */}
  <Block at={[0,1.55,-2.35]} size={[9.6,2.7,.2]} material={materials.facade}/>
  <Block at={[-4.75,1.55,0]} size={[.22,2.7,4.7]} material={materials.facade}/>
  <Block at={[-1.55,1.55,-.15]} size={[.19,2.7,4.4]} material={materials.facade}/>
  <Block at={[0,.3,0]} size={[9.5,.12,4.7]} color="#a89b7f"/>
  <Block at={[0,2.88,0]} size={[10.15,.24,5.4]} material={materials.roof}/>
  <Block at={[0,2.745,2.35]} size={[9.5,.032,.035]} material={materials.glow}/>
  <Window at={[1.6,1.53,2.38]} width={6.2} height={2.35}/>
  <Window at={[4.77,1.53,0]} width={4.75} height={2.35} side/>
  <Block at={[-3.2,1.5,2.33]} size={[3.05,2.55,.15]} material={materials.accent}/>
  {Array.from({length:30},(_,i)=><Block key={`lower-slat${i}`} at={[-4.65+i*.098,1.53,2.44]} size={[.04,2.55,.09]} material={materials.accent}/>)}
  <Block at={[-2.8,1.28,2.48]} size={[.8,2.2,.06]} color="#554f3d"/>
  <Block at={[-2.52,1.3,2.54]} size={[.025,.4,.035]} color="#c1aa7e"/>
  {/* Living room: low sofa, chairs, table, art and pendant. */}
  <Block at={[1.15,.57,-.8]} size={[2.65,.43,.95]} color="#d6cbb0"/>
  <Block at={[1.15,.92,-1.23]} size={[2.65,.65,.22]} color="#c7bda2"/>
  <Block at={[-.11,.82,-.8]} size={[.2,.55,1.1]} color="#c7bda2"/>
  <Block at={[2.4,.82,-.8]} size={[.2,.55,1.1]} color="#c7bda2"/>
  <Block at={[1.2,.47,.65]} size={[1.55,.18,.75]} color="#52483a"/>
  <Block at={[1.2,.34,.65]} size={[.95,.15,.42]} color="#39392f"/>
  <Block at={[3.5,.55,.15]} size={[.65,.5,.68]} material={materials.accent}/>
  <Block at={[3.5,.85,-.15]} size={[.65,.45,.12]} material={materials.accent}/>
  <Block at={[.8,1.75,-2.21]} size={[1.4,.94,.04]} color="#3f463c"/>
  <Block at={[.8,1.75,-2.17]} size={[.65,.75,.01]} color="#ad9873"/>
  <mesh position={[2.7,2.42,.2]}><cylinderGeometry args={[.32,.45,.17,24]}/><primitive attach="material" object={materials.glow}/></mesh>
  {/* Cantilevered upper floor: limestone frame and deep timber reveal. */}
  <Block at={[-1.5,3.05,-.6]} size={[7.9,.2,4.55]} material={materials.facade}/>
  <Block at={[-1.5,5.4,-.6]} size={[8,.26,4.6]} material={materials.facade}/>
  <Block at={[-1.5,5.56,-.6]} size={[8.1,.09,4.7]} material={materials.roof}/>
  <Block at={[-5.35,4.22,-.6]} size={[.25,2.2,4.55]} material={materials.facade}/>
  <Block at={[-1.5,4.22,-2.77]} size={[7.7,2.2,.2]} material={materials.facade}/>
  <Block at={[-1.5,4.2,-.35]} size={[7.5,2.2,.14]} material={materials.accent}/>
  <Window at={[-2.8,4.2,1.32]} width={4.7} height={2.05}/>
  <Window at={[2.3,4.2,-.6]} width={4.2} height={2.1} side/>
  <Block at={[1.1,4.22,1.52]} size={[2.5,2.2,.14]} material={materials.accent}/>
  {Array.from({length:26},(_,i)=><Block key={`slat${i}`} at={[-.1+i*.096,4.22,1.64]} size={[.037,2.17,.12]} material={materials.accent}/>)}
  <Block at={[-1.4,5.22,1.4]} size={[7.6,.026,.04]} material={materials.glow}/>
  <Block at={[-3.2,3.42,.15]} size={[2.1,.55,1.3]} color="#c3bca7"/>
  {/* Terrace, reflecting pool, approach, and low garden walls. */}
  <Block at={[2.4,.13,3.35]} size={[5,.16,1.85]} material={materials.accent}/>
  {Array.from({length:33},(_,i)=><Block key={`deck${i}`} at={[i*.15,.219,3.35]} size={[.012,.009,1.83]} color="#4f4a36"/>)}
  <Block at={[-4.4,.09,3.67]} size={[3.4,.12,1.9]} color="#a6a18b"/>
  <mesh position={[-4.4,.161,3.67]} rotation={[-Math.PI/2,0,0]}><planeGeometry args={[3.12,1.61]}/><meshPhysicalMaterial color="#435e59" metalness={.5} roughness={.16}/></mesh>
  <Block at={[-.9,.13,3.48]} size={[1.6,.17,1.85]} color="#b5b098"/>
  {[0,1,2,3].map(i=><Block key={`step${i}`} at={[-.9-i*.13,.035,4.65+i*.04]} size={[1.55,.1,.19]} color="#bbb49d"/>)}
  {[0,1,2,3,4,5].map(i=><Block key={`path${i}`} at={[5.6,.085,3.8-i*1.2]} size={[.95,.08,.82]} color="#ada68d"/>)}
  <Block at={[-6.1,.35,-.9]} size={[.2,.65,6.9]} color="#817f67"/>
  <Block at={[.1,.3,-4.45]} size={[12,.5,.16]} color="#7c7d63"/>
  <Tree at={[-5.9,.08,-2.6]} scale={1.26}/><Tree at={[5.7,.08,-3.4]} scale={1.12} seed={3}/><Tree at={[-6.2,.08,1.5]} scale={.73} seed={1}/>
  {Array.from({length:18},(_,i)=><Bush key={`bush${i}`} at={[-5.7+i*.65,.27,-3.7]} scale={.75+Math.sin(i)*.15}/>)}
  {[[-6.5,.27,3.4],[-6.3,.25,4.25],[6.2,.27,1.6],[6.2,.26,2.3],[6.2,.27,3],[5.8,.2,-1.6]].map((p,i)=><Bush at={p as Vec3} key={i} scale={.8}/>)}
  {[-5.6,5.5].map(x=><group key={x}><Block at={[x,.42,4.3]} size={[.09,.8,.09]} color="#343a2c"/><Block at={[x,.74,4.3]} size={[.1,.08,.1]} material={materials.glow}/></group>)}
  <Block at={[3.6,.44,3.2]} size={[1.7,.15,.62]} color="#c8bc9d"/>
  <Block at={[3.6,.65,3.46]} size={[1.7,.38,.12]} color="#b6a888"/>
  {[2.95,4.25].map(x=><Block key={x} at={[x,.29,3.2]} size={[.08,.24,.55]} color="#3f4438"/>)}
 </group>;
}
