import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import Booking from "@/models/Booking";
import PurchaseRequest from "@/models/PurchaseRequest";
import Service from "@/models/Service";
import Product from "@/models/Product";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await dbConnect();

    const [pendingBookings, pendingPurchases, totalServices, totalProducts] = await Promise.all([
      Booking.countDocuments({ status: "pending" }),
      PurchaseRequest.countDocuments({ status: "pending" }),
      Service.countDocuments({ isActive: true }),
      Product.countDocuments({ isActive: true }),
    ]);

    const recentBookings = await Booking.find().sort({ createdAt: -1 }).limit(5);
    const recentPurchases = await PurchaseRequest.find().sort({ createdAt: -1 }).limit(5);

    return NextResponse.json({
      pendingBookings,
      pendingPurchases,
      totalServices,
      totalProducts,
      recentBookings,
      recentPurchases,
    });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
