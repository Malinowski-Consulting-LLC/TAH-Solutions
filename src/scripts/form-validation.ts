/**
 * form-validation.ts
 *
 * Lightweight client-side validation and sanitization for the three
 * Google Forms-backed forms (contact, checklist, waitlist).
 *
 * Goals:
 *  - Catch obviously bad data before it ever leaves the browser
 *  - Sanitize strings (trim, strip control chars, normalize whitespace)
 *  - Show inline error messages with proper aria-live announcements
 *  - Block submission to the (hidden) Google Forms iframe when invalid
 *
 * Notes:
 *  - This is a UX + first-line-of-defense layer. Google Forms / Apps Script
 *    is the system of record and should also validate server-side.
 *  - We do NOT mutate the form's `value` directly until the user submits —
 *    this keeps the input reactive. Sanitization happens on submit.
 */

export type FieldName = 'name' | 'email' | 'message' | 'agency' | 'role' | 'service';

export type FieldRule = {
  required: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  // A human-friendly label for error messages ("Full Name", "Email", etc.)
  label: string;
  // Field-specific message overrides
  messages?: Partial<Record<ValidationError, string>>;
};

export type ValidationError = 'required' | 'tooShort' | 'tooLong' | 'format' | 'generic';

export type FieldErrors = Partial<Record<FieldName, string>>;

/**
 * Per-field rules. Each form imports this and passes the relevant subset.
 */
export const RULES: Record<FieldName, FieldRule> = {
  name: {
    required: true,
    minLength: 2,
    maxLength: 100,
    // Letters (incl. accents), spaces, hyphen, apostrophe, period, comma
    pattern: /^[\p{L}\s.'\-,\u2019]{2,}$/u,
    label: 'Full Name',
    messages: {
      required: 'Please enter your full name.',
      tooShort: 'Your name should be at least 2 characters.',
      tooLong: 'Your name should be 100 characters or fewer.',
      format: 'Names can include letters, spaces, hyphens, and apostrophes.',
    },
  },
  email: {
    required: true,
    minLength: 5,
    maxLength: 254, // RFC 5321 SMTP path limit
    // Pragmatic email pattern: local@domain.tld with no whitespace
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
    label: 'Email',
    messages: {
      required: 'Please enter your email address.',
      tooShort: 'That email looks too short.',
      tooLong: 'That email is too long.',
      format: 'Please enter a valid email address (e.g. you@agency.org).',
    },
  },
  message: {
    required: true,
    minLength: 10,
    maxLength: 5000,
    label: 'Message',
    messages: {
      required: 'Please tell us a bit about what you need.',
      tooShort: 'A few more details would help (at least 10 characters).',
      tooLong: 'Please keep your message under 5,000 characters.',
    },
  },
  agency: {
    required: false,
    maxLength: 200,
    pattern: /^[\p{L}\p{N}\s.,'&\-()]{0,}$/u,
    label: 'Agency Name',
    messages: {
      tooLong: 'Agency name should be 200 characters or fewer.',
      format: 'Agency name contains unsupported characters.',
    },
  },
  role: {
    required: false,
    maxLength: 100,
    label: 'Your Role',
    messages: {
      tooLong: 'Role should be 100 characters or fewer.',
    },
  },
  service: {
    required: false,
    maxLength: 100,
    label: 'Service of Interest',
    messages: {
      tooLong: 'Service selection is too long.',
    },
  },
};

/**
 * Sanitize a string for safe storage in Google Forms / Sheets.
 * - Trims leading/trailing whitespace
 * - Collapses runs of internal whitespace
 * - Strips all C0/C1 control characters (keeps \n, \r, \t)
 * - Lowercases email addresses
 */
export function sanitize(field: FieldName, raw: string): string {
  let value = (raw ?? '').toString();

  // Remove control chars except \n \r \t
  // eslint-disable-next-line no-control-regex
  value = value.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F-\u009F]/g, '');

  // Collapse whitespace runs (preserve leading \n for messages)
  if (field === 'message') {
    value = value.replace(/[ \t]+/g, ' '); // collapse spaces/tabs only
  } else {
    value = value.replace(/\s+/g, ' '); // collapse all whitespace
  }

  value = value.trim();

  if (field === 'email') value = value.toLowerCase();

  return value;
}

