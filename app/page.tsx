import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Skills } from "@/components/Skills";
import { Work } from "@/components/Work";
import { Services } from "@/components/Services";
import { Contact } from "@/components/Contact";
import { Chatbot } from "@/components/Chatbot";
export default function Home(){return <div className="site"><Navbar/><main><Hero/><Skills/><Work/><Services/><section id="testimonials" className="testimonial-section"><p className="eyebrow">CLIENT LOVE</p><h2>Creative work that <span>connects.</span></h2><div className="quote">“Professional, creative and extremely detail-oriented. The designs made our brand feel instantly premium.”<b>— Happy Client</b></div></section><Contact/><a href="/admin" className="admin-link" aria-label="Open admin panel">Admin</a><Chatbot /></main><footer className="site-footer"><div className="footer-logo"><img src="/logo.png" alt="SK I AM A DESIGNER"/><div><b>SK</b><span>I AM A DESIGNER</span></div></div><p>© 2026 SK Designer. All rights reserved.</p><div className="footer-social"><a href="#">Bē</a><a href="#">◎</a><a href="#">in</a><a href="#">◉</a></div></footer></div>}
