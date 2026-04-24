"use client";

import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef } from "react";

/** Must match the `id` on the Chatbase embed script (from Deploy → embed). */
const BOT_ID = process.env.NEXT_PUBLIC_CHATBASE_BOT_ID ?? "";
const SAFE_BOT_ID = /^[a-zA-Z0-9_-]+$/;

async function fetchIdentityToken(): Promise<string | null> {
  try {
    const res = await fetch("/api/chatbase/identity", { credentials: "include" });
    const data = (await res.json()) as { token?: string | null };
    if (!res.ok) return null;
    return data.token && typeof data.token === "string" ? data.token : null;
  } catch {
    return null;
  }
}

function tryIdentify(token: string): boolean {
  if (typeof window === "undefined" || typeof window.chatbase !== "function") {
    return false;
  }
  try {
    window.chatbase("identify", { token });
    return true;
  } catch {
    return false;
  }
}

/**
 * Official Chatbase bootstrap (queue + Proxy) + embed script, then JWT identify when logged in.
 * Set `NEXT_PUBLIC_CHATBASE_BOT_ID` to your script id (e.g. the id from the snippet Chatbase gave you).
 */
export default function ChatbaseWidget() {
  const pathname = usePathname();
  const identifyAttempted = useRef(false);
  const scheduleIdentify = useCallback(() => {
    if (identifyAttempted.current) return;
    let tries = 0;
    const maxTries = 48;

    const tick = async () => {
      tries += 1;
      const token = await fetchIdentityToken();
      if (!token) {
        identifyAttempted.current = true;
        return;
      }
      if (tryIdentify(token)) {
        identifyAttempted.current = true;
        return;
      }
      if (tries < maxTries) {
        window.setTimeout(tick, 200);
      }
    };

    void tick();
  }, []);

  useEffect(() => {
    identifyAttempted.current = false;
  }, [pathname]);

  useEffect(() => {
    if (!BOT_ID || !SAFE_BOT_ID.test(BOT_ID) || pathname?.startsWith("/admin")) {
      return;
    }

    if (document.getElementById(BOT_ID)) {
      void scheduleIdentify();
      return;
    }

    const b = JSON.stringify(BOT_ID);
    const inline = `(function(){
      if(!window.chatbase||window.chatbase("getState")!=="initialized"){
        window.chatbase=(...arguments)=>{
          if(!window.chatbase.q){window.chatbase.q=[]}
          window.chatbase.q.push(arguments)
        };
        window.chatbase=new Proxy(window.chatbase,{
          get(target,prop){
            if(prop==="q"){return target.q}
            return(...args)=>target(prop,...args)
          }
        })
      }
      const onLoad=function(){
        if(document.getElementById(${b}))return;
        var script=document.createElement("script");
        script.src="https://www.chatbase.co/embed.min.js";
        script.id=${b};
        script.domain="www.chatbase.co";
        script.addEventListener("load",function(){
          window.dispatchEvent(new CustomEvent("chatbase-embed-loaded"));
        });
        document.body.appendChild(script)
      };
      if(document.readyState==="complete"){onLoad()}
      else{window.addEventListener("load",onLoad,{once:true})}
    })();`;

    const boot = document.createElement("script");
    boot.textContent = inline;
    document.body.appendChild(boot);

    const onEmbedLoaded = () => {
      void scheduleIdentify();
    };
    window.addEventListener("chatbase-embed-loaded", onEmbedLoaded);

    return () => {
      window.removeEventListener("chatbase-embed-loaded", onEmbedLoaded);
    };
  }, [pathname, scheduleIdentify]);

  return null;
}
