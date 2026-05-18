"use client";

import { Fragment, useEffect, useState } from "react";

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
  const [connected, setConnected] = useState(false);
  const [pulse, setPulse] = useState(false);
  const [expandedProviderId, setExpandedProviderId] = useState<number | null>(null);

  useEffect(() => {
    const source = new EventSource("/api/dashboard/stream");

    const handlePulse = () => {
      setPulse(true);
      setTimeout(() => setPulse(false), 800);
    };

    source.onopen = () => {
      setConnected(true);
    };

    source.onmessage = (event) => {
      const data = JSON.parse(event.data) as DashboardProvider[];
      setProviders(data);
      setLoading(false);
      setConnected(true);
      handlePulse();
    };

    source.onerror = () => {
      setConnected(false);
    };

    return () => {
      source.close();
    };
  }, []);

  const totalQuota = 10;

  const toggleExpanded = (providerId: number) => {
    setExpandedProviderId((current) => (current === providerId ? null : providerId));
  };

  const formatTime = (value: string) => {
    const date = new Date(value);
    return date.toLocaleTimeString();
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-8">
      <div className="border border-zinc-200 bg-white px-6 py-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold text-zinc-900">Provider Dashboard</h1>
            <p className="mt-1 text-sm text-zinc-600">
              Live assignments and quota usage.
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span
              className={`h-2.5 w-2.5 rounded-full ${
                connected ? "bg-emerald-500" : "bg-zinc-400"
              } ${pulse ? "animate-pulse" : ""}`}
            />
            <span className="text-zinc-600">Live updates</span>
          </div>
        </div>
      </div>
      <div className="mt-6 border border-zinc-200 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-zinc-200 text-xs uppercase text-zinc-500">
              <tr>
                <th className="px-4 py-3">Provider</th>
                <th className="px-4 py-3">Quota Used</th>
                <th className="px-4 py-3">Quota Remaining</th>
                <th className="px-4 py-3">Leads This Month</th>
                <th className="px-4 py-3">Recent Lead</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-sm text-zinc-500">
                    Loading...
                  </td>
                </tr>
              ) : (
                providers.map((provider) => {
                  const used = totalQuota - provider.remainingQuota;
                  const recent = provider.assignments[0];
                  const isExpanded = expandedProviderId === provider.id;

                  return (
                    <Fragment key={provider.id}>
                      <tr
                        className="cursor-pointer border-b border-zinc-100 hover:bg-zinc-50"
                        onClick={() => toggleExpanded(provider.id)}
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <span className="text-sm font-medium text-zinc-900">
                              {provider.name}
                            </span>
                            <span className="text-xs text-zinc-400 font-mono">
                              P{provider.id}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3 font-mono text-zinc-700">
                          {used}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <span className="font-mono text-zinc-700">
                              {provider.remainingQuota}
                            </span>
                            <div className="h-1.5 w-24 bg-zinc-200">
                              <div
                                className="h-1.5 bg-indigo-500"
                                style={{
                                  width: `${(provider.remainingQuota / totalQuota) * 100}%`,
                                }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 font-mono text-zinc-700">
                          {provider.assignedLeadCount}
                        </td>
                        <td className="px-4 py-3 text-zinc-600">
                          {recent ? (
                            <div className="space-y-1">
                              <div className="font-mono text-xs text-zinc-600">
                                Lead #{recent.leadId}
                              </div>
                              <div className="text-xs text-zinc-500">
                                {recent.lead.service.name} · {formatTime(recent.createdAt)}
                              </div>
                            </div>
                          ) : (
                            <span className="text-xs text-zinc-400">No leads</span>
                          )}
                        </td>
                      </tr>
                      {isExpanded && (
                        <tr className="border-b border-zinc-200 bg-zinc-50">
                          <td colSpan={5} className="px-4 py-4">
                            <div className="text-xs uppercase text-zinc-500">
                              Assigned leads
                            </div>
                            {provider.assignments.length === 0 ? (
                              <p className="mt-2 text-sm text-zinc-500">
                                No assignments yet.
                              </p>
                            ) : (
                              <table className="mt-3 w-full text-sm">
                                <thead className="text-xs uppercase text-zinc-500">
                                  <tr>
                                    <th className="py-2 text-left">Lead ID</th>
                                    <th className="py-2 text-left">Service</th>
                                    <th className="py-2 text-left">Timestamp</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {provider.assignments.map((assignment) => (
                                    <tr key={assignment.id} className="border-t border-zinc-200">
                                      <td className="py-2 font-mono">
                                        {assignment.leadId}
                                      </td>
                                      <td className="py-2 text-zinc-700">
                                        {assignment.lead.service.name}
                                      </td>
                                      <td className="py-2 font-mono text-zinc-600">
                                        {new Date(assignment.createdAt).toLocaleString()}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            )}
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
