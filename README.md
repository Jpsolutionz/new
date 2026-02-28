# Perfect Ledger

A React Native mobile application for managing ledgers with HTTPS support.

## Features

- User authentication (login/register)
- Create and manage ledgers (gave/got)
- View ledger history
- Download PDF reports
- Delete ledgers
- Secure HTTPS communication

## Tech Stack

- React Native 0.73
- React Navigation
- Axios for API calls
- AsyncStorage for local data
- FastAPI backend (Python)

## Building

### Automatic Build (GitHub Actions)

This project uses GitHub Actions for automatic APK builds.

1. Push code to GitHub
2. GitHub Actions builds APK automatically
3. Download APK from "Artifacts" section
4. Install on Android device

### Manual Build (Local)

Requirements:
- Node.js 18+
- Android Studio
- Java JDK 17

```bash
# Install dependencies
npm install

# Build APK
cd android
./gradlew assembleRelease
```

APK will be in: `android/app/build/outputs/apk/release/app-release.apk`

## Development

```bash
# Install dependencies
npm install

# Start Metro bundler
npm start

# Run on Android
npm run android
```

## Backend

Backend server runs on EC2 with HTTPS:
- URL: https://13.60.249.27/api/v1
- Self-signed SSL certificate

## Web App

Web version available at: https://13.60.249.27

## License

Private

## Version

2.1.0
