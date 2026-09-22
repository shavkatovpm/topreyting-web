#!/bin/bash
# Topreyting.uz -> production (167.71.32.201) ga qayta joylash.
#
#   scripts/deploy.sh
#
# Nima qiladi:
#   1. Repo'ning HOZIRGI holatini (git ignore qilingan fayllarsiz) alohida vaqtinchalik
#      papkaga nusxalaydi va shu yerda build qiladi (ishlab turgan `npm run dev`'ga tegmaydi).
#   2. Build vaqtida kerak bo'lgani uchun vaqtinchalik SQLite baza yaratadi (production bazasi emas).
#   3. `.next` (node_modules bilan birga, kesh'siz) va statik fayllarni serverga rsync qiladi.
#   4. Production bog'liqliklarini serverda o'zining Node 22 bilan qayta o'rnatadi
#      (xotira chegarasi bilan) va xizmatni qayta ishga tushiradi.
#   5. Production SQLite bazasiga, storage papkasiga va .env fayliga TEGMAYDI.
#
# Talab: ~/.ssh/id_ed25519 bilan root@167.71.32.201 ga SSH kirish.
set -euo pipefail

HOST="root@167.71.32.201"
KEY="$HOME/.ssh/id_ed25519"
SSH_OPTS=(-i "$KEY" -o BatchMode=yes)
REMOTE_APP="/opt/topreyting/app"
REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
TMP="$(mktemp -d /tmp/topreyting-deploy.XXXXXX)"
trap 'rm -rf "$TMP"' EXIT

srv() { ssh "${SSH_OPTS[@]}" "$HOST" "$@"; }

echo "==> 1/6  Repo nusxalanmoqda ($REPO_ROOT -> $TMP/build)"
mkdir -p "$TMP/build"
git -C "$REPO_ROOT" ls-files -z --cached --others --exclude-standard \
  | rsync -a0 --files-from=- "$REPO_ROOT/" "$TMP/build/"

echo "==> 2/6  Vaqtinchalik build bazasi"
mkdir -p "$TMP/build/data"
cat > "$TMP/build/.env" <<EOF
DATABASE_URL="file:$TMP/build/data/build.db"
SESSION_SECRET="0000000000000000000000000000000000000000000000000000000000000000"
SEED_ADMIN_EMAIL="build@example.com"
SEED_ADMIN_PASSWORD="build-only-not-used-anywhere"
EOF

cd "$TMP/build"
npm ci --no-audit --no-fund >/dev/null
npx prisma migrate deploy >/dev/null
npx prisma generate >/dev/null
npm run db:seed >/dev/null

echo "==> 3/6  next build"
npx next build

echo "==> 4/6  Serverga yuklanmoqda (kod + .next, node_modules/data/.env'siz)"
rsync -az --delete -e "ssh ${SSH_OPTS[*]}" \
  --exclude node_modules --exclude .next/cache --exclude .env --exclude data --exclude '*.tsbuildinfo' \
  "$TMP/build/" "$HOST:$REMOTE_APP/"

echo "==> 5/6  Serverda bog'liqliklar (Node 22, xotira chegarasi bilan)"
srv "bash -s" <<'REMOTE'
set -euo pipefail
cd /opt/topreyting/app
chown -R topreyting:topreyting .
systemd-run --scope --quiet -p MemoryHigh=200M -p MemoryMax=450M -p MemorySwapMax=1G \
  nice -n 15 runuser -u topreyting -- env \
    PATH=/opt/topreyting/node/bin:/usr/bin:/bin HOME=/opt/topreyting npm_config_cache=/opt/topreyting/.npm \
    npm ci --omit=dev --ignore-scripts --no-audit --no-fund
cd node_modules/@prisma/adapter-better-sqlite3/node_modules/better-sqlite3
runuser -u topreyting -- env PATH=/opt/topreyting/node/bin:/usr/bin:/bin \
  /opt/topreyting/node/bin/node /opt/topreyting/app/node_modules/prebuild-install/bin.js
test -f build/Release/better_sqlite3.node
cd /opt/topreyting/app
chown -R topreyting:topreyting .
REMOTE

echo "==> 6/6  Xizmat qayta ishga tushmoqda"
srv "systemctl restart topreyting && sleep 4 && systemctl is-active topreyting"

echo "==> Tekshiruv"
for p in / /ru /admin/login; do
  code=$(curl -s -o /dev/null -m 20 -w '%{http_code}' "https://topreyting.uz$p")
  printf '%-14s -> %s\n' "$p" "$code"
done

echo "Tayyor. Production baza va storage'ga tegilmadi."
