#!/bin/bash
set -e

echo "Building Next.js application..."
npx next build

echo "Copying static assets to standalone directory..."
if [ -d ".next/standalone" ]; then
  cp -r .next/static .next/standalone/.next/static 2>/dev/null || true
  cp -r public/* .next/standalone/public/ 2>/dev/null || true
  echo "Static assets copied successfully"
else
  echo "Warning: standalone directory not found"
fi

echo "Build complete!"
