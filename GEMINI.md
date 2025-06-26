shorter alias in your shell's configuration file (`.bashrc`, `.zshrc`, etc.).

```bash
# Example for .zshrc or .bashrc
alias g="gemini prompt"
```

Now, you can simply run:

```bash
g "What is the Gemini CLI?"
```

## 2. Core Concepts & Best Practices

Understanding these core concepts will fundamentally change how you use the CLI.

### Best Practice: Pipe (`|`) Everything

The single most powerful feature of any CLI tool is its ability to compose with others using standard input (stdin). Instead of copy-pasting code into your prompt, **pipe it in**.

**Bad ❌:**
```bash
# Manually copying and pasting the content of my_script.py
g "Explain this Python code: import os\n\ndef list_files(path):\n  return os.listdir(path)"
```

**Good ✅:**
```bash
cat my_script.py | g "Explain this Python code."
```

This is faster, less error-prone, and enables powerful workflows.

### Best Practice: Use Streaming for Immediate Feedback

For long-running queries or code generation, you don't want to wait for the entire respofail because the default model can't see images
g "Describe what's in this picture" --file 'screenshot.png'

# This is the correct way to analyze an image
g "What is the error shown in this screenshot?" --file 'screenshot.png' --model 'gemini-pro-vision'
```

## 3. VS Code Integration Workflows

The real power comes from integrating the Gemini CLI directly into your editor workflow.

### Workflow 1: The Integrated Terminal

The simplest integration is using VS Code's built-in terminal (`Ctrl+` or `Cmd+` backtick). This allows you to run `gemini` commands on your project files without leaving the editor.

```bash
# Get a summary of a file you're looking at
cat README.md | g "Summarize this file in three bullet points."

# Find all TODO comments and ask Gemini to prioritize them
grep -r "TODO" . | g "Based on these TODO comments, what should I work on first?"
```

### Workflow 2: "Gemini on Selected Text" (Power User)

This is a game-changer. By creating a custom VS Code Task and a Keybinding, you can run a Gem  ]
}
```
*Note: The `<<<` "here string" is a bash/zsh feature. This may need adjustment for other shells like Fish or Windows Command Prompt.*

**Step B: Create a Keybinding**

1.  Press `Ctrl+Shift+P` (or `Cmd+Shift+P`) and search for `Preferences: Open Keyboard Shortcuts (JSON)`.
2.  Add the following JSON object to the array in your `keybindings.json`:

```json
// keybindings.json
{
    "key": "ctrl+alt+e", // Choose any key combination you like
    "command": "workbench.action.tasks.runTask",
    "args": "Gemini: Explain Selection"
}
```

**Now, you can highlight any piece of code in your editor, press `Ctrl+Alt+E`, and a new terminal will open with Gemini's explanation!** You can create multiple tasks for different prompts (e.g., "Refactor Selection", "Add Docs to Selection").

## 4. Practical Recipes & Examples

Here are some ready-to-use commands for common development tasks.

#### Code Generation & Refactoring
```bash
# Generate a boilerplate Python Flask app
g "Write a simple Python Flask app with aCommands & Scripts
```bash
# Ask how to perform a complex shell operation
g "How do I find all files larger than 50MB in my home directory, sorted by size?"

# Write a shell script
g "Write a shell script that takes a directory as an argument and creates a gzipped tarball of it." > backup.sh && chmod +x backup.sh
```

---
Happy Coding
