type EnvVar = {
  key: string;
  required: boolean;
  defaultValue?: string;
  validator?: (value: string) => boolean;
};

const envVars: EnvVar[] = [
  {
    key: 'NEXT_PUBLIC_SOLANA_RPC_URL',
    required: true,
    validator: (value) => value.startsWith('http') || value.startsWith('wss'),
  },
  {
    key: 'NEXT_PUBLIC_API_BASE_URL',
    required: false,
    defaultValue: 'http://localhost:3001',
    validator: (value) => value.startsWith('http'),
  },
  {
    key: 'NEXT_PUBLIC_WS_URL',
    required: false,
    defaultValue: 'ws://localhost:8080',
    validator: (value) => value.startsWith('ws') || value.startsWith('wss'),
  },
  {
    key: 'NEXT_PUBLIC_SOLANA_NETWORK',
    required: false,
    defaultValue: 'testnet',
    validator: (value) => ['mainnet-beta', 'testnet', 'devnet'].includes(value),
  },
];

export interface EnvValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  values: Record<string, string>;
}

export function validateEnvironment(): EnvValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const values: Record<string, string> = {};

  for (const envVar of envVars) {
    const value = process.env[envVar.key];

    if (!value) {
      if (envVar.required) {
        errors.push(`Missing required environment variable: ${envVar.key}`);
      } else if (envVar.defaultValue) {
        values[envVar.key] = envVar.defaultValue;
        warnings.push(
          `Using default value for ${envVar.key}: ${envVar.defaultValue}`,
        );
      }
      continue;
    }

    if (envVar.validator && !envVar.validator(value)) {
      errors.push(`Invalid value for ${envVar.key}: ${value}`);
      continue;
    }

    values[envVar.key] = value;
  }

  if (process.env.NODE_ENV === 'production') {
    if (values.NEXT_PUBLIC_SOLANA_NETWORK === 'devnet') {
      warnings.push('Using Devnet in production environment');
    }
    if (values.NEXT_PUBLIC_API_BASE_URL?.includes('localhost')) {
      errors.push('Cannot use localhost API in production');
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    values,
  };
}

export function getEnvVar(key: string, defaultValue?: string): string {
  return process.env[key] || defaultValue || '';
}

export function isMainnet(): boolean {
  return process.env.NEXT_PUBLIC_SOLANA_NETWORK === 'mainnet-beta';
}

export function isTestnet(): boolean {
  return process.env.NEXT_PUBLIC_SOLANA_NETWORK === 'testnet';
}

export function isDevnet(): boolean {
  return process.env.NEXT_PUBLIC_SOLANA_NETWORK === 'devnet';
}
