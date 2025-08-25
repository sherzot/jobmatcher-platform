export default function Divider({ text = "または" }: { text?: string }) {
  return (
    <div className="relative my-3">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-slate-200" />
      </div>
      <div className="relative flex justify-center">
        <span className="bg-white px-2 text-xs text-slate-500">{text}</span>
      </div>
    </div>
  );
}
