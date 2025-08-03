# Firebase Integration Guide for Visiora

This guide explains how to set up Firebase for Visiora.

## Prerequisites

- A Firebase account
- Node.js and npm installed

## Step 1: Create a Firebase Project

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Click "Add Project"
3. Name your project (e.g., "visiora")
4. Follow the setup wizard (you can disable Google Analytics if desired)
5. Click "Create Project"

## Step 2: Register Your Web App

1. On the Firebase project dashboard, click the web icon (`</>`)
2. Register your app with a nickname (e.g., "visiora-web")
3. Check "Also set up Firebase Hosting" (optional)
4. Click "Register App"
5. Copy the Firebase configuration object (you'll need this later)

## Step 3: Set Up Environment Variables

1. Create a `.env` file in the project root (if it doesn't exist already)
2. Add your Firebase configuration as environment variables:

```
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

## Step 4: Enable Authentication

1. In the Firebase console, go to "Authentication"
2. Click "Get Started"
3. Enable the "Email/Password" provider
4. (Optional) Enable "Google" sign-in provider
   - Configure the OAuth consent screen
   - Add your domain to the authorized domains list

## Step 5: Set Up Firestore Database

1. Go to "Firestore Database" in the Firebase console
2. Click "Create Database"
3. Choose "Start in production mode" or "Start in test mode"
   - Production mode requires writing security rules
   - Test mode allows read/write access to anyone (good for development)
4. Choose a database location close to your users
5. Click "Enable"

## Step 6: Create Firestore Security Rules

1. Go to "Firestore Database" > "Rules" tab
2. Update the security rules to match your needs. Example:

```
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    match /images/{imageId} {
      allow read: if true;
      allow write: if request.auth != null;
      allow delete: if request.auth != null && resource.data.userId == request.auth.uid;
    }
  }
}
```

## Step 7: Set Up Firebase Storage

1. Go to "Storage" in the Firebase console
2. Click "Get Started"
3. Choose "Start in production mode" or "Start in test mode"
4. Update the security rules as needed. Example:

```
rules_version = '2';

service firebase.storage {
  match /b/{bucket}/o {
    match /images/{userId}/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
      allow delete: if request.auth != null && request.auth.uid == userId;
    }
    
    match /public/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

## Step 8: Install the Firebase SDK (if not done already)

Run:
```bash
npm install firebase
```

## Step 9: Initialize Firebase in Your App

The Firebase configuration file is already set up at `src/lib/firebase.js`

## Step 10: Test Your Firebase Integration

1. Start your development server:
```bash
npm run dev
```
2. Try to register a new user
3. Log in with the registered user
4. Verify that user data is saved to Firestore

## Additional Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [React Firebase Hooks](https://github.com/CSFrequency/react-firebase-hooks)
- [Firebase Authentication](https://firebase.google.com/docs/auth)
- [Cloud Firestore](https://firebase.google.com/docs/firestore)
- [Firebase Storage](https://firebase.google.com/docs/storage)

## Troubleshooting

- **CORS Issues**: Make sure to configure CORS for your Firebase Storage bucket if accessing from different domains.
- **Authentication Issues**: Check Firebase Authentication logs in the Firebase console.
- **Database Access Issues**: Verify your security rules and that users have the correct permissions.
