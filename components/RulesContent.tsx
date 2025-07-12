import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";

const RulesContent = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">
        🏈 Football Squares — Official Rules & Variations
      </h1>
      <p className="text-center text-muted-foreground mb-12">
        X-axis = <strong>Home-team</strong> last digit | Y-axis ={" "}
        <strong>Away-team</strong> last digit
      </p>

      <div className="space-y-12">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">
              1. Season-Long Squares (Cumulative Points)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p>
              Season-long leagues compete for cumulative points across the
              entire NFL season. Winners are determined by final point
              standings, with prizes for 1st through 14th place.
            </p>

            <h3 className="text-2xl font-semibold">
              1.1 Game-Board Fundamentals
            </h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Grid:</strong> 10 × 10 = 100 squares.
              </li>
              <li>
                <strong>Square Assignment:</strong> Each season-pass holder is
                assigned exactly one square per game. The placement of this
                square is randomly determined for every game of the regular
                season, playoffs, and Super Bowl.
              </li>
              <li>
                <strong>Digit Shuffle:</strong> Numbers 0-9 on both axes are
                shuffled by a verifiable random function (VRF){" "}
                <strong>after</strong> all squares for a game are assigned.
              </li>
              <li>
                <strong>Hit:</strong> A “hit” occurs when the actual score’s
                final digits match one of the defined scoring patterns.
              </li>
            </ul>

            <h3 className="text-2xl font-semibold">
              1.2 Player Types & Conferences
            </h3>
            <p>
              Season-long play is divided into two main types, each with its own
              set of conference boards and leaderboards.
            </p>

            <h4 className="text-xl font-semibold">
              Full-Season Pass Conferences
            </h4>
            <p>
              This is the standard season-long experience, covering all regular
              season and playoff games. Players purchase a pass before Week 1 to
              be entered into a conference.
            </p>

            <h4 className="text-xl font-semibold">
              Mid-Season Pass Conferences
            </h4>
            <p>
              For players who join later, Mid-Season conferences open around
              Week 10. These boards cover all remaining regular-season games and
              the entire playoffs. The cost structure is the same as full-season
              boards, but points are tracked on a separate leaderboard to ensure
              a fair competition for new entrants.
            </p>

            <h3 className="text-2xl font-semibold">
              1.3 Season-Pass Conferences & Pricing
            </h3>
            <p>
              Each 100-wallet <strong>Conference</strong> is its own league,
              leaderboard, and prize pool. Conferences open in order and cycle
              through five price tiers:
            </p>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fill Order</TableHead>
                  <TableHead>Conference</TableHead>
                  <TableHead>Price / Square</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[
                  { order: 1, name: "Northern Conference", price: "$100" },
                  { order: 2, name: "Southern Conference", price: "$200" },
                  { order: 3, name: "Eastern Conference", price: "$300" },
                  { order: 4, name: "Western Conference", price: "$400" },
                  { order: 5, name: "North-West Conference", price: "$500" },
                  { order: 6, name: "South-West Conference", price: "$100" },
                  { order: 7, name: "North-East Conference", price: "$200" },
                  { order: 8, name: "South-East Conference", price: "$300" },
                  { order: 9, name: "Central Conference", price: "$400" },
                  { order: 10, name: "Mountain Conference", price: "$500" },
                  { order: 11, name: "Pacific Conference", price: "$100" },
                  { order: 12, name: "Great Lakes Conference", price: "$200" },
                  {
                    order: 13,
                    name: "Gulf of America Conference",
                    price: "$300",
                  },
                  { order: 14, name: "Atlantic Conference", price: "$400" },
                  { order: 15, name: "Heartland Conference", price: "$500" },
                ].map((c) => (
                  <TableRow key={c.order}>
                    <TableCell>{c.order}</TableCell>
                    <TableCell>{c.name}</TableCell>
                    <TableCell>{c.price}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <h3 className="text-2xl font-semibold">1.3 Scoring & Points</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Hit Type</TableHead>
                  <TableHead>Base Points</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>
                    <strong>Forward</strong>
                  </TableCell>
                  <TableCell>
                    <strong>10</strong>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Backward</TableCell>
                  <TableCell>7</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Forward + 5</TableCell>
                  <TableCell>5</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Backward + 5</TableCell>
                  <TableCell>3</TableCell>
                </TableRow>
              </TableBody>
            </Table>
            <p className="text-sm text-muted-foreground">
              *For any score event, only the single highest-value category
              scores.
            </p>

            <h4 className="text-xl font-semibold">Post-Season Multipliers</h4>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Round</TableHead>
                  <TableHead>Multiplier</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>Wild-Card</TableCell>
                  <TableCell>
                    × <strong>1.5</strong>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Divisional</TableCell>
                  <TableCell>
                    × <strong>2</strong>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Conference Championship</TableCell>
                  <TableCell>
                    × <strong>2.5</strong>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Super Bowl</TableCell>
                  <TableCell>
                    × <strong>3</strong>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">2. Weekly Cash Games</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p>
              Weekly cash games are standalone boards for single games. Payouts
              are distributed at the end of each quarter and at the final score.
            </p>

            <h3 className="text-2xl font-semibold">2.1 Board Setup & Buy-In</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Game Choice:</strong> Boards may open for Thursday,
                Sunday, Monday night games—or any special matchup.
              </li>
              <li>
                <strong>Square Price:</strong> Set by the House (e.g., $10, $25,
                $50, etc.).
              </li>
              <li>
                <strong>Square Cap:</strong> Up to 5 squares per wallet on a
                single board.
              </li>
              <li>
                <strong>Sales Close:</strong> All board sales close exactly{" "}
                <strong>T-3 hours</strong> before kickoff or when all 100
                squares are sold, whichever comes first.
              </li>
            </ul>

            <h3 className="text-2xl font-semibold">2.2 Payout Schedule</h3>
            <p>
              <strong>House Rake: 5%</strong> (deducted before the splits
              below).
            </p>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Event</TableHead>
                  <TableHead>Pot Share</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>End 1st Quarter</TableCell>
                  <TableCell>
                    <strong>15%</strong>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Halftime</TableCell>
                  <TableCell>
                    <strong>25%</strong>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>End 3rd Quarter</TableCell>
                  <TableCell>
                    <strong>15%</strong>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>4th Quarter / Final-Score Pool</TableCell>
                  <TableCell>
                    <strong>45%</strong>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>

            <h3 className="text-2xl font-semibold">
              2.3 Board Variants (available on $25+ boards)
            </h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Variant</TableHead>
                  <TableHead>Winners per Event</TableHead>
                  <TableHead>Slice of that event’s pot</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>
                    <strong>Forward Only</strong>
                  </TableCell>
                  <TableCell>Forward square</TableCell>
                  <TableCell>
                    <strong>100%</strong>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <strong>Forward & Backward</strong>
                  </TableCell>
                  <TableCell>① Forward ② Backward</TableCell>
                  <TableCell>
                    ① <strong>70%</strong> ② <strong>30%</strong>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <strong>Forward + 5</strong>
                  </TableCell>
                  <TableCell>① Forward ② Forward + 5</TableCell>
                  <TableCell>
                    ① <strong>80%</strong> ② <strong>20%</strong>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
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
                <strong>Scoring:</strong> Uses the same point system as
                Season-Long games, but on a separate (🔵 Blue) leaderboard.
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
            <p>
              To ensure all on-chain transactions are finalized and verified,
              all boards lock at a specific time.
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Board Lock:</strong> All boards (Season-Long, Weekly,
                and Free-to-Play) close for new entries exactly{" "}
                <strong>3 hours prior to the scheduled kickoff time</strong> for
                the designated game.
              </li>
              <li>
                <strong>Digit Shuffle:</strong> The random digit shuffle for
                each axis occurs immediately after the board is locked, or when
                it is full, whichever comes first.
              </li>
            </ul>
            <Separator />
            <h3 className="text-2xl font-semibold">Overtime Rule</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Season-Pass Boards:</strong> No splits. Each overtime
                period produces its own scoring event(s); every hit pays full
                points at the applicable multiplier.
              </li>
              <li>
                <strong>Weekly Cash Boards:</strong> If a game goes to OT, the
                45% Final-Score pool is split 50/50 between the 4th-Quarter
                Forward winner and the Overtime Final-Score Forward winner.
              </li>
            </ul>
            <Separator />
            <h3 className="text-2xl font-semibold">Transparency & Fair Play</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>On-chain Transactions:</strong> All purchases & payouts
                are recorded on the Solana blockchain.
              </li>
              <li>
                <strong>VRF Digit Shuffle:</strong> A commit-reveal hash is
                published on-chain, allowing anyone to verify the randomness of
                the digit shuffle.
              </li>
              <li>
                <strong>Audit Anytime:</strong> Paste any transaction hash at
                Solscan.io to inspect ownership and payouts.
              </li>
            </ul>
            <Separator />
            <h3 className="text-2xl font-semibold">Refund Policy</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Unfilled Board:</strong> If a weekly cash board has sold
                fewer than 95% of its squares (i.e., less than 95 squares) by
                the T-3 hour lock time, the board is voided and all buy-ins are
                automatically refunded.
              </li>
              <li>
                <strong>Technical Errors:</strong> Open a support ticket for any
                issues. Disputes are resolved by on-chain data.
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RulesContent;
