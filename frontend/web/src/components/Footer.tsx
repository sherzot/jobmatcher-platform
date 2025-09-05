import { Container } from "../app/ui";
export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white/60 backdrop-blur mt-8 sm:mt-12 lg:mt-16">
      <Container className="py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
        <div className="text-sm text-slate-500">
          {/* Mobile Layout */}
          <div className="lg:hidden space-y-4">
            <p className="text-center">
              © {new Date().getFullYear()} しごとナビ
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6">
              <div className="flex gap-4 sm:gap-6">
                <a
                  className="hover:text-slate-900 transition-colors"
                  href="/agent/login"
                >
                  エージェント用
                </a>
                <a
                  className="hover:text-slate-900 transition-colors"
                  href="/admin/login"
                >
                  管理者用
                </a>
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
              <a className="hover:text-slate-900 transition-colors" href="#">
                プライバシー
              </a>
              <a className="hover:text-slate-900 transition-colors" href="#">
                条項
              </a>
              <a className="hover:text-slate-900 transition-colors" href="#">
                サポート
              </a>
            </div>
          </div>

          {/* Desktop Layout */}
          <div className="hidden lg:flex items-center justify-between">
            <p>© {new Date().getFullYear()} しごとナビ</p>

            <div className="flex gap-6">
              <a
                className="hover:text-slate-900 transition-colors"
                href="/agent/login"
              >
                エージェント用
              </a>
              <a
                className="hover:text-slate-900 transition-colors"
                href="/admin/login"
              >
                管理者用
              </a>
            </div>

            <div className="flex gap-6">
              <a className="hover:text-slate-900 transition-colors" href="#">
                プライバシー
              </a>
              <a className="hover:text-slate-900 transition-colors" href="#">
                条項
              </a>
              <a className="hover:text-slate-900 transition-colors" href="#">
                サポート
              </a>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
}
