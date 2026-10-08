import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Check, Copy, X } from 'lucide-react';
import type { Configuration } from '../types';
export default function Enquiry({config,onClose}:{config:Configuration;onClose:()=>void}) {
 const dialog=useRef<HTMLDialogElement>(null);const [result,setResult]=useState('');const [copied,setCopied]=useState(false);const [copyError,setCopyError]=useState(false);
 useEffect(()=>{const el=dialog.current;el?.showModal();const prev=document.body.style.overflow;document.body.style.overflow='hidden';return()=>{document.body.style.overflow=prev;el?.close();};},[]);
 const summary=`Facade: ${config.facade}\nAccent: ${config.accent}\nRoof: ${config.roof}\nLighting: ${config.lighting}`;
 async function copy(){try{await navigator.clipboard.writeText(result);setCopied(true);setCopyError(false);}catch{setCopyError(true);}}
 return <dialog ref={dialog} className="enquiry" onCancel={onClose} onClick={e=>{if(e.target===dialog.current)onClose();}} aria-labelledby="enquiry-title"><div className="enquiry-inner">
 <button className="modal-close icon-button" onClick={onClose} aria-label="Close enquiry"><X size={21}/></button>
 <span className="eyebrow">A NEW BEGINNING / FORMA</span>
 <h2 id="enquiry-title">{result ? 'A vision worth\nbringing to life.' : 'Let’s shape\nwhat’s next.'}</h2>
 {result?<><div className="confirmation"><Check size={20}/><span>Your enquiry is prepared.</span></div><p>This demo saves your enquiry here only. No email has been sent. Copy the details to share with your renovation specialist.</p><textarea className="enquiry-result" aria-label="Prepared enquiry" readOnly value={result}/><button className="solid-button" onClick={copy}>{copied?'Enquiry copied':'Copy enquiry'}<Copy size={16}/></button>{copyError&&<p role="alert">Clipboard access is unavailable. Select and copy the enquiry above.</p>}</>:<><p>Tell us a little about your home. Your selected finishes are already included.</p><div className="selected-summary">{config.facade} <span>/</span> {config.accent} <span>/</span> {config.roof} <span>/</span> {config.lighting}</div><form onSubmit={e=>{e.preventDefault();const data=new FormData(e.currentTarget);const name=String(data.get('name')).trim();if(!name){(e.currentTarget.elements.namedItem('name') as HTMLInputElement).setCustomValidity('Please enter your name.');e.currentTarget.reportValidity();return;}setResult(`FORMA / Transformation enquiry\n\nName: ${name}\nEmail: ${data.get('email')}\nPhone: ${String(data.get('phone')).trim()||'Not provided'}\n\n${summary}\n\nMessage: ${String(data.get('message')).trim()||'I would love to explore a transformation for my home.'}`);}}>
 <label>Your name <input autoComplete="name" name="name" required placeholder="Alex Morgan" maxLength={100} onInput={e=>e.currentTarget.setCustomValidity('')}/></label>
 <label>Email address <input autoComplete="email" type="email" name="email" required placeholder="alex@example.com" maxLength={200}/></label>
 <label>Phone <span>(optional)</span><input autoComplete="tel" type="tel" name="phone" placeholder="Your phone number" maxLength={40}/></label>
 <label>A little about your project <span>(optional)</span><textarea name="message" rows={3} placeholder="The home you have. The home you imagine." maxLength={2000}/></label>
 <button className="solid-button" type="submit">Prepare my enquiry <ArrowUpRight size={18}/></button><small>Demo experience · Your details stay in this session.</small>
 </form></>}
 </div></dialog>;
}
