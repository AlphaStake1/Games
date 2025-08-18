import { StorageProvider } from '../storageService';

export class PinataProvider implements StorageProvider {
  name: 'pinata' = 'pinata';
  private apiKey?: string;
  private apiSecret?: string;
  private jwt?: string;
  private gateway: string = 'https://gateway.pinata.cloud/ipfs';

  constructor(config: { apiKey?: string; apiSecret?: string; jwt?: string }) {
    this.apiKey = config.apiKey;
    this.apiSecret = config.apiSecret;
    this.jwt = config.jwt;
  }

  isConfigured(): boolean {
    return !!(this.jwt || (this.apiKey && this.apiSecret));
  }

  private getHeaders(): HeadersInit {
    if (this.jwt) {
      return {
        Authorization: `Bearer ${this.jwt}`,
      };
    } else if (this.apiKey && this.apiSecret) {
      return {
        pinata_api_key: this.apiKey,
        pinata_secret_api_key: this.apiSecret,
      };
    }
    throw new Error('Pinata credentials not configured');
  }

  async uploadFile(
    file: Buffer | Uint8Array,
    filename: string,
    contentType: string,
  ): Promise<string> {
    const formData = new FormData();
    const blob = new Blob([file], { type: contentType });
    formData.append('file', blob, filename);

    // Add pinning metadata
    const metadata = JSON.stringify({
      name: filename,
      keyvalues: {
        type: 'signature',
        timestamp: Date.now().toString(),
      },
    });
    formData.append('pinataMetadata', metadata);

    // Pin to IPFS via Pinata
    const response = await fetch(
      'https://api.pinata.cloud/pinning/pinFileToIPFS',
      {
        method: 'POST',
        headers: this.getHeaders(),
        body: formData,
      },
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Pinata upload failed: ${error}`);
    }

    const data = await response.json();
    return `ipfs://${data.IpfsHash}`;
  }

  async uploadJSON(data: object): Promise<string> {
    const response = await fetch(
      'https://api.pinata.cloud/pinning/pinJSONToIPFS',
      {
        method: 'POST',
        headers: {
          ...this.getHeaders(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pinataContent: data,
          pinataMetadata: {
            name: `metadata_${Date.now()}.json`,
            keyvalues: {
              type: 'signature-metadata',
              timestamp: Date.now().toString(),
            },
          },
        }),
      },
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Pinata JSON upload failed: ${error}`);
    }

    const result = await response.json();
    return `ipfs://${result.IpfsHash}`;
  }

  getUrl(cid: string): string {
    // Remove ipfs:// prefix if present
    const hash = cid.replace('ipfs://', '');
    return `${this.gateway}/${hash}`;
  }
}