/**
 * Validate a single value against its rule.
 * Returns null when valid, or a user-friendly error message.
 */
export function validate(field: FieldName, raw: string): string | null {
  const rule = RULES[field];
  const value = sanitize(field, raw);
  const messages = rule.messages ?? {};

  if (rule.required && value.length === 0) {
    return messages.required ?? `${rule.label} is required.`;
  }

  // Optional + empty = valid
  if (!rule.required && value.length === 0) return null;

  if (rule.minLength !== undefined && value.length < rule.minLength) {
    return messages.tooShort ?? `${rule.label} must be at least ${rule.minLength} characters.`;
  }

  if (rule.maxLength !== undefined && value.length > rule.maxLength) {
    return messages.tooLong ?? `${rule.label} must be ${rule.maxLength} characters or fewer.`;
  }

  if (rule.pattern && !rule.pattern.test(value)) {
    return messages.format ?? `${rule.label} contains unsupported characters.`;
  }

  return null;
}

/**
 * Validate all fields for a form. Returns either { ok: true, values }
 * or { ok: false, errors }.
 */
export function validateForm(
  form: HTMLFormElement,
  fields: readonly FieldName[]
): { ok: true; values: Record<FieldName, string> } | { ok: false; errors: FieldErrors } {
  const errors: FieldErrors = {};
  const values = {} as Record<FieldName, string>;

  for (const field of fields) {
    const input = form.querySelector<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>(
      `[data-field="${field}"]`
    );
    if (!input) {
      // Field not present in this form — skip
      values[field] = '';
      continue;
    }
    const raw = input.value;
    const cleaned = sanitize(field, raw);
    const err = validate(field, raw);
    if (err) errors[field] = err;
    values[field] = cleaned;
  }

  if (Object.keys(errors).length > 0) {
    return { ok: false, errors };
  }
  return { ok: true, values };
}

/**
 * Display errors inline below each field, set aria-invalid, and
 * move focus to the first invalid field. Also wires an `input` listener
 * to clear errors as the user types.
 */
export function showErrors(form: HTMLFormElement, errors: FieldErrors): void {
  // Clear all previous errors first
  form.querySelectorAll<HTMLElement>('[data-field-error]').forEach((el) => {
    el.textContent = '';
    el.hidden = true;
  });
  form.querySelectorAll<HTMLElement>('[data-field]').forEach((el) => {
    el.removeAttribute('aria-invalid');
  });

  const firstField = Object.keys(errors)[0];
  let firstInvalid: HTMLElement | null = null;

  for (const [field, message] of Object.entries(errors)) {
    const input = form.querySelector<HTMLElement>(`[data-field="${field}"]`);
    if (!input) continue;
    input.setAttribute('aria-invalid', 'true');

    const errorEl = form.querySelector<HTMLElement>(`[data-field-error="${field}"]`);
    if (errorEl) {
      errorEl.textContent = message ?? '';
      errorEl.hidden = false;
    }

    if (!firstInvalid) firstInvalid = input;
  }

  // Focus the first invalid field for keyboard users
  if (firstInvalid) {
    firstInvalid.focus({ preventScroll: false });
    firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}

/**
 * Clear the error for a field as the user types. Wires input listeners
 * to the form's data-field inputs.
 */
export function clearOnInput(form: HTMLFormElement): void {
  form.querySelectorAll<HTMLElement>('[data-field]').forEach((input) => {
    const handler = () => {
      const field = input.getAttribute('data-field');
      if (!field) return;
      const errorEl = form.querySelector<HTMLElement>(`[data-field-error="${field}"]`);
      if (errorEl) {
        errorEl.textContent = '';
        errorEl.hidden = true;
      }
      input.removeAttribute('aria-invalid');
    };
    input.addEventListener('input', handler);
    input.addEventListener('change', handler);
  });
}

/**
 * Apply sanitized values back to the inputs after submit.
 * (We sanitize on submit to avoid annoying users mid-typing.)
 */
export function applySanitized(
  form: HTMLFormElement,
  values: Record<FieldName, string>
): void {
  for (const [field, cleaned] of Object.entries(values)) {
    const input = form.querySelector<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>(
      `[data-field="${field}"]`
    );
    if (input && input.tagName !== 'SELECT') {
      input.value = cleaned;
    }
  }
}
