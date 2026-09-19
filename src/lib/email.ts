/*
 * Copyright © 2026 Abhishek
 * All rights reserved.
 */

export interface EmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  from?: string;
}

export async function sendEmail({
  to,
  subject,
  html,
  from = 'NRJBE Editorial Office <editorial@nrjbe.in>',
}: EmailOptions): Promise<{ success: boolean; id?: string; error?: string }> {
  const apiKey = process.env.RESEND_API_KEY;

  // If no API key configured, simulate/log gracefully without throwing errors
  if (!apiKey) {
    if (process.env.NODE_ENV !== 'production') {
      console.log('--- [EMAIL DISPATCH SIMULATION] ---');
      console.log(`To: ${Array.isArray(to) ? to.join(', ') : to}`);
      console.log(`Subject: ${subject}`);
      console.log('-----------------------------------');
    }
    return { success: true, id: 'simulated_dev_id' };
  }

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: Array.isArray(to) ? to : [to],
        subject,
        html,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      console.error('Resend email API error:', data);
      return { success: false, error: data.message || 'Failed to dispatch email.' };
    }

    return { success: true, id: data.id };
  } catch (err: any) {
    console.error('Email sending exception:', err);
    return { success: false, error: err.message || 'Network error during email dispatch.' };
  }
}

/**
 * 1. Author Submission Confirmation Email
 */
export async function sendSubmissionConfirmation(
  authorEmail: string,
  authorName: string,
  trackingId: string,
  paperTitle: string
) {
  const subject = `[NRJBE] Manuscript Submission Acknowledgment — ${trackingId}`;
  const html = `
    <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; color: #1c1917; line-height: 1.6; padding: 24px; border: 1px solid #fde68a; border-radius: 12px; background-color: #fdfbf2;">
      <div style="text-align: center; border-bottom: 2px solid #b45309; padding-bottom: 16px; margin-bottom: 20px;">
        <h2 style="color: #78350f; margin: 0; font-size: 20px;">National Research Journal of Business Economics</h2>
        <p style="font-size: 12px; color: #78716c; margin: 4px 0 0 0;">ISSN: 2349-2015 | Impact Factor: 6.74 | Double-Blind Peer Reviewed</p>
      </div>

      <p>Dear <strong>${authorName}</strong>,</p>

      <p>Thank you for submitting your research manuscript to the <em>National Research Journal of Business Economics (NRJBE)</em>.</p>

      <div style="background-color: #ffffff; border: 1px solid #e7e5e4; border-radius: 8px; padding: 16px; margin: 20px 0;">
        <p style="margin: 0 0 8px 0; font-size: 13px;"><strong>Manuscript Title:</strong> ${paperTitle}</p>
        <p style="margin: 0; font-size: 14px; color: #b45309;"><strong>Unique Tracking ID:</strong> <code style="background-color: #fef3c7; padding: 2px 6px; border-radius: 4px; font-size: 15px; font-weight: bold;">${trackingId}</code></p>
      </div>

      <h4 style="color: #78350f; margin-bottom: 8px;">Next Steps in the Editorial Process:</h4>
      <ol style="font-size: 13px; color: #44403c; padding-left: 20px;">
        <li><strong>Preliminary Screening:</strong> Editorial desk checks for scope and formatting.</li>
        <li><strong>Similarity Check:</strong> Plagiarism screening (Turnitin / Urkund &le; 25%).</li>
        <li><strong>Double-Blind Peer Review:</strong> Forwarded to two independent subject matter experts.</li>
        <li><strong>Editorial Decision:</strong> Acceptance letter and reviewer comments will be shared via email.</li>
      </ol>

      <p style="font-size: 13px;">You can monitor the live editorial progress of your paper anytime by visiting our <a href="https://npa-puce.vercel.app/track-status?id=${trackingId}" style="color: #b45309; font-weight: bold;">Online Manuscript Tracking Desk</a>.</p>

      <div style="border-top: 1px solid #e7e5e4; padding-top: 16px; margin-top: 24px; font-size: 11px; color: #78716c;">
        <p style="margin: 0;">Editorial Office: National Press Associates (NPA)</p>
        <p style="margin: 2px 0;">Email: <a href="mailto:editornrjbe@gmail.com" style="color: #b45309;">editornrjbe@gmail.com</a> | Helpline: +91-9888934889</p>
      </div>
    </div>
  `;

  return sendEmail({ to: authorEmail, subject, html });
}

