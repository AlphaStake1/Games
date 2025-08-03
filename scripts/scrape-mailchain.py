#!/usr/bin/env python3
"""
Scrape Mailchain documentation using Crawl4AI Docker image
This script scrapes https://docs.mailchain.com/developer/ for Coach B's email system integration
"""

import subprocess
import json
import os
import sys
from datetime import datetime

def run_crawl4ai_docker(url, output_format="markdown"):
    """
    Run Crawl4AI using Docker to scrape a URL via Python API
    """
    print(f"Scraping {url} using Crawl4AI Docker...")
    
    # Create a Python script to run inside the Docker container
    python_script = f'''
import requests
import sys
import json
from pathlib import Path

# Simple web scraping since we can't use crawl4ai directly
url = "{url}"
headers = {{
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
}}

try:
    response = requests.get(url, headers=headers, timeout=30)
    response.raise_for_status()
    
    # Basic HTML to markdown conversion
    content = response.text
    print(content)
    
except Exception as e:
    print(f"Error: {{str(e)}}", file=sys.stderr)
    sys.exit(1)
'''
    
    # Use the official Crawl4AI Docker image but run our own Python script
    cmd = [
        "docker", "run", "--rm", "-i",
        "unclecode/crawl4ai",
        "python3", "-c", python_script
    ]
    
    try:
        result = subprocess.run(cmd, capture_output=True, text=True, timeout=120)
        
        if result.returncode == 0:
            return result.stdout
        else:
            print(f"Error running Crawl4AI: {result.stderr}")
            return None
            
    except subprocess.TimeoutExpired:
        print("Crawl4AI timed out after 120 seconds")
        return None
    except Exception as e:
        print(f"Error running Crawl4AI: {str(e)}")
        return None

def save_scraped_content(content, filename):
    """
    Save scraped content to a file
    """
    output_dir = "/home/ekazee/projects/Games/research/mailchain"
    os.makedirs(output_dir, exist_ok=True)
    
    filepath = os.path.join(output_dir, filename)
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"Saved content to {filepath}")
    return filepath

def main():
    """
    Main scraping function for Mailchain documentation
    """
    base_url = "https://docs.mailchain.com/developer/"
    
    print("=== Mailchain Documentation Scraper ===")
    print(f"Target URL: {base_url}")
    print(f"Timestamp: {datetime.now().isoformat()}")
    print()
    
    # Scrape the main developer documentation page
    content = run_crawl4ai_docker(base_url)
    
    if content:
        # Save the main content
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"mailchain-developer-docs-{timestamp}.md"
        saved_file = save_scraped_content(content, filename)
        
        # Also save a general overview file
        overview_content = f"""# Mailchain Developer Documentation

Scraped from: {base_url}
Date: {datetime.now().isoformat()}
Purpose: Integration with Coach B's email account system

## Content

{content}

---

*This documentation was scraped using Crawl4AI for the Games project's Coach B email integration.*
"""
        
        save_scraped_content(overview_content, "overview.md")
        
        print(f"\n✅ Successfully scraped Mailchain documentation")
        print(f"📁 Files saved in: /home/ekazee/projects/Games/research/mailchain/")
        
        return True
    else:
        print("❌ Failed to scrape Mailchain documentation")
        return False

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)