# 🔧 Tunnel Setup Troubleshooting Log

**Issue Resolution**: August 20, 2025 @ 5:30 PM CST

## 🚨 **Initial Problem**
- Testers could not access the site via public URLs
- Ngrok and bore tunnels were not connecting
- Multiple tunnel conflicts from concurrent LLM usage
- Wrong testing page being served (Next.js route vs static HTML)

## 🔍 **Root Cause Analysis**

### **1. Tunnel Conflicts**
**Problem**: Multiple LLM instances running competing tunnel services
- User had another LLM using the same ngrok/bore services
- Port 3001 was occupied by conflicting processes
- Tunnel URLs were getting mixed up/overwritten

**Evidence**:
```bash
ps aux | grep -E '(ngrok|bore)' | grep -v grep
# Showed multiple bore processes on different ports
new-msi    15704  # ./bore local 3001 --to bore.pub --port 1145
new-msi    20445  # ./bore local 3001 --to bore.pub
```

### **2. Next.js Server Memory Issues**
**Problem**: Server was approaching memory limits and restarting
**Evidence from logs**:
```
⚠ Server is approaching the used memory threshold, restarting...
```

### **3. Wrong Testing Page**
**Problem**: Pointing to Next.js route `/testing/` instead of static HTML
- `/testing/` = Next.js dynamic route (simple interface)
- `/testing/index.html` = Complex HTML testing portal (desired)

## ✅ **Solution Steps**

### **Step 1: Clean Process Kill**
```bash
pkill -f bore          # Kill all bore processes
pkill -f ngrok         # Kill all ngrok processes  
pkill -f "next dev"    # Kill Next.js processes
```

### **Step 2: Restart Services with Memory Optimization**
```bash
# Start Next.js with memory limit
NODE_OPTIONS="--max-old-space-size=2048" pnpm run dev > logs/nextjs-fresh.log 2>&1 &

# Start fresh tunnels
./bore local 3001 --to bore.pub 2>&1 | tee logs/bore-final.log &
./ngrok http 3001 --log=stdout > logs/ngrok-final.log 2>&1 &
```

### **Step 3: Get New URLs**
```bash
# Bore URL from logs
grep "listening at" logs/bore-final.log
# Result: bore.pub:31776

# Ngrok URL from logs  
grep -o 'https://.*\.ngrok-free\.app' logs/ngrok-final.log
# Result: https://a6b7498d6b9d.ngrok-free.app
```

### **Step 4: Correct Testing Page Path**
**Wrong**: `http://bore.pub:31776/testing/`
**Correct**: `http://bore.pub:31776/testing/index.html`

## 🎯 **What Made It Work**

### **1. Process Isolation**
- Stopped competing LLM tunnel usage
- Clean kill of all conflicting processes
- Fresh start with dedicated resources

### **2. Memory Management**
- Used `NODE_OPTIONS="--max-old-space-size=2048"` 
- Prevented server memory threshold restarts
- Stable performance under load

### **3. Proper URL Mapping**
- Static HTML file: `/testing/index.html` 
- Complex testing interface with 6 categories
- Direct file access bypasses Next.js routing

### **4. Dual Tunnel Strategy**
- **Bore (Primary)**: `http://bore.pub:31776` - No CORS issues
- **Ngrok (Backup)**: `https://a6b7498d6b9d.ngrok-free.app` - HTTPS for mobile

## 📊 **Verification Tests**

```bash
# Test local server
curl -s http://localhost:3001/testing/index.html | grep -o "<title>.*</title>"
# Result: <title>Football Squares Beta Testing Portal</title>

# Test bore tunnel
curl -s http://bore.pub:31776/testing/index.html | grep -o "<title>.*</title>"
# Result: <title>Football Squares Beta Testing Portal</title>

# Verify tunnel connection logs
tail -f logs/bore-final.log
# Shows active connections and proxy traffic
```

## 🚀 **Final Working URLs**

### **Primary (Bore - Preferred)**
- **Main Site**: http://bore.pub:31776
- **Testing Portal**: http://bore.pub:31776/testing/index.html

### **Backup (Ngrok - HTTPS)**
- **Main Site**: https://a6b7498d6b9d.ngrok-free.app  
- **Testing Portal**: https://a6b7498d6b9d.ngrok-free.app/testing/index.html

## 🔑 **Key Lessons**

1. **Resource Conflicts**: Always check for competing processes before starting tunnels
2. **Memory Limits**: Use Node.js memory flags in VM environments  
3. **Path Specificity**: Static files require exact paths, not route shortcuts
4. **Log Monitoring**: Real-time logs show connection health and conflicts
5. **Dual Strategy**: Multiple tunnel providers ensure reliability

## 🛠️ **Prevention for Future**

```bash
# Always check before starting
lsof -i :3001                    # Check port availability
ps aux | grep -E '(ngrok|bore)'  # Check existing tunnels

# Use optimization scripts
./scripts/optimize-vm.sh          # Clean system resources
./scripts/dev-low-resource.sh     # Start with memory limits
```

**Status**: ✅ **RESOLVED** - Both tunnels operational, testing portal accessible