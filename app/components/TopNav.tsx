"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { href: "/request-service", label: "Request Service" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/test-tools", label: "Test Tools" },
];

export default function TopNav() {
  const pathname = usePathname();

  return (
    <div className="border-b border-zinc-200 bg-white">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-3">
        <Link href="/" className="text-sm font-semibold tracking-tight text-zinc-900">
          Prowider
        </Link>
        <nav className="flex items-center gap-1 text-sm">
          {NAV_LINKS.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-md px-3 py-1.5 text-sm transition ${
                  active
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-zinc-600 hover:text-zinc-900"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
