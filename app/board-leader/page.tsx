import BoardLeaderContent from "@/components/BoardLeaderContent";

export const metadata = {
  title: "Board Leader | Football Squares - Community Board Leaders Program",
  description:
    "Become a Community Board Leader and earn 3% of every board you host plus 30% of NFT mints. Learn about CBL requirements, benefits, and how to get started.",
};

const BoardLeaderPage = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-black transition-colors duration-300">
      <BoardLeaderContent />
    </div>
  );
};

export default BoardLeaderPage;