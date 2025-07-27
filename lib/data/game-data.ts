/**
 * Game and how-to-play content data
 * Extracted from HowToPlayContent.tsx to reduce component size
 */

import {
  Trophy,
  Target,
  DollarSign,
  CheckCircle,
  AlertTriangle,
  Info,
  Star,
  Award,
  Calendar,
  Clock,
  Users,
  Grid,
  Zap,
  Shield,
  TrendingUp,
  BarChart,
  Heart,
} from '@/lib/icons';

export const gameBasics = [
  {
    step: 1,
    title: 'Choose Your Board',
    icon: Grid,
    description:
      'Select from available game boards with different price points and prize pools.',
    details: [
      'Browse boards by game date and teams',
      'Check entry fee and potential winnings',
      'Review board rules and payout structure',
      'Boards fill up quickly - act fast!',
    ],
  },
  {
    step: 2,
    title: 'Purchase Squares',
    icon: Target,
    description: 'Buy one or more squares on the 10x10 grid.',
    details: [
      'Each square represents a unique score combination',
      'Numbers are assigned randomly after board fills',
      'You can buy multiple squares for better odds',
      'Payment processed securely via cryptocurrency',
    ],
  },
  {
    step: 3,
    title: 'Numbers Are Drawn',
    icon: Zap,
    description: 'Random numbers (0-9) are assigned to rows and columns.',
    details: [
      'Numbers drawn using verifiable random process',
      'Each row/column gets a unique number 0-9',
      'Your square position determines your number combo',
      'Process is transparent and auditable',
    ],
  },
  {
    step: 4,
    title: 'Watch & Win',
    icon: Trophy,
    description: 'Watch the game and win based on quarterly scores.',
    details: [
      "Winners determined by last digit of each team's score",
      'Payouts typically occur after each quarter',
      'Final score usually has the biggest payout',
      'Winnings automatically credited to your account',
    ],
  },
];

export const scoringExamples = [
  {
    scenario: 'End of 1st Quarter',
    homeScore: 14,
    awayScore: 7,
    winningSquare: { row: 7, col: 4 },
    explanation:
      'Home team scored 14 (last digit 4), away team scored 7. The square at intersection of column 4, row 7 wins.',
    payout: '15% of prize pool',
  },
  {
    scenario: 'End of 2nd Quarter',
    homeScore: 21,
    awayScore: 10,
    winningSquare: { row: 0, col: 1 },
    explanation:
      'Home team scored 21 (last digit 1), away team scored 10 (last digit 0). Square at column 1, row 0 wins.',
    payout: '25% of prize pool',
  },
  {
    scenario: 'End of 3rd Quarter',
    homeScore: 28,
    awayScore: 17,
    winningSquare: { row: 7, col: 8 },
    explanation:
      'Home team scored 28 (last digit 8), away team scored 17 (last digit 7). Square at column 8, row 7 wins.',
    payout: '15% of prize pool',
  },
  {
    scenario: 'Final Score',
    homeScore: 35,
    awayScore: 24,
    winningSquare: { row: 4, col: 5 },
    explanation:
      'Final score: Home 35 (last digit 5), Away 24 (last digit 4). Square at column 5, row 4 wins the biggest prize.',
    payout: '45% of prize pool',
  },
];

export const boardTypes = [
  {
    type: 'House Board',
    icon: Grid,
    entryFee: '$10',
    description:
      'Traditional football squares with standard payouts. Most popular for new players.',
    features: [
      '100 squares total',
      'Standard quarterly payouts',
      'Most popular option',
      'Great for beginners',
    ],
    payoutStructure: {
      q1: '15%',
      q2: '25%',
      q3: '15%',
      final: '45%',
    },
  },
  {
    type: 'High Roller Board',
    icon: DollarSign,
    entryFee: '$100',
    description: 'Premium boards for serious players with larger payouts',
    features: [
      '100 squares total',
      'Higher entry fee, bigger prizes',
      'Exclusive player pool',
      'Play boards beyond default Home team',
    ],
    payoutStructure: {
      q1: '15%',
      q2: '25%',
      q3: '15%',
      final: '45%',
    },
  },
  {
    type: 'Community Board (CBL)',
    icon: Users,
    entryFee: 'Variable',
    description: 'Private boards with custom rules set by the CBL',
    features: [
      'Invite-only participation',
      'Custom entry fees and payouts',
      'Set by Community Board Leader',
      'Great for friends, family, co-workers',
    ],
    payoutStructure: {
      q1: 'CBL Defined',
      q2: 'CBL Defined',
      q3: 'CBL Defined',
      final: 'CBL Defined',
    },
  },
  {
    type: 'Backwards & +5 Boards',
    icon: TrendingUp,
    entryFee: '$15',
    description: 'Alternative scoring methods for experienced players',
    features: [
      'Backwards: Away team digit first, then Home team',
      '+5: Add 5 to each team score',
      'Different winning strategies',
      'Advanced board variations',
    ],
    payoutStructure: {
      q1: '15%',
      q2: '25%',
      q3: '15%',
      final: '45%',
    },
  },
];

export const strategies = [
  {
    category: 'Bankroll Management',
    icon: DollarSign,
    tips: [
      {
        title: 'Set a Budget',
        description: 'Never spend more than you can afford to lose',
        reasoning:
          'Squares are games of chance - responsible gambling is essential',
      },
      {
        title: 'Diversify Boards',
        description:
          'Spread purchases across multiple boards rather than loading up on one',
        reasoning: 'Reduces risk and increases chances across different games',
      },
      {
        title: 'Start Small',
        description:
          'Begin with community boards to learn before moving to high-roller boards',
        reasoning: 'Gain experience with lower risk before increasing stakes',
      },
    ],
  },
  {
    category: 'Timing',
    icon: Clock,
    tips: [
      {
        title: 'Early Bird Advantage',
        description: 'Popular boards fill up quickly, especially for big games',
        reasoning: 'Prime matchups and favorable odds get snapped up fast',
      },
      {
        title: 'Playoff Premium',
        description: 'Playoff and championship games have higher participation',
        reasoning:
          'More interest leads to larger prize pools but faster fill rates',
      },
      {
        title: 'Monday Night Specials',
        description: 'Monday night games often have special board offerings',
        reasoning: 'Extended weekend allows for unique promotional boards',
      },
    ],
  },
];

