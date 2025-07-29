'use client';

import { usePathname } from 'next/navigation';
import CoachBChatbot from './CoachBChatbot';
import OCPhilWidget from './OCPhilWidget';

interface ChatbotProviderProps {
  children: React.ReactNode;
}

const ChatbotProvider = ({ children }: ChatbotProviderProps) => {
  const pathname = usePathname();

  // Determine which chatbot to show based on the current route
  const isCBLRoute =
    pathname.startsWith('/cbl') || pathname === '/board-leader';

  return (
    <>
      {children}
      {/* Route-based chatbot injection */}
      {isCBLRoute ? <OCPhilWidget /> : <CoachBChatbot />}
    </>
  );
};

export default ChatbotProvider;
