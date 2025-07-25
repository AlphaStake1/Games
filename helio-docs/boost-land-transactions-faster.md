Boost is a service that speeds up Solana transactions by prioritizing them.[1] This is done by adding a small tip to the transaction.[1]

**To implement Boost, you need to:**

1.  **Get an API key:** Contact the Helio team to get your API key.[1]
2.  **Prepare a tip instruction:** Add a `SystemProgram.transfer` instruction to your transaction to send a small tip to a Boost wallet.[1]
3.  **Get the latest tip wallets:** Use the Helio API to get the most up-to-date list of tip wallets.[1]
4.  **Submit your transaction:** You can submit your transaction in two ways:
    - Use the Boost RPC URL with the standard `sendTransaction` method.[1]
    - Submit the transaction directly to the Boost API endpoint.[1]

The service uses Jito for security and high success rates.[1] If Helio's staked validators are faster, the tip is refunded, minus any agreed-upon costs.[1] Helio provides a dashboard to track transaction performance.[1]

Sources:
[1] Boost - Land Transactions Faster - Helio (https://docs.hel.io/docs/boost-land-transactions-faster)
