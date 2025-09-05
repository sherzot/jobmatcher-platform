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
  side?: React.ReactNode; // chapda ko'rsatiladigan brand/marketing blok
}) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Navbar />
      <Container className="py-6 sm:py-8 md:py-10 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-start">
          {/* Left Column - Brand/Marketing */}
          <div className="order-2 lg:order-1 space-y-4 sm:space-y-6">
            <div className="text-center lg:text-left">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900">{title}</h1>
              {subtitle && <p className="text-sm sm:text-base text-slate-600 mt-2 sm:mt-3">{subtitle}</p>}
            </div>
            {side && (
              <Card className="max-w-md mx-auto lg:mx-0">
                {side}
              </Card>
            )}
          </div>
          
          {/* Right Column - Form */}
          <div className="order-1 lg:order-2">
            <Card className="max-w-md mx-auto lg:mx-0">
              {children}
            </Card>
          </div>
        </div>
      </Container>
      <Footer />
    </div>
  );
}
