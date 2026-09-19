/*
 * Copyright © 2026 Abhishek
 * All rights reserved.
 */

export interface ValidationResult<T> {
  success: boolean;
  data?: T;
  error?: string;
  errors?: Record<string, string>;
}

export function isValidEmail(email: string): boolean {
  if (!email || typeof email !== 'string') return false;
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email.trim());
}

export function isValidPhone(phone: string): boolean {
  if (!phone || typeof phone !== 'string') return false;
  const digits = phone.replace(/[^0-9]/g, '');
  return digits.length >= 7 && digits.length <= 15;
}

export function sanitizeInput(str: string): string {
  if (!str || typeof str !== 'string') return '';
  return str.trim();
}

export interface ContactInput {
  name: string;
  email: string;
  phone?: string | null;
  subject: string;
  message: string;
}

export function validateContactInput(data: any): ValidationResult<ContactInput> {
  if (!data || typeof data !== 'object') {
    return { success: false, error: 'Invalid request payload.' };
  }

  const errors: Record<string, string> = {};

  const name = typeof data.name === 'string' ? data.name.trim() : '';
  if (!name || name.length < 2) {
    errors.name = 'Name must be at least 2 characters.';
  } else if (name.length > 120) {
    errors.name = 'Name cannot exceed 120 characters.';
  }

  const email = typeof data.email === 'string' ? data.email.trim().toLowerCase() : '';
  if (!isValidEmail(email)) {
    errors.email = 'Please provide a valid email address.';
  }

  let phone: string | null = null;
  if (data.phone) {
    phone = String(data.phone).trim();
    if (!isValidPhone(phone)) {
      errors.phone = 'Please provide a valid phone number.';
    }
  }

  const subject = typeof data.subject === 'string' ? data.subject.trim() : '';
  if (!subject || subject.length < 3) {
    errors.subject = 'Subject must be at least 3 characters.';
  } else if (subject.length > 200) {
    errors.subject = 'Subject cannot exceed 200 characters.';
  }

  const message = typeof data.message === 'string' ? data.message.trim() : '';
  if (!message || message.length < 10) {
    errors.message = 'Message must be at least 10 characters.';
  } else if (message.length > 5000) {
    errors.message = 'Message cannot exceed 5000 characters.';
  }

  if (Object.keys(errors).length > 0) {
    return { success: false, errors, error: Object.values(errors)[0] };
  }

  return {
    success: true,
    data: { name, email, phone, subject, message },
  };
}

export interface SubmissionInput {
  paperTitle: string;
  authorName: string;
  authorEmail: string;
  authorPhone?: string | null;
  affiliation?: string | null;
  coAuthors?: string | null;
  abstract: string;
  keywords?: string | null;
  researchArea?: string | null;
  manuscriptFileUrl: string;
}

