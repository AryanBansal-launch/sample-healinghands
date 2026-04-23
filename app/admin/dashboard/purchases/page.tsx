"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { 
  Package, 
  Truck, 
  CheckCircle, 
  XCircle 
} from "lucide-react";

export default function PurchasesPage() {
  const [purchases, setPurchases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPurchases = async () => {
    try {
      const res = await fetch("/api/admin/purchases");
      const data = await res.json();
      setPurchases(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPurchases();
  }, []);

  const updateStatus = async (id: string, status: string) => {
    try {
      await fetch(`/api/admin/purchases/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      fetchPurchases();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div>Loading purchases...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-serif font-bold text-gray-900">Purchase Requests</h1>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 font-semibold text-gray-700">Customer</th>
              <th className="px-6 py-4 font-semibold text-gray-700">Product</th>
              <th className="px-6 py-4 font-semibold text-gray-700">Amount</th>
              <th className="px-6 py-4 font-semibold text-gray-700">Status</th>
              <th className="px-6 py-4 font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {purchases.map((purchase) => (
              <tr key={purchase._id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900">{purchase.customerName}</div>
                  <div className="text-sm text-gray-500">{purchase.customerPhone}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-gray-900">{purchase.productName}</div>
                  <div className="text-sm text-gray-500">Qty: {purchase.quantity}</div>
                </td>
                <td className="px-6 py-4 font-medium text-gray-900">
                  ₹{purchase.totalAmount}
                </td>
                <td className="px-6 py-4">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    purchase.status === 'pending' ? 'bg-orange-100 text-orange-600' :
                    purchase.status === 'confirmed' ? 'bg-blue-100 text-blue-600' :
                    purchase.status === 'shipped' ? 'bg-purple-100 text-purple-600' :
                    purchase.status === 'delivered' ? 'bg-green-100 text-green-600' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    {purchase.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex space-x-2">
                    {purchase.status === 'pending' && (
                      <button
                        onClick={() => updateStatus(purchase._id, "confirmed")}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Confirm Order"
                      >
                        <CheckCircle className="w-5 h-5" />
                      </button>
                    )}
                    {purchase.status === 'confirmed' && (
                      <button
                        onClick={() => updateStatus(purchase._id, "shipped")}
                        className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                        title="Mark Shipped"
                      >
                        <Truck className="w-5 h-5" />
                      </button>
                    )}
                    {purchase.status === 'shipped' && (
                      <button
                        onClick={() => updateStatus(purchase._id, "delivered")}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Mark Delivered"
                      >
                        <CheckCircle className="w-5 h-5" />
                      </button>
                    )}
                    {purchase.status !== 'delivered' && purchase.status !== 'cancelled' && (
                      <button
                        onClick={() => updateStatus(purchase._id, "cancelled")}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Cancel Order"
                      >
                        <XCircle className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {purchases.length === 0 && (
          <div className="p-12 text-center text-gray-500">
            No purchase requests found.
          </div>
        )}
      </div>
    </div>
  );
}
