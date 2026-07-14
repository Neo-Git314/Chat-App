import { createContext, useState, useEffect, useContext } from "react";
import { auth, googleProvider } from "../config/firebase";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  updateEmail,
  signOut,
  signInWithPopup,
} from "firebase/auth";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
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

  // Update Profile (displayName / email)
  const updateUserProfile = async (updates) => {
    const user = auth.currentUser;
    if (!user) throw new Error("Not authenticated");
    try {
      if (updates.displayName !== undefined) {
        await updateProfile(user, { displayName: updates.displayName });
      }
      if (updates.email !== undefined && updates.email !== user.email) {
        await updateEmail(user, updates.email);
      }
      await user.reload();
      setCurrentUser({ ...auth.currentUser });
    } catch (error) {
      console.error("Update Profile Error:", error);
      if (error.code === "auth/requires-recent-login") {
        throw new Error("Please log out and back in to change this.");
      }
      if (error.code === "auth/email-already-in-use") {
        throw new Error("That email is already in use.");
      }
      if (error.code === "auth/invalid-email") {
        throw new Error("Enter a valid email address.");
      }
      throw new Error(error.message || "Failed to update profile.");
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

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        login,
        signup,
        signInWithGoogle,
        updateUserProfile,
        logout,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
