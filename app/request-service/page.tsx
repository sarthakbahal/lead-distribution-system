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
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-6 py-10">
      <div>
        <h1 className="text-2xl font-semibold">Request Service</h1>
        <p className="text-sm text-muted-foreground">
          Submit a lead to the distribution engine.
        </p>
      </div>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <label className="flex flex-col gap-2 text-sm">
          Name
          <input
            className="rounded border border-zinc-200 px-3 py-2"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </label>
        <label className="flex flex-col gap-2 text-sm">
          Phone Number
          <input
            className="rounded border border-zinc-200 px-3 py-2"
            name="phoneNumber"
            value={form.phoneNumber}
            onChange={handleChange}
            required
          />
        </label>
        <label className="flex flex-col gap-2 text-sm">
          City
          <input
            className="rounded border border-zinc-200 px-3 py-2"
            name="city"
            value={form.city}
            onChange={handleChange}
            required
          />
        </label>
        <label className="flex flex-col gap-2 text-sm">
          Service
          <select
            className="rounded border border-zinc-200 px-3 py-2"
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
        <label className="flex flex-col gap-2 text-sm">
          Description
          <textarea
            className="min-h-[120px] rounded border border-zinc-200 px-3 py-2"
            name="description"
            value={form.description}
            onChange={handleChange}
          />
        </label>
        <button
          type="submit"
          className="rounded bg-black px-4 py-2 text-white disabled:opacity-60"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit Lead"}
        </button>
      </form>
      {status && <p className="text-sm text-zinc-700">{status}</p>}
    </div>
  );
}
