import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Test Tools | Prowider",
};

export default function TestToolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
