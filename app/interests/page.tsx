"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Interest = { id: number; interest_name: string };
type User = { id: number; name: string; email: string; branch: string };

export default function InterestsPage() {
  const [interests, setInterests] = useState<Interest[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newInterest, setNewInterest] = useState("");
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (!token) {
      setError("Not authenticated. Redirecting to login...");
      setTimeout(() => router.push("/login"), 1500);
      return;
    }

    if (userData) setUser(JSON.parse(userData));

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    fetch(`${apiUrl}/api/interests`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.interests && Array.isArray(data.interests)) setInterests(data.interests);
        else if (Array.isArray(data)) setInterests(data);
        else setInterests([]);
      })
      .catch((err) => {
        console.error("Error fetching interests:", err);
        setError("Failed to load interests");
      })
      .finally(() => setLoading(false));
  }, [router]);

  const addInterest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newInterest.trim()) return;
    const token = localStorage.getItem("token");
    if (!token) return setError("Not authenticated");

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const res = await fetch(`${apiUrl}/api/interests`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ interestName: newInterest })
      });

      if (res.ok) {
        const data = await res.json();
        const newI: Interest = { id: data.interest.id, interest_name: data.interest.interestName };
        setInterests([...interests, newI]);
        setNewInterest("");
      } else {
        setError("Failed to add interest");
      }
    } catch (err) {
      console.error(err);
      setError("Error adding interest");
    }
  };

  const deleteInterest = async (id: number) => {
    const token = localStorage.getItem("token");
    if (!token) return setError("Not authenticated");
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const res = await fetch(`${apiUrl}/api/interests/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) setInterests(interests.filter((i) => i.id !== id));
      else setError("Failed to delete interest");
    } catch (err) {
      console.error(err);
      setError("Error deleting interest");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-violet-600 to-cyan-400 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-bold mb-2">My Interests</h1>
              {user && <p className="text-gray-600">Welcome, <span className="font-semibold text-cyan-400">{user.name}</span></p>}
            </div>
            <button onClick={() => { localStorage.removeItem('token'); localStorage.removeItem('user'); router.push('/login'); }} className="px-4 py-2 bg-red-500 text-white rounded-lg">Logout</button>
          </div>
        </div>

        {error && <div className="bg-red-100 border-2 border-red-500 text-red-700 p-4 rounded-lg mb-6">{error}</div>}

        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Add New Interest</h2>
          <form onSubmit={addInterest} className="flex gap-3">
            <input type="text" value={newInterest} onChange={(e) => setNewInterest(e.target.value)} placeholder="Interest (e.g., Machine Learning, UI/UX)" className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-lg" />
            <button type="submit" className="px-6 py-2 bg-gradient-to-r from-slate-800 to-violet-600 text-white rounded-lg">Add Interest</button>
          </form>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Interests {interests.length > 0 && <span className="text-indigo-600">({interests.length})</span>}</h2>
          {loading ? <p className="text-gray-600">Loading interests...</p> : (
            <div className="flex flex-wrap gap-2">
              {interests.length === 0 ? <p className="text-gray-600">No interests added yet.</p> : interests.map(i => (
                <div key={i.id} className="px-3 py-2 bg-cyan-100 text-cyan-800 rounded-full flex items-center gap-2">
                  <span className="text-sm font-semibold">{i.interest_name}</span>
                  <button onClick={() => deleteInterest(i.id)} className="text-xs text-red-600 ml-2">Remove</button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-6 text-center">
          <Link href="/matches" className="text-white hover:underline font-semibold">→ View Matches</Link>
        </div>
      </div>
    </div>
  );
}
