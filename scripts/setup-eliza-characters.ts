// scripts/setup-eliza-characters.ts
/**
 * ElizaOS Character Integration Setup Script
 *
 * Initializes all Football Squares characters with proper:
 * - Memory scope assignments
 * - Plugin configurations
 * - Action registrations
 * - Platform credentials
 */

import fs from 'fs';
import path from 'path';

interface CharacterConfig {
  name: string;
  character: any; // ElizaOS character JSON
  plugins: string[];
  memoryScopes: string[];
  platforms: string[];
  actions: string[];
}

const CHARACTERS_DIR = path.join(__dirname, '../characters');
const OUTPUT_DIR = path.join(__dirname, '../eliza-config');

/**
 * Load all character JSON files
 */
async function loadCharacters(): Promise<CharacterConfig[]> {
  const characterFiles = fs
    .readdirSync(CHARACTERS_DIR)
    .filter((file) => file.endsWith('.json'))
    .filter((file) => !file.includes('README'));

  const characters: CharacterConfig[] = [];

  for (const file of characterFiles) {
    const filePath = path.join(CHARACTERS_DIR, file);
    const character = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    characters.push({
      name: character.name || path.basename(file, '.json'),
      character,
      plugins: character.plugins || [],
      memoryScopes: character.memoryScopes || [],
      platforms: character.clients || [],
      actions: character.actions || [],
    });
  }

  return characters;
}

/**
 * Generate ElizaOS character configuration
 */
function generateElizaConfig(characters: CharacterConfig[]) {
  const config = {
    characters: characters.map((char) => ({
      ...char.character,
      // Add runtime configuration
      runtime: {
        memoryManager: {
          scopes: char.memoryScopes,
        },
        actionRegistry: char.actions,
        platformClients: char.platforms,
        plugins: char.plugins,
      },
      // Add Fry integration
      fryIntegration: {
        enabled: true,
        supportLevel: determineSupportLevel(char.name),
        escalationRules: generateEscalationRules(char.name),
        responseStyle: determineResponseStyle(char.name),
      },
    })),
    // Global ElizaOS configuration
    settings: {
      memoryProvider: 'postgresql',
      logLevel: 'info',
      hotReload: true,
      concurrentCharacters: characters.length,
    },
    // Plugin configuration
    plugins: getUniquePlugins(characters),
    // Memory scopes configuration
    memoryScopes: {
      PUBLIC_GAME: {
        description: 'Public game state and leaderboards',
        retention: '30 days',
        accessible: [
          'Coach_B',
          'Coach_Right',
          'Patel_Neil',
          'Morgan_Reese',
          'OC_Phil',
        ],
      },
      BOARD_STATE: {
        description: 'Current board configurations and square assignments',
        retention: '7 days',
        accessible: ['Trainer_Reviva', 'Commissioner_Jerry'],
      },
      USER_CHAT: {
        description: 'User support conversations and history',
        retention: '90 days',
        accessible: ['Trainer_Reviva', 'Coach_B', 'Coach_Right'],
      },
      TX_FINANCE: {
        description: 'Transaction history and financial records',
        retention: '7 years',
        accessible: ['Jordan_Banks', 'Commissioner_Jerry'],
      },
      SYS_INTERNAL: {
        description: 'System logs and internal operations',
        retention: '30 days',
        accessible: [
          'Dean_Security',
          'Commissioner_Jerry',
          'Morgan_Reese',
          'Patel_Neil',
        ],
      },
    },
  };

  return config;
}

/**
 * Determine Fry support level based on character role
 */
function determineSupportLevel(
  characterName: string,
): 'full' | 'escalation' | 'monitoring' {
  const supportRoles = ['Trainer_Reviva', 'Coach_B'];
  const escalationRoles = ['Dean_Security', 'Commissioner_Jerry'];

  if (supportRoles.includes(characterName)) return 'full';
  if (escalationRoles.includes(characterName)) return 'escalation';
  return 'monitoring';
}

/**
 * Generate escalation rules for character
 */
