import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const raisedShadow = "shadow-[6px_6px_12px_#bebebe,-6px_-6px_12px_#ffffff]";
const insetShadow = "shadow-[inset_4px_4px_8px_#bebebe,inset_-4px_-4px_8px_#ffffff]";

const adminId = "admin";
const adminPassword = "12345";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Simple credential check
    if (userId === adminId && password === adminPassword) {
      setTimeout(() => {
        navigate("/dashboard");
      }, 600);
    } else {
      setTimeout(() => {
        setError("Invalid User ID or Password");
        setIsLoading(false);
      }, 500);
    }
  };

  return (
    <div className="min-h-screen bg-[#e0e5ec] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <div
          className={`bg-[#e0e5ec] rounded-3xl p-10 ${raisedShadow}`}
        >
          {/* Header */}
          <div className="text-center mb-10">
            <div className="mx-auto w-16 h-16 bg-violet-600 rounded-2xl flex items-center justify-center mb-4">
              <span className="text-white text-3xl">🔑</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-800">Admin Login</h1>
            <p className="text-gray-600 mt-2">Access the Admin Dashboard</p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                User ID
              </label>
              <input
                type="text"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                className={`w-full px-5 py-4 rounded-2xl bg-[#e0e5ec] text-gray-800 focus:outline-none ${insetShadow} transition-all`}
                placeholder="Enter User ID"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full px-5 py-4 rounded-2xl bg-[#e0e5ec] text-gray-800 focus:outline-none ${insetShadow} transition-all`}
                placeholder="Enter Password"
                required
              />
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-500 text-sm font-medium text-center"
              >
                {error}
              </motion.p>
            )}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className={`
                w-full py-4 rounded-2xl font-semibold text-white
                bg-violet-600 hover:bg-violet-700 transition-all duration-300
                ${raisedShadow} flex items-center justify-center gap-2
              `}
            >
              {isLoading ? "Verifying..." : "Login to Dashboard"}
            </motion.button>
          </form>

          <p className="text-center text-xs text-gray-500 mt-8">
            Default Credentials: <span className="font-mono">admin / 12345</span>
          </p>
        </div>
      </motion.div>
    </div>
  );
}