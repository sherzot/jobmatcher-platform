import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Container, Card } from "../app/ui";
import { useAuth } from "../app/auth/AuthProvider";

export default function MyPage() {
  const { state } = useAuth();
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <Container className="py-10">
        <Card title="マイページ">
          <p className="text-sm text-slate-600">
            ユーザー名: {state.user?.name ?? "未設定"}
          </p>
        </Card>
      </Container>
      <Footer />
    </div>
  );
}
