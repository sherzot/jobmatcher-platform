import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Container, Card, Button } from "../app/ui";
import { Link } from "react-router-dom";
import topPc from "../assets/top-pc.png";
import topZPc from "../assets/top-z-pc.png";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Navbar />

      {/* Hero Section - Responsive for all devices */}
      <section className="border-b border-slate-200 bg-white/60 backdrop-blur">
        <Container className="py-6 sm:py-8 md:py-12 lg:py-16 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* Main Image */}
            <div className="mb-8">
              <img
                src={topPc}
                alt="top-pc"
                className="w-full mx-auto"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <Link to="/register" className="w-full sm:w-auto">
                <Button className="w-full sm:w-auto text-sm sm:text-base px-4 sm:px-6 py-2 sm:py-3">
                  今すぐ始める
                </Button>
              </Link>
              <Link to="/jobs" className="w-full sm:w-auto">
                <Button
                  variant="secondary"
                  className="w-full sm:w-auto text-sm sm:text-base px-4 sm:px-6 py-2 sm:py-3"
                >
                  求人を見る
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* Image Section - Responsive */}
      <section className="py-6 sm:py-8 md:py-12">
        <div className="top-img flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
          <img
            src={topZPc}
            alt="top-z-pc"
            className="w-full max-w-4xl h-auto"
          />
        </div>
      </section>

      {/* Features Section - Responsive Grid */}
      <section className="py-8 sm:py-12 lg:py-16">
        <Container className="px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            <Card title="AIアシスタント" subtitle="充填手順" className="h-full">
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                「履歴書は80%完成しています。新しい仕事に3つ応募しますか？」
              </p>
            </Card>
            <Card
              title="リアルタイム検索"
              subtitle="フィルタリングと並べ替え"
              className="h-full"
            >
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                場所、職種、給与によるクイック検索。
              </p>
            </Card>
            <Card
              title="PDFジェネレーター"
              subtitle="履歴書"
              className="h-full sm:col-span-2 lg:col-span-1"
            >
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
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
