"use client";
import { useState } from "react";
import { Logo } from "./Logo";

const links = [["HOME","#home"],["ABOUT","#about"],["SERVICES","#services"],["PORTFOLIO","#work"],["TESTIMONIALS","#testimonials"],["CONTACT","#contact"]] as const;
export function Navbar(){
 const [open,setOpen]=useState(false);
 return <header className="site-nav"><div className="nav-inner">
   <a href="#home" onClick={()=>setOpen(false)}><Logo compact/></a>
   <nav className="desktop-nav">{links.map(([label,href],i)=><a className={i===0?"active":""} key={href} href={href}>{label}</a>)}<a className="talk-btn" href="#contact">LET’S TALK <span>↗</span></a></nav>
   <button className="mobile-menu" onClick={()=>setOpen(!open)} aria-label="Open menu">{open?"CLOSE":"MENU"}</button>
 </div>{open&&<div className="mobile-nav">{links.map(([label,href])=><a key={href} href={href} onClick={()=>setOpen(false)}>{label}</a>)}<a className="talk-btn" href="#contact" onClick={()=>setOpen(false)}>LET’S TALK ↗</a></div>}</header>
}
