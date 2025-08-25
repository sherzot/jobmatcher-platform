import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Container, Card } from "../app/ui";

export default function Jobs() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <Container className="py-10">
        <Card title="求人検索" subtitle="（完全な機能は近日中に提供予定）">
          <p className="text-sm text-slate-600">
            検索、フィルタリング、並べ替えの UI はここにあります。
          </p>
        </Card>
      </Container>
      <Footer />
    </div>
  );
}
