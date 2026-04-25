"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { CheckCircle, XCircle, MessageSquare } from "lucide-react";
import {
  buildBookingApprovalMessage,
  buildCustomerWhatsAppURL,
} from "@/lib/whatsapp";

export default function BookingsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      const res = await fetch("/api/admin/bookings");
      const data = await res.json();
      setBookings(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const updateStatus = async (
    id: string,
    status: string
  ): Promise<{ customerWhatsAppUrl?: string } | null> => {
    try {
      const res = await fetch(`/api/admin/bookings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        console.error(err);
        return null;
      }
      const data = await res.json();
      await fetchBookings();
      return {
        customerWhatsAppUrl:
          typeof data.customerWhatsAppUrl === "string"
            ? data.customerWhatsAppUrl
            : undefined,
      };
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  const handleApprove = async (booking: any) => {
    const result = await updateStatus(booking._id, "approved");
    if (result?.customerWhatsAppUrl) {
      window.open(result.customerWhatsAppUrl, "_blank");
    }
  };

  const openConfirmationWhatsApp = (booking: any) => {
    const message = buildBookingApprovalMessage({
      fullName: booking.fullName,
      service: booking.service,
      preferredDate: format(new Date(booking.preferredDate), "PPP"),
      preferredTime: booking.preferredTime,
    });
    window.open(buildCustomerWhatsAppURL(booking.phone, message), "_blank");
  };

  if (loading) return <div>Loading bookings...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-serif font-bold text-gray-900">Manage Bookings</h1>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 font-semibold text-gray-700">Customer</th>
              <th className="px-6 py-4 font-semibold text-gray-700">Service</th>
              <th className="px-6 py-4 font-semibold text-gray-700">Schedule</th>
              <th className="px-6 py-4 font-semibold text-gray-700">Status</th>
              <th className="px-6 py-4 font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {bookings.map((booking) => (
              <tr key={booking._id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900">{booking.fullName}</div>
                  <div className="text-sm text-gray-500">{booking.phone}</div>
                </td>
                <td className="px-6 py-4 text-gray-600">{booking.service}</td>
                <td className="px-6 py-4 text-sm">
                  <div>{format(new Date(booking.preferredDate), "PP")}</div>
                  <div className="text-gray-500">{booking.preferredTime}</div>
                </td>
                <td className="px-6 py-4">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    booking.status === 'pending' ? 'bg-orange-100 text-orange-600' :
                    booking.status === 'approved' ? 'bg-green-100 text-green-600' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    {booking.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex space-x-2">
                    {booking.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleApprove(booking)}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Approve & Send WhatsApp"
                        >
                          <CheckCircle className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => updateStatus(booking._id, "rejected")}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Reject"
                        >
                          <XCircle className="w-5 h-5" />
                        </button>
                      </>
                    )}
                    {booking.status === 'approved' && (
                      <>
                        <button
                          type="button"
                          onClick={() => openConfirmationWhatsApp(booking)}
                          className="p-2 text-[#25D366] hover:bg-green-50 rounded-lg transition-colors"
                          title="Open WhatsApp confirmation again"
                        >
                          <MessageSquare className="w-5 h-5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => updateStatus(booking._id, "completed")}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Mark Completed"
                        >
                          <CheckCircle className="w-5 h-5" />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {bookings.length === 0 && (
          <div className="p-12 text-center text-gray-500">
            No bookings found.
          </div>
        )}
      </div>
    </div>
  );
}
