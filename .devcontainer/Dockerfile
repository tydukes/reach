# REACH Development Container
# Provides Node.js 24+, Python 3.11+, and audio libraries for voice processing

FROM mcr.microsoft.com/devcontainers/javascript-node:24-bookworm

# Install Python 3.11+ and pip
RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
    && apt-get -y install --no-install-recommends \
    python3 \
    python3-pip \
    python3-venv \
    python3-dev \
    && apt-get clean -y \
    && rm -rf /var/lib/apt/lists/*

# Install audio libraries for voice processing
RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
    && apt-get -y install --no-install-recommends \
    # Audio processing libraries
    libasound2-dev \
    libportaudio2 \
    portaudio19-dev \
    libsndfile1 \
    libsndfile1-dev \
    ffmpeg \
    # Build tools
    build-essential \
    pkg-config \
    # Additional utilities
    curl \
    wget \
    git \
    vim \
    && apt-get clean -y \
    && rm -rf /var/lib/apt/lists/*

# Set up Python virtual environment (optional, for future ML tools)
RUN python3 -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

# Upgrade pip and install common Python packages
RUN pip install --no-cache-dir --upgrade pip setuptools wheel

# Install global npm packages
RUN npm install -g npm@latest

# Set working directory
WORKDIR /workspace

# Verify installations
RUN node --version && npm --version && python3 --version && ffmpeg -version

# Note: The vscode user and its home directory setup will be handled by devcontainer features
