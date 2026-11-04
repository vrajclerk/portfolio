import { NextRequest, NextResponse } from "next/server";
import configPromise from "@payload-config";
import { getPayload } from "payload";
import { sql } from "@payloadcms/db-vercel-postgres";
import { sendInquiryNotification } from "@/lib/email";

// Basic email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, company, topic, subject, message, website } = body;

    // 1. Honeypot check for spam bots
    if (website && typeof website === "string" && website.trim().length > 0) {
      console.warn("[Contact API] Bot detected via honeypot field. Silently dropping.");
      return NextResponse.json({
        success: true,
        message: "Thank you for reaching out! Your message has been received.",
      });
    }

    // 2. Validate required inputs
    if (!name || typeof name !== "string" || name.trim().length < 2) {
      return NextResponse.json(
        { success: false, error: "Please provide a valid name (at least 2 characters)." },
        { status: 400 }
      );
    }

    if (!email || typeof email !== "string" || !EMAIL_REGEX.test(email.trim())) {
      return NextResponse.json(
        { success: false, error: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    if (!message || typeof message !== "string" || message.trim().length < 5) {
      return NextResponse.json(
        { success: false, error: "Please enter a message (at least 5 characters)." },
        { status: 400 }
      );
    }

    const payload = await getPayload({ config: configPromise });

    // 3. Ensure inquiries table exists in PostgreSQL
    try {
      if (payload.db && (payload.db as unknown as { drizzle?: { execute: (q: unknown) => Promise<unknown> } }).drizzle) {
        await (payload.db as unknown as { drizzle: { execute: (q: unknown) => Promise<unknown> } }).drizzle.execute(sql`
          CREATE TABLE IF NOT EXISTS "inquiries" (
            "id" serial PRIMARY KEY,
            "name" varchar NOT NULL,
            "email" varchar NOT NULL,
            "company" varchar,
            "topic" varchar DEFAULT 'collaboration',
            "subject" varchar,
            "message" text NOT NULL,
            "status" varchar DEFAULT 'new',
            "email_sent" boolean DEFAULT false,
            "email_error" varchar,
            "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
            "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
          );
        `);
      }
    } catch (sqlErr) {
      console.warn("[Contact API] Database DDL notice:", sqlErr);
    }

    // 4. Save inquiry document into Payload CMS (Neon PostgreSQL)
    const validTopics = ["collaboration", "opportunities", "architecture", "general"] as const;
    type InquiryTopic = (typeof validTopics)[number];
    const sanitizedTopic: InquiryTopic = validTopics.includes(topic as InquiryTopic)
      ? (topic as InquiryTopic)
      : "collaboration";

    let inquiryId: number | string | null = null;
    try {
      const createdInquiry = await payload.create({
        collection: "inquiries",
        data: {
          name: name.trim(),
          email: email.trim().toLowerCase(),
          company: company ? String(company).trim() : undefined,
          topic: sanitizedTopic,
          subject: subject ? String(subject).trim() : undefined,
          message: message.trim(),
          status: "new",
          emailSent: false,
        },
      });
      inquiryId = createdInquiry.id;
      console.info("[Contact API] Saved inquiry to database. ID:", inquiryId);
    } catch (dbErr) {
      console.error("[Contact API] Failed to save inquiry to database:", dbErr);
      return NextResponse.json(
        {
          success: false,
          error: "Could not save your inquiry. Please try emailing directly to vrajclerk04@gmail.com.",
        },
        { status: 500 }
      );
    }

    // 5. Attempt Real-Time Notification Email Delivery
    const emailResult = await sendInquiryNotification({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      company: company ? String(company).trim() : null,
      topic: topic ? String(topic).trim() : "collaboration",
      subject: subject ? String(subject).trim() : null,
      message: message.trim(),
    });

    // 6. Update database inquiry record with email status
    if (inquiryId) {
      try {
        await payload.update({
          collection: "inquiries",
          id: inquiryId,
          data: {
            emailSent: emailResult.sent,
            emailError: emailResult.error || undefined,
          },
        });
      } catch (updateErr) {
        console.warn("[Contact API] Could not update emailSent flag on inquiry:", updateErr);
      }
    }

    return NextResponse.json({
      success: true,
      message: "Thank you! Your message has been received and stored securely. I will get back to you shortly.",
      emailDelivered: emailResult.sent,
    });
  } catch (error) {
    console.error("[Contact API] Unexpected error handling contact inquiry:", error);
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred. Please try again or reach out directly via email." },
      { status: 500 }
    );
  }
}
