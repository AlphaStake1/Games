/**
 * Storage configuration for signature NFTs
 * You can update these values with your actual credentials when ready
 */

export const storageConfig = {
  // Choose your provider: 'pinata' | 'ipfs' | 'arweave' | 'google-cloud'
  provider: 'google-cloud' as const,

  pinata: {
    // These will use the values from your .env file
    apiKey: process.env.NEXT_PUBLIC_PINATA_API_KEY || 'fd6cabab378fa43bdb30',
    apiSecret: process.env.PINATA_API_SECRET || '',
    jwt: process.env.PINATA_JWT || '',
  },

  ipfs: {
    endpoint:
      process.env.NEXT_PUBLIC_IPFS_ENDPOINT || 'https://ipfs.infura.io:5001',
    projectId: process.env.NEXT_PUBLIC_IPFS_PROJECT_ID || '',
    projectSecret: process.env.IPFS_PROJECT_SECRET || '',
  },

  arweave: {
    host: process.env.NEXT_PUBLIC_ARWEAVE_HOST || 'arweave.net',
    port: parseInt(process.env.NEXT_PUBLIC_ARWEAVE_PORT || '443'),
    protocol: process.env.NEXT_PUBLIC_ARWEAVE_PROTOCOL || 'https',
    wallet: process.env.ARWEAVE_WALLET || '',
  },

  googleCloud: {
    projectId:
      process.env.GOOGLE_CLOUD_PROJECT_ID || 'football-squares-01-b9dfeaec4bff',
    bucketName: process.env.GOOGLE_CLOUD_BUCKET || 'coach-b-fsq-assets',
    keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
    region: process.env.GOOGLE_CLOUD_REGION || 'us-central1',
  },
};

// Instructions for setup:
// 1. For Pinata: Get your API keys from https://app.pinata.cloud/developers/api-keys
// 2. For IPFS (Infura): Get your project ID from https://infura.io/dashboard
// 3. For Arweave: Get a wallet from https://www.arconnect.io/ or https://arweave.app/

export const STORAGE_SETUP_INSTRUCTIONS = {
  googleCloud: `
Google Cloud Storage Setup (Coach B's account ready):
✅ Project: football-squares-01-b9dfeaec4bff
✅ Bucket: coach-b-fsq-assets
✅ Service Account: configured
✅ Region: us-central1

This is ALREADY CONFIGURED and ready to use! The system will:
- Store signature SVGs in: gs://coach-b-fsq-assets/signatures/
- Store NFT metadata in: gs://coach-b-fsq-assets/signatures/
- Use service account authentication for secure uploads
- Provide public URLs for NFT metadata and images

For production enhancement:
1. Create separate buckets for live vs archive data
2. Enable object versioning
3. Set up retention policies for permanent records
4. Configure Cloud CDN for faster global delivery
  `,

  pinata: `
To set up Pinata:
1. Go to https://app.pinata.cloud and create an account
2. Navigate to API Keys section
3. Create a new API key with these permissions:
   - pinFileToIPFS
   - pinJSONToIPFS
   - pinList
4. Copy the API Key, Secret Key, and JWT
5. Add them to your .env file as:
   NEXT_PUBLIC_PINATA_API_KEY=your_api_key
   PINATA_API_SECRET=your_secret_key
   PINATA_JWT=your_jwt_token
  `,

  ipfs: `
To set up IPFS with Infura:
1. Go to https://infura.io and create an account
2. Create a new IPFS project
3. Copy your Project ID and Project Secret
4. Add them to your .env file as:
   NEXT_PUBLIC_IPFS_PROJECT_ID=your_project_id
   IPFS_PROJECT_SECRET=your_project_secret
  `,

  arweave: `
To set up Arweave:
1. Install ArConnect browser extension or use Arweave.app
2. Create or import a wallet
3. Fund it with AR tokens for storage costs
4. Export your wallet JSON keyfile
5. Add it to your .env file as:
   ARWEAVE_WALLET=your_wallet_json_string
  `,
};
