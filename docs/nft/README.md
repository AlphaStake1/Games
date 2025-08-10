# Football Squares NFT Documentation

This folder contains all documentation related to NFT creation, management, and implementation for the Football Squares platform.

## 📋 Document Index

### Core Requirements & Architecture

| Document                                                             | Purpose                                                                         | Audience            | Last Updated |
| -------------------------------------------------------------------- | ------------------------------------------------------------------------------- | ------------------- | ------------ |
| **[nft-requirements-v2.1.md](./nft-requirements-v2.1.md)**           | Complete collection architecture, series specifications, technical requirements | Developers, Product | v2.1         |
| **[nft-creation-specification.md](./nft-creation-specification.md)** | Original NFT creation process, session management, storage policies             | Developers, DevOps  | v2.0         |

### Prompt Engineering & AI

| Document                                                                       | Purpose                                            | Audience                       | Last Updated |
| ------------------------------------------------------------------------------ | -------------------------------------------------- | ------------------------------ | ------------ |
| **[Dali_Palette_Instruction_Manual.md](./Dali_Palette_Instruction_Manual.md)** | Chatbot logic, prompt engineering, user assistance | Artists, Community, Developers | v1.0         |

### Quick Reference

#### NFT Types & Families

- **Core Squares**: Paid board positions (100 per game)
- **Mascots & Humanoids**: Character-based collectibles
- **Stadium Food**: Concession-themed icons with bite animations
- **Stadium Crew**: Behind-the-scenes personnel
- **Overlay Accessories**: Composable gear and effects

#### New Series (v2.1)

1. **UniformGear** - Throwback helmets, specialty gear
2. **Rituals** - Pre-game ceremonies, traditions
3. **Halftime** - Spectacle events, entertainment
4. **OffSeason** - Training camps, preparation
5. **Rivalry** - Historic matchups, weather classics
6. **TechHUD** - Analytics, digital interfaces
7. **Celebration** - Victory moments, emotions
8. **Retro** - Vintage era aesthetics
9. **International** - Global game locations
10. **Charity** - Awareness campaigns, social causes
11. **BroadcastAR** - Behind-the-broadcast elements
12. **Championship** - Trophies, rings, hardware

#### Technical Stack

- **Blockchain**: Solana + Metaplex Core
- **Storage**: Arweave via Bundlr
- **AI Models**: 5-engine rotation system
- **Animation**: Multi-format export (MP4, WebM, GIF)
- **Pricing**: Tiered system (Standard/Premium/VIP)

## 🔄 Document Relationships

```
nft-requirements-v2.1.md
    ├── Defines: Collection architecture & series
    ├── References: Dali_Palette_Instruction_Manual.md (for AI prompting)
    └── Extends: nft-creation-specification.md (original v2.0 specs)

Dali_Palette_Instruction_Manual.md
    ├── Implements: Prompt engineering for all NFT families
    ├── Supports: User assistance & intervention logic
    └── References: Art styles defined in requirements docs

nft-creation-specification.md
    ├── Original: Session management & basic NFT types
    ├── Security: Anonymous creation procedures
    └── Extended by: v2.1 requirements document
```

## 🚀 Implementation Status

| Phase                  | Status       | Documents                          |
| ---------------------- | ------------ | ---------------------------------- |
| **Core NFT System**    | ✅ Specified | nft-creation-specification.md      |
| **Dali Palette Bot**   | ✅ Ready     | Dali_Palette_Instruction_Manual.md |
| **v2.1 Extensions**    | 📋 Planning  | nft-requirements-v2.1.md           |
| **Overlay System**     | 🔄 Design    | nft-requirements-v2.1.md           |
| **Animation Pipeline** | 🔄 Design    | nft-requirements-v2.1.md           |
| **Stadium Lockers**    | ✅ Built     | nft-requirements-v2.1.md           |
| **3D Premium Lockers** | 🔄 Planning  | nft-requirements-v2.1.md           |

## 🔗 External References

- **Metaplex Core Documentation**: https://developers.metaplex.com/core
- **Arweave Storage Guides**: https://cookbook.arweave.dev
- **AI Model APIs**: Various (Poe.com, OpenAI, etc.)
- **Solana Development**: https://docs.solana.com

## 📝 Contributing

When updating NFT documentation:

1. Update the relevant document
2. Increment version number if major changes
3. Update "Last Updated" in this README
4. Cross-reference related documents
5. Test any code examples or procedures

---

**Folder Last Updated**: January 2025  
**Total Documents**: 3 core + 1 index  
**Status**: Active Development
