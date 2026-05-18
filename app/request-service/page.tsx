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

      setStatus(
        `Lead ${payload.leadId} assigned to providers ${payload.providerIds.join(", ")}.`
      );
      setForm((prev) => ({
        ...prev,
        phoneNumber: "",
        description: "",
      }));
    } catch (error) {
      setStatus("Request failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-6 py-10">
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-semibold text-zinc-900">Request Service</h1>
          <p className="mt-1 text-sm text-zinc-500">
            Submit a lead to the distribution engine.
          </p>
        </div>
        <form
          className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm"
          onSubmit={handleSubmit}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-2 text-sm font-medium text-zinc-700">
              Name
              <input
                className="rounded-lg border border-zinc-200 px-3 py-2 text-sm focus:border-zinc-400 focus:outline-none"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </label>
            <label className="flex flex-col gap-2 text-sm font-medium text-zinc-700">
              Phone Number
              <input
                className="rounded-lg border border-zinc-200 px-3 py-2 text-sm focus:border-zinc-400 focus:outline-none"
                name="phoneNumber"
                value={form.phoneNumber}
                onChange={handleChange}
                required
              />
            </label>
            <label className="flex flex-col gap-2 text-sm font-medium text-zinc-700">
              City
              <input
                className="rounded-lg border border-zinc-200 px-3 py-2 text-sm focus:border-zinc-400 focus:outline-none"
                name="city"
                value={form.city}
                onChange={handleChange}
                required
              />
            </label>
            <label className="flex flex-col gap-2 text-sm font-medium text-zinc-700">
              Service
              <select
                className="rounded-lg border border-zinc-200 px-3 py-2 text-sm focus:border-zinc-400 focus:outline-none"
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
              className="min-h-30 rounded-lg border border-zinc-200 px-3 py-2 text-sm focus:border-zinc-400 focus:outline-none"
              name="description"
              value={form.description}
              onChange={handleChange}
            />
          </label>
          <div className="mt-6 flex items-center gap-3">
            <button
              type="submit"
              className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-zinc-800 disabled:opacity-60"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit Lead"}
            </button>
            {status && <p className="text-sm text-zinc-600">{status}</p>}
          </div>
        </form>
      </div>
    </div>
  );
}
