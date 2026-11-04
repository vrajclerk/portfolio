import nodemailer from "nodemailer";

export interface ContactNotificationData {
  name: string;
  email: string;
  company?: string | null;
  topic?: string | null;
  subject?: string | null;
  message: string;
}

export interface EmailDispatchResult {
  sent: boolean;
  messageId?: string;
  error?: string;
}

/**
 * Sends a real-time email notification to the site owner upon receiving a new inquiry.
 *
 * Configurable via environment variables:
 * - SMTP_USER (or SMTP_FROM_ADDRESS): Gmail or SMTP username (e.g. vrajclerk04@gmail.com)
 * - SMTP_PASS: Gmail App Password (16 characters) or SMTP password
 * - SMTP_HOST: Default is smtp.gmail.com
 * - SMTP_PORT: Default is 465 (SSL) or 587 (STARTTLS)
 * - CONTACT_NOTIFICATION_EMAIL: Recipient inbox (defaults to vrajclerk04@gmail.com)
 */
export async function sendInquiryNotification(
  data: ContactNotificationData
): Promise<EmailDispatchResult> {
  const smtpUser = process.env.SMTP_USER || process.env.SMTP_FROM_ADDRESS;
  const smtpPass = process.env.SMTP_PASS;
  const smtpHost = process.env.SMTP_HOST || "smtp.gmail.com";
  const smtpPort = Number(process.env.SMTP_PORT) || 465;
  const recipient =
    process.env.CONTACT_NOTIFICATION_EMAIL || "vrajclerk04@gmail.com";

  if (!smtpUser || !smtpPass) {
    console.info(
      "[Email Service] SMTP credentials not configured in environment. Inquiry saved to database only."
    );
    return {
      sent: false,
      error: "SMTP credentials not configured in environment variables",
    };
  }

  try {
    const isSecure = smtpPort === 465;

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: isSecure,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    const topicLabel =
      data.topic === "collaboration"
        ? "Technical Collaboration"
        : data.topic === "opportunities"
        ? "Career & Opportunities"
        : data.topic === "architecture"
        ? "Architecture / Systems"
        : data.topic || "General Inquiry";

    const emailSubject = `[Portfolio Inquiry] ${topicLabel} from ${data.name}${
      data.subject ? `: ${data.subject}` : ""
    }`;

    const htmlContent = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #0E1013; color: #FFFFFF; border-radius: 16px; padding: 32px; border: 1px solid #2D333F;">
        <div style="border-bottom: 1px solid #2D333F; padding-bottom: 20px; margin-bottom: 24px;">
          <span style="background: rgba(255, 107, 0, 0.15); color: #FF6B00; border: 1px solid #FF6B00; padding: 4px 10px; border-radius: 999px; font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.05em;">
            New Direct Inquiry
          </span>
          <h2 style="font-size: 22px; font-weight: 800; margin-top: 12px; margin-bottom: 4px; color: #FFFFFF;">
            ${data.name} sent a message
          </h2>
          <p style="font-size: 13px; color: #9BA3AF; margin: 0;">
            Topic: <strong style="color: #FF6B00;">${topicLabel}</strong>
          </p>
        </div>

        <div style="background: #161A22; border-radius: 12px; padding: 20px; margin-bottom: 24px; border: 1px solid #242B38;">
          <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
            <tr>
              <td style="color: #9BA3AF; padding: 6px 0; width: 110px;">Name:</td>
              <td style="color: #FFFFFF; font-weight: 600; padding: 6px 0;">${data.name}</td>
            </tr>
            <tr>
              <td style="color: #9BA3AF; padding: 6px 0;">Email:</td>
              <td style="padding: 6px 0;"><a href="mailto:${data.email}" style="color: #FF6B00; text-decoration: none;">${data.email}</a></td>
            </tr>
            ${
              data.company
                ? `<tr>
                    <td style="color: #9BA3AF; padding: 6px 0;">Company:</td>
                    <td style="color: #FFFFFF; padding: 6px 0;">${data.company}</td>
                  </tr>`
                : ""
            }
            ${
              data.subject
                ? `<tr>
                    <td style="color: #9BA3AF; padding: 6px 0;">Subject:</td>
                    <td style="color: #FFFFFF; padding: 6px 0;">${data.subject}</td>
                  </tr>`
                : ""
            }
          </table>
        </div>

        <div style="margin-bottom: 28px;">
          <h4 style="font-size: 12px; font-weight: bold; text-transform: uppercase; color: #9BA3AF; margin-bottom: 8px; letter-spacing: 0.05em;">
            Message Content:
          </h4>
          <div style="background: #11141B; border: 1px solid #1E2430; border-radius: 12px; padding: 18px; font-size: 14px; line-height: 1.6; color: #E2E8F0; white-space: pre-wrap;">
${data.message}
          </div>
        </div>

        <div style="border-top: 1px solid #2D333F; padding-top: 20px; text-align: center;">
          <a href="mailto:${data.email}?subject=Re: ${encodeURIComponent(
      emailSubject
    )}" style="display: inline-block; background: #FF6B00; color: #0E1013; font-weight: bold; padding: 12px 24px; border-radius: 999px; text-decoration: none; font-size: 13px;">
            Reply to ${data.name} →
          </a>
          <p style="font-size: 11px; color: #64748B; margin-top: 16px; margin-bottom: 0;">
            This email was dispatched automatically from your portfolio at vrajclerk.dev.
          </p>
        </div>
      </div>
    `;

    const info = await transporter.sendMail({
      from: `"${data.name} via Portfolio" <${smtpUser}>`,
      to: recipient,
      replyTo: data.email,
      subject: emailSubject,
      text: `New Inquiry from ${data.name} (${data.email})\nTopic: ${topicLabel}\n\nMessage:\n${data.message}`,
      html: htmlContent,
    });

    console.info("[Email Service] Inquiry notification email dispatched successfully:", info.messageId);
    return {
      sent: true,
      messageId: info.messageId,
    };
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error("[Email Service] Failed to send inquiry notification email:", errorMsg);
    return {
      sent: false,
      error: errorMsg,
    };
  }
}
