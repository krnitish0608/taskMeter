# TaskMeter - Task Management App

A feature-rich task management application built with React Native, Firebase, and modern React patterns.

## Table of Contents
- [Architecture Overview](#architecture-overview)
- [Libraries & Technologies](#libraries--technologies)
- [Environment Setup](#environment-setup)
- [Running the App](#running-the-app)
- [Features](#features)
- [Known Limitations](#known-limitations)

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
