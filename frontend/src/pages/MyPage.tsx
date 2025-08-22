import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Container, Card } from "../app/ui";
import { useAuth } from "../app/auth/AuthProvider";
import { useEffect } from "react";

export default function MyPage() {
  const { state, refreshMe } = useAuth();
  useEffect(() => {
    if (state.token && !state.user) {
      refreshMe();
    }
  }, []);
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <Container className="py-10">
        <Card title="マイページ">
          <p className="text-sm text-slate-600">
            ユーザー名: {state.user?.name ?? "—"}
          </p>
          <p className="text-sm text-slate-600">
            メール: {state.user?.email ?? "—"}
          </p>
        </Card>
      </Container>
      <Footer />
    </div>
  );
}
