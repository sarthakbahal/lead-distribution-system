export default function Home() {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-6 py-12">
      <div>
        <h1 className="text-3xl font-semibold">Prowider Mini Lead Distribution</h1>
        <p className="text-sm text-muted-foreground">
          Backend-heavy demo focused on concurrency, quotas, and fair allocation.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <a
          className="rounded border px-4 py-3 text-sm font-medium hover:bg-zinc-50"
          href="/request-service"
        >
          Request Service
        </a>
        <a
          className="rounded border px-4 py-3 text-sm font-medium hover:bg-zinc-50"
          href="/dashboard"
        >
          Provider Dashboard
        </a>
        <a
          className="rounded border px-4 py-3 text-sm font-medium hover:bg-zinc-50"
          href="/test-tools"
        >
          Test Tools
        </a>
      </div>
    </div>
  );
}
