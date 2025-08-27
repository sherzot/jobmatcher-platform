import React from "react";
import { Container, Card } from "../app/ui";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function AuthLayout({
  title,
  subtitle,
  children,
  side,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  side?: React.ReactNode; // chapda ko‘rsatiladigan brand/marketing blok
}) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Navbar />
      <Container className="py-10">
        <div className="grid md:grid-cols-2 gap-8 items-start">
          <div className="space-y-3">
            <h1 className="text-3xl font-bold">{title}</h1>
            {subtitle && <p className="text-slate-600">{subtitle}</p>}
            {side && <Card>{side}</Card>}
          </div>
          <Card>{children}</Card>
        </div>
      </Container>
      <Footer />
    </div>
  );
}
