import WalletGuideContent from "@/components/WalletGuideContent";

export const metadata = {
  title: "Wallet Guide | Football Squares - How to Get Started with Crypto",
  description:
    "Complete guide to getting started with cryptocurrency wallets for Football Squares. Learn how to buy crypto, set up Phantom wallet, and connect to our platform.",
};

const WalletGuidePage = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-black transition-colors duration-300">
      <WalletGuideContent />
    </div>
  );
};

export default WalletGuidePage;