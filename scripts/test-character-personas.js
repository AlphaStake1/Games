// scripts/test-character-personas.js
/**
 * Character Persona Alignment Test
 *
 * Tests character personality consistency and response patterns
 * Demonstrates hot-reload capability for persona refinement
 */

const fs = require('fs');
const path = require('path');

const CHARACTERS_DIR = path.join(__dirname, '../characters');

/**
 * Load character configurations
 */
function loadCharacters() {
  const characterFiles = fs
    .readdirSync(CHARACTERS_DIR)
    .filter((file) => file.endsWith('.json'))
    .filter((file) => !file.includes('README'));

  const characters = {};

  for (const file of characterFiles) {
    const filePath = path.join(CHARACTERS_DIR, file);
    const character = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    characters[character.name] = character;
  }

  return characters;
}

/**
 * Test scenarios to validate character personas
 */
const TEST_SCENARIOS = [
  {
    scenario: 'User Wallet Connection Issue',
    userMessage: "My wallet won't connect and I'm getting frustrated",
    expectedResponses: {
      'Trainer Reviva': {
        tone: 'empathetic and supportive',
        keywords: ['understand', 'help', 'together', '🌱'],
        shouldEscalate: false,
      },
      'Coach B': {
        tone: 'motivational sports metaphor',
        keywords: ['champ', 'team', 'game', '🏈'],
        shouldEscalate: true, // technical issue
      },
      'Dean Security': {
        tone: 'technical and direct',
        keywords: ['analyzing', 'protocol', 'security'],
        shouldEscalate: false,
      },
      'Commissioner Jerry': {
        tone: 'executive and authoritative',
        keywords: ['reviewing', 'resources', 'resolution'],
        shouldEscalate: false,
      },
    },
  },
  {
    scenario: 'Cross-Chain Recovery Request',
    userMessage: 'I sent USDC from Polygon to Ethereum but it never arrived',
    expectedResponses: {
      'Trainer Reviva': {
        tone: 'reassuring problem-solver',
        keywords: ["don't worry", 'options', 'recovery', '✨'],
        shouldEscalate: false,
      },
      'Coach B': {
        tone: 'sports analogy with handoff',
        keywords: ['fumble', 'recovery', 'specialist'],
        shouldEscalate: true, // hands off to Reviva
      },
      'Dean Security': {
        tone: 'procedural and timestamp-focused',
        keywords: ['detected', 'analysis', 'protocol'],
        shouldEscalate: false,
      },
    },
  },
  {
    scenario: 'New Player Onboarding',
    userMessage: "I'm new here, how do I get started with Football Squares?",
    expectedResponses: {
      'Coach B': {
        tone: 'welcoming coach',
        keywords: ['welcome', 'team', 'squares', 'game'],
        shouldEscalate: false,
      },
      'Coach Right': {
        tone: 'community-focused',
        keywords: ['community', 'welcome', 'help'],
        shouldEscalate: false,
      },
      'OC Phil': {
        tone: 'educational and supportive',
        keywords: ['learning', 'training', 'support'],
        shouldEscalate: false,
      },
    },
  },
  {
    scenario: 'Business Partnership Inquiry',
    userMessage: "We're interested in partnering with your platform",
    expectedResponses: {
      'Morgan Reese': {
        tone: 'professional business development',
        keywords: ['partnership', 'opportunities', 'discuss'],
        shouldEscalate: false,
      },
      'Commissioner Jerry': {
        tone: 'executive decision maker',
        keywords: ['partnership', 'review', 'evaluation'],
        shouldEscalate: false,
      },
    },
  },
  {
    scenario: 'Financial/Audit Question',
    userMessage: 'I need information about platform fees and compliance',
    expectedResponses: {
      'Jordan Banks': {
        tone: 'precise financial professional',
        keywords: ['compliance', 'fees', 'audit', 'financial'],
        shouldEscalate: false,
      },
      'Commissioner Jerry': {
        tone: 'executive oversight',
        keywords: ['compliance', 'review', 'procedures'],
        shouldEscalate: false,
      },
    },
  },
];

/**
 * Analyze character persona alignment
 */
