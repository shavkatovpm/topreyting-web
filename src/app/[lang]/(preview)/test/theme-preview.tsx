"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { palettes, paletteCSS } from "./palettes";

export function ThemePreview() {
  const [selected, setSelected] = useState(0);
  const [panelOpen, setPanelOpen] = useState(false);
  const frame = useRef<HTMLIFrameElement>(null);
  const apply = useCallback(() => {
    const doc = frame.current?.contentDocument;
    if (!doc?.head) return;
    let style = doc.getElementById("test-palette");
    if (!style) {
      style = doc.createElement("style");
      style.id = "test-palette";
      doc.head.appendChild(style);
    }
    style.textContent = paletteCSS(palettes[selected]);
  }, [selected]);
  useEffect(() => { apply(); }, [apply]);

  return (
    <main className="flex h-dvh flex-col bg-[#10131b] text-white">
      <iframe ref={frame} src="/" title="Asosiy sahifa rang ko‘rinishi" onLoad={apply} className="min-h-0 w-full flex-1 border-0" />
      <div
        className="fixed bottom-0 left-1/2 z-50 flex w-max max-w-[calc(100%-24px)] -translate-x-1/2 flex-col items-center pb-[max(8px,env(safe-area-inset-bottom))]"
        onPointerEnter={(event) => { if (event.pointerType === "mouse") setPanelOpen(true); }}
        onPointerLeave={(event) => { if (event.pointerType === "mouse") setPanelOpen(false); }}
        onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setPanelOpen(false); }}
        onKeyDown={(event) => { if (event.key === "Escape") setPanelOpen(false); }}
      >
        <div id="palette-options" hidden={!panelOpen} className="mb-0 max-w-full rounded-2xl border border-white/15 bg-[#10131bf2] p-3 shadow-xl backdrop-blur-xl">
          <p className="mb-2 text-center text-[10px] text-slate-400">Rang sinovi · {palettes[selected].name}</p>
        <div className="flex w-full gap-2 overflow-x-auto pb-1" role="group" aria-label="Rang variantlari">
          {palettes.map((p, i) => (
            <button key={p.name} type="button" aria-pressed={selected === i} onClick={() => setSelected(i)}
              className={`flex shrink-0 items-center gap-2 rounded-xl border px-3 py-2 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${selected === i ? "border-white/60 bg-white/15" : "border-white/15 hover:bg-white/10"}`}>
              <span className="h-6 w-6 rounded-full border border-white/20" style={{ background: `linear-gradient(135deg, ${p.paper} 50%, ${p.accent} 50%)` }} />
              <span><span className="block text-xs font-semibold">{i + 1}. {p.name}</span><span className="block text-[10px] text-slate-400">{p.description}</span></span>
            </button>
          ))}
        </div>
        </div>
        <button
          type="button"
          aria-label="Rang variantlarini ochish yoki yopish"
          aria-expanded={panelOpen}
          aria-controls="palette-options"
          onClick={() => setPanelOpen((open) => !open)}
          className="flex h-7 w-20 items-center justify-center rounded-b-xl bg-[#10131bcc] text-white shadow-lg backdrop-blur focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          <span className="h-1 w-8 rounded-full bg-white/60" aria-hidden="true" />
        </button>
      </div>
    </main>
  );
}
