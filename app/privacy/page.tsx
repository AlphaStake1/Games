import PrivacyPolicyContent from "../../components/PrivacyPolicyContent";
import { Metadata } from "next";
import Footer from "../../components/Footer";

export const metadata: Metadata = {
  title: "Privacy Policy - Football Squares",
  description:
    "Privacy policy for Football Squares, detailing how we collect, use, and protect your personal information.",
};

export default function PrivacyPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow container mx-auto px-4 py-8 max-w-4xl">
        <PrivacyPolicyContent />
      </main>
      <Footer />
    </div>
  );
}
