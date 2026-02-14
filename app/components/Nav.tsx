"use client";

import Link from "next/link";

export default function Nav() {
  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="font-semibold">Campus Skill Match</div>
        <div className="flex gap-3">
          <Link href="/" className="text-sm text-gray-700 hover:underline">Home</Link>
          <Link href="/register" className="text-sm text-gray-700 hover:underline">Register</Link>
          <Link href="/login" className="text-sm text-gray-700 hover:underline">Login</Link>
          <Link href="/skills" className="text-sm text-gray-700 hover:underline">Skills</Link>
          <Link href="/interests" className="text-sm text-gray-700 hover:underline">Interests</Link>
          <Link href="/matches" className="text-sm text-gray-700 hover:underline">Matches</Link>
        </div>
      </div>
    </nav>
  );
}
