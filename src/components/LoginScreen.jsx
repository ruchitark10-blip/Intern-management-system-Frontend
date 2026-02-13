import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff, ChevronRight } from "lucide-react";
import logo from "../assets/solstra.png";

const LoginScreen = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch("http://localhost:5000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Login failed");
        setIsLoading(false);
        return;
      }

      // Send role & token to App.jsx
      onLogin(data.role, data.token);

    } catch (err) {
      console.error(err);
      alert("Server error");
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen w-screen bg-slate-50 flex items-center justify-center relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1/2 bg-[#2e2a69] transform -skew-y-6 origin-top-left z-0"></div>

      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl flex overflow-hidden relative z-10 min-h-[600px]">
        
        {/* LEFT PANEL */}
        <div className="hidden md:flex w-1/2 bg-gradient-to-br from-[#2e2a69] to-[#1a1640] text-white p-12 flex-col justify-between">
          <div>
            <div className="flex items-center gap-2">
              <img src={logo} className="w-9 h-9 object-contain" alt="Solstra Logo" />
              <h1 className="text-lg font-semibold tracking-wide text-white">Solstra</h1>
            </div>
            <p className="text-blue-200 text-sm tracking-widest">IT SOLUTION LLP</p>
          </div>

          <div>
            <h2 className="text-3xl font-bold">IMS Dashboard</h2>
            <p className="text-blue-200 mt-3">
              Manage your interns, mentors, and tasks from one central platform.
            </p>
          </div>

          <div className="text-xs text-blue-300">
            © 2026 Solstra Info. All rights reserved.
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="w-full md:w-1/2 p-12 flex flex-col justify-center bg-white">
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Welcome Back!</h3>
            <p className="text-gray-500">
              Please login using your registered credentials.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            
            {/* EMAIL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#2e2a69] outline-none bg-gray-50"
                  placeholder="admin@solstrainfo.com"
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#2e2a69] outline-none bg-gray-50"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* LOGIN BUTTON */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#2e2a69] text-white py-3 rounded-lg font-semibold shadow-lg hover:bg-[#231f50] transition-all flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  Sign In <ChevronRight size={18} />
                </>
              )}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
