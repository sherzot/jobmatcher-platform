import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Container, Card } from "../app/ui";
export default function Offers() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <Container className="py-10">
        <Card title="オファー" subtitle="（オファーの提出と追跡）">
          <p className="text-sm text-slate-600">
            オファーのリストとステータス。
          </p>
        </Card>
      </Container>
      <Footer />
    </div>
  );
}
