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
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-6 py-10">
      <div>
        <h1 className="text-2xl font-semibold">Provider Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Auto-refreshing every 5 seconds.
        </p>
      </div>
      {loading ? (
        <p className="text-sm">Loading...</p>
      ) : (
        <div className="flex flex-col gap-6">
          {providers.map((provider) => (
            <div key={provider.id} className="rounded border p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-medium">{provider.name}</h2>
                  <p className="text-sm text-zinc-500">
                    Remaining quota: {provider.remainingQuota}
                  </p>
                </div>
                <span className="text-sm text-zinc-500">
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
                      className="rounded border border-dashed px-3 py-2 text-sm"
                    >
                      <div className="flex flex-wrap gap-2">
                        <span className="font-medium">{assignment.lead.name}</span>
                        <span className="text-zinc-500">
                          {assignment.lead.phoneNumber}
                        </span>
                        <span className="text-zinc-500">
                          {assignment.lead.city}
                        </span>
                        <span className="text-zinc-500">
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
  );
}
