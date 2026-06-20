// UserProfilePage.jsx
// Combines ProfileCard + Settings into the full User Profile layout
import ProfileCard from "./ProfileCard";
import Settings from "./Settings";

export default function UserProfilePage({ currentUser, onLogout }) {
  return (
    <div className="min-h-screen bg-[#130a1e] p-6 md:p-8 font-sans">
      {/* Page title */}
      <p className="text-[#6b5a8a] text-sm font-medium mb-5 tracking-wide">
        User Profile
      </p>

      {/* Two-column layout */}
      <div className="flex flex-col md:flex-row gap-5 max-w-4xl">
        <ProfileCard
          name={currentUser?.displayName || "User"}
          username={`@${currentUser?.displayName?.replace(/\s/g, "").toLowerCase() || "user"}`}
          email={currentUser?.email || ""}
          phone="Not set"
          about="Available for chatting"
          avatar={currentUser?.photoURL || ""}
          isOnline={true}
        />
        <Settings onLogout={onLogout} />
      </div>
    </div>
  );
}
