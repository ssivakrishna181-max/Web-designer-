"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase-browser";

export function Contact(){
  const [name,setName]=useState(""); const [email,setEmail]=useState("");
  const [msg,setMsg]=useState(""); const [status,setStatus]=useState("");
  const [sending,setSending]=useState(false);
  const submit=async(e:React.FormEvent)=>{
    e.preventDefault(); setSending(true); setStatus("");
    const supabase=createClient();
    const {error}=await supabase.from("contact_requests").insert({name,email,message:msg,status:"new"});
    if(error){
      setStatus("Please email skiamadesigner@gmail.com — the enquiry database is not connected yet.");
    } else {
      setStatus("Thanks — your enquiry has been received.");
      setName("");setEmail("");setMsg("");
    }
    setSending(false);
  };
  return <section id="contact" className="contact-section"><div className="contact-inner">
    <div><p className="eyebrow">LET’S WORK TOGETHER</p><h2>Have a project in mind?<br/><span>Let’s create something amazing.</span></h2>
      <div className="contact-details"><div><b>Call Us</b><span>+91 99083 86188</span></div><div><b>Email Us</b><span>skiamadesigner@gmail.com</span></div><div><b>Location</b><span>Hyderabad, Telangana, India</span></div></div>
    </div>
    <form onSubmit={submit}><input required value={name} onChange={e=>setName(e.target.value)} placeholder="Your Name"/><input required type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email Address"/><textarea required value={msg} onChange={e=>setMsg(e.target.value)} placeholder="Tell me about your project"/><button className="primary-btn" disabled={sending} type="submit">{sending?"SENDING…":"SEND ENQUIRY →"}</button><small>{status}</small></form>
  </div></section>
}