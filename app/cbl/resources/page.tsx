'use client';

export default function CBLResourcesPage() {
  const copyToClipboard = async (text: string) => {
    try {
      if (navigator?.clipboard) {
        await navigator.clipboard.writeText(text);
        alert('Copied to clipboard!');
      } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        alert('Copied to clipboard!');
      }
    } catch (error) {
      console.warn('Failed to copy:', error);
      alert('Failed to copy to clipboard');
    }
  };

  const emailTemplates = [
    {
      title: 'Welcome / Board-Launch Message',
      description:
        'Official welcome template with Coach B escalation link - REQUIRED for all boards',
      subject: '🏈 Welcome to {{board_name}} on Football Squares!',
      content: `Hi {{player_first_name}},

Thanks for grabbing a square in **{{board_name}}** hosted by **{{cbl_display_name}}**.  

Key points to know:
1. **Game Date:** {{game_date}}  
2. **Entry Fee:** {{entry_fee}} {{currency}}  
3. **Payouts:** Auto-distributed in USDC-SPL ≈ 5 min after the final whistle.  
4. **Board Rules:** {{rules_link}}

🤝 **Need help or notice abuse?**  
Click **[Report to Coach B](https://app.footballsquares.xyz/report?board_id={{board_id}}&player={{player_wallet}})**
(or find "Report" in your dashboard).

Let's have a fun and fair game!

— {{cbl_display_name}}`,
      category: 'required',
      tokens: [
        'board_name',
        'player_first_name',
        'cbl_display_name',
        'game_date',
        'entry_fee',
        'currency',
        'rules_link',
        'board_id',
        'player_wallet',
      ],
    },
    {
      title: 'One-Hour Reminder',
      description: 'Quick reminder before kickoff to verify wallet settings',
      subject: 'Kickoff in 1 hour – confirm your wallet!',
      content: `Heads-up: **{{board_name}}** starts in 60 minutes.  
Ensure your payout wallet ({{player_wallet_short}}…) is correct in **My Account → Wallets**.  
Questions → reply or hit Report link above.`,
      category: 'engagement',
      tokens: ['board_name', 'player_wallet_short'],
    },
    {
      title: 'Post-Game Winner Announcement',
      description: 'Celebrate winners with automatic payout confirmation',
      subject: '🎉 {{board_name}} Results - Congratulations Winners!',
      content: `🎉 Congrats {{winner_handle}} – your square hit {{home_score}}-{{away_score}}!  
USDC payout is locked; expect on-chain confirmation soon.  
All results: {{board_results_link}}

Thanks everyone for a great game! Next board coming soon.`,
      category: 'results',
      tokens: [
        'board_name',
        'winner_handle',
        'home_score',
        'away_score',
        'board_results_link',
      ],
    },
  ];

  const marketingMaterials = [
    {
      title: 'X (Twitter) Post Template',
      description: 'Ready-to-use Twitter/X content with tokens',
      type: 'Social Media',
      content:
        '🏈 New Football Squares board live! ${{entry_fee}} per square, auto-payouts in USDC. Join before kickoff 👉 {{board_link}} #FootballSquares',
      tokens: ['entry_fee', 'board_link'],
    },
    {
      title: 'Discord Announcement',
      description: 'Community announcement for Discord servers',
      type: 'Social Media',
      content:
        '@here Grab a square on **{{board_name}}**! No KYC, instant USDC prizes. → {{board_link}}',
      tokens: ['board_name', 'board_link'],
    },
  ];

  const styleGuide = [
    {
      name: 'Primary Blue',
      value: '#255c7e',
      usage: 'Headers, CTAs, primary elements',
    },
    {
      name: 'Accent Orange',
      value: '#ed5925',
      usage: 'Highlights, notifications, alerts',
    },
    {
      name: 'Background Gray',
      value: '#f8fafc',
      usage: 'Page backgrounds, sections',
    },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">
          CBL Resources
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
          Everything you need to build and grow your Football Squares community.
          Templates, materials, and guidelines to ensure success.
        </p>
      </div>

      {/* Email Templates Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-6 flex items-center">
          <span className="mr-3">📧</span>
          Email Templates
        </h2>

        <div className="space-y-6">
          {emailTemplates.map((template, index) => (
            <div
              key={index}
              className="border border-gray-200 dark:border-gray-700 rounded-lg p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                    {template.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">
                    {template.description}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    template.category === 'required'
                      ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                  }`}
                >
                  {template.category}
                </span>
              </div>

              {/* Subject Line */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Subject Line:
                </label>
                <div className="flex items-center gap-2">
                  <code className="flex-1 bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded text-sm">
                    {template.subject}
                  </code>
                  <button
                    onClick={() => copyToClipboard(template.subject)}
                    className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                  >
                    Copy
                  </button>
                </div>
              </div>

              {/* Available Tokens */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Available Tokens:
                </label>
                <div className="flex flex-wrap gap-2">
                  {template.tokens.map((token) => (
                    <span
                      key={token}
                      className="bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 px-2 py-1 rounded text-xs"
                    >
                      {`{{${token}}}`}
                    </span>
                  ))}
                </div>
              </div>

              {/* Email Content */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email Content:
                </label>
                <div className="relative">
                  <pre className="bg-gray-100 dark:bg-gray-700 p-4 rounded text-sm whitespace-pre-wrap max-h-48 overflow-y-auto border">
                    {template.content}
                  </pre>
                  <button
                    onClick={() => copyToClipboard(template.content)}
                    className="absolute top-2 right-2 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-xs"
                  >
                    Copy
                  </button>
                </div>
              </div>

              {/* Required Template Warning */}
              {template.category === 'required' && (
                <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 p-3 rounded">
                  <p className="text-sm text-blue-800 dark:text-blue-300">
                    <strong>Required Template:</strong> All CBLs must use this
                    template to ensure players know how to report issues to
                    Coach B.
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Marketing Materials Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-6 flex items-center">
          <span className="mr-3">📱</span>
          Marketing Materials
        </h2>

        <div className="space-y-6">
          {marketingMaterials.map((material, index) => (
            <div
              key={index}
              className="border border-gray-200 dark:border-gray-700 rounded-lg p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                    {material.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">
                    {material.description}
                  </p>
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-full text-xs font-medium">
                  {material.type}
                </span>
              </div>

              {/* Available Tokens */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Available Tokens:
                </label>
                <div className="flex flex-wrap gap-2">
                  {material.tokens.map((token) => (
                    <span
                      key={token}
                      className="bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 px-2 py-1 rounded text-xs"
                    >
                      {`{{${token}}}`}
                    </span>
                  ))}
                </div>
              </div>

              {/* Content */}
              <div className="relative">
                <pre className="bg-gray-100 dark:bg-gray-700 p-4 rounded text-sm whitespace-pre-wrap border">
                  {material.content}
                </pre>
                <button
                  onClick={() => copyToClipboard(material.content)}
                  className="absolute top-2 right-2 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-xs"
                >
                  Copy
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Style Guide Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-6 flex items-center">
          <span className="mr-3">🎨</span>
          Style Guide
        </h2>

        <div className="space-y-4">
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            Brand Colors
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Official color palette for all materials
          </p>

          <div className="grid gap-4">
            {styleGuide.map((color, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border"
              >
                <div>
                  <div className="font-medium text-gray-900 dark:text-gray-100">
                    {color.name}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {color.usage}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <code className="bg-white dark:bg-gray-800 px-3 py-1 rounded border text-sm">
                    {color.value}
                  </code>
                  <div
                    className="w-8 h-8 rounded border border-gray-300"
                    style={{ backgroundColor: color.value }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Help Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Need More Help?</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Can't find what you're looking for? Our team is here to help you
          create custom materials for your community.
        </p>
        <div className="flex gap-4">
          <button className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 font-medium">
            Contact Support
          </button>
          <button className="border border-gray-300 dark:border-gray-600 px-6 py-2 rounded hover:bg-gray-50 dark:hover:bg-gray-700 font-medium">
            Request Custom Template
          </button>
        </div>
      </div>
    </div>
  );
}
