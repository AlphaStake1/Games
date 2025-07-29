# Contributing to Football Squares

We welcome contributions from the community!

## How to Contribute

1.  **Fork the repository.**
2.  **Create a feature branch:** `git checkout -b feat/my-new-feature`
3.  **Make your changes.**
4.  **Run tests and linting:** `pnpm test && pnpm lint`
5.  **Commit your changes:** `git commit -m 'feat: Add some feature'`
6.  **Push to the branch:** `git push origin feat/my-new-feature`
7.  **Open a Pull Request.**

## Local Development Quick Start

For a fast development cycle with hot-reloading, follow these steps:

1.  **Clone the repository.**
2.  **Install dependencies:** `pnpm i`
3.  **Generate assets** (if required, e.g., after a schema change): `sqd generate`
4.  **Run the development server:** `pnpm run dev`

This will start the Next.js front-end and the Subsquid processor in watch mode, automatically reloading as you make changes to the code.
