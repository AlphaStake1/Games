import { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { Metaplex, keypairIdentity, bundlrStorage, toMetaplexFile, NftWithToken } from '@metaplex-foundation/js';
import { WalletContextState } from '@solana/wallet-adapter-react';
import { SignatureData } from '@/lib/signature/signatureGenerator';
import { SignatureStyle } from '@/lib/signature/signatureConfig';

export interface MintSignatureNFTParams {
  signatureData: SignatureData;
  signatureStyle: SignatureStyle;
  svgContent: string;
  wallet: WalletContextState;
  connection: Connection;
}

export interface SignatureNFTResult {
  success: boolean;
  nft?: NftWithToken;
  mintAddress?: string;
  metadataUri?: string;
  error?: string;
  transactionSignature?: string;
}

export class SignatureNFTService {
  private metaplex: Metaplex | null = null;
  private connection: Connection;

  constructor(connection: Connection) {
    this.connection = connection;
  }

  /**
   * Initialize Metaplex instance with wallet
   */
  private initMetaplex(wallet: WalletContextState): Metaplex {
    if (!wallet.publicKey || !wallet.signTransaction) {
      throw new Error('Wallet not connected');
    }

    // Create a wallet adapter that Metaplex can use
    const walletAdapter = {
      publicKey: wallet.publicKey,
      signTransaction: wallet.signTransaction.bind(wallet),
      signAllTransactions: wallet.signAllTransactions?.bind(wallet) || 
        async (txs: Transaction[]) => {
          const signed = [];
          for (const tx of txs) {
            signed.push(await wallet.signTransaction!(tx));
          }
          return signed;
        }
    };

    this.metaplex = Metaplex.make(this.connection)
      .use({
        install(metaplex) {
          metaplex.identity().setDriver({
            publicKey: walletAdapter.publicKey!,
            signMessage: async (message: Uint8Array) => {
              if (wallet.signMessage) {
                return wallet.signMessage(message);
              }
              throw new Error('Wallet does not support message signing');
            },
            signTransaction: walletAdapter.signTransaction,
            signAllTransactions: walletAdapter.signAllTransactions
          });
        }
      })
      .use(bundlrStorage({
        address: 'https://devnet.bundlr.network',
        providerUrl: this.connection.rpcEndpoint,
        timeout: 60000,
      }));

    return this.metaplex;
  }

  /**
   * Upload SVG to Arweave/IPFS
   */
  private async uploadSignatureImage(
    metaplex: Metaplex, 
    svgContent: string,
    fileName: string
  ): Promise<string> {
    try {
      // Convert SVG string to buffer
      const buffer = Buffer.from(svgContent);
      
      // Create Metaplex file
      const file = toMetaplexFile(buffer, fileName, {
        displayName: fileName,
        uniqueName: fileName,
        contentType: 'image/svg+xml',
        extension: 'svg',
        tags: [
          { name: 'Content-Type', value: 'image/svg+xml' },
          { name: 'Category', value: 'signature' }
        ]
      });

      // Upload to storage
      const uploadedFile = await metaplex.storage().upload(file);
      console.log('Uploaded signature image:', uploadedFile);
      
      return uploadedFile;
    } catch (error) {
      console.error('Error uploading signature image:', error);
      throw new Error('Failed to upload signature image');
    }
  }

  /**
   * Upload metadata JSON to Arweave/IPFS
   */
  private async uploadMetadata(
    metaplex: Metaplex,
    metadata: object
  ): Promise<string> {
    try {
      const { uri } = await metaplex.nfts().uploadMetadata(metadata);
      console.log('Uploaded metadata:', uri);
      return uri;
    } catch (error) {
      console.error('Error uploading metadata:', error);
      throw new Error('Failed to upload metadata');
    }
  }

  /**
   * Check if user already has a signature NFT
   */
  async checkExistingSignatureNFT(walletAddress: string): Promise<boolean> {
    try {
      const metaplex = Metaplex.make(this.connection);
      const owner = new PublicKey(walletAddress);
      
      // Find all NFTs owned by the wallet
      const nfts = await metaplex.nfts().findAllByOwner({ owner });
      
      // Check if any NFT is a signature NFT from our collection
      const hasSignatureNFT = nfts.some(nft => {
        return nft.symbol === 'FSQSIG' || 
               nft.collection?.address.toString() === 'FSQ_SIGNATURE_COLLECTION_ADDRESS';
      });
      
      return hasSignatureNFT;
    } catch (error) {
      console.error('Error checking existing NFTs:', error);
      return false;
    }
  }

  /**
   * Mint signature NFT
   */
  async mintSignatureNFT(params: MintSignatureNFTParams): Promise<SignatureNFTResult> {
    const { signatureData, signatureStyle, svgContent, wallet, connection } = params;

    try {
      // Validate wallet connection
      if (!wallet.publicKey || !wallet.signTransaction) {
        return {
          success: false,
          error: 'Wallet not connected'
        };
      }

      // Check if user already has a signature NFT (optional)
      const hasExisting = await this.checkExistingSignatureNFT(wallet.publicKey.toString());
      if (hasExisting) {
        const confirmMint = window.confirm(
          'You already have a signature NFT. Do you want to mint another one?'
        );
        if (!confirmMint) {
          return {
            success: false,
            error: 'User cancelled minting'
          };
        }
      }

      // Initialize Metaplex
      const metaplex = this.initMetaplex(wallet);

      // Generate file name
      const fileName = `signature_${signatureData.seed.substring(0, 8)}.svg`;

      // Upload signature image
      console.log('Uploading signature image...');
      const imageUri = await this.uploadSignatureImage(metaplex, svgContent, fileName);

      // Generate metadata
      const generator = await import('@/lib/signature/signatureGenerator').then(m => new m.SignatureGenerator());
      const metadata = generator.generateNFTMetadata(signatureData, signatureStyle, imageUri);

      // Upload metadata
      console.log('Uploading metadata...');
      const metadataUri = await this.uploadMetadata(metaplex, metadata);

      // Create NFT
      console.log('Minting NFT...');
      const { nft } = await metaplex.nfts().create({
        uri: metadataUri,
        name: metadata.name as string,
        symbol: metadata.symbol as string,
        sellerFeeBasisPoints: metadata.seller_fee_basis_points as number,
        maxSupply: 1, // Make it unique
        isMutable: false, // Make it immutable
        creators: [
          {
            address: wallet.publicKey,
            share: 100,
            verified: true
          }
        ]
      });

      console.log('NFT minted successfully:', nft);

      return {
        success: true,
        nft: nft as NftWithToken,
        mintAddress: nft.address.toString(),
        metadataUri: metadataUri,
        transactionSignature: nft.mint.address.toString()
      };

    } catch (error) {
      console.error('Error minting signature NFT:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to mint NFT'
      };
    }
  }

  /**
   * Get signature NFT by mint address
   */
  async getSignatureNFT(mintAddress: string): Promise<NftWithToken | null> {
    try {
      const metaplex = Metaplex.make(this.connection);
      const mint = new PublicKey(mintAddress);
      
      const nft = await metaplex.nfts().findByMint({ mintAddress: mint });
      return nft as NftWithToken;
    } catch (error) {
      console.error('Error fetching NFT:', error);
      return null;
    }
  }

  /**
   * Get all signature NFTs owned by wallet
   */
  async getUserSignatureNFTs(walletAddress: string): Promise<NftWithToken[]> {
    try {
      const metaplex = Metaplex.make(this.connection);
      const owner = new PublicKey(walletAddress);
      
      const nfts = await metaplex.nfts().findAllByOwner({ owner });
      
      // Filter for signature NFTs
      const signatureNFTs = nfts.filter(nft => {
        return nft.symbol === 'FSQSIG';
      });
      
      // Load full metadata for each NFT
      const fullNFTs = await Promise.all(
        signatureNFTs.map(async (nft) => {
          try {
            return await metaplex.nfts().load({ metadata: nft });
          } catch {
            return null;
          }
        })
      );
      
      return fullNFTs.filter(nft => nft !== null) as NftWithToken[];
    } catch (error) {
      console.error('Error fetching user NFTs:', error);
      return [];
    }
  }

  /**
   * Verify signature NFT authenticity
   */
  async verifySignatureNFT(
    mintAddress: string, 
    expectedSeed: string
  ): Promise<boolean> {
    try {
      const nft = await this.getSignatureNFT(mintAddress);
      if (!nft) return false;
      
      // Check if the NFT has the expected seed in attributes
      const seedAttribute = nft.json?.attributes?.find(
        (attr: any) => attr.trait_type === 'Seed'
      );
      
      return seedAttribute?.value === expectedSeed.substring(0, 8);
    } catch (error) {
      console.error('Error verifying NFT:', error);
      return false;
    }
  }

  /**
   * Estimate minting cost
   */
  async estimateMintingCost(): Promise<number> {
    try {
      // Base costs (in SOL)
      const nftCreationCost = 0.01; // Approximate NFT creation cost
      const storageCost = 0.005; // Approximate storage cost for metadata and image
      const transactionFees = 0.001; // Approximate transaction fees
      
      const totalCost = nftCreationCost + storageCost + transactionFees;
      
      return totalCost;
    } catch (error) {
      console.error('Error estimating cost:', error);
      return 0.02; // Default estimate
    }
  }
}

// Export singleton instance
export const signatureNFTService = (connection: Connection) => 
  new SignatureNFTService(connection);