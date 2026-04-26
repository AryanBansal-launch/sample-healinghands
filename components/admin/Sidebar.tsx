"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  CalendarCheck,
  ShoppingBag,
  Wrench,
  Package,
  Award,
  MessageSquare,
  Settings,
  LogOut,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Bookings", href: "/admin/dashboard/bookings", icon: CalendarCheck },
  { label: "Purchases", href: "/admin/dashboard/purchases", icon: ShoppingBag },
  { label: "Services", href: "/admin/dashboard/services", icon: Wrench },
  { label: "Products", href: "/admin/dashboard/products", icon: Package },
  { label: "Certifications", href: "/admin/dashboard/certifications", icon: Award },
  { label: "Testimonials", href: "/admin/dashboard/testimonials", icon: MessageSquare },
  { label: "Site Settings", href: "/admin/dashboard/settings", icon: Settings },
];

type SidebarProps = {
  /** Close mobile drawer after navigation or from header button */
  onClose?: () => void;
};

export default function Sidebar({ onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <div className="flex h-full min-h-screen w-full max-w-[18rem] flex-col bg-gray-900 text-white md:min-h-screen md:w-64">
      <div className="flex items-center justify-between gap-2 border-b border-gray-800 p-4 md:hidden">
        <h1 className="truncate font-serif text-lg font-bold text-primary-400">
          Admin
        </h1>
        <button
          type="button"
          onClick={() => onClose?.()}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white"
          aria-label="Close menu"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
      <div className="hidden p-6 md:block">
        <h1 className="text-xl font-serif font-bold text-primary-400">
          The Healing Hands Admin
        </h1>
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 pb-4 pt-2 md:px-4 md:pt-0">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => onClose?.()}
              className={cn(
                "flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors",
                isActive
                  ? "bg-primary-600 text-white"
                  : "text-gray-400 hover:bg-gray-800 hover:text-white"
              )}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-gray-800">
        <button
          type="button"
          onClick={() => {
            onClose?.();
            void signOut({ callbackUrl: "/admin/login" });
          }}
          className="flex items-center space-x-3 px-4 py-3 w-full text-gray-400 hover:bg-gray-800 hover:text-white rounded-lg transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}
