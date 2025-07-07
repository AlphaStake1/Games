import React from 'react';

const TermsOfServiceContent = () => {
  return (
    <div className="p-6 bg-gray-900 text-gray-100 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-4 text-center text-white">TERMS OF SERVICE</h1>
        <p className="text-center text-gray-400 mb-8">Last updated: July 5, 2025</p>

        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-semibold mb-2 text-white">1. Acceptance of Terms</h2>
            <p className="text-gray-300">
              By accessing or using the Football Squares website, mobile site, or any related services (collectively, the “Service”), you agree to be bound by these Terms of Service (“Terms”). If you do not agree, please do not use the Service.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-2 text-white">2. Modifications</h2>
            <p className="text-gray-300">
              We may update these Terms from time to time. Material changes will be posted on the Service and become effective when posted. Continued use after changes means you accept the revised Terms.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-2 text-white">3. Eligibility</h2>
            <p className="text-gray-300">
              You must be at least 18 years old (or the age of legal majority in your jurisdiction) and legally able to enter into contracts to use the Service.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-2 text-white">4. User Responsibilities</h2>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>Maintain the confidentiality of your account credentials and restrict access to your device.</li>
              <li>Provide accurate information and keep it current.</li>
              <li>Comply with all applicable laws and these Terms when using the Service.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-2 text-white">5. Prohibited Conduct</h2>
            <p className="text-gray-300 mb-2">You agree NOT to:</p>
            <ol className="list-decimal list-inside text-gray-300 space-y-2">
              <li>Upload, post, transmit, or share any content that infringes or violates another party’s intellectual-property or privacy rights.</li>
              <li>Copy, decompile, reverse-engineer, scrape, or otherwise exploit any portion of the Service or its underlying code, design, databases, or content without express written permission.</li>
              <li>Harass, threaten, abuse, defame, or discriminate against other players or any person.</li>
              <li>Cheat, manipulate, or interfere with gameplay, results, randomizations, or scoring.</li>
              <li>Introduce viruses, bots, or any harmful code or attempt to gain unauthorized access to any systems or data.</li>
            </ol>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-2 text-white">6. Intellectual-Property Rights</h2>
            <p className="text-gray-300">
              All trademarks, logos, graphics, text, software, and other materials on the Service are owned by us or our licensors and are protected under applicable laws. Except for the limited license to access and use the Service for its intended purpose, no rights are granted to you.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-2 text-white">7. User Content</h2>
            <p className="text-gray-300">
              You retain ownership of user-generated content you submit, but you grant us a non-exclusive, worldwide, royalty-free license to use, reproduce, display, and distribute that content solely to operate and promote the Service. You represent you have all necessary rights to grant this license and that your content does not violate Section 5.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-2 text-white">8. Disclaimers</h2>
            <p className="text-gray-300">
              The Service is provided “as is” and “as available.” We make no warranties of any kind, express or implied, including the implied warranties of merchantability, fitness for a particular purpose, and non-infringement. We do not guarantee uninterrupted or error-free operation or that the Service will meet your expectations.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-2 text-white">9. Limitation of Liability</h2>
            <p className="text-gray-300">
              To the maximum extent permitted by law, we shall not be liable for any indirect, incidental, special, consequential, punitive, or exemplary damages arising from or related to your use of the Service, even if advised of the possibility of such damages. Our total aggregate liability shall not exceed the greater of (a) USD 100 or (b) the amount you paid us (if any) in the three months preceding the claim.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-2 text-white">10. Indemnification</h2>
            <p className="text-gray-300">
              You agree to indemnify and hold harmless us, our affiliates, and our respective officers, directors, employees, and agents from any claims, damages, liabilities, and expenses (including reasonable attorneys’ fees) arising from your breach of these Terms or misuse of the Service.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-2 text-white">11. Termination</h2>
            <p className="text-gray-300">
              We may suspend or terminate your account or access to the Service at any time, with or without notice, for conduct that we believe violates these Terms or is harmful to the Service or other users. Sections 5–13 survive any termination.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-2 text-white">12. Governing Law & Dispute Resolution</h2>
            <p className="text-gray-300">
              These Terms are governed by the laws of the Cayman Islands, without regard to conflict-of-laws principles. Any dispute arising out of or relating to these Terms or the Service shall be resolved exclusively by arbitration in the Cayman Islands under Cayman International Arbitration Centre rules, and judgment on the award may be entered in any court of competent jurisdiction.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-2 text-white">13. General</h2>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li><strong>Entire Agreement</strong> — These Terms constitute the entire agreement between you and us regarding the Service and supersede all prior or contemporaneous communications.</li>
              <li><strong>Severability</strong> — If any provision is held invalid, the remaining provisions remain in effect.</li>
              <li><strong>Waiver</strong> — Our failure to enforce any provision is not a waiver of future enforcement.</li>
            </ul>
          </div>

          <p className="text-center text-gray-400 mt-8">— End of Terms —</p>
        </div>
      </div>
    </div>
  );
};

export default TermsOfServiceContent;