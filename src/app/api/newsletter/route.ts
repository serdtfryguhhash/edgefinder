import { NextRequest, NextResponse } from "next/server";
import { newsletterSchema } from "@/lib/validations";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = newsletterSchema.parse(body);

    // In production, add subscriber to ConvertKit and database
    // const resend = new Resend(process.env.RESEND_API_KEY);
    // await resend.emails.send({...});

    const subscriber = {
      id: `sub_${Date.now()}`,
      email: validated.email,
      first_name: validated.first_name || null,
      status: "active" as const,
      source: validated.source,
      created_at: new Date().toISOString(),
    };

    return NextResponse.json(
      { data: subscriber, error: null, message: "Successfully subscribed to newsletter" },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        { data: null, error: error.message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { data: null, error: "Failed to subscribe" },
      { status: 500 }
    );
  }
}
