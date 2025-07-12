### 🔄 Project Awareness & Context & Research

- **Always read `PLANNING.md`** at the start of a new conversation to understand the project's architecture, goals, style, and constraints.
- **Check `TASK.md`** before starting a new task. If the task isn’t listed, add it with a brief description and today's date.
- **Use consistent naming conventions, file structure, and architecture patterns** as described in `PLANNING.md`.
- **Use Docker commands** whenever executing Python commands, including for unit tests.
- **Set up Docker** Setup a docker instance for development and be aware of the output of Docker so that you can self improve your code and testing.
- **Stick to OFFICIAL DOCUMENTATION PAGES ONLY** - For all research ONLY use official documentation pages. Use a r.jina scrape on the documentation page given to you in intitial.md and then create a llm.txt from it in your memory, then choose the exact pages that make sense for this project and scrape them using your internal scraping tool.
- **Ultrathink** - Use Ultrathink capabilities to decide which pages to scrape, what informatoin to put into PRD etc.
- **Create 2 documents .md files** - Phase 1 and phase 2 - phase 1 is skeleton code, phase 2 is complete production ready code with all features and all necessary frontend and backend implementations to use as a production ready tool.
- **LLM Models** - Always look for the models page from the documentation links mentioned below and find the model that is mentioned in the initial.md - do not change models, find the exact model name to use in the code.
- **Always scrape around 30-100 pages in total when doing research** - If a page 404s or does not contain correct content, try to scrape again and find the actual page/content. Put the output of each SUCCESFUL Jina scrape into a new directory with the name of the technology researched, then inside it .md or .txt files of each output
- **Refer to /research/ directory** - Before implementing any feature that uses something that requires documentation, refer to the relevant directory inside /research/ directory and use the .md files to ensure you're coding with great accuracy, never assume knowledge of a third party API, instead always use the documentation examples which are completely up to date.
- **Take my tech as sacred truth, for example if I say a model name then research that model name for LLM usage - don't assume from your own knowledge at any point**
- **For Maximum efficiency, whenever you need to perform multiple independent operations, such as research, invoke all relevant tools simultaneously, rather that sequentially.**

### 🧱 Code Structure & Modularity

- **Never create a file longer than 500 lines of code.** If a file approaches this limit, refactor by splitting it into modules or helper files.
- **When creating AI prompts do not hardcode examples but make everything dynamic or based off the context of what the prompt is for**
- **Always refer to the specific Phase document you are on** - If you are on phase 1, use phase-1.md, if you are on phase 2, use phase-2.md
- **Agents should be designed as intelligent human beings** by giving them decision making, ability to do detailed research using Jina, and not just your basic propmts that could generate inaccuracies. This is absolutely vital.
- **Organize code into clearly separated modules, grouped by feature or responsibility**
  For your Solana Football Squares dApp, this structure works well:

  -1. frontend/ (HTML/CSS/JS or React)
  -index.html – Main entry point

  -app.js or App.tsx – Core app logic

  -components/ – Reusable UI components

      -BoardGrid.js – Renders the 10x10 grid

      -SquareCard.js – Individual square logic

      -WalletConnect.js – Phantom/Solflare integration

  -styles/ – CSS/Tailwind or other stylesheets

  -2. lib/ or utils/
  -solana.js – Solana wallet adapter and connection helpers

  -oracle.js – Fetch real-time NFL scores via Switchboard oracle

  -randomizer.js – Randomize home/away numbers (via Switchboard VRF)

  -gameLogic.js – Core rules: claiming squares, determining winners, payout logic

  -config.js – Constants like game time, team names, reward pool config

  -3. programs/ (Solana on-chain smart contract in Rust if used)
  -src/lib.rs – Anchor program for tracking square ownership, winner claims

  -tests/ – On-chain tests for game logic

  -instructions/ – Functions like claim_square, set_winner, payout

  -4. Deployment/Infrastructure
  -scripts/ – CLI tools (e.g., deploy program, randomize board)

  -deploy.js – Fleek/Spheron deploy script for frontend

  -index.json – IPFS metadata if using NFTs

- **Use clear, consistent imports** (prefer relative imports within packages).

### 🧪 Testing & Reliability

- **Always create Pytest unit tests for new features** (functions, classes, routes, etc).
- **After updating any logic**, check whether existing unit tests need to be updated. If so, do it.
- **Tests should live in a `/tests` folder** mirroring the main app structure.
  - Include at least:
    - 1 test for expected use
    - 1 edge case
    - 1 failure case

### ✅ Task Completion

- **Mark completed tasks in `TASK.md`** immediately after finishing them.
- Add new sub-tasks or TODOs discovered during development to `TASK.md` under a “Discovered During Work” section.

### 📎 Style & Conventions

- **Use JavaScript/TypeScript** as the primary language.
- **Follow Airbnb JS Style Guide**, use type hints, and format with `black`.
- **Follow Microsoft TypeScript Guide**, or extend Airbnb with TS.
- **Follow Rust Style Guide**
- **Use `pydantic` for data validation**.
- Use `FastAPI` for APIs and `SQLAlchemy` or `SQLModel` for ORM if applicable.
- Write **docstrings for every function** using the Google style:

  ```python
  def example():
      """
      Brief summary.

      Args:
          param1 (type): Description.

      Returns:
          type: Description.
      """
  ```

### 📚 Documentation & Explainability

- **Update `README.md`** when new features are added, dependencies change, or setup steps are modified.
- **Comment non-obvious code** and ensure everything is understandable to a mid-level developer.
- When writing complex logic, **add an inline `# Reason:` comment** explaining the why, not just the what.

### 🧠 AI Behavior Rules

- **Never assume missing context. Ask questions if uncertain.**
- **Never hallucinate libraries or functions** – only use known, verified packages.
- **Always confirm file paths and module names** exist before referencing them in code or tests.
- **Never delete or overwrite existing code** unless explicitly instructed to or if part of a task from `TASK.md`.

### Design

- Stick to the design system inside designsystem.md Designsystem.md - must be adhered to at all times for building any new features.
