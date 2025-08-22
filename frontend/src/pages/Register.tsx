import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Container } from "../app/ui";
import { RegisterCard } from "../components/AuthCard";

export default function Register() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <Container className="py-10">
        <div className="max-w-md mx-auto">
          <RegisterCard />
        </div>
      </Container>
      <Footer />
    </div>
  );
}
