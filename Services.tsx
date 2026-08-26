"use client";
import { useState } from "react";
import { ContentModal } from "./ContentModal";
const services=["Logo Design","Brand Identity","Social Media Design","Poster Design","UI/UX Design","Print Design"];
const descriptions=["Unique & memorable logos","Complete brand identity","Eye-catching social media posts","Creative posters for events","Clean & modern UI/UX design","Flyers, brochures & more"];
export function Services(){
 const [open,setOpen]=useState(false);
 return <>
  <section id="services" className="dark-section services-section"><div className="service-panel"><div className="service-col"><p className="eyebrow">WHAT I DO</p><h2>Services</h2>{services.map((s,i)=><div className="service-row" key={s}><b>{String(i+1).padStart(2,"0")}</b><div><strong>{s}</strong><small>{descriptions[i]}</small></div></div>)}<button className="outline-btn" type="button" onClick={()=>setOpen(true)}>VIEW ALL SERVICES <span>→</span></button></div><div className="service-feature"><p className="eyebrow">CREATIVE DIRECTION</p><h3>Design that<br/><span>commands attention.</span></h3><p>Bold visual systems, cinematic compositions and polished brand experiences made to be remembered.</p><div className="feature-orb"><div className="orb-ring"/><div className="orb-core">SK</div></div></div></div></section>
  <ContentModal open={open} onClose={()=>setOpen(false)} eyebrow="SERVICES" title="Everything I Can Create">
   <div className="modal-service-grid">{services.map((s,i)=><div key={s}><span>{String(i+1).padStart(2,"0")}</span><b>{s}</b><p>{descriptions[i]}</p></div>)}</div>
  </ContentModal>
 </>;
}
