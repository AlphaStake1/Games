#!/bin/bash

# Install systemd service for automatic startup

echo "Installing Football Squares systemd service..."

# Copy service file to systemd directory
sudo cp /home/new-msi/workspace/fsq/football-squares.service /etc/systemd/system/

# Reload systemd daemon
sudo systemctl daemon-reload

# Enable service to start on boot
sudo systemctl enable football-squares.service

# Start the service
sudo systemctl start football-squares.service

# Check service status
sudo systemctl status football-squares.service

echo ""
echo "Service installed successfully!"
echo ""
echo "Useful commands:"
echo "  - Check status: sudo systemctl status football-squares"
echo "  - Stop service: sudo systemctl stop football-squares"
echo "  - Start service: sudo systemctl start football-squares"
echo "  - Restart service: sudo systemctl restart football-squares"
echo "  - View logs: journalctl -u football-squares -f"
echo "  - Disable auto-start: sudo systemctl disable football-squares"