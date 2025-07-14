import dynamic from "next/dynamic";
import Footer from "@/components/Footer";

const HowToPlayContent = dynamic(
  () => import("@/components/HowToPlayContent"),
  {
    ssr: false,
  },
);

export const metadata = {
  title: "How To Play Football Squares | Complete Guide",
  description:
    "Learn how to play Football Squares with our comprehensive guide. Understand the rules, scoring, and strategies for winning.",
};

export default function HowToPlayPage() {
  return (
    <div className="min-h-screen bg-[#faf9f5] dark:bg-[#1a1a2e] transition-colors duration-300">
      <HowToPlayContent />
      <Footer />
    </div>
  );
}
