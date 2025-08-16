const fs = require('fs');
const path = require('path');

const filesToFix = [
  './app/about/page.tsx',
  './app/admin/cbl-emails/page.tsx',
  './app/admin/player-emails/page.tsx',
  './app/business-intake/page.tsx',
  './app/cbl/apply/page.tsx',
  './app/cbl/coaching-room/page.tsx',
  './app/cbl/create-board/page.tsx',
  './app/cbl/dashboard/page.tsx',
  './app/cbl/legal/terms-of-service/page.tsx',
  './app/cbl/member-welcome/page.tsx',
  './app/cbl-apply/page.tsx',
  './app/cbl-member-welcome/page.tsx',
  './app/cbl-only/dashboard/page.tsx',
  './app/check-board/[gameId]/page.tsx',
  './app/coaches-room/page.tsx',
  './app/compare-nft-styles/page.tsx',
  './app/contact/page.tsx',
  './app/devnet/swap/page.tsx',
  './app/draft-gallery/page.tsx',
  './app/features/page.tsx',
  './app/game-board/[gameId]/page.tsx',
  './app/game-selection/page.tsx',
  './app/games/[gameId]/page.tsx',
  './app/how-to-play/page.tsx',
  './app/locker/[username]/edit/page.tsx',
  './app/locker/[username]/page.tsx',
  './app/nft-creator/page.tsx',
  './app/play/step-1-choose-game/page.tsx',
  './app/play/step-2-create-nft/page.tsx',
  './app/play/step-3-wallet-connect/page.tsx',
  './app/play-debug/page.tsx',
  './app/play-devnet/page.tsx',
  './app/privacy/page.tsx',
  './app/rewards/page.tsx',
  './app/season-pass/page.tsx',
  './app/support-redirect/page.tsx',
  './app/vip/dashboard/page.tsx',
  './app/vip/game-room/page.tsx',
  './app/vip/lounge/page.tsx',
  './app/vip/vaults/page.tsx',
  './app/vip/whitelist/page.tsx',
  './components/BoardHouseNFT.tsx',
  './components/BoardSquareNFT.tsx',
  './components/HouseRules.tsx',
  './components/NFTCreatorFlow.tsx',
  './components/SquaresGame.tsx',
  './components/TeamSelectionModal.tsx',
  './components/TechnicalSupportContent.tsx',
  './components/VRFErrorHandler.tsx',
  './components/WalletConnectionPopup.tsx',
  './components/WalletGuideContent.tsx',
  './components/WhatAreNftsContent.tsx',
  './components/locker/LockerUpgradeModal.tsx',
  './components/locker/PlayerLockerRoom.tsx',
];

filesToFix.forEach((filePath) => {
  const fullPath = path.join(__dirname, filePath);
  if (fs.existsSync(fullPath)) {
    let content = fs.readFileSync(fullPath, 'utf8');

    // Replace unescaped apostrophes
    content = content.replace(/([^\\])'/g, "$1{\\''}");

    // Replace unescaped quotes
    content = content.replace(/([^\\])"/g, '$1{\\"\\"}');

    fs.writeFileSync(fullPath, content);
    console.log(`Fixed: ${filePath}`);
  } else {
    console.log(`File not found: ${filePath}`);
  }
});

console.log('Done!');
