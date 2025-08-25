import { useState } from "react";
import { clsx } from "clsx";
import type { FieldError } from "react-hook-form";

type FormError = FieldError & { type?: string };

export default function PasswordInput({
  label,
  name,
  register,
  error,
  placeholder,
  autoComplete,
}: {
  label: string;
  name: string;
  register: any;
  error?: FormError;
  placeholder?: string;
  autoComplete?: string;
}) {
  const [show, setShow] = useState(false);
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium">{label}</span>
      <div className="relative">
        <input
          {...register(name)}
          type={show ? "text" : "password"}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className={clsx(
            "w-full rounded-md border bg-white px-3 py-2 pr-10 text-sm outline-none",
            "border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-200"
          )}
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          className="absolute inset-y-0 right-2 my-auto text-xs text-slate-600 hover:text-slate-900"
        >
          {show ? "隠す" : "表示"}
        </button>
      </div>
      {error?.message && (
        <span className="mt-1 block text-xs text-red-600">{error.message}</span>
      )}
    </label>
  );
}
