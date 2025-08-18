'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useConnection } from '@solana/wallet-adapter-react';
import SignatureOnboardingModal from './SignatureOnboardingModal';
import { SignatureData } from '@/lib/signature/signatureGenerator';
import { SignatureStyle } from '@/lib/signature/signatureConfig';
import { getStorageService } from '@/services/storage/storageService';
import { signatureNFTService } from '@/services/signatureNFTService';
import { toast } from 'sonner';
import { useWalletConnection } from '@/contexts/WalletConnectionProvider';

const SIGNATURE_STORAGE_KEY = 'fsq_user_signatures';
const ONBOARDING_COMPLETED_KEY = 'fsq_onboarding_completed';

interface StoredSignature {
  walletAddress: string;
  signatureData: SignatureData;
  mintAddress?: string;
  timestamp: number;
}

export default function WalletConnectionWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const { publicKey, connected } = useWallet();
  const { connection } = useConnection();
  const wallet = useWallet();
  const { hidePopup } = useWalletConnection();

  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [hasCheckedUser, setHasCheckedUser] = useState(false);

  // Check if user is first-time connector
  const checkFirstTimeUser = useCallback(async () => {
    if (!publicKey || hasCheckedUser) return;

    const walletAddress = publicKey.toString();

    // Check local storage for this wallet
    const storedSignatures = localStorage.getItem(SIGNATURE_STORAGE_KEY);
    const signatures: StoredSignature[] = storedSignatures
      ? JSON.parse(storedSignatures)
      : [];
    const existingSignature = signatures.find(
      (sig) => sig.walletAddress === walletAddress,
    );

    // Check if onboarding was completed for this wallet
    const onboardingCompleted = localStorage.getItem(
      `${ONBOARDING_COMPLETED_KEY}_${walletAddress}`,
    );

    if (!existingSignature && !onboardingCompleted) {
      // First-time user - show onboarding
      console.log('First-time wallet connection detected:', walletAddress);
      setShowOnboarding(true);
    } else if (existingSignature) {
      console.log('Returning user detected:', walletAddress);
      // Optionally verify the NFT still exists on-chain
      if (existingSignature.mintAddress) {
        try {
          const nftService = signatureNFTService(connection);
          const nftExists = await nftService.getSignatureNFT(
            existingSignature.mintAddress,
          );
          if (!nftExists) {
            console.log('Previous NFT not found on-chain, may need to re-mint');
          }
        } catch (error) {
          console.error('Error checking existing NFT:', error);
        }
      }
    }

    setHasCheckedUser(true);
  }, [publicKey, connection, hasCheckedUser]);

  // Monitor wallet connection
  useEffect(() => {
    if (connected && publicKey && !hasCheckedUser) {
      // Small delay to ensure wallet is fully connected
      const timer = setTimeout(() => {
        checkFirstTimeUser();
      }, 1000);

      return () => clearTimeout(timer);
    } else if (!connected) {
      // Reset check when wallet disconnects
      setHasCheckedUser(false);
    }
  }, [connected, publicKey, checkFirstTimeUser, hasCheckedUser]);

  // Handle signature completion
  const handleSignatureComplete = async (
    data: SignatureData,
    style: SignatureStyle,
  ) => {
    if (!publicKey || !wallet.signTransaction) {
      toast.error('Wallet not properly connected');
      return;
    }

    setIsProcessing(true);

    try {
      // Generate SVG
      const { SignatureGenerator } = await import(
        '@/lib/signature/signatureGenerator'
      );
      const generator = new SignatureGenerator();
      const svgContent = generator.renderToSVG(data, style);

      // Upload to storage
      const storageService = getStorageService();
      const isConfigured = await storageService.isConfigured();

      if (!isConfigured) {
        console.warn('Storage service not configured, saving locally only');
        // Save to local storage only
        saveToLocalStorage(data, undefined);
        toast.warning(
          'Signature saved locally. Storage service not configured yet.',
        );
      } else {
        // Upload SVG and metadata
        const imageUri = await storageService.uploadSignatureSVG(
          svgContent,
          publicKey.toString(),
        );
        const metadata = generator.generateNFTMetadata(data, style, imageUri);
        const metadataUri =
          await storageService.uploadSignatureMetadata(metadata);

        // Mint NFT
        const nftService = signatureNFTService(connection);
        const result = await nftService.mintSignatureNFT({
          signatureData: data,
          signatureStyle: style,
          svgContent,
          wallet,
          connection,
        });

        if (result.success) {
          // Save to local storage with mint address
          saveToLocalStorage(data, result.mintAddress);
          toast.success('Signature NFT created successfully!');
        } else {
          throw new Error(result.error || 'Failed to mint NFT');
        }
      }

      // Mark onboarding as completed
      localStorage.setItem(
        `${ONBOARDING_COMPLETED_KEY}_${publicKey.toString()}`,
        'true',
      );

      // Close modal and wallet popup
      setShowOnboarding(false);
      hidePopup();
    } catch (error) {
      console.error('Error creating signature NFT:', error);
      toast.error('Failed to create signature NFT. Please try again.');

      // Still save locally even if minting fails
      saveToLocalStorage(data, undefined);
    } finally {
      setIsProcessing(false);
    }
  };

  // Save signature data to local storage
  const saveToLocalStorage = (data: SignatureData, mintAddress?: string) => {
    if (!publicKey) return;

    const storedSignatures = localStorage.getItem(SIGNATURE_STORAGE_KEY);
    const signatures: StoredSignature[] = storedSignatures
      ? JSON.parse(storedSignatures)
      : [];

    // Remove any existing signature for this wallet
    const filteredSignatures = signatures.filter(
      (sig) => sig.walletAddress !== publicKey.toString(),
    );

    // Add new signature
    filteredSignatures.push({
      walletAddress: publicKey.toString(),
      signatureData: data,
      mintAddress,
      timestamp: Date.now(),
    });

    localStorage.setItem(
      SIGNATURE_STORAGE_KEY,
      JSON.stringify(filteredSignatures),
    );
  };

  // Handle modal close
  const handleModalClose = () => {
    if (!isProcessing) {
      setShowOnboarding(false);

      // Mark as "skipped" so we don't show again this session
      if (publicKey) {
        sessionStorage.setItem(
          `${ONBOARDING_COMPLETED_KEY}_session_${publicKey.toString()}`,
          'skipped',
        );
      }
    }
  };

  return (
    <>
      {children}
      <SignatureOnboardingModal
        isOpen={showOnboarding}
        onClose={handleModalClose}
        onComplete={handleSignatureComplete}
      />
    </>
  );
}
