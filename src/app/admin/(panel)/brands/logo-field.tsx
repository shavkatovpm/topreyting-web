"use client";

import { useState } from "react";

/** Haqiqiy fayl yuklash (URL yozish o'rniga). Server bayt-darajasida turini tekshiradi. */
export function LogoField({ current }: { current: string | null }) {
  const [preview, setPreview] = useState<string | null>(current);
  const [removed, setRemoved] = useState(false);

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-4">
        {preview && !removed ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={preview}
            alt=""
            className="h-16 w-16 rounded-lg border border-border bg-white object-contain"
          />
        ) : (
          <div className="grid h-16 w-16 shrink-0 place-items-center rounded-lg border border-dashed border-border text-center text-xs text-muted-foreground">
            Logo yo&apos;q
          </div>
        )}
        <div className="space-y-1.5">
          <input
            type="file"
            name="logoFile"
            accept="image/jpeg,image/png,image/webp"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              setRemoved(false);
              setPreview(URL.createObjectURL(file));
            }}
            className="block text-sm text-foreground file:mr-3 file:rounded-md file:border-0 file:bg-secondary file:px-3 file:py-1.5 file:text-sm file:font-medium"
          />
          <p className="text-xs text-muted-foreground">JPG, PNG yoki WEBP, 3 MB gacha.</p>
          {current && (
            <label className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <input
                type="checkbox"
                name="removeLogo"
                checked={removed}
                onChange={(e) => {
                  setRemoved(e.target.checked);
                  if (e.target.checked) setPreview(null);
                }}
              />
              Logotipni olib tashlash
            </label>
          )}
        </div>
      </div>
    </div>
  );
}
