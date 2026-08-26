"use client";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ContentModal } from "./ContentModal";
import { createClient } from "@/lib/supabase-browser";

type Project = { id: string; title: string; skill: string; description: string; featured?: boolean; sort_order?: number; cover_url?: string | null };

const fallback: Project[] = [
 {id:"fitzone",title:"FITZONE",skill:"GYM & FITNESS",description:"Fitness brand identity, logo system, social creatives and promotional artwork."},
 {id:"royal",title:"ROYAL",skill:"LUXURY BRAND",description:"Luxury brand identity with premium gold-led visual direction and campaign graphics."},
 {id:"music",title:"MUSIC",skill:"FESTIVAL",description:"Music festival posters, event graphics, social media creatives and promotional visuals."},
 {id:"nature",title:"NATURE",skill:"ORGANIC STORE",description:"Organic retail identity, packaging direction, promotional graphics and social content."},
 {id:"coffee",title:"COFFEE",skill:"HOUSE",description:"Coffee-house branding, menu graphics, campaign artwork and social media design."},
 {id:"travel",title:"TRAVEL",skill:"EXPLORE THE WORLD",description:"Travel campaign identity, destination graphics and digital promotional creatives."}
];
const themes=["project-blue","project-gold","project-purple","project-green","project-coffee","project-travel"];
const marks=["F","R","♫","◒","☕","△"];

export function Work(){
 const supabase=useMemo(()=>createClient(),[]);
 const [projects,setProjects]=useState<Project[]>(fallback);
 const [selected,setSelected]=useState<Project|null>(null);
 const [allOpen,setAllOpen]=useState(false);
 useEffect(()=>{ let active=true; supabase.from("portfolio_projects").select("id,title,skill,description,featured,sort_order,cover_url").eq("status","published").order("sort_order",{ascending:true}).then(({data,error}:any)=>{ if(active && !error && data?.length) setProjects(data); }); return ()=>{active=false}; },[supabase]);
 return <>
  <section id="work" className="dark-section work-section">
   <div className="work-wrap">
    <div className="work-head"><div><p className="eyebrow">MY WORK</p><h2>Featured Projects</h2></div><button className="outline-btn" type="button" onClick={()=>setAllOpen(true)}>VIEW ALL</button></div>
    <div className="project-grid">
     {projects.slice(0,6).map((p,i)=><motion.button type="button" key={p.id} className={`project-card ${themes[i%themes.length]}`} whileHover={{y:-5,scale:1.015}} whileTap={{scale:.98}} onClick={()=>setSelected(p)}>
      <div className="project-mark">{marks[i%marks.length]}</div><strong>{p.title}</strong><span>{p.skill}</span><small className="project-open">VIEW PROJECT →</small>
     </motion.button>)}
    </div>
   </div>
  </section>
  <ContentModal open={allOpen} onClose={()=>setAllOpen(false)} eyebrow="PORTFOLIO" title="All Projects">
   <div className="modal-project-list">{projects.map((p,i)=><button type="button" key={p.id} onClick={()=>{setAllOpen(false);setSelected(p)}}><span className="modal-project-mark">{marks[i%marks.length]}</span><span><b>{p.title}</b><small>{p.skill}</small></span><i>OPEN →</i></button>)}</div>
  </ContentModal>
  <ContentModal open={!!selected} onClose={()=>setSelected(null)} eyebrow="FEATURED PROJECT" title={selected?.title ?? "Project"}>
   {selected && <div className={`modal-project-hero ${themes[Math.max(0,projects.findIndex(p=>p.id===selected.id))%themes.length]}`}><div className="modal-project-big-mark">{marks[Math.max(0,projects.findIndex(p=>p.id===selected.id))%marks.length]}</div><div><b>{selected.skill}</b><p>{selected.description}</p><button className="primary-btn" type="button" onClick={()=>setSelected(null)}>BACK TO PORTFOLIO <span>→</span></button></div></div>}
  </ContentModal>
 </>;
}
