import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

// Mock data to simulate fetching a shared journal
const getMockJournal = (token: string) => {
  if (token === 'error') return null;
  return {
    dayNumber: 42,
    title: "Breakthrough at work",
    content: "Finally cracked the problem I've been stuck on for a week. The solution was embarrassingly simple once I saw it. Celebrated with tacos. Life is good.",
    date: "March 4, 2026",
    mood: "😊",
    username: "adventurer",
  };
};

export default function SharedJournalPage({ params }: { params: { token: string } }) {
  const journal = getMockJournal(params.token);
  
  if (!journal) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-background text-text-primary flex flex-col items-center py-12 px-6">
      
      {/* Top minimal brand */}
      <Link href="/" className="text-gold font-bold mb-16 hover:opacity-80 transition-opacity">
        Life Levels
      </Link>
      
      {/* Centered Journal Content */}
      <article className="max-w-3xl w-full relative">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-gold-glow blur-[150px] -z-10 opacity-20 pointer-events-none" />
        
        <div className="glass-card p-10 md:p-16 rounded-[2rem] shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gold to-transparent opacity-50" />
          
          {/* Context metadata */}
          <div className="flex items-center gap-4 mb-10">
            <div className="bg-gold-glow px-4 py-1.5 rounded-full border border-[rgba(245,166,35,0.4)] shadow-[0_0_10px_rgba(245,166,35,0.2)]">
              <span className="font-bold text-gold-light text-sm tracking-wide">Day {journal.dayNumber}</span>
            </div>
            <span className="text-text-secondary text-sm font-medium tracking-wide">{journal.date}</span>
            <span className="text-text-secondary text-sm font-medium ml-auto bg-surface-light px-3 py-1 rounded-full border border-border">@{journal.username}</span>
          </div>

          {/* Content */}
          <h1 className="text-5xl font-black mb-10 text-text-primary leading-tight tracking-tight">
            {journal.title}
          </h1>
          
          <div className="text-xl text-text-primary leading-[1.8] whitespace-pre-wrap mb-12 font-medium opacity-90">
            {journal.content}
          </div>
          
          {/* Mood Stamp */}
          <div className="inline-flex items-center gap-4 bg-surface-light border border-border rounded-full px-6 py-3 hover:border-gold transition-colors duration-300">
            <span className="text-text-secondary text-sm font-bold uppercase tracking-widest">Mood</span>
            <span className="text-3xl leading-none filter drop-shadow-md">{journal.mood}</span>
          </div>
        </div>
      </article>

      {/* Footer Marketing Hook */}
      <div className="mt-32 max-w-2xl w-full border-t border-[#1e1e2e] pt-12 text-center">
        <h3 className="text-2xl font-bold mb-4">Start your own level map</h3>
        <p className="text-text-secondary mb-8">Make your life feel like a game you're progressing through.</p>
        
        <Link 
          href="/"
          className="inline-flex items-center gap-2 bg-gold text-[#0f0f14] font-bold px-8 py-4 rounded-full mx-auto hover:bg-gold-light hover:scale-105 transition-all w-max"
        >
          Create your Life Levels <ArrowRight size={18} />
        </Link>
      </div>

    </main>
  );
}