export function validateSubmissionInput(data: any): ValidationResult<SubmissionInput> {
  if (!data || typeof data !== 'object') {
    return { success: false, error: 'Invalid request payload.' };
  }

  const errors: Record<string, string> = {};

  const paperTitle = typeof data.paperTitle === 'string' ? data.paperTitle.trim() : '';
  if (!paperTitle || paperTitle.length < 5) {
    errors.paperTitle = 'Paper title must be at least 5 characters.';
  } else if (paperTitle.length > 500) {
    errors.paperTitle = 'Paper title cannot exceed 500 characters.';
  }

  const authorName = typeof data.authorName === 'string' ? data.authorName.trim() : '';
  if (!authorName || authorName.length < 2) {
    errors.authorName = 'Author name must be at least 2 characters.';
  }

  const authorEmail = typeof data.authorEmail === 'string' ? data.authorEmail.trim().toLowerCase() : '';
  if (!isValidEmail(authorEmail)) {
    errors.authorEmail = 'Please provide a valid author email address.';
  }

  const abstract = typeof data.abstract === 'string' ? data.abstract.trim() : '';
  if (!abstract || abstract.length < 30) {
    errors.abstract = 'Abstract must be at least 30 characters.';
  } else if (abstract.length > 8000) {
    errors.abstract = 'Abstract cannot exceed 8000 characters.';
  }

  const manuscriptFileUrl = typeof data.manuscriptFileUrl === 'string' ? data.manuscriptFileUrl.trim() : '';
  if (!manuscriptFileUrl) {
    errors.manuscriptFileUrl = 'Manuscript file is required.';
  }

  if (Object.keys(errors).length > 0) {
    return { success: false, errors, error: Object.values(errors)[0] };
  }

  return {
    success: true,
    data: {
      paperTitle,
      authorName,
      authorEmail,
      authorPhone: data.authorPhone ? String(data.authorPhone).trim() : null,
      affiliation: data.affiliation ? String(data.affiliation).trim() : null,
      coAuthors: data.coAuthors ? String(data.coAuthors).trim() : null,
      abstract,
      keywords: data.keywords ? String(data.keywords).trim() : null,
      researchArea: data.researchArea ? String(data.researchArea).trim() : 'General Business Economics',
      manuscriptFileUrl,
    },
  };
}

export interface OrderItemInput {
  id: number | string;
  title: string;
  price: number;
  quantity: number;
}

export interface OrderInput {
  subscriberName: string;
  organization?: string | null;
  email: string;
  phone: string;
  address: string;
  city?: string | null;
  state?: string | null;
  pincode?: string | null;
  paymentMode: string;
  notes?: string | null;
  items: OrderItemInput[];
}

export function validateOrderInput(data: any): ValidationResult<OrderInput> {
  if (!data || typeof data !== 'object') {
    return { success: false, error: 'Invalid request payload.' };
  }

  const errors: Record<string, string> = {};

  const subscriberName = typeof data.subscriberName === 'string' ? data.subscriberName.trim() : '';
  if (!subscriberName || subscriberName.length < 2) {
    errors.subscriberName = 'Subscriber name is required (at least 2 characters).';
  }

  const email = typeof data.email === 'string' ? data.email.trim().toLowerCase() : '';
  if (!isValidEmail(email)) {
    errors.email = 'Please provide a valid email address.';
  }

  const phone = typeof data.phone === 'string' ? data.phone.trim() : '';
  if (!isValidPhone(phone)) {
    errors.phone = 'Please provide a valid phone number.';
  }

  const address = typeof data.address === 'string' ? data.address.trim() : '';
  if (!address || address.length < 5) {
    errors.address = 'A valid delivery address is required.';
  }

  const rawItems = Array.isArray(data.items) ? data.items : [];
  if (rawItems.length === 0) {
    errors.items = 'Shopping cart cannot be empty.';
  }

  const items: OrderItemInput[] = [];
  for (const it of rawItems) {
    if (!it || typeof it !== 'object') continue;
    const qty = Math.max(1, Math.min(50, Number(it.quantity) || 1));
    const price = Math.max(0, Number(it.price) || 0);
    const title = typeof it.title === 'string' ? it.title.trim().slice(0, 200) : 'Item';
    items.push({
      id: it.id,
      title,
      price,
      quantity: qty,
    });
  }

  if (items.length === 0) {
    errors.items = 'Cart does not contain valid items.';
  }

  if (Object.keys(errors).length > 0) {
    return { success: false, errors, error: Object.values(errors)[0] };
  }

  return {
    success: true,
    data: {
      subscriberName,
      organization: data.organization ? String(data.organization).trim() : null,
      email,
      phone,
      address,
      city: data.city ? String(data.city).trim() : null,
      state: data.state ? String(data.state).trim() : null,
      pincode: data.pincode ? String(data.pincode).trim() : null,
      paymentMode: data.paymentMode ? String(data.paymentMode).trim() : 'UPI / Net Banking',
      notes: data.notes ? String(data.notes).trim() : null,
      items,
    },
  };
}
