import { createContext, useState, useEffect, useContext } from "react";
import { auth, googleProvider } from "../config/firebase";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
  signInWithPopup,
} from "firebase/auth";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);

      if (user) {
        await fetchUserProfile(user);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  // Save User to MongoDB
  const saveUserToDB = async (user, displayName) => {
    try {
      const token = await user.getIdToken(true);
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/users/verify`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
    } catch (error) {
      console.error("Error saving user to DB:", error);
    }
  };

  // Login with Email/Password
  const login = async (email, password) => {
    try {
      return await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error("Login Error:", error);
      throw error;
    }
  };

  // Signup
  const signup = async (email, password, displayName) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      await updateProfile(userCredential.user, { displayName });
      await saveUserToDB(userCredential.user, displayName);
      return userCredential;
    } catch (error) {
      console.error("Signup Error:", error);
      throw error;
    }
  };

  // Google Sign-In
  const signInWithGoogle = async () => {
    try {
      const userCredential = await signInWithPopup(auth, googleProvider);
      await saveUserToDB(userCredential.user);
      return userCredential;
    } catch (error) {
      console.error("Google Sign-In Error:", error);
      throw error;
    }
  };

  // Logout
  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout Error:", error);
      throw error;
    }
  };

  const refreshCurrentUser = async () => {
    if (!auth.currentUser) return;
    
    await auth.currentUser.reload();
    setCurrentUser({...auth.currentUser});
  }

  const fetchUserProfile = async (user) => {
    if (!user) return;
    try {
      const token = await user.getIdToken();
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/users/${user.uid}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setProfile(res.data);
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        profile,
        setProfile,
        fetchUserProfile,
        login,
        signup,
        signInWithGoogle,
        logout,
        refreshCurrentUser,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
