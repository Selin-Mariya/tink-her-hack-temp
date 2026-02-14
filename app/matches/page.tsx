"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Match = {
  id: number;
  name?: string;
  email?: string;
  branch?: string;
  matched_user_name?: string;
  matched_user_email?: string;
  matched_user_branch?: string;
  compatibilityScore?: number;
  compatibility_score?: number;
  skillMatch?: number;
  interestMatch?: number;
  matchingSkills?: string;
  shared_skills?: string;
  commonInterests?: string;
  commonAvailability?: string;
  matchPercentage?: number;
  matchCategory?: string;
  matchedSkills?: string[];
  totalRequiredSkills?: number;
};

type User = { id: number; name: string; email: string; branch: string };

export default function MatchesPage() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
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

    // Fetch matches with authentication
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    fetch(`${apiUrl}/api/match`, {
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
        console.log("Matches data:", data);
        if (data.topMatches && Array.isArray(data.topMatches)) {
          setMatches(data.topMatches);
        } else if (data.matches && Array.isArray(data.matches)) {
          setMatches(data.matches);
        } else if (Array.isArray(data)) {
          setMatches(data);
        } else {
          console.warn("Unexpected response format:", data);
          setMatches([]);
        }
      })
      .catch((err) => {
        console.error("Error fetching matches:", err);
        setError(err.message || "Failed to load matches");
        setMatches([]);
      })
      .finally(() => setLoading(false));
  }, [router]);

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
                Matched Profiles
              </h1>
              {user && (
                <p className="text-gray-600">
                  Connect with peers who share your skills and interests
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

        {/* Matches List */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Discover Connections {matches.length > 0 && <span className="text-teal-600">({matches.length})</span>}
          </h2>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block">
                <svg className="animate-spin h-10 w-10 text-cyan-400" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
              <p className="mt-3 text-gray-100 font-semibold">Finding your perfect matches...</p>
            </div>
          ) : matches.length === 0 ? (
            <div className="text-center py-12">
              <svg className="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3a6 6 0 016-6h6a6 6 0 016 6v0z" />
              </svg>
              <p className="text-gray-600 font-semibold mb-2">No matches yet</p>
              <p className="text-sm text-gray-500 mb-4">Add more skills to get matched with more people!</p>
              <Link href="/skills" className="inline-block px-6 py-2 bg-gradient-to-r from-slate-800 to-violet-600 text-white rounded-lg font-semibold hover:shadow-lg transition hover:from-slate-900 hover:to-cyan-400">
                Add Skills
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {matches.map((match, index) => (
                <div
                  key={match.id || index}
                  className="p-6 rounded-xl border-2 border-gray-200 hover:border-violet-600 hover:shadow-lg transition bg-gradient-to-br from-slate-50 to-cyan-50"
                >
                  {/* User Info */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-800">
                        {match.name || match.matched_user_name || "Unknown User"}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {match.email || match.matched_user_email}
                      </p>
                        {(match.branch || match.matched_user_branch) && (
                        <span className="inline-block mt-2 px-3 py-1 bg-violet-100 text-violet-700 text-sm font-semibold rounded-full">
                          {match.branch || match.matched_user_branch}
                        </span>
                      )}
                    </div>
                    {(match.compatibilityScore !== undefined || match.compatibility_score !== undefined) && (
                      <div className="text-right">
                        <div className="text-3xl font-bold text-cyan-400">
                          {Math.round(match.compatibilityScore || match.compatibility_score || 0)}%
                        </div>
                        <p className="text-xs text-gray-600">Match</p>
                      </div>
                    )}
                  </div>

                  {/* Match Percentage & Category */}
                  {match.matchPercentage !== undefined && (
                    <div className="mb-4 pb-4 border-b border-gray-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-gray-600 text-sm">Match Percentage</p>
                          <p className="font-bold text-lg text-cyan-400">{match.matchPercentage}%</p>
                        </div>
                        <span className={`px-3 py-1 text-sm font-semibold rounded-full ${
                          match.matchCategory === 'Strong Match' ? 'bg-green-100 text-green-800' :
                          match.matchCategory === 'Moderate Match' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {match.matchCategory}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Matched Skills */}
                  {match.matchedSkills && match.matchedSkills.length > 0 && (
                    <div className="mb-4 pb-4 border-b border-gray-200">
                      <p className="text-sm font-semibold text-gray-700 mb-2">
                        Matched Skills ({match.matchedSkills.length}/{match.totalRequiredSkills})
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {match.matchedSkills.map((skill, i) => (
                          <span key={i} className="px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Common Interests */}
                  {match.commonInterests && (Array.isArray(match.commonInterests) ? match.commonInterests.length > 0 : match.commonInterests.length > 0) && (
                          <div className="mb-4 pb-4 border-b border-gray-200">
                      <p className="text-sm font-semibold text-gray-700 mb-2">Common Interests:</p>
                      <div className="flex flex-wrap gap-2">
                        {Array.isArray(match.commonInterests) ? (
                          match.commonInterests.map((interest, i) => (
                            interest && (
                              <span
                                key={i}
                                className="px-3 py-1 bg-cyan-200 text-cyan-800 text-xs font-semibold rounded-full"
                              >
                                {typeof interest === "string" ? interest : JSON.stringify(interest)}
                              </span>
                            )
                          ))
                        ) : (
                          match.commonInterests.split(",").map((interest, i) => (
                            interest.trim() && (
                              <span
                                key={i}
                                className="px-3 py-1 bg-cyan-200 text-cyan-800 text-xs font-semibold rounded-full"
                              >
                                {interest.trim()}
                              </span>
                            )
                          ))
                        )}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                    <div className="flex gap-2">
                    <button className="flex-1 px-4 py-2 bg-gradient-to-r from-slate-800 to-violet-600 hover:from-slate-900 hover:to-cyan-400 text-white rounded-lg font-semibold transition transform hover:scale-105">
                      Connect
                    </button>
                    <button className="flex-1 px-4 py-2 border-2 border-cyan-400 text-cyan-400 hover:bg-cyan-50 rounded-lg font-semibold transition">
                      Save
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Navigation Links */}
        <div className="mt-6 flex gap-4 justify-center">
          <Link href="/skills" className="text-white hover:underline font-semibold">
            ← Back to Skills
          </Link>
          <span className="text-white">•</span>
          <Link href="/interests" className="text-white hover:underline font-semibold">
            View Interests →
          </Link>
        </div>
      </div>
    </div>
  );
}
