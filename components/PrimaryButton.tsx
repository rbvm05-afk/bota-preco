import type { ButtonHTMLAttributes } from "react";

export function PrimaryButton({
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={`w-full rounded-2xl bg-[var(--green)] px-6 py-4 text-base font-black text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[var(--green-dark)] disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    />
  );
}
