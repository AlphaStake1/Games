import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';

export const metadata = {
  title: 'CBL Guidelines & Code of Conduct | Football Squares',
  description:
    'Complete Community Board Leader guidelines, code of conduct, and operational procedures.',
};

const CBLGuidelinesPage = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-black transition-colors duration-300">
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Community Board Leader Guidelines
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-2">
            Complete operational guidelines for CBLs
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        {/* Overview Alert */}
        <Alert className="mb-8">
          <AlertDescription>
            <strong>Important:</strong> All Community Board Leaders must read,
            understand, and agree to these guidelines. Violations may result in
            warnings, suspension, or permanent removal from the CBL program.
          </AlertDescription>
        </Alert>

        {/* Table of Contents */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Table of Contents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <a
                  href="#section-1"
                  className="block py-1 text-blue-600 hover:underline"
                >
                  1. Community Leadership
                </a>
                <a
                  href="#section-2"
                  className="block py-1 text-blue-600 hover:underline"
                >
                  2. Communication Standards
                </a>
                <a
                  href="#section-3"
                  className="block py-1 text-blue-600 hover:underline"
                >
                  3. Financial & Security Duties
                </a>
              </div>
              <div>
                <a
                  href="#section-4"
                  className="block py-1 text-blue-600 hover:underline"
                >
                  4. Platform Integrity
                </a>
                <a
                  href="#section-5"
                  className="block py-1 text-blue-600 hover:underline"
                >
                  5. Enforcement & Appeals
                </a>
                <a
                  href="#section-6"
                  className="block py-1 text-blue-600 hover:underline"
                >
                  6. Updates & Changes
                </a>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section 1: Community Leadership */}
        <Card className="mb-8" id="section-1">
          <CardHeader>
            <CardTitle className="text-2xl">1. Community Leadership</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">1.1 Inclusive Play</h3>
              <p className="mb-3">
                <strong>Requirement:</strong> Keep chats and boards free from
                harassment, hate speech, or discrimination.
              </p>
              <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                <p className="font-medium mb-2">
                  Examples of prohibited behavior:
                </p>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Racial, ethnic, religious, or gender-based slurs</li>
                  <li>
                    Hate symbols or imagery in usernames, avatars, or board
                    themes
                  </li>
                  <li>Political campaigning or divisive political content</li>
                  <li>Targeted harassment based on personal characteristics</li>
                  <li>Bullying or intimidation tactics</li>
                </ul>
                <p className="font-medium mt-3 mb-2">Acceptable actions:</p>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Immediately remove offensive content</li>
                  <li>Issue warnings to violating players</li>
                  <li>Escalate repeat offenders to platform staff</li>
                  <li>Create welcoming board descriptions and rules</li>
                </ul>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">
                1.2 Fair Officiating
              </h3>
              <p className="mb-3">
                <strong>Requirement:</strong> Apply game rules consistently with
                no preferential treatment.
              </p>
              <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                <p className="font-medium mb-2">Best practices:</p>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Clearly state board rules before game starts</li>
                  <li>
                    Apply the same rules to friends, family, and strangers
                  </li>
                  <li>Document rule decisions for consistency</li>
                  <li>Explain reasoning when players question decisions</li>
                  <li>Never modify rules mid-game for personal benefit</li>
                </ul>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">
                1.3 Conflict Resolution
              </h3>
              <p className="mb-3">
                <strong>Requirement:</strong> Handle disputes promptly and
                impartially; escalate to Coach B if unresolved.
              </p>
              <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                <p className="font-medium mb-2">Escalation process:</p>
                <ol className="list-decimal list-inside space-y-1 text-sm">
                  <li>Listen to all parties involved</li>
                  <li>Review platform rules and board-specific rules</li>
                  <li>Make a fair decision based on evidence</li>
                  <li>Document the dispute and resolution</li>
                  <li>
                    If parties remain unsatisfied, escalate to Coach B within 24
                    hours
                  </li>
                </ol>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">
                1.4 Age & Jurisdiction Compliance
              </h3>
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                <ul className="list-disc list-inside space-y-1 text-sm text-blue-700 dark:text-blue-300">
                  <li>
                    The onboarding smart-contract automatically blocks wallets
                    from OFAC-sanctioned regions and enforces age gating where
                    required
                  </li>
                  <li>
                    <strong>
                      CBLs never collect IDs or store personal data
                    </strong>
                  </li>
                  <li>
                    If you suspect a user is evading these checks, report the
                    wallet via the in-app <strong>Report</strong> button
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section 2: Communication Standards */}
        <Card className="mb-8" id="section-2">
          <CardHeader>
            <CardTitle className="text-2xl">
              2. Communication Standards
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">
                2.1 Respectful Language
              </h3>
              <p className="mb-3">
                <strong>Requirement:</strong> Use respectful language at all
                times.
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                  <p className="font-medium mb-2 text-green-800 dark:text-green-200">
                    ✓ Good Examples:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-sm text-green-700 dark:text-green-300">
                    <li>"Thanks for joining the board!"</li>
                    <li>"Let me clarify that rule for you"</li>
                    <li>"I understand your concern"</li>
                    <li>"Please keep comments game-related"</li>
                  </ul>
                </div>
                <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
                  <p className="font-medium mb-2 text-red-800 dark:text-red-200">
                    ✗ Avoid:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-sm text-red-700 dark:text-red-300">
                    <li>Profanity or vulgar language</li>
                    <li>Personal attacks or insults</li>
                    <li>Aggressive or threatening tone</li>
                    <li>Dismissive responses to concerns</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">2.2 No Spam</h3>
              <p className="mb-3">
                <strong>Requirement:</strong> Avoid mass unsolicited DMs or
                external ad blasts.
              </p>
              <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                <p className="font-medium mb-2">Prohibited activities:</p>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Mass DMs to recruit players from other boards</li>
                  <li>Posting identical messages across multiple boards</li>
                  <li>Promoting non-platform gambling or games</li>
                  <li>Sharing referral codes for external services</li>
                </ul>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">
                2.3 Brand Integrity
              </h3>
              <p className="mb-3">
                <strong>Requirement:</strong> Follow the Platform Branding Guide
                for any public promotion.
              </p>
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                <p className="font-medium mb-2 text-blue-800 dark:text-blue-200">
                  When promoting your boards:
                </p>
                <ul className="list-disc list-inside space-y-1 text-sm text-blue-700 dark:text-blue-300">
                  <li>Use official platform logos and colors</li>
                  <li>Include proper platform attribution</li>
                  <li>Avoid claiming official partnership unless authorized</li>
                  <li>Request approval for large marketing campaigns</li>
                </ul>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">2.4 Timely Replies</h3>
              <p className="mb-3">
                <strong>Requirement:</strong> Respond to platform staff and
                player inquiries within <strong>24 hours</strong> (security
                reports: immediately).
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Section 3: Funds, Security & Compliance */}
        <Card className="mb-8" id="section-3">
          <CardHeader>
            <CardTitle className="text-2xl">
              3. Funds, Security & Compliance (Trustless Model)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800 mb-6">
              <p className="text-green-800 dark:text-green-200 font-medium">
                <strong>Good news:</strong> All money movement is handled by our
                audited smart contracts. As a CBL you{' '}
                <em>never custody player funds</em>.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">
                3.1 On-Chain Escrow (Platform-Controlled)
              </h3>
              <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>
                    All entry fees and prizes flow through the Football Squares
                    escrow contract
                  </li>
                  <li>
                    Do <strong>not</strong> accept or request off-platform
                    payments
                  </li>
                  <li>
                    If a player offers a side-payment, refuse and report to
                    Support
                  </li>
                </ul>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">
                3.2 Automatic Payouts
              </h3>
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                <ul className="list-disc list-inside space-y-1 text-sm text-blue-700 dark:text-blue-300">
                  <li>
                    Prizes are released automatically when the contract receives
                    final game scores from the oracle
                  </li>
                  <li>
                    Payouts are auto-scheduled for all winners 5+ minutes after
                    the official End of Game; remind your players to allow
                    additional time for blockchain settlement
                  </li>
                  <li>
                    If the oracle or payout fails, open a support ticket—no
                    manual action required by you
                  </li>
                </ul>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">
                3.3 Compliance & Sanction Screening
              </h3>
              <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>
                    The platform blocks sanctioned wallets at the RPC layer
                  </li>
                  <li>You're not expected to perform AML/KYC checks</li>
                  <li>
                    Do <em>not</em> encourage VPN work-arounds or knowingly
                    onboard restricted users
                  </li>
                </ul>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">
                3.4 Security Best Practices
              </h3>
              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
                <ul className="list-disc list-inside space-y-1 text-sm text-yellow-700 dark:text-yellow-300">
                  <li>
                    Keep your wallet keys secure; never share private keys
                  </li>
                  <li>
                    Report suspicious behaviour or contract anomalies via{' '}
                    <strong>Report</strong>
                  </li>
                  <li>
                    Do not request personal information beyond wallet addresses;
                    never store player PII off-chain
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-blue-800 dark:text-blue-200 font-medium">
                <strong>Key takeaway:</strong> Focus on building your community
                and enforcing fair play—the smart contract handles the money and
                the lawyers handle compliance.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Section 4: Platform Integrity */}
        <Card className="mb-8" id="section-4">
          <CardHeader>
            <CardTitle className="text-2xl">4. Platform Integrity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">
                4.1 Proper Feature Use
              </h3>
              <p className="mb-3">
                <strong>Requirement:</strong> Do not scrape, reverse-engineer,
                or exploit bugs.
              </p>
              <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                <p className="font-medium mb-2">Prohibited activities:</p>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Automated data scraping or API abuse</li>
                  <li>Reverse engineering platform code</li>
                  <li>Exploiting bugs for personal gain</li>
                  <li>Creating multiple accounts to circumvent limits</li>
                  <li>Using bots or automated tools</li>
                </ul>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">4.2 Bug Disclosure</h3>
              <p className="mb-3">
                <strong>Requirement:</strong> Report vulnerabilities to
                developers within 24 hours.
              </p>
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                <p className="font-medium mb-2 text-green-800 dark:text-green-200">
                  Responsible disclosure:
                </p>
                <ol className="list-decimal list-inside space-y-1 text-sm text-green-700 dark:text-green-300">
                  <li>Document the bug with screenshots/steps</li>
                  <li>Report to security@platform.com immediately</li>
                  <li>Do not exploit or share the vulnerability</li>
                  <li>Await confirmation before discussing publicly</li>
                </ol>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">4.3 IP Respect</h3>
              <p className="mb-3">
                <strong>Requirement:</strong> Protect platform logos, code, and
                UI assets.
              </p>
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                <p className="font-medium mb-2 text-blue-800 dark:text-blue-200">
                  Intellectual property rules:
                </p>
                <ul className="list-disc list-inside space-y-1 text-sm text-blue-700 dark:text-blue-300">
                  <li>Use official logos only with permission</li>
                  <li>Do not copy UI elements for competing services</li>
                  <li>Respect copyright on game mechanics and features</li>
                  <li>Credit the platform in external promotions</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section 5: Enforcement & Appeals */}
        <Card className="mb-8" id="section-5">
          <CardHeader>
            <CardTitle className="text-2xl">5. Enforcement & Appeals</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">
                5.1 Violation Tiers
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300 dark:border-gray-600">
                  <thead>
                    <tr className="bg-gray-100 dark:bg-gray-800">
                      <th className="border border-gray-300 dark:border-gray-600 p-3 text-left">
                        Tier
                      </th>
                      <th className="border border-gray-300 dark:border-gray-600 p-3 text-left">
                        Violation Examples
                      </th>
                      <th className="border border-gray-300 dark:border-gray-600 p-3 text-left">
                        Action
                      </th>
                      <th className="border border-gray-300 dark:border-gray-600 p-3 text-left">
                        Appeal Window
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 dark:border-gray-600 p-3">
                        1st Violation
                      </td>
                      <td className="border border-gray-300 dark:border-gray-600 p-3">
                        Minor communication issues, late responses
                      </td>
                      <td className="border border-gray-300 dark:border-gray-600 p-3">
                        Written warning + corrective steps
                      </td>
                      <td className="border border-gray-300 dark:border-gray-600 p-3">
                        48 hours
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 dark:border-gray-600 p-3">
                        2nd Violation
                      </td>
                      <td className="border border-gray-300 dark:border-gray-600 p-3">
                        Repeated policy violations, poor player treatment
                      </td>
                      <td className="border border-gray-300 dark:border-gray-600 p-3">
                        7-day CBL suspension
                      </td>
                      <td className="border border-gray-300 dark:border-gray-600 p-3">
                        48 hours
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 dark:border-gray-600 p-3">
                        Severe or 3rd
                      </td>
                      <td className="border border-gray-300 dark:border-gray-600 p-3">
                        Fraud, harassment, legal violations
                      </td>
                      <td className="border border-gray-300 dark:border-gray-600 p-3">
                        Permanent removal + clawback + ban
                      </td>
                      <td className="border border-gray-300 dark:border-gray-600 p-3">
                        48 hours
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">
                5.2 Appeals Process
              </h3>
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                <p className="font-medium mb-2 text-blue-800 dark:text-blue-200">
                  How to appeal:
                </p>
                <ol className="list-decimal list-inside space-y-1 text-sm text-blue-700 dark:text-blue-300">
                  <li>Submit appeal within 48 hours of violation notice</li>
                  <li>Provide detailed explanation and evidence</li>
                  <li>Coach B reviews all appeals independently</li>
                  <li>Decision is final - no further appeals allowed</li>
                  <li>Response provided within 72 hours of submission</li>
                </ol>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">
                5.3 Financial Clawbacks
              </h3>
              <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
                <p className="text-red-800 dark:text-red-200 mb-2">
                  Clawbacks, when required (e.g., fraud), are enforced by smart
                  contract and may retract leader-rewards.{' '}
                  <strong>No personal repayment is expected.</strong>
                </p>
                <p className="font-medium mb-2 text-red-800 dark:text-red-200">
                  Clawback scenarios:
                </p>
                <ul className="list-disc list-inside space-y-1 text-sm text-red-700 dark:text-red-300">
                  <li>Fraudulent activity or intentional rule violations</li>
                  <li>
                    Repeated policy violations affecting platform integrity
                  </li>
                  <li>Misuse of CBL privileges for personal gain</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section 6: Updates */}
        <Card className="mb-8" id="section-6">
          <CardHeader>
            <CardTitle className="text-2xl">6. Updates & Changes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-3">
                6.1 Notification Process
              </h3>
              <p className="mb-3">
                We may update these guidelines to reflect legal requirements,
                platform changes, or community feedback.
              </p>
              <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                <p className="font-medium mb-2">Notification timeline:</p>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>
                    <strong>Standard updates:</strong> 3 days advance notice via
                    email + in-app alert
                  </li>
                  <li>
                    <strong>Security fixes:</strong> Immediate implementation
                    with same-day notification
                  </li>
                  <li>
                    <strong>Legal compliance:</strong> As required by law or
                    regulation
                  </li>
                </ul>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">6.2 Acceptance</h3>
              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
                <p className="text-yellow-800 dark:text-yellow-200">
                  <strong>Important:</strong> Continued use of CBL privileges
                  after guideline updates constitutes acceptance of the new
                  terms. If you cannot agree to updated guidelines, you must
                  discontinue CBL activities and contact support.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Separator className="my-8" />

        {/* Contact Information */}
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-4">Questions or Concerns?</h3>
          <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <p>
              General inquiries:{' '}
              <span className="text-blue-600">
                Ask OC-Phil right here on this page
              </span>
            </p>
            <p>
              Security issues:{' '}
              <a
                href="mailto:OC-Phil@tutamail.com"
                className="text-blue-600 hover:underline"
              >
                OC-Phil@tutamail.com
              </a>
            </p>
            <p>
              Appeals: Contact Coach B at{' '}
              <a
                href="mailto:Coach-B@tutamail.com"
                className="text-blue-600 hover:underline"
              >
                Coach-B@tutamail.com
              </a>
            </p>
          </div>
        </div>

        {/* Legal Disclaimer */}
        <div className="text-center mt-8 text-xs text-gray-500 dark:text-gray-400">
          <p>
            <em>
              Disclaimer: These guidelines are operational, not legal advice.
              Consult your own counsel for compliance obligations.
            </em>
          </p>
        </div>
      </div>
    </div>
  );
};

export default CBLGuidelinesPage;
