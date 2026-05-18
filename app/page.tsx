export const metadata = {
  title: "Prowider — Lead Distribution",
};

export default function Home() {
  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-10">
      <div className="border border-zinc-200 bg-white">
        <div className="border-b border-zinc-200 px-6 py-4">
          <p className="text-xs uppercase tracking-wide text-zinc-500">
            Lead Distribution System
          </p>
          <h1 className="mt-2 text-2xl font-semibold text-zinc-900">
            Prowider Mini
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-zinc-600">
            Deterministic assignment engine with persistent fairness state and
            strict quota enforcement.
          </p>
        </div>
        <div className="grid gap-6 px-6 py-5 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <h2 className="text-sm font-semibold text-zinc-900">System flow</h2>
            <p className="mt-2 text-sm text-zinc-600">
              Incoming leads are validated, routed through mandatory rules, and
              completed via round-robin pool allocation.
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {[
                {
                  label: "Input",
                  title: "Lead Request",
                  detail: "Name, phone, city, service, description",
                },
                {
                  label: "Rules",
                  title: "Mandatory + Fair Pools",
                  detail: "Service-specific deterministic routing",
                },
                {
                  label: "Guarantees",
                  title: "Quota Enforcement",
                  detail: "Protects providers from over-allocation",
                },
                {
                  label: "Output",
                  title: "Assignments",
                  detail: "Persisted with audit-friendly timestamps",
                },
              ].map((item) => (
                <div key={item.label} className="border border-zinc-200 px-3 py-2">
                  <p className="text-xs uppercase text-zinc-500">{item.label}</p>
                  <p className="mt-1 text-sm font-medium text-zinc-900">
                    {item.title}
                  </p>
                  <p className="text-xs text-zinc-500">{item.detail}</p>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h2 className="text-sm font-semibold text-zinc-900">Navigation</h2>
            <div className="mt-3 border border-zinc-200">
              <div className="grid grid-cols-[1fr_auto] gap-3 border-b border-zinc-200 px-3 py-2 text-xs uppercase text-zinc-500">
                <span>Section</span>
                <span>Status</span>
              </div>
              {[
                {
                  href: "/request-service",
                  name: "Request Service",
                  detail: "Create and allocate leads",
                },
                {
                  href: "/dashboard",
                  name: "Provider Dashboard",
                  detail: "Live quotas and assignments",
                },
                {
                  href: "/test-tools",
                  name: "Test Tools",
                  detail: "Webhook + concurrency tests",
                },
              ].map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="grid grid-cols-[1fr_auto] items-center gap-3 border-b border-zinc-200 px-3 py-3 text-sm last:border-b-0 hover:bg-zinc-50"
                >
                  <div>
                    <p className="font-medium text-zinc-900">{item.name}</p>
                    <p className="text-xs text-zinc-500">{item.detail}</p>
                  </div>
                  <span className="text-xs text-indigo-600">Open</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
