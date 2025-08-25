import { Container } from "../app/ui";
export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white/60 backdrop-blur mt-16">
      <Container className="py-6 text-sm text-slate-500 flex flex-col md:flex-row items-center justify-between gap-3">
        <p>© {new Date().getFullYear()} しごとナビ</p>
        <div className="flex gap-4">
          <a className="hover:text-slate-900" href="/agent/login">
            エージェント用
          </a>
          <a className="hover:text-slate-900" href="/admin/login">
            管理者用
          </a>
        </div>

        <div className="flex gap-4">
          <a className="hover:text-slate-900" href="#">
            プライバシー
          </a>
          <a className="hover:text-slate-900" href="#">
            条項
          </a>
          <a className="hover:text-slate-900" href="#">
            サポート
          </a>
        </div>
      </Container>
    </footer>
  );
}
