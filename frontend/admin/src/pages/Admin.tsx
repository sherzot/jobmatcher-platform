import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Container, Card } from "../app/ui";
export default function Admin() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <Container className="py-10">
        <Card title="管理者" subtitle="（設定、契約）">
          <p className="text-sm text-slate-600">システム全体の設定 UI。</p>
        </Card>
      </Container>
      <Footer />
    </div>
  );
}
