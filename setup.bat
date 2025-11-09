@echo off
echo 🚀 Setting up Mapify OS...

echo 📦 Installing dependencies...
pnpm install

echo 📦 Installing function dependencies...
cd functions
pnpm install
cd ..

echo 🔥 Installing Firebase CLI...
pnpm add -g firebase-tools

echo ✅ Setup complete!
echo 📋 Next steps:
echo 1. Update src/firebase.js with your Firebase config
echo 2. Run 'firebase login' to authenticate
echo 3. Run 'firebase init' to initialize your project
echo 4. Run 'pnpm start' to start development server

pause
