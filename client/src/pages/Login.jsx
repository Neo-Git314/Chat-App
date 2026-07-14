import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login, signInWithGoogle } = useAuth();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      setError("Failed to log in. Please check your credentials.");
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
    <div className="min-h-screen flex items-center justify-center bg-background font-sans p-4">
      <div className="flex w-225 min-h-105 rounded-3xl overflow-hidden shadow-xl border border-border">
        {/* Left Panel */}
        <div className="w-1/2 bg-linear-to-br from-primary to-[#C56737] flex flex-col justify-between p-8">
          <div className="flex items-center gap-2">
            <div className="bg-white/20 rounded-full p-2 backdrop-blur-sm">
              <span className="text-white text-lg font-bold">···</span>
            </div>
            <span className="text-white text-lg font-semibold">ChatFlow</span>
          </div>

          <div>
            <h1 className="text-white text-4xl font-extrabold leading-tight tracking-tight">
              Connect.
              <br />
              Chat.
              <br />
              Stay Close.
            </h1>
            <p className="text-white/85 text-sm mt-4 max-w-xs">
              Helps you connect with people in real time and keep the
              conversation going, anytime, anywhere
            </p>
          </div>

          <div className="flex justify-center">
            <img
              src="/chat-illustration.png"
              alt="chat illustration"
              className="w-48 opacity-95"
            />
          </div>
        </div>

        {/* Right Panel */}
        <div className="w-1/2 bg-surface flex flex-col justify-center px-10 py-8 relative">
          <p className="absolute top-4 right-6 text-xs text-text-muted">
            don't have an account?{" "}
            <Link to="/signup" className="text-primary font-medium hover:text-primary-hover">
              Sign up
            </Link>
          </p>

          <h2 className="text-2xl font-bold text-text-primary mb-1">
            Welcome back
          </h2>
          <p className="text-sm text-text-secondary mb-6">Login to start chatting</p>

          {error && (
            <div className="bg-danger-bg text-danger text-xs p-3 rounded-xl mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm text-text-secondary mb-1.5 font-medium">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-surface-secondary border border-border rounded-xl px-3.5 py-2.5 text-sm text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm text-text-secondary mb-1.5 font-medium">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-surface-secondary border border-border rounded-xl px-3.5 py-2.5 text-sm text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40 transition-all"
              />
              <div className="text-right mt-1.5">
                <span className="text-xs text-primary cursor-pointer hover:text-primary-hover hover:underline">
                  Forgot password?
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary-hover text-white py-2.5 rounded-xl text-sm font-semibold shadow-md shadow-primary/25 hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-60 disabled:hover:translate-y-0"
            >
              {loading ? "Logging in..." : "Log in"}
            </button>
          </form>

          <div className="flex items-center my-5">
            <hr className="flex-1 border-border" />
            <span className="text-xs text-text-muted mx-2">Or continue with</span>
            <hr className="flex-1 border-border" />
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleGoogleSignIn}
              className="flex-1 flex items-center justify-center gap-2 border border-border bg-surface rounded-xl py-2 text-xs text-text-secondary hover:bg-surface-secondary transition-colors"
            >
              <img
                src="https://www.google.com/favicon.ico"
                className="w-4 h-4"
              />
              Google
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 border border-border bg-surface rounded-xl py-2 text-xs text-text-secondary hover:bg-surface-secondary transition-colors">
              <span>🍎</span>
              Apple
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 border border-border bg-surface rounded-xl py-2 text-xs text-text-secondary hover:bg-surface-secondary transition-colors">
              <span className="text-primary">💬</span>
              Discord
            </button>
          </div>

          <p className="text-center text-xs text-text-muted mt-4">
            🔒 Your data is safe and encrypted
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
