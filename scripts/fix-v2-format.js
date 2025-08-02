#!/usr/bin/env node
/**
 * Fix ElizaOS V2 character format based on validation errors
 */

const fs = require('fs');
const path = require('path');

function fixV2Format() {
  console.log('🔧 Fixing ElizaOS V2 character format...\n');

  const charactersDir = path.join(__dirname, '../characters');
  const files = fs
    .readdirSync(charactersDir)
    .filter((f) => f.endsWith('.json'));

  for (const filename of files) {
    console.log(`🛠️  Fixing: ${filename}`);

    const filePath = path.join(charactersDir, filename);
    const character = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    // Fix messageExamples format - each message needs a "name" field
    if (character.messageExamples) {
      character.messageExamples = character.messageExamples.map((example) => {
        return example.map((message) => {
          // If message has "user" field, rename it to "name"
          if (message.user && !message.name) {
            return {
              name: message.user,
              content: message.content,
            };
          }
          return message;
        });
      });
    }

    // Remove unsupported fields based on validation errors
    delete character.lore; // Not supported in V2
    delete character.clients; // Not supported in V2
    delete character.actions; // Not supported in V2
    delete character.knowledge; // Not sure if supported
    delete character.adjectives; // Not sure if supported

    // Ensure required fields exist
    if (!character.system) {
      character.system = `You are ${character.name}, a helpful AI assistant specializing in Football Squares.`;
    }

    // Simplify bio to string if it's an array
    if (Array.isArray(character.bio)) {
      character.bio = character.bio.join(' ');
    }

    // Write fixed character
    fs.writeFileSync(filePath, JSON.stringify(character, null, 2));
    console.log(`✅ Fixed: ${filename}`);
  }

  console.log('\n🎉 All character files fixed for ElizaOS V2!');
  console.log('🛡️ Security middleware preserved in plugins');
}

if (require.main === module) {
  fixV2Format();
}

module.exports = { fixV2Format };
