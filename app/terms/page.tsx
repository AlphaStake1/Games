import React from 'react';
import TermsOfServiceContent from '@/components/TermsOfServiceContent';

const TermsOfServicePage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">
      <main className="flex-grow">
        <TermsOfServiceContent />
      </main>
    </div>
  );
};

export default TermsOfServicePage;
