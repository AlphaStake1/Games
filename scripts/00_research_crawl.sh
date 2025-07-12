#!/bin/bash
# Activates the Python virtual environment and runs the crawl4ai scraper
# for all the technologies listed in the Phase-1 research plan.

# Exit immediately if a command exits with a non-zero status.
set -e

# --- Configuration ---
# Path to crawl4ai executable
CRAWL4AI_EXEC="venv/bin/crwl"

# Base directory for storing scraped documentation
RESEARCH_DIR="./research"

# Crawler parameters
CRAWLER_PARAMS="deep_crawl=true,max_depth=2,max_pages=20,strategy=bfs"

# --- Technology URLs ---
declare -A URLS
URLS=(
    ["solana"]="https://docs.solana.com/"
    ["anchor"]="https://www.anchor-lang.com/docs"
    ["switchboard"]="https://docs.switchboard.xyz/"
    ["clockwork"]="https://clockworkxyz.notion.site/"
    ["proton-bridge"]="https://proton.me/mail/bridge"
    ["ceramic"]="https://developers.ceramic.network/"
    ["akash"]="https://docs.akash.network/"
    ["openai"]="https://platform.openai.com/docs/"
    ["anthropic"]="https://docs.anthropic.com/"
    ["jina"]="https://jina.ai/reader/"
    ["recursive-font"]="https://www.recursive.design/"
    ["katex"]="https://katex.org/docs/"
    ["tailwindcss"]="https://tailwindcss.com/docs"
)

# --- Crawling Loop ---
for tech in "${!URLS[@]}"; do
    url="${URLS[$tech]}"
    output_dir="$RESEARCH_DIR/$tech"
    mkdir -p "$output_dir"
    output_file="$output_dir/scrape.md"
    echo "--- Scraping $tech from $url ---"
    "$CRAWL4AI_EXEC" crawl "$url" -O "$output_file" -c "$CRAWLER_PARAMS"
    echo "--- Finished scraping $tech ---"
    echo ""
done

echo "All scraping tasks completed."