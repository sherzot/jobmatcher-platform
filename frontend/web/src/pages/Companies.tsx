import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Container, Card } from "../app/ui";
export default function Companies() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <Container className="py-10">
        <Card title="企業一覧" subtitle="（企業プロフィール）">
          <p className="text-sm text-slate-600">企業一覧と詳細。</p>
        </Card>
      </Container>
      <Footer />
    </div>
  );
}
