"use client";

import { useState } from "react";

const SERVICES = [
  { id: 1, name: "Service 1" },
  { id: 2, name: "Service 2" },
  { id: 3, name: "Service 3" },
];

export default function RequestServicePage() {
  const [form, setForm] = useState({
    name: "",
    phoneNumber: "",
    city: "",
    description: "",
    serviceId: 1,
  });
  const [status, setStatus] = useState<string | null>(null);
  const [result, setResult] = useState<{
    leadId: number;
    providerIds: number[];
  } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "serviceId" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setStatus(null);
    setResult(null);

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const payload = await response.json();

      if (!response.ok) {
        setStatus(payload.error ?? "Failed to create lead.");
        return;
      }

      setResult({
        leadId: payload.leadId,
        providerIds: payload.providerIds,
      });
      setStatus(null);
    } catch {
      setStatus("Request failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setForm({
      name: "",
      phoneNumber: "",
      city: "",
      description: "",
      serviceId: 1,
    });
    setStatus(null);
    setResult(null);
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-8">
      <div className="border border-zinc-200 bg-white px-6 py-4">
        <h1 className="text-xl font-semibold text-zinc-900">Request Service</h1>
        <p className="mt-1 text-sm text-zinc-600">
          Submit a lead to the distribution engine and view its assignments.
        </p>
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <form className="border border-zinc-200 bg-white p-6" onSubmit={handleSubmit}>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-2 text-sm font-medium text-zinc-700">
              Name
              <input
                className="border border-zinc-200 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </label>
            <label className="flex flex-col gap-2 text-sm font-medium text-zinc-700">
              Phone Number
              <input
                className="border border-zinc-200 px-3 py-2 text-sm font-mono focus:border-zinc-500 focus:outline-none"
                name="phoneNumber"
                value={form.phoneNumber}
                onChange={handleChange}
                required
              />
            </label>
            <label className="flex flex-col gap-2 text-sm font-medium text-zinc-700">
              City
              <input
                className="border border-zinc-200 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none"
                name="city"
                value={form.city}
                onChange={handleChange}
                required
              />
            </label>
            <label className="flex flex-col gap-2 text-sm font-medium text-zinc-700">
              Service
              <select
                className="border border-zinc-200 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none"
                name="serviceId"
                value={form.serviceId}
                onChange={handleChange}
              >
                {SERVICES.map((service) => (
                  <option key={service.id} value={service.id}>
                    {service.name}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <label className="mt-4 flex flex-col gap-2 text-sm font-medium text-zinc-700">
            Description
            <textarea
              className="min-h-30 border border-zinc-200 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none"
              name="description"
              value={form.description}
              onChange={handleChange}
            />
          </label>
          {status && <p className="mt-3 text-sm text-red-600">{status}</p>}
          <button
            type="submit"
            className="mt-4 w-full bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-500 disabled:opacity-60"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit Lead"}
          </button>
          {result && (
            <div className="mt-5 border border-zinc-200 bg-zinc-50 px-4 py-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-zinc-900">
                  Lead submitted successfully
                </p>
                <span className="text-xs text-zinc-500 font-mono">
                  #{result.leadId}
                </span>
              </div>
              <div className="mt-3 overflow-hidden border border-zinc-200 bg-white">
                <div className="grid grid-cols-[180px_1fr] border-b border-zinc-200 px-3 py-2 text-xs uppercase text-zinc-500">
                  <span>Assigned providers</span>
                  <span>Details</span>
                </div>
                <div className="grid grid-cols-[180px_1fr] px-3 py-2 text-sm">
                  <span className="text-zinc-600">Providers</span>
                  <span className="font-mono text-zinc-900">
                    {result.providerIds.map((id) => `Provider ${id}`).join(", ")}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={handleReset}
                className="mt-3 text-sm font-medium text-indigo-600"
              >
                Submit another
              </button>
            </div>
          )}
        </form>
        <aside className="border border-zinc-200 bg-white p-6">
          <h2 className="text-sm font-semibold text-zinc-900">How it works</h2>
          <p className="mt-2 text-sm text-zinc-600">
            Mandatory assignments are always applied first. Remaining slots are
            filled via the service pool in round-robin order.
          </p>
          <div className="mt-4 space-y-4 text-sm">
            <div>
              <p className="text-xs uppercase text-zinc-500">Mandatory rules</p>
              <ul className="mt-2 space-y-1 text-zinc-700">
                <li>Service 1 → Provider 1</li>
                <li>Service 2 → Provider 5</li>
                <li>Service 3 → Provider 1 + Provider 4</li>
              </ul>
            </div>
            <div>
              <p className="text-xs uppercase text-zinc-500">Fair allocation pools</p>
              <ul className="mt-2 space-y-1 text-zinc-700">
                <li>
                  Service 1 pool: <span className="font-mono">P2, P3, P4</span>
                </li>
                <li>
                  Service 2 pool: <span className="font-mono">P6, P7, P8</span>
                </li>
                <li>
                  Service 3 pool: <span className="font-mono">P2, P3, P5, P6, P7, P8</span>
                </li>
              </ul>
            </div>
            <div>
              <p className="text-xs uppercase text-zinc-500">Assignment target</p>
              <p className="mt-2 text-zinc-700">Each lead is assigned to exactly 3 providers.</p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
