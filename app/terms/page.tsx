import React from "react";
import Footer from "@/components/Footer";
import TermsOfServiceContent from "@/components/TermsOfServiceContent";

const TermsOfServicePage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">
      <main className="flex-grow">
        <TermsOfServiceContent />
      </main>
      <Footer />
    </div>
  );
};

export default TermsOfServicePage;
