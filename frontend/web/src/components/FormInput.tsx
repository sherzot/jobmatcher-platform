import { clsx } from "clsx";
import type { FieldError } from "react-hook-form";

type FormError = FieldError & { type?: string };

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
  error?: FormError;
  placeholder?: string;
  autoComplete?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm sm:text-base font-medium text-slate-700">{label}</span>
      <input
        {...register(name)}
        type={type}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className={clsx(
          "w-full rounded-md border bg-white px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base outline-none transition-colors",
          "border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-200",
          "placeholder:text-slate-400"
        )}
      />
      {error && (
        <span className="mt-1 block text-xs sm:text-sm text-red-600">{error.message}</span>
      )}
    </label>
  );
}
