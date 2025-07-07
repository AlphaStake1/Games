"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FaqContent = () => {
  return (
    <div className="max-w-5xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      {/* JSON-LD Schema for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "What exactly is a Football Squares board?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "A 10 × 10 grid (100 'squares'). Each axis is numbered 0-9 after a random shuffle, locking in once the board is full. Your square's row/column numbers must match the last digit of each team's score at the end of a quarter (or OT) for you to win."
                }
              },
              {
                "@type": "Question",
                "name": "How much does one square cost?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Public House boards: $1–$25 per square (default $10). Community boards: creator sets the price ($5–$100). Playoff & SB boards have higher minimums."
                }
              },
              {
                "@type": "Question",
                "name": "Do NFTs affect my chance of winning?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "No—your square's placement is what matters. NFTs are optional flex & collectible flair."
                }
              }
            ]
          })
        }}
      />

      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
          Frequently Asked Questions
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Everything you need to know about Football Squares NFTs, gameplay, payouts, and more.
        </p>
      </div>

      <Accordion type="single" collapsible className="w-full space-y-6">
        {/* Football Squares – Core Basics */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white flex items-center gap-2">
            🏈 Football Squares – Core Basics
          </h2>
          
          <AccordionItem value="item-1" className="border-b border-gray-200 dark:border-gray-700">
            <AccordionTrigger className="text-left hover:text-[#ed5925] transition-colors">
              What exactly is a Football Squares board?
            </AccordionTrigger>
            <AccordionContent className="text-gray-600 dark:text-gray-300 leading-relaxed">
              A 10 × 10 grid (100 "squares"). Each axis is numbered 0-9 after a
              random shuffle, locking in once the board is full. Your square's
              row/column numbers must match the last digit of each team's score
              at the end of a quarter (or OT) for you to win.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2" className="border-b border-gray-200 dark:border-gray-700">
            <AccordionTrigger className="text-left hover:text-[#ed5925] transition-colors">
              Why does every board use the "HOME" team first?
            </AccordionTrigger>
            <AccordionContent className="text-gray-600 dark:text-gray-300 leading-relaxed">
              To keep things intuitive: columns always track the
              geographically-listed home team, rows the visitor. No need to
              guess who's left or top—ever.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-3" className="border-b border-gray-200 dark:border-gray-700">
            <AccordionTrigger className="text-left hover:text-[#ed5925] transition-colors">
              Can I play if I don't follow the home team?
            </AccordionTrigger>
            <AccordionContent className="text-gray-600 dark:text-gray-300 leading-relaxed">
              Sure—grab a <strong>VIP Membership</strong> (see below) and you can hop on any
              House board league-wide.
            </AccordionContent>
          </AccordionItem>
        </div>

        {/* Gameplay & Payouts */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white flex items-center gap-2">
            🎮 Gameplay & Payouts
          </h2>

          <AccordionItem value="item-4" className="border-b border-gray-200 dark:border-gray-700">
            <AccordionTrigger className="text-left hover:text-[#ed5925] transition-colors">
              How much does one square cost?
            </AccordionTrigger>
            <AccordionContent className="text-gray-600 dark:text-gray-300 leading-relaxed">
              • Public House boards: $1–$25 per square (default $10).<br />
              • Community boards: creator sets the price ($5–$100).<br />
              • Playoff & SB boards have higher minimums (see Community section).
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-5" className="border-b border-gray-200 dark:border-gray-700">
            <AccordionTrigger className="text-left hover:text-[#ed5925] transition-colors">
              How are winnings distributed?
            </AccordionTrigger>
            <AccordionContent className="text-gray-600 dark:text-gray-300 leading-relaxed">
              95% of the pot pays out; 5% is the platform rake. Payout
              schedule: 1st Q 20%, 2nd Q 20%, 3rd Q 20%, 4th Q + OT 40% (split
              rules below).
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-6" className="border-b border-gray-200 dark:border-gray-700">
            <AccordionTrigger className="text-left hover:text-[#ed5925] transition-colors">
              What happens in overtime?
            </AccordionTrigger>
            <AccordionContent className="text-gray-600 dark:text-gray-300 leading-relaxed">
              If the game goes to OT, the 4th-quarter prize is split 50/50 with
              the final OT score winner(s).
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
                  <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left font-semibold">Level</th>
                  <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left font-semibold">Mint Cost</th>
                  <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left font-semibold">Artwork Source</th>
                  <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left font-semibold">Perk</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 font-medium">Custom</td>
                  <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">$3</td>
                  <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">Colored signature overlay</td>
                  <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">Entry-level bragging rights</td>
                </tr>
                <tr className="bg-gray-50 dark:bg-gray-900">
                  <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 font-medium">Unique</td>
                  <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">$7</td>
                  <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">House-generated image</td>
                  <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">Auto-enter monthly art raffle</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 font-medium">Premium</td>
                  <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">$14</td>
                  <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">User-uploaded image</td>
                  <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">1-click social share + rarity badge</td>
                </tr>
                <tr className="bg-gray-50 dark:bg-gray-900">
                  <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 font-medium">Rare</td>
                  <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">$21</td>
                  <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">Animated user upload</td>
                  <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">Spotlight in Hall-of-Fame gallery</td>
                </tr>
              </tbody>
            </table>
          </div>

          <AccordionItem value="item-7" className="border-b border-gray-200 dark:border-gray-700">
            <AccordionTrigger className="text-left hover:text-[#ed5925] transition-colors">
              Do NFTs affect my chance of winning?
            </AccordionTrigger>
            <AccordionContent className="text-gray-600 dark:text-gray-300 leading-relaxed">
              No—your square's placement is what matters. NFTs are optional flex
              & collectible flair.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-8" className="border-b border-gray-200 dark:border-gray-700">
            <AccordionTrigger className="text-left hover:text-[#ed5925] transition-colors">
              Can I upgrade later?
            </AccordionTrigger>
            <AccordionContent className="text-gray-600 dark:text-gray-300 leading-relaxed">
              Yes. Pay the price difference, burn the old token, mint the new
              level.
            </AccordionContent>
          </AccordionItem>
        </div>

        {/* Community Board Leaders (CBLs) */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white flex items-center gap-2">
            👥 Community Board Leaders (CBLs)
          </h2>

          <AccordionItem value="item-9" className="border-b border-gray-200 dark:border-gray-700">
            <AccordionTrigger className="text-left hover:text-[#ed5925] transition-colors">
              Who can become a CBL?
            </AccordionTrigger>
            <AccordionContent className="text-gray-600 dark:text-gray-300 leading-relaxed">
              Any verified user who pays a one-time $9.99 origination fee
              (refundable via milestones).
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-10" className="border-b border-gray-200 dark:border-gray-700">
            <AccordionTrigger className="text-left hover:text-[#ed5925] transition-colors">
              What do I earn as a CBL?
            </AccordionTrigger>
            <AccordionContent className="text-gray-600 dark:text-gray-300 leading-relaxed">
              • <strong>3%</strong> of every fully-sold board you host (2% goes to the House).<br />
              • <strong>30%</strong> of all NFTs minted on your boards.<br />
              • Status lasts the current NFL season.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-11" className="border-b border-gray-200 dark:border-gray-700">
            <AccordionTrigger className="text-left hover:text-[#ed5925] transition-colors">
              Board limits for CBLs?
            </AccordionTrigger>
            <AccordionContent className="text-gray-600 dark:text-gray-300 leading-relaxed">
              • Regular season: price $5–$100 / square, unlimited weekly boards + Bye-Week boards.<br />
              • Playoffs: 1 board per round, $25 / square minimum.<br />
              • Super Bowl: 1 board, $50 / square minimum.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-12" className="border-b border-gray-200 dark:border-gray-700">
            <AccordionTrigger className="text-left hover:text-[#ed5925] transition-colors">
              How do I earn back the $9.99 fee?
            </AccordionTrigger>
            <AccordionContent className="text-gray-600 dark:text-gray-300 leading-relaxed">
              Fill 9 boards, or see 9 NFT mints, or fill one $50+ SB
              board—whichever comes first.
            </AccordionContent>
          </AccordionItem>
        </div>

        {/* VIP Membership */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white flex items-center gap-2">
            👑 VIP Membership
          </h2>

          <AccordionItem value="item-13" className="border-b border-gray-200 dark:border-gray-700">
            <AccordionTrigger className="text-left hover:text-[#ed5925] transition-colors">
              Why go VIP?
            </AccordionTrigger>
            <AccordionContent className="text-gray-600 dark:text-gray-300 leading-relaxed">
              • Play on <strong>any</strong> House board (not just your region).<br />
              • 5% bonus on winning squares where entry ≥ $25.<br />
              • 1 free <strong>Premium</strong> NFT mint.<br />
              • Early-bird square selection windows.<br />
              • Surprise free-square drops.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-14" className="border-b border-gray-200 dark:border-gray-700">
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
            💸 Payments, Rake & Security
          </h2>

          <AccordionItem value="item-15" className="border-b border-gray-200 dark:border-gray-700">
            <AccordionTrigger className="text-left hover:text-[#ed5925] transition-colors">
              What payment methods do you accept?
            </AccordionTrigger>
            <AccordionContent className="text-gray-600 dark:text-gray-300 leading-relaxed">
              Credit/debit, major wallets, and selected stablecoins.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-16" className="border-b border-gray-200 dark:border-gray-700">
            <AccordionTrigger className="text-left hover:text-[#ed5925] transition-colors">
              Is the 5% rake negotiable?
            </AccordionTrigger>
            <AccordionContent className="text-gray-600 dark:text-gray-300 leading-relaxed">
              House boards are fixed at 5%. CBL boards share 2% with the House,
              effectively leaving 3% to the CBL.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-17" className="border-b border-gray-200 dark:border-gray-700">
            <AccordionTrigger className="text-left hover:text-[#ed5925] transition-colors">
              How are funds held?
            </AccordionTrigger>
            <AccordionContent className="text-gray-600 dark:text-gray-300 leading-relaxed">
              Escrow smart contract. Immediately after each quarter, winnings
              auto-disburse to connected wallets.
            </AccordionContent>
          </AccordionItem>
        </div>

        {/* Fairness & Randomisation */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white flex items-center gap-2">
            🔐 Fairness & Randomisation
          </h2>

          <AccordionItem value="item-18" className="border-b border-gray-200 dark:border-gray-700">
            <AccordionTrigger className="text-left hover:text-[#ed5925] transition-colors">
              Who shuffles the numbers?
            </AccordionTrigger>
            <AccordionContent className="text-gray-600 dark:text-gray-300 leading-relaxed">
              A verifiable on-chain random function triggers once the board is
              full. Transaction hash is public—anyone can audit.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-19" className="border-b border-gray-200 dark:border-gray-700">
            <AccordionTrigger className="text-left hover:text-[#ed5925] transition-colors">
              Can the House see numbers early?
            </AccordionTrigger>
            <AccordionContent className="text-gray-600 dark:text-gray-300 leading-relaxed">
              No. The shuffle seed isn't known until block confirmation; even
              our devs can't peek.
            </AccordionContent>
          </AccordionItem>
        </div>

        {/* Tech & Wallets */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white flex items-center gap-2">
            🛠️ Tech & Wallets
          </h2>

          <AccordionItem value="item-20" className="border-b border-gray-200 dark:border-gray-700">
            <AccordionTrigger className="text-left hover:text-[#ed5925] transition-colors">
              Do I need a crypto wallet?
            </AccordionTrigger>
            <AccordionContent className="text-gray-600 dark:text-gray-300 leading-relaxed">
              Not to play—fiat onboarding is built-in. But to mint or trade
              NFTs you'll connect MetaMask, Phantom, or WalletConnect.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-21" className="border-b border-gray-200 dark:border-gray-700">
            <AccordionTrigger className="text-left hover:text-[#ed5925] transition-colors">
              Gas fees?
            </AccordionTrigger>
            <AccordionContent className="text-gray-600 dark:text-gray-300 leading-relaxed">
              Covered by the House for all standard board actions. NFT mints
              include gas in the listed price.
            </AccordionContent>
          </AccordionItem>
        </div>

        {/* Fantasy Football Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white flex items-center gap-2">
            🏆 Fantasy Football Section
          </h2>

          <AccordionItem value="item-22" className="border-b border-gray-200 dark:border-gray-700">
            <AccordionTrigger className="text-left hover:text-[#ed5925] transition-colors">
              When does your Fantasy draft open?
            </AccordionTrigger>
            <AccordionContent className="text-gray-600 dark:text-gray-300 leading-relaxed">
              Typically mid-August after preseason Week 2; we'll post the exact
              date on the Dashboard and email reminders.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-23" className="border-b border-gray-200 dark:border-gray-700">
            <AccordionTrigger className="text-left hover:text-[#ed5925] transition-colors">
              Is your fantasy league platform-agnostic?
            </AccordionTrigger>
            <AccordionContent className="text-gray-600 dark:text-gray-300 leading-relaxed">
              Yes. Our beginner guides map rules to the big three hosts (ESPN,
              Yahoo, Sleeper) so you can follow along anywhere.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-24" className="border-b border-gray-200 dark:border-gray-700">
            <AccordionTrigger className="text-left hover:text-[#ed5925] transition-colors">
              Any special scoring twists?
            </AccordionTrigger>
            <AccordionContent className="text-gray-600 dark:text-gray-300 leading-relaxed">
              We run standard PPR plus a <strong>"Squares Bonus"</strong>: if your fantasy
              QB's real-life team wins you a Squares payout the same week, you
              get +2 fantasy points.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-25" className="border-b border-gray-200 dark:border-gray-700">
            <AccordionTrigger className="text-left hover:text-[#ed5925] transition-colors">
              Can I integrate my Squares wallet with my fantasy entry fee?
            </AccordionTrigger>
            <AccordionContent className="text-gray-600 dark:text-gray-300 leading-relaxed">
              Absolutely—one click lets you fund fantasy buy-ins from your
              Squares balance.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-26" className="border-b border-gray-200 dark:border-gray-700">
            <AccordionTrigger className="text-left hover:text-[#ed5925] transition-colors">
              Do NFTs tie into Fantasy?
            </AccordionTrigger>
            <AccordionContent className="text-gray-600 dark:text-gray-300 leading-relaxed">
              Select "Rare" NFTs unlock an alternate jersey avatar for your
              fantasy lineup and bump your weekly free-agent budget by 5%.
            </AccordionContent>
          </AccordionItem>
        </div>

        {/* Troubleshooting & Support */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white flex items-center gap-2">
            🧩 Troubleshooting & Support
          </h2>

          <AccordionItem value="item-27" className="border-b border-gray-200 dark:border-gray-700">
            <AccordionTrigger className="text-left hover:text-[#ed5925] transition-colors">
              I bought a square but it shows "pending."
            </AccordionTrigger>
            <AccordionContent className="text-gray-600 dark:text-gray-300 leading-relaxed">
              The board isn't full yet. Once all 100 squares are claimed, the
              random number lock-in happens and you'll see your digits.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-28" className="border-b border-gray-200 dark:border-gray-700">
            <AccordionTrigger className="text-left hover:text-[#ed5925] transition-colors">
              I can't mint—what gives?
            </AccordionTrigger>
            <AccordionContent className="text-gray-600 dark:text-gray-300 leading-relaxed">
              Check that your wallet holds enough for the mint cost plus
              ~0.003 ETH buffer for gas. Still stuck? Open a ticket—24-hour
              response max.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-29" className="border-b border-gray-200 dark:border-gray-700">
            <AccordionTrigger className="text-left hover:text-[#ed5925] transition-colors">
              Refund policy?
            </AccordionTrigger>
            <AccordionContent className="text-gray-600 dark:text-gray-300 leading-relaxed">
              Squares: refundable anytime before the board fills. NFTs:
              non-refundable after mint (blockchains are forever, darling).
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-30" className="border-b border-gray-200 dark:border-gray-700">
            <AccordionTrigger className="text-left hover:text-[#ed5925] transition-colors">
              How do I contact support?
            </AccordionTrigger>
            <AccordionContent className="text-gray-600 dark:text-gray-300 leading-relaxed">
              Email us at support@footballsquares.com or use the live chat feature on any page. 
              We aim to respond within 24 hours, usually much faster during game days.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-31" className="border-b border-gray-200 dark:border-gray-700">
            <AccordionTrigger className="text-left hover:text-[#ed5925] transition-colors">
              Are there age restrictions?
            </AccordionTrigger>
            <AccordionContent className="text-gray-600 dark:text-gray-300 leading-relaxed">
              You must be 18 years or older to participate in paid squares games. 
              Free games and educational content are available to all ages.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-32" className="border-b border-gray-200 dark:border-gray-700">
            <AccordionTrigger className="text-left hover:text-[#ed5925] transition-colors">
              What happens if a game is postponed or cancelled?
            </AccordionTrigger>
            <AccordionContent className="text-gray-600 dark:text-gray-300 leading-relaxed">
              If an NFL game is postponed, the squares board remains active until the rescheduled game. 
              If a game is permanently cancelled (extremely rare), all participants receive full refunds automatically.
            </AccordionContent>
          </AccordionItem>
        </div>

        {/* Additional Game Strategy Questions */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white flex items-center gap-2">
            🎯 Strategy & Tips
          </h2>

          <AccordionItem value="item-33" className="border-b border-gray-200 dark:border-gray-700">
            <AccordionTrigger className="text-left hover:text-[#ed5925] transition-colors">
              Are there "better" numbers to have?
            </AccordionTrigger>
            <AccordionContent className="text-gray-600 dark:text-gray-300 leading-relaxed">
              Historically, combinations involving 0, 3, and 7 tend to win more often due to common football scoring patterns 
              (field goals = 3 points, touchdowns = 7 points). However, since numbers are assigned randomly after the board fills, 
              it's purely luck-based.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-34" className="border-b border-gray-200 dark:border-gray-700">
            <AccordionTrigger className="text-left hover:text-[#ed5925] transition-colors">
              Can I buy multiple squares on the same board?
            </AccordionTrigger>
            <AccordionContent className="text-gray-600 dark:text-gray-300 leading-relaxed">
              Yes! You can purchase as many squares as you want on any single board, 
              increasing your chances of winning. Each square is treated as a separate entry.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-35" className="border-b border-gray-200 dark:border-gray-700">
            <AccordionTrigger className="text-left hover:text-[#ed5925] transition-colors">
              How do I know if my square won?
            </AccordionTrigger>
            <AccordionContent className="text-gray-600 dark:text-gray-300 leading-relaxed">
              Winners are automatically determined at the end of each quarter. You'll receive an email notification 
              and see the win reflected in your dashboard. Payouts are processed automatically via smart contract.
            </AccordionContent>
          </AccordionItem>
        </div>
      </Accordion>

      {/* Contact CTA */}
      <div className="mt-12 text-center bg-gradient-to-r from-[#002244] to-[#004953] rounded-lg p-8 text-white">
        <h3 className="text-2xl font-bold mb-4">Still Have Questions?</h3>
        <p className="text-lg mb-6 opacity-90">
          Our support team is here to help you get the most out of your Football Squares experience.
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