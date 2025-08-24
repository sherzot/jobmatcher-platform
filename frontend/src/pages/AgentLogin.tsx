// src/pages/AgentLogin.tsx
import { Container, Card, Button } from "../app/ui";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAuth } from "../app/auth/AuthProvider";

export default function AgentLogin() {
  const { login } = useAuth();
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <Container className="py-10">
        <Card title="エージェントログイン" subtitle="(デモ: ロール切替)">
          <Button
            onClick={() =>
              login("demo-token", {
                id: 100,
                name: "Agent A",
                email: "agent@example.com",
              })
            }
          >
            エージェントとしてログイン
          </Button>
        </Card>
      </Container>
      <Footer />
    </div>
  );
}
