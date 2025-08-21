#!/bin/bash

# Parallel Deployment Script for A/B Testing
# Deploys both original and enhanced UX versions

set -e

echo "🚀 Starting parallel deployment for A/B testing..."

# Configuration
ORIGINAL_BRANCH="main"
ENHANCED_BRANCH="feature/ux-improvements-parallel"
STAGING_DIR="./staging-builds"
ORIGINAL_BUILD_DIR="$STAGING_DIR/original"
ENHANCED_BUILD_DIR="$STAGING_DIR/enhanced"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

success() {
    echo -e "${GREEN}✓${NC} $1"
}

warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

error() {
    echo -e "${RED}✗${NC} $1"
}

# Clean up previous builds
cleanup() {
    log "Cleaning up previous builds..."
    rm -rf "$STAGING_DIR"
    mkdir -p "$ORIGINAL_BUILD_DIR"
    mkdir -p "$ENHANCED_BUILD_DIR"
    success "Cleanup completed"
}

# Build original version
build_original() {
    log "Building original version from $ORIGINAL_BRANCH..."
    
    # Save current branch
    CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
    
    # Switch to original branch
    git checkout "$ORIGINAL_BRANCH"
    
    # Install dependencies and build
    pnpm install
    NEXT_PUBLIC_UX_VERSION=original pnpm run build
    
    # Copy build output
    cp -r ./out/* "$ORIGINAL_BUILD_DIR/"
    
    # Create version identifier
    echo "original" > "$ORIGINAL_BUILD_DIR/version.txt"
    echo "$(git rev-parse HEAD)" > "$ORIGINAL_BUILD_DIR/commit.txt"
    
    # Return to previous branch
    git checkout "$CURRENT_BRANCH"
    
    success "Original version built successfully"
}

# Build enhanced version
build_enhanced() {
    log "Building enhanced version from $ENHANCED_BRANCH..."
    
    # Ensure we're on the enhanced branch
    git checkout "$ENHANCED_BRANCH"
    
    # Install dependencies and build
    pnpm install
    NEXT_PUBLIC_UX_VERSION=enhanced pnpm run build
    
    # Copy build output
    cp -r ./out/* "$ENHANCED_BUILD_DIR/"
    
    # Create version identifier
    echo "enhanced" > "$ENHANCED_BUILD_DIR/version.txt"
    echo "$(git rev-parse HEAD)" > "$ENHANCED_BUILD_DIR/commit.txt"
    
    success "Enhanced version built successfully"
}

# Create comparison HTML
create_comparison_page() {
    log "Creating comparison page..."
    
    cat > "$STAGING_DIR/index.html" << 'EOF'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Football Squares - A/B Testing Dashboard</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            margin: 0;
            padding: 20px;
            background: #f5f5f5;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
        }
        .header {
            background: white;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 20px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .versions {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-bottom: 20px;
        }
        .version-card {
            background: white;
            border-radius: 8px;
            padding: 20px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .version-card h2 {
            margin: 0 0 10px 0;
            color: #333;
        }
        .version-card p {
            color: #666;
            margin: 0 0 15px 0;
        }
        .btn {
            display: inline-block;
            padding: 12px 24px;
            background: #007bff;
            color: white;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 500;
            transition: background 0.2s;
        }
        .btn:hover {
            background: #0056b3;
        }
        .btn.enhanced {
            background: #28a745;
        }
        .btn.enhanced:hover {
            background: #1e7e34;
        }
        .stats {
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .iframe-container {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.8);
            z-index: 1000;
        }
        .iframe-container iframe {
            width: 100%;
            height: 100%;
            border: none;
        }
        .close-btn {
            position: absolute;
            top: 20px;
            right: 20px;
            background: #dc3545;
            color: white;
            border: none;
            padding: 10px 15px;
            border-radius: 4px;
            cursor: pointer;
            z-index: 1001;
        }
        @media (max-width: 768px) {
            .versions {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🏈 Football Squares - A/B Testing Dashboard</h1>
            <p>Compare the original and enhanced UX versions side by side</p>
        </div>
        
        <div class="versions">
            <div class="version-card">
                <h2>🔵 Original Version</h2>
                <p>Current production version with existing UX patterns</p>
                <a href="./original/index.html" class="btn" target="_blank">View Original</a>
                <button onclick="openInFrame('./original/index.html')" class="btn" style="margin-left: 10px;">Preview</button>
            </div>
            
            <div class="version-card">
                <h2>🟢 Enhanced Version</h2>
                <p>New UX improvements with enhanced navigation and accessibility</p>
                <a href="./enhanced/index.html" class="btn enhanced" target="_blank">View Enhanced</a>
                <button onclick="openInFrame('./enhanced/index.html')" class="btn enhanced" style="margin-left: 10px;">Preview</button>
            </div>
        </div>
        
        <div class="stats">
            <h3>Testing Guidelines</h3>
            <ul>
                <li><strong>Navigation:</strong> Test the sidebar navigation - original has 22+ items, enhanced uses progressive disclosure</li>
                <li><strong>Homepage:</strong> Compare information density and user flow</li>
                <li><strong>Mobile:</strong> Test on mobile devices - enhanced version has optimized touch targets</li>
                <li><strong>Accessibility:</strong> Test with screen readers and keyboard navigation</li>
                <li><strong>Performance:</strong> Compare loading times and bundle sizes</li>
            </ul>
            
            <h3>Key Differences</h3>
            <ul>
                <li>Enhanced navigation with progressive disclosure</li>
                <li>Improved mobile touch targets (44px minimum)</li>
                <li>Better content hierarchy on homepage</li>
                <li>Enhanced accessibility with ARIA labels</li>
                <li>Optimized loading performance</li>
            </ul>
        </div>
    </div>
    
    <div id="iframe-container" class="iframe-container">
        <button class="close-btn" onclick="closeFrame()">✕ Close</button>
        <iframe id="preview-frame" src=""></iframe>
    </div>
    
    <script>
        function openInFrame(url) {
            document.getElementById('preview-frame').src = url;
            document.getElementById('iframe-container').style.display = 'block';
        }
        
        function closeFrame() {
            document.getElementById('iframe-container').style.display = 'none';
            document.getElementById('preview-frame').src = '';
        }
        
        // Close on escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                closeFrame();
            }
        });
    </script>
</body>
</html>
EOF
    
    success "Comparison page created"
}

# Start local server for testing
start_server() {
    log "Starting local server for testing..."
    
    cd "$STAGING_DIR"
    
    # Check if port 8080 is available
    if lsof -i :8080 > /dev/null 2>&1; then
        warning "Port 8080 is already in use. Using port 8081..."
        PORT=8081
    else
        PORT=8080
    fi
    
    # Start simple HTTP server
    if command -v python3 > /dev/null 2>&1; then
        python3 -m http.server $PORT > /dev/null 2>&1 &
        SERVER_PID=$!
    elif command -v node > /dev/null 2>&1; then
        npx serve -p $PORT > /dev/null 2>&1 &
        SERVER_PID=$!
    else
        error "No suitable HTTP server found (python3 or node required)"
        exit 1
    fi
    
    echo "$SERVER_PID" > server.pid
    
    success "Server started on http://localhost:$PORT"
    echo ""
    echo "🎯 Access the comparison dashboard at: http://localhost:$PORT"
    echo "📊 Original version: http://localhost:$PORT/original/"
    echo "🚀 Enhanced version: http://localhost:$PORT/enhanced/"
    echo ""
    echo "To stop the server, run: kill $(cat $STAGING_DIR/server.pid)"
}

# Main execution
main() {
    cleanup
    build_original
    build_enhanced
    create_comparison_page
    start_server
    
    success "Parallel deployment completed successfully!"
}

# Error handling
trap 'error "Deployment failed!"; exit 1' ERR

# Run main function
main "$@"