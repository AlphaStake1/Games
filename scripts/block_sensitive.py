#!/usr/bin/env python3
"""
Block writes to .env*, SSH keys, and secrets.* files.
The tool_input JSON comes in on stdin.
Exit code 0 = allow, 2 = block + show stderr to Claude.
"""
import json, re, sys, pathlib, textwrap

HOOK_DATA = json.load(sys.stdin)
TOOL_INPUT = HOOK_DATA.get("tool_input", {})
file_path_str = TOOL_INPUT.get("file_path", "")

if not file_path_str:
    sys.exit(0)

file_path = pathlib.Path(file_path_str)

# Patterns you want to protect — tweak as needed
BLOCK_PATTERNS = [
    re.compile(r"\.env(\.|$)", re.IGNORECASE),  # .env or .env.local etc.
    re.compile(r"id_rsa$"),                     # SSH private key
    re.compile(r"secrets\.(json|ya?ml)$", re.IGNORECASE),
]

if any(p.search(str(file_path)) for p in BLOCK_PATTERNS):
    reason = textwrap.dedent(f"""
    ❌  WRITE BLOCKED
    You tried to modify a protected file: {file_path}
    If you’re sure, rename the file or disable this hook.
    """).strip()
    print(reason, file=sys.stderr)
    sys.exit(2)          # tell Claude to abort

# otherwise allow
sys.exit(0)