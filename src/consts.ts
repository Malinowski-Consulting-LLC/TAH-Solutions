/**
 * TAH Solutions — Site Configuration
 * Single source of truth for site-wide values.
 * Used by layouts, pages, and dynamic routes.
 */

export const SITE = {
  name: 'TAH Solutions',
  shortName: 'TAH Solutions',
  domain: 'tahsolutions.com',
  url: 'https://tahsolutions.com',
  email: 'info@tahsolutions.com',
  description:
    'TAH Solutions helps EMS agencies build evidence-based protocol programs, implement QA/QI systems, and reduce clinical and legal liability.',
  tagline: 'Building clinical infrastructure for EMS agencies',
  copyrightYear: 2026,
  author: 'Nathaniel Malinowski',
  builtBy: {
    name: 'Malinowski Consulting, LLC',
    url: 'https://www.malinowskiconsulting.com/',
  },
} as const;

export const NAV = [
  { label: 'Home', href: '/' },
  { label: 'Services', href: '/services' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
  { label: 'Free Checklist', href: '/checklist' },
  { label: 'Course Waitlist', href: '/waitlist' },
] as const;

export const SERVICES = [
  {
    id: 'gap-analysis',
    number: '01',
    title: 'Protocol Gap Analysis',
    short: 'Comprehensive evaluation of your existing protocols against current EMS literature and evidence-based standards.',
    desc: 'We review your full protocol suite against NAEMSP and AHA guidelines, then deliver a risk-ranked report with revision recommendations. Typical engagement: 4-6 weeks.',
    deliverables: [
      'Full protocol suite review (medical, trauma, cardiac, operations)',
      'NAEMSP/AHA guidelines cross-reference',
      'Risk-prioritized findings (high/medium/low)',
      'Revision recommendations with citation',
      'Implementation roadmap for your team',
    ],
  },
  {
    id: 'qa-qi',
    number: '02',
    title: 'QA/QI Program Design',
    short: 'Build a quality assurance and quality improvement infrastructure that measures trends and drives clinical improvement.',
    desc: 'Most agencies have protocol binders, not programs. We design the measurement tools, trend analysis, and feedback loops that turn your QA process from compliance theater into a clinical improvement engine.',
    deliverables: [
      'Audit tool design (chart review, ePCR analysis)',
      'Trend measurement criteria and KPIs',
      'QA/QI committee charter and meeting cadence',
      'Feedback loop documentation',
      'Training for QA/QI coordinators',
    ],
  },
  {
    id: 'retainer',
    number: '03',
    title: 'Clinical Advisory Retainer',
    short: 'Ongoing clinical leadership support including monthly protocol review, QA/QI data trend reporting, and medical director communication coordination.',
    desc: 'For agencies that need sustained clinical leadership without a full-time hire. Monthly engagements cover protocol updates, trend review, and coordination with your medical director.',
    deliverables: [
      'Monthly protocol review (rolling 90-day window)',
      'QA/QI data trend analysis and reporting',
      'Medical director communication coordination',
      'On-call clinical consultation (business hours)',
      'Annual protocol suite audit',
    ],
  },
] as const;

export const STATS = [
  { number: '20', label: 'Question Gap Audit' },
  { number: '3', label: 'Service Tiers' },
  { number: '10', label: 'Course Modules' },
  { number: '$0', label: 'Cost to Start' },
] as const;

export const CALENDAR = {
  /** Public calendar link — opens in new tab when user clicks the button. */
  bookingUrl: 'https://calendar.google.com/calendar/u/1?cid=dGFubmVyQHRhaHNvbHV0aW9ucy5jb20',
  /** Embeddable calendar URL for iframe display on the contact page. */
  embedUrl: 'https://calendar.google.com/calendar/embed?src=tanner%40tahsolutions.com&ctz=America%2FChicago',
} as const;

/**
 * Google Forms configuration.
 * Contact form: live as of 2026-06-05.
 * Checklist + Waitlist: still placeholder — create forms and paste IDs.
 * See /aidlc-docs/guides/google-forms-setup.md for setup instructions.
 */
export const GOOGLE_FORMS = {
  contact: {
    formId: '1FAIpQLSfKvGL6YOtJ5R64jIKLAnfHOfkb5qbKbTJJUq9SF-mwH4wMrA',
    entries: {
      name: '625563590',
      email: '2059124889',
      agency: '1536999156',
      service: '574684906',
      message: '1517610226',
    },
  },
  checklist: {
    formId: '1FAIpQLSfDXBkKbAZtokyAA0n8afpKmDRmFz7W5G8kJ0rVi-bH00IOVg',
    entries: {
      name: '1339382883',
      email: '1760774176',
      agency: '2041488671',
      role: '1597583758',
    },
  },
  waitlist: {
    formId: '1FAIpQLSdqRSYM2PMu5c3kcrAsOSRCFbQGb3yu2Ju4D5kEtmkjA3BpAA',
    entries: {
      name: '23311471',
      email: '28228104',
      agency: '1809331866',
      role: '1677618602',
    },
  },
} as const;

/**
 * Build the Google Forms submission URL.
 */
export const googleFormActionUrl = (formId: string): string =>
  `https://docs.google.com/forms/d/e/${formId}/formResponse`;
