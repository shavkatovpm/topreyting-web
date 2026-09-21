// Dizayndagi (topreyting-ui-preview) SVG belgilar; o'lcham/stroke navy.css'dan keladi.
const base = { viewBox: "0 0 24 24", "aria-hidden": true, focusable: false } as const;

export const PlusIcon = () => (
  <svg {...base}><path d="M12 5v14M5 12h14" /></svg>
);
export const ArrowIcon = () => (
  <svg {...base}><path d="M7 17 17 7M7 7h10v10" /></svg>
);
export const GlobeIcon = () => (
  <svg {...base}><circle cx="12" cy="12" r="9" /><ellipse cx="12" cy="12" rx="4" ry="9" /><path d="M3 12h18" /></svg>
);
export const TelegramIcon = () => (
  <svg {...base}><path d="m3 10 18-7-4 18-6-6-4 3v-6l10-6-7 8" /></svg>
);
export const InstagramIcon = () => (
  <svg {...base}><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><path d="M17 7h.01" /></svg>
);
export const SearchIcon = () => (
  <svg {...base}><circle cx="10" cy="10" r="6" /><path d="m15 15 5 5" /></svg>
);
export const CupIcon = () => (
  <svg {...base}><path d="M7 3h10v7a5 5 0 0 1-10 0V3ZM7 5H3v3a4 4 0 0 0 4 4m10-7h4v3a4 4 0 0 1-4 4M12 15v6m-4 0h8" /></svg>
);
export const GridIcon = () => (
  <svg {...base}><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></svg>
);
export const ChevronIcon = () => (
  <svg {...base}><path d="m6 9 6 6 6-6" /></svg>
);
export const CheckIcon = () => (
  <svg {...base}><path d="m5 12.5 4.5 4.5L19 7.5" /></svg>
);
export const AlertIcon = () => (
  <svg {...base}><path d="m12 3 10 18H2L12 3ZM12 9v5m0 3h.01" /></svg>
);
