#!/usr/bin/env node
/**
 * Convert ElizaOS V1 config to V2 individual character files
 */

const fs = require('fs');
const path = require('path');

function convertToV2Format() {
  console.log('🔄 Converting ElizaOS config to V2 format...\n');

  // Read the V1 configuration
  const configPath = path.join(__dirname, '../eliza-config/eliza-config.json');
  const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

  console.log(
    `📋 Found ${config.characters?.length || 0} characters to convert`,
  );

  // Create characters directory if it doesn't exist
  const charactersDir = path.join(__dirname, '../characters');
  if (!fs.existsSync(charactersDir)) {
    fs.mkdirSync(charactersDir, { recursive: true });
  }

  // Convert each character
  for (const character of config.characters || []) {
    console.log(`🤖 Converting: ${character.name}`);

    // Create V2 compatible character format
    const v2Character = {
      name: character.name,
      bio: Array.isArray(character.bio)
        ? character.bio.join(' ')
        : character.bio,
      lore: character.lore || [],
      knowledge: character.knowledge || [],
      adjectives: character.adjectives || [],
      topics: character.topics || [],
      style: character.style || {
        chat: ['friendly', 'helpful'],
        post: ['informative'],
      },
      clients: character.clients || ['discord'],
      plugins: character.plugins || [],
      actions: character.actions || [],
      messageExamples: character.messageExamples || [],
      postExamples: character.postExamples || [],
      settings: {
        secrets: {},
        voice: {
          model: 'en_US-hfc_female-medium',
        },
      },
      system:
        character.system ||
        `You are ${character.name}, a helpful AI assistant.`,
    };

    // Add security middleware if present
    if (character.plugins?.includes('footballsquares-security')) {
      console.log(`🛡️ Security middleware preserved for ${character.name}`);
    }

    // Generate filename
    const filename =
      character.name
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '') + '.json';

    const filePath = path.join(charactersDir, filename);

    // Write character file
    fs.writeFileSync(filePath, JSON.stringify(v2Character, null, 2));
    console.log(`✅ Saved: ${filename}`);
  }

  console.log('\n🎉 Conversion complete!');
  console.log('\n📁 Character files created in /characters directory');
  console.log(
    '🚀 You can now start ElizaOS V2 with individual character files',
  );

  // Show how to start with first character
  const firstCharacter = config.characters?.[0];
  if (firstCharacter) {
    const firstFilename =
      firstCharacter.name
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '') + '.json';

    console.log(`\n💡 Example startup command:`);
    console.log(`   elizaos start --character characters/${firstFilename}`);
    console.log(
      `\n🔄 To start all characters, you'll need multiple processes:`,
    );
    console.log(`   elizaos start --character characters/coach-b.json`);
    console.log(
      `   elizaos start --character characters/dean.json --port 3001`,
    );
    console.log(
      `   elizaos start --character characters/trainer-reviva.json --port 3002`,
    );
  }
}

if (require.main === module) {
  convertToV2Format();
}

module.exports = { convertToV2Format };
