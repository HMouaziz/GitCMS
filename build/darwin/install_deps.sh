#!/bin/bash
chmod +x "$0"

echo "Checking for required dependencies..."

# Check if Homebrew is installed
if ! command -v brew &> /dev/null; then
    echo "Homebrew not found. Installing..."
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
else
    echo "Homebrew is already installed."
fi

# Check if Git is installed
if ! command -v git &> /dev/null; then
    echo "Git is not installed. Installing..."
    brew install git
else
    echo "Git is already installed."
fi

# Check if OpenSSH is installed
if ! command -v ssh &> /dev/null; then
    echo "OpenSSH is not installed. Installing..."
    brew install openssh
    sudo launchctl load -w /System/Library/LaunchDaemons/ssh.plist
else
    echo "OpenSSH is already installed."
fi

echo "All dependencies are installed. Launching Git CMS..."
