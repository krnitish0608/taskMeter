# Quick Setup Guide

This guide will help you set up and run the TaskMeter app quickly.

## Prerequisites Checklist

- [ ] Node.js >= 22.11.0 installed
- [ ] npm or yarn installed
- [ ] Android Studio installed (for Android)
- [ ] Xcode installed (for iOS - macOS only)
- [ ] Firebase project created
- [ ] Git installed

## Step-by-Step Setup

### 1. Clone and Install Dependencies

```bash
# Clone the repository
git clone <repository-url>
cd taskMeter

# Install Node dependencies
npm install

# Install iOS dependencies (macOS only)
cd ios
pod install
cd ..
```

### 2. Firebase Setup

#### Create Firebase Projects

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create two projects:
   - `taskmeter-dev` (Development)
   - `taskmeter-prod` (Production)

#### Enable Firebase Services

For each project:

1. **Authentication**:
   - Go to Authentication → Sign-in method
   - Enable "Email/Password"

2. **Firestore Database**:
   - Go to Firestore Database
   - Click "Create database"
   - Start in production mode (rules can be updated later)

3. **Cloud Messaging**:
   - Already enabled by default
   - Note the Server Key for backend integration

#### Download Configuration Files

**For Android:**
1. Go to Project Settings → General
2. Add Android app with package name: `com.taskmeter`
3. Download `google-services.json`
4. Rename and place files:
   - Development: `android/app/google-services.dev.json`
   - Production: `android/app/google-services.prod.json`

**For iOS:**
1. Go to Project Settings → General
2. Add iOS app with bundle ID: `com.taskmeter`
3. Download `GoogleService-Info.plist`
4. Rename and place files:
   - Development: `ios/taskMeter/GoogleService-Info-dev.plist`
   - Production: `ios/taskMeter/GoogleService-Info-prod.plist`

### 3. Environment Configuration

```bash
# Copy example files
cp .env.development.example .env.development
cp .env.staging.example .env.staging
cp .env.production.example .env.production

# Edit files with your actual values (if needed)
# The example files should work as-is for most cases
```

### 4. Run the App

#### Development Environment

```bash
# Terminal 1: Start Metro with dev config
npm run dev

# Terminal 2: Run on Android
npm run android

# OR Run on iOS (macOS only)
npm run ios
```

#### Production Environment

```bash
# Terminal 1: Start Metro with prod config
npm run prod

# Terminal 2: Run on Android
npm run android

# OR Run on iOS (macOS only)
npm run ios
```

## Verification Steps

### 1. App Launches Successfully
- [ ] App opens without crashes
- [ ] Login screen is visible

### 2. Firebase Connection
- [ ] Can create account (email/password)
- [ ] Receives email verification link
- [ ] Can log in after verification

### 3. Task Management
- [ ] Can create tasks
- [ ] Can view task list
- [ ] Can complete tasks
- [ ] Can delete tasks

### 4. Notifications
- [ ] See login success notification
- [ ] See task completion notification
- [ ] Check console for FCM token

### 5. Theme Switching
- [ ] Can toggle between light/dark mode in Settings

## Common Issues & Solutions

### Android Build Fails

```bash
# Clean build
cd android
./gradlew clean
cd ..

# Clear cache and rebuild
npm start -- --reset-cache
npm run android
```

### iOS Build Fails

```bash
# Reinstall pods
cd ios
rm -rf Pods
pod deintegrate
pod install
cd ..

# Rebuild
npm run ios
```

### Metro Bundler Issues

```bash
# Clear all caches
watchman watch-del-all
rm -rf $TMPDIR/metro-*
rm -rf $TMPDIR/haste-*
npm start -- --reset-cache
```

### Firebase Connection Issues

1. Verify Firebase config files are in correct locations
2. Check Firebase project is active in Firebase Console
3. Ensure Authentication is enabled
4. Check internet connection
5. Verify package name (Android) and bundle ID (iOS) match Firebase project

### Notification Not Working

1. Check FCM token is printed in console
2. Verify Firebase Messaging is enabled
3. For iOS, check notification permissions in device settings
4. For Android, check notification channel is created

## Environment Scripts Explained

| Script | Environment | Firebase Config | Use Case |
|--------|-------------|-----------------|----------|
| `npm run dev` | Development | dev | Local development |
| `npm run staging` | Staging | dev | Pre-production testing |
| `npm run prod` | Production | prod | Production builds |

Each script:
- Copies appropriate `.env.*` to `.env`
- Copies appropriate Firebase config files
- Starts Metro bundler

## Testing Features

### Test Authentication
1. Click "Sign Up"
2. Enter Gmail address (e.g., `test@gmail.com`)
3. Enter password (min 6 characters)
4. Check email for verification link
5. Click link to verify
6. Log in with credentials

### Test Task Creation
1. Log in successfully
2. Click "+" button (bottom right)
3. Fill in task details
4. Set due date (optional)
5. Click "Add Task"
6. Verify task appears in list

### Test Notifications
1. Create task with due date 2 minutes from now
2. Wait for notification to appear
3. Mark task as complete
4. See completion notification

### Test Firebase Push Notification
1. Note FCM token from console
2. Go to Firebase Console → Cloud Messaging
3. Click "Send your first message"
4. Enter notification title and body
5. Click "Send test message"
6. Paste FCM token
7. Click "Test"
8. Verify notification appears on device

## Next Steps

After successful setup:

1. **Customize Firestore Rules**:
   - Go to Firestore → Rules
   - Update rules for production security

2. **Add Backend Integration** (Optional):
   - Set up server to send targeted push notifications
   - Store FCM tokens in your backend
   - Implement scheduled notification triggers

3. **Configure CI/CD** (Optional):
   - Set up GitHub Actions or similar
   - Automate builds and deployments

4. **Add Analytics** (Optional):
   - Enable Firebase Analytics
   - Add custom events

## Support

For issues not covered in this guide, please refer to:
- [Main README.md](README.md)
- [React Native Documentation](https://reactnative.dev/docs/getting-started)
- [Firebase Documentation](https://firebase.google.com/docs)

## Checklist: Ready for Development

- [ ] Dependencies installed
- [ ] Firebase projects created
- [ ] Firebase config files in place
- [ ] Environment files configured
- [ ] App runs on Android/iOS
- [ ] Can sign up and log in
- [ ] Can create and manage tasks
- [ ] Notifications working
- [ ] FCM token visible in console

**If all items are checked, you're ready to start development! 🎉**
