// UserProfilePage.jsx - This page will be moved to Pages folder later
// Combines ProfileCard + Settings into the full User Profile layout
import { useState, useEffect } from "react";
import axios from "axios";
import { updateProfile } from "firebase/auth";
import { auth } from "../config/firebase";
import { useAuth } from "../context/AuthContext";
import ProfileCard from "./ProfileCard";
import Settings from "./Settings";

export default function UserProfilePage({
  currentUser,
  viewedUser = null,
  onClose,
}) {
  const { refreshCurrentUser, profile, setProfile } = useAuth();
  const [showEditModal, setShowEditModal] = useState(false);

  const [formData, setFormData] = useState({
    displayName: "",
    bio: "Hey there! I am using ChatFlow.",
    photoURL: "",
  });
  const user = profile;

  useEffect(() => {
    if (profile) {
      setFormData({
        displayName: profile.displayName,
        bio: profile.bio || "Hey there! I am using ChatFlow.",
        photoURL: profile.photoURL || "",
      });
    }
  }, [profile]);

  const handleProfileUpdate = async () => {
    console.log("Updating profile with data:", formData);
    try {
      // Update Firebase Auth profile
      await updateProfile(auth.currentUser, {
        displayName: formData.displayName,
        photoURL: formData.photoURL,
      });

      // Update MongoDB profile
      const token = await auth.currentUser.getIdToken(true);

      const res = await axios.patch(
        `${import.meta.env.VITE_API_URL}/api/users/${currentUser.uid}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setProfile(res.data); // Update the profile in context

      await refreshCurrentUser();

      console.log("Profile updated successfully!");
      setShowEditModal(false);
    } catch (error) {
      console.error("Profile update error:", error);
      alert("Failed to update profile. Please try again.");
    }
  };

  return (
    <div className="relative min-h-screen bg-[#130a1e] p-6 md:p-8 font-sans">
      {viewedUser && (
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white text-2xl hover:text-purple-400 transition-colors"
        >
          ✕
        </button>
      )}

      {/* Page title */}
      <p className="text-[#6b5a8a] text-sm font-medium mb-5 tracking-wide">
        User Profile
      </p>

      {/* Two-column layout */}
      <div className="flex flex-col md:flex-row gap-5 max-w-4xl">
        <ProfileCard
          name={user?.displayName || "User"}
          username={`${user?.displayName?.replace(/\s/g, "").toLowerCase() || "user"}`}
          email={user?.email || "user@example.com"}
          phone="Not set"
          about={user?.bio || "Hey there! I am using ChatFlow."}
          avatar={user?.photoURL || ""}
          isOnline={true}
          editable={!viewedUser} // Editable only if viewing own profile
          onEdit={!viewedUser ? () => setShowEditModal(true) : undefined}
        />
        {/* <Settings onLogout={onLogout} /> */}
      </div>
      {!viewedUser && showEditModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="w-full max-w-md bg-[#1a1133] rounded-2xl border border-[#2d1f4e] p-6 shadow-2xl">
            <h2 className="text-xl font-semibold text-white mb-6">
              Edit Profile
            </h2>

            {/* Display Name */}
            <div className="mb-4">
              <label className="block text-sm text-[#b3a3d1] mb-2">
                Display Name
              </label>

              <input
                type="text"
                value={formData.displayName}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    displayName: e.target.value,
                  })
                }
                className="w-full bg-[#120d26] border border-[#2d1f4e] rounded-lg px-3 py-2 text-white"
              />
            </div>

            {/* Bio */}
            <div className="mb-4">
              <label className="block text-sm text-[#b3a3d1] mb-2">Bio</label>

              <textarea
                rows={3}
                value={formData.bio}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    bio: e.target.value,
                  })
                }
                className="w-full bg-[#120d26] border border-[#2d1f4e] rounded-lg px-3 py-2 text-white resize-none"
              />
            </div>

            {/* Photo URL */}
            <div className="mb-6">
              <label className="block text-sm text-[#b3a3d1] mb-2">
                Photo URL
              </label>

              <input
                type="text"
                value={formData.photoURL}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    photoURL: e.target.value,
                  })
                }
                className="w-full bg-[#120d26] border border-[#2d1f4e] rounded-lg px-3 py-2 text-white"
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 rounded-lg bg-[#2d1f4e] text-white hover:bg-[#3b2a61]"
              >
                Cancel
              </button>

              <button
                onClick={handleProfileUpdate}
                className="px-4 py-2 rounded-lg bg-[#7c3aed] text-white hover:bg-[#6d28d9]"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
