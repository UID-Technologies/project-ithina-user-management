#!/usr/bin/env bash
# Install Docker Engine + Compose plugin on Ubuntu (Azure VM).
# Run once on a fresh VM:
#   chmod +x deploy/scripts/setup-vm.sh && sudo deploy/scripts/setup-vm.sh

set -euo pipefail

if [[ "${EUID:-$(id -u)}" -ne 0 ]]; then
  echo "Run as root: sudo $0"
  exit 1
fi

export DEBIAN_FRONTEND=noninteractive

apt-get update -y
apt-get install -y ca-certificates curl gnupg lsb-release git

if ! command -v docker >/dev/null 2>&1; then
  install -m 0755 -d /etc/apt/keyrings
  curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
  chmod a+r /etc/apt/keyrings/docker.gpg

  echo \
    "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
    $(. /etc/os-release && echo "$VERSION_CODENAME") stable" \
    > /etc/apt/sources.list.d/docker.list

  apt-get update -y
  apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
fi

systemctl enable docker
systemctl start docker

# Allow the default Azure admin user to run docker without sudo
DEPLOY_USER="${SUDO_USER:-azureuser}"
if id "$DEPLOY_USER" &>/dev/null; then
  usermod -aG docker "$DEPLOY_USER"
  echo "Added $DEPLOY_USER to the docker group (log out/in for group to apply)."
fi

docker --version
docker compose version

echo ""
echo "Docker is ready. Next steps:"
echo "  git clone <your-repo-url> ~/ithina-rbac"
echo "  cd ~/ithina-rbac"
echo "  cp deploy/.env.example deploy/.env   # set PUBLIC_HOST + JWT_SECRET"
echo "  ./deploy/scripts/deploy.sh --seed"
