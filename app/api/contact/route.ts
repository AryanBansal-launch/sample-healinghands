import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    // For now, just log and return success. 
    // In a real app, you might want to save to DB or send an email.
    console.log("Contact form submission:", body);
    
    return NextResponse.json({ message: "Message sent successfully" }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
