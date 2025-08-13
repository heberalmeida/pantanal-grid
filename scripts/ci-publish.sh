set -euo pipefail

node scripts/ci-pin-playground.js

PKG_DIR="packages/pantanal-grid"
cd "$PKG_DIR"

PKG=$(node -p "require('./package.json').name")
VER=$(node -p "require('./package.json').version")

echo "Publishing $PKG@$VER if needed…"

if npm view "$PKG@$VER" version >/dev/null 2>&1; then
  echo "$PKG@$VER já existe no registry. Nada a publicar."
else
  npm publish --access public
  echo "✅ publicado: $PKG@$VER"
fi

npm dist-tag add "$PKG@$VER" latest || true
npm dist-tag ls "$PKG" || true

cd - >/dev/null
git checkout -- playground/package.json || true
