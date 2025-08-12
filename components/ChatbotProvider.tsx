'use client';

import { usePathname } from 'next/navigation';
import CoachBChatbot from './CoachBChatbot';
import OCPhilWidget from './OCPhilWidget';
import Coach101Chatbot from './Coach101Chatbot';
import TrainerRevivaChatbot from './TrainerRevivaChatbot';
import DaliPaletteChatbot from './DaliPaletteChatbot';

interface ChatbotProviderProps {
  children: React.ReactNode;
}

const ChatbotProvider = ({ children }: ChatbotProviderProps) => {
  const pathname = usePathname();

  // Determine which chatbot to show based on the current route
  const isCBLRoute =
    pathname.startsWith('/cbl') || pathname === '/board-leader';

  const isWalletGuide = pathname === '/wallet-guide';
  const isNFTInfo = pathname.startsWith('/what-are-nfts');
  const isCryptoBasics =
    pathname === '/crypto-basics' || pathname.startsWith('/crypto-basics/');

  // Show Trainer Reviva specifically on the /help route
  const isHelpRoute = pathname === '/help' || pathname.startsWith('/help/');

  // Show Dali Palette on any create-nft pages
  const isCreateNftRoute = pathname.startsWith('/create-nft');

  return (
    <>
      {children}
      {/* Route-based chatbot injection */}
      {isCBLRoute ? (
        <OCPhilWidget />
      ) : isWalletGuide || isNFTInfo || isCryptoBasics ? (
        <Coach101Chatbot />
      ) : isCreateNftRoute ? (
        <DaliPaletteChatbot />
      ) : isHelpRoute ? (
        <TrainerRevivaChatbot />
      ) : (
        <CoachBChatbot />
      )}
    </>
  );
};

export default ChatbotProvider;
