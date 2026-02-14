"use client";

import { useState } from "react";
import Link from "next/link";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [branch, setBranch] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "">("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    
    if (!name.trim()) newErrors.name = "Name is required";
    if (!email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Email is invalid";
    if (!password) newErrors.password = "Password is required";
    else if (password.length < 6) newErrors.password = "Password must be at least 6 characters";
    if (!branch.trim()) newErrors.branch = "Branch is required";
    
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
      const res = await fetch(`${apiUrl}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, branch }),
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setMessageType("success");
        setMessage("✓ Registered successfully! Redirecting to login...");
        setName("");
        setEmail("");
        setPassword("");
        setBranch("");
        // Redirect to login after 2 seconds
        setTimeout(() => {
          window.location.href = "/login";
        }, 2000);
      } else {
        setMessageType("error");
        setMessage(data.error || "Registration failed. Please try again.");
      }
    } catch (error) {
      setMessageType("error");
      setMessage("Error connecting to server. Please check if the backend is running.");
      console.error("Registration error:", error);
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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 via-violet-500 to-cyan-400 bg-clip-text text-transparent mb-2">
            Join Us
          </h1>
          <p className="text-gray-600">Create your account to get started</p>
        </div>

        {/* Form */}
        <form onSubmit={submit} className="space-y-4">
          {/* Name Field */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
            <input
              value={name}
              onChange={e => {
                setName(e.target.value);
                if (errors.name) setErrors({ ...errors, name: "" });
              }}
              placeholder="John Doe"
              className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:border-cyan-400 transition ${
                errors.name ? "border-red-500 bg-red-50" : "border-gray-200"
              }`}
            />
            {errors.name && <p className="text-red-600 text-sm mt-1">✗ {errors.name}</p>}
          </div>

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
              placeholder="john@example.com"
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

          {/* Branch Field */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Branch/Department</label>
            <select
              value={branch}
              onChange={e => {
                setBranch(e.target.value);
                if (errors.branch) setErrors({ ...errors, branch: "" });
              }}
              className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:border-cyan-400 transition ${
                errors.branch ? "border-red-500 bg-red-50" : "border-gray-200"
              }`}
            >
              <option value="">Select your branch</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Electronics">Electronics</option>
              <option value="Mechanical">Mechanical</option>
              <option value="Civil">Civil</option>
              <option value="Electrical">Electrical</option>
              <option value="Other">Other</option>
            </select>
            {errors.branch && <p className="text-red-600 text-sm mt-1">✗ {errors.branch}</p>}
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
                Registering...
              </span>
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Already have an account?{" "}
            <Link href="/login" className="text-cyan-400 font-semibold hover:text-violet-600 transition">
              Log in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
