const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919355733831";

export function buildWhatsAppURL(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function buildBookingApprovalMessage(booking: {
  fullName: string;
  service: string;
  preferredDate: string;
  preferredTime: string;
}): string {
  return `🙏 Namaste ${booking.fullName}! Your ${booking.service} session with The Healing Hands has been confirmed for ${booking.preferredDate} at ${booking.preferredTime}. We look forward to supporting your healing journey. — Preyanka Jain, The Healing Hands 🙏`;
}

export function buildPurchaseMessage(purchase: {
  productName: string;
  quantity: number;
  totalAmount: number;
  customerName: string;
  customerPhone: string;
  shippingAddress: string;
}): string {
  return `Hello! I'd like to purchase ${purchase.quantity}x ${purchase.productName} (₹${purchase.totalAmount}). My details — Name: ${purchase.customerName}, Phone: ${purchase.customerPhone}, Address: ${purchase.shippingAddress}. Please confirm my order. 🙏`;
}
