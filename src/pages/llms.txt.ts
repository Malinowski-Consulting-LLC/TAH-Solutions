/**
 * Dynamic llms.txt generator.
 * LLM-friendly site summary following the proposed llmstxt.org spec.
 * Helps LLM crawlers and assistants understand the site's purpose and offerings.
 */
import type { APIRoute } from 'astro';
import { SITE, CALENDAR, SERVICES } from '../consts';

export const GET: APIRoute = () => {
  const pdfUrl = `${SITE.url}/assets/TAH_Solutions_Protocol_Gap_Audit_Checklist_June26.pdf`;
  const calendarUrl = CALENDAR.bookingUrl;

  const text = `# ${SITE.name}

> ${SITE.description}

## Services

${SERVICES.map(
  (s) => `- [${s.title}](${SITE.url}/services#${s.id}): ${s.short}`
).join('\n')}

## Company

- [About ${SITE.name}](${SITE.url}/about): Mission, values, and founding principles.
- [Contact / Schedule a Consultation](${SITE.url}/contact): Free 30-minute discovery call to discuss your agency&rsquo;s needs.

## Resources

- [Free Protocol Gap Audit Checklist](${SITE.url}/checklist): 17 questions, 10 minutes, aligned with NAEMSP and AHA standards.
- [Download the Checklist PDF directly](${pdfUrl}): no email required.
- [EMS Clinical Infrastructure Course Waitlist](${SITE.url}/waitlist): 10 self-paced modules covering protocol design, QA/QI implementation, and standard of care infrastructure. (Coming soon.)

## Legal

- [Terms of Service](${SITE.url}/terms)
- [Privacy Policy](${SITE.url}/privacy)

## Important Disclaimers

${SITE.name} provides informational consulting services only. We do not provide medical advice or legal advice. Our deliverables should not be relied upon as a substitute for professional medical judgment, clinical decision-making, or legal counsel. EMS agencies and medical directors remain solely responsible for clinical decisions, protocol content, and regulatory compliance. ${SITE.name} does not collect Protected Health Information (PHI).

## Contact

- Email: ${SITE.email}
- Scheduling: [Book on Google Calendar](${calendarUrl}) (Central Time) or use the [contact form](${SITE.url}/contact).

## Built By

Site built and hosted by [${SITE.builtBy.name}](${SITE.builtBy.url}).
`;

  return new Response(text, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
};
