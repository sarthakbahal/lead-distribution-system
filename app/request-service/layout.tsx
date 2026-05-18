import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Request Service | Prowider",
};

export default function RequestServiceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
