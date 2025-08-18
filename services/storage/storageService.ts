export interface StorageProvider {
  name: 'ipfs' | 'arweave' | 'pinata';
  uploadFile(file: Buffer | Uint8Array, filename: string, contentType: string): Promise<string>;
  uploadJSON(data: object): Promise<string>;
  getUrl(cid: string): string;
  isConfigured(): boolean;
}

export interface StorageConfig {
  provider: 'ipfs' | 'arweave' | 'pinata';
  ipfs?: {
    endpoint?: string;
    projectId?: string;
    projectSecret?: string;
  };
  arweave?: {
    host?: string;
    port?: number;
    protocol?: string;
    wallet?: string;
  };
  pinata?: {
    apiKey?: string;
    apiSecret?: string;
    jwt?: string;
  };
}

/**
 * Abstract storage service that can work with multiple providers
 */
export class StorageService {
  private provider: StorageProvider | null = null;
  private config: StorageConfig;

  constructor(config?: StorageConfig) {
    this.config = config || this.loadConfigFromEnv();
    this.initializeProvider();
  }

  /**
   * Load configuration from environment variables
   */
  private loadConfigFromEnv(): StorageConfig {
    const provider = (process.env.NEXT_PUBLIC_STORAGE_PROVIDER || 'pinata') as 'ipfs' | 'arweave' | 'pinata';
    
    return {
      provider,
      ipfs: {
        endpoint: process.env.NEXT_PUBLIC_IPFS_ENDPOINT,
        projectId: process.env.NEXT_PUBLIC_IPFS_PROJECT_ID,
        projectSecret: process.env.IPFS_PROJECT_SECRET, // Server-side only
      },
      arweave: {
        host: process.env.NEXT_PUBLIC_ARWEAVE_HOST || 'arweave.net',
        port: parseInt(process.env.NEXT_PUBLIC_ARWEAVE_PORT || '443'),
        protocol: process.env.NEXT_PUBLIC_ARWEAVE_PROTOCOL || 'https',
        wallet: process.env.ARWEAVE_WALLET, // Server-side only
      },
      pinata: {
        apiKey: process.env.NEXT_PUBLIC_PINATA_API_KEY,
        apiSecret: process.env.PINATA_API_SECRET, // Server-side only
        jwt: process.env.PINATA_JWT, // Server-side only
      },
    };
  }

  /**
   * Initialize the storage provider based on configuration
   */
  private async initializeProvider() {
    switch (this.config.provider) {
      case 'ipfs':
        const { IPFSProvider } = await import('./providers/ipfsProvider');
        this.provider = new IPFSProvider(this.config.ipfs || {});
        break;
      case 'arweave':
        const { ArweaveProvider } = await import('./providers/arweaveProvider');
        this.provider = new ArweaveProvider(this.config.arweave || {});
        break;
      case 'pinata':
        const { PinataProvider } = await import('./providers/pinataProvider');
        this.provider = new PinataProvider(this.config.pinata || {});
        break;
      default:
        throw new Error(`Unsupported storage provider: ${this.config.provider}`);
    }
  }

  /**
   * Check if the storage service is properly configured
   */
  async isConfigured(): Promise<boolean> {
    if (!this.provider) {
      await this.initializeProvider();
    }
    return this.provider?.isConfigured() || false;
  }

  /**
   * Upload a file to the storage provider
   */
  async uploadFile(
    file: Buffer | Uint8Array, 
    filename: string, 
    contentType: string = 'application/octet-stream'
  ): Promise<string> {
    if (!this.provider) {
      await this.initializeProvider();
    }
    
    if (!this.provider) {
      throw new Error('Storage provider not initialized');
    }

    if (!this.provider.isConfigured()) {
      throw new Error(`${this.config.provider} is not properly configured. Please set the required environment variables.`);
    }

    try {
      const uri = await this.provider.uploadFile(file, filename, contentType);
      console.log(`File uploaded to ${this.config.provider}:`, uri);
      return uri;
    } catch (error) {
      console.error(`Error uploading to ${this.config.provider}:`, error);
      throw new Error(`Failed to upload file to ${this.config.provider}: ${error}`);
    }
  }

  /**
   * Upload JSON data to the storage provider
   */
  async uploadJSON(data: object): Promise<string> {
    if (!this.provider) {
      await this.initializeProvider();
    }
    
    if (!this.provider) {
      throw new Error('Storage provider not initialized');
    }

    if (!this.provider.isConfigured()) {
      throw new Error(`${this.config.provider} is not properly configured. Please set the required environment variables.`);
    }

    try {
      const uri = await this.provider.uploadJSON(data);
      console.log(`JSON uploaded to ${this.config.provider}:`, uri);
      return uri;
    } catch (error) {
      console.error(`Error uploading JSON to ${this.config.provider}:`, error);
      throw new Error(`Failed to upload JSON to ${this.config.provider}: ${error}`);
    }
  }

  /**
   * Get the full URL for a given CID/hash
   */
  getUrl(cid: string): string {
    if (!this.provider) {
      throw new Error('Storage provider not initialized');
    }
    return this.provider.getUrl(cid);
  }

  /**
   * Get the current provider name
   */
  getProviderName(): string {
    return this.config.provider;
  }

  /**
   * Upload signature SVG
   */
  async uploadSignatureSVG(svgContent: string, walletAddress: string): Promise<string> {
    const filename = `signature_${walletAddress.substring(0, 8)}_${Date.now()}.svg`;
    const buffer = Buffer.from(svgContent);
    return this.uploadFile(buffer, filename, 'image/svg+xml');
  }

  /**
   * Upload signature metadata
   */
  async uploadSignatureMetadata(metadata: object): Promise<string> {
    return this.uploadJSON(metadata);
  }
}

// Singleton instance
let storageServiceInstance: StorageService | null = null;

export function getStorageService(config?: StorageConfig): StorageService {
  if (!storageServiceInstance) {
    storageServiceInstance = new StorageService(config);
  }
  return storageServiceInstance;
}