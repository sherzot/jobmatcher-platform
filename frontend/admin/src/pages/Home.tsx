import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Container, Card, Button } from "../app/ui";
import { RegisterCard } from "../components/AuthCard";
import { Link } from "react-router-dom";
import topPc from "../assets/top-pc.png";
import topZPc from "../assets/top-z-pc.png";
import { useAuth } from "../app/auth/AuthProvider.tsx";

export default function Home() {
	const { state } = useAuth();
  const role = state.role; // "guest" | "user" | "agent" | "admin"
  const isAuthed = role !== "guest";
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Navbar />

      <section className="border-b border-slate-200 bg-white/60 backdrop-blur">
        <Container className="py-12 md:py-16">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <img src={topPc} alt="top-pc" className="w-50" />
              {/* <h1 className="text-3xl md:text-4xl font-bold leading-tight">
                AIアシスタントで高速化{" "}
                <span className="text-red-600">求人マッチング</span>
              </h1>
              <p className="mt-3 text-slate-600">
                履歴書を記入し、適切な仕事を探し、最適な求人票にオファーを即座に送信します。
              </p> */}
              <div className="mt-6 flex gap-3">
                <Link to="/register">
                  <Button>今すぐ始める</Button>
                </Link>
                <Link to="/jobs">
                  <Button variant="secondary">求人を見る</Button>
                </Link>
              </div>
            </div>
            <div>
              {!isAuthed && (
                <>
                  <Card className="p-0">
                    <div className="grid md:grid-cols-1 gap-0">
                      <div className="p-4">
                        <RegisterCard />
                      </div>
                    </div>
                  </Card>
                </>
              )}
            </div>
          </div>
        </Container>
      </section>

      <section>
        <div className="top-img flex flex-col items-center justify-center">
          <img src={topZPc} alt="top-z-pc" />
        </div>
      </section>
      <section>
        <Container className="py-12">
          <div className="grid md:grid-cols-3 gap-6">
            <Card title="AIアシスタント" subtitle="充填手順">
              <p className="text-sm text-slate-600">
                「履歴書は80%完成しています。新しい仕事に3つ応募しますか？」
              </p>
            </Card>
            <Card title="リアルタイム検索" subtitle="フィルタリングと並べ替え">
              <p className="text-sm text-slate-600">
                場所、職種、給与によるクイック検索。
              </p>
            </Card>
            <Card title="PDFジェネレーター" subtitle="履歴書">
              <p className="text-sm text-slate-600">
                履歴書の PDF を自動的に作成してダウンロードします。
              </p>
            </Card>
          </div>
        </Container>
      </section>

      <Footer />
    </div>
  );
}
