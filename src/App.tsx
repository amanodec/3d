import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { ArrowDown, ArrowRight, ArrowUpRight, Check, ChevronDown, Moon, MoveUpRight, RotateCcw, Sun, X } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Scene from './components/Scene';
import Enquiry from './components/Enquiry';
import { accentColors, facadeColors, roofColors } from './types';
import type { Configuration, SceneMotion } from './types';
gsap.registerPlugin(ScrollTrigger);

function MaterialOptions<T extends string>({title,number,options,value,onChange}:{title:string;number:string;options:Record<T,string>;value:T;onChange:(v:T)=>void}) {
 return <fieldset className="material-group"><legend><span>{number} / {title}</span><span>{value}</span></legend><div className="swatches">{(Object.keys(options) as T[]).map(name=><button type="button" key={name} onClick={()=>onChange(name)} aria-pressed={name===value} aria-label={`${title}: ${name}`} className={`swatch ${value===name?'selected':''}`}><span className={`swatch-color ${title==='Accent'?'wood':''}`} style={{backgroundColor:options[name]}}>{name===value&&<Check size={17} strokeWidth={1.5}/>}</span><span>{name}</span></button>)}</div></fieldset>;
}
export default function App() {
 const root=useRef<HTMLDivElement>(null);const story=useRef<HTMLElement>(null);const studio=useRef<HTMLElement>(null);
 const motion=useRef<SceneMotion>({act:0,progress:0,reveal:1});
 const [config,setConfig]=useState<Configuration>({facade:'Limestone',accent:'Natural Oak',roof:'Slate',lighting:'Dusk'});
 const [interactive,setInteractive]=useState(false);const [compare,setCompare]=useState(false);const [reset,setReset]=useState(0);const [enquiry,setEnquiry]=useState(false);const [menu,setMenu]=useState(false);const [act,setAct]=useState(0);
 const [reduced,setReduced]=useState(()=>window.matchMedia('(prefers-reduced-motion: reduce)').matches);
 useEffect(()=>{const query=window.matchMedia('(prefers-reduced-motion: reduce)');const fn=()=>setReduced(query.matches);query.addEventListener('change',fn);return()=>query.removeEventListener('change',fn);},[]);
 useLayoutEffect(()=>{
  const ctx=gsap.context(()=>{
   gsap.from('.reveal-line',{y:reduced?0:65,opacity:0,duration:reduced?.1:1.4,stagger:.12,ease:'power3.out',delay:.15});
   gsap.to(motion.current,{reveal:0,duration:reduced?0:3,ease:'power2.out'});
   gsap.to('.hero-content',{opacity:0,y:reduced?0:-50,ease:'none',scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom 35%',scrub:true}});
   const timeline=gsap.timeline({scrollTrigger:{trigger:story.current,start:'top top',end:reduced?'+=550':'+=1700',pin:true,scrub:reduced?true:.8,anticipatePin:1,onEnter:()=>{motion.current.act=1;setAct(1);setInteractive(false);},onLeaveBack:()=>{motion.current.act=0;setAct(0);},onUpdate:self=>{motion.current.progress=self.progress;}}});
   timeline.fromTo('.story-first',{opacity:1,y:0},{opacity:0,y:reduced?0:-30,duration:.25},.2).fromTo('.story-second',{opacity:0,y:reduced?0:35},{opacity:1,y:0,duration:.25},.48).fromTo('.transformation-fill',{scaleX:0},{scaleX:1,duration:1,ease:'none'},0);
   ScrollTrigger.create({trigger:studio.current,start:'top 60%',onEnter:()=>{motion.current.act=2;setAct(2);setInteractive(true);},onLeaveBack:()=>{motion.current.act=1;setAct(1);setInteractive(false);setCompare(false);}});
  },root);
  return()=>ctx.revert();
 },[reduced]);
 function navigate(id:string){setMenu(false);document.getElementById(id)?.scrollIntoView({behavior:reduced?'instant':'smooth'});}
 return <div ref={root} className={`experience ${interactive?'is-interactive':''}`}>
  <Scene config={config} motion={motion} interactive={interactive} compare={compare} reset={reset} reduced={reduced}/>
  <div className="grain" aria-hidden="true"/><div className="frame-line left"/><div className="frame-line right"/>
  <header className="header"><a href="#" onClick={e=>{e.preventDefault();navigate('home');}} className="wordmark" aria-label="FORMA home">FORMA<span>®</span></a><span className="header-tagline">A NEW PERSPECTIVE ON HOME</span><nav className={menu?'open':''} aria-label="Main navigation"><button onClick={()=>navigate('transformation')}>The transformation</button><button className="nav-studio" onClick={()=>navigate('studio')}>Design your home <ArrowUpRight size={15}/></button></nav><button className="menu-toggle icon-button" onClick={()=>setMenu(!menu)} aria-label={menu?'Close navigation':'Open navigation'} aria-expanded={menu}>{menu?<X size={22}/>:<span>Menu <ChevronDown size={14}/></span>}</button></header>
  <main>
  <section className="hero" id="home" aria-labelledby="hero-title"><div className="hero-content"><div className="hero-kicker reveal-line"><span className="status-dot"/> THE POSSIBILITY STARTS HERE</div><h1 id="hero-title"><span className="reveal-line">YOUR HOME.</span><span className="reveal-line muted">REIMAGINED.</span></h1><div className="hero-description reveal-line"><p>See what could be.<br/>Shape what comes next.</p><button className="round-link" onClick={()=>navigate('transformation')}><span className="circle-button"><ArrowDown size={20} strokeWidth={1.5}/></span><span>Explore the transformation</span></button></div></div>
   <div className="project-caption"><span className="tiny-cross">+</span><div><span>THE FORMA RESIDENCE</span><small>01 / A study in possibility</small></div><span className="caption-line"/></div>
   <span className="vertical-note">ARCHITECTURE. MATERIALITY. POSSIBILITY.</span>
   <div className="hero-bottom"><span>DESIGNED AROUND YOU.</span><span className="hero-bottom-center">CONCEPT 001 <span>/</span> MODERN SANCTUARY</span><button onClick={()=>navigate('transformation')}>SCROLL TO DISCOVER <ArrowDown size={13}/></button></div>
  </section>
  <section ref={story} className="transformation" id="transformation" aria-label="The transformation"><div className="story-top"><span className="eyebrow">01 / THE TRANSFORMATION</span><span className="story-meta">SAME HOME. ENTIRELY NEW FEELING.</span></div><div className="story-headline story-first"><h2>NOT JUST A<br/><span>RENOVATION.</span></h2><p>Familiar foundations.<br/>Unfamiliar possibilities.</p></div><div className="story-headline story-second"><h2>A NEW<br/><span>PERSPECTIVE.</span></h2><p>Thoughtful materials. Considered details.<br/>A home that feels entirely yours.</p></div><div className="story-bottom"><div className="transformation-progress"><div className="progress-label"><span>THE EXISTING</span><span>THE POSSIBLE</span></div><div className="progress-track"><div className="transformation-fill"/></div></div><button className={`outline-button ${compare?'active':''}`} onClick={()=>setCompare(!compare)} aria-pressed={compare}>{compare?'Return to transformation':'Compare original finishes'} <MoveUpRight size={15}/></button><button className="text-link" onClick={()=>navigate('studio')}>Make it yours <ArrowRight size={17}/></button></div></section>
  <section ref={studio} id="studio" className="studio" aria-labelledby="studio-title"><div className="studio-title"><span className="eyebrow">02 / YOUR DESIGN STUDIO</span><h2>Your home.<br/><span>Your signature.</span></h2><p>A few choices. An entirely different feeling.</p></div><div className="studio-model-caption"><span className="live-dot"/> LIVE PREVIEW<span className="caption-separator"/> DRAG TO EXPLORE<button className="reset-button" onClick={()=>setReset(s=>s+1)} aria-label="Reset 3D view"><RotateCcw size={15}/></button></div>
   <aside className="configurator" aria-label="House material configurator"><div className="config-header"><span>MAKE IT YOURS</span><span>01 / 03</span></div><MaterialOptions title="Facade" number="01" options={facadeColors} value={config.facade} onChange={facade=>setConfig(c=>({...c,facade}))}/><MaterialOptions title="Accent" number="02" options={accentColors} value={config.accent} onChange={accent=>setConfig(c=>({...c,accent}))}/><MaterialOptions title="Roof" number="03" options={roofColors} value={config.roof} onChange={roof=>setConfig(c=>({...c,roof}))}/><div className="lighting-control"><span>Set the atmosphere</span><div className="lighting-switch">{(['Day','Dusk'] as const).map(lighting=><button key={lighting} aria-pressed={config.lighting===lighting} className={config.lighting===lighting?'selected':''} onClick={()=>setConfig(c=>({...c,lighting}))}>{lighting==='Day'?<Sun size={14}/>:<Moon size={14}/>} {lighting}</button>)}</div></div><button className="solid-button quote-button" onClick={()=>setEnquiry(true)}>Request your transformation <ArrowUpRight size={18}/></button><p className="config-footnote">Your vision. The first step toward making it real.</p></aside>
   <div className="studio-footer"><span>YOUR PALETTE <span className="palette-dash">/</span> {config.facade} / {config.accent} / {config.roof}</span><span>BUILT ON POSSIBILITY.</span></div>
  </section>
  </main><div className="act-index" aria-hidden="true"><span>{String(act+1).padStart(2,'0')}</span><span className="index-rule"/><span>03</span></div>
  {enquiry&&<Enquiry config={config} onClose={()=>setEnquiry(false)}/>}
 </div>;
}
