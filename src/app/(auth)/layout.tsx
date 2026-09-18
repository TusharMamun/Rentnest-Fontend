// app/(auth)/layout.tsx
import type { Metadata } from "next";
import Footer from "@/Ui/Shaird_Ui/Footer";
import Navbar from "@/Ui/Shaird_Ui/Navbar";

export const metadata: Metadata = {
  title: "RentNest - Authentication",
  description: "Sign in or create your RentNest account",
};

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* Navigation */}
      <Navbar />

      {/* Main Container */}
      <div className="relative flex flex-1 items-center justify-center overflow-hidden px-4 py-12 pt-24">
        {/* Decorative Background Elements */}
        <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/95 via-white/90 to-white/95" />
          <div className="absolute -right-40 -top-40 h-80 w-80 rounded-full bg-blue-500/5 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-indigo-500/5 blur-3xl" />
          <div className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-500/5 blur-3xl" />
        </div>

        {/* Page Content */}
        <div className="relative z-10 w-full max-w-md">{children}</div>
      </div>

      <Footer />
    </div>
  );
}