import React from 'react';

export default function CryptoBasicsContent() {
  return (
    <div className="prose dark:prose-invert max-w-none">
      <h1>Crypto Basics: Your Beginner's Guide</h1>

      <p>
        <em>Last updated: 5 July 2025</em>
      </p>

      <p>
        Welcome to Football Squares' comprehensive Crypto Basics guide! This
        resource is designed for absolute beginners looking to understand
        cryptocurrency wallets, how to acquire crypto, transfer digital assets
        securely, and avoid common scams. Whether you're new to crypto or just
        need a refresher, this guide will help you navigate the Web3 world
        safely.
      </p>

      <hr className="my-8" />

      <h2 className="mt-12">Custodial vs. Non-Custodial Wallets</h2>
      <p className="text-lg text-muted-foreground">
        <strong>Why this matters:</strong> Understanding the difference between
        custodial and non-custodial wallets is the most important first step. It
        determines who controls your funds: a third party or you. This choice
        impacts your security, freedom, and ability to interact with
        decentralized applications.
      </p>

      <p>
        <strong>Custodial wallets</strong> are managed by a third party (e.g., a
        crypto exchange or app) that holds your private keys on your behalf.
        Think of it like a bank holding your money.
      </p>
      <ul className="list-disc pl-6">
        <li>
          <strong>Control:</strong> The third party controls your private keys.
        </li>
        <li>
          <strong>Ease of Use:</strong> User-friendly, with features like
          password resets and customer support.
        </li>
        <li>
          <strong>Trust:</strong> You must trust the provider to secure your
          assets.
        </li>
        <li>
          <strong>Verification:</strong> Often requires identity verification
          (KYC).
        </li>
        <li>
          <strong>Compatibility:</strong> Typically not compatible with
          decentralized apps (dApps).
        </li>
      </ul>

      <p>
        <strong>Non-custodial wallets</strong> (or <strong>self-custody</strong>{' '}
        wallets) put <strong>you</strong> in complete control. "Not your keys,
        not your coins" is the guiding principle.
      </p>
      <ul className="list-disc pl-6">
        <li>
          <strong>Control:</strong> You hold your private keys, giving you full
          control over your funds.
        </li>
        <li>
          <strong>Responsibility:</strong> You are solely responsible for
          securing your wallet and recovery phrase.
        </li>
        <li>
          <strong>Anonymity:</strong> No KYC is required, allowing for direct
          interaction with blockchain apps.
        </li>
        <li>
          <strong>Compatibility:</strong> Freely connect to dApps like DeFi
          exchanges, NFT marketplaces, and games.
        </li>
      </ul>

      <h3 className="mt-8">Mobile (Software) vs. Hardware Wallets</h3>

      <p>
        Non-custodial wallets come in two main forms: software and hardware.
      </p>
      <div className="pl-6">
        <p>
          <strong>Software Wallets (Hot Wallets):</strong>
        </p>
        <ul className="list-disc pl-6">
          <li>
            An app or program on your phone or computer (e.g., MetaMask, Trust
            Wallet).
          </li>
          <li>
            Connected to the internet, offering convenience for daily use.
          </li>
          <li>
            Considered "hot" because they are more exposed to online threats.
          </li>
        </ul>
        <p className="mt-4">
          <strong>Hardware Wallets (Cold Storage):</strong>
        </p>
        <ul className="list-disc pl-6">
          <li>
            A physical device (e.g., Ledger, Trezor) that stores keys offline.
          </li>
          <li>
            Keys never touch an internet-connected device, offering maximum
            security.
          </li>
          <li>
            Requires physical access to the device to approve transactions.
          </li>
        </ul>
      </div>

      <p>
        For beginners, mobile/software wallets are a great starting point for
        convenience. Just remember that they live on your phone or PC – so you
        should secure those devices (with passwords, biometrics, antivirus,
        etc.) as carefully as you would secure the wallet itself. Hardware
        wallets are recommended once you start holding larger amounts of crypto
        that you want to protect long-term. Many people use a combination: a
        mobile wallet for small, daily-use funds, and a hardware wallet to{' '}
        <strong>hold savings or high-value assets in cold storage</strong>.
      </p>

      <hr className="my-8" />

      <h2 className="mt-12">Wallet Security: DOs and DON'Ts</h2>
      <p className="text-lg text-muted-foreground">
        <strong>Why this matters:</strong> In crypto, you are your own bank.
        Unlike traditional finance, there's often no one to call if you lose
        access to your funds or get scammed. Following these security best
        practices is non-negotiable for keeping your assets safe.
      </p>

      <p>
        Keeping your crypto safe requires good security habits. Here are some{' '}
        <strong>DOs and DON'Ts</strong> for wallet security:
      </p>

      <ul>
        <li>
          <strong>DO:</strong>{' '}
          <strong>Safeguard your Secret Recovery Phrase (seed phrase)</strong>{' '}
          offline. Upon creating a non-custodial wallet, you'll get a 12- or
          24-word recovery phrase – write it down on paper (or engrave it on
          metal) and store it in a secure place. It's wise to keep{' '}
          <strong>multiple copies</strong> in separate safe locations (e.g. one
          at home and one in a bank deposit box) in case of fire or loss. This
          phrase is the master key to your wallet.
        </li>
        <li>
          <strong>DON'T:</strong>{' '}
          <strong>Never share your recovery phrase or private keys</strong> with
          anyone – no one from support will ever need it. If someone asks for
          your seed phrase (via email, Discord, Telegram, etc.),{' '}
          <strong>they are trying to scam you</strong>. Anyone who has those
          words can immediately access and spend <em>all</em> of your funds.
          Keep it secret and offline.
        </li>
        <li>
          <strong>DO:</strong> <strong>Use strong, unique passwords</strong> for
          your wallet app (and email/exchange accounts). Enable app-lock
          features like biometrics (fingerprint/Face ID) or a PIN for an extra
          layer of security on mobile wallets. If your wallet supports
          two-factor authentication (2FA), use an authenticator app rather than
          SMS for better security.
        </li>
        <li>
          <strong>DON'T:</strong>{' '}
          <strong>Avoid saving your seed phrase digitally</strong>. Do not take
          screenshots, photos, or store the phrase in cloud storage or email
          drafts. If it's on any online device, it's vulnerable to malware. Keep
          it in physical form only. Likewise, don't copy-paste it on websites –
          only enter it into the official wallet app when restoring a wallet.
        </li>
        <li>
          <strong>DO:</strong>{' '}
          <strong>Keep your apps and devices updated.</strong> Software updates
          often include critical security patches. Always install the latest
          version of your wallet app and updates for your phone/OS to patch
          vulnerabilities. Only download wallet apps or browser extensions from{' '}
          <strong>official sources</strong> (the project's website or official
          app store listings) to avoid fake apps.
        </li>
        <li>
          <strong>DO:</strong>{' '}
          <strong>Double-check addresses and transactions.</strong> When sending
          crypto, <strong>always verify the recipient address</strong>, the
          amount, and the correct network before confirming. Crypto transactions
          are irreversible – a typo in the address can send funds to the wrong
          place permanently. It helps to{' '}
          <strong>send a small test transaction</strong> first if you're sending
          a large amount to a new address. Many wallets let you use QR code
          scanning or copying to avoid manual typing errors.
        </li>
        <li>
          <strong>DON'T:</strong>{' '}
          <strong>Don't rush or act on panic prompts.</strong> Be wary of any
          pop-ups or messages urging you to "urgently" do something with your
          wallet (e.g. "Your account is compromised, give us your keys!" – this
          is fake). <strong>Never click random links</strong> that claim you won
          crypto or need to "verify" your wallet – these are often phishing
          attempts.
        </li>
        <li>
          <strong>DON'T:</strong>{' '}
          <strong>Don't leave your wallet unlocked or unattended.</strong> If
          you're using a browser extension like MetaMask, make sure to log out
          or lock it when not in use, especially on a shared or public computer.
          On mobile, have a strong lock screen. Treat your crypto like cash –
          you wouldn't leave your wallet open on a cafe table.
        </li>
        <li>
          <strong>DO:</strong>{' '}
          <strong>Consider a hardware wallet for large holdings.</strong> For
          significant amounts of crypto, use a reputable hardware wallet
          (Ledger, Trezor, etc.) to store your funds offline. You can still use
          a software wallet for day-to-day transactions (keeping only a spending
          amount there), while the bulk stays in cold storage. This reduces the
          risk of a single hack draining everything.
        </li>
        <li>
          <strong>DON'T:</strong>{' '}
          <strong>Don't keep all funds on exchanges or in one device.</strong>{' '}
          Spread out risk. Holding coins on an exchange (custodial) means you're
          trusting that platform's security. If you're not actively trading,
          it's generally safer to withdraw assets to your own wallet. Similarly,
          try not to load a mobile wallet with more value than you're willing to
          carry — just like you wouldn't carry all your savings in cash on you.
        </li>
      </ul>

      <p>
        By following these practices, you greatly reduce the chance of losing
        funds to accidents or theft. Crypto puts you in control of your money,
        which is empowering but also requires vigilance.
      </p>

      <hr className="my-8" />

      <h2 className="mt-12">How to Buy Crypto on Popular Platforms</h2>
      <p className="text-lg text-muted-foreground">
        <strong>Why this matters:</strong> To get started, you need to convert
        traditional currency (like US Dollars) into cryptocurrency. The most
        common way is through a centralized exchange or a financial app. Here
        are beginner-friendly, step-by-step guides for several popular services.
      </p>

      <h3>Robinhood</h3>
      <p>
        Best for users who already have a Robinhood account for stocks. Simple
        interface, but limited crypto selection and withdrawal features.
      </p>
      <ol>
        <li>
          <strong>Open the Robinhood App:</strong> Log in to your account.
        </li>
        <li>
          <strong>Navigate to Crypto:</strong> Tap the "Browse" icon and select
          "Cryptocurrency."
        </li>
        <li>
          <strong>Choose a Crypto:</strong> Select the cryptocurrency you want
          to buy (e.g., Bitcoin, Ethereum).
        </li>
        <li>
          <strong>Place Your Order:</strong> Tap "Trade," then "Buy." Enter the
          amount in dollars you wish to purchase.
        </li>
        <li>
          <strong>Review and Confirm:</strong> Check the order details (amount,
          price) and swipe up to submit. The crypto will appear in your account.
        </li>
        <li>
          <strong>Note on Withdrawals:</strong> To send crypto to your own
          non-custodial wallet, you must use Robinhood's "Crypto Wallets"
          feature and enable transfers, which may require additional identity
          verification.
        </li>
      </ol>

      <h3>Cash App</h3>
      <p>
        Extremely simple for buying, selling, and sending Bitcoin. Ideal for
        beginners making their first Bitcoin purchase.
      </p>
      <ol>
        <li>
          <strong>Open Cash App:</strong> Go to the home screen.
        </li>
        <li>
          <strong>Tap the Bitcoin Tab:</strong> Find the Bitcoin icon (a "B") on
          the bottom navigation bar.
        </li>
        <li>
          <strong>Tap "Buy":</strong> Select "Buy" and choose a preset amount or
          enter a custom dollar amount.
        </li>
        <li>
          <strong>Confirm Your PIN/Biometrics:</strong> Authorize the purchase
          with your security details.
        </li>
        <li>
          <strong>Send to a Wallet:</strong> To withdraw, tap the paper airplane
          icon (Send). You can scan a wallet's QR code or paste the address
          manually. Always double-check the address!
        </li>
      </ol>

      <h3>Venmo</h3>
      <p>
        Good for users who are already active on Venmo and want to easily buy
        small amounts of crypto without leaving the app.
      </p>
      <ol>
        <li>
          <strong>Open Venmo:</strong> Navigate to the "Crypto" tab from the
          home screen.
        </li>
        <li>
          <strong>Select a Cryptocurrency:</strong> Choose from the available
          options (e.g., Bitcoin, Ethereum, Litecoin).
        </li>
        <li>
          <strong>Tap "Buy":</strong> Enter the dollar amount you want to
          purchase.
        </li>
        <li>
          <strong>Review and Purchase:</strong> The app will show you the
          current price and fee. Confirm the transaction.
        </li>
        <li>
          <strong>Important Note:</strong> As of now, crypto purchased on Venmo
          can be sent to other Venmo users but sending to an external,
          non-custodial wallet address requires additional steps and
          verification similar to Robinhood.
        </li>
      </ol>

      <h3>Gemini</h3>
      <p>
        A full-featured cryptocurrency exchange with a wider variety of assets
        and trading tools. Good for those ready for a more traditional exchange
        experience.
      </p>
      <ol>
        <li>
          <strong>Create and Verify Account:</strong> Sign up on the Gemini
          website or app and complete the required identity verification (KYC).
        </li>
        <li>
          <strong>Fund Your Account:</strong> Link a bank account (via ACH) or
          wire transfer funds to your Gemini account.
        </li>
        <li>
          <strong>Find Your Crypto:</strong> Use the "Market" to find the
          cryptocurrency you want to buy.
        </li>
        <li>
          <strong>Place a Buy Order:</strong> Click "Buy," select your payment
          method, enter the amount, and confirm the transaction.
        </li>
        <li>
          <strong>Withdraw to Your Wallet:</strong> Go to the "Transfer" or
          "Withdraw" section. Select the crypto, enter your non-custodial wallet
          address, specify the amount, and confirm the withdrawal after a
          security check (often 2FA).
        </li>
      </ol>

      <h3>Kraken</h3>
      <p>
        One of the oldest and most respected exchanges, known for good security
        and a wide range of available cryptocurrencies.
      </p>
      <ol>
        <li>
          <strong>Sign Up and Verify:</strong> Create an account on Kraken and
          complete the necessary verification levels.
        </li>
        <li>
          <strong>Deposit Funds:</strong> Go to "Funding," select your currency
          (e.g., USD), and follow the instructions to deposit via bank transfer.
        </li>
        <li>
          <strong>Navigate to "Trade":</strong> Use the simple "Buy Crypto"
          widget on the main page for an easy purchase.
        </li>
        <li>
          <strong>Enter Purchase Details:</strong> Select the crypto you want to
          buy and the currency you're paying with. Enter the amount and click to
          review.
        </li>
        <li>
          <strong>Confirm and Withdraw:</strong> After purchase, go back to
          "Funding," find your new crypto, and click "Withdraw." Enter your
          external wallet address carefully, enter the amount, and confirm.
        </li>
      </ol>

      <h3>Crypto.com</h3>
      <p>
        A popular mobile-first platform known for its large user base and
        extensive marketing. The app makes buying easy.
      </p>
      <ol>
        <li>
          <strong>Download the App and Sign Up:</strong> Create your account and
          complete identity verification.
        </li>
        <li>
          <strong>Link a Payment Method:</strong> Set up a bank transfer to fund your account.
        </li>
        <li>
          <strong>Buy Crypto:</strong> Tap the "Trade" button on the home
          screen, then "Buy." Select the cryptocurrency you want.
        </li>
        <li>
          <strong>Add Payment Source:</strong> Choose your wallet
          and confirm the purchase.
        </li>
        <li>
          <strong>Transfer to External Wallet:</strong> Go to your "Crypto
          Wallet," select the asset, and tap "Transfer" &gt; "Withdraw" &gt;
          "External Wallet." Add your non-custodial wallet address, enter the
          amount, and confirm.
        </li>
      </ol>

      <h3>Uphold</h3>
      <p>
        A versatile platform that allows you to trade between different asset
        classes, not just crypto. Uses a card-based interface.
      </p>
      <ol>
        <li>
          <strong>Create an Uphold Account:</strong> Sign up and verify your
          identity.
        </li>
        <li>
          <strong>Fund Your Account:</strong> Add funds using a bank account or other supported methods.
        </li>
        <li>
          <strong>Go to "Transact":</strong> This is Uphold's main trading
          interface.
        </li>
        <li>
          <strong>Set Up the Transaction:</strong> In the "From" field, select
          your funding source (e.g., your USD account). In the "To" field,
          search for and select the cryptocurrency you want to buy.
        </li>
        <li>
          <strong>Enter Amount and Confirm:</strong> Input the dollar amount,
          preview the trade, and confirm. The crypto will be added to your
          portfolio.
        </li>
        <li>
          <strong>Withdraw to a Network:</strong> To send to an external wallet,
          choose the crypto asset from your portfolio, select "Withdraw to a
          network," choose the correct blockchain network, and paste your wallet
          address.
        </li>
      </ol>

      <p className="mt-8">
        <strong>Sources:</strong> Custodial vs. Non-custodial definitions and
        examples; Wallet security best practices from MetaMask and community
        guides; Mobile wallet usage from official help docs; Scam avoidance tips
        from Trust Wallet's security guide and MetaMask warnings.
      </p>
    </div>
  );
}
