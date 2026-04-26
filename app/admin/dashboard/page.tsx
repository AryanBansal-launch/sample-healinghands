"use client";

import { useEffect, useState } from "react";
import { 
  CalendarCheck, 
  ShoppingBag, 
  Wrench, 
  Package 
} from "lucide-react";

interface Stats {
  pendingBookings: number;
  pendingPurchases: number;
  totalServices: number;
  totalProducts: number;
  recentBookings: any[];
  recentPurchases: any[];
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((res) => res.json())
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch((err) => console.error(err));
  }, []);

  if (loading) return <div>Loading dashboard...</div>;

  const cards = [
    { label: "Pending Bookings", value: stats?.pendingBookings, icon: CalendarCheck, color: "text-blue-600", bg: "bg-blue-100" },
    { label: "Pending Purchases", value: stats?.pendingPurchases, icon: ShoppingBag, color: "text-orange-600", bg: "bg-orange-100" },
    { label: "Active Services", value: stats?.totalServices, icon: Wrench, color: "text-green-600", bg: "bg-green-100" },
    { label: "Active Products", value: stats?.totalProducts, icon: Package, color: "text-purple-600", bg: "bg-purple-100" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-serif font-bold text-gray-900 sm:text-3xl">
          Dashboard Overview
        </h1>
        <p className="text-gray-600">Welcome back, Preyanka M Jain</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => (
          <div key={card.label} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-4">
            <div className={`${card.bg} p-4 rounded-xl`}>
              <card.icon className={`w-6 h-6 ${card.color}`} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">{card.label}</p>
              <p className="text-2xl font-bold text-gray-900">{card.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Bookings */}
        <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-6">
          <h2 className="text-xl font-bold mb-4">Recent Bookings</h2>
          <div className="space-y-4">
            {stats?.recentBookings.map((booking) => (
              <div
                key={booking._id}
                className="flex flex-col gap-2 rounded-xl bg-gray-50 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-semibold">{booking.fullName}</p>
                  <p className="text-sm text-gray-500">{booking.service}</p>
                </div>
                <div className="text-left sm:text-right">
                  <p className="text-sm font-medium">{new Date(booking.preferredDate).toLocaleDateString()}</p>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    booking.status === 'pending' ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-600'
                  }`}>
                    {booking.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Purchases */}
        <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-6">
          <h2 className="text-xl font-bold mb-4">Recent Purchases</h2>
          <div className="space-y-4">
            {stats?.recentPurchases.map((purchase) => (
              <div
                key={purchase._id}
                className="flex flex-col gap-2 rounded-xl bg-gray-50 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-semibold">{purchase.customerName}</p>
                  <p className="text-sm text-gray-500">{purchase.productName} (x{purchase.quantity})</p>
                </div>
                <div className="text-left sm:text-right">
                  <p className="text-sm font-medium">₹{purchase.totalAmount}</p>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    purchase.status === 'pending' ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-600'
                  }`}>
                    {purchase.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
