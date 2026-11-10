"use client";

import { useEffect, useState } from "react";

declare global {
  interface Window {
    Telegram?: { WebApp?: {
      initData: string;
      ready: () => void;
      expand: () => void;
      colorScheme?: string;
    }};
  }
}

type Props = { authenticated: boolean; telegramHint: boolean };

export default function Dashboard({ authenticated, telegramHint }: Props) {
  const [status, setStatus] = useState(authenticated ? "Session active" : "Connect Telegram to begin");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const webApp = window.Telegram?.WebApp;
    if (!webApp) return;
    webApp.ready();
    webApp.expand();
    if (!webApp.initData) return;
    setBusy(true);
    fetch("/api/auth/telegram", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ initData: webApp.initData })
    }).then(async (r) => {
      const data = await r.json();
      if (!r.ok) throw new Error(data.error || "Telegram sign-in failed");
      setStatus(`Welcome${data.user?.firstName ? `, ${data.user.firstName}` : ""}`);
      window.location.reload();
    }).catch((e: Error) => setStatus(e.message))
      .finally(() => setBusy(false));
  }, []);

  return (
    <main className="mx-auto min-h-screen max-w-5xl px-4 py-5 sm:px-8">
      <header className="flex items-center justify-between border-b border-white/10 pb-5">
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-cyan-400 to-violet-600 text-xl font-black text-slate-950">C</div>
          <div><p className="text-lg font-bold tracking-tight">CodeMind AI</p><p className="text-xs text-slate-400">AI software development workspace</p></div>
        </div>
        <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs text-emerald-300">Phase 1 Preview</span>
      </header>

      <section className="py-12 sm:py-16">
        <p className="mb-4 text-sm font-semibold uppercase tracking-[.22em] text-cyan-300">Build smarter. Ship safer.</p>
        <h1 className="max-w-3xl text-4xl font-black leading-tight sm:text-6xl">Your AI developer workspace.</h1>
        <p className="mt-5 max-w-2xl text-base leading-7 text-slate-400">Connect Telegram, prepare your GitHub workspace, and review AI-generated changes before anything is committed.</p>
        <div className="mt-7 flex flex-wrap gap-3">
          <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm">✓ Repository analysis</div>
          <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm">✓ Code diff approvals</div>
          <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm">✓ User-owned API keys</div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {[
          ["01", "Connect GitHub", "Link your own GitHub account and choose repositories."],
          ["02", "Ask the agent", "Describe a bug, feature, or code question in plain language."],
          ["03", "Review changes", "Inspect every proposed diff and approve commits yourself."]
        ].map(([n, title, desc]) => <article key={n} className="rounded-2xl border border-white/10 bg-white/[.04] p-5">
          <p className="text-sm font-bold text-cyan-300">{n}</p><h2 className="mt-4 text-lg font-bold">{title}</h2><p className="mt-2 text-sm leading-6 text-slate-400">{desc}</p>
        </article>)}
      </section>

      <section className="mt-6 rounded-2xl border border-violet-400/20 bg-violet-400/[.07] p-5">
        <h2 className="text-lg font-bold">Account connection</h2>
        <p className="mt-2 text-sm text-slate-300">{busy ? "Verifying Telegram account…" : status}</p>
        {!authenticated && <p className="mt-3 text-xs leading-5 text-slate-500">{telegramHint ? "Telegram Web App detected. If sign-in does not complete, check the bot token and server logs." : "Open this page from your Telegram Mini App button to authenticate. Browser preview is available without login."}</p>}
      </section>

      <footer className="mt-12 border-t border-white/10 py-6 text-xs text-slate-500">CodeMind AI · Secure-by-default · All code changes require your approval.</footer>
    </main>
  );
}
