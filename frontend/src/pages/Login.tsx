import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Container } from "../app/ui";
import { LoginCard } from "../components/AuthCard";

export default function Login() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <Container className="py-10">
        <div className="max-w-md mx-auto">
          <LoginCard />
        </div>
      </Container>
      <Footer />
    </div>
  );
}
