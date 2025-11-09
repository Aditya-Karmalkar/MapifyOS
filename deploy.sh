#!/bin/bash

echo "🚀 Deploying Mapify OS to Firebase..."

# Build the React app
echo "📦 Building React application..."
pnpm run build

# Deploy to Firebase
echo "🔥 Deploying to Firebase..."
firebase deploy

echo "✅ Deployment complete!"
echo "🌐 Your app is now live at: https://your-project.web.app"
