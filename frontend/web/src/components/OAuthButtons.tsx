import { Button } from "../app/ui";

export default function OAuthButtons() {
  const click = (provider: string) => alert(`${provider}でログイン（デモ）`);
  return (
    <div className="grid md:grid-cols-2 gap-2">
      <Button variant="secondary" onClick={() => click("Google")}>
        Google で続行
      </Button>
      <Button variant="secondary" onClick={() => click("GitHub")}>
        GitHub で続行
      </Button>
    </div>
  );
}
