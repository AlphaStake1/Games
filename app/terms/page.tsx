import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TermsOfServiceContent from '@/components/TermsOfServiceContent';

const TermsOfServicePage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">
      <Header />
      <main className="flex-grow">
        <TermsOfServiceContent />
      </main>
      <Footer />
    </div>
  );
};

export default TermsOfServicePage;