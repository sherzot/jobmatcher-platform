// src/pages/AdminLogin.tsx
import { Container, Card, Button } from "../app/ui";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAuth } from "../app/auth/AuthProvider";

export default function AdminLogin() {
  const { login } = useAuth();
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <Container className="py-10">
        <Card title="管理者ログイン" subtitle="(デモ: ロール切替)">
          <Button
            onClick={() =>
              login(
                "demo-token",
                { id: 1, name: "Admin", email: "admin@demo.com" },
                "admin"
              )
            }
          >
            管理者としてログイン
          </Button>
        </Card>
      </Container>
      <Footer />
    </div>
  );
}
