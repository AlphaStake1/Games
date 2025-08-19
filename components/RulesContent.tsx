import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info, AlertCircle } from 'lucide-react';

const RulesContent = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">
        🏈 Football Squares — Official Rules & Variations
      </h1>
      <p className="text-center text-muted-foreground mb-8">
        X-axis = <strong>Home-team</strong> last digit | Y-axis ={' '}
        <strong>Away-team</strong> last digit
      </p>

      {/* Navigation Table of Contents */}
      <Card className="mb-12">
        <CardHeader>
          <CardTitle>Quick Navigation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <a href="#quick-start" className="text-blue-600 hover:underline">
              → Quick Start Guide
            </a>
            <a href="#season-pass" className="text-blue-600 hover:underline">
              1. Season Pass (Green Points)
            </a>
            <a href="#half-season" className="text-blue-600 hover:underline">
              2. Half-Season Divisions
            </a>
            <a href="#weekly-squares" className="text-blue-600 hover:underline">
              3. Weekly Squares
            </a>
            <a href="#cbl-program" className="text-blue-600 hover:underline">
              4. CBL Program
            </a>
            <a href="#free-play" className="text-blue-600 hover:underline">
              5. Free-to-Play
            </a>
            <a href="#points-systems" className="text-blue-600 hover:underline">
              6. Blue & Orange Points
            </a>
            <a href="#general-rules" className="text-blue-600 hover:underline">
              7. General Rules
            </a>
            <a
              href="#scoring-examples"
              className="text-blue-600 hover:underline"
            >
              8. Scoring Examples
            </a>
            <a href="#faq" className="text-blue-600 hover:underline">
              9. FAQ
            </a>
          </div>
        </CardContent>
      </Card>

      {/* Quick Start Guide */}
      <Card className="mb-12" id="quick-start">
        <CardHeader>
          <CardTitle className="text-3xl">Quick Start Guide</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <h3 className="text-xl font-semibold">Getting Started in 3 Steps</h3>
          <ol className="list-decimal pl-6 space-y-4">
            <li>
              <strong>Connect Your Wallet:</strong> Use Phantom, Solflare, or
              any Solana-compatible wallet. Fund it with SOL for gas fees and
              USDC for purchases.
            </li>
            <li>
              <strong>Choose Your Game Mode:</strong>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>
                  <strong>Season Pass:</strong> One purchase for entire NFL
                  season (285+ games)
                </li>
                <li>
                  <strong>Half-Season:</strong> Join mid-season starting Week 10
                </li>
                <li>
                  <strong>Weekly Squares:</strong> Single-game entries ($5-$500)
                </li>
                <li>
                  <strong>Free-to-Play:</strong> Practice with sponsored boards
                </li>
              </ul>
            </li>
            <li>
              <strong>Purchase & Play:</strong> Select your tier, complete
              purchase, and watch scores update automatically. Payouts are
              instant after game completion.
            </li>
          </ol>

          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              <strong>New Players:</strong> Start with Free-to-Play or low-tier
              Weekly Squares to learn the system.
            </AlertDescription>
          </Alert>

          <h3 className="text-xl font-semibold mt-6">Payment & Payouts</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Accepted Payment:</strong> USDC on Solana blockchain
            </li>
            <li>
              <strong>Payout Timeline:</strong> Weekly games pay within 5
              minutes of final score
            </li>
            <li>
              <strong>Season Payouts:</strong> Distributed within 24 hours after
              Super Bowl
            </li>
            <li>
              <strong>Minimum Balance:</strong> Keep 0.01 SOL for transaction
              fees
            </li>
          </ul>
        </CardContent>
      </Card>

      <div className="space-y-12">
        <Card id="season-pass">
          <CardHeader>
            <CardTitle className="text-3xl">
              1. Season Pass Conferences (Green Points System)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p>
              <strong>Season Pass: One purchase, entire season.</strong> Your
              NFT grants one square per game (285+ games) in a 100-player
              conference at your chosen tier.
            </p>

            <Alert className="my-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>85% Activation Rule:</strong> Conferences activate at
                85% capacity (85 players). The House covers unfilled squares—if
                they hit, points are burned (not awarded to any player). Payouts
                remain proportional to actual entries collected.
              </AlertDescription>
            </Alert>

            <h3 className="text-2xl font-semibold">
              1.1 Double-Random Fairness System
            </h3>
            <p>
              Two VRF randomizations before each game ensure complete fairness:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Step 1 (T-90 min):</strong> NFT positions shuffle across
                the 10×10 grid
              </li>
              <li>
                <strong>Step 2 (T-85 min):</strong> Home/Away digits (0-9)
                randomly assigned to axes
              </li>
              <li>
                <strong>Result:</strong> 285+ unique positions throughout the
                season (one per game)
              </li>
            </ul>
            <Alert className="mt-4">
              <Info className="h-4 w-4" />
              <AlertDescription>
                The 90-minute lock time allows both randomization steps to
                complete on-chain before kickoff.
              </AlertDescription>
            </Alert>

            <h3 className="text-2xl font-semibold">
              1.2 Conference Tier Structure & Pricing
            </h3>
            <p>
              Each 100-player <strong>Conference</strong> is its own league,
              leaderboard, and prize pool. Conferences fill in order and
              automatically cycle to the next geographic name when full:
            </p>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tier</TableHead>
                  <TableHead>Conference Names</TableHead>
                  <TableHead>Season Pass Price</TableHead>
                  <TableHead>Total Pool</TableHead>
                  <TableHead>1st Place Max</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>
                    <strong>1</strong>
                  </TableCell>
                  <TableCell>
                    Eastern → Central → Atlantic → Lakes → Prairie
                  </TableCell>
                  <TableCell>
                    <strong>$50</strong>
                  </TableCell>
                  <TableCell>$5,000</TableCell>
                  <TableCell>~$1,400</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <strong>2</strong>
                  </TableCell>
                  <TableCell>
                    Southern → Mountain → Desert → Delta → Plateau
                  </TableCell>
                  <TableCell>
                    <strong>$100</strong>
                  </TableCell>
                  <TableCell>$10,000</TableCell>
                  <TableCell>~$2,800</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <strong>3</strong>
                  </TableCell>
                  <TableCell>
                    Northern → Gulf of America → Great Lakes → Heartland →
                    Badlands
                  </TableCell>
                  <TableCell>
                    <strong>$250</strong>
                  </TableCell>
                  <TableCell>$25,000</TableCell>
                  <TableCell>~$7,000</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <strong>4</strong>
                  </TableCell>
                  <TableCell>
                    Western → Pacific → Sierra → Cascades → Rockies
                  </TableCell>
                  <TableCell>
                    <strong>$500</strong>
                  </TableCell>
                  <TableCell>$50,000</TableCell>
                  <TableCell>~$14,000</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <strong>5</strong>
                  </TableCell>
                  <TableCell>
                    South-East → South-West → North-East → North-West →
                    Mid-Atlantic
                  </TableCell>
                  <TableCell>
                    <strong>$1,000</strong>
                  </TableCell>
                  <TableCell>$100,000</TableCell>
                  <TableCell>~$28,000</TableCell>
                </TableRow>
              </TableBody>
            </Table>

            <h3 className="text-2xl font-semibold">
              1.3 Green Points Scoring System
            </h3>
            <p>
              Earn points when quarter-end scores match your square digits.
              <strong>
                {' '}
                Formula: Base Points × Pattern Rarity × Playoff Multiplier
              </strong>
            </p>

            <h4 className="text-xl font-semibold">Base Points by Period</h4>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Period</TableHead>
                  <TableHead>Base Points</TableHead>
                  <TableHead>Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>Q1</TableCell>
                  <TableCell>200</TableCell>
                  <TableCell>Quarter-end score</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Q2 (Halftime)</TableCell>
                  <TableCell>250</TableCell>
                  <TableCell>Halftime score</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Q3</TableCell>
                  <TableCell>200</TableCell>
                  <TableCell>Quarter-end score</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Q4 (Final)</TableCell>
                  <TableCell>250</TableCell>
                  <TableCell>End of regulation</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>OT</TableCell>
                  <TableCell>200</TableCell>
                  <TableCell>Each OT period is independent</TableCell>
                </TableRow>
              </TableBody>
            </Table>

            <h4 className="text-xl font-semibold">
              Category Split (Pattern Rarity)
            </h4>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Pattern</TableHead>
                  <TableHead>Share</TableHead>
                  <TableHead>Definition</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>Forward</TableCell>
                  <TableCell>45%</TableCell>
                  <TableCell>(Home, Away)</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Backward</TableCell>
                  <TableCell>30%</TableCell>
                  <TableCell>(Away, Home)</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Forward +5</TableCell>
                  <TableCell>15%</TableCell>
                  <TableCell>((H+5) mod 10, (A+5) mod 10)</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Backward +5</TableCell>
                  <TableCell>10%</TableCell>
                  <TableCell>((A+5) mod 10, (H+5) mod 10)</TableCell>
                </TableRow>
              </TableBody>
            </Table>

            <h4 className="text-xl font-semibold">Playoff Multipliers</h4>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Stage</TableHead>
                  <TableHead>Multiplier</TableHead>
                  <TableHead>Impact</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>Weeks 1-18</TableCell>
                  <TableCell>×1.0</TableCell>
                  <TableCell>Base points</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Wild Card</TableCell>
                  <TableCell>×1.5</TableCell>
                  <TableCell>50% boost</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Divisional</TableCell>
                  <TableCell>×2.0</TableCell>
                  <TableCell>100% boost</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Conference Championships</TableCell>
                  <TableCell>×3.5</TableCell>
                  <TableCell>250% boost</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <strong>Super Bowl</strong>
                  </TableCell>
                  <TableCell>
                    <strong>×5.0</strong>
                  </TableCell>
                  <TableCell>Maximum impact</TableCell>
                </TableRow>
              </TableBody>
            </Table>

            <h3 className="text-2xl font-semibold">
              1.4 Season Payouts (Top 21 Players)
            </h3>
            <p>
              <strong>90% to players, 10% protocol.</strong> Payouts are
              proportional to entries collected.
            </p>

            <div className="grid md:grid-cols-3 gap-4 my-4">
              <div className="border rounded p-4">
                <h4 className="font-semibold">Band A (1st-7th)</h4>
                <ul className="text-sm space-y-1 mt-2">
                  <li>1st: ~28% of pot</li>
                  <li>2nd: ~18% of pot</li>
                  <li>3rd: ~14% of pot</li>
                  <li>4th-7th: Split remainder</li>
                </ul>
              </div>
              <div className="border rounded p-4">
                <h4 className="font-semibold">Band B (8th-14th)</h4>
                <p className="text-sm mt-2">1.5× pass price</p>
              </div>
              <div className="border rounded p-4">
                <h4 className="font-semibold">Band C (15th-21st)</h4>
                <p className="text-sm mt-2">1.05× pass price</p>
              </div>
            </div>

            <h4 className="text-xl font-semibold">
              Example — Tier 4 ($500 pass, $50,000 pot, $45,000 to players)
            </h4>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Place</TableHead>
                  <TableHead>Payout</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>1st</TableCell>
                  <TableCell>$14,000</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>2nd</TableCell>
                  <TableCell>$9,000</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>3rd</TableCell>
                  <TableCell>$7,000</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>4th–7th</TableCell>
                  <TableCell>$1,518 each</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>8th–14th</TableCell>
                  <TableCell>$750 each</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>15th–21st</TableCell>
                  <TableCell>$525 each</TableCell>
                </TableRow>
              </TableBody>
            </Table>

            <h4 className="text-xl font-semibold">Tie-Breaking Order</h4>
            <ol className="list-decimal pl-6 space-y-1">
              <li>Total Green Points</li>
              <li>Most squares won</li>
              <li>Earliest mint block</li>
              <li>VRF randomization</li>
            </ol>
          </CardContent>
        </Card>

        <Card id="half-season">
          <CardHeader>
            <CardTitle className="text-3xl">2. Half-Season Divisions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p>
              <strong>Join mid-season (Week 10+)</strong> with separate
              divisions and prize pools. Up to 5 passes per wallet at scaling
              prices (1×, 1.1×, 1.2×, 1.3×, 1.4×).
            </p>

            <Alert className="my-4">
              <Info className="h-4 w-4" />
              <AlertDescription>
                Divisions also activate at 85% capacity with proportional
                payouts.
              </AlertDescription>
            </Alert>

            <h3 className="text-2xl font-semibold">
              2.1 Eligibility & Minting
            </h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                Opens at NFL Week 10; mints remain open until division fills
                (100 players)
              </li>
              <li>Up to 5 passes per wallet per division</li>
              <li>
                Divisions are named after NFL divisions (e.g., AFC East, NFC
                North)
              </li>
              <li>
                Squares auto-assigned before each game; digits redrawn via VRF
              </li>
            </ul>

            <h3 className="text-2xl font-semibold">
              2.2 Scoring & Multipliers
            </h3>
            <p>
              Uses the <strong>same Green Points system</strong> as Full-Season
              (see 1.3). Points begin accruing at Week 10; playoff multipliers
              apply normally through the Super Bowl.
            </p>

            <h3 className="text-2xl font-semibold">
              2.3 Payout Structure (Top 21)
            </h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>90/10 split:</strong> 90% of the total pot to players
                (10% protocol)
              </li>
              <li>
                <strong>Places 8–14:</strong> 1.5× division pass price (flat)
              </li>
              <li>
                <strong>Places 15–21:</strong> 1.05× division pass price (flat)
              </li>
              <li>
                <strong>Places 1–7:</strong> Premium winners paid from the
                remaining player pool using Half-Season ratios:
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>
                    1st: <strong>~24%</strong> of total pot
                  </li>
                  <li>
                    2nd: <strong>~14%</strong> of total pot
                  </li>
                  <li>
                    3rd: <strong>~10%</strong> of total pot
                  </li>
                  <li>
                    4th–7th: Split the remainder of the player pool{' '}
                    <strong>equally</strong> after Bands B & C and places 1–3
                  </li>
                </ul>
              </li>
            </ul>

            <h4 className="text-xl font-semibold">
              Example — Tier 2 Division ($350 pass, $35,000 pot, $31,500 to
              players)
            </h4>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Place</TableHead>
                  <TableHead>Payout</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>1st</TableCell>
                  <TableCell>$8,400</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>2nd</TableCell>
                  <TableCell>$4,900</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>3rd</TableCell>
                  <TableCell>$3,500</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>4th–7th</TableCell>
                  <TableCell>$2,114 each</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>8th–14th</TableCell>
                  <TableCell>$525 each</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>15th–21st</TableCell>
                  <TableCell>$367 each</TableCell>
                </TableRow>
              </TableBody>
            </Table>

            <p className="text-sm text-muted-foreground">
              <strong>Overtime:</strong> If OT occurs, Q4 payout splits 50/50
              between end-Q4 score and final OT score. See the "Key Differences"
              table in the General Rules section for more details.
            </p>
          </CardContent>
        </Card>

        <Card id="weekly-squares">
          <CardHeader>
            <CardTitle className="text-3xl">
              3. Weekly Football Squares
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p>
              <strong>Single-game entries:</strong> $5 to $500 tiers. No season
              commitment required.
            </p>

            <Alert className="my-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>95% Fill Rule:</strong> Boards with ≥95% sold auto-fill
                remaining squares. Boards {'<'}95% sold cancel with full
                refunds.
              </AlertDescription>
            </Alert>

            <h3 className="text-2xl font-semibold">
              3.1 Weekly Timeline & Game Flow
            </h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Phase</TableHead>
                  <TableHead>Time (ET)</TableHead>
                  <TableHead>Key Events</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>
                    <strong>Board Creation</strong>
                  </TableCell>
                  <TableCell>Tue 09:00</TableCell>
                  <TableCell>One board per NFL game × 7 tiers</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <strong>Open Sales</strong>
                  </TableCell>
                  <TableCell>Tue 09:05 → Kickoff-60 min</TableCell>
                  <TableCell>Players purchase squares</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <strong>Registration Lock</strong>
                  </TableCell>
                  <TableCell>Kickoff-60 min</TableCell>
                  <TableCell>
                    Sales close (60 min allows for single VRF draw)
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <strong>Auto-fill</strong>
                  </TableCell>
                  <TableCell>Kickoff-45 min</TableCell>
                  <TableCell>
                    If ≥95% sold, House fills last ≤5% squares
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <strong>Cancel & Refund</strong>
                  </TableCell>
                  <TableCell>Kickoff-45 min</TableCell>
                  <TableCell>
                    If {'<'}95% sold, board cancels with full refunds
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <strong>VRF Digit Draw</strong>
                  </TableCell>
                  <TableCell>Kickoff-40 min</TableCell>
                  <TableCell>
                    Chainlink VRF writes home/away digits on-chain
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <strong>Live Scoring</strong>
                  </TableCell>
                  <TableCell>Q1 → OT</TableCell>
                  <TableCell>Oracle streams scores, emits winners</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <strong>Payouts</strong>
                  </TableCell>
                  <TableCell>Final + 5 min</TableCell>
                  <TableCell>Contract pays winners, retains rake</TableCell>
                </TableRow>
              </TableBody>
            </Table>

            <h3 className="text-2xl font-semibold">
              3.2 Tier Structure & Economics
            </h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tier</TableHead>
                  <TableHead>Entry Price</TableHead>
                  <TableHead>Total Pool</TableHead>
                  <TableHead>House Rake</TableHead>
                  <TableHead>Player Pool</TableHead>
                  <TableHead>VIP Only</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>1</TableCell>
                  <TableCell>$5</TableCell>
                  <TableCell>$500</TableCell>
                  <TableCell>5% ($25)</TableCell>
                  <TableCell>$475</TableCell>
                  <TableCell>—</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>2</TableCell>
                  <TableCell>$10</TableCell>
                  <TableCell>$1,000</TableCell>
                  <TableCell>5% ($50)</TableCell>
                  <TableCell>$950</TableCell>
                  <TableCell>—</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>3</TableCell>
                  <TableCell>$20</TableCell>
                  <TableCell>$2,000</TableCell>
                  <TableCell>5% ($100)</TableCell>
                  <TableCell>$1,900</TableCell>
                  <TableCell>—</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>4</TableCell>
                  <TableCell>$50</TableCell>
                  <TableCell>$5,000</TableCell>
                  <TableCell>5% ($250)</TableCell>
                  <TableCell>$4,750</TableCell>
                  <TableCell>—</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>5</TableCell>
                  <TableCell>$100</TableCell>
                  <TableCell>$10,000</TableCell>
                  <TableCell>3% ($300)</TableCell>
                  <TableCell>$9,700</TableCell>
                  <TableCell>✅</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>6</TableCell>
                  <TableCell>$250</TableCell>
                  <TableCell>$25,000</TableCell>
                  <TableCell>3% ($750)</TableCell>
                  <TableCell>$24,250</TableCell>
                  <TableCell>✅</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>7</TableCell>
                  <TableCell>$500</TableCell>
                  <TableCell>$50,000</TableCell>
                  <TableCell>3% ($1,500)</TableCell>
                  <TableCell>$48,500</TableCell>
                  <TableCell>✅</TableCell>
                </TableRow>
              </TableBody>
            </Table>

            <h3 className="text-2xl font-semibold">
              3.3 Payout Schedule (Forward-Only)
            </h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Quarter</TableHead>
                  <TableHead>% of Player Pool</TableHead>
                  <TableHead>Example (Tier 3: $20 board)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>Q1</TableCell>
                  <TableCell>
                    <strong>15%</strong>
                  </TableCell>
                  <TableCell>$285</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Q2 (Halftime)</TableCell>
                  <TableCell>
                    <strong>25%</strong>
                  </TableCell>
                  <TableCell>$475</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Q3</TableCell>
                  <TableCell>
                    <strong>15%</strong>
                  </TableCell>
                  <TableCell>$285</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Q4 (Final)</TableCell>
                  <TableCell>
                    <strong>45%</strong>
                  </TableCell>
                  <TableCell>$855</TableCell>
                </TableRow>
              </TableBody>
            </Table>
            <p className="text-sm text-muted-foreground">
              <strong>Overtime:</strong> If OT occurs, Q4 payout splits 50/50
              between end-Q4 score and final OT score. See the "Key Differences"
              table in the General Rules section for more details.
            </p>

            <h3 className="text-2xl font-semibold">
              3.4 VIP Rules & Square Caps
            </h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>VIP Access:</strong> Required for Tiers 5-7
                ($100/$250/$500 boards)
              </li>
              <li>
                <strong>Square Caps:</strong> VIP = 10 squares max; Standard = 5
                squares max
              </li>
              <li>
                <strong>VIP Win Bonus:</strong> +5% on net winnings (separate
                bonus transfer)
              </li>
              <li>
                <strong>Higher Rake:</strong> VIP boards carry 3% rake vs 5% on
                standard boards
              </li>
            </ul>

            <h3 className="text-2xl font-semibold">
              3.5 Board Variants (House-Configurable)
            </h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Variant</TableHead>
                  <TableHead>Q1 Split</TableHead>
                  <TableHead>Q2 Split</TableHead>
                  <TableHead>Q3 Split</TableHead>
                  <TableHead>Q4 Split</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>
                    <strong>Forward (Standard)</strong>
                  </TableCell>
                  <TableCell>15%</TableCell>
                  <TableCell>25%</TableCell>
                  <TableCell>15%</TableCell>
                  <TableCell>45%</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <strong>Forward & Backward</strong>
                  </TableCell>
                  <TableCell>9% / 6%</TableCell>
                  <TableCell>15% / 10%</TableCell>
                  <TableCell>9% / 6%</TableCell>
                  <TableCell>27% / 18%</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <strong>Forward + 5</strong>
                  </TableCell>
                  <TableCell>11.25% / 3.75%</TableCell>
                  <TableCell>18.75% / 6.25%</TableCell>
                  <TableCell>11.25% / 3.75%</TableCell>
                  <TableCell>33.75% / 11.25%</TableCell>
                </TableRow>
              </TableBody>
            </Table>
            <p className="text-sm text-muted-foreground">
              <strong>Forward & Backward:</strong> The payout is split (60/40)
              between the standard (Home-Away) and reversed (Away-Home) winning
              squares.
              <br />
              <strong>Forward + 5:</strong> 75% of the payout goes to the exact
              winning square, and 25% goes to the square that is "+5" away from
              the winning digits (e.g., if the winning square is 3-7, the "+5"
              square would be 8-2).
            </p>
            <Alert className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Winner-Take-All Rule:</strong> In "Forward & Backward"
                games, if the same square wins both payouts (e.g., a 0-0 score),
                that single square wins the entire pot for that quarter.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        <Card id="cbl-program">
          <CardHeader>
            <CardTitle className="text-3xl">
              4. Community Board Leader (CBL) Program
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p>
              <strong>Become a CBL:</strong> Create boards for your community
              and earn commissions.
            </p>

            <h3 className="text-2xl font-semibold">
              4.1 Stay Active Requirements
            </h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>3 Sunday Rule:</strong> Miss 3 consecutive Sundays =
                Inactive status
              </li>
              <li>
                <strong>Grace Period:</strong> Until Tuesday 11:59 PM ET to
                create board
              </li>
              <li>
                <strong>Auto-Reactivation:</strong> Create a board to instantly
                reactivate
              </li>
              <li>
                <strong>Player Access:</strong> Your players can always join
                House boards if you're inactive
              </li>
            </ul>

            <h3 className="text-2xl font-semibold">4.2 Commission Structure</h3>
            <p>
              CBLs earn commissions in two ways: by creating boards and by
              referring new players who mint NFTs.
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Board Creation:</strong> CBLs earn a 3% commission on
                the total pot of any board they create.
              </li>
              <li>
                <strong>NFT Referrals:</strong> CBLs earn a 30% commission on
                the platform fees from any NFTs minted by their attributed
                players.
              </li>
              <li>
                <strong>Player Attribution:</strong> A player is permanently
                attributed to the CBL who referred them. Players can request to
                change their attribution by contacting Coach B.
              </li>
            </ul>

            <h3 className="text-2xl font-semibold">
              4.3 CBL Tier Progression & Benefits
            </h3>
            <p>
              CBLs can advance through tiers by reaching one-time milestones.
              Once a tier is reached, it is maintained for the entire NFL
              season.
            </p>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tier</TableHead>
                  <TableHead>Requirements</TableHead>
                  <TableHead>Benefits</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>
                    <strong>First Stream CBL</strong>
                  </TableCell>
                  <TableCell>Entry level</TableCell>
                  <TableCell>Basic board creation, 3% rake</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <strong>Drive Maker CBL</strong>
                  </TableCell>
                  <TableCell>
                    Fill 50 boards OR refer 25 players who make a purchase
                  </TableCell>
                  <TableCell>Enhanced tools, priority support</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <strong>Franchise CBL</strong>
                  </TableCell>
                  <TableCell>
                    Fill 250 boards OR refer 100 players who make a purchase
                  </TableCell>
                  <TableCell>VIP player access, advanced features</TableCell>
                </TableRow>
              </TableBody>
            </Table>

            <h3 className="text-2xl font-semibold">
              4.4 Board Scheduling & Templates
            </h3>
            <p>
              CBLs have access to automated board creation tools and
              customizable templates:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Scheduled Creation:</strong> CBLs can pre-schedule
                boards to maintain activity requirements automatically.
              </li>
              <li>
                <strong>Template System:</strong> Save and reuse board
                configurations for consistent community experiences.
              </li>
              <li>
                <strong>Bulk Operations:</strong> Create multiple boards
                simultaneously for different game tiers or formats.
              </li>
              <li>
                <strong>Activity Dashboard:</strong> Real-time tracking of board
                creation history, player engagement, and commission earnings.
              </li>
            </ul>

            <h3 className="text-2xl font-semibold">4.6 Onboarding & Support</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>CBL Dashboard:</strong> All CBLs have access to a
                dashboard to track their earnings, player activity, and board
                performance.
              </li>
              <li>
                <strong>Payouts:</strong> Board commissions are automatically
                paid out 5 minutes after the end of each game. NFT commissions
                are paid out instantly at the time of the mint.
              </li>
              <li>
                <strong>Referral Points:</strong> CBLs earn Orange points after
                their referred player makes their first paid transaction (either
                an NFT mint or a board entry).
              </li>
              <li>
                <strong>Support:</strong> For any questions or issues, please
                contact OC-Phil, the dedicated support contact for CBLs.
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card id="free-play">
          <CardHeader>
            <CardTitle className="text-3xl">5. Free-to-Play Games</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p>
              <strong>Practice for free</strong> on sponsored boards. Compete
              for prizes, not cash.
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Entry:</strong> Free for all users
              </li>
              <li>
                <strong>Minimum Players:</strong> 85% filled (85 players) to
                activate
              </li>
              <li>
                <strong>Scoring:</strong> Blue Points (separate from Green
                Points)
              </li>
              <li>
                <strong>Prizes:</strong> Merchandise, NFTs, or sponsor rewards
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* New Blue & Orange Points Section */}
        <Card id="points-systems">
          <CardHeader>
            <CardTitle className="text-3xl">
              6. Blue & Orange Points Systems
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <h3 className="text-2xl font-semibold">Point System Overview</h3>
            <p>
              Three distinct point systems track different types of gameplay:
            </p>

            <div className="grid md:grid-cols-3 gap-4 my-6">
              <div className="border border-green-600 rounded p-4 bg-green-900/20">
                <h4 className="font-semibold text-green-400">
                  🟢 Green Points
                </h4>
                <p className="text-sm mt-2 text-gray-300">
                  Season Pass & Half-Season paid competitions
                </p>
                <ul className="text-sm mt-2 space-y-1 text-gray-400">
                  <li>• Cash prizes</li>
                  <li>• Top 21 payouts</li>
                  <li>• Playoff multipliers</li>
                </ul>
              </div>
              <div className="border border-blue-600 rounded p-4 bg-blue-900/20">
                <h4 className="font-semibold text-blue-400">🔵 Blue Points</h4>
                <p className="text-sm mt-2 text-gray-300">
                  Free-to-Play sponsored competitions
                </p>
                <ul className="text-sm mt-2 space-y-1 text-gray-400">
                  <li>• No entry fee</li>
                  <li>• Sponsor prizes</li>
                  <li>• Practice mode</li>
                </ul>
              </div>
              <div className="border border-orange-600 rounded p-4 bg-orange-900/20">
                <h4 className="font-semibold text-orange-400">
                  🟠 Orange Points
                </h4>
                <p className="text-sm mt-2 text-gray-300">
                  Special events & promotions
                </p>
                <ul className="text-sm mt-2 space-y-1 text-gray-400">
                  <li>• Limited-time events</li>
                  <li>• Bonus rewards</li>
                  <li>• Community challenges</li>
                </ul>
              </div>
            </div>

            <h3 className="text-2xl font-semibold">Blue Points Details</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Scoring:</strong> Same formula as Green Points (Base ×
                Pattern × Multiplier)
              </li>
              <li>
                <strong>Leaderboards:</strong> Separate from paid competitions
              </li>
              <li>
                <strong>Seasons:</strong> May run shorter promotional periods
              </li>
              <li>
                <strong>Prizes:</strong> Non-cash rewards determined by sponsors
              </li>
            </ul>

            <h3 className="text-2xl font-semibold">Orange Points Details</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Activation:</strong> Special events (playoffs, holidays,
                milestones)
              </li>
              <li>
                <strong>Earning:</strong> Bonus multipliers on specific games or
                achievements
              </li>
              <li>
                <strong>Rewards:</strong> Exclusive NFTs, VIP status, or
                platform benefits
              </li>
              <li>
                <strong>Stacking:</strong> Can be earned alongside Green or Blue
                points
              </li>
            </ul>

            <Alert className="mt-4">
              <Info className="h-4 w-4" />
              <AlertDescription>
                Points never transfer between systems. Each color maintains
                independent leaderboards and prizes.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        <Card id="general-rules">
          <CardHeader>
            <CardTitle className="text-3xl">
              7. General Rules & Fair Play
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <h3 className="text-2xl font-semibold">Lock Times & Thresholds</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Game Type</TableHead>
                  <TableHead>Lock Time</TableHead>
                  <TableHead>Minimum Fill</TableHead>
                  <TableHead>Reason</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>Season Pass</TableCell>
                  <TableCell>90 min before</TableCell>
                  <TableCell>85%</TableCell>
                  <TableCell>Double VRF randomization</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Weekly Squares</TableCell>
                  <TableCell>60 min before</TableCell>
                  <TableCell>95%</TableCell>
                  <TableCell>Single VRF randomization</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Free Play</TableCell>
                  <TableCell>60 min before</TableCell>
                  <TableCell>85%</TableCell>
                  <TableCell>Single VRF randomization</TableCell>
                </TableRow>
              </TableBody>
            </Table>
            <Separator />

            <h3 className="text-2xl font-semibold">
              VRF Randomization & Fairness
            </h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Verifiable Random Function:</strong> All digit
                assignments and NFT shuffles use Chainlink VRF for provable
                fairness.
              </li>
              <li>
                <strong>On-chain Transparency:</strong> VRF requests, responses,
                and randomness proofs are permanently recorded on-chain.
              </li>
              <li>
                <strong>Emergency Fallback:</strong> In case of VRF failure (
                {'>'}6 hours), trusted multisig can provide fallback randomness
                during paused state.
              </li>
            </ul>
            <Separator />

            <h3 className="text-2xl font-semibold">Overtime Rules</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Season Pass Boards:</strong> Each overtime period
                produces its own scoring events; every hit pays full Green
                Points at applicable multipliers.
              </li>
              <li>
                <strong>Weekly Cash Boards:</strong> If a game goes to OT, the
                45% Final-Score pool splits 50/50 between the 4th-Quarter winner
                and the Overtime Final-Score winner.
              </li>
            </ul>
            <Separator />

            <h3 className="text-2xl font-semibold">
              Key Differences: Season-Long vs. Weekly
            </h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Feature</TableHead>
                  <TableHead>Season-Long (Pass & Half-Season)</TableHead>
                  <TableHead>Weekly Squares</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>
                    <strong>Overtime</strong>
                  </TableCell>
                  <TableCell>
                    Each OT period is a new scoring event, awarding full points.
                  </TableCell>
                  <TableCell>
                    Final score payout is split 50/50 between end of Q4 and
                    final OT score.
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <strong>Randomization</strong>
                  </TableCell>
                  <TableCell>
                    Double VRF (shuffles NFTs, then assigns digits).
                  </TableCell>
                  <TableCell>Single VRF (assigns digits).</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <strong>Minimum Fill</strong>
                  </TableCell>
                  <TableCell>85%</TableCell>
                  <TableCell>95%</TableCell>
                </TableRow>
              </TableBody>
            </Table>
            <Separator />

            <h3 className="text-2xl font-semibold">
              Key Differences: Season-Long vs. Weekly
            </h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Feature</TableHead>
                  <TableHead>Season-Long (Pass & Half-Season)</TableHead>
                  <TableHead>Weekly Squares</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>
                    <strong>Overtime</strong>
                  </TableCell>
                  <TableCell>
                    Each OT period is a new scoring event, awarding full points.
                  </TableCell>
                  <TableCell>
                    Final score payout is split 50/50 between end of Q4 and
                    final OT score.
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <strong>Randomization</strong>
                  </TableCell>
                  <TableCell>
                    Double VRF (shuffles NFTs, then assigns digits).
                  </TableCell>
                  <TableCell>Single VRF (assigns digits).</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <strong>Minimum Fill</strong>
                  </TableCell>
                  <TableCell>85%</TableCell>
                  <TableCell>95%</TableCell>
                </TableRow>
              </TableBody>
            </Table>
            <Separator />

            <h3 className="text-2xl font-semibold">Refunds & Edge Cases</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Scenario</TableHead>
                  <TableHead>Resolution</TableHead>
                  <TableHead>Timeline</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>Weekly board {'<'}95% filled</TableCell>
                  <TableCell>Full refund to wallet</TableCell>
                  <TableCell>Within 24 hours</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Season conference {'<'}85% filled</TableCell>
                  <TableCell>Full refund or House fills</TableCell>
                  <TableCell>Before Week 1</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>NFL season suspended</TableCell>
                  <TableCell>Pro-rata refund</TableCell>
                  <TableCell>Within 7 days</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Game cancelled ({'<'}55 min played)</TableCell>
                  <TableCell>Full refund for that game</TableCell>
                  <TableCell>Within 48 hours</TableCell>
                </TableRow>
              </TableBody>
            </Table>
            <Separator />

            <h3 className="text-2xl font-semibold">
              Transparency & Audit Trail
            </h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Blockchain Records:</strong> All purchases, payouts, and
                randomization events recorded on Solana blockchain.
              </li>
              <li>
                <strong>Public Verification:</strong> Paste any transaction hash
                at Solscan.io to inspect ownership and payouts.
              </li>
              <li>
                <strong>VRF Proofs:</strong> "View VRF tx" links provide
                cryptographic proof that random numbers were generated fairly.
              </li>
              <li>
                <strong>Real-time Monitoring:</strong> Live status banners show
                board states, auto-fill actions, and cancellation notices.
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Merged Eligibility & Compliance */}
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">
              8. Eligibility, Compliance & Technical Requirements
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <h3 className="text-2xl font-semibold">Player Requirements</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Age:</strong> 18+ or legal gaming age in your
                jurisdiction
              </li>
              <li>
                <strong>Wallet:</strong> Solana-compatible (Phantom, Solflare,
                etc.)
              </li>
              <li>
                <strong>Browser:</strong> Chrome, Firefox, Safari, Edge (latest
                versions)
              </li>
              <li>
                <strong>Mobile:</strong> Responsive web app (native apps coming
                soon)
              </li>
            </ul>

            <h3 className="text-2xl font-semibold mt-6">Compliance</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>KYC may be required for large payouts</li>
              <li>Multiple wallets per person may be disqualified</li>
              <li>Not affiliated with the NFL or its teams</li>
              <li>Players must comply with local laws</li>
            </ul>

            <h3 className="text-2xl font-semibold mt-6">Payout Timeline</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Game Type</TableHead>
                  <TableHead>Payout Timing</TableHead>
                  <TableHead>Method</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>Weekly Squares</TableCell>
                  <TableCell>5 min after final</TableCell>
                  <TableCell>Auto to wallet</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Season Pass</TableCell>
                  <TableCell>24 hrs after Super Bowl</TableCell>
                  <TableCell>Auto to wallet</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Free Play</TableCell>
                  <TableCell>Per sponsor terms</TableCell>
                  <TableCell>Varies</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card id="scoring-examples">
          <CardHeader>
            <CardTitle className="text-3xl">
              9. Scoring Pattern Examples
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p>
              For newcomers unfamiliar with Football Squares terminology, here
              are concrete examples of each scoring pattern:
            </p>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Pattern</TableHead>
                  <TableHead>Example Score</TableHead>
                  <TableHead>Winning Square</TableHead>
                  <TableHead>Explanation</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>
                    <strong>Forward</strong>
                  </TableCell>
                  <TableCell>Home 13, Away 20</TableCell>
                  <TableCell>3-0</TableCell>
                  <TableCell>Home digit (3) × Away digit (0)</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <strong>Backward</strong>
                  </TableCell>
                  <TableCell>Home 13, Away 20</TableCell>
                  <TableCell>0-3</TableCell>
                  <TableCell>Away digit (0) × Home digit (3)</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <strong>Forward + 5</strong>
                  </TableCell>
                  <TableCell>Home 13, Away 20</TableCell>
                  <TableCell>8-5</TableCell>
                  <TableCell>(3+5) mod 10 = 8, (0+5) mod 10 = 5</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <strong>Backward + 5</strong>
                  </TableCell>
                  <TableCell>Home 13, Away 20</TableCell>
                  <TableCell>5-8</TableCell>
                  <TableCell>(0+5) mod 10 = 5, (3+5) mod 10 = 8</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card id="faq">
          <CardHeader>
            <CardTitle className="text-3xl">
              10. Frequently Asked Questions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div>
                <h4 className="text-lg font-semibold mb-2">
                  Do preseason games count?
                </h4>
                <p className="text-muted-foreground">
                  No, only regular season games (Weeks 1-18) and official NFL
                  playoffs count toward points and payouts.
                </p>
              </div>

              <div>
                <h4 className="text-lg font-semibold mb-2">
                  What if my square never hits all season?
                </h4>
                <p className="text-muted-foreground">
                  No points = no payout. But with 285+ games and double
                  randomization, every player has equal mathematical chances to
                  win throughout the season.
                </p>
              </div>

              <div>
                <h4 className="text-lg font-semibold mb-2">
                  How do score updates work during games?
                </h4>
                <p className="text-muted-foreground">
                  Live scores update every 30 seconds via oracle feeds.
                  Quarter-end scores are locked and points awarded within 2
                  minutes of each period ending.
                </p>
              </div>

              <div>
                <h4 className="text-lg font-semibold mb-2">
                  Can I buy multiple squares in the same weekly board?
                </h4>
                <p className="text-muted-foreground">
                  Yes, up to 5 squares for standard users and 10 squares for VIP
                  members per individual board.
                </p>
              </div>

              <div>
                <h4 className="text-lg font-semibold mb-2">
                  How do I know if my transaction went through?
                </h4>
                <p className="text-muted-foreground">
                  All purchases are recorded on the Solana blockchain. You can
                  verify any transaction by pasting the hash at Solscan.io. The
                  app also shows your squares immediately after confirmation.
                </p>
              </div>

              <div>
                <h4 className="text-lg font-semibold mb-2">
                  What happens if I lose my wallet or private keys?
                </h4>
                <p className="text-muted-foreground">
                  Season pass NFTs and weekly squares are tied to your wallet
                  address. If you lose access to your wallet, you lose access to
                  your squares. Always back up your seed phrase securely.
                </p>
              </div>

              <div>
                <h4 className="text-lg font-semibold mb-2">
                  Are there any geographic restrictions?
                </h4>
                <p className="text-muted-foreground">
                  Players must comply with local laws. The platform may restrict
                  access in certain jurisdictions. By participating, you confirm
                  you are legally allowed to play skill-based games in your
                  location.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Rules Version & Updates</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              <strong>Rules v1.5 – effective January 2025.</strong> Changes
              announced 72 hours in advance via Discord and on-chain. Always
              check this page for the latest version.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RulesContent;
