import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { saveEmailSubscription, emailExists } from '@/lib/emailSubscriptions';
import { getEmailService } from '@/lib/emailService';

// Validation schema for the subscription request
const subscriptionSchema = z.object({
  email: z.string().email('Invalid email format'),
  walletAddress: z.string().optional(),
  source: z.string().default('unknown')
});

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body = await request.json();
    
    // Validate the request data
    const validationResult = subscriptionSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: 'Invalid request data', 
          details: validationResult.error.errors 
        },
        { status: 400 }
      );
    }

    const { email, walletAddress, source } = validationResult.data;

    // Check if email already exists
    if (await emailExists(email)) {
      return NextResponse.json(
        { error: 'Email already subscribed' },
        { status: 409 }
      );
    }

    // Create subscription record
    const subscription = {
      id: uuidv4(),
      email,
      walletAddress: walletAddress || null,
      source,
      createdAt: new Date().toISOString()
    };

    // Save the subscription
    await saveEmailSubscription(subscription);

    // Send welcome email (don't fail if email service is unavailable)
    try {
      const emailService = getEmailService();
      await emailService.sendWelcomeEmail(email);
    } catch (error) {
      console.error('Failed to send welcome email:', error);
      // Continue without failing the subscription
    }

    // Return success response
    return NextResponse.json(
      {
        message: 'Successfully subscribed to email updates',
        subscriptionId: subscription.id
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Error processing subscription:', error);
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Handle unsupported methods
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}