 "use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase-browser";

const fields = [
  ["name","Display Name","text"],["title","Professional Title","text"],["bio","Short Bio","textarea"],
  ["email","Email","email"],["whatsapp","WhatsApp","text"],["location","Location","text"],
  ["instagram","Instagram URL","url"],["behance","Behance URL","url"],["dribbble","Dribbble URL","url"],
  ["youtube","YouTube URL","url"],["linkedin","LinkedIn URL","url"],["resume_url","Resume/CV URL","url"],
  ["availability","Availability Status","text"]
] as const;

export function SiteSettingsForm() {
  const supabase = createClient();
  const [values,setValues] = useState<Record<string,string>>({});
  const [photo,setPhoto] = useState<File|null>(null);
  const [resume,setResume] = useState<File|null>(null);
  const [message,setMessage] = useState("");
  const [busy,setBusy] = useState(false);

  useEffect(() => {
    supabase.from("site_settings").select("key,value").then(({data,error}: {data: any; error: any}) => {
      if (error) setMessage(error.message);
      else setValues(Object.fromEntries((data ?? []).map((x:any)=>[x.key, typeof x.value === "string" ? x.value : JSON.stringify(x.value ?? "")])));
    });
  }, []);

  const save = async () => {
    setBusy(true); setMessage("");
    let next = {...values};

    if (photo) {
      const path = `profile/${Date.now()}-${photo.name.replace(/[^a-zA-Z0-9._-]/g,"-")}`;
      const {error} = await supabase.storage.from("portfolio-assets").upload(path, photo);
      if (error) { setMessage(error.message); setBusy(false); return; }
      next.profile_image = supabase.storage.from("portfolio-assets").getPublicUrl(path).data.publicUrl;
    }
    if (resume) {
      const path = `resume/${Date.now()}-${resume.name.replace(/[^a-zA-Z0-9._-]/g,"-")}`;
      const {error} = await supabase.storage.from("portfolio-assets").upload(path, resume);
      if (error) { setMessage(error.message); setBusy(false); return; }
      next.resume_url = supabase.storage.from("portfolio-assets").getPublicUrl(path).data.publicUrl;
    }

    const rows = Object.entries(next).map(([key,value]) => ({key,value:JSON.stringify(value),updated_by:null}));
    const {error} = await supabase.from("site_settings").upsert(rows, {onConflict:"key"});
    setMessage(error ? error.message : "Personal details saved. The public site will use the new information.");
    setValues(next); setPhoto(null); setResume(null); setBusy(false);
  };

  return (
    <section className="glass mt-6 rounded-3xl p-6">
      <p className="text-xs font-bold tracking-[.35em] text-cyan-300">SITE PROFILE</p>
      <h2 className="mt-2 text-2xl font-black">Personal Details & Links</h2>
      <div className="mt-5 grid gap-3 md:grid-cols-2">
        {fields.map(([key,label,type]) => type === "textarea" ? (
          <textarea key={key} value={values[key] ?? ""} onChange={e=>setValues(v=>({...v,[key]:e.target.value}))} placeholder={label} className="min-h-28 rounded-xl border border-white/10 bg-black/20 p-3 outline-none md:col-span-2" />
        ) : (
          <input key={key} type={type} value={values[key] ?? ""} onChange={e=>setValues(v=>({...v,[key]:e.target.value}))} placeholder={label} className="rounded-xl border border-white/10 bg-black/20 p-3 outline-none" />
        ))}
      </div>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <label className="rounded-2xl border border-dashed border-cyan-300/30 bg-cyan-300/5 p-5 text-center text-sm text-cyan-200">
          Profile photo
          <input type="file" accept="image/*" className="mt-3 block w-full text-xs" onChange={e=>setPhoto(e.target.files?.[0] ?? null)} />
        </label>
        <label className="rounded-2xl border border-dashed border-cyan-300/30 bg-cyan-300/5 p-5 text-center text-sm text-cyan-200">
          Resume / CV
          <input type="file" accept=".pdf,.doc,.docx" className="mt-3 block w-full text-xs" onChange={e=>setResume(e.target.files?.[0] ?? null)} />
        </label>
      </div>
      <div className="mt-4 flex items-center justify-between gap-4">
        <span className="text-xs text-white/45">{message}</span>
        <button disabled={busy} onClick={save} className="rounded-full bg-gradient-to-r from-blue-700 to-cyan-400 px-6 py-3 text-sm font-bold text-[#031126]">{busy ? "Saving…" : "Save Details"}</button>
      </div>
    </section>
  );
}