function analyzePersonaAlignment(character, scenario, expectedResponse) {
  const results = {
    characterName: character.name,
    scenario: scenario.scenario,
    alignmentScore: 0,
    strengths: [],
    improvements: [],
    details: {},
  };

  // Check bio alignment
  if (character.bio) {
    const bioText = Array.isArray(character.bio)
      ? character.bio.join(' ')
      : character.bio;
    const bioTone = bioText.toLowerCase();
    if (
      expectedResponse.tone.includes('empathetic') &&
      bioTone.includes('empathe')
    ) {
      results.strengths.push('Bio reflects empathetic nature');
      results.alignmentScore += 20;
    }
    if (expectedResponse.tone.includes('sports') && bioTone.includes('coach')) {
      results.strengths.push('Bio reflects coaching/sports background');
      results.alignmentScore += 20;
    }
    if (
      expectedResponse.tone.includes('technical') &&
      bioTone.includes('security')
    ) {
      results.strengths.push('Bio reflects technical security focus');
      results.alignmentScore += 20;
    }
  }

  // Check communication style alignment
  if (character.style && character.style.tone) {
    const styleTones = character.style.tone;
    if (Array.isArray(styleTones)) {
      styleTones.forEach((tone) => {
        if (expectedResponse.tone.toLowerCase().includes(tone.toLowerCase())) {
          results.strengths.push(`Communication style includes "${tone}"`);
          results.alignmentScore += 15;
        }
      });
    }
  }

  // Check message examples alignment
  if (character.messageExamples && character.messageExamples.length > 0) {
    let keywordMatches = 0;
    let totalKeywords = expectedResponse.keywords.length;

    const allExamples = character.messageExamples
      .map((ex) => (Array.isArray(ex) ? ex.join(' ') : ex.content || ex))
      .join(' ')
      .toLowerCase();

    expectedResponse.keywords.forEach((keyword) => {
      if (allExamples.includes(keyword.toLowerCase())) {
        keywordMatches++;
      }
    });

    const keywordScore = (keywordMatches / totalKeywords) * 30;
    results.alignmentScore += keywordScore;

    if (keywordMatches > 0) {
      results.strengths.push(
        `Message examples contain ${keywordMatches}/${totalKeywords} expected keywords`,
      );
    } else {
      results.improvements.push(
        `Message examples missing expected keywords: ${expectedResponse.keywords.join(', ')}`,
      );
    }
  }

  // Check personality traits
  const characterTraits = character.traits || character.adjectives || [];
  if (characterTraits && characterTraits.length > 0) {
    const traits = characterTraits.join(' ').toLowerCase();
    let traitAlignment = false;

    if (
      expectedResponse.tone.includes('empathetic') &&
      (traits.includes('supportive') ||
        traits.includes('caring') ||
        traits.includes('helpful'))
    ) {
      results.strengths.push('Personality traits support empathetic responses');
      results.alignmentScore += 15;
      traitAlignment = true;
    }

    if (
      expectedResponse.tone.includes('sports') &&
      (traits.includes('motivational') ||
        traits.includes('energetic') ||
        traits.includes('competitive'))
    ) {
      results.strengths.push(
        'Personality traits support sports-themed responses',
      );
      results.alignmentScore += 15;
      traitAlignment = true;
    }

    if (
      expectedResponse.tone.includes('technical') &&
      (traits.includes('analytical') ||
        traits.includes('precise') ||
        traits.includes('methodical'))
    ) {
      results.strengths.push('Personality traits support technical responses');
      results.alignmentScore += 15;
      traitAlignment = true;
    }

    if (!traitAlignment) {
      results.improvements.push(
        'Personality traits could better align with expected response tone',
      );
    }
  }

  // Normalize score to 100
  results.alignmentScore = Math.min(100, results.alignmentScore);

  // Add improvement suggestions based on score
  if (results.alignmentScore < 60) {
    results.improvements.push(
      'Consider updating bio to better reflect character role',
    );
    results.improvements.push('Add more relevant message examples');
    results.improvements.push(
      'Refine personality traits to match expected tone',
    );
  }

  const bioText = character.bio
    ? Array.isArray(character.bio)
      ? character.bio.join(' ')
      : character.bio
    : 'No bio available';

  results.details = {
    expectedTone: expectedResponse.tone,
    expectedKeywords: expectedResponse.keywords,
    shouldEscalate: expectedResponse.shouldEscalate,
    bio: bioText.length > 100 ? bioText.substring(0, 100) + '...' : bioText,
    traits: character.traits || character.adjectives || [],
    style: character.style || {},
  };

  return results;
}

/**
 * Generate persona improvement suggestions
 */
