This document provides instructions on how to integrate Helio transactions into Google Sheets using the Helio API and Google App Script.[1]

Here's a summary of the steps:

**1. Get Started:**
*   Create a new Google Sheet.[1]
*   Open the App Script editor by going to `Extensions -> App Script`.[1]
*   Copy and paste the provided Javascript code into the editor, replacing the default `myFunction`.[1]
*   You will need to add your `HELIO_API_KEY` and `PUBLIC_KEY` to the script.[1] You can get these from your Helio Dashboard.[1]

**2. Save and Run:**
*   Save the script.[1]
*   Select the `main` function and click "Run".[1]
*   Approve any Google permissions if prompted.[1]
*   Your Helio transactions will then appear in the Google Sheet.[1]

**3. Add Automation:**
*   You can set up a trigger to automatically fetch new transactions on a schedule.[1]
*   In the App Script editor, go to "Triggers" (the clock icon).[1]
*   Click "Add Trigger" and configure it to run the `main` function at your desired time interval (e.g., every hour).[1]

The document also provides the full Javascript code for the Google App Script, which includes functions to get recent transactions, filter them, and write them to the sheet.[1] It also mentions that developers can customize headers and columns.[1]

Sources:
[1] Google App Script - Helio Docs (https://docs.hel.io/docs/google-app-script)