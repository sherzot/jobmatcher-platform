export default function Checkbox({
  label,
  name,
  register,
  required,
}: {
  label: string;
  name: string;
  register: (name: string, options?: { required?: boolean }) => { [key: string]: any };
  required?: boolean;
}) {
  return (
    <label className="flex items-start gap-2 text-sm">
      <input
        type="checkbox"
        {...register(name, { required })}
        className="mt-0.5 h-4 w-4"
      />
      <span>{label}</span>
    </label>
  );
}
