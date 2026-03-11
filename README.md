# TaskMeter - Task Management App

A feature-rich task management application built with React Native, Firebase, and modern React patterns.

## Table of Contents
- [Architecture Overview](#architecture-overview)
- [Libraries & Technologies](#libraries--technologies)
- [Environment Setup](#environment-setup)
- [Running the App](#running-the-app)
- [Features](#features)
- [Known Limitations](#known-limitations)
- [Project Structure](#project-structure)

---

## Architecture Overview

### **Architecture Choice: Feature-Based Modular Architecture**

The application follows a **feature-based modular architecture** combined with **Redux Toolkit** for state management. This approach provides:

#### **Key Architectural Decisions:**

1. **Feature Modules**: Code is organized by feature (auth, tasks, notifications, settings), making it scalable and maintainable.

2. **State Management**: Redux Toolkit with Redux Persist for:
   - Global state management
   - Offline-first capabilities
   - State persistence across app restarts

3. **Data Layer**:
   - **Local Storage**: SQLite for offline task storage
   - **Cloud Sync**: Firebase Firestore for real-time synchronization
   - **MMKV**: Fast key-value storage for app preferences

4. **Navigation**: React Navigation with stack-based navigation for auth and tab-based for main app flow.

5. **Styling**: Theme-based approach with light/dark mode support using React Context.

### **Architecture Diagram:**

```
┌─────────────────────────────────────────────────────────┐
│                    Presentation Layer                    │
│  (Screens, Components, Navigation, Themes)              │
├─────────────────────────────────────────────────────────┤
│                   Business Logic Layer                   │
│  (Redux Slices, Async Thunks, State Management)        │
├─────────────────────────────────────────────────────────┤
│                     Service Layer                        │
│  (Auth, Tasks, Notifications, Database, Firebase)      │
├─────────────────────────────────────────────────────────┤
│                      Data Layer                          │
│  SQLite (Local) | Firestore (Cloud) | MMKV (Cache)     │
└─────────────────────────────────────────────────────────┘
```

---

## Libraries & Technologies

### **Core Framework**
- **React Native 0.84.1**: Cross-platform mobile app framework
- **React 19.2.3**: UI library
- **TypeScript 5.8.3**: Type-safe development

### **State Management**
- **@reduxjs/toolkit**: Modern Redux with less boilerplate
- **react-redux**: React bindings for Redux
- **redux-persist**: Persist Redux state to storage

### **Navigation**
- **@react-navigation/native**: Navigation library
- **@react-navigation/bottom-tabs**: Tab-based navigation
- **@react-navigation/native-stack**: Stack-based navigation

### **Backend & Authentication**
- **@react-native-firebase/app**: Firebase core SDK
- **@react-native-firebase/auth**: Firebase Authentication (Email/Password, Email Verification)
- **@react-native-firebase/firestore**: Cloud Firestore for real-time sync
- **@react-native-firebase/messaging**: Firebase Cloud Messaging (Push Notifications)

### **Storage**
- **react-native-sqlite-storage**: Local database for offline storage
- **react-native-mmkv**: Fast key-value storage

### **Notifications**
- **@notifee/react-native**: Local notifications & FCM display

### **Network & Config**
- **@react-native-community/netinfo**: Network status monitoring
- **react-native-config**: Environment variable management

### **UI/UX**
- **react-native-vector-icons**: Icon library (MaterialIcons)
- **react-native-safe-area-context**: Safe area handling
- **react-native-screens**: Native screen optimization

### **Development Tools**
- **ESLint**: Code linting
- **Prettier**: Code formatting
- **Jest**: Unit testing
- **patch-package**: NPM package patching

---

## Environment Setup

### **Prerequisites**

1. **Node.js**: >= 22.11.0
2. **npm** or **yarn**
3. **Android Studio** (for Android development)
4. **Xcode** (for iOS development - macOS only)
5. **CocoaPods** (for iOS dependencies)

### **Installation**

1. Clone the repository:
```bash
git clone <repository-url>
cd taskMeter
```

2. Install dependencies:
```bash
npm install
```

3. Install iOS dependencies (macOS only):
```bash
cd ios
pod install
cd ..
```

### **Environment Variables**

The app uses environment-specific configuration files:

- `.env.development` - Development environment
- `.env.staging` - Staging environment
- `.env.production` - Production environment

**Sample `.env` structure:**
```env
# Environment identifier
APP_ENV=development

# API Configuration
API_BASE_URL=https://dev-api.taskmeter.app

# Firestore Configuration
FIRESTORE_COLLECTION_PREFIX=dev_

# Logging
ENABLE_LOGGING=true
```

### **Firebase Configuration**

The app requires Firebase configuration files for each environment:

**Android:**
- `android/app/google-services.dev.json` (Development)
- `android/app/google-services.prod.json` (Production)

**iOS:**
- `ios/taskMeter/GoogleService-Info-dev.plist` (Development)
- `ios/taskMeter/GoogleService-Info-prod.plist` (Production)

> **Note**: These files are auto-copied based on the environment script you run.

---

## Running the App

### **Development Environment**

```bash
# Terminal 1: Start Metro bundler with dev config
npm run dev

# Terminal 2: Run on Android
npm run android

# Terminal 2: Run on iOS (macOS only)
npm run ios
```

### **Staging Environment**

```bash
# Terminal 1: Start Metro bundler with staging config
npm run staging

# Terminal 2: Run on Android
npm run android

# Terminal 2: Run on iOS (macOS only)
npm run ios
```

### **Production Environment**

```bash
# Terminal 1: Start Metro bundler with production config
npm run prod

# Terminal 2: Run on Android
npm run android

# Terminal 2: Run on iOS (macOS only)
npm run ios
```

### **Environment Script Explanation**

Each environment script (`dev`, `staging`, `prod`) performs the following:
1. Copies the appropriate `.env.*` file to `.env`
2. Copies the appropriate Firebase config files (`google-services.json` and `GoogleService-Info.plist`)
3. Starts the Metro bundler

### **iOS-Specific Setup**

If you encounter Xcode issues, ensure the developer directory is set correctly:

```bash
sudo xcode-select --switch /Applications/Xcode.app/Contents/Developer
sudo xcodebuild -runFirstLaunch
```

Always open the workspace file (not the project file):
```bash
open ios/taskMeter.xcworkspace
```

---

## Features

### **Authentication**
- ✅ Email/Password authentication via Firebase Auth
- ✅ Gmail-only validation
- ✅ Email verification flow
- ✅ Secure session management
- ✅ Login success notifications

### **Task Management**
- ✅ Create, read, update, delete tasks
- ✅ Task completion tracking
- ✅ Due date management
- ✅ Offline-first with SQLite
- ✅ Cloud sync with Firestore
- ✅ Real-time updates

### **Notifications**
- ✅ Firebase Cloud Messaging (Push Notifications)
- ✅ Local notifications for:
  - Login success
  - Task completion
  - Task due date reminders
- ✅ Background & foreground notification handling
- ✅ Notification interaction handling

### **UI/UX**
- ✅ Dark/Light theme support
- ✅ Bottom tab navigation (Tasks, Settings)
- ✅ Safe area handling
- ✅ Network status indicator
- ✅ Loading states & error handling

---

## Known Limitations

### **Technical Limitations**

1. **iOS Development Requirements**
   - Requires macOS and Xcode to build and run iOS version
   - Cannot develop iOS apps on Windows/Linux

2. **Email Verification**
   - Gmail account existence cannot be verified before signup
   - Users must verify email after registration
   - Unverified accounts can still use the app (by design)

3. **Offline Sync**
   - Conflicts during offline-to-online sync are resolved with last-write-wins strategy
   - No conflict resolution UI currently implemented

4. **Notification Scheduling**
   - Due date notifications scheduled at exact date/time
   - No customizable reminder times (e.g., 1 hour before, 1 day before)

5. **Firebase Configuration**
   - Requires manual Firebase project setup
   - Environment-specific config files must be obtained from Firebase Console

### **Feature Limitations**

1. **Task Features**
   - No task categories or tags
   - No task priority levels
   - No recurring tasks
   - No task attachments

2. **Authentication**
   - Only email/password authentication
   - No social login (Google, Apple, Facebook)
   - No password reset functionality (can be added via Firebase Auth)

3. **Notifications**
   - Push notifications require backend integration for targeted messaging
   - No notification history or notification center

4. **UI/UX**
   - No task search functionality
   - No task filtering/sorting options
   - No bulk actions (delete multiple tasks)

### **Performance Considerations**

1. **Large Dataset Handling**
   - Not optimized for 1000+ tasks
   - Current implementation loads all tasks into memory

2. **Image Optimization**
   - App icons use static PNG files
   - No SVG support for adaptive scaling

---

## Project Structure

```
taskMeter/
├── android/                    # Android native code
│   └── app/
│       ├── google-services.dev.json
│       └── google-services.prod.json
├── ios/                        # iOS native code
│   └── taskMeter/
│       ├── GoogleService-Info-dev.plist
│       └── GoogleService-Info-prod.plist
├── src/
│   ├── app/                    # Redux store configuration
│   ├── config/                 # App configuration
│   ├── contexts/               # React contexts (Theme)
│   ├── core/                   # Core utilities
│   │   ├── constants/          # App constants
│   │   ├── database/           # SQLite setup
│   │   ├── firebase/           # Firebase initialization
│   │   ├── hooks/              # Custom React hooks
│   │   ├── storage/            # MMKV storage
│   │   └── types/              # TypeScript types
│   ├── modules/                # Feature modules
│   │   ├── auth/               # Authentication module
│   │   │   ├── components/     # Auth-specific UI components
│   │   │   ├── screens/        # Login, SignUp, EmailVerification
│   │   │   ├── services/       # Auth service (Firebase Auth)
│   │   │   └── slices/         # Redux slices for auth state
│   │   ├── tasks/              # Task management module
│   │   │   ├── components/     # Task-specific UI components
│   │   │   ├── screens/        # TaskList, AddEditTask
│   │   │   ├── services/       # Task services (SQLite, Firestore)
│   │   │   └── slices/         # Redux slices for task state
│   │   ├── notifications/      # Notification module
│   │   │   └── services/       # Notification service (Notifee, FCM)
│   │   └── settings/           # Settings module
│   │       └── screens/        # Settings screen
│   ├── navigation/             # Navigation configuration
│   │   ├── AppStack.tsx        # Main app navigation (tabs)
│   │   ├── AuthStack.tsx       # Auth navigation (login, signup)
│   │   └── RootNavigator.tsx   # Root navigator with auth state
│   └── themes/                 # Theme configuration
├── .env.development            # Development environment variables
├── .env.staging                # Staging environment variables
├── .env.production             # Production environment variables
├── index.js                    # Entry point with FCM background handler
├── App.tsx                     # Root App component
└── package.json                # Dependencies and scripts
```

---

## Firebase Setup

1. Create Firebase projects:
   - Development: `taskmeter-dev`
   - Production: `taskmeter-prod`

2. Enable services in Firebase Console:
   - **Authentication**: Email/Password provider
   - **Firestore**: Create database
   - **Cloud Messaging**: Enable FCM

3. Download configuration files:
   - Android: `google-services.json`
   - iOS: `GoogleService-Info.plist`

4. Place files in appropriate directories (see Project Structure)

---

## Testing Notifications

### **Firebase Push Notifications**

1. Run the app and copy the FCM token from console logs
2. Go to Firebase Console → Cloud Messaging
3. Create a new campaign and send a test message using the token

### **Local Notifications**

1. **Login Notification**: Sign in to see welcome message
2. **Task Completion**: Mark any task as complete
3. **Due Date Reminder**: Create a task with a due date (set 1-2 minutes ahead for testing)

---

## Troubleshooting

### **Android Issues**

```bash
# Clean build
cd android && ./gradlew clean && cd ..

# Clear Metro cache
npm start -- --reset-cache
```

### **iOS Issues**

```bash
# Reinstall pods
cd ios && pod deintegrate && pod install && cd ..

# Clean build
rm -rf ios/build
```

### **Metro Issues**

```bash
# Clear watchman
watchman watch-del-all

# Clear Metro cache
rm -rf $TMPDIR/metro-*
rm -rf $TMPDIR/haste-*
```

---

## License

This project is private and confidential.

---

## Contact

For questions or issues, please contact the development team.

For more information, please visit [CocoaPods Getting Started guide](https://guides.cocoapods.org/using/getting-started.html).

```sh
# Using npm
npm run ios

# OR using Yarn
yarn ios
```

If everything is set up correctly, you should see your new app running in the Android Emulator, iOS Simulator, or your connected device.

This is one way to run your app — you can also build it directly from Android Studio or Xcode.

## Step 3: Modify your app

Now that you have successfully run the app, let's make changes!

Open `App.tsx` in your text editor of choice and make some changes. When you save, your app will automatically update and reflect these changes — this is powered by [Fast Refresh](https://reactnative.dev/docs/fast-refresh).

When you want to forcefully reload, for example to reset the state of your app, you can perform a full reload:

- **Android**: Press the <kbd>R</kbd> key twice or select **"Reload"** from the **Dev Menu**, accessed via <kbd>Ctrl</kbd> + <kbd>M</kbd> (Windows/Linux) or <kbd>Cmd ⌘</kbd> + <kbd>M</kbd> (macOS).
- **iOS**: Press <kbd>R</kbd> in iOS Simulator.

## Congratulations! :tada:

You've successfully run and modified your React Native App. :partying_face:

### Now what?

- If you want to add this new React Native code to an existing application, check out the [Integration guide](https://reactnative.dev/docs/integration-with-existing-apps).
- If you're curious to learn more about React Native, check out the [docs](https://reactnative.dev/docs/getting-started).

# Troubleshooting

If you're having issues getting the above steps to work, see the [Troubleshooting](https://reactnative.dev/docs/troubleshooting) page.

# Learn More

To learn more about React Native, take a look at the following resources:

- [React Native Website](https://reactnative.dev) - learn more about React Native.
- [Getting Started](https://reactnative.dev/docs/environment-setup) - an **overview** of React Native and how setup your environment.
- [Learn the Basics](https://reactnative.dev/docs/getting-started) - a **guided tour** of the React Native **basics**.
- [Blog](https://reactnative.dev/blog) - read the latest official React Native **Blog** posts.
- [`@facebook/react-native`](https://github.com/facebook/react-native) - the Open Source; GitHub **repository** for React Native.
# taskMeter
