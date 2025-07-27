/**
 * Legal compliance content data
 * Extracted from LegalComplianceContent.tsx to reduce component size
 */

import {
  UserCheck,
  Ban,
  AlertCircle,
  CreditCard,
  Globe,
  Shield,
  Clock,
  Lock,
  Eye,
  Users,
  MapPin,
  Mail,
  Building,
  Gavel,
  Scale,
} from '@/lib/icons';

export const termsHighlights = [
  {
    category: 'Participation Requirements',
    icon: UserCheck,
    rules: [
      'Must be 18+ years old to participate',
      'Valid email address required for account creation',
      'One account per person policy strictly enforced',
      'Account verification may be required for large winnings',
    ],
  },
  {
    category: 'Prohibited Activities',
    icon: Ban,
    rules: [
      'No automated betting or bot usage',
      'Account sharing or selling prohibited',
      'Fraudulent activity results in permanent ban',
      'Multiple accounts from same household restricted',
    ],
  },
  {
    category: 'Financial Terms',
    icon: CreditCard,
    rules: [
      'All transactions processed securely via crypto',
      'Minimum square purchase: $1 USD equivalent',
      'Maximum daily spending limits apply',
      'Winnings paid out within 24-48 hours',
    ],
  },
  {
    category: 'Geographic Restrictions',
    icon: Globe,
    rules: [
      'Service available in select jurisdictions only',
      'Users responsible for local law compliance',
      'VPN usage to circumvent restrictions prohibited',
      'Geographic verification may be required',
    ],
  },
];

export const privacyHighlights = [
  {
    category: 'Data Collection',
    icon: Eye,
    details: [
      'Email address and basic profile information',
      'Transaction history and payment details',
      'Device information and IP addresses',
      'Game participation and preference data',
    ],
  },
  {
    category: 'Data Usage',
    icon: Shield,
    details: [
      'Account management and user authentication',
      'Transaction processing and fraud prevention',
      'Customer support and communication',
      'Service improvement and analytics',
    ],
  },
  {
    category: 'Data Sharing',
    icon: Users,
    details: [
      'Never sold to third parties for marketing',
      'Shared only with essential service providers',
      'Legal compliance when required by law',
      'Anonymous analytics for service improvement',
    ],
  },
  {
    category: 'Data Security',
    icon: Lock,
    details: [
      'End-to-end encryption for sensitive data',
      'Regular security audits and penetration testing',
      'Secure cloud infrastructure with redundancy',
      'Employee access limited by role and necessity',
    ],
  },
];

export const geographicRules = [
  {
    region: 'United States',
    icon: MapPin,
    status: 'Restricted',
    details: [
      'Prohibited in states with specific anti-gambling laws',
      'Age verification required (21+ in some states)',
      'Tax reporting obligations for winnings over $600',
      'Compliance with individual state regulations',
    ],
  },
  {
    region: 'European Union',
    icon: Globe,
    status: 'Limited',
    details: [
      'GDPR compliance for all data processing',
      'Individual country gambling license requirements',
      'VAT implications for winnings in some countries',
      'Right to data portability and deletion',
    ],
  },
  {
    region: 'Canada',
    icon: MapPin,
    status: 'Available',
    details: [
      'Provincial gambling regulations apply',
      'Tax implications vary by province',
      'French language support in Quebec',
      'Responsible gambling resources provided',
    ],
  },
  {
    region: 'Other Regions',
    icon: Globe,
    status: 'Case-by-Case',
    details: [
      'Evaluated based on local gambling laws',
      'Cryptocurrency regulations considered',
      'Anti-money laundering compliance required',
      'Customer support in English only',
    ],
  },
];

export const disputeResolution = [
  {
    step: 1,
    title: 'Internal Resolution',
    icon: Mail,
    description: 'Contact our support team first',
    details: [
      'Submit detailed complaint via support portal',
      'Provide all relevant transaction information',
      'Allow 5-7 business days for initial response',
      'Most issues resolved at this stage',
    ],
  },
  {
    step: 2,
    title: 'Escalation Review',
    icon: Building,
    description: 'Senior management review',
    details: [
      'Case escalated to compliance team',
      'Independent review of all evidence',
      'Additional documentation may be requested',
      'Resolution within 14 business days',
    ],
  },
  {
    step: 3,
    title: 'Mediation',
    icon: Scale,
    description: 'Third-party mediation service',
    details: [
      'Neutral third-party mediator assigned',
      'Both parties present their case',
      'Mediation typically resolves 80% of disputes',
      'Cost shared between parties if needed',
    ],
  },
  {
    step: 4,
    title: 'Arbitration',
    icon: Gavel,
    description: 'Binding arbitration process',
    details: [
      'Formal arbitration through recognized service',
      'Legally binding decision by qualified arbitrator',
      'Limited grounds for appeal of decision',
      'Final resolution typically within 60 days',
    ],
  },
];

export const keyPolicies = [
  {
    title: 'Responsible Gaming',
    icon: Shield,
    summary:
      'We promote responsible participation and provide tools for self-management.',
    keyPoints: [
      'Self-exclusion options available',
      'Spending limit controls',
      'Reality check reminders',
      'Problem gambling resources',
    ],
  },
  {
    title: 'Fair Play',
    icon: Scale,
    summary:
      'All games use verifiable random number generation and transparent rules.',
    keyPoints: [
      'Provably fair algorithms',
      'Real-time result verification',
      'Public audit trails',
      'No house edge manipulation',
    ],
  },
  {
    title: 'Data Protection',
    icon: Lock,
    summary:
      'Your personal information is protected with industry-leading security.',
    keyPoints: [
      'GDPR and CCPA compliant',
      'Regular security audits',
      'Encrypted data transmission',
      'Minimal data collection policy',
    ],
  },
  {
    title: 'Transparent Operations',
    icon: Eye,
    summary:
      'Open communication about our processes, fees, and business practices.',
    keyPoints: [
      'Clear fee structure',
      'Real-time transaction tracking',
      'Open source verification tools',
      'Regular transparency reports',
    ],
  },
];

export const contactInfo = {
  support: {
    email: 'support@footballsquares.com',
    hours: '24/7 via email, 9 AM - 6 PM PST phone support',
    response: 'Typical response within 4 hours during business days',
  },
  legal: {
    email: 'legal@footballsquares.com',
    purpose: 'Legal inquiries, compliance questions, formal notices',
    response: 'Response within 1-2 business days',
  },
  privacy: {
    email: 'privacy@footballsquares.com',
    purpose: 'Data protection requests, GDPR inquiries',
    response: 'Response within 72 hours as required by law',
  },
};

export const lastUpdated = {
  termsOfService: '2024-01-15',
  privacyPolicy: '2024-01-15',
  geographicRules: '2024-01-10',
  disputeResolution: '2023-12-01',
};
