# docker/proton-bridge.Dockerfile
FROM ubuntu:22.04

# Install dependencies
RUN apt-get update && apt-get install -y \
    wget \
    curl \
    gnupg \
    software-properties-common \
    pass \
    dbus \
    xvfb \
    && rm -rf /var/lib/apt/lists/*

# Install ProtonMail Bridge
RUN wget -O proton-bridge.deb https://github.com/ProtonMail/proton-bridge/releases/download/v3.0.21/proton-bridge_3.0.21-1_amd64.deb \
    && dpkg -i proton-bridge.deb || apt-get install -f -y \
    && rm proton-bridge.deb

# Create bridge user
RUN useradd -m -s /bin/bash bridge

# Set up GPG for pass
USER bridge
WORKDIR /home/bridge

# Create script to initialize and run bridge
RUN echo '#!/bin/bash' > /home/bridge/run-bridge.sh \
    && echo 'set -e' >> /home/bridge/run-bridge.sh \
    && echo '' >> /home/bridge/run-bridge.sh \
    && echo '# Initialize pass if needed' >> /home/bridge/run-bridge.sh \
    && echo 'if [ ! -d ~/.password-store ]; then' >> /home/bridge/run-bridge.sh \
    && echo '    gpg --batch --generate-key <<EOF' >> /home/bridge/run-bridge.sh \
    && echo 'Key-Type: RSA' >> /home/bridge/run-bridge.sh \
    && echo 'Key-Length: 2048' >> /home/bridge/run-bridge.sh \
    && echo 'Subkey-Type: RSA' >> /home/bridge/run-bridge.sh \
    && echo 'Subkey-Length: 2048' >> /home/bridge/run-bridge.sh \
    && echo 'Name-Real: ProtonMail Bridge' >> /home/bridge/run-bridge.sh \
    && echo 'Name-Email: bridge@localhost' >> /home/bridge/run-bridge.sh \
    && echo 'Expire-Date: 0' >> /home/bridge/run-bridge.sh \
    && echo '%no-protection' >> /home/bridge/run-bridge.sh \
    && echo 'EOF' >> /home/bridge/run-bridge.sh \
    && echo '    pass init "ProtonMail Bridge"' >> /home/bridge/run-bridge.sh \
    && echo 'fi' >> /home/bridge/run-bridge.sh \
    && echo '' >> /home/bridge/run-bridge.sh \
    && echo '# Start D-Bus session' >> /home/bridge/run-bridge.sh \
    && echo 'export DBUS_SESSION_BUS_ADDRESS=$(dbus-daemon --session --fork --print-address)' >> /home/bridge/run-bridge.sh \
    && echo '' >> /home/bridge/run-bridge.sh \
    && echo '# Start virtual display for GUI' >> /home/bridge/run-bridge.sh \
    && echo 'Xvfb :99 -screen 0 1024x768x24 &' >> /home/bridge/run-bridge.sh \
    && echo 'export DISPLAY=:99' >> /home/bridge/run-bridge.sh \
    && echo '' >> /home/bridge/run-bridge.sh \
    && echo '# Wait for credentials from environment' >> /home/bridge/run-bridge.sh \
    && echo 'if [ -n "$PROTON_USERNAME" ] && [ -n "$PROTON_PASSWORD" ]; then' >> /home/bridge/run-bridge.sh \
    && echo '    echo "Configuring ProtonMail Bridge with provided credentials..."' >> /home/bridge/run-bridge.sh \
    && echo '    # In real implementation, this would use the bridge CLI to add account' >> /home/bridge/run-bridge.sh \
    && echo '    # proton-bridge --cli' >> /home/bridge/run-bridge.sh \
    && echo 'fi' >> /home/bridge/run-bridge.sh \
    && echo '' >> /home/bridge/run-bridge.sh \
    && echo '# Start ProtonMail Bridge' >> /home/bridge/run-bridge.sh \
    && echo 'echo "Starting ProtonMail Bridge..."' >> /home/bridge/run-bridge.sh \
    && echo 'exec proton-bridge --noninteractive' >> /home/bridge/run-bridge.sh \
    && chmod +x /home/bridge/run-bridge.sh

# Health check script
RUN echo '#!/bin/bash' > /home/bridge/health-check.sh \
    && echo 'curl -f http://localhost:1025 || exit 1' >> /home/bridge/health-check.sh \
    && chmod +x /home/bridge/health-check.sh

# Expose SMTP and IMAP ports
EXPOSE 1025 1143

# Set up configuration directory
RUN mkdir -p /home/bridge/.config/protonmail/bridge

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD /home/bridge/health-check.sh

# Run the bridge
CMD ["/home/bridge/run-bridge.sh"]