function generateEscalationRules(characterName: string) {
  const escalationMap: Record<string, any> = {
    Coach_B: {
      escalateTo: 'Trainer_Reviva',
      conditions: ['technical_issue', 'wallet_problem', 'transaction_failure'],
      threshold: 'medium',
    },
    Trainer_Reviva: {
      escalateTo: 'Dean_Security',
      conditions: [
        'system_issue',
        'security_concern',
        'infrastructure_problem',
      ],
      threshold: 'high',
    },
    Dean_Security: {
      escalateTo: 'Commissioner_Jerry',
      conditions: ['critical_system_failure', 'executive_decision_required'],
      threshold: 'critical',
    },
    Coach_Right: {
      escalateTo: 'Trainer_Reviva',
      conditions: ['technical_support_needed'],
      threshold: 'medium',
    },
    Morgan_Reese: {
      escalateTo: 'Commissioner_Jerry',
      conditions: ['partnership_approval', 'business_decision'],
      threshold: 'high',
    },
    Patel_Neil: {
      escalateTo: 'Commissioner_Jerry',
      conditions: ['campaign_approval', 'budget_decision'],
      threshold: 'medium',
    },
    Jordan_Banks: {
      escalateTo: 'Commissioner_Jerry',
      conditions: ['financial_approval', 'audit_issue'],
      threshold: 'high',
    },
    OC_Phil: {
      escalateTo: 'Commissioner_Jerry',
      conditions: ['cbl_policy_decision'],
      threshold: 'medium',
    },
  };

  return (
    escalationMap[characterName] || {
      escalateTo: 'Commissioner_Jerry',
      conditions: ['executive_decision_required'],
      threshold: 'critical',
    }
  );
}

/**
 * Determine response style for Fry integration
 */
function determineResponseStyle(characterName: string): string {
  const styleMap: Record<string, string> = {
    Trainer_Reviva: 'empathetic_detailed',
    Coach_B: 'supportive_sports',
    Dean_Security: 'technical_terse',
    Commissioner_Jerry: 'executive_summary',
    Coach_Right: 'community_friendly',
    Morgan_Reese: 'professional_business',
    Patel_Neil: 'metric_focused',
    Jordan_Banks: 'financial_precise',
    OC_Phil: 'educational_supportive',
  };

  return styleMap[characterName] || 'professional_generic';
}

/**
 * Get unique plugins across all characters
 */
function getUniquePlugins(characters: CharacterConfig[]): string[] {
  const allPlugins = characters.flatMap((char) => char.plugins);
  return Array.from(new Set(allPlugins));
}

/**
 * Generate platform client configurations
 */
function generatePlatformConfigs(characters: CharacterConfig[]) {
  const platformConfigs = {
    discord: {
      enabled: true,
      token: process.env.DISCORD_BOT_TOKEN,
      characters: characters
        .filter((char) => char.platforms.includes('discord'))
        .map((char) => char.name),
      channels: {
        general: 'general',
        support: 'support',
        announcements: 'announcements',
        alerts: 'alerts',
      },
    },
    telegram: {
      enabled: true,
      token: process.env.TELEGRAM_BOT_TOKEN,
      characters: characters
        .filter((char) => char.platforms.includes('telegram'))
        .map((char) => char.name),
    },
    twitter: {
      enabled: true,
      apiKey: process.env.TWITTER_API_KEY,
      apiSecret: process.env.TWITTER_API_SECRET,
      accessToken: process.env.TWITTER_ACCESS_TOKEN,
      accessTokenSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
      characters: characters
        .filter((char) => char.platforms.includes('twitter'))
        .map((char) => char.name),
    },
  };

  return platformConfigs;
}

/**
 * Generate action configurations
 */
function generateActionConfigs(characters: CharacterConfig[]) {
  const actions = {
    // Trainer Reviva actions
    troubleshoot_wallet: {
      description: 'Help users troubleshoot wallet connection issues',
      characters: ['Trainer_Reviva'],
      requiresFry: true,
      fryDiagnosticType: 'wallet',
    },
    analyze_transaction: {
      description: 'Analyze failed or missing transactions',
      characters: ['Trainer_Reviva', 'Dean_Security'],
      requiresFry: true,
      fryDiagnosticType: 'transaction',
    },
    cross_chain_recovery: {
      description: 'Handle cross-chain token recovery scenarios',
      characters: ['Trainer_Reviva', 'Dean_Security', 'Commissioner_Jerry'],
      requiresFry: true,
      fryDiagnosticType: 'cross_chain_recovery',
    },

    // Dean Security actions
    security_scan: {
      description: 'Run security scans and threat analysis',
      characters: ['Dean_Security'],
      requiresFry: false,
      semgrepIntegration: true,
    },
    incident_response: {
      description: 'Handle security incidents and alerts',
      characters: ['Dean_Security'],
      requiresFry: true,
      fryDiagnosticType: 'rpc',
    },

    // Commissioner Jerry actions
    resource_allocation: {
      description: 'Approve resource allocation for issue resolution',
      characters: ['Commissioner_Jerry'],
      requiresFry: false,
      executiveLevel: true,
    },
    escalation_review: {
      description: 'Review and decide on escalated issues',
      characters: ['Commissioner_Jerry'],
      requiresFry: true,
      fryDiagnosticType: 'program',
    },

    // Coach B actions
    onboard_player: {
      description: 'Guide new players through game setup',
      characters: ['Coach_B'],
      requiresFry: false,
    },
    explain_rules: {
      description: 'Explain Football Squares rules and mechanics',
      characters: ['Coach_B', 'OC_Phil'],
      requiresFry: false,
    },

    // Morgan Reese actions
    qualify_partnership: {
      description: 'Assess and qualify potential partnerships',
      characters: ['Morgan_Reese'],
      requiresFry: false,
      crmIntegration: true,
    },

    // Patel Neil actions
    track_metrics: {
      description: 'Track and analyze growth metrics',
      characters: ['Patel_Neil'],
      requiresFry: false,
      analyticsIntegration: true,
    },

    // Jordan Banks actions
    financial_audit: {
      description: 'Review financial transactions and compliance',
      characters: ['Jordan_Banks'],
      requiresFry: true,
      fryDiagnosticType: 'validator',
      auditLevel: true,
    },
  };

  return actions;
}

