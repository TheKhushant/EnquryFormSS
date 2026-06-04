import Header from "./Header";
import Footer from "./Footer";
import type { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen  bg-[#f3efff] overflow-x-hidden">
      <Header />
      
      <main className="min-h-[calc(100vh-80px)]">
        {children}
      </main>

      <Footer />
    </div>
  );
}