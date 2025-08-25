import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Container, Card } from "../app/ui";
import { AgentLoginCard } from "../components/AuthCard";

export default function Agents() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <Container className="py-10">
        <Card title="エージェント" subtitle="(Agent dashboard UI)">
          <p className="text-sm text-slate-600">エージェント用の管理パネル。</p>
        </Card>
        <div>
          <Card className="p-0">
            <div className="grid md:grid-cols-2 gap-0">
              <div className="p-4 border-r border-slate-100">
                <AgentLoginCard />
              </div>
            </div>
          </Card>
        </div>
      </Container>
      <Footer />
    </div>
  );
}