/**
 * Main setup function
 */
async function setupElizaCharacters() {
  console.log('🚀 Setting up ElizaOS Character Integration...\n');

  try {
    // Create output directory
    if (!fs.existsSync(OUTPUT_DIR)) {
      fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }

    // Load character configurations
    console.log('📁 Loading character configurations...');
    const characters = await loadCharacters();
    console.log(
      `   Found ${characters.length} characters: ${characters.map((c) => c.name).join(', ')}\n`,
    );

    // Generate ElizaOS configuration
    console.log('⚙️ Generating ElizaOS configuration...');
    const elizaConfig = generateElizaConfig(characters);

    // Generate platform configurations
    console.log('🌐 Generating platform configurations...');
    const platformConfigs = generatePlatformConfigs(characters);

    // Generate action configurations
    console.log('🎯 Generating action configurations...');
    const actionConfigs = generateActionConfigs(characters);

    // Write configuration files
    const configFiles = {
      'eliza-config.json': elizaConfig,
      'platform-config.json': platformConfigs,
      'actions-config.json': actionConfigs,
    };

    for (const [filename, config] of Object.entries(configFiles)) {
      const filepath = path.join(OUTPUT_DIR, filename);
      fs.writeFileSync(filepath, JSON.stringify(config, null, 2));
      console.log(`   ✅ ${filename} written`);
    }

    // Generate environment template
    console.log('\n📝 Generating environment template...');
    const envTemplate = generateEnvironmentTemplate(characters);
    fs.writeFileSync(path.join(OUTPUT_DIR, '.env.template'), envTemplate);
    console.log('   ✅ .env.template written');

    // Generate Docker compose configuration
    console.log('🐳 Generating Docker configuration...');
    const dockerConfig = generateDockerConfig(characters);
    fs.writeFileSync(path.join(OUTPUT_DIR, 'docker-compose.yml'), dockerConfig);
    console.log('   ✅ docker-compose.yml written');

    // Generate startup script
    console.log('🔧 Generating startup script...');
    const startupScript = generateStartupScript();
    fs.writeFileSync(path.join(OUTPUT_DIR, 'start-eliza.sh'), startupScript);
    fs.chmodSync(path.join(OUTPUT_DIR, 'start-eliza.sh'), '755');
    console.log('   ✅ start-eliza.sh written');

    console.log('\n🎉 ElizaOS Character Integration Setup Complete!');
    console.log('\nNext steps:');
    console.log('1. Copy .env.template to .env and fill in your API keys');
    console.log('2. Run: cd eliza-config && ./start-eliza.sh');
    console.log('3. Characters will be available on configured platforms');
    console.log('4. Use hot-reload for persona testing and refinement\n');

    // Display character summary
    console.log('📊 Character Summary:');
    console.log('━'.repeat(60));
    characters.forEach((char) => {
      console.log(`${char.name}:`);
      console.log(`  Platforms: ${char.platforms.join(', ')}`);
      console.log(`  Memory Scopes: ${char.memoryScopes.join(', ')}`);
      console.log(`  Plugins: ${char.plugins.join(', ')}`);
      console.log('');
    });
  } catch (error) {
    console.error('❌ Setup failed:', error);
    process.exit(1);
  }
}

/**
 * Generate environment template
 */