export const rules = [
  {
    category: 'Board Setup',
    icon: Grid,
    rules: [
      'Each board contains exactly 100 squares (10x10 grid)',
      'Numbers 0-9 are randomly assigned to rows and columns after board fills',
      'Each participant can purchase multiple squares',
      'Board must be completely filled before numbers are drawn',
    ],
  },
  {
    category: 'Number Assignment',
    icon: Zap,
    rules: [
      'Random number generation uses cryptographically secure methods',
      'Process is transparent and verifiable by all participants',
      'Numbers assigned after board is completely sold out',
      'No changes allowed once numbers are drawn',
    ],
  },
  {
    category: 'Winning Conditions - Football',
    icon: Trophy,
    rules: [
      "Winners determined by last digit of each team's score at end of quarters",
      'Payouts occur after Official End of Game with a delay of 5+ minutes',
      'All overtimes have payouts for final score, no exceptions',
      'All winnings are sent to the wallet address that purchased the square(s)',
    ],
  },
  {
    category: 'Disputes',
    icon: Shield,
    rules: [
      'Official NFL scores used for all determinations',
      'Scoring corrections by NFL after initial announcement may affect payouts',
      'Disputes must be filed within 24 hours of game completion',
      'All decisions by platform administration are final',
    ],
  },
];

export const payoutExamples = [
  {
    boardType: 'House Board ($10 entry)',
    totalPool: '$900',
    breakdown: [
      { quarter: '1st Quarter', percentage: 15, amount: '$135' },
      { quarter: '2nd Quarter (Halftime)', percentage: 25, amount: '$225' },
      { quarter: '3rd Quarter', percentage: 15, amount: '$135' },
      { quarter: 'Final Score', percentage: 45, amount: '$405' },
    ],
    note: 'Standard payout structure. If overtime occurs, final score payout is split 50/50 with overtime winner',
  },
  {
    boardType: 'High Roller ($100 entry)',
    totalPool: '$9000',
    breakdown: [
      { quarter: '1st Quarter', percentage: 15, amount: '$1,350' },
      { quarter: '2nd Quarter (Halftime)', percentage: 25, amount: '$2,250' },
      { quarter: '3rd Quarter', percentage: 15, amount: '$1,350' },
      { quarter: 'Final Score', percentage: 45, amount: '$4,050' },
    ],
    note: 'Same structure as House boards but with higher stakes. Overtime splits final score payout 50/50',
  },
];

export const faqs = [
  {
    category: 'Getting Started',
    icon: Info,
    questions: [
      {
        q: 'Do I need to know football to play?',
        a: "No! Football squares is purely based on the final digits of scores. No football knowledge required - it's entirely luck-based.",
      },
      {
        q: 'When do I find out my numbers?',
        a: 'Numbers are randomly assigned after the board completely fills up, usually 1-2 hours before game time.',
      },
      {
        q: 'Can I choose my own numbers?',
        a: 'No, numbers are assigned randomly to ensure fairness. You purchase square positions, not specific number combinations.',
      },
    ],
  },
  {
    category: 'Payments & Winnings',
    icon: DollarSign,
    questions: [
      {
        q: 'How do I get paid?',
        a: 'Winnings are automatically credited to your account within 1 hour of each quarter ending. You can withdraw to your crypto wallet anytime.',
      },
      {
        q: 'What if the game goes to overtime?',
        a: 'All overtimes have payouts for final score, no exceptions. Final score payouts apply to the official overtime result.',
      },
      {
        q: 'Are there any fees?',
        a: 'The platform takes a small percentage (typically 10%) from the total pool for operations. This is clearly disclosed for each board.',
      },
    ],
  },
  {
    category: 'Technical Questions',
    icon: Shield,
    questions: [
      {
        q: 'How do I know the number drawing is fair?',
        a: 'We use cryptographically secure random number generation that can be verified by anyone. The process is transparent and auditable.',
      },
      {
        q: "What if there's a scoring error?",
        a: 'We use official NFL scores. If the NFL makes a correction after initial announcement, payouts may be adjusted accordingly.',
      },
      {
        q: 'Can I sell or transfer my squares?',
        a: 'No, squares are non-transferable once purchased. This ensures the integrity of the game and prevents secondary market issues.',
      },
    ],
  },
];

export const tips = [
  {
    title: 'Sign Up for Email Alerts',
    icon: AlertTriangle,
    description:
      'Get notified instantly when your square HITS! Never miss a winning moment.',
  },
  {
    title: 'Set a Budget',
    icon: DollarSign,
    description:
      'Only play with money you can afford to lose. Squares should be fun, not financially stressful.',
  },
  {
    title: 'Understand the Odds',
    icon: BarChart,
    description:
      "Every square has an equal 1% chance of winning each quarter. There's no skill involved - it's pure luck.",
  },
  {
    title: 'Watch the Games',
    icon: Trophy,
    description:
      'Part of the fun is watching the game and rooting for your numbers. Enjoy the experience!',
  },
  {
    title: 'Read Board Rules',
    icon: Info,
    description:
      'Each board may have slightly different payout structures or special rules. Always check before purchasing.',
  },
];
