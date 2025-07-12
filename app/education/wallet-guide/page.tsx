import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WalletGuideContent from "@/components/WalletGuideContent";

export default function WalletGuidePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 max-w-4xl">
        <WalletGuideContent />
      </main>
      <Footer />
    </div>
  );
}
