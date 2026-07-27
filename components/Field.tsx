import type { InputHTMLAttributes } from "react";
export function Field({ label, hint, ...props }: InputHTMLAttributes<HTMLInputElement> & { label: string; hint?: string }) {
  return <label className="block"><span className="mb-2 block text-sm font-black text-[var(--green-deep)]">{label}</span><input {...props} className="w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-4 text-base font-bold outline-none transition placeholder:font-normal placeholder:text-[#9b9f98] hover:border-[#bdb5a7] focus:border-[var(--green)] focus:ring-4 focus:ring-green-100" />{hint ? <span className="mt-2 block text-sm leading-6 text-[var(--muted)]">{hint}</span> : null}</label>;
}
