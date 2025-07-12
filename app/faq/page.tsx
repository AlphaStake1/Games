import FaqContent from "@/components/FaqContent";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = {
  title: "FAQ | Football Squares - Frequently Asked Questions",
  description:
    "Find answers to all your questions about Football Squares NFTs, gameplay, payouts, Community Board Leaders, VIP membership, and more.",
};

const FaqPage = () => {
  return (
    <div className="min-h-screen bg-[#faf9f5] dark:bg-[#444341] transition-colors duration-300">
      <Header />
      <FaqContent />
      <Footer />
    </div>
  );
};

export default FaqPage;
