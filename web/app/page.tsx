import { ArrowRight, Map, Flame, Sparkles } from "lucide-react";
import Link from "next/link";

export default function Home() {
  
  return (
    <main className="min-h-screen bg-background text-text-primary selection:bg-gold-glow">
      {/* Navbar */}
      <nav className="flex items-center justify-between p-6 max-w-6xl mx-auto">
        <div className="text-xl font-bold text-gold tracking-tight">Life Levels</div>
        <div className="flex gap-4">
          <button className="text-sm font-medium hover:text-gold transition-colors"><Link href="/login">Log In</Link></button>
          <button className="text-sm font-bold bg-surface px-4 py-2 rounded-full border border-border hover:border-gold transition-all">Get App</button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative px-6 pt-32 pb-40 max-w-5xl mx-auto text-center flex flex-col items-center overflow-hidden">
        {/* Background elaborate glows */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gold-glow blur-[150px] rounded-full -z-10 opacity-40 pointer-events-none animate-pulse" />
        <div className="absolute top-[20%] left-[20%] w-[400px] h-[400px] bg-[#fbbf24] blur-[150px] rounded-full -z-10 opacity-20 hover:opacity-30 transition-opacity pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-4 py-1.5 glass-card rounded-full text-sm font-semibold text-gold mb-10 shadow-[0_0_15px_rgba(245,166,35,0.2)]">
          <Sparkles size={16} className="text-gold animate-bounce" />
          <span>Now available in early access</span>
        </div>

        <h1 className="text-6xl md:text-8xl font-black tracking-tight leading-[1.1] mb-8 drop-shadow-2xl">
          Your life, <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-br from-gold-light via-gold to-[#c4841d]">
            mapped beautifully.
          </span>
        </h1>

        <p className="text-xl md:text-2xl text-text-secondary max-w-3xl mb-14 leading-relaxed">
          A journaling app where every completed day becomes a glowing level on a map. <br />
          Make your life feel like a game you're processing through.
        </p>

        <div className="flex flex-col sm:flex-row gap-6 w-full justify-center">
          <button className="group flex items-center justify-center gap-3 bg-gradient-to-r from-gold to-gold-light text-[#0f0f14] font-black px-10 py-5 rounded-full hover:scale-105 transition-all duration-300 shadow-[0_0_30px_rgba(245,166,35,0.5)]">
            Download for iOS <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
          <button className="flex items-center justify-center gap-3 glass-card text-text-primary font-bold px-10 py-5 rounded-full hover:border-gold hover:bg-surface-light hover:text-gold transition-all duration-300">
            Download for Android
          </button>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 bg-background-light border-y border-[#1e1e2e]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">How it works</h2>
            <p className="text-text-secondary">Three simple steps to build your life map.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-background-card p-8 rounded-2xl border border-[#2a2a3a]">
              <div className="w-12 h-12 bg-surface rounded-full flex items-center justify-center mb-6 border border-border">
                <Map className="text-gold" size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">1. Open the Map</h3>
              <p className="text-text-secondary leading-relaxed">
                See your journey winding upward. Past entries are glowing nodes you can revisit anytime.
              </p>
            </div>

            <div className="bg-background-card p-8 rounded-2xl border border-[#2a2a3a] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gold-glow blur-3xl rounded-full" />
              <div className="w-12 h-12 bg-surface-light rounded-full border border-gold flex items-center justify-center mb-6 relative z-10 shadow-[0_0_15px_rgba(245,166,35,0.4)]">
                <Flame className="text-gold" size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3 relative z-10">2. Write Today's Entry</h3>
              <p className="text-text-secondary leading-relaxed relative z-10">
                Tap the pulsating active node. Write whatever is on your mind. Attach a mood and photo.
              </p>
            </div>

            <div className="bg-background-card p-8 rounded-2xl border border-[#2a2a3a]">
              <div className="w-12 h-12 bg-surface rounded-full flex items-center justify-center mb-6 border border-border">
                <Sparkles className="text-gold" size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">3. Unlock the Level</h3>
              <p className="text-text-secondary leading-relaxed">
                Hit save and watch your map expand. A new level unlocked. A new memory safely stored.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 text-center text-text-muted border-t border-[#1e1e2e] mt-auto">
        <p>© 2026 Life Levels. Build your streak.</p>
      </footer>
    </main>
  );
}
