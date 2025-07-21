import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Zain Mughal",
  description: "Privacy Policy for Zain Mughal's portfolio website",
};

export default function PrivacyPage() {
  return (
    <Section className="pt-20">
      <Container className="max-w-4xl">
        <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
        
        <div className="prose prose-gray dark:prose-invert max-w-none">
          <p className="text-muted-foreground mb-6">
            Last updated: {new Date().toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
            <p className="text-muted-foreground">
              Welcome to Zain Mughal's portfolio website. This Privacy Policy explains how we collect, use, and protect your information when you visit our website.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. Information We Collect</h2>
            <p className="text-muted-foreground mb-4">
              We collect minimal information to ensure the best user experience:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Basic analytics data (page views, session duration)</li>
              <li>Device and browser information for compatibility</li>
              <li>Contact information when voluntarily provided through contact forms</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. How We Use Your Information</h2>
            <p className="text-muted-foreground mb-4">
              We use the collected information to:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Improve website functionality and user experience</li>
              <li>Respond to inquiries and communications</li>
              <li>Analyze website traffic and usage patterns</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. Data Protection</h2>
            <p className="text-muted-foreground">
              We implement appropriate security measures to protect your personal information. We do not sell, trade, or otherwise transfer your information to third parties without your consent.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. Cookies</h2>
            <p className="text-muted-foreground">
              This website uses cookies to enhance user experience. You can choose to disable cookies through your browser settings, though this may affect website functionality.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. Third-Party Services</h2>
            <p className="text-muted-foreground">
              We may use third-party services (such as analytics tools) that have their own privacy policies. We recommend reviewing their policies for more information.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">7. Your Rights</h2>
            <p className="text-muted-foreground mb-4">
              You have the right to:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Access your personal data</li>
              <li>Request correction of your data</li>
              <li>Request deletion of your data</li>
              <li>Opt-out of data collection</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">8. Contact Information</h2>
            <p className="text-muted-foreground">
              If you have questions about this Privacy Policy, please contact us through the contact form on this website.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">9. Changes to This Policy</h2>
            <p className="text-muted-foreground">
              We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated revision date.
            </p>
          </section>
        </div>
      </Container>
    </Section>
  );
}