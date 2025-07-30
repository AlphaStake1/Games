'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

// Note: metadata should be in a separate layout.tsx for client components

const CBLApplicationPage = () => {
  const [formData, setFormData] = useState({
    gamesCompleted: '',
    communityLeadership: '',
    playerGroupSize: '',
    boardStyleAndFees: '',
    boardStyleCustom: '',
    motivation: '',
    conflictResolution: '',
    guidelines: false,
    payoutMethod: '',
    additionalInfo: '',
  });
  const [guidelinesAccepted, setGuidelinesAccepted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement form submission logic
    console.log('Form submitted:', formData);
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black transition-colors duration-300">
      <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Community Board Leader Application
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Complete the form below. Most applications are processed within the
            hour.
          </p>
        </div>

        {/* Rewards Benefits Preview */}
        <Card className="mb-8 bg-gradient-to-r from-blue-50 to-orange-50 dark:from-blue-950/20 dark:to-orange-950/20 border-blue-200 dark:border-blue-800">
          <CardContent className="p-6">
            <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
              🎁 CBL Rewards at a Glance
            </h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-blue-600">Blue Points:</span>{' '}
                1.5× multiplier + bonuses
              </div>
              <div>
                <span className="font-medium text-orange-600">
                  Orange Points:
                </span>{' '}
                Community & retention rewards
              </div>
              <div>
                <span className="font-medium text-green-600">
                  Rake Revenue:
                </span>{' '}
                3% on qualified boards
              </div>
              <div>
                <span className="font-medium text-purple-600">
                  NFT Commission:
                </span>{' '}
                30% mint revenue share
              </div>
            </div>
            <div className="mt-3 text-center">
              <a
                href="/cbl/economics"
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                View Full Economics →
              </a>
            </div>
          </CardContent>
        </Card>

        {/* Application Form */}
        <Card className="bg-green-800 dark:bg-green-900 border-green-700 dark:border-green-600">
          <CardHeader>
            <CardTitle className="text-white">Application Form</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6 text-white">
              {/* Question 1: Games Completed */}
              <div className="space-y-2">
                <Label htmlFor="gamesCompleted">
                  1. How many Football Squares games have you completed on our
                  platform?
                </Label>
                <Input
                  id="gamesCompleted"
                  type="number"
                  min="0"
                  placeholder="Enter number of completed games"
                  value={formData.gamesCompleted}
                  onChange={(e) =>
                    handleInputChange('gamesCompleted', e.target.value)
                  }
                  required
                />
                <p className="text-sm text-green-200">
                  This helps us understand your experience level with our
                  platform.
                </p>
              </div>

              {/* Question 2: Community Leadership */}
              <div className="space-y-2">
                <Label htmlFor="communityLeadership">
                  2. Link or describe a community you currently lead or
                  moderate.
                </Label>
                <Textarea
                  id="communityLeadership"
                  placeholder="Provide a URL or describe your leadership experience (Discord server, social media group, sports league, etc.)"
                  value={formData.communityLeadership}
                  onChange={(e) =>
                    handleInputChange('communityLeadership', e.target.value)
                  }
                  required
                  rows={3}
                />
              </div>

              {/* Question 3: Player Group Size */}
              <div className="space-y-3">
                <Label>
                  3. Estimated size of the player group you plan to invite:
                </Label>
                <RadioGroup
                  value={formData.playerGroupSize}
                  onValueChange={(value) =>
                    handleInputChange('playerGroupSize', value)
                  }
                  required
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="0-25" id="size-0-25" />
                    <Label htmlFor="size-0-25">0-25 players</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="26-100" id="size-26-100" />
                    <Label htmlFor="size-26-100">26-100 players</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="101-500" id="size-101-500" />
                    <Label htmlFor="size-101-500">101-500 players</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="500+" id="size-500-plus" />
                    <Label htmlFor="size-500-plus">500+ players</Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Question 4: Board Style & Entry Fees */}
              <div className="space-y-3">
                <Label>
                  4. Preferred board style & entry fee range you expect to use:
                </Label>
                <Select
                  value={formData.boardStyleAndFees}
                  onValueChange={(value) =>
                    handleInputChange('boardStyleAndFees', value)
                  }
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your preferred style and fee range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="casual-low">
                      Casual games ($7-$15 per square)
                    </SelectItem>
                    <SelectItem value="casual-mid">
                      Casual games ($16-$30 per square)
                    </SelectItem>
                    <SelectItem value="competitive-mid">
                      Competitive games ($31-$50 per square)
                    </SelectItem>
                    <SelectItem value="competitive-high">
                      High-stakes games ($51-$100 per square)
                    </SelectItem>
                    <SelectItem value="custom">
                      Custom (specify below)
                    </SelectItem>
                  </SelectContent>
                </Select>
                {formData.boardStyleAndFees === 'custom' && (
                  <Textarea
                    placeholder="Describe your custom board style and entry fee plans..."
                    value={formData.boardStyleCustom}
                    onChange={(e) =>
                      handleInputChange('boardStyleCustom', e.target.value)
                    }
                    rows={2}
                  />
                )}
              </div>

              {/* Question 5: Motivation */}
              <div className="space-y-2">
                <Label htmlFor="motivation">
                  5. What motivates you to run community boards?
                </Label>
                <Textarea
                  id="motivation"
                  placeholder="Share what drives your interest in leading and organizing Football Squares games..."
                  value={formData.motivation}
                  onChange={(e) =>
                    handleInputChange('motivation', e.target.value)
                  }
                  required
                  rows={4}
                />
              </div>

              {/* Question 6: Conflict Resolution */}
              <div className="space-y-2">
                <Label htmlFor="conflictResolution">
                  6. Describe one situation where you resolved a group conflict
                  or rule dispute.
                </Label>
                <Textarea
                  id="conflictResolution"
                  placeholder="Describe the situation, what actions you took, and the outcome..."
                  value={formData.conflictResolution}
                  onChange={(e) =>
                    handleInputChange('conflictResolution', e.target.value)
                  }
                  required
                  rows={4}
                />
              </div>

              {/* Question 7: Guidelines Agreement */}
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="guidelines"
                  checked={formData.guidelines}
                  onCheckedChange={(checked) =>
                    handleInputChange('guidelines', checked as boolean)
                  }
                  disabled={!guidelinesAccepted}
                  required
                />
                <div className="space-y-1 flex-1">
                  <Label
                    htmlFor="guidelines"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    7. I agree to follow CBL guidelines and keep all
                    communications respectful.
                  </Label>
                  <div className="text-sm text-green-200">
                    <p className="mb-2">
                      By checking this box, you agree to uphold community
                      standards and follow all CBL policies.
                    </p>
                    <Dialog>
                      <DialogTrigger asChild>
                        <button
                          type="button"
                          className="text-yellow-600 hover:text-yellow-300 underline transition-colors font-medium"
                        >
                          Click here to read the full CBL Guidelines & Code of
                          Conduct
                        </button>
                      </DialogTrigger>
                      <DialogContent
                        className="max-w-md max-h-[85vh] overflow-y-auto"
                        role="dialog"
                        aria-labelledby="guidelines-title"
                      >
                        <DialogHeader>
                          <DialogTitle
                            id="guidelines-title"
                            className="text-lg"
                          >
                            Community Board Leader – Key Rules
                          </DialogTitle>
                          <DialogDescription className="text-sm">
                            Summary version. Full details covered in training.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-3 text-sm leading-4">
                          <section>
                            <h3 className="font-semibold mb-1">
                              **1. Community Leadership**
                            </h3>
                            <ul className="space-y-1 ml-3 text-xs">
                              <li>
                                • **Inclusive play** – no harassment or
                                discrimination
                              </li>
                              <li>
                                • **Fair officiating** – apply rules evenly
                              </li>
                              <li>
                                • **Resolve disputes** fast; escalate to Coach B
                                when needed
                              </li>
                              <li>• **Legal age / region** only</li>
                            </ul>
                          </section>

                          <section>
                            <h3 className="font-semibold mb-1">
                              **2. Communication**
                            </h3>
                            <ul className="space-y-1 ml-3 text-xs">
                              <li>• **Respectful language** always</li>
                              <li>• **No spam** or mass unsolicited DMs</li>
                              <li>
                                • **Brand integrity** – follow promo guidelines
                              </li>
                              <li>• **Reply to staff** within 24 h</li>
                            </ul>
                          </section>

                          <section>
                            <h3 className="font-semibold mb-1">
                              **3. Finance & Security**
                            </h3>
                            <ul className="space-y-1 ml-3 text-xs">
                              <li>• **Use on-chain escrow** only</li>
                              <li>
                                • **No manual payouts** (smart contract handles)
                              </li>
                              <li>• **Report off-platform payments**</li>
                              <li>• **Secure your wallet keys**</li>
                            </ul>
                          </section>

                          <section>
                            <h3 className="font-semibold mb-1">
                              **4. Platform Integrity**
                            </h3>
                            <ul className="space-y-1 ml-3 text-xs">
                              <li>• **Don't exploit** bugs or scrape data</li>
                              <li>• **Report bugs** within 24 h</li>
                              <li>• **Respect IP** – logos, UI, code</li>
                            </ul>
                          </section>

                          <section>
                            <h3 className="font-semibold mb-1">
                              **5. Enforcement**
                            </h3>
                            <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded text-xs">
                              3-strike policy → <strong>Warning</strong> →{' '}
                              <strong>7-day suspension</strong> →{' '}
                              <strong>Permanent removal & clawback</strong>
                              <br />
                              (48 h appeal to Coach B each step)
                            </div>
                          </section>

                          <div className="text-xs text-gray-600 dark:text-gray-400 bg-yellow-50 dark:bg-yellow-900/20 p-2 rounded">
                            Updates may occur; you'll get 3-day notice
                            (immediate for security fixes).
                          </div>

                          <div className="text-center">
                            <a
                              href="/cbl/guidelines"
                              className="text-blue-600 hover:text-blue-700 underline text-xs font-medium"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              View Full Rules & Examples
                            </a>
                          </div>

                          <div className="border-t pt-3 mt-4">
                            <div className="flex items-start space-x-2">
                              <Checkbox
                                id="guidelines-acceptance"
                                checked={guidelinesAccepted}
                                onCheckedChange={(checked) =>
                                  setGuidelinesAccepted(checked as boolean)
                                }
                                className="mt-0.5"
                              />
                              <Label
                                htmlFor="guidelines-acceptance"
                                className="text-xs font-medium cursor-pointer leading-tight"
                              >
                                ☑ **I have read and agree to the CBL
                                Guidelines**
                              </Label>
                            </div>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </div>

              {/* Question 8: Payout Method */}
              <div className="space-y-3">
                <Label>
                  8. Preferred payout method for your leadership rewards:
                </Label>
                <Select
                  value={formData.payoutMethod}
                  onValueChange={(value) =>
                    handleInputChange('payoutMethod', value)
                  }
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your preferred payout method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="wallet">
                      Crypto Wallet (SOL/USDC)
                    </SelectItem>
                    <SelectItem value="paypal">PayPal</SelectItem>
                    <SelectItem value="venmo">Venmo</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Question 9: Additional Info */}
              <div className="space-y-2">
                <Label htmlFor="additionalInfo">
                  9. Optional: Anything else we should know?
                </Label>
                <Textarea
                  id="additionalInfo"
                  placeholder="Share any additional information, ideas, or special circumstances we should consider..."
                  value={formData.additionalInfo}
                  onChange={(e) =>
                    handleInputChange('additionalInfo', e.target.value)
                  }
                  rows={3}
                />
              </div>

              {/* Submit Button */}
              <div className="pt-6">
                <Button
                  type="submit"
                  disabled={!guidelinesAccepted || !formData.guidelines}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3"
                  size="lg"
                >
                  Submit Application
                </Button>
                <p className="text-sm text-green-200 text-center mt-3">
                  You'll receive a decision within the hour via email and in
                  your dashboard.
                </p>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Footer Info */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>
            Questions about the application process? Contact our support team or
            check the{' '}
            <a href="/cbl/learn-more" className="text-blue-600 hover:underline">
              CBL Learn More
            </a>{' '}
            page for additional details.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CBLApplicationPage;
