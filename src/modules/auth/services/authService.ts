import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';

export const authService = {
  signUp: async (
    email: string,
    password: string,
  ): Promise<FirebaseAuthTypes.UserCredential> => {
    return auth().createUserWithEmailAndPassword(email, password);
  },

  login: async (
    email: string,
    password: string,
  ): Promise<FirebaseAuthTypes.UserCredential> => {
    return auth().signInWithEmailAndPassword(email, password);
  },

  logout: async (): Promise<void> => {
    return auth().signOut();
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
