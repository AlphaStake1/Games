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

const RulesContent = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">
        🏈 Football Squares — Official Rules & Variations
      </h1>
      <p className="text-center text-muted-foreground mb-12">
        X-axis = <strong>Home-team</strong> last digit | Y-axis ={' '}
        <strong>Away-team</strong> last digit
      </p>

      <div className="space-y-12">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">
              1. Season Pass Conferences (Green Points System)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p>
              Season Pass Conferences transform weekly squares into season-long
              competition. Players purchase a single season pass granting one
              permanent square for every NFL game (Week 1 → Super Bowl),
              competing within tier-matched conferences of exactly 100 players.
            </p>

            <h3 className="text-2xl font-semibold">
              1.1 Double-Random Fairness System
            </h3>
            <p>
              Before each NFL game, two randomization events occur via
              Verifiable Random Function (VRF):
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>NFT Marker Shuffle (T-minus 90 minutes):</strong> All
                100 season pass NFTs are randomly redistributed across the 10×10
                coordinate grid, eliminating permanent positional advantages.
              </li>
              <li>
                <strong>Row/Column Digit Redraw:</strong> Fresh 0-9 digits
                assigned to X-axis and Y-axis immediately after shuffle,
                creating new scoring combinations for each game.
              </li>
              <li>
                <strong>Fairness Guarantee:</strong> Every player experiences
                ~285 different square positions over the full season.
              </li>
            </ul>

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
                    <strong>$25</strong>
                  </TableCell>
                  <TableCell>$2,500</TableCell>
                  <TableCell>~$700</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <strong>2</strong>
                  </TableCell>
                  <TableCell>
                    Southern → Mountain → Desert → Delta → Plateau
                  </TableCell>
                  <TableCell>
                    <strong>$50</strong>
                  </TableCell>
                  <TableCell>$5,000</TableCell>
                  <TableCell>~$1,400</TableCell>
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
                    <strong>$100</strong>
                  </TableCell>
                  <TableCell>$10,000</TableCell>
                  <TableCell>~$2,800</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <strong>4</strong>
                  </TableCell>
                  <TableCell>
                    Western → Pacific → Sierra → Cascades → Rockies
                  </TableCell>
                  <TableCell>
                    <strong>$200</strong>
                  </TableCell>
                  <TableCell>$20,000</TableCell>
                  <TableCell>~$5,600</TableCell>
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
                    <strong>$500</strong>
                  </TableCell>
                  <TableCell>$50,000</TableCell>
                  <TableCell>~$14,000</TableCell>
                </TableRow>
              </TableBody>
            </Table>

            <h3 className="text-2xl font-semibold">
              1.4 Green Points Accumulation
            </h3>
            <p>
              Players earn Green Points for quarter-end score matches, with
              bonuses and multipliers building throughout the season:
            </p>

            <h4 className="text-xl font-semibold">Base Point Events</h4>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Quarter Score Match:</strong> Base points for correct
                quarter-end combinations
              </li>
              <li>
                <strong>Halftime Bonus:</strong> +25% multiplier for 2nd quarter
                matches
              </li>
              <li>
                <strong>Overtime Bonus:</strong> +20% per OT period (treated as
                extra quarters)
              </li>
            </ul>

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
                  <TableCell>×2.5</TableCell>
                  <TableCell>150% boost</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Conference Championships</TableCell>
                  <TableCell>×3.7</TableCell>
                  <TableCell>270% boost</TableCell>
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
              1.4 Top 21 Payout Structure
            </h3>
            <p>
              Winners are determined by final Green Points standings, with
              prizes distributed to the top 21 performers (~80% of pool to
              players, ~20% to protocol):
            </p>

            <h4 className="text-xl font-semibold">Payout Bands</h4>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Band</TableHead>
                  <TableHead>Places</TableHead>
                  <TableHead>Structure</TableHead>
                  <TableHead>Example (Tier 2: $50 pass)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>
                    <strong>Band A</strong>
                  </TableCell>
                  <TableCell>1-7</TableCell>
                  <TableCell>Premium Winners (progressive)</TableCell>
                  <TableCell>
                    1st: $1,750, 2nd: $1,250, 3rd: $960, 4-7th: $700 each
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <strong>Band B</strong>
                  </TableCell>
                  <TableCell>8-14</TableCell>
                  <TableCell>1.5× pass cost</TableCell>
                  <TableCell>$75 each</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <strong>Band C</strong>
                  </TableCell>
                  <TableCell>15-21</TableCell>
                  <TableCell>1.05× pass cost (break-even+)</TableCell>
                  <TableCell>$52.50 each</TableCell>
                </TableRow>
              </TableBody>
            </Table>

            <h4 className="text-xl font-semibold">Green Points Tie-Breaking</h4>
            <p>In order of precedence:</p>
            <ol className="list-decimal pl-6 space-y-1">
              <li>
                <strong>Primary:</strong> Total Green Points accumulated
              </li>
              <li>
                <strong>Secondary:</strong> Most squares won throughout season
              </li>
              <li>
                <strong>Tertiary:</strong> Earliest mint block (first to join
                conference)
              </li>
              <li>
                <strong>Final:</strong> VRF-seeded deterministic random using
                season start seed
              </li>
            </ol>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">
              2. Weekly Football Squares
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p>
              Weekly Football Squares are single-game NFT squares without
              season-long commitment. Five entry tiers ($5 → $100) serve casual
              through high-roller audiences, with VIP status unlocking higher
              tiers and bigger square caps.
            </p>

            <h3 className="text-2xl font-semibold">
              2.1 Weekly Timeline & Game Flow
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
                    Contract stops purchases; reservations expire
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
              2.2 Tier Structure & Economics
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
                  <TableCell>8% ($800)</TableCell>
                  <TableCell>$9,200</TableCell>
                  <TableCell>✅</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>6</TableCell>
                  <TableCell>$250</TableCell>
                  <TableCell>$25,000</TableCell>
                  <TableCell>8% ($2,000)</TableCell>
                  <TableCell>$23,000</TableCell>
                  <TableCell>✅</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>7</TableCell>
                  <TableCell>$500</TableCell>
                  <TableCell>$50,000</TableCell>
                  <TableCell>8% ($4,000)</TableCell>
                  <TableCell>$46,000</TableCell>
                  <TableCell>✅</TableCell>
                </TableRow>
              </TableBody>
            </Table>

            <h3 className="text-2xl font-semibold">
              2.3 Payout Schedule (Forward-Only)
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
              between end-Q4 score and final OT score.
            </p>

            <h3 className="text-2xl font-semibold">
              2.4 VIP Rules & Square Caps
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
                <strong>Higher Rake:</strong> VIP boards carry 8% rake vs 5% on
                standard boards
              </li>
            </ul>

            <h3 className="text-2xl font-semibold">
              2.5 Board Variants (House-Configurable)
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
              <strong>Forward & Backward:</strong> 60/40 split between standard
              (Home-Away) and reversed (Away-Home) digit alignment. If both
              Forward and Backward hit the same square (e.g., 0-0), the entire
              pot goes to that single square.
              <br />
              <strong>Forward + 5:</strong> 75% for exact digits, 25% for "+5
              offset" (either team's digit plus 5, modulo 10).
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">3. Free-to-Play Games</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p>
              Free-to-play games are offered on sponsored or promotional boards.
              Players compete for points and prizes rather than cash.
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Entry:</strong> Free, available to all users.
              </li>
              <li>
                <strong>Scoring:</strong> Uses the same Green Points system as
                Season Pass games, but on a separate (🔵 Blue) leaderboard.
              </li>
              <li>
                <strong>Prizes:</strong> Prizes are announced per board and may
                include merchandise, NFTs, or other rewards.
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">
              General Rules & Fair Play
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <h3 className="text-2xl font-semibold">Board Lock & Timing</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Season Pass Boards:</strong> All season pass conferences
                close for new entries exactly{' '}
                <strong>90 minutes prior to kickoff</strong>
                to allow for the double-random VRF process.
              </li>
              <li>
                <strong>Weekly Boards:</strong> Registration closes{' '}
                <strong>60 minutes prior to kickoff</strong>, with VRF digit
                assignment at 40 minutes before.
              </li>
              <li>
                <strong>Auto-fill Threshold:</strong> Weekly boards with ≥95%
                squares sold are auto-filled by the House. Boards {'<'}95% sold
                are cancelled with full refunds.
              </li>
            </ul>
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
              Emergency Scenarios & Refunds
            </h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Season Cancellation:</strong> In case of NFL season
                suspension, pro-rata refunds based on games played: (unplayed
                games / total games) × pass price.
              </li>
              <li>
                <strong>Unfilled Weekly Boards:</strong> Boards {'<'}95% sold by
                lock time are cancelled with exact paid-amount refunds
                (in-kind). Automatic refunds are sent to the purchasing wallet
                within 24 hours with gas fees covered by the House.
              </li>
              <li>
                <strong>Technical Errors:</strong> All disputes resolved by
                on-chain data. Smart contract includes emergency pause
                functionality.
              </li>
              <li>
                <strong>Conference Minimum:</strong> Season pass conferences
                need ≥85 players to proceed; below this triggers auto-refund.
              </li>
            </ul>
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

        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">
              Eligibility & Legal Compliance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <h3 className="text-2xl font-semibold">Player Eligibility</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Age Requirement:</strong> Only individuals 18+ (or the
                legal gaming age in their jurisdiction) may purchase squares.
              </li>
              <li>
                <strong>KYC & Multiple Wallets:</strong> The project reserves
                the right to request KYC or to disqualify multiple wallets
                reasonably believed to be controlled by the same individual.
              </li>
              <li>
                <strong>NFL Affiliation:</strong> Football Squares is not
                sponsored by or affiliated with the National Football League,
                its teams, or players.
              </li>
            </ul>
            <Separator />

            <h3 className="text-2xl font-semibold">Season-Long Tie-Breaking</h3>
            <p>
              If two or more wallets finish level on total Green Points after
              the Super Bowl, ties are broken in this order:
            </p>
            <ol className="list-decimal pl-6 space-y-1">
              <li>
                <strong>Most 'Forward' hits</strong> throughout the season
              </li>
              <li>
                <strong>Most total hits</strong> across all scoring patterns
              </li>
              <li>
                <strong>Earliest timestamp</strong> of first hit in the season
              </li>
              <li>
                <strong>VRF-seeded random</strong> using season start seed
              </li>
            </ol>
            <Separator />

            <h3 className="text-2xl font-semibold">
              Game Cancellations & Edge Cases
            </h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Cancelled/Shortened Games:</strong> If the NFL
                officially voids or does not finish a game, all squares for that
                matchup are refunded unless 55 minutes of game time were
                completed.
              </li>
              <li>
                <strong>Kickoff Delays:</strong> The registration lock time is
                based on the originally published kickoff time; subsequent
                league delays do not reopen sales.
              </li>
              <li>
                <strong>Season Cancellation:</strong> Pro-rata refunds based on
                completed games: (unplayed games / total games) × pass price.
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">Scoring Pattern Examples</CardTitle>
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

        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">
              Frequently Asked Questions
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
                  Season pass holders who don't accumulate any Green Points
                  throughout the season receive no payout. However, the
                  double-random VRF system ensures every player has
                  mathematically equal chances across ~285 different positions.
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
              <strong>Rules v1.3 – effective July 26, 2025.</strong> Changes
              will be announced on-chain and via Discord 72 hours before taking
              effect. The most current version is always available at this URL.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RulesContent;