function generateImprovementSuggestions(character, lowScores) {
  const suggestions = {
    characterName: character.name,
    overallScore:
      lowScores.reduce((sum, score) => sum + score.alignmentScore, 0) /
      lowScores.length,
    improvements: [],
    bioSuggestions: [],
    traitSuggestions: [],
    exampleSuggestions: [],
  };

  // Analyze patterns in low scores
  const commonIssues = {};
  lowScores.forEach((score) => {
    score.improvements.forEach((improvement) => {
      commonIssues[improvement] = (commonIssues[improvement] || 0) + 1;
    });
  });

  // Generate targeted suggestions based on character role
  switch (character.name) {
    case 'Trainer Reviva':
      if (suggestions.overallScore < 70) {
        suggestions.bioSuggestions.push(
          'Emphasize empathetic support and technical problem-solving abilities',
        );
        suggestions.traitSuggestions.push(
          'Add traits: patient, nurturing, technically skilled',
        );
        suggestions.exampleSuggestions.push(
          'Include examples with plant/growth metaphors (🌱) and supportive language',
        );
      }
      break;

    case 'Coach B':
      if (suggestions.overallScore < 70) {
        suggestions.bioSuggestions.push(
          'Highlight coaching background and team-building approach',
        );
        suggestions.traitSuggestions.push(
          'Add traits: motivational, team-oriented, sports-focused',
        );
        suggestions.exampleSuggestions.push(
          'Include football metaphors and "champ" references (🏈)',
        );
      }
      break;

    case 'Dean Security':
      if (suggestions.overallScore < 70) {
        suggestions.bioSuggestions.push(
          'Emphasize security expertise and analytical approach',
        );
        suggestions.traitSuggestions.push(
          'Add traits: methodical, security-focused, analytical',
        );
        suggestions.exampleSuggestions.push(
          'Include timestamped, procedural language',
        );
      }
      break;

    case 'Commissioner Jerry':
      if (suggestions.overallScore < 70) {
        suggestions.bioSuggestions.push(
          'Focus on executive leadership and decision-making authority',
        );
        suggestions.traitSuggestions.push(
          'Add traits: authoritative, strategic, results-oriented',
        );
        suggestions.exampleSuggestions.push(
          'Include executive summaries and resource allocation language',
        );
      }
      break;
  }

  // Add common improvements
  Object.entries(commonIssues).forEach(([issue, count]) => {
    if (count >= 2) {
      suggestions.improvements.push(`${issue} (affects ${count} scenarios)`);
    }
  });

  return suggestions;
}

/**
 * Main test function
 */
