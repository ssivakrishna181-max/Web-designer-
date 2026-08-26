"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import { useState } from "react";
import { ContentModal } from "./ContentModal";

export function Hero(){
 const [workOpen,setWorkOpen]=useState(false);
 const [showreelOpen,setShowreelOpen]=useState(false);
 return <>
  <section id="home" className="hero">
  <div className="hero-paint paint-left"/><div className="hero-paint paint-right"/>
  <div className="hero-grid"/>
  <div className="hero-content">
    <motion.div className="hero-copy" initial={{opacity:0,x:-30}} animate={{opacity:1,x:0}} transition={{duration:.8}}>
      <div className="hero-rule"/>
      <h1>I DON’T JUST<br/><span>DESIGN</span><br/>I BRING IDEAS<br/><em>TO LIFE</em></h1>
      <p>Graphic Designer crafting premium logos, posters, social media designs and brand identities.</p>
      <div className="hero-actions"><button className="primary-btn" type="button" onClick={()=>setWorkOpen(true)}>VIEW MY WORK <b>→</b></button><button className="showreel" type="button" onClick={()=>setShowreelOpen(true)}><i>▶</i> PLAY SHOWREEL</button></div>
    </motion.div>
    <motion.div className="hero-art" initial={{opacity:0,scale:.96}} animate={{opacity:1,scale:1}} transition={{duration:1,ease:[.16,1,.3,1]}}>
      <div className="art-glow"/>
      <Image src="/eye-reference-exact.jpg" alt="Cinematic blue eye surrounded by vibrant paint" fill priority sizes="(max-width: 900px) 100vw, 70vw" className="eye-art"/>
      <div className="eye-vignette"/>
      <div className="pupil-reveal" aria-hidden="true">
        <span className="pupil-core"/>
        <span className="reveal-rays"/>
        <Image src="/logo.png" alt="" width={150} height={150} className="eye-logo-reveal" />
        <span className="reveal-glint"/>
      </div>
      <div className="art-shade"/>
      <div className="social-rail"><a href="#contact">Bē</a><a href="#contact">◎</a><a href="#contact">in</a><a href="#contact">◉</a></div>
    </motion.div>
  </div>
  <div className="stats-bar"><div><b>5+</b><span>Years Experience</span></div><div><b>300+</b><span>Projects Completed</span></div><div><b>250+</b><span>Happy Clients</span></div><div><b>100%</b><span>Client Satisfaction</span></div></div>
 </section>
 <ContentModal open={workOpen} onClose={()=>setWorkOpen(false)} eyebrow="PORTFOLIO" title="Explore My Work"><p className="modal-copy">Explore the complete portfolio of logo design, branding, posters, social media creatives and visual campaigns.</p><button className="primary-btn" type="button" onClick={()=>setWorkOpen(false)}>CLOSE <span>×</span></button></ContentModal>
 <ContentModal open={showreelOpen} onClose={()=>setShowreelOpen(false)} eyebrow="SHOWREEL" title="Cinematic Design Reel"><div className="showreel-placeholder"><span>▶</span><p>Your showreel can be connected here from the Admin Panel.</p></div></ContentModal>
 </>
}
