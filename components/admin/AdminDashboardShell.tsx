"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import Sidebar from "@/components/admin/Sidebar";

export default function AdminDashboardShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [sidebarOpen]);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Mobile top bar */}
      <header className="fixed left-0 right-0 top-0 z-[60] flex h-14 shrink-0 items-center gap-3 border-b border-gray-200 bg-white px-3 shadow-sm md:hidden">
        <button
          type="button"
          onClick={() => setSidebarOpen(true)}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-gray-800 hover:bg-gray-100"
          aria-expanded={sidebarOpen}
          aria-label="Open navigation menu"
        >
          <Menu className="h-6 w-6" />
        </button>
        <span className="min-w-0 truncate font-serif text-base font-semibold text-gray-900">
          Healing Hands — Admin
        </span>
      </header>

      {/* Dim background when drawer is open (below header so bar stays usable) */}
      {sidebarOpen && (
        <button
          type="button"
          className="fixed bottom-0 left-0 right-0 top-14 z-[70] bg-black/40 md:hidden"
          aria-label="Close navigation menu"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar: off-canvas on small screens, static from md */}
      <div
        className={`fixed bottom-0 left-0 top-0 z-[80] w-[min(18rem,88vw)] max-w-[18rem] transition-transform duration-200 ease-out md:relative md:top-auto md:z-0 md:flex md:shrink-0 md:translate-x-0 ${
          sidebarOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </div>

      <main className="min-w-0 flex-1 overflow-auto pt-14 md:pt-0 px-4 py-5 sm:px-5 sm:py-6 md:px-8 md:py-8">
        {children}
      </main>
    </div>
  );
}
