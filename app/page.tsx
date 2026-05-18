export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-12">
        <div className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm">
          <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-wide text-zinc-500">
            <span className="rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1">
              Backend-heavy
            </span>
            <span className="rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1">
              Concurrency-safe
            </span>
            <span className="rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1">
              Deterministic routing
            </span>
          </div>
          <h1 className="mt-4 text-3xl font-semibold text-zinc-900">
            Prowider Mini Lead Distribution System
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-zinc-600">
            A pragmatic backend evaluation sandbox where each lead is atomically
            assigned using mandatory rules, fair round-robin allocation, and
            strict quota enforcement.
          </p>
        </div>
        <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-zinc-900">System flow</h2>
            <p className="mt-2 text-sm text-zinc-600">
              Each request passes through validation, deterministic provider
              selection, quota checks, and atomic assignment. The round-robin
              pointer persists across restarts to keep allocations fair.
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-3 text-sm">
                <p className="text-xs uppercase text-zinc-500">Input</p>
                <p className="mt-1 font-medium text-zinc-900">
                  Lead Request
                </p>
                <p className="text-xs text-zinc-500">
                  Name, phone, city, service, description
                </p>
              </div>
              <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-3 text-sm">
                <p className="text-xs uppercase text-zinc-500">Rules</p>
                <p className="mt-1 font-medium text-zinc-900">
                  Mandatory + Fair Pools
                </p>
                <p className="text-xs text-zinc-500">
                  Service-specific routing with deterministic assignment
                </p>
              </div>
              <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-3 text-sm">
                <p className="text-xs uppercase text-zinc-500">Guarantees</p>
                <p className="mt-1 font-medium text-zinc-900">
                  Quota Enforcement
                </p>
                <p className="text-xs text-zinc-500">
                  Protects providers from over-allocation
                </p>
              </div>
              <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-3 text-sm">
                <p className="text-xs uppercase text-zinc-500">Output</p>
                <p className="mt-1 font-medium text-zinc-900">
                  Assignments
                </p>
                <p className="text-xs text-zinc-500">
                  Persisted with audit-friendly timestamps
                </p>
              </div>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
            <a
              className="group rounded-2xl border border-zinc-200 bg-white px-5 py-5 text-sm font-medium text-zinc-800 shadow-sm transition hover:-translate-y-0.5 hover:border-zinc-300 hover:shadow"
              href="/request-service"
            >
              <div className="flex items-center justify-between">
                <span>Request Service</span>
                <span className="text-xs text-zinc-400 group-hover:text-zinc-500">
                  Open →
                </span>
              </div>
              <p className="mt-2 text-xs text-zinc-500">
                Submit a lead and see the assigned providers instantly.
              </p>
            </a>
            <a
              className="group rounded-2xl border border-zinc-200 bg-white px-5 py-5 text-sm font-medium text-zinc-800 shadow-sm transition hover:-translate-y-0.5 hover:border-zinc-300 hover:shadow"
              href="/dashboard"
            >
              <div className="flex items-center justify-between">
                <span>Provider Dashboard</span>
                <span className="text-xs text-zinc-400 group-hover:text-zinc-500">
                  Open →
                </span>
              </div>
              <p className="mt-2 text-xs text-zinc-500">
                Track quotas and the latest assignments per provider.
              </p>
            </a>
            <a
              className="group rounded-2xl border border-zinc-200 bg-white px-5 py-5 text-sm font-medium text-zinc-800 shadow-sm transition hover:-translate-y-0.5 hover:border-zinc-300 hover:shadow"
              href="/test-tools"
            >
              <div className="flex items-center justify-between">
                <span>Test Tools</span>
                <span className="text-xs text-zinc-400 group-hover:text-zinc-500">
                  Open →
                </span>
              </div>
              <p className="mt-2 text-xs text-zinc-500">
                Run webhook resets and high-concurrency lead bursts.
              </p>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
