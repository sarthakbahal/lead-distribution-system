import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Provider Dashboard | Prowider",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
