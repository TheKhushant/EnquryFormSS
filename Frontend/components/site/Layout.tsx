import Header from "./Header";
import Footer from "./Footer";
import { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#e0e5ec]">
      <Header />
      
      <main className="min-h-[calc(100vh-80px)]">
        {children}
      </main>

      <Footer />
    </div>
  );
}