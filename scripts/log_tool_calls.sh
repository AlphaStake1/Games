#!/usr/bin/env bash
# Append timestamp, tool name, and JSON input to a log file.
{
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $CLAUDE_TOOL"
    cat -
    echo "----------------------------------------"
} >> "$HOME/.claude/tool-call.log"