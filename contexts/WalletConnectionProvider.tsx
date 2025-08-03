'use client';

import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from 'react';

interface UserIntent {
  intent: 'create-nft' | 'play-game' | 'view-collection' | 'general';
  intentData?: {
    nftType?: string;
    gameId?: string;
    redirectPath?: string;
  };
}

interface WalletConnectionContextType {
  isPopupOpen: boolean;
  currentIntent: UserIntent['intent'];
  intentData?: UserIntent['intentData'];
  showPopup: (
    intent?: UserIntent['intent'],
    data?: UserIntent['intentData'],
  ) => void;
  hidePopup: () => void;
}

const WalletConnectionContext = createContext<
  WalletConnectionContextType | undefined
>(undefined);

export const WalletConnectionProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [currentIntent, setCurrentIntent] =
    useState<UserIntent['intent']>('general');
  const [intentData, setIntentData] = useState<UserIntent['intentData']>();

  const showPopup = useCallback(
    (
      intent: UserIntent['intent'] = 'general',
      data?: UserIntent['intentData'],
    ) => {
      setCurrentIntent(intent);
      setIntentData(data);
      setIsPopupOpen(true);
    },
    [],
  );

  const hidePopup = useCallback(() => {
    setIsPopupOpen(false);
    setCurrentIntent('general');
    setIntentData(undefined);
  }, []);

  return (
    <WalletConnectionContext.Provider
      value={{ isPopupOpen, currentIntent, intentData, showPopup, hidePopup }}
    >
      {children}
    </WalletConnectionContext.Provider>
  );
};

export const useWalletConnection = () => {
  const context = useContext(WalletConnectionContext);
  if (context === undefined) {
    throw new Error(
      'useWalletConnection must be used within a WalletConnectionProvider',
    );
  }
  return context;
};
