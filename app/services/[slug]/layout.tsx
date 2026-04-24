import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Service Details | The Healing Hands",
  description: "Detailed information about our specialized energy healing services.",
};

export default function ServiceDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
