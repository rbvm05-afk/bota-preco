import type { ButtonHTMLAttributes } from "react";
export function PrimaryButton({ className = "", children, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button {...props} className={`w-full rounded-2xl bg-[var(--green)] px-6 py-4 text-base font-black text-white shadow-lg shadow-green-900/10 transition hover:-translate-y-0.5 hover:bg-[var(--green-dark)] active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-45 ${className}`}>{children}<span className="ml-2">→</span></button>;
}
