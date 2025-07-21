import Footer from '@/components/Footer';
import RulesContent from '@/components/RulesContent';

const RulesPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        <RulesContent />
      </main>
      <Footer />
    </div>
  );
};

export default RulesPage;
