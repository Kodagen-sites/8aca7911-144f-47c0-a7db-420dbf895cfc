/**
 * Terms & Conditions — ships on EVERY generated site.
 *
 * Scaffold step: copy to app/terms/page.tsx (or app/(site)/terms/page.tsx
 * if route-grouped). Server Component — static legal text, no "use client".
 *
 * Restyle wrapper classes to brand tokens. Keep <Header/> + <Footer/> and the
 * structure. {company}, {email}, {jurisdiction} are wired from siteConfig.
 */
import type { Metadata } from "next";
import { siteConfig } from "@/content/site-config";

const company = siteConfig.company.name;
const email = siteConfig.company.email;
const jurisdiction = siteConfig.company.location;
const effectiveDate = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: `The terms that govern your use of the ${company} website.`,
};

export default function TermsPage() {
  return (
    <>
      <div className="mx-auto max-w-3xl px-5 pb-24 pt-32 md:px-8 md:pt-40">
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] opacity-60">Legal</p>
        <h1 className="mt-4 text-4xl font-light tracking-tight md:text-5xl">Terms &amp; Conditions</h1>
        <p className="mt-3 text-sm opacity-60">Effective {effectiveDate}</p>

        <div className="mt-12 space-y-8 leading-relaxed [&_h2]:text-xl [&_h2]:font-medium [&_h2]:mt-10 [&_h2]:mb-3 [&_p]:opacity-80 [&_li]:opacity-80 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-1">
          <p>
            These Terms &amp; Conditions govern your use of the {company} website. By accessing or
            using this site, you agree to these terms. If you do not agree, please do not use the
            site.
          </p>

          <div>
            <h2>Use of the website</h2>
            <p>
              You may use this website for lawful purposes only. You agree not to use it in any way
              that damages, disables, or impairs the site, or interferes with anyone else&rsquo;s use
              of it.
            </p>
          </div>

          <div>
            <h2>Intellectual property</h2>
            <p>
              All content on this website — text, graphics, logos, images, and design — is owned by
              {" "}{company} or its licensors and is protected by copyright and other laws. You may
              not reproduce, distribute, or create derivative works without our written permission.
            </p>
          </div>

          <div>
            <h2>Enquiries and submissions</h2>
            <p>
              Information submitted through contact or enquiry forms does not create a binding
              agreement. Any services are subject to a separate written agreement between you and
              {" "}{company}.
            </p>
          </div>

          <div>
            <h2>No warranties</h2>
            <p>
              This website is provided &ldquo;as is&rdquo; without warranties of any kind. We do not
              guarantee that the site will be uninterrupted, error-free, or free of harmful
              components, or that the content is accurate or complete.
            </p>
          </div>

          <div>
            <h2>Limitation of liability</h2>
            <p>
              To the fullest extent permitted by law, {company} is not liable for any indirect,
              incidental, or consequential damages arising from your use of this website.
            </p>
          </div>

          <div>
            <h2>Third-party links</h2>
            <p>
              This website may link to third-party sites. We are not responsible for the content
              or practices of those sites and provide the links for convenience only.
            </p>
          </div>

          <div>
            <h2>Changes to these terms</h2>
            <p>
              We may update these terms from time to time. The effective date above shows when they
              were last revised. Continued use of the site after changes means you accept the
              updated terms.
            </p>
          </div>

          <div>
            <h2>Governing law</h2>
            <p>These terms are governed by the laws applicable in {jurisdiction}.</p>
          </div>

          <div>
            <h2>Contact us</h2>
            <p>
              Questions about these terms? Email{" "}
              <a className="underline" href={`mailto:${email}`}>{email}</a>.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
