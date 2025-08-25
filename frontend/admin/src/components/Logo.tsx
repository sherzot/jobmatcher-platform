import logo from "../assets/logo.png";

export default function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`${className}`}>
      <img src={logo} alt="しごとナビ" className="w-40" />
    </div>
  );
}
