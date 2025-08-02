import { NextRequest, NextResponse } from 'next/server';

/**
 * X (Twitter) OAuth Callback Handler
 *
 * This endpoint handles the OAuth callback from X's authentication flow.
 * Required for X Developer Account approval and Eliza agent integration.
 */

interface XOAuthCallback {
  code?: string;
  state?: string;
  error?: string;
  error_description?: string;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const callbackData: XOAuthCallback = {
    code: searchParams.get('code') || undefined,
    state: searchParams.get('state') || undefined,
    error: searchParams.get('error') || undefined,
    error_description: searchParams.get('error_description') || undefined,
  };

  console.log('[X OAuth Callback] Received:', {
    ...callbackData,
    timestamp: new Date().toISOString(),
    userAgent: request.headers.get('user-agent'),
  });

  // Handle OAuth errors
  if (callbackData.error) {
    console.error(
      '[X OAuth Callback] Error:',
      callbackData.error,
      callbackData.error_description,
    );

    return NextResponse.json(
      {
        success: false,
        error: callbackData.error,
        description: callbackData.error_description,
      },
      { status: 400 },
    );
  }

  // Handle successful callback
  if (callbackData.code) {
    try {
      // TODO: Exchange code for access token when X API keys are available
      // const tokenResponse = await exchangeCodeForToken(callbackData.code);

      // For now, just log the successful callback
      console.log('[X OAuth Callback] Success - Authorization code received');

      // TODO: Store tokens securely for Eliza agents
      // await storeXTokensForEliza(tokenResponse);

      return NextResponse.json({
        success: true,
        message: 'X OAuth callback received successfully',
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('[X OAuth Callback] Token exchange failed:', error);

      return NextResponse.json(
        {
          success: false,
          error: 'token_exchange_failed',
          message: 'Failed to exchange authorization code for tokens',
        },
        { status: 500 },
      );
    }
  }

  // Handle missing required parameters
  return NextResponse.json(
    {
      success: false,
      error: 'missing_parameters',
      message: 'Missing required OAuth parameters',
    },
    { status: 400 },
  );
}

/**
 * Handle POST requests (some OAuth flows use POST)
 */
export async function POST(request: NextRequest) {
  console.log('[X OAuth Callback] POST request received');

  try {
    const body = await request.json();
    console.log('[X OAuth Callback] POST body:', body);

    return NextResponse.json({
      success: true,
      message: 'X OAuth POST callback received',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[X OAuth Callback] POST parsing failed:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'invalid_request',
        message: 'Invalid POST request format',
      },
      { status: 400 },
    );
  }
}

/**
 * TODO: Implement when X API credentials are available
 */
// async function exchangeCodeForToken(code: string) {
//   const tokenUrl = 'https://api.twitter.com/2/oauth2/token';
//
//   const response = await fetch(tokenUrl, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/x-www-form-urlencoded',
//       'Authorization': `Basic ${Buffer.from(`${process.env.TWITTER_CLIENT_ID}:${process.env.TWITTER_CLIENT_SECRET}`).toString('base64')}`,
//     },
//     body: new URLSearchParams({
//       grant_type: 'authorization_code',
//       code,
//       redirect_uri: process.env.TWITTER_REDIRECT_URI!,
//       code_verifier: 'stored_code_verifier', // TODO: Implement PKCE
//     }),
//   });
//
//   return response.json();
// }
