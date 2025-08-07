'use client';

import { useEffect, useState } from 'react';
import { validateEnvironment, EnvValidationResult } from '@/lib/env-validation';

export function useEnvValidation() {
  const [validation, setValidation] = useState<EnvValidationResult | null>(
    null,
  );
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const result = validateEnvironment();
    setValidation(result);
    setIsChecking(false);

    if (!result.isValid && process.env.NODE_ENV === 'development') {
      console.error('Environment validation failed:', result.errors);
    }
    if (result.warnings.length > 0 && process.env.NODE_ENV === 'development') {
      console.warn('Environment warnings:', result.warnings);
    }
  }, []);

  return { validation, isChecking };
}
