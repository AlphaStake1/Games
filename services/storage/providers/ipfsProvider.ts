import { StorageProvider } from '../storageService';

export class IPFSProvider implements StorageProvider {
  name: 'ipfs' = 'ipfs';
  private endpoint?: string;
  private projectId?: string;
  private projectSecret?: string;

  constructor(config: {
    endpoint?: string;
    projectId?: string;
    projectSecret?: string;
  }) {
    this.endpoint = config.endpoint || 'https://ipfs.infura.io:5001';
    this.projectId = config.projectId;
    this.projectSecret = config.projectSecret;
  }

  isConfigured(): boolean {
    // Can work with public IPFS gateway or with Infura credentials
    return true;
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {};

    if (this.projectId && this.projectSecret) {
      // Infura authentication
      const auth = Buffer.from(
        `${this.projectId}:${this.projectSecret}`,
      ).toString('base64');
      headers['Authorization'] = `Basic ${auth}`;
    }

    return headers;
  }

  async uploadFile(
    file: Buffer | Uint8Array,
    filename: string,
    contentType: string,
  ): Promise<string> {
    const formData = new FormData();
    const blob = new Blob([file], { type: contentType });
    formData.append('file', blob, filename);

    const response = await fetch(`${this.endpoint}/api/v0/add`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: formData,
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`IPFS upload failed: ${error}`);
    }

    const data = await response.json();
    return `ipfs://${data.Hash}`;
  }

  async uploadJSON(data: object): Promise<string> {
    const jsonString = JSON.stringify(data);
    const buffer = Buffer.from(jsonString);
    return this.uploadFile(buffer, 'metadata.json', 'application/json');
  }

  getUrl(cid: string): string {
    // Remove ipfs:// prefix if present
    const hash = cid.replace('ipfs://', '');
    // Use public gateway
    return `https://ipfs.io/ipfs/${hash}`;
  }
}
