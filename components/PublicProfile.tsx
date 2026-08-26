 "use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase-browser";

export function PublicProfile() {
  const supabase = createClient();
  const [s,setS] = useState<Record<string,string>>({});
  useEffect(() => {
    supabase.from("site_settings").select("key,value").then(({data}: {data: any}) => setS(Object.fromEntries((data ?? []).map((x:any)=>[x.key, typeof x.value === "string" ? x.value : JSON.stringify(x.value ?? "").replace(/^"|"$/g, "")]))));
  }, []);
  return (
    <div className="mt-8 flex flex-wrap justify-center gap-3 text-xs text-white/50">
      {s.email && <a className="hover:text-cyan-300" href={`mailto:${s.email}`}>{s.email}</a>}
      {s.whatsapp && <a className="hover:text-cyan-300" href={`https://wa.me/${s.whatsapp.replace(/\D/g,"")}`}>WhatsApp</a>}
      {s.instagram && <a className="hover:text-cyan-300" href={s.instagram} target="_blank">Instagram</a>}
      {s.behance && <a className="hover:text-cyan-300" href={s.behance} target="_blank">Behance</a>}
      {s.dribbble && <a className="hover:text-cyan-300" href={s.dribbble} target="_blank">Dribbble</a>}
      {s.youtube && <a className="hover:text-cyan-300" href={s.youtube} target="_blank">YouTube</a>}
      {s.linkedin && <a className="hover:text-cyan-300" href={s.linkedin} target="_blank">LinkedIn</a>}
    </div>
  );
}