/**
 * 2. Contact Inquiry Acknowledgment
 */
export async function sendContactAutoReply(
  contactEmail: string,
  contactName: string,
  subjectQuery: string
) {
  const subject = `[NRJBE] Inquiry Received: ${subjectQuery}`;
  const html = `
    <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; color: #1c1917; line-height: 1.6; padding: 24px; border: 1px solid #fde68a; border-radius: 12px; background-color: #fdfbf2;">
      <h3 style="color: #78350f; margin-top: 0;">Editorial Communications Desk</h3>
      <p>Dear <strong>${contactName}</strong>,</p>
      <p>We have received your inquiry regarding <em>"${subjectQuery}"</em>. Our editorial administrative team will review your message and respond within 24–48 business hours.</p>
      <p style="font-size: 12px; color: #78716c;">If this is urgent regarding an accepted paper or volume dispatch, you may also reach our desk directly on WhatsApp at <strong>+91-9888934889</strong>.</p>
      <div style="border-top: 1px solid #e7e5e4; padding-top: 12px; margin-top: 20px; font-size: 11px; color: #78716c;">
        <p style="margin: 0;">National Research Journal of Business Economics | National Press Associates</p>
      </div>
    </div>
  `;

  return sendEmail({ to: contactEmail, subject, html });
}

/**
 * 3. Customer Order & Subscription Confirmation
 */
export async function sendOrderConfirmation(
  customerEmail: string,
  customerName: string,
  orderNumber: string,
  amount: number,
  planTitle: string
) {
  const subject = `[NRJBE] Order Confirmation — ${orderNumber}`;
  const html = `
    <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; color: #1c1917; line-height: 1.6; padding: 24px; border: 1px solid #fde68a; border-radius: 12px; background-color: #fdfbf2;">
      <div style="text-align: center; border-bottom: 2px solid #b45309; padding-bottom: 16px; margin-bottom: 20px;">
        <h2 style="color: #78350f; margin: 0;">National Research Journal of Business Economics</h2>
        <p style="font-size: 12px; color: #78716c; margin: 4px 0 0 0;">Subscription &amp; Circulation Department</p>
      </div>

      <p>Dear <strong>${customerName}</strong>,</p>
      <p>Thank you for your order. We have recorded your subscription request with the particulars below:</p>

      <div style="background-color: #ffffff; border: 1px solid #e7e5e4; border-radius: 8px; padding: 16px; margin: 20px 0;">
        <p style="margin: 0 0 6px 0; font-size: 14px;"><strong>Order Reference:</strong> <code style="color: #b45309; font-weight: bold;">${orderNumber}</code></p>
        <p style="margin: 0 0 6px 0; font-size: 13px;"><strong>Package / Items:</strong> ${planTitle}</p>
        <p style="margin: 0; font-size: 14px;"><strong>Total Amount:</strong> ₹${amount.toLocaleString('en-IN')}</p>
      </div>

      <p style="font-size: 13px;">You can view and print your formal tax invoice and receipt anytime here: <br />
        <a href="https://npa-puce.vercel.app/order/${orderNumber}/invoice" style="color: #b45309; font-weight: bold;">View Official Tax Invoice &amp; Cash Receipt</a>
      </p>

      <p style="font-size: 13px;">Printed copies and certificates are dispatched via India Post Speed Post. You will receive your consignment tracking number as soon as the package is lodged.</p>

      <div style="border-top: 1px solid #e7e5e4; padding-top: 16px; margin-top: 24px; font-size: 11px; color: #78716c;">
        <p style="margin: 0;">Circulation Division: National Press Associates</p>
        <p style="margin: 2px 0;">Helpline: +91-9888934889 | Email: editornrjbe@gmail.com</p>
      </div>
    </div>
  `;

  return sendEmail({ to: customerEmail, subject, html });
}
