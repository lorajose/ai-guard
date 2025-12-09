export default function ChangePasswordPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-zinc-950 to-black text-white px-6 py-16">
      <div className="mx-auto max-w-md space-y-6 rounded-3xl border border-white/10 bg-black/60 p-8 backdrop-blur">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-zinc-500">
            IA Shield
          </p>
          <h1 className="mt-3 text-3xl font-semibold">Change password</h1>
          <p className="mt-2 text-sm text-zinc-400">
            Enter your current password and the new one you want to set.
          </p>
        </div>
        <form className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-wide text-zinc-500">
              Current password
            </label>
            <input
              type="password"
              className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-2 text-sm outline-none"
              placeholder="••••••••"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-wide text-zinc-500">
              New password
            </label>
            <input
              type="password"
              className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-2 text-sm outline-none"
              placeholder="••••••••"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-wide text-zinc-500">
              Confirm new password
            </label>
            <input
              type="password"
              className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-2 text-sm outline-none"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            className="mt-2 w-full rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:border-white/40"
          >
            Update password
          </button>
        </form>
      </div>
    </main>
  );
}
