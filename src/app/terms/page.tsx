import Link from "next/link";
import { LegalPage } from "@/components/legal-page";
export default function TermsPage() { return <LegalPage title="Terms of use" updated="23 August 2026">
  <section><h2 className="text-lg font-extrabold">The service</h2><p>English Mastery provides adaptive English practice and educational content. Results, mastery estimates, and CEFR estimates are study guidance, not accredited qualifications or guarantees of proficiency.</p></section>
  <section><h2 className="text-lg font-extrabold">Your responsibilities</h2><p>Provide accurate account information, protect your credentials, use the service lawfully, and do not attempt to disrupt the service or access another learner&apos;s data. You are responsible for reviewing imported backups before replacing account data.</p></section>
  <section><h2 className="text-lg font-extrabold">Availability and content</h2><p>The software may change and may be unavailable during maintenance. Educational content should undergo editorial and licensing review before a public release. Do not rely on the service as the only copy of important information; use the export feature.</p></section>
  <section><h2 className="text-lg font-extrabold">Launch requirements</h2><p>These are transparent placeholder terms for the repository. The service operator must obtain appropriate legal review, identify itself, provide contact and governing-law details, and establish support and takedown processes before accepting real users.</p></section>
  <p><Link className="font-bold text-[#17795b] underline" href="/attribution">Content attribution and licenses</Link></p>
</LegalPage>; }
