'use client';
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import * as playerEmailService from '@/lib/services/playerEmailService';

export default function SubmitPlayerEmailPage() {
  const [playerName, setPlayerName] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      await playerEmailService.addPlayerContact({
        playerId: crypto.randomUUID(), // Or get from user session
        playerName,
        emailAddress,
        isVerified: false,
        source: 'submission_form',
        preferences: { receivesNewsletter: true, receivesUpdates: true, receivesPromotions: false },
        status: 'active',
      });
      setSuccess(true);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto flex justify-center items-center h-screen">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Join Coach B's Mailing List</CardTitle>
          <CardDescription>Get the latest updates, news, and promotions directly from Coach B.</CardDescription>
        </CardHeader>
        <CardContent>
          {success ? (
            <div className="text-green-600">Thank you for subscribing!</div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="playerName">Your Name</Label>
                <Input id="playerName" value={playerName} onChange={e => setPlayerName(e.target.value)} required />
              </div>
              <div>
                <Label htmlFor="emailAddress">Email Address</Label>
                <Input id="emailAddress" type="email" value={emailAddress} onChange={e => setEmailAddress(e.target.value)} required />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="terms" required />
                <Label htmlFor="terms">I agree to the terms and conditions</Label>
              </div>
              {error && <div className="text-red-500">{error}</div>}
              <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Submitting...' : 'Subscribe'}</Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
