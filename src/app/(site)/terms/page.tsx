import type { Metadata } from "next";
import Link from "next/link";
import { CONTACT } from "@/lib/company";
import { LegalPage, type LegalSection } from "@/components/site/legal-page";

export const metadata: Metadata = {
  title: "Terms of use",
  description: "The terms that apply when you use the TalentBridge website and partner workspace.",
  alternates: { canonical: "/terms" },
};

const UPDATED = "September 28, 2026";

const SECTIONS: LegalSection[] = [
  {
    id: "acceptance",
    title: "Acceptance of these terms",
    body: (
      <>
        <p>
          These terms govern your use of the TalentBridge website and partner workspace (together, the &ldquo;site&rdquo;). By using the site you agree to them. If you
          use the site on behalf of a company, you confirm you are authorized to accept these terms for that company.
        </p>
        <p>
          Staffing engagements themselves are governed by a separate written agreement, such as a master services agreement or partner agreement. If that agreement
          conflicts with these terms, the signed agreement applies.
        </p>
      </>
    ),
  },
  {
    id: "use",
    title: "Using the site",
    body: (
      <>
        <p>You may use the site to learn about our services, send requisitions, apply to join our talent network and, if you have an account, use the partner workspace.</p>
        <p>You agree not to:</p>
        <ul>
          <li>Copy, scrape or systematically download profiles or other content</li>
          <li>Use the site to build a competing database or service</li>
          <li>Attempt to access accounts, data or systems you are not authorized to use</li>
          <li>Interfere with the site&apos;s security or performance</li>
          <li>Submit information that is false, misleading or that you have no right to share</li>
        </ul>
      </>
    ),
  },
  {
    id: "accounts",
    title: "Partner accounts",
    body: (
      <p>
        Partner accounts are for approved staffing firms and clients. You are responsible for keeping your login details secure and for activity under your account.
        Tell us straight away if you suspect unauthorized use. We may suspend or close accounts that breach these terms.
      </p>
    ),
  },
  {
    id: "profiles",
    title: "Candidate profiles and confidentiality",
    body: (
      <>
        <p>
          Profiles in the partner workspace are confidential and provided only to evaluate consultants for genuine client requirements. Profiles are redacted, and
          identifying details are released only when you place a hold for a named client and role.
        </p>
        <p>You may share a profile only with the client it was requested for, and only for that role. You may not forward, publish or store profiles for any other purpose.</p>
      </>
    ),
  },
  {
    id: "non-circumvention",
    title: "Non-circumvention",
    body: (
      <p>
        Consultants introduced through TalentBridge must be engaged through TalentBridge. You agree not to contact, hire or engage a consultant you learned about
        through the site directly or through another party, except as set out in your signed agreement with us. This applies for 12 months after the consultant was
        introduced to you.
      </p>
    ),
  },
  {
    id: "holds",
    title: "Holds and submissions",
    body: (
      <p>
        A hold reserves a consultant for a named client for 48 hours and prevents other partners from submitting that consultant to the same client during that
        period. Holds do not guarantee a consultant&apos;s availability or a placement. Please release a hold as soon as a client passes on a consultant.
      </p>
    ),
  },
  {
    id: "content",
    title: "Our content",
    body: (
      <p>
        The site, including its text, design, graphics and software, belongs to TalentBridge or its licensors and is protected by intellectual property laws. You may
        view and print pages for your own business use. Any other use requires our written permission.
      </p>
    ),
  },
  {
    id: "submissions",
    title: "Information you submit",
    body: (
      <p>
        You are responsible for the accuracy of information you submit, including requisitions and applications. You give us permission to use it to provide our
        services, as described in our{" "}
        <Link href="/privacy" className="font-medium text-brand underline underline-offset-4">
          privacy policy
        </Link>
        .
      </p>
    ),
  },
  {
    id: "third-party",
    title: "Third-party links",
    body: <p>The site may link to websites we do not control. We are not responsible for their content or practices, and linking does not mean we endorse them.</p>,
  },
  {
    id: "disclaimer",
    title: "Disclaimer",
    body: (
      <p>
        We work hard to keep the site accurate and available, but it is provided &ldquo;as is&rdquo;. To the extent the law allows, we make no warranties about the
        site, including that it will be uninterrupted or error-free. Commitments about staffing services are set out in your signed agreement with us.
      </p>
    ),
  },
  {
    id: "liability",
    title: "Limitation of liability",
    body: (
      <p>
        To the extent the law allows, TalentBridge is not liable for indirect, incidental or consequential losses arising from your use of the site. This does not
        limit liability that cannot be limited by law.
      </p>
    ),
  },
  {
    id: "indemnity",
    title: "Indemnity",
    body: <p>You agree to indemnify TalentBridge against claims arising from your breach of these terms or your misuse of the site or of candidate information.</p>,
  },
  {
    id: "law",
    title: "Governing law",
    body: <p>These terms are governed by the laws of the State of Ohio. Disputes will be handled in the state or federal courts located in Ohio.</p>,
  },
  {
    id: "changes",
    title: "Changes to these terms",
    body: <p>We may update these terms from time to time. The latest version will always be on this page with the date it was last updated. Continuing to use the site means you accept the updated terms.</p>,
  },
  {
    id: "contact",
    title: "Contact us",
    body: (
      <p>
        Questions about these terms? Email{" "}
        <a href={`mailto:${CONTACT.email}`} className="font-medium text-brand underline underline-offset-4">
          {CONTACT.email}
        </a>{" "}
        or call{" "}
        <a href={`tel:${CONTACT.tel}`} className="font-medium text-brand underline underline-offset-4">
          {CONTACT.phone}
        </a>
        .
      </p>
    ),
  },
];

export default function TermsPage() {
  return <LegalPage title="Terms of use" updated={UPDATED} sections={SECTIONS} />;
}
