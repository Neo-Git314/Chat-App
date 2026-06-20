import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Signup = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { signup, signInWithGoogle } = useAuth();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signup(email, password, fullName);
      navigate("/");
    } catch (err) {
      setError("Failed to create an account.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError("");
    setLoading(true);
    try {
      await signInWithGoogle();
      navigate("/");
    } catch (err) {
      setError("Failed to sign in with Google.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="flex w-225 min-h-105 rounded-2xl overflow-hidden shadow-2xl">
        {/* Left Panel */}
        <div className="w-1/2 bg-[#1a1040] flex flex-col justify-between p-8">
          <div className="flex items-center gap-2">
            <div className="bg-purple-600 rounded-full p-2">
              <span className="text-white text-lg font-bold">···</span>
            </div>
            <span className="text-white text-lg font-semibold">ChatFlow</span>
          </div>

          <div>
            <h1 className="text-white text-4xl font-bold leading-tight">
              Connect.
              <br />
              Chat.
              <br />
              Stay Close.
            </h1>
            <p className="text-purple-300 text-sm mt-4">
              Helps you connect with people in real time and keep the
              conversation going, anytime, anywhere
            </p>
          </div>

          <div className="flex justify-center">
            <img
              src="/chat-illustration.png"
              alt="chat illustration"
              className="w-48 opacity-90"
            />
          </div>
        </div>

        {/* Right Panel */}
        <div className="w-1/2 bg-white flex flex-col justify-center px-10 py-8 relative">
          <p className="absolute top-4 right-6 text-xs text-gray-500">
            already have an account?{" "}
            <Link to="/login" className="text-purple-600 font-medium">
              Login
            </Link>
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mb-1">
            CREATE YOUR ACCOUNT
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            Sign up to start chatting
          </p>

          {error && (
            <div className="bg-red-100 text-red-600 text-xs p-2 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-1">
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded text-sm font-medium transition duration-200"
            >
              {loading ? "Creating account..." : "sign up"}
            </button>
          </form>

          <div className="flex items-center my-4">
            <hr className="flex-1 border-gray-200" />
            <span className="text-xs text-gray-400 mx-2">or continue with</span>
            <hr className="flex-1 border-gray-200" />
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleGoogleSignIn}
              className="flex-1 flex items-center justify-center gap-2 border border-gray-200 rounded py-2 text-xs text-gray-600 hover:bg-gray-50"
            >
              <img
                src="https://www.google.com/favicon.ico"
                className="w-4 h-4"
              />
              Google
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 border border-gray-200 rounded py-2 text-xs text-gray-600 hover:bg-gray-50">
              <span>🍎</span>
              Apple
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 border border-gray-200 rounded py-2 text-xs text-gray-600 hover:bg-gray-50">
              <span className="text-indigo-500">💬</span>
              Discord
            </button>
          </div>

          <p className="text-center text-xs text-gray-400 mt-4">
            🔒 your data is safe and encrypted
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
