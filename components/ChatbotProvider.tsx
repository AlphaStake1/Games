'use client';

import { usePathname } from 'next/navigation';
import CoachBChatbot from './CoachBChatbot';
import OCPhilWidget from './OCPhilWidget';
import Coach101Chatbot from './Coach101Chatbot';

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

  return (
    <>
      {children}
      {/* Route-based chatbot injection */}
      {isCBLRoute ? (
        <OCPhilWidget />
      ) : isWalletGuide || isNFTInfo ? (
        <Coach101Chatbot />
      ) : (
        <CoachBChatbot />
      )}
    </>
  );
};

export default ChatbotProvider;
