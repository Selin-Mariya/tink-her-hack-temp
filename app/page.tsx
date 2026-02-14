import Nav from "./components/Nav";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-violet-900 to-blue-900 dark:from-slate-950 dark:via-violet-950 dark:to-blue-950">
      <Nav />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 py-16 md:py-24">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-block mb-4 px-4 py-2 bg-violet-900 dark:bg-violet-950 rounded-full">
            <span className="text-sm font-semibold text-cyan-400 dark:text-cyan-300">🎓 Student Networking</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-violet-500 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
            Campus Skill Match
          </h1>
          <p className="text-xl text-gray-100 dark:text-gray-200 mb-8 max-w-2xl mx-auto">
            Connect with students who share your interests and complementary skills. Build amazing teams faster.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/register" className="px-8 py-3 bg-gradient-to-r from-violet-600 to-cyan-500 text-white rounded-lg font-semibold hover:shadow-lg transform hover:-translate-y-1 transition-all">
              Get Started
            </Link>
            <Link href="/login" className="px-8 py-3 border-2 border-cyan-400 text-cyan-400 dark:text-cyan-300 rounded-lg font-semibold hover:bg-cyan-400 hover:text-slate-950 dark:hover:bg-cyan-400 dark:hover:text-slate-950 transition-all">
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 py-16 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-4 text-white">Why Use Campus Skill Match?</h2>
        <p className="text-center text-gray-300 dark:text-gray-400 mb-12">Everything you need to find your perfect team</p>
        
        <div className="grid md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="p-6 bg-slate-800 dark:bg-slate-800 rounded-xl shadow-sm hover:shadow-lg transition-all border-l-4 border-violet-500">
            <div className="w-12 h-12 bg-violet-900 dark:bg-violet-900 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">🔍</span>
            </div>
            <h3 className="text-lg font-bold mb-2 text-white">Smart Matching</h3>
            <p className="text-gray-300 dark:text-gray-300">Find students with compatible skills and interests using our intelligent matching algorithm.</p>
          </div>

          {/* Card 2 */}
          <div className="p-6 bg-slate-800 dark:bg-slate-800 rounded-xl shadow-sm hover:shadow-lg transition-all border-l-4 border-purple-600">
            <div className="w-12 h-12 bg-purple-900 dark:bg-purple-900 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">⚡</span>
            </div>
            <h3 className="text-lg font-bold mb-2 text-white">Instant Connection</h3>
            <p className="text-gray-300 dark:text-gray-300">See compatibility scores and connect with peers immediately. No waiting for approvals.</p>
          </div>

          {/* Card 3 */}
          <div className="p-6 bg-slate-800 dark:bg-slate-800 rounded-xl shadow-sm hover:shadow-lg transition-all border-l-4 border-cyan-500">
            <div className="w-12 h-12 bg-cyan-900 dark:bg-cyan-900 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">🤝</span>
            </div>
            <h3 className="text-lg font-bold mb-2 text-white">Team Building</h3>
            <p className="text-gray-300 dark:text-gray-300">Form high-performing teams with complementary skills and similar availability.</p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="px-4 py-12 bg-gradient-to-r from-slate-950 via-violet-700 to-cyan-500 text-white">
        <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold mb-2">500+</div>
            <p className="text-cyan-300">Active Students</p>
          </div>
          <div>
            <div className="text-4xl font-bold mb-2">100+</div>
            <p className="text-cyan-300">Teams Formed</p>
          </div>
          <div>
            <div className="text-4xl font-bold mb-2">50+</div>
            <p className="text-cyan-300">Skills Tracked</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-16 max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-4 text-white">Ready to Find Your Team?</h2>
        <p className="text-gray-300 dark:text-gray-400 mb-8">Join hundreds of students already using Campus Skill Match</p>
        <Link href="/register" className="inline-block px-8 py-3 bg-gradient-to-r from-violet-600 to-cyan-500 text-white rounded-lg font-semibold hover:shadow-lg transform hover:-translate-y-1 transition-all">
          Create Account Now
        </Link>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 text-center py-8">
        <p>&copy; 2026 Campus Skill Match. All rights reserved.</p>
      </footer>
    </div>
  );
}
