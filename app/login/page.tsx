"use client";

import { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "">("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    
    if (!email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Email is invalid";
    if (!password) newErrors.password = "Password is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    setMessage("");
    
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const res = await fetch(`${apiUrl}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await res.json();
      
      if (res.ok && data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        setMessageType("success");
        setMessage("✓ Login successful! Redirecting...");
        setEmail("");
        setPassword("");
        // Redirect after 2 seconds
        setTimeout(() => {
          window.location.href = "/skills";
        }, 2000);
      } else {
        setMessageType("error");
        setMessage(data.error || "Login failed. Please try again.");
      }
    } catch (error) {
      setMessageType("error");
      setMessage("Error connecting to server. Please check if the backend is running.");
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-violet-600 to-cyan-400 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-block bg-gradient-to-r from-slate-800 to-violet-600 rounded-full p-4 mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 via-violet-500 to-cyan-400 bg-clip-text text-transparent mb-2">
            Welcome Back
          </h1>
          <p className="text-gray-600">Sign in to your account</p>
        </div>

        {/* Form */}
        <form onSubmit={submit} className="space-y-4">
          {/* Email Field */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
            <input
              value={email}
              onChange={e => {
                setEmail(e.target.value);
                if (errors.email) setErrors({ ...errors, email: "" });
              }}
              type="email"
              placeholder="you@example.com"
              className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:border-cyan-400 transition ${
                errors.email ? "border-red-500 bg-red-50" : "border-gray-200"
              }`}
            />
            {errors.email && <p className="text-red-600 text-sm mt-1">✗ {errors.email}</p>}
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
            <input
              value={password}
              onChange={e => {
                setPassword(e.target.value);
                if (errors.password) setErrors({ ...errors, password: "" });
              }}
              type="password"
              placeholder="••••••••"
              className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:border-cyan-400 transition ${
                errors.password ? "border-red-500 bg-red-50" : "border-gray-200"
              }`}
            />
            {errors.password && <p className="text-red-600 text-sm mt-1">✗ {errors.password}</p>}
          </div>

          {/* Message Display */}
          {message && (
            <div className={`p-4 rounded-lg ${
              messageType === "success" 
                ? "bg-green-100 border-2 border-green-500 text-green-700" 
                : "bg-red-100 border-2 border-red-500 text-red-700"
            }`}>
              {message}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition transform duration-200 ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-slate-800 to-violet-600 hover:from-slate-900 hover:to-cyan-400 hover:shadow-lg hover:scale-105"
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing in...
              </span>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Don't have an account?{" "}
            <Link href="/register" className="text-cyan-400 font-semibold hover:text-violet-600 transition">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
