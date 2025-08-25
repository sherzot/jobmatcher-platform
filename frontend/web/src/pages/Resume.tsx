import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Container, Card } from "../app/ui";
export default function Resume() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <Container className="py-10">
        <Card
          title="履歴書"
          subtitle="(ビルダーとパーサーの UI はここにあります)"
        >
          <p className="text-sm text-slate-600">
            履歴書フォームとアップロード/事前署名 UI。
          </p>
        </Card>
      </Container>
      <Footer />
    </div>
  );
}