async function testCharacterPersonas() {
  console.log('🎭 Testing Character Persona Alignment\n');
  console.log(
    'This test validates that character personalities are consistent',
  );
  console.log('with their expected roles and response patterns.\n');

  try {
    // Load characters
    console.log('📁 Loading character configurations...');
    const characters = loadCharacters();
    console.log(`   Found ${Object.keys(characters).length} characters\n`);

    const allResults = [];
    const improvementNeeded = [];

    // Test each scenario
    for (const scenario of TEST_SCENARIOS) {
      console.log(`🎬 Testing Scenario: ${scenario.scenario}`);
      console.log(`   User Message: "${scenario.userMessage}"`);
      console.log('   ─'.repeat(60));

      for (const [characterName, expectedResponse] of Object.entries(
        scenario.expectedResponses,
      )) {
        const character = characters[characterName];

        if (!character) {
          console.log(`   ❌ Character "${characterName}" not found`);
          continue;
        }

        const result = analyzePersonaAlignment(
          character,
          scenario,
          expectedResponse,
        );
        allResults.push(result);

        // Display results
        const scoreEmoji =
          result.alignmentScore >= 80
            ? '🟢'
            : result.alignmentScore >= 60
              ? '🟡'
              : '🔴';

        console.log(
          `   ${scoreEmoji} ${characterName}: ${result.alignmentScore}% alignment`,
        );

        if (result.strengths.length > 0) {
          console.log(`      ✅ Strengths: ${result.strengths[0]}`);
        }

        if (result.improvements.length > 0) {
          console.log(`      🔧 Needs: ${result.improvements[0]}`);
          if (result.alignmentScore < 70) {
            improvementNeeded.push(result);
          }
        }
      }
      console.log('');
    }

    // Generate summary report
    console.log('📊 Persona Alignment Summary');
    console.log('═'.repeat(60));

    const characterScores = {};
    allResults.forEach((result) => {
      if (!characterScores[result.characterName]) {
        characterScores[result.characterName] = [];
      }
      characterScores[result.characterName].push(result.alignmentScore);
    });

    Object.entries(characterScores).forEach(([characterName, scores]) => {
      const avgScore =
        scores.reduce((sum, score) => sum + score, 0) / scores.length;
      const scoreEmoji = avgScore >= 80 ? '🟢' : avgScore >= 60 ? '🟡' : '🔴';

      console.log(
        `${scoreEmoji} ${characterName}: ${avgScore.toFixed(1)}% average`,
      );
    });

    // Generate improvement suggestions for low-scoring characters
    if (improvementNeeded.length > 0) {
      console.log('\n🔧 Improvement Suggestions');
      console.log('═'.repeat(60));

      const characterImprovements = {};
      improvementNeeded.forEach((result) => {
        if (!characterImprovements[result.characterName]) {
          characterImprovements[result.characterName] = [];
        }
        characterImprovements[result.characterName].push(result);
      });

      Object.entries(characterImprovements).forEach(
        ([characterName, results]) => {
          const character = characters[characterName];
          const suggestions = generateImprovementSuggestions(
            character,
            results,
          );

          console.log(
            `\n📝 ${characterName} (${suggestions.overallScore.toFixed(1)}% avg):`,
          );

          if (suggestions.bioSuggestions.length > 0) {
            console.log(`   Bio: ${suggestions.bioSuggestions[0]}`);
          }

          if (suggestions.traitSuggestions.length > 0) {
            console.log(`   Traits: ${suggestions.traitSuggestions[0]}`);
          }

          if (suggestions.exampleSuggestions.length > 0) {
            console.log(`   Examples: ${suggestions.exampleSuggestions[0]}`);
          }
        },
      );
    }

    // Hot-reload demonstration
    console.log('\n🔥 Hot-Reload Testing');
    console.log('═'.repeat(60));
    console.log('To test hot-reload functionality:');
    console.log('1. Make changes to character JSON files in /characters');
    console.log('2. Save the file');
    console.log('3. Re-run this test to see updated results');
    console.log('4. Character personas will be automatically reloaded');
    console.log('');
    console.log('Example improvement for Trainer Reviva:');
    console.log('   - Add "🌱" emoji to message examples');
    console.log('   - Include "nurturing" in personality traits');
    console.log('   - Emphasize growth/plant metaphors in bio');
    console.log('');
    console.log('🎯 Overall System Health:');
    const overallAverage =
      allResults.reduce((sum, result) => sum + result.alignmentScore, 0) /
      allResults.length;
    const healthEmoji =
      overallAverage >= 80 ? '🟢' : overallAverage >= 60 ? '🟡' : '🔴';
    console.log(
      `${healthEmoji} Character Persona Alignment: ${overallAverage.toFixed(1)}%`,
    );

    if (overallAverage >= 80) {
      console.log(
        '✅ Characters are well-aligned with their expected personas',
      );
    } else if (overallAverage >= 60) {
      console.log('⚠️ Characters need some persona refinement');
    } else {
      console.log('🚨 Characters require significant persona improvements');
    }
  } catch (error) {
    console.error('❌ Persona testing failed:', error);
    process.exit(1);
  }
}

// File watching for hot-reload demonstration
function setupHotReload() {
  console.log('\n👀 Setting up file watching for hot-reload demo...');

  fs.watch(CHARACTERS_DIR, { recursive: true }, (eventType, filename) => {
    if (filename && filename.endsWith('.json')) {
      console.log(`\n🔄 Character file changed: ${filename}`);
      console.log('   Hot-reload would trigger persona re-analysis...');
      console.log('   Re-run test to see updated results\n');
    }
  });

  console.log(
    '   File watching active. Make changes to character files to test hot-reload.',
  );
}

// Run test if this file is executed directly
if (require.main === module) {
  testCharacterPersonas()
    .then(() => {
      if (process.argv.includes('--watch')) {
        setupHotReload();
        console.log('\n🔄 Watching for file changes... Press Ctrl+C to exit');
        // Keep process alive
        setInterval(() => {}, 1000);
      }
    })
    .catch(console.error);
}

module.exports = { testCharacterPersonas, analyzePersonaAlignment };
