import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Service Details | Healing Hands",
  description: "Detailed information about our specialized energy healing services.",
};

export default function ServiceDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
