import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';

const handleFirebaseError = (error: any): Error => {
  if (error?.code) {
    const errorMessages: Record<string, string> = {
      'auth/configuration-not-found': 'Firebase is not properly initialized. Please check if google-services.json (Android) or GoogleService-Info.plist (iOS) is configured correctly.',
      'auth/weak-password': 'Password is too weak (minimum 6 characters required)',
      'auth/email-already-in-use': 'Email address is already in use',
      'auth/invalid-email': 'Email address is invalid',
      'auth/user-not-found': 'User not found',
      'auth/wrong-password': 'Incorrect password',
    };
    
    const message = errorMessages[error.code] || error.message;
    return new Error(`${error.code}: ${message}`);
  }
  return error;
};

export const authService = {
  signUp: async (
    email: string,
    password: string,
  ): Promise<FirebaseAuthTypes.UserCredential> => {
    try {
      return await auth().createUserWithEmailAndPassword(email, password);
    } catch (error: any) {
      throw handleFirebaseError(error);
    }
  },

  login: async (
    email: string,
    password: string,
  ): Promise<FirebaseAuthTypes.UserCredential> => {
    try {
      return await auth().signInWithEmailAndPassword(email, password);
    } catch (error: any) {
      throw handleFirebaseError(error);
    }
  },

  logout: async (): Promise<void> => {
    try {
      return await auth().signOut();
    } catch (error: any) {
      throw handleFirebaseError(error);
    }
  },

  getCurrentUser: (): FirebaseAuthTypes.User | null => {
    return auth().currentUser;
  },

  onAuthStateChanged: (
    callback: (user: FirebaseAuthTypes.User | null) => void,
  ) => {
    return auth().onAuthStateChanged(callback);
  },
};
