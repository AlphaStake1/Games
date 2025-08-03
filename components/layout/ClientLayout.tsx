'use client';

import { useWalletConnection } from '@/contexts/WalletConnectionProvider';
import { useWallet } from '@solana/wallet-adapter-react';
import WalletConnectionPopup from '@/components/WalletConnectionPopup';

const ClientLayout = ({ children }: { children: React.ReactNode }) => {
  const { isPopupOpen, hidePopup, currentIntent, intentData } =
    useWalletConnection();
  const { connect } = useWallet();

  const handleConnect = async () => {
    console.log('Layout handleConnect called');
    try {
      await connect();
      console.log('Wallet connection successful');

      if (intentData?.redirectPath) {
        console.log('Redirecting to:', intentData.redirectPath);
        window.location.href = intentData.redirectPath;
      }
    } catch (error) {
      console.error('Wallet connection failed:', error);
      throw error;
    }
  };

  return (
    <>
      {children}
      <WalletConnectionPopup
        isOpen={isPopupOpen}
        onClose={hidePopup}
        onConnect={handleConnect}
        intent={currentIntent}
        intentData={intentData}
      />
    </>
  );
};

export default ClientLayout;
