'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const FaqContent = () => {
  return (
    <div className="max-w-5xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      {/* JSON-LD Schema for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: [
              {
                '@type': 'Question',
                name: 'What exactly is a Football Squares board?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'A 10 × 10 grid (100 &apos;squares&apos;). Each axis is numbered 0-9 after a random shuffle, locking in once the board is full. Your square&apos;s row/column numbers must match the last digit of each team&apos;s score at the end of a quarter (or OT) for you to win.',
                },
              },
              {
                '@type': 'Question',
                name: 'How much does one square cost?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Public House boards: $1–$25 per square (default $10). Community boards: creator sets the price ($5–$100). Playoff & SB boards have higher minimums.',
                },
              },
              {
                '@type': 'Question',
                name: 'Do NFTs affect my chance of winning?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'No—your square&apos;s placement is what matters. NFTs are optional flex &amp; collectible flair.',
                },
              },
            ],
          }),
        }}
      />

      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
          Frequently Asked Questions
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Everything you need to know about Football Squares NFTs, gameplay,
          payouts, and more.
        </p>
      </div>

      <Accordion type="single" collapsible className="w-full space-y-6">
        {/* Football Squares – Core Basics */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white flex items-center gap-2">
            🏈 Football Squares – Core Basics
          </h2>

          <AccordionItem
            value="item-1"
            className="border-b border-gray-200 dark:border-gray-700"
          >
            <AccordionTrigger className="text-left hover:text-[#ed5925] transition-colors">
              What exactly is a Football Squares board?
            </AccordionTrigger>
            <AccordionContent className="text-gray-600 dark:text-gray-300 leading-relaxed">
              A 10 × 10 grid (100 "squares"). Each axis is numbered 0-9 after a
              random shuffle, locking in once the board is full. Your
              square&apos;s row/column numbers must match the last digit of each
              team&apos;s score at the end of a quarter (or OT) for you to win.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem
            value="item-2"
            className="border-b border-gray-200 dark:border-gray-700"
          >
            <AccordionTrigger className="text-left hover:text-[#ed5925] transition-colors">
              Why does every board use the "HOME" team first?
            </AccordionTrigger>
            <AccordionContent className="text-gray-600 dark:text-gray-300 leading-relaxed">
              To keep things intuitive: columns always track the
              geographically-listed home team, rows the visitor. No need to
              guess who&apos;s left or top—ever.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem
            value="item-3"
            className="border-b border-gray-200 dark:border-gray-700"
          >
            <AccordionTrigger className="text-left hover:text-[#ed5925] transition-colors">
              Can I play if I don&apos;t follow the home team?
            </AccordionTrigger>
            <AccordionContent className="text-gray-600 dark:text-gray-300 leading-relaxed">
              Sure—grab a <strong>VIP Membership</strong> (see below) and you
              can hop on any House board league-wide.
            </AccordionContent>
          </AccordionItem>
        </div>

        {/* Gameplay & Payouts */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white flex items-center gap-2">
            🎮 Gameplay & Payouts
          </h2>

          <AccordionItem
            value="item-4"
            className="border-b border-gray-200 dark:border-gray-700"
          >
            <AccordionTrigger className="text-left hover:text-[#ed5925] transition-colors">
              How much does one square cost?
            </AccordionTrigger>
            <AccordionContent className="text-gray-600 dark:text-gray-300 leading-relaxed">
              The House boards are from $5–$100 during the regular season, with
              increases during Playoff and Superbowl (based on demand).
              <br />
              Community boards: creator sets the price from $1–$500. CBLs decide
              post-season increases.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem
            value="item-5"
            className="border-b border-gray-200 dark:border-gray-700"
          >
            <AccordionTrigger className="text-left hover:text-[#ed5925] transition-colors">
              How are winnings distributed?
            </AccordionTrigger>
            <AccordionContent className="text-gray-600 dark:text-gray-300 leading-relaxed">
              Payouts are distributed to each period&apos;s winners, 1st Quarter
              15%, 2nd Quarter 25%, 3rd Quarter 15%, 4th Quarter 45% (unless
              Over Time with 50/50 split with 4th Quarter winner). All payouts
              initiate 5 minutes post official game end time, please allow time
              for blockchain verification and finalization.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem
            value="item-6"
            className="border-b border-gray-200 dark:border-gray-700"
          >
            <AccordionTrigger className="text-left hover:text-[#ed5925] transition-colors">
              What happens in overtime?
            </AccordionTrigger>
            <AccordionContent className="text-gray-600 dark:text-gray-300 leading-relaxed">
              If the game goes to OT, the 4th-quarter prize is split 50/50 with
              the final OT score winner(s). Only the final overtime score wins,
              not each OT period.
            </AccordionContent>
          </AccordionItem>
        </div>

        {/* NFT Squares & Levels */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white flex items-center gap-2">
            🖼️ NFT Squares & Levels
          </h2>

          {/* NFT Levels Table */}
          <div className="mb-6 overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300 dark:border-gray-600 text-sm">
              <thead>
                <tr className="bg-gray-100 dark:bg-gray-700">
                  <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left font-semibold">
                    Level
                  </th>
                  <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left font-semibold">
                    Mint Cost
                  </th>
                  <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left font-semibold">
                    Artwork Source
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 font-medium">
                    Custom
                  </td>
                  <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">
                    $3
                  </td>
                  <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">
                    Colored signature overlay
                  </td>
                </tr>
                <tr className="bg-gray-50 dark:bg-gray-900">
                  <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 font-medium">
                    Unique
                  </td>
                  <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">
                    $7
                  </td>
                  <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">
                    House-generated image
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 font-medium">
                    Premium
                  </td>
                  <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">
                    $14
                  </td>
                  <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">
                    User-generated or user-uploaded image
                  </td>
                </tr>
                <tr className="bg-gray-50 dark:bg-gray-900">
                  <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 font-medium">
                    Rare
                  </td>
                  <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">
                    $21
                  </td>
                  <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">
                    Animated image from generation or upload
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <AccordionItem
            value="item-7"
            className="border-b border-gray-200 dark:border-gray-700"
          >
            <AccordionTrigger className="text-left hover:text-[#ed5925] transition-colors">
              Do NFTs affect my chance of winning?
            </AccordionTrigger>
            <AccordionContent className="text-gray-600 dark:text-gray-300 leading-relaxed">
              No—your square&apos;s placement is what matters. NFTs are optional
              flex & collectible flair.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem
            value="item-8"
            className="border-b border-gray-200 dark:border-gray-700"
          >
            <AccordionTrigger className="text-left hover:text-[#ed5925] transition-colors">
              Can I upgrade later?
            </AccordionTrigger>
            <AccordionContent className="text-gray-600 dark:text-gray-300 leading-relaxed">
              Yes — each NFT tier is a separate, stand-alone purchase. You can
              hold multiple tiers at once. Simply mint the NFT you want when
              you&apos;re ready. You can place various NFT markers on different
              boards you're playing.
            </AccordionContent>
          </AccordionItem>
        </div>

        {/* Community Board Leaders (CBLs) */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white flex items-center gap-2">
            👥 Community Board Leaders (CBLs)
          </h2>

          {/* Move operate board to first */}
          <AccordionItem
            value="item-operate-board"
            className="border-b border-gray-200 dark:border-gray-700"
            id="operate-board"
          >
            <AccordionTrigger className="text-left hover:text-[#ed5925] transition-colors">
              How do I operate my own board?
            </AccordionTrigger>
            <AccordionContent className="text-gray-600 dark:text-gray-300 leading-relaxed">
              To operate your own board, apply to become a{' '}
              <strong>Community Board Leader (CBL)</strong>:
              <br />• Pay a one-time $9.99 season fee (refundable via milestone
              achievements).
              <br />• Unlock custom board creation, skins, and a path to revenue
              share and perks.
              <br />• Get trained and supported by our on-site assistant{' '}
              <strong>Offensive Coordinator Phil (OC-Phil)</strong>.
              <br />• Manage board pricing, rules, and player engagement.
              <br />
              <a
                href="/cbl/overview"
                className="text-[#ed5925] hover:text-[#d14513] font-medium inline-flex items-center gap-1 mt-2"
              >
                Learn more ➜
              </a>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem
            value="item-9"
            className="border-b border-gray-200 dark:border-gray-700"
          >
            <AccordionTrigger className="text-left hover:text-[#ed5925] transition-colors">
              Who can become a CBL?
            </AccordionTrigger>
            <AccordionContent className="text-gray-600 dark:text-gray-300 leading-relaxed">
              Any verified user who pays a one-time $9.99 origination fee
              (refundable via milestones).
            </AccordionContent>
          </AccordionItem>

          <AccordionItem
            value="item-cbl-levels"
            className="border-b border-gray-200 dark:border-gray-700"
          >
            <AccordionTrigger className="text-left hover:text-[#ed5925] transition-colors">
              What are the Levels of CBL?
            </AccordionTrigger>
            <AccordionContent className="text-gray-600 dark:text-gray-300 leading-relaxed">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300 dark:border-gray-600 text-sm mb-4">
                  <thead>
                    <tr className="bg-gray-100 dark:bg-gray-700">
                      <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left font-semibold">
                        Level
                      </th>
                      <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left font-semibold">
                        How to Reach
                      </th>
                      <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left font-semibold">
                        Active Perks
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 font-medium">
                        First Stream CBL
                      </td>
                      <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">
                        Register + pass quick rules quiz
                      </td>
                      <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">
                        Board skins, custom rules, dashboard
                      </td>
                    </tr>
                    <tr className="bg-gray-50 dark:bg-gray-900">
                      <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 font-medium">
                        Drive Maker CBL
                      </td>
                      <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">
                        Fill 3 boards in any 7‑day window (each $7+ squares)
                      </td>
                      <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">
                        3 % rake share • Blue‑Point accrual
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 font-medium">
                        Franchise CBL
                      </td>
                      <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">
                        50 filled boards in season OR 4 000 squares sold
                      </td>
                      <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">
                        3 % rake + 1.5× Blue‑Point multiplier • merch •
                        Hall‑of‑Fame listing
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem
            value="item-10"
            className="border-b border-gray-200 dark:border-gray-700"
          >
            <AccordionTrigger className="text-left hover:text-[#ed5925] transition-colors">
              What do I earn as a CBL?
            </AccordionTrigger>
            <AccordionContent className="text-gray-600 dark:text-gray-300 leading-relaxed">
              As a CBL, your earnings and perks depend on your level:
              <br />
              <br />
              <strong>First Stream CBL</strong>: Skins, dashboard, custom
              boards.
              <br />
              <strong>Drive Maker CBL</strong>: 3% rake on boards, Blue Points
              accrual.
              <br />
              <strong>Franchise CBL</strong>: Additional 1.5× multiplier on CBL
              Blue Points, merch, Future development mastermind.
              <br />
              <br />
              <strong>Blue Points</strong> are earned for board activity and can
              be redeemed for NFTs and, in the future, token airdrops.
              <br />
              <strong>30%</strong> commission on all NFTs minted on your boards.
              <br />
              Status lasts for the current NFL season.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem
            value="item-11"
            className="border-b border-gray-200 dark:border-gray-700"
          >
            <AccordionTrigger className="text-left hover:text-[#ed5925] transition-colors">
              Board limits for CBLs?
            </AccordionTrigger>
            <AccordionContent className="text-gray-600 dark:text-gray-300 leading-relaxed">
              <strong>First Stream CBL</strong>: Regular season price cap
              $1–$100, Playoffs up to $200, Super Bowl $300.
              <br />
              <strong>Drive Maker CBL</strong>: Regular season $1–$250, Playoffs
              up to $400, Super Bowl $500.
              <br />
              <strong>Franchise CBL</strong>: Regular season $1–$500, Playoffs
              up to $1,000, Super Bowl no limit.
              <br />
              Board creation and pricing limits scale with your CBL level.
              <br />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem
            value="item-12"
            className="border-b border-gray-200 dark:border-gray-700"
          >
            <AccordionTrigger className="text-left hover:text-[#ed5925] transition-colors">
              How do I earn back the $9.99 fee?
            </AccordionTrigger>
            <AccordionContent className="text-gray-600 dark:text-gray-300 leading-relaxed">
              Fill 9 boards, or see 9 NFT mints, or fill one $50+ SB
              board—whichever comes first.
            </AccordionContent>
          </AccordionItem>
        </div>

        {/* Rewards System */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white flex items-center gap-2">
            🎁 Rewards System
          </h2>

          <AccordionItem
            value="item-rewards"
            className="border-b border-gray-200 dark:border-gray-700"
          >
            <AccordionTrigger className="text-left hover:text-[#ed5925] transition-colors">
              What are the different types of rewards?
            </AccordionTrigger>
            <AccordionContent className="text-gray-600 dark:text-gray-300 leading-relaxed">
              We have three types of reward points:
              <br />
              <br />
              <strong>Blue Points</strong>: Earned through gameplay
              participation. Higher board prices earn more points (100-2,000+
              per square).
              <br />
              <strong>Orange Points</strong>: Earned through social activities
              like referrals, social sharing, and community engagement (2-100+
              points per activity).
              <br />
              <strong>Green Points</strong>: Seasonal competition points
              displayed on public leaderboards.
              <br />
              <br />
              Blue and Orange Points can be redeemed for NFTs, exclusive perks,
              and future token airdrops. VIP members earn 1.5× Blue Points on
              all activities.
              <br />
              <a
                href="/rewards"
                className="text-[#ed5925] hover:text-[#d14513] font-medium inline-flex items-center gap-1 mt-2"
              >
                View full rewards system ➜
              </a>
            </AccordionContent>
          </AccordionItem>
        </div>

        {/* VIP Membership */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white flex items-center gap-2">
            👑 VIP Membership
          </h2>

          <AccordionItem
            value="item-13"
            className="border-b border-gray-200 dark:border-gray-700"
          >
            <AccordionTrigger className="text-left hover:text-[#ed5925] transition-colors">
              Why go VIP?
            </AccordionTrigger>
            <AccordionContent className="text-gray-600 dark:text-gray-300 leading-relaxed">
              • Play on <strong>any</strong> House board (not just your region).
              <br />
              • 5% bonus on winning squares where entry ≥ $25.
              <br />• 1 free <strong>Premium</strong> NFT mint.
              <br />
              • Early-bird square selection windows.
              <br />• Surprise free-square drops.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem
            value="item-14"
            className="border-b border-gray-200 dark:border-gray-700"
          >
            <AccordionTrigger className="text-left hover:text-[#ed5925] transition-colors">
              Cost & duration?
            </AccordionTrigger>
            <AccordionContent className="text-gray-600 dark:text-gray-300 leading-relaxed">
              $97 for the season (intro price; regular $299).
            </AccordionContent>
          </AccordionItem>
        </div>

        {/* Payments, Rake & Security */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white flex items-center gap-2">
            💸 Payments
          </h2>

          <AccordionItem
            value="item-15"
            className="border-b border-gray-200 dark:border-gray-700"
          >
            <AccordionTrigger className="text-left hover:text-[#ed5925] transition-colors">
              What payment methods do you accept?
            </AccordionTrigger>
            <AccordionContent className="text-gray-600 dark:text-gray-300 leading-relaxed">
              We accept major crypto coins and selected stablecoins.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem
            value="item-17"
            className="border-b border-gray-200 dark:border-gray-700"
          >
            <AccordionTrigger className="text-left hover:text-[#ed5925] transition-colors">
              How are funds held?
            </AccordionTrigger>
            <AccordionContent className="text-gray-600 dark:text-gray-300 leading-relaxed">
              Escrow smart contract. 5 minutes after official game end, winnings
              will auto-disburse to winners&apos; wallets, just allow time for
              blockchain transactions to verify and finalize.
            </AccordionContent>
          </AccordionItem>
        </div>

        {/* Fairness & Randomisation */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white flex items-center gap-2">
            🔐 Fairness & Randomisation
          </h2>

          <AccordionItem
            value="item-18"
            className="border-b border-gray-200 dark:border-gray-700"
          >
            <AccordionTrigger className="text-left hover:text-[#ed5925] transition-colors">
              Who shuffles the numbers?
            </AccordionTrigger>
            <AccordionContent className="text-gray-600 dark:text-gray-300 leading-relaxed">
              A verifiable on-chain random function triggers once the board is
              full. Transaction hash is public—anyone can audit.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem
            value="item-19"
            className="border-b border-gray-200 dark:border-gray-700"
          >
            <AccordionTrigger className="text-left hover:text-[#ed5925] transition-colors">
              Can the House see numbers early?
            </AccordionTrigger>
            <AccordionContent className="text-gray-600 dark:text-gray-300 leading-relaxed">
              No. The shuffle seed isn&apos;t known until block confirmation;
              even our devs can&apos;t peek.
            </AccordionContent>
          </AccordionItem>
        </div>

        {/* Tech & Wallets */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white flex items-center gap-2">
            🛠️ Tech & Wallets
          </h2>

          <AccordionItem
            value="item-20"
            className="border-b border-gray-200 dark:border-gray-700"
          >
            <AccordionTrigger className="text-left hover:text-[#ed5925] transition-colors">
              Do I need a crypto wallet?
            </AccordionTrigger>
            <AccordionContent className="text-gray-600 dark:text-gray-300 leading-relaxed">
              Yes, to play, mint NFTs, or earn points, connect the Phantom or
              any wallet option that appears when you click on &apos;Connect
              Wallet&apos;. No wallet is required to browse the site.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem
            value="item-21"
            className="border-b border-gray-200 dark:border-gray-700"
          >
            <AccordionTrigger className="text-left hover:text-[#ed5925] transition-colors">
              Gas fees?
            </AccordionTrigger>
            <AccordionContent className="text-gray-600 dark:text-gray-300 leading-relaxed">
              A small gas fee for board square purchaes will appear in your
              wallet before you sign and verify the transaction. We chose Solana
              because it has the most minimal gas fees of all blockchains. Each
              minting of NFTs and board square purchase will incur a negilble
              gas fee.
            </AccordionContent>
          </AccordionItem>
        </div>

        {/* Troubleshooting & Support */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white flex items-center gap-2">
            🧩 Troubleshooting & Support
          </h2>

          <AccordionItem
            value="item-27"
            className="border-b border-gray-200 dark:border-gray-700"
          >
            <AccordionTrigger className="text-left hover:text-[#ed5925] transition-colors">
              I bought a square but it shows "pending."
            </AccordionTrigger>
            <AccordionContent className="text-gray-600 dark:text-gray-300 leading-relaxed">
              The board isn&apos;t full yet. Once all 100 squares are claimed,
              the random number lock-in happens and you&apos;ll see your digits.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem
            value="item-28"
            className="border-b border-gray-200 dark:border-gray-700"
          >
            <AccordionTrigger className="text-left hover:text-[#ed5925] transition-colors">
              I can&apos;t mint—what gives?
            </AccordionTrigger>
            <AccordionContent className="text-gray-600 dark:text-gray-300 leading-relaxed">
              Ensure your Solana wallet has sufficient funds for the mint. If
              you&apos;re experiencing issues, ask Coach B for immediate
              resolution.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem
            value="item-29"
            className="border-b border-gray-200 dark:border-gray-700"
          >
            <AccordionTrigger className="text-left hover:text-[#ed5925] transition-colors">
              Refund policy?
            </AccordionTrigger>
            <AccordionContent className="text-gray-600 dark:text-gray-300 leading-relaxed">
              All sales are final. The only exception: if a board does not fill
              before the deadline, all purchased squares will automatically
              refund in-kind to the original purchase wallet.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem
            value="item-30"
            className="border-b border-gray-200 dark:border-gray-700"
          >
            <AccordionTrigger className="text-left hover:text-[#ed5925] transition-colors">
              How do I contact support?
            </AccordionTrigger>
            <AccordionContent className="text-gray-600 dark:text-gray-300 leading-relaxed">
              Get instant help from Coach B, our AI support specialist,
              available 24/7 through the chat feature on any page. For complex
              blockchain issues, Coach B will seamlessly connect you with Doc
              Patch, our technical specialist, all within the same
              conversation—no tickets, no delays.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem
            value="item-31"
            className="border-b border-gray-200 dark:border-gray-700"
          >
            <AccordionTrigger className="text-left hover:text-[#ed5925] transition-colors">
              Are there age restrictions?
            </AccordionTrigger>
            <AccordionContent className="text-gray-600 dark:text-gray-300 leading-relaxed">
              You must be 18 years or older to participate in paid squares
              games. Free games and educational content are available to all
              ages.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem
            value="item-32"
            className="border-b border-gray-200 dark:border-gray-700"
          >
            <AccordionTrigger className="text-left hover:text-[#ed5925] transition-colors">
              What happens if a game is postponed or cancelled?
            </AccordionTrigger>
            <AccordionContent className="text-gray-600 dark:text-gray-300 leading-relaxed">
              If an NFL game is postponed, the squares board remains active
              until the rescheduled game. If a game is permanently cancelled
              (extremely rare), all participants receive full refunds
              automatically.
            </AccordionContent>
          </AccordionItem>
        </div>

        {/* Additional Game Strategy Questions */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white flex items-center gap-2">
            🎯 Strategy & Tips
          </h2>

          <AccordionItem
            value="item-33"
            className="border-b border-gray-200 dark:border-gray-700"
          >
            <AccordionTrigger className="text-left hover:text-[#ed5925] transition-colors">
              Are some numbers "better" to have?
            </AccordionTrigger>
            <AccordionContent className="text-gray-600 dark:text-gray-300 leading-relaxed">
              Statistically, pairs that include 0, 3, or 7 show up most often
              because field goals are worth 3 points and touchdowns (with the
              extra point) total 7. Still, numbers are assigned completely at
              random, so every square— even those "unfavorable" digits— can come
              through on any given Sunday, Thursday night, or Monday Night
              matchup. Want to tilt the odds a bit further in your favor? Grab
              additional squares or join our season-long and half-season boards,
              where more games mean more opportunities for your numbers to hit.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem
            value="item-34"
            className="border-b border-gray-200 dark:border-gray-700"
          >
            <AccordionTrigger className="text-left hover:text-[#ed5925] transition-colors">
              Can I buy multiple squares on the same board?
            </AccordionTrigger>
            <AccordionContent className="text-gray-600 dark:text-gray-300 leading-relaxed">
              You can buy up to 5 squares on any House board or Free Game. For
              Community boards, CBLs can set the limit up to 10 squares per
              wallet. With each purchase, you increase your odds and chances of
              winning!
            </AccordionContent>
          </AccordionItem>

          <AccordionItem
            value="item-35"
            className="border-b border-gray-200 dark:border-gray-700"
          >
            <AccordionTrigger className="text-left hover:text-[#ed5925] transition-colors">
              How do I know if my square won?
            </AccordionTrigger>
            <AccordionContent className="text-gray-600 dark:text-gray-300 leading-relaxed">
              Winners are automatically determined at the end of each quarter.
              You&apos;ll receive an email notification and see the win
              reflected in your dashboard. You can also check your wallet 5-30
              minutes after the official end of game, payouts are processed
              automatically via smart contract straight to your wallet.
            </AccordionContent>
          </AccordionItem>
        </div>
      </Accordion>

      {/* Contact CTA */}
      <div className="mt-12 text-center bg-gradient-to-r from-[#002244] to-[#004953] rounded-lg p-8 text-white">
        <h3 className="text-2xl font-bold mb-4">Still Have Questions?</h3>
        <p className="text-lg mb-6 opacity-90">
          Our support team is here to help you get the most out of your Football
          Squares experience.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="mailto:support@footballsquares.com"
            className="bg-[#ed5925] hover:bg-[#d14513] text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
          >
            Email Support
          </a>
          <a
            href="#"
            className="bg-white dark:bg-white text-[#002244] dark:text-[#002244] hover:bg-gray-100 dark:hover:bg-gray-200 px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
          >
            Live Chat
          </a>
        </div>
      </div>
    </div>
  );
};

export default FaqContent;
