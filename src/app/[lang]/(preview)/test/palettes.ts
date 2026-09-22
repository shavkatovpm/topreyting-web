export const palettes = [
  { name: "Sage", description: "Sutli oq · shalfey", paper: "#f4f6f2", surface: "#ffffff", soft: "#e9efe7", ink: "#26362e", muted: "#64736a", accent: "#48725b", line: "#dfe6dd", leader: "#f7f6ec", gold: "#8c702b", silver: "#6d8076", bronze: "#986d50", dark: false },
  { name: "Sand", description: "Iliq qum · espresso", paper: "#f7f4ef", surface: "#fffdfa", soft: "#eee7dd", ink: "#37312c", muted: "#786e63", accent: "#806047", line: "#e5ded4", leader: "#faf1df", gold: "#906d25", silver: "#757879", bronze: "#9c6646", dark: false },
  { name: "Sky", description: "Oppoq · sokin moviy", paper: "#f3f7fa", surface: "#ffffff", soft: "#e7f0f7", ink: "#243746", muted: "#647889", accent: "#3a7097", line: "#dce6ed", leader: "#fbf7eb", gold: "#927326", silver: "#6b8094", bronze: "#a06b47", dark: false },
  { name: "Rose", description: "Chinni oq · xira atirgul", paper: "#faf5f5", surface: "#fffdfd", soft: "#f2e7e9", ink: "#403139", muted: "#806c75", accent: "#995d73", line: "#ecdee2", leader: "#fcf3e9", gold: "#906b2b", silver: "#807583", bronze: "#a26a52", dark: false },
  { name: "Mono", description: "Yumshoq oq · grafit", paper: "#f5f5f4", surface: "#ffffff", soft: "#ebebea", ink: "#292b2d", muted: "#6d7275", accent: "#40494f", line: "#e1e2e0", leader: "#f8f5ed", gold: "#8a712f", silver: "#727d86", bronze: "#9a6f50", dark: false },
  { name: "Pearl", description: "Oldingi · solishtirish", paper: "#f2f3f8", surface: "#ffffff", soft: "#e9ecf8", ink: "#20263f", muted: "#626b82", accent: "#505ec2", line: "#d5dbea", leader: "#fff9eb", gold: "#967019", silver: "#667791", bronze: "#9b633e", dark: false },
] as const;

export function paletteCSS(p: typeof palettes[number]) {
  return `
html:has(.nv), html:has(.nv) body { background: ${p.paper} !important; }
.nv {
 --nv-paper:${p.paper}; --nv-surface:${p.surface}; --nv-soft:${p.soft};
 --nv-ink:${p.ink}; --nv-muted:${p.muted}; --nv-blue:${p.accent}; --nv-line:${p.line};
 --background:${p.paper}; --foreground:${p.ink}; --card:${p.surface}; --card-foreground:${p.ink};
 --popover:${p.surface}; --popover-foreground:${p.ink}; --primary:${p.accent};
 --primary-foreground:${p.paper}; --secondary:${p.soft}; --secondary-foreground:${p.ink};
 --muted:${p.soft}; --muted-foreground:${p.muted}; --accent:${p.soft}; --accent-foreground:${p.ink};
 --border:${p.line}; --input:${p.line}; --ring:${p.accent};
 background:${p.paper} !important; color:${p.ink}; color-scheme:${p.dark ? "dark" : "light"};
}
.nv > .header, .nv > .cat-bar, .nv footer { background:${p.paper} !important; border-color:${p.line} !important; }
.nv .brand-row, .nv .premium-row { background:${p.surface} !important; border-color:${p.line}; box-shadow:0 2px 8px #20263f04 !important; }
.nv .brand-row:hover { background:${p.soft} !important; }
.nv .premium-row.rank-1 { background:linear-gradient(115deg,${p.leader},${p.surface}) !important; border-color:${p.gold} !important; }
.nv .premium-row.rank-1:hover { background:${p.leader} !important; }
.nv .premium-row.rank-2 { border-color:color-mix(in srgb, ${p.silver} 45%, ${p.surface}) !important; }
.nv .premium-row.rank-3 { border-color:color-mix(in srgb, ${p.bronze} 45%, ${p.surface}) !important; }
.nv .premium-row.rank-1 .row-rank, .nv .premium-row.rank-1 .row-amount { color:${p.gold} !important; }
.nv .premium-row.rank-2 .row-rank { color:${p.silver} !important; }
.nv .premium-row.rank-3 .row-rank { color:${p.bronze} !important; }
.nv .brandline h3, .nv .premium-row.rank-1 h3, .nv .row-amount { color:${p.ink}; }
.nv .brandline p, .nv .row-description, .nv .row-amount small, .nv .contribution-label,
.nv .compact-hero p, .nv .tier-heading, .nv .list-head, .nv .join-banner p { color:${p.muted} !important; }
.nv .compact-hero h1 span, .nv .wordmark em { color:${p.accent}; }
.nv .btn, .nv .primary { background:${p.accent} !important; color:${p.paper} !important; box-shadow:none; }
.nv .boost, .nv .socials a, .nv .catdrop-icon { background:${p.soft} !important; border-color:${p.line} !important; color:${p.accent} !important; box-shadow:none !important; }
.nv .premium-row.rank-1 .boost { background:${p.gold} !important; border-color:${p.gold} !important; color:${p.dark ? "#20251e" : "#fff"} !important; }
.nv .premium-row.rank-1 .logo { border-color:${p.gold} !important; }
.nv .search, .nv .catdrop-btn, .nv .catdrop-panel, .nv .catdrop-btn .count,
.nv .catdrop-item .count, .nv .step>b { background:${p.soft} !important; color:${p.ink} !important; border-color:${p.line} !important; box-shadow:none; }
.nv .catdrop-item, .nv .catdrop-title { color:${p.ink}; }
.nv .catdrop-item:hover, .nv .catdrop-item.selected { background:${p.surface}; color:${p.accent}; }
.nv .join-banner { background:linear-gradient(110deg,${p.soft},${p.surface}); color:${p.ink}; border-color:${p.line}; box-shadow:none; }
.nv .risk-info, .nv .danger { background:${p.dark ? "#392931" : "#fff0ed"} !important; border-color:${p.dark ? "#755060" : "#e3bab4"} !important; }
.nv .risk-info p, .nv .risk-info strong { color:${p.dark ? "#e1b9c3" : "#96564f"} !important; }
`;
}
