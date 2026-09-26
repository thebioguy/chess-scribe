import { Sparkles, Upload, Database, BrainCircuit, FileText, ShieldCheck, BarChart3 } from 'lucide-react';

const featureCards = [
  {
    icon: BrainCircuit,
    title: 'Learns your handwriting',
    text: 'Personal correction profiles adapt to your notation quirks, shorthand, and common OCR mistakes.'
  },
  {
    icon: Upload,
    title: 'Photo or scan input',
    text: 'Accept a scoresheet image and repair the reconstructed game visually, move by move.'
  },
  {
    icon: FileText,
    title: 'PGN / FEN export',
    text: 'Turn reconstructed games into exportable PGN, current FEN position, and easy shareable archives.'
  },
  {
    icon: BarChart3,
    title: 'Engine evaluation',
    text: 'Analyze your position with a built-in engine to review mistakes and build your own library.'
  }
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <header className="mb-12 flex items-center justify-between gap-4 rounded-full border border-slate-800 bg-slate-900/70 px-5 py-3 backdrop-blur">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-600/20 text-brand-300 ring-1 ring-brand-500/40">
              <Sparkles size={18} />
            </div>
            <div>
              <div className="text-lg font-semibold">Chess Scribe</div>
              <div className="text-xs text-slate-400">Score sheet recognition that learns you</div>
            </div>
          </div>
          <button className="rounded-full border border-brand-500/50 bg-brand-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-500">
            Launch prototype
          </button>
        </header>

        <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-emerald-300">
              Personal recognition engine
            </div>
            <h1 className="max-w-xl text-4xl font-black tracking-tight text-white sm:text-5xl">
              Turn paper scoresheets into digital games with a chess brain that learns your handwriting.
            </h1>
            <p className="mt-5 max-w-xl text-lg text-slate-300">
              Chess Scribe scans individual games from photographs or scans, validates moves against the board, and improves over time based on your corrections, notation quirks, and common score-sheet habits.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button className="rounded-full bg-brand-600 px-5 py-3 font-medium text-white transition hover:bg-brand-500">
                Start a demo upload
              </button>
              <button className="rounded-full border border-slate-700 bg-slate-900 px-5 py-3 font-medium text-slate-200 transition hover:border-slate-500 hover:bg-slate-800">
                View features
              </button>
            </div>
            <div className="mt-10 flex flex-wrap gap-4 text-sm text-slate-300">
              <div className="flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/80 px-3 py-2">
                <ShieldCheck size={16} className="text-emerald-400" /> Free tier: 5 scans
              </div>
              <div className="flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/80 px-3 py-2">
                <Database size={16} className="text-cyan-400" /> Personal archive + PGN export
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900 to-brand-950/60 p-5 shadow-panel">
            <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
              <div className="mb-4 flex items-center justify-between text-xs uppercase tracking-[0.2em] text-slate-400">
                <span>Recognition profile</span>
                <span>Learning</span>
              </div>
              <div className="space-y-4">
                {[
                  ['R interpreted as N', '95%'],
                  ['B x N shorthand', '91%'],
                  ['0-0 read as O-O', '88%'],
                  ['Small “b” mistaken as 6', '83%']
                ].map(([label, score]) => (
                  <div key={label}>
                    <div className="mb-1 flex items-center justify-between text-sm text-slate-300">
                      <span>{label}</span>
                      <span>{score}</span>
                    </div>
                    <div className="h-2.5 rounded-full bg-slate-800">
                      <div className="h-2.5 rounded-full bg-gradient-to-r from-brand-500 to-emerald-400" style={{ width: score }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mt-24 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {featureCards.map(({ icon: Icon, title, text }) => (
            <article key={title} className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-500/10 text-brand-300 ring-1 ring-brand-500/30">
                <Icon size={22} />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-white">{title}</h3>
              <p className="text-sm leading-6 text-slate-300">{text}</p>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
