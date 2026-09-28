import type { Metadata } from "next";
import { CONTACT } from "@/lib/company";
import { LegalPage, type LegalSection } from "@/components/site/legal-page";

export const metadata: Metadata = {
  title: "Privacy policy",
  description: "How TalentBridge collects, uses and protects information from website visitors, clients and consultants.",
  alternates: { canonical: "/privacy" },
};

const UPDATED = "September 28, 2026";

const SECTIONS: LegalSection[] = [
  {
    id: "overview",
    title: "Overview",
    body: (
      <>
        <p>
          TalentBridge (&ldquo;we&rdquo;, &ldquo;us&rdquo;) respects the privacy of everyone who visits our website, works with us as a client or partner, or joins our
          talent network as a consultant. This policy explains what information we collect, why we collect it, and the choices you have.
        </p>
        <p>
          It applies to information collected through this website and the partner workspace. It does not apply to information collected offline or through other
          channels, which may be covered by separate agreements.
        </p>
      </>
    ),
  },
  {
    id: "consent",
    title: "Consent",
    body: <p>By using our website you agree to the collection and use of information as described in this policy.</p>,
  },
  {
    id: "collect",
    title: "Information we collect",
    body: (
      <>
        <p>We only ask for personal information when we need it, and we tell you why at the point we ask.</p>
        <ul>
          <li>
            <strong>When you contact us or send a requisition:</strong> your name, company, work email, phone number, the roles you are hiring for and anything else
            you choose to include.
          </li>
          <li>
            <strong>When you create a partner account:</strong> your name, company name, business address, work email and phone number.
          </li>
          <li>
            <strong>When you apply to join our talent network:</strong> your contact details, resume, skills, work history, references and work authorization status.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "consultants",
    title: "Consultant and candidate information",
    body: (
      <>
        <p>
          Because we place consultants with clients, we handle some information with extra care. To verify eligibility we may collect work authorization documents,
          Form I-9 information and the results of background and reference checks, with your consent and as the law requires.
        </p>
        <p>
          Profiles shared with clients and staffing partners are redacted: your name and contact details are withheld until a client places a hold for a specific role.
          Verification documents are encrypted and shared only through time-limited links with the people who need them.
        </p>
      </>
    ),
  },
  {
    id: "use",
    title: "How we use your information",
    body: (
      <>
        <p>We use the information we collect to:</p>
        <ul>
          <li>Provide, operate and maintain our website and partner workspace</li>
          <li>Match consultants to client requirements and manage engagements</li>
          <li>Verify eligibility to work and complete required compliance checks</li>
          <li>Understand how our website is used and improve it</li>
          <li>Respond to enquiries and send service updates</li>
          <li>Send marketing communications, which you can opt out of at any time</li>
          <li>Detect and prevent fraud and misuse</li>
        </ul>
      </>
    ),
  },
  {
    id: "logs",
    title: "Log files",
    body: (
      <p>
        Like most websites, our servers keep standard log files. These record information such as IP address, browser type, internet service provider, date and time,
        referring and exit pages, and the number of clicks. We use this information to analyze trends, administer the site and understand how visitors move through it.
        It is not linked to information that identifies you personally.
      </p>
    ),
  },
  {
    id: "cookies",
    title: "Cookies",
    body: (
      <>
        <p>
          We use cookies to remember your preferences and to understand which pages are visited, so we can improve the experience. You can accept or decline
          non-essential cookies when you first visit, and you can disable cookies at any time in your browser settings. Some parts of the site may not work as
          expected without them.
        </p>
      </>
    ),
  },
  {
    id: "third-parties",
    title: "Third-party services",
    body: (
      <p>
        We use trusted providers for hosting, email, analytics and background screening. They process information on our behalf and only as we instruct. Other
        websites linked from ours have their own privacy policies, which we encourage you to read. We do not sell your personal information.
      </p>
    ),
  },
  {
    id: "retention",
    title: "Security and retention",
    body: (
      <p>
        We protect information with encryption in transit and at rest, access controls and regular review. We keep personal information only as long as needed for
        the purposes described here, or as required by law, and then delete or anonymize it.
      </p>
    ),
  },
  {
    id: "ccpa",
    title: "Your California privacy rights",
    body: (
      <>
        <p>If you are a California resident, you have the right to:</p>
        <ul>
          <li>Know the categories and specific pieces of personal information we have collected about you</li>
          <li>Request that we delete personal information we have collected about you</li>
          <li>Opt out of the sale or sharing of your personal information (we do not sell personal information)</li>
          <li>Correct inaccurate personal information</li>
        </ul>
        <p>We respond to verified requests within 45 days. We will not discriminate against you for exercising these rights.</p>
      </>
    ),
  },
  {
    id: "gdpr",
    title: "Your data protection rights",
    body: (
      <>
        <p>Depending on where you live, you may have the right to:</p>
        <ul>
          <li>
            <strong>Access</strong> a copy of your personal information
          </li>
          <li>
            <strong>Correct</strong> information you believe is inaccurate or incomplete
          </li>
          <li>
            <strong>Delete</strong> your personal information, in certain circumstances
          </li>
          <li>
            <strong>Restrict or object</strong> to how we process your information, in certain circumstances
          </li>
          <li>
            <strong>Receive</strong> your information in a portable format, or have it transferred to another organization
          </li>
        </ul>
        <p>We respond to requests within one month.</p>
      </>
    ),
  },
  {
    id: "children",
    title: "Children's information",
    body: (
      <p>
        Our website and services are intended for adults. We do not knowingly collect personal information from children under 13. If you believe a child has provided
        information to us, contact us and we will remove it promptly.
      </p>
    ),
  },
  {
    id: "changes",
    title: "Changes to this policy",
    body: <p>We may update this policy from time to time. The latest version will always be on this page, with the date it was last updated.</p>,
  },
  {
    id: "contact",
    title: "Contact us",
    body: (
      <p>
        To exercise your rights or ask a question about this policy, email{" "}
        <a href={`mailto:${CONTACT.email}`} className="font-medium text-brand underline underline-offset-4">
          {CONTACT.email}
        </a>{" "}
        or call{" "}
        <a href={`tel:${CONTACT.tel}`} className="font-medium text-brand underline underline-offset-4">
          {CONTACT.phone}
        </a>
        . Our head office is in {CONTACT.office}.
      </p>
    ),
  },
];

export default function PrivacyPage() {
  return <LegalPage title="Privacy policy" updated={UPDATED} sections={SECTIONS} />;
}
