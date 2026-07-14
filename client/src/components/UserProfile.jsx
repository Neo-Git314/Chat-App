// UserProfilePage.jsx
import { useState } from "react";
import ProfileCard from "./ProfileCard";
import { useAuth } from "../context/AuthContext";

export default function UserProfilePage({ currentUser, onLogout }) {
  const { updateUserProfile } = useAuth();
  const uid = currentUser?.uid;

  const [phone, setPhone] = useState(
    () => (uid && localStorage.getItem(`chatflow:phone:${uid}`)) || "Not set"
  );
  const [about, setAbout] = useState(
    () => (uid && localStorage.getItem(`chatflow:about:${uid}`)) || "Available for chatting"
  );

  const handleFieldSave = async (field, value) => {
    switch (field) {
      case "username":
        await updateUserProfile({ displayName: value });
        break;
      case "email":
        await updateUserProfile({ email: value });
        break;
      case "phone":
        if (uid) localStorage.setItem(`chatflow:phone:${uid}`, value);
        setPhone(value);
        break;
      case "about":
        if (uid) localStorage.setItem(`chatflow:about:${uid}`, value);
        setAbout(value);
        break;
      default:
        break;
    }
  };

  return (
    <div className="min-h-screen bg-background p-6 md:p-8 font-sans flex flex-col items-center">
      <div className="w-full max-w-sm">
        {/* Page title */}
        <p className="text-text-muted text-sm font-medium mb-5 tracking-wide">
          User Profile
        </p>

        {/* Profile Card Layout */}
        <ProfileCard
          name={currentUser?.displayName || "User"}
          username={`@${currentUser?.displayName?.replace(/\s/g, "").toLowerCase() || "user"}`}
          email={currentUser?.email || ""}
          phone={phone}
          about={about}
          avatar={currentUser?.photoURL || ""}
          isOnline={true}
          onFieldSave={handleFieldSave}
        />
      </div>
    </div>
  );
}
