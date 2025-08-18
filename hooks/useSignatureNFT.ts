'use client';

import { useState, useCallback, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useConnection } from '@solana/wallet-adapter-react';
import {
  SignatureGenerator,
  SignatureData,
} from '@/lib/signature/signatureGenerator';
import { SignatureStyle } from '@/lib/signature/signatureConfig';
import {
  signatureNFTService,
  SignatureNFTResult,
} from '@/services/signatureNFTService';
import { NftWithToken } from '@metaplex-foundation/js';
import { toast } from 'sonner';

export interface UseSignatureNFTReturn {
  // State
  signatureData: SignatureData | null;
  selectedStyle: SignatureStyle | null;
  userSignatureNFTs: NftWithToken[];
  isMinting: boolean;
  isLoading: boolean;
  hasExistingSignature: boolean;
  mintResult: SignatureNFTResult | null;
  estimatedCost: number;

  // Actions
  generateSignature: (firstName: string, lastInitial: string) => Promise<void>;
  selectStyle: (style: SignatureStyle) => void;
  mintSignatureNFT: () => Promise<void>;
  refreshUserNFTs: () => Promise<void>;
  verifySignature: (mintAddress: string) => Promise<boolean>;
}

export function useSignatureNFT(): UseSignatureNFTReturn {
  const wallet = useWallet();
  const { connection } = useConnection();

  // State
  const [signatureData, setSignatureData] = useState<SignatureData | null>(
    null,
  );
  const [selectedStyle, setSelectedStyle] = useState<SignatureStyle | null>(
    null,
  );
  const [userSignatureNFTs, setUserSignatureNFTs] = useState<NftWithToken[]>(
    [],
  );
  const [isMinting, setIsMinting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasExistingSignature, setHasExistingSignature] = useState(false);
  const [mintResult, setMintResult] = useState<SignatureNFTResult | null>(null);
  const [estimatedCost, setEstimatedCost] = useState(0.02);

  const generator = new SignatureGenerator();
  const nftService = signatureNFTService(connection);

  // Load user's existing signature NFTs on wallet connect
  useEffect(() => {
    if (wallet.publicKey) {
      refreshUserNFTs();
      checkExistingSignature();
      getEstimatedCost();
    }
  }, [wallet.publicKey]);

  // Check if user has existing signature NFT
  const checkExistingSignature = useCallback(async () => {
    if (!wallet.publicKey) return;

    try {
      const hasExisting = await nftService.checkExistingSignatureNFT(
        wallet.publicKey.toString(),
      );
      setHasExistingSignature(hasExisting);
    } catch (error) {
      console.error('Error checking existing signature:', error);
    }
  }, [wallet.publicKey]);

  // Get estimated minting cost
  const getEstimatedCost = useCallback(async () => {
    try {
      const cost = await nftService.estimateMintingCost();
      setEstimatedCost(cost);
    } catch (error) {
      console.error('Error getting estimated cost:', error);
    }
  }, []);

  // Generate signature with deterministic seed
  const generateSignature = useCallback(
    async (firstName: string, lastInitial: string) => {
      if (!wallet.publicKey) {
        toast.error('Please connect your wallet first');
        return;
      }

      setIsLoading(true);
      try {
        // Validate input
        const validation = generator.validateInput(firstName, lastInitial);
        if (!validation.valid) {
          toast.error(validation.errors.join(', '));
          return;
        }

        // Generate signature data
        const data = generator.initializeSignature(
          firstName,
          lastInitial,
          wallet.publicKey.toString(),
        );

        setSignatureData(data);

        // Generate style gallery and select first style
        const styles = generator.generateStyleGallery(data.seed);
        if (styles.length > 0) {
          setSelectedStyle(styles[0]);
        }

        toast.success('Signature styles generated successfully');
      } catch (error) {
        console.error('Error generating signature:', error);
        toast.error('Failed to generate signature');
      } finally {
        setIsLoading(false);
      }
    },
    [wallet.publicKey, generator],
  );

  // Select a signature style
  const selectStyle = useCallback(
    (style: SignatureStyle) => {
      setSelectedStyle(style);

      if (signatureData) {
        setSignatureData({
          ...signatureData,
          selectedStyleId: style.id,
        });
      }
    },
    [signatureData],
  );

  // Mint signature NFT
  const mintSignatureNFT = useCallback(async () => {
    if (!wallet.publicKey || !wallet.signTransaction) {
      toast.error('Please connect your wallet');
      return;
    }

    if (!signatureData || !selectedStyle) {
      toast.error('Please generate and select a signature first');
      return;
    }

    // Check wallet balance
    try {
      const balance = await connection.getBalance(wallet.publicKey);
      const requiredBalance = estimatedCost * 1e9; // Convert to lamports

      if (balance < requiredBalance) {
        toast.error(
          `Insufficient balance. You need at least ${estimatedCost} SOL`,
        );
        return;
      }
    } catch (error) {
      console.error('Error checking balance:', error);
    }

    setIsMinting(true);
    try {
      // Generate SVG content
      const svgContent = generator.renderToSVG(signatureData, selectedStyle);

      // Convert to path-only SVG (for better NFT compatibility)
      const pathSvg = await generator.convertToPathSVG(svgContent);

      // Mint NFT
      const result = await nftService.mintSignatureNFT({
        signatureData,
        signatureStyle: selectedStyle,
        svgContent: pathSvg,
        wallet,
        connection,
      });

      setMintResult(result);

      if (result.success) {
        toast.success('Signature NFT minted successfully!');

        // Refresh user's NFTs
        await refreshUserNFTs();

        // Show success details
        if (result.mintAddress) {
          toast.info(`Mint address: ${result.mintAddress.substring(0, 8)}...`);
        }
      } else {
        toast.error(result.error || 'Failed to mint NFT');
      }
    } catch (error) {
      console.error('Error minting NFT:', error);
      toast.error('Failed to mint signature NFT');
    } finally {
      setIsMinting(false);
    }
  }, [
    wallet,
    connection,
    signatureData,
    selectedStyle,
    estimatedCost,
    generator,
  ]);

  // Refresh user's signature NFTs
  const refreshUserNFTs = useCallback(async () => {
    if (!wallet.publicKey) return;

    setIsLoading(true);
    try {
      const nfts = await nftService.getUserSignatureNFTs(
        wallet.publicKey.toString(),
      );
      setUserSignatureNFTs(nfts);

      if (nfts.length > 0) {
        setHasExistingSignature(true);
      }
    } catch (error) {
      console.error('Error fetching user NFTs:', error);
      toast.error('Failed to load your signature NFTs');
    } finally {
      setIsLoading(false);
    }
  }, [wallet.publicKey]);

  // Verify signature NFT authenticity
  const verifySignature = useCallback(
    async (mintAddress: string): Promise<boolean> => {
      if (!signatureData) {
        toast.error('No signature data available for verification');
        return false;
      }

      try {
        const isValid = await nftService.verifySignatureNFT(
          mintAddress,
          signatureData.seed,
        );

        if (isValid) {
          toast.success('Signature NFT verified successfully');
        } else {
          toast.error('Signature NFT verification failed');
        }

        return isValid;
      } catch (error) {
        console.error('Error verifying signature:', error);
        toast.error('Failed to verify signature NFT');
        return false;
      }
    },
    [signatureData],
  );

  return {
    // State
    signatureData,
    selectedStyle,
    userSignatureNFTs,
    isMinting,
    isLoading,
    hasExistingSignature,
    mintResult,
    estimatedCost,

    // Actions
    generateSignature,
    selectStyle,
    mintSignatureNFT,
    refreshUserNFTs,
    verifySignature,
  };
}
