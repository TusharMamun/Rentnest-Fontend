import type { Metadata } from "next";
import Footer from "@/Ui/Shaird_Ui/Footer";
import Navbar from "@/Ui/Shaird_Ui/Navbar";
import { getMe } from "@/lib/api";

export const metadata: Metadata = {
  title: {
    default: "RentNest - Find Your Dream Home",
    template: "%s | RentNest",
  },
  description: "Find, rent, or manage your ideal property seamlessly with RentNest.",
};

interface ClientLayoutProps {
  children: React.ReactNode;
}

export default async function ClientLayout({ children }: ClientLayoutProps) {
  const user = await getMe();

  return (
    <div className="flex min-h-screen flex-col bg-slate-50/50 text-slate-900 antialiased selection:bg-blue-500 selection:text-white">
      {/* Header Navigation */}
   
<Navbar user={user} />
      {/* Main Content Area */}
      <main className="flex-1 w-full">
        {/* Centered Container with max-w-7xl & horizontal margins */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full py-6">
          {children}
        </div>
      </main>

      {/* Footer */}
  <Footer />
    </div>
  );
}