/**
 * Lazy-loaded component exports for performance optimization
 * Use these instead of direct imports for large content components
 */

import { createLazyComponent } from '@/components/layout/LazyContentWrapper';

// Lazy load the large content components
export const LazyLegalComplianceContent = createLazyComponent(
  () => import('@/components/LegalComplianceContent'),
);

export const LazyTechnicalSupportContent = createLazyComponent(
  () => import('@/components/TechnicalSupportContent'),
);

export const LazyHowToPlayContent = createLazyComponent(
  () => import('@/components/HowToPlayContent'),
);

// Example usage in pages:
// import { LazyLegalComplianceContent } from '@/lib/lazy-components';
//
// export default function LegalPage() {
//   return <LazyLegalComplianceContent />;
// }
