"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Skill = { id: number; skill_name: string; skill_level: string };
type User = { id: number; name: string; email: string; branch: string };

export default function SkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newSkill, setNewSkill] = useState("");
  const [skillLevel, setSkillLevel] = useState("Beginner");
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (!token) {
      setError("Not authenticated. Redirecting to login...");
      setTimeout(() => router.push("/login"), 2000);
      return;
    }

    if (userData) {
      setUser(JSON.parse(userData));
    }

    // Fetch skills with authentication
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    fetch(`${apiUrl}/api/skills`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((r) => {
        if (r.status === 401) {
          throw new Error("Unauthorized. Please login again.");
        }
        return r.json();
      })
      .then((data) => {
        console.log("Skills data:", data);
        if (data.skills && Array.isArray(data.skills)) {
          setSkills(data.skills);
        } else if (Array.isArray(data)) {
          setSkills(data);
        } else {
          console.warn("Unexpected response format:", data);
          setSkills([]);
        }
      })
      .catch((err) => {
        console.error("Error fetching skills:", err);
        setError(err.message || "Failed to load skills");
        setSkills([]);
      })
      .finally(() => setLoading(false));
  }, [router]);

  const addSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkill.trim()) return;

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Not authenticated");
      return;
    }

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const res = await fetch(`${apiUrl}/api/skills`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          skillName: newSkill,
          skillLevel: skillLevel,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        // Normalize the skill data to use snake_case
        const newSkillData = {
          id: data.skill.id,
          skill_name: data.skill.skillName,
          skill_level: data.skill.skillLevel
        };
        setSkills([...skills, newSkillData]);
        setNewSkill("");
        setSkillLevel("Beginner");
      } else {
        setError("Failed to add skill");
      }
    } catch (err) {
      setError("Error adding skill");
      console.error(err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-violet-600 to-cyan-400 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-violet-600 bg-clip-text text-transparent mb-2">
                My Skills
              </h1>
              {user && (
                  <p className="text-gray-600">
                  Welcome, <span className="font-semibold text-cyan-400">{user.name}</span>
                  <span className="mx-2">•</span>
                  <span className="text-sm">{user.branch}</span>
                </p>
              )}
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border-2 border-red-500 text-red-700 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Add Skill Form */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Add New Skill</h2>
          <form onSubmit={addSkill} className="flex gap-3 flex-wrap">
            <input
              type="text"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              placeholder="Skill name (e.g., Python, React, AWS)"
              className="flex-1 min-w-48 px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-cyan-400"
            />
            <select
              value={skillLevel}
              onChange={(e) => setSkillLevel(e.target.value)}
              className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-cyan-400"
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
            <button
              type="submit"
              className="px-6 py-2 bg-gradient-to-r from-slate-800 to-violet-600 hover:from-slate-900 hover:to-cyan-400 text-white rounded-lg font-semibold transition transform hover:scale-105"
            >
              Add Skill
            </button>
          </form>
        </div>

        {/* Skills List */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Your Skills {skills.length > 0 && <span className="text-indigo-600">({skills.length})</span>}
          </h2>

          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block">
                <svg className="animate-spin h-8 w-8 text-cyan-400" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
              <p className="mt-2 text-gray-600">Loading skills...</p>
            </div>
          ) : skills.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">No skills added yet.</p>
              <p className="text-sm text-gray-500">Add your first skill using the form above!</p>
            </div>
          ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {skills.map((skill) => (
                <div
                  key={skill.id}
                  className="p-4 border-2 border-gray-200 rounded-lg hover:border-violet-600 hover:shadow-md transition bg-gradient-to-br from-slate-50 to-cyan-50"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800 text-lg">{skill.skill_name}</h3>
                      <span className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-semibold text-white ${
                        skill.skill_level === "Beginner" ? "bg-cyan-500" :
                        skill.skill_level === "Intermediate" ? "bg-violet-500" :
                        "bg-slate-800"
                      }`}>
                        {skill.skill_level}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Navigation Links */}
        <div className="mt-6 text-center">
          <Link href="/matches" className="text-white hover:underline font-semibold">
            → View Matches
          </Link>
        </div>
      </div>
    </div>
  );
}
