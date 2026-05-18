"use client";

import { useEffect, useState } from "react";

type DashboardProvider = {
  id: number;
  name: string;
  remainingQuota: number;
  assignedLeadCount: number;
  assignments: Array<{
    id: number;
    leadId: number;
    createdAt: string;
    lead: {
      id: number;
      name: string;
      phoneNumber: string;
      city: string;
      description?: string | null;
      service: {
        id: number;
        name: string;
      };
    };
  }>;
};

export default function DashboardPage() {
  const [providers, setProviders] = useState<DashboardProvider[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    const response = await fetch("/api/dashboard", { cache: "no-store" });
    const payload = await response.json();
    setProviders(payload.providers ?? []);
    setLoading(false);
  };

  useEffect(() => {
    fetchDashboard();
    const interval = setInterval(fetchDashboard, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-10">
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-semibold text-zinc-900">Provider Dashboard</h1>
          <p className="mt-1 text-sm text-zinc-500">
            Auto-refreshing every 5 seconds.
          </p>
        </div>
        {loading ? (
          <p className="text-sm text-zinc-600">Loading...</p>
        ) : (
          <div className="grid gap-6 lg:grid-cols-2">
            {providers.map((provider) => (
              <div
                key={provider.id}
                className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-zinc-900">
                      {provider.name}
                    </h2>
                    <p className="text-sm text-zinc-500">
                      Remaining quota: {provider.remainingQuota}
                    </p>
                  </div>
                  <span className="rounded-full bg-zinc-100 px-3 py-1 text-sm text-zinc-600">
                    Leads: {provider.assignedLeadCount}
                  </span>
                </div>
                <div className="mt-4 flex flex-col gap-2">
                  {provider.assignments.length === 0 ? (
                    <p className="text-sm text-zinc-500">No leads yet.</p>
                  ) : (
                    provider.assignments.map((assignment) => (
                      <div
                        key={assignment.id}
                        className="rounded-xl border border-dashed border-zinc-200 px-3 py-2 text-sm"
                      >
                        <div className="flex flex-wrap gap-2 text-zinc-700">
                          <span className="font-medium text-zinc-900">
                            {assignment.lead.name}
                          </span>
                          <span>{assignment.lead.phoneNumber}</span>
                          <span>{assignment.lead.city}</span>
                          <span className="rounded bg-zinc-100 px-2 py-0.5 text-xs">
                            {assignment.lead.service.name}
                          </span>
                        </div>
                        {assignment.lead.description && (
                          <p className="mt-1 text-zinc-500">
                            {assignment.lead.description}
                          </p>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
