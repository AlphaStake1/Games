# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 13.5.1 fantasy football web application called "Football Squares" - a pre-MVP stage project that combines NFL squares gameplay with fantasy football resource discovery. The app is configured for static export deployment.

## Common Commands

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production (static export)
npm run start        # Start production server
npm run lint         # Run ESLint

# Git workflow (uses conventional commits)
git checkout -b feature/your-feature
git commit -m "feat(component): description"
git push origin feature/your-feature
```

## Architecture

### Framework & Tools
- **Next.js 13.5.1** with App Router and TypeScript
- **Static export** configuration (output: 'export')
- **shadcn/ui** design system with Radix UI primitives
- **Tailwind CSS** for styling with CSS variables and dark mode support
- **React Hook Form** with Zod validation

### Project Structure
```
app/                    # Next.js App Router pages
├── layout.tsx         # Root layout with Inter font and providers
├── page.tsx           # Homepage with main component layout
├── providers.tsx      # App-wide providers
└── globals.css        # Global styles and CSS variables

components/            # React components
├── ui/               # shadcn/ui components (auto-generated)
├── Header.tsx        # Navigation with mobile menu
├── Hero.tsx          # Landing section
├── FantasyLinksGrid.tsx  # Fantasy platform links
├── HowItWorks.tsx    # Feature explanation
├── EmailCapture.tsx  # Newsletter signup
└── Footer.tsx        # Site footer

lib/
└── utils.ts          # Utility functions (cn helper)

hooks/
└── use-toast.ts      # Toast notification hook
```

### Component Patterns
- All custom components use default exports
- UI components from shadcn/ui use named exports
- Client components marked with 'use client' directive
- Responsive design with mobile-first approach
- Accessibility features (ARIA labels, focus management)

### Styling System
- Uses shadcn/ui default theme with neutral base color
- CSS variables for theming (supports dark mode)
- Tailwind utility classes with custom color palette
- Primary brand color: `#1b5e20` (dark green)

### Key Dependencies
- **UI Framework**: Radix UI primitives (@radix-ui/react-*)
- **Icons**: Lucide React
- **Styling**: Tailwind CSS with tailwindcss-animate
- **Forms**: React Hook Form + Zod
- **Theme**: next-themes for dark mode
- **Notifications**: Sonner for toasts

## Development Notes

- ESLint is configured to ignore build errors (ignoreDuringBuilds: true)
- Images are unoptimized for static export compatibility
- Uses conventional commit format for Git workflow
- TypeScript strict mode enabled
- Follows feature-branch workflow targeting main branch

## Recent Solutions

### Logo Display Issue (Jan 2025)
**Problem**: The header logo was showing as hardcoded text "Logo" instead of the intended image file.

**Root Cause**: The text "Logo" was hardcoded in `components/Header.tsx` at line 30, likely due to code reverting to a previous state.

**Solution**:
1. Added `Image` import from `next/image` to `components/Header.tsx`
2. Replaced the hardcoded "Logo" text with an optimized Image component
3. Used the logo file: `/Assets/Football Squares logo_nobg_ (4).png` (transparent background)
4. Applied responsive styling with hover effects

**Code Change**: Replaced text-based Link with Image-based Link component for better optimization and user experience.

**File Modified**: `components/Header.tsx`