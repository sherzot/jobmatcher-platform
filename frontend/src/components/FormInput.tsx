import { clsx } from "clsx";
import type { FieldError } from "react-hook-form";

export default function FormInput({
  label,
  name,
  type = "text",
  register,
  error,
  placeholder,
  autoComplete,
}: {
  label: string;
  name: string;
  type?: string;
  register: any;
  error?: FieldError;
  placeholder?: string;
  autoComplete?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium">{label}</span>
      <input
        {...register(name)}
        type={type}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className={clsx(
          "w-full rounded-md border bg-white px-3 py-2 text-sm outline-none",
          "border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-200"
        )}
      />
      {error && (
        <span className="mt-1 block text-xs text-red-600">{error.message}</span>
      )}
    </label>
  );
}
