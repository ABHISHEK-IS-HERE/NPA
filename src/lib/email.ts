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

function escapeHtml(str: string): string {
  if (!str || typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
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
  const safeName = escapeHtml(authorName);
  const safeTitle = escapeHtml(paperTitle);
  const safeTrackingId = escapeHtml(trackingId);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://npa-puce.vercel.app';

  const subject = `[NRJBE] Manuscript Submission Acknowledgment — ${trackingId}`;
  const html = `
    <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; color: #1c1917; line-height: 1.6; padding: 24px; border: 1px solid #fde68a; border-radius: 12px; background-color: #fdfbf2;">
      <div style="text-align: center; border-bottom: 2px solid #b45309; padding-bottom: 16px; margin-bottom: 20px;">
        <h2 style="color: #78350f; margin: 0; font-size: 20px;">National Research Journal of Business Economics</h2>
        <p style="font-size: 12px; color: #78716c; margin: 4px 0 0 0;">ISSN: 2349-2015 | Impact Factor: 6.74 | Double-Blind Peer Reviewed</p>
      </div>

      <p>Dear <strong>${safeName}</strong>,</p>

      <p>Thank you for submitting your research manuscript to the <em>National Research Journal of Business Economics (NRJBE)</em>.</p>

      <div style="background-color: #ffffff; border: 1px solid #e7e5e4; border-radius: 8px; padding: 16px; margin: 20px 0;">
        <p style="margin: 0 0 8px 0; font-size: 13px;"><strong>Manuscript Title:</strong> ${safeTitle}</p>
        <p style="margin: 0; font-size: 14px; color: #b45309;"><strong>Unique Tracking ID:</strong> <code style="background-color: #fef3c7; padding: 2px 6px; border-radius: 4px; font-size: 15px; font-weight: bold;">${safeTrackingId}</code></p>
      </div>

      <h4 style="color: #78350f; margin-bottom: 8px;">Next Steps in the Editorial Process:</h4>
      <ol style="font-size: 13px; color: #44403c; padding-left: 20px;">
        <li><strong>Preliminary Screening:</strong> Editorial desk checks for scope and formatting.</li>
        <li><strong>Similarity Check:</strong> Plagiarism screening (Turnitin / Urkund &le; 25%).</li>
        <li><strong>Double-Blind Peer Review:</strong> Forwarded to two independent subject matter experts.</li>
        <li><strong>Editorial Decision:</strong> Acceptance letter and reviewer comments will be shared via email.</li>
      </ol>

      <p style="font-size: 13px;">You can monitor the live editorial progress of your paper anytime by visiting our <a href="${siteUrl}/track-status?id=${encodeURIComponent(trackingId)}" style="color: #b45309; font-weight: bold;">Online Manuscript Tracking Desk</a>.</p>

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
  const safeName = escapeHtml(contactName);
  const safeSubject = escapeHtml(subjectQuery);

  const subject = `[NRJBE] Inquiry Received: ${subjectQuery}`;
  const html = `
    <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; color: #1c1917; line-height: 1.6; padding: 24px; border: 1px solid #fde68a; border-radius: 12px; background-color: #fdfbf2;">
      <h3 style="color: #78350f; margin-top: 0;">Editorial Communications Desk</h3>
      <p>Dear <strong>${safeName}</strong>,</p>
      <p>We have received your inquiry regarding <em>"${safeSubject}"</em>. Our editorial administrative team will review your message and respond within 24–48 business hours.</p>
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
  planTitle: string,
  accessToken?: string
) {
  const safeName = escapeHtml(customerName);
  const safeOrderNumber = escapeHtml(orderNumber);
  const safePlanTitle = escapeHtml(planTitle);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://npa-puce.vercel.app';
  const invoiceUrl = accessToken
    ? `${siteUrl}/order/${encodeURIComponent(orderNumber)}/invoice?token=${encodeURIComponent(accessToken)}`
    : `${siteUrl}/order/${encodeURIComponent(orderNumber)}/invoice`;

  const subject = `[NRJBE] Order Confirmation — ${orderNumber}`;
  const html = `
    <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; color: #1c1917; line-height: 1.6; padding: 24px; border: 1px solid #fde68a; border-radius: 12px; background-color: #fdfbf2;">
      <div style="text-align: center; border-bottom: 2px solid #b45309; padding-bottom: 16px; margin-bottom: 20px;">
        <h2 style="color: #78350f; margin: 0;">National Research Journal of Business Economics</h2>
        <p style="font-size: 12px; color: #78716c; margin: 4px 0 0 0;">Subscription &amp; Circulation Department</p>
      </div>

      <p>Dear <strong>${safeName}</strong>,</p>
      <p>Thank you for your order. We have recorded your subscription request with the particulars below:</p>

      <div style="background-color: #ffffff; border: 1px solid #e7e5e4; border-radius: 8px; padding: 16px; margin: 20px 0;">
        <p style="margin: 0 0 6px 0; font-size: 14px;"><strong>Order Reference:</strong> <code style="color: #b45309; font-weight: bold;">${safeOrderNumber}</code></p>
        <p style="margin: 0 0 6px 0; font-size: 13px;"><strong>Package / Items:</strong> ${safePlanTitle}</p>
        <p style="margin: 0; font-size: 14px;"><strong>Total Amount:</strong> ₹${amount.toLocaleString('en-IN')}</p>
      </div>

      <p style="font-size: 13px;">You can view and print your formal tax invoice and receipt anytime here: <br />
        <a href="${invoiceUrl}" style="color: #b45309; font-weight: bold;">View Official Tax Invoice &amp; Cash Receipt</a>
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

/**
 * 4. Peer Reviewer Invitation Email (Double-Blind Protocol)
 */
export async function sendReviewerInvitation(
  reviewerEmail: string,
  reviewerName: string,
  paperTitle: string,
  abstract: string,
  accessToken: string,
  deadlineDays: number = 14
) {
  const safeName = escapeHtml(reviewerName);
  const safeTitle = escapeHtml(paperTitle);
  const safeAbstract = escapeHtml(abstract.slice(0, 600));
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://npa-puce.vercel.app';
  const reviewUrl = `${siteUrl}/reviewer/evaluate/${encodeURIComponent(accessToken)}`;

  const deadlineDate = new Date();
  deadlineDate.setDate(deadlineDate.getDate() + deadlineDays);
  const deadlineStr = deadlineDate.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const subject = `[NRJBE] Invitation to Review Manuscript: "${safeTitle.slice(0, 50)}..."`;
  const html = `
    <div style="font-family: Georgia, serif; max-width: 650px; margin: 0 auto; color: #1c1917; line-height: 1.6; padding: 24px; border: 1px solid #fde68a; border-radius: 12px; background-color: #fdfbf2;">
      <div style="text-align: center; border-bottom: 2px solid #b45309; padding-bottom: 16px; margin-bottom: 20px;">
        <h2 style="color: #78350f; margin: 0; font-size: 20px;">National Research Journal of Business Economics</h2>
        <p style="font-size: 12px; color: #78716c; margin: 4px 0 0 0;">Double-Blind Peer Review Editorial Office | ISSN: 2349-2015</p>
      </div>

      <p>Dear <strong>${safeName}</strong>,</p>

      <p>In recognition of your academic expertise in this field, the Editorial Board of the <em>National Research Journal of Business Economics (NRJBE)</em> cordially invites you to review the following manuscript:</p>

      <div style="background-color: #ffffff; border: 1px solid #e7e5e4; border-radius: 8px; padding: 18px; margin: 20px 0;">
        <p style="margin: 0 0 8px 0; font-size: 15px; font-weight: bold; color: #0c0a09;">${safeTitle}</p>
        <p style="margin: 0 0 12px 0; font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; color: #b45309; font-weight: bold;">Abstract Preview</p>
        <p style="margin: 0; font-size: 13px; color: #44403c; line-height: 1.6;">${safeAbstract}${abstract.length > 600 ? '...' : ''}</p>
      </div>

      <div style="background-color: #fef3c7; border: 1px solid #fde68a; border-radius: 6px; padding: 12px; margin: 16px 0; font-size: 12px; color: #92400e;">
        <strong>Double-Blind Protocol:</strong> Author identities and affiliations are masked to ensure impartiality. Please maintain confidentiality regarding all manuscript contents.
      </div>

      <p style="font-size: 13px;"><strong>Requested Review Deadline:</strong> ${deadlineStr} (${deadlineDays} days)</p>

      <div style="text-align: center; margin: 28px 0;">
        <a href="${reviewUrl}" style="background-color: #1c1917; color: #fdfbf2; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: bold; font-size: 13px; display: inline-block; letter-spacing: 0.05em;">
          Access Blinded Review Portal &amp; Manuscript
        </a>
      </div>

      <p style="font-size: 12px; color: #78716c;">If you are unable to review this manuscript at this time, please inform us promptly by replying to this email so we may reassign it.</p>

      <div style="border-top: 1px solid #e7e5e4; padding-top: 16px; margin-top: 24px; font-size: 11px; color: #78716c;">
        <p style="margin: 0;">Editorial Office: National Research Journal of Business Economics</p>
        <p style="margin: 2px 0;">Published by: National Press Associates | Helpline: +91-9888934889</p>
      </div>
    </div>
  `;

  return sendEmail({ to: reviewerEmail, subject, html });
}

/**
 * 5. Editorial Decision Letter Email to Author
 */
export async function sendEditorialDecisionLetter(
  authorEmail: string,
  authorName: string,
  trackingId: string,
  paperTitle: string,
  decision: 'Accept' | 'Minor Revision' | 'Major Revision' | 'Reject',
  editorRemarks: string,
  anonymizedComments: string[] = []
) {
  const safeName = escapeHtml(authorName);
  const safeTitle = escapeHtml(paperTitle);
  const safeTrackingId = escapeHtml(trackingId);
  const safeRemarks = escapeHtml(editorRemarks);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://npa-puce.vercel.app';
  const trackingUrl = `${siteUrl}/track-status?trackingId=${encodeURIComponent(trackingId)}`;

  const decisionBadgeConfig = {
    Accept: { color: '#065f46', bg: '#d1fae5', border: '#a7f3d0', label: 'ACCEPTED FOR PUBLICATION' },
    'Minor Revision': { color: '#92400e', bg: '#fef3c7', border: '#fde68a', label: 'REVISIONS REQUIRED (MINOR)' },
    'Major Revision': { color: '#9a3412', bg: '#ffedd5', border: '#fed7aa', label: 'REVISIONS REQUIRED (MAJOR)' },
    Reject: { color: '#991b1b', bg: '#fee2e2', border: '#fecaca', label: 'MANUSCRIPT DECLINED' },
  }[decision] || { color: '#1c1917', bg: '#f5f5f4', border: '#e7e5e4', label: decision.toUpperCase() };

  const reviewerFeedbackHtml =
    anonymizedComments.length > 0
      ? `
        <div style="margin: 24px 0;">
          <h4 style="font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em; color: #44403c; margin-bottom: 12px; border-bottom: 1px solid #e7e5e4; padding-bottom: 6px;">Peer Reviewer Evaluation Reports</h4>
          ${anonymizedComments
            .map(
              (c, idx) => `
            <div style="background-color: #ffffff; border: 1px solid #e7e5e4; border-radius: 6px; padding: 14px; margin-bottom: 12px; font-size: 13px; color: #292524;">
              <strong style="color: #78350f;">Reviewer ${idx + 1} Comments:</strong>
              <p style="margin: 8px 0 0 0; white-space: pre-wrap; line-height: 1.5;">${escapeHtml(c)}</p>
            </div>
          `
            )
            .join('')}
        </div>
      `
      : '';

  const subject = `[NRJBE] Editorial Decision on Manuscript ${trackingId} — ${decisionBadgeConfig.label}`;
  const html = `
    <div style="font-family: Georgia, serif; max-width: 650px; margin: 0 auto; color: #1c1917; line-height: 1.6; padding: 24px; border: 1px solid #fde68a; border-radius: 12px; background-color: #fdfbf2;">
      <div style="text-align: center; border-bottom: 2px solid #b45309; padding-bottom: 16px; margin-bottom: 20px;">
        <h2 style="color: #78350f; margin: 0; font-size: 20px;">National Research Journal of Business Economics</h2>
        <p style="font-size: 12px; color: #78716c; margin: 4px 0 0 0;">ISSN: 2349-2015 | Double-Blind Peer Reviewed Journal</p>
      </div>

      <p>Dear <strong>${safeName}</strong>,</p>

      <p>The peer review and editorial evaluation of your research manuscript has concluded:</p>

      <div style="background-color: #ffffff; border: 1px solid #e7e5e4; border-radius: 8px; padding: 16px; margin: 20px 0;">
        <p style="margin: 0 0 6px 0; font-size: 14px;"><strong>Manuscript:</strong> ${safeTitle}</p>
        <p style="margin: 0 0 10px 0; font-size: 13px; color: #78716c;"><strong>Tracking Reference:</strong> ${safeTrackingId}</p>
        <div style="display: inline-block; background-color: ${decisionBadgeConfig.bg}; color: ${decisionBadgeConfig.color}; border: 1px solid ${decisionBadgeConfig.border}; padding: 6px 14px; border-radius: 4px; font-weight: bold; font-size: 12px; letter-spacing: 0.05em;">
          ${decisionBadgeConfig.label}
        </div>
      </div>

      <div style="background-color: #ffffff; border-left: 4px solid #b45309; padding: 14px 18px; margin: 20px 0; font-size: 13px;">
        <strong>Editor's Remarks &amp; Recommendations:</strong>
        <p style="margin: 8px 0 0 0; white-space: pre-wrap; color: #44403c;">${safeRemarks}</p>
      </div>

      ${reviewerFeedbackHtml}

      <p style="font-size: 13px;">
        You can check the live status of your manuscript anytime at the <a href="${trackingUrl}" style="color: #b45309; font-weight: bold;">Online Author Tracking Desk</a>.
      </p>

      <div style="border-top: 1px solid #e7e5e4; padding-top: 16px; margin-top: 24px; font-size: 11px; color: #78716c;">
        <p style="margin: 0;">Editorial Board: National Research Journal of Business Economics</p>
        <p style="margin: 2px 0;">National Press Associates | Email: editornrjbe@gmail.com</p>
      </div>
    </div>
  `;

  return sendEmail({ to: authorEmail, subject, html });
}

