"use client";

import { useState } from "react";

const SERVICES = [1, 2, 3];

export default function TestToolsPage() {
  const [log, setLog] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const appendLog = (message: string) => {
    setLog((prev) => [message, ...prev].slice(0, 20));
  };

  const resetQuota = async (eventId: string) => {
    const response = await fetch("/api/webhook/reset-quota", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ eventId }),
    });
    const payload = await response.json();
    if (!response.ok) {
      appendLog(payload.error ?? "Reset failed.");
      return;
    }
    appendLog(
      payload.alreadyProcessed
        ? `Event ${eventId} already processed.`
        : `Quota reset with event ${eventId}.`
    );
  };

  const handleReset = async () => {
    setLoading(true);
    await resetQuota(`reset-${Date.now()}`);
    setLoading(false);
  };

  const handleResetMultiple = async () => {
    setLoading(true);
    const eventId = `reset-multi-${Date.now()}`;
    await Promise.all([
      resetQuota(eventId),
      resetQuota(eventId),
      resetQuota(eventId),
    ]);
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

    results.forEach((result, index) => {
      if (responses[index].ok) {
        appendLog(
          `Lead ${result.leadId} assigned to ${result.providerIds.join(", ")}.`
        );
      } else {
        appendLog(result.error ?? "Lead creation failed.");
      }
    });

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-6 py-10">
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-semibold text-zinc-900">Test Tools</h1>
          <p className="mt-1 text-sm text-zinc-500">
            Fire webhooks and concurrency tests.
          </p>
        </div>
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleReset}
              className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-zinc-800 disabled:opacity-60"
              disabled={loading}
            >
              Reset Quota
            </button>
            <button
              type="button"
              onClick={handleResetMultiple}
              className="rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:border-zinc-300 disabled:opacity-60"
              disabled={loading}
            >
              Fire Webhook Multiple Times
            </button>
            <button
              type="button"
              onClick={handleGenerateLeads}
              className="rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:border-zinc-300 disabled:opacity-60"
              disabled={loading}
            >
              Generate 10 Leads Instantly
            </button>
          </div>
        </div>
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-zinc-900">Recent Activity</h2>
          <ul className="mt-3 flex flex-col gap-2 text-sm text-zinc-600">
            {log.length === 0 ? (
              <li>No actions yet.</li>
            ) : (
              log.map((entry, index) => <li key={index}>{entry}</li>)
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
