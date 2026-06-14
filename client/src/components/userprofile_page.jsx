// UserProfilePage.jsx
// Combines UserCard + Settings into the full User Profile layout
import UserCard from "./UserCard";
import Settings from "./settings";

export default function UserProfilePage() {
  function handleLogout() {
    alert("Logging out…");
  }

  return (
    <div className="min-h-screen bg-[#130a1e] p-6 md:p-8 font-sans">
      {/* Page title */}
      <p className="text-[#6b5a8a] text-sm font-medium mb-5 tracking-wide">
        User Profile
      </p>

      {/* Two-column layout */}
      <div className="flex flex-col md:flex-row gap-5 max-w-4xl">
        <UserCard
          name="Alex Rivera"
          username="@alexrivera"
          email="alex@email.com"
          phone="+1 555 482 991"
          about="Available for chatting"
          avatar=""
          isOnline={true}
        />
        <Settings onLogout={handleLogout} />
      </div>
    </div>
  );
}
