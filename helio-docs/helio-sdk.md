The Helio SDK can be installed via npm.[1] You can find a complete list of available methods, types, and configuration options in the official package on npm.[1] You will need to generate API keys to use the SDK.[1]

To use the SDK, you need to import it into your project using ES modules:
```javascript
import {HelioSDK} from '@heliofi/sdk';
```

After importing, you can initialize the SDK and use it. For example, to create a pay link:
```typescript
import HelioSDK from '@heliofi/sdk';

const sdk = new HelioSDK({
  apiKey: 'your-public-api-key',
  secretKey: 'your-secret-key',
  network: 'mainnet', // or 'devnet' (optional, mainnet by default)
});

const paylink = await sdk.paylink.create(createPaylinkDto);
```
You need to replace the placeholders with your actual API credentials.[1]

Sources:
[1] Helio SDK (https://docs.hel.io/docs/helio-sdk)