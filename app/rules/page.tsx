import Footer from "@/components/Footer";
import Header from "@/components/Header";
import RulesContent from "@/components/RulesContent";

const RulesPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <RulesContent />
      </main>
      <Footer />
    </div>
  );
};

export default RulesPage;