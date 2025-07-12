# 🤖 Coach B. — Operational Security (OpSec) Playbook

This document outlines the security-hardened procedures for setting up and operating the "Coach B." autonomous agent for the Football Squares dApp. The goal is to achieve maximum practical anonymity and security by compartmentalizing development, key management, and live operations.

---

## 1. Threat Model & Core Principles

Our operational security is based on mitigating specific risks.

| Area                  | Default Risk                                        | Mitigation Strategy                                                              |
| --------------------- | --------------------------------------------------- | -------------------------------------------------------------------------------- |
| **Network Traffic**   | ISP can see you are connecting to the Tor network.  | **VPN → Tor Chain**: Connect to a VPN *before* starting Tor. Your ISP only sees encrypted VPN traffic. |
| **Platform Isolation**| Host OS (e.g., Windows) can read/modify guest (WSL).| **Use a dedicated secure OS** (Tails, Whonix) for all sensitive operations. Keep WSL for development only. |
| **Wallet Keys**       | Hot wallets stored on a networked machine are vulnerable. | **Use a hardware wallet** or an air-gapped signing device. Never store private keys or seed phrases on a development machine. |
| **Account Recovery**  | Losing an anonymous email locks you out of services. | **Use offline recovery methods**: GPG-encrypted recovery codes or a secondary anonymous email. Never use a phone number. |
| **Database Access**   | Public-facing DBs can be exploited if misconfigured. | **Enable Row-Level Security (RLS)** on Supabase and use a service-role key stored securely, never client-side. |

---

## 2. The Anonymity Stack: VPN → Tor

For all operational tasks, route your traffic through a VPN first, then through the Tor network.

### Recommended Environments

| Environment                             | Pros                                                | Cons                               | Best For                                     |
| --------------------------------------- | --------------------------------------------------- | ---------------------------------- | -------------------------------------------- |
| **Tails OS (Live USB)**                 | Best isolation; amnesiac (no disk traces); MAC spoofing. | Requires reboot; slower performance. | **High-value operations**: Key generation, signing transactions, initial account setups. |
| **Whonix (in Qubes or VirtualBox)**     | Persistent; all traffic is forced through Tor.      | Heavier resource usage.            | **Continuous agent operation**: Running the "Coach B." bot 24/7. |
| **Tor Browser (on a hardened Linux VM)**| Familiar and easy to use.                           | Requires self-discipline; can be fingerprinted. | Day-to-day low-risk research.                |
| **WSL (Windows Subsystem for Linux)**   | Convenient for development.                         | **Low isolation**. Windows can read/modify WSL files. | **Not recommended for production operations.** |

**Recommendation:** Use your existing WSL environment for coding and testing. For all administrative and operational tasks (creating wallets, managing Supabase keys, etc.), boot into a **Tails OS** live session from a USB drive.

---

## 3. Step-by-Step Anonymous Setup (in a Tails Session)

Follow these steps inside a fresh Tails OS session to create your anonymous credentials.

### 3.1. Establish VPN → Tor Connection

1.  Boot Tails from your USB drive.
2.  Connect to your VPN (e.g., NordVPN, ProtonVPN) using its OpenVPN configuration file.
    ```bash
    # Example for NordVPN
    sudo openvpn --config /path/to/your/config.ovpn --auth-user-pass
    ```
3.  Confirm your IP address reflects the VPN server location (`curl ifconfig.me`).
4.  Launch the Tor Browser. It will automatically route its traffic through the active VPN connection.
5.  Verify your setup at `https://check.torproject.org`.

### 3.2. Create Anonymous Proton Mail Account

1.  In the Tor Browser, navigate to Proton's onion service: `protonirockerxow.onion`.
2.  Sign up for a free account. Use a randomly generated username.
3.  For human verification, choose the email option and use a temporary address from another privacy-respecting service.
4.  **Do not provide a phone number.**
5.  Download the recovery codes and save them to an encrypted volume (e.g., a GPG-encrypted file on a separate USB).

### 3.3. Create Anonymous Solana Wallet

The safest method is using a hardware wallet.

**Hardware Wallet (Recommended):**
1.  Connect your hardware wallet (e.g., Ledger, Trezor) to the computer.
2.  In the Tor Browser, access the wallet's web interface (e.g., `suite.trezor.io/web`).
3.  Generate a new wallet. **Write down the seed phrase on paper and store it securely offline.** Never type it or save it digitally.

**Software Wallet (If you must):**
1.  Use a Tor-aware wallet like Electrum, configured to use the SOCKS5 proxy at `127.0.0.1:9050`.
2.  Save the wallet file to a Veracrypt-encrypted volume.

### 3.4. Create Anonymous Supabase Project

1.  In the Tor Browser, sign up for a Supabase account using your new anonymous Proton Mail address.
2.  If Supabase blocks the connection, use the "New Circuit for this Site" feature in Tor Browser to get a new exit node and try again.
3.  Once in the dashboard, immediately configure security settings:
    *   **Authentication Providers**: Enable `Email` and `Anonymous`.
    *   **Row-Level Security (RLS)**: Enable RLS on all tables holding sensitive data.
        ```sql
        -- Example RLS policy: only allow anonymous users to read
        ALTER TABLE public.boards ENABLE ROW LEVEL SECURITY;
        CREATE POLICY "Allow anon read-only access"
        ON public.boards FOR SELECT
        TO anon
        USING (true);
        ```
4.  Copy your `anon key` and `service_role key`. Store the `service_role key` in an encrypted vault; it should never be exposed client-side.

---

## 4. Configuration & Operational Hygiene

### Secure Environment Variables

Create a `.env.secure` file for your agent's production environment. This file should be stored on an encrypted volume and only loaded at runtime.

```ini
# .env.secure

# Supabase
SUPABASE_URL="https://your-project.supabase.co"
SUPABASE_ANON_KEY="your-public-anon-key"
SUPABASE_SERVICE_KEY="your-secret-service-role-key" # Never expose this

# Solana
SOLANA_RPC_URL="https://api.mainnet-beta.solana.com"
ANCHOR_WALLET_PATH="/path/to/encrypted/volume/coachb-keypair.json"

# Email (Proton Bridge)
SMTP_HOST="127.0.0.1"
SMTP_PORT="1025"
SMTP_USER="your-anonymous-email@proton.me"
SMTP_PASS="your-proton-bridge-app-password"
```

### Day-to-Day Workflow

| Task                       | Recommended Environment & Practice                                        |
| -------------------------- | ------------------------------------------------------------------------- |
| **Code Editing & Testing** | Use your standard development machine (e.g., Windows + WSL).              |
| **Committing Code**        | Use your standard machine. Your Git identity can be public for open-source work. |
| **Creating Accounts**      | Use a **Tails OS** session over a VPN.                                    |
| **Signing Transactions**   | Use a **hardware wallet** connected to a Tails OS session.                |
| **Running the Agent**      | Deploy to a hardened, privacy-respecting VPS or a decentralized compute network like Akash. |

By strictly separating development from operations, you significantly reduce the risk of compromising the keys and credentials that secure the live application.