function generateEnvironmentTemplate(characters: CharacterConfig[]): string {
  return `# ElizaOS Football Squares Character Configuration
# Copy this file to .env and fill in your actual values

# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/eliza_football_squares
REDIS_URL=redis://localhost:6379

# Platform API Keys
DISCORD_BOT_TOKEN=your_discord_bot_token_here
TELEGRAM_BOT_TOKEN=your_telegram_bot_token_here
TWITTER_API_KEY=your_twitter_api_key_here
TWITTER_API_SECRET=your_twitter_api_secret_here
TWITTER_ACCESS_TOKEN=your_twitter_access_token_here
TWITTER_ACCESS_TOKEN_SECRET=your_twitter_access_token_secret_here

# AI Model Keys
OPENAI_API_KEY=your_openai_api_key_here
ANTHROPIC_API_KEY=your_anthropic_api_key_here
GOOGLE_GENERATIVE_AI_API_KEY=your_google_ai_key_here

# Blockchain Configuration
SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
ETHEREUM_RPC_URL=https://eth-mainnet.alchemyapi.io/v2/your_key
POLYGON_RPC_URL=https://polygon-mainnet.alchemyapi.io/v2/your_key
BSC_RPC_URL=https://bsc-dataseed.binance.org
ARBITRUM_RPC_URL=https://arb1.arbitrum.io/rpc

# Platform Wallet Address (for cross-chain recovery)
PLATFORM_WALLET_ADDRESS=your_platform_wallet_address_here

# Security & Monitoring
SEMGREP_API_TOKEN=your_semgrep_token_here
DISCORD_WEBHOOK_URL=your_discord_webhook_for_alerts

# Business Integrations
CRM_API_KEY=your_crm_api_key_here
ANALYTICS_API_KEY=your_analytics_api_key_here
NOTION_API_KEY=your_notion_api_key_here

# ElizaOS Configuration
ELIZA_LOG_LEVEL=info
ELIZA_HOT_RELOAD=true
ELIZA_MAX_CONCURRENT_CHARACTERS=${characters.length}
ELIZA_MEMORY_RETENTION_DAYS=90

# Fry Integration
FRY_MONITORING_INTERVAL_MS=30000
FRY_ALERT_RESPONSE_TIME_MS=2000
FRY_ALERT_ERROR_RATE=0.05
FRY_ALERT_UPTIME_MINIMUM=99.5
`;
}

/**
 * Generate Docker Compose configuration
 */
function generateDockerConfig(characters: CharacterConfig[]): string {
  return `version: '3.8'

services:
  # Database
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: eliza_football_squares
      POSTGRES_USER: eliza
      POSTGRES_PASSWORD: eliza_password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  # Redis for caching and real-time features
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

  # ElizaOS Character Runtime
  eliza:
    build: .
    depends_on:
      - postgres
      - redis
    environment:
      - NODE_ENV=production
    env_file:
      - .env
    volumes:
      - ./characters:/app/characters
      - ./eliza-config:/app/config
      - ./logs:/app/logs
    ports:
      - "3000:3000"
    restart: unless-stopped

  # Fry Infrastructure Agent
  fry:
    build:
      context: .
      dockerfile: Dockerfile.fry
    depends_on:
      - postgres
      - redis
    env_file:
      - .env
    volumes:
      - ./subagents/Frey:/app/fry
      - ./logs:/app/logs
    restart: unless-stopped

volumes:
  postgres_data:
  redis_data:
`;
}

/**
 * Generate startup script
 */
function generateStartupScript(): string {
  return `#!/bin/bash
# ElizaOS Football Squares Character Startup Script

set -e

echo "🚀 Starting ElizaOS Football Squares Character System..."

# Check environment file
if [ ! -f .env ]; then
    echo "❌ .env file not found. Copy .env.template to .env and configure your API keys."
    exit 1
fi

# Load environment variables
source .env

# Validate required environment variables
required_vars=(
    "DATABASE_URL"
    "OPENAI_API_KEY"
    "DISCORD_BOT_TOKEN"
    "SOLANA_RPC_URL"
)

for var in "\${required_vars[@]}"; do
    if [ -z "\${!var}" ]; then
        echo "❌ Required environment variable $var is not set"
        exit 1
    fi
done

echo "✅ Environment validation passed"

# Start services
if command -v docker-compose &> /dev/null; then
    echo "🐳 Starting services with Docker Compose..."
    docker-compose up -d
    
    echo "📊 Service Status:"
    docker-compose ps
    
    echo ""
    echo "🎉 ElizaOS Characters are now running!"
    echo "📱 Discord: Characters active in configured channels"
    echo "📱 Telegram: Characters responding to messages"
    echo "🔍 Logs: docker-compose logs -f eliza"
    echo "🛑 Stop: docker-compose down"
else
    echo "🔧 Starting services locally..."
    
    # Start background services
    if ! pgrep -f "postgres" > /dev/null; then
        echo "📚 Starting PostgreSQL..."
        # Add your local postgres start command here
    fi
    
    if ! pgrep -f "redis" > /dev/null; then
        echo "🗄️ Starting Redis..."
        # Add your local redis start command here
    fi
    
    # Start ElizaOS
    echo "🤖 Starting ElizaOS Characters..."
    npm run start:eliza
fi
`;
}

// Run setup if this file is executed directly
if (require.main === module) {
  setupElizaCharacters().catch(console.error);
}

export default setupElizaCharacters;
