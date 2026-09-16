#!/bin/sh
set -e
export HOME=/c/Users/DELL
SSH="/c/Program Files/Git/usr/bin/ssh.exe"
SCP="/c/Program Files/Git/usr/bin/scp.exe"
R="adventure-dev@54.37.135.229"
O="-o BatchMode=yes -o StrictHostKeyChecking=accept-new -o ConnectTimeout=20"
DIST="/c/Users/DELL/EwolucJA/frontend/dist"
TS=$(date +%Y%m%d-%H%M%S)

echo "=== pakuje dist ($TS) ==="
cd "$DIST"
tar -czf /c/Users/DELL/EwolucJA/tmp/dist.tgz .
ls -la /c/Users/DELL/EwolucJA/tmp/dist.tgz

echo "=== wysylam paczke do dev/data (temp) ==="
"$SCP" $O /c/Users/DELL/EwolucJA/tmp/dist.tgz "$R:/srv/adventure/dev/data/_deploy-$TS.tgz"

echo "=== backup placeholdera + rozpakowanie ==="
"$SSH" $O "$R" "
set -e
cd /srv/adventure/dev
if [ -f public/index.html ] && [ ! -f data/placeholder-backup.html ]; then cp public/index.html data/placeholder-backup.html; fi
tar -C public -czf data/public-backup-$TS.tgz . 2>/dev/null || true
find public -mindepth 1 -delete
tar -C public -xzf data/_deploy-$TS.tgz
rm -f data/_deploy-$TS.tgz
echo '--- dev/public po wgraniu (top) ---'
ls -1 public | head -20
echo '--- liczba plikow ---'; find public -type f | wc -l
echo '--- rozmiar ---'; du -sh public
echo '--- index.html naglowek ---'; head -c 200 public/index.html; echo
"
echo "=== KONIEC ==="
