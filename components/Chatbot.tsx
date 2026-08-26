"use client";
import { useState } from "react";
type Msg={role:"assistant"|"user";text:string};
const prompts=["Show me your services","What kind of design work do you do?","How can I start a project?","How do I contact SK?"];
export function Chatbot(){
 const [open,setOpen]=useState(false),[input,setInput]=useState(""),[loading,setLoading]=useState(false);
 const [messages,setMessages]=useState<Msg[]>([{role:"assistant",text:"Hi — I’m the SK portfolio assistant. I can help with services, portfolio work and starting a project."}]);
 const send=async(value?:string)=>{
  const text=(value??input).trim(); if(!text||loading)return; setInput(""); setMessages(m=>[...m,{role:"user",text}]);setLoading(true);
  try{const res=await fetch("/api/chat",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({message:text})});const data=await res.json();setMessages(m=>[...m,{role:"assistant",text:data.reply||"Please try again."}])}
  catch{setMessages(m=>[...m,{role:"assistant",text:"I’m temporarily unavailable. You can use the contact form to reach SK directly."}])}
  finally{setLoading(false)}
 };
 return <><button onClick={()=>setOpen(!open)} className="sk-chat-trigger">✦ AI</button>{open&&<div className="sk-chat-panel">
  <div className="sk-chat-head"><b>SK AI Assistant</b><button aria-label="Close chat" onClick={()=>setOpen(false)} className="sk-chat-close">×</button></div>
  <div className="sk-chat-messages">{messages.map((m,i)=><div key={i} className={`sk-chat-bubble ${m.role}`}>{m.text}</div>)}{messages.length===1&&<div className="sk-chat-prompts">{prompts.map(p=><button key={p} onClick={()=>send(p)}>{p}</button>)}</div>}{loading&&<div className="sk-chat-bubble assistant">Thinking…</div>}</div>
  <div className="sk-chat-input-row"><input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()} placeholder="Ask about SK Designer…" className="sk-chat-input"/><button disabled={loading} onClick={()=>send()} className="sk-chat-send">Send</button></div>
 </div>}</>
}