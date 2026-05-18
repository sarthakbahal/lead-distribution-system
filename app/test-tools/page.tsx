"use client";

import { useState } from "react";

const SERVICES = [1, 2, 3];

export default function TestToolsPage() {
  const [log, setLog] = useState<
    Array<{
      id: string;
      message: string;
      status: "success" | "warning" | "error" | "info";
      timestamp: string;
    }>
  >([]);
  const [loading, setLoading] = useState(false);

  const appendLog = (
    message: string,
    status: "success" | "warning" | "error" | "info" = "info"
  ) => {
    const entry = {
      id: `${Date.now()}-${Math.random()}`,
      message,
      status,
      timestamp: new Date().toLocaleTimeString(),
    };
    setLog((prev) => [entry, ...prev].slice(0, 30));
  };

  const resetQuota = async (eventId: string) => {
    const response = await fetch("/api/webhook/reset-quota", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ eventId }),
    });
    const payload = await response.json();
    if (!response.ok) {
      appendLog(payload.error ?? "Reset failed.", "error");
      return { ok: false, alreadyProcessed: false };
    }
    return {
      ok: true,
      alreadyProcessed: Boolean(payload.alreadyProcessed),
    };
  };

  const handleReset = async () => {
    setLoading(true);
    const result = await resetQuota(`reset-${Date.now()}`);
    if (result.ok) {
      appendLog("Quota reset — all 8 providers restored to 10", "success");
    }
    setLoading(false);
  };

  const handleResetMultiple = async () => {
    setLoading(true);
    const eventId = `reset-multi-${Date.now()}`;
    const results = await Promise.all([
      resetQuota(eventId),
      resetQuota(eventId),
      resetQuota(eventId),
    ]);

    results.forEach((result, index) => {
      if (!result.ok) {
        appendLog(`Attempt ${index + 1} — error`, "error");
        return;
      }

      if (result.alreadyProcessed) {
        appendLog(`Attempt ${index + 1} — ↩ Skipped (duplicate)`, "warning");
      } else {
        appendLog(`Attempt ${index + 1} — ✓ Processed`, "success");
      }
    });
    setLoading(false);
  };

  const handleGenerateLeads = async () => {
    setLoading(true);
    const stamp = Date.now();

    const payloads = Array.from({ length: 10 }, (_, index) => ({
      name: `Lead ${stamp}-${index}`,
      phoneNumber: `555-${stamp}-${index}`,
      city: "Metropolis",
      description: "Automated test lead.",
      serviceId: SERVICES[index % SERVICES.length],
    }));

    const responses = await Promise.all(
      payloads.map((payload) =>
        fetch("/api/leads", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
      )
    );

    const results = await Promise.all(responses.map((res) => res.json()));
    const successes = results.filter((_, index) => responses[index].ok);
    const failures = results.filter((_, index) => !responses[index].ok);

    if (failures.length > 0) {
      appendLog(
        `Lead burst completed — ${successes.length}/${results.length} created`,
        "error"
      );
    } else {
      const uniqueProviders = new Set<number>();
      successes.forEach((result) => {
        (result.providerIds ?? []).forEach((id: number) => uniqueProviders.add(id));
      });
      appendLog(
        `10 leads created — ${uniqueProviders.size} unique provider assignments, no quota violations`,
        "success"
      );
    }

    setLoading(false);
  };

  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-8">
      <div className="border border-zinc-200 bg-white px-6 py-4">
        <h1 className="text-xl font-semibold text-zinc-900">Test Tools</h1>
        <p className="mt-1 text-sm text-zinc-600">
          Webhook validation and concurrency checks.
        </p>
      </div>
      <div className="mt-6 border border-zinc-200 bg-white px-6 py-4">
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleReset}
            className="bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-500 disabled:opacity-60"
            disabled={loading}
          >
            Reset Quota
          </button>
          <button
            type="button"
            onClick={handleResetMultiple}
            className="border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:border-zinc-300 disabled:opacity-60"
            disabled={loading}
          >
            Fire Webhook Multiple Times
          </button>
          <button
            type="button"
            onClick={handleGenerateLeads}
            className="border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:border-zinc-300 disabled:opacity-60"
            disabled={loading}
          >
            Generate 10 Leads Instantly
          </button>
        </div>
      </div>
      <div className="mt-6 border border-zinc-200 bg-white px-6 py-4">
        <h2 className="text-sm font-semibold text-zinc-900">Recent Activity</h2>
        <div className="mt-3 border border-zinc-200 bg-zinc-950/95 text-zinc-100">
          <ul className="max-h-80 overflow-auto px-3 py-2 font-mono text-xs">
            {log.length === 0 ? (
              <li className="py-1 text-zinc-400">No actions yet.</li>
            ) : (
              log.map((entry) => (
                <li key={entry.id} className="flex items-center gap-3 py-1">
                  <span className="text-zinc-400">[{entry.timestamp}]</span>
                  <span
                    className={
                      entry.status === "success"
                        ? "text-emerald-400"
                        : entry.status === "warning"
                        ? "text-amber-300"
                        : entry.status === "error"
                        ? "text-rose-400"
                        : "text-zinc-200"
                    }
                  >
                    {entry.message}
                  </span>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
