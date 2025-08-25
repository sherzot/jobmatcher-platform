import { clsx } from "clsx";

export default function Alert({
  title,
  message,
  variant = "info",
  className = "",
}: {
  title?: string;
  message: string;
  variant?: "info" | "success" | "error" | "warning";
  className?: string;
}) {
  const styles = {
    info: "bg-blue-50 text-blue-800 border-blue-200",
    success: "bg-emerald-50 text-emerald-800 border-emerald-200",
    error: "bg-red-50 text-red-800 border-red-200",
    warning: "bg-amber-50 text-amber-800 border-amber-200",
  }[variant];

  return (
    <div className={clsx("rounded-md border p-3 text-sm", styles, className)}>
      {title && <div className="font-semibold mb-0.5">{title}</div>}
      <div>{message}</div>
    </div>
  );
}
