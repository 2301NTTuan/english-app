import Link from "next/link";
import { LegalPage } from "@/components/legal-page";
export default function PrivacyPage() { return <LegalPage title="Privacy notice" updated="23 August 2026">
  <section><h2 className="text-lg font-extrabold">What we store</h2><p>English Mastery stores account details (name, email, and a one-way password hash), authentication sessions, learning preferences, answers, mistakes, review schedules, placement results, progress, and learning activity needed to provide the service. Passwords and raw session tokens are not stored.</p></section>
  <section><h2 className="text-lg font-extrabold">Why we use it</h2><p>We use this information to authenticate you, sync progress, personalize study plans, schedule reviews, show learning history, secure the service, and diagnose operational problems. We do not claim to sell personal data or use it for advertising.</p></section>
  <section><h2 className="text-lg font-extrabold">Control and retention</h2><p>You can export learning data in Settings. Account deletion permanently removes the account and dependent learning records from the primary database. Operational backups may retain deleted records for a limited recovery window once a production backup policy is configured.</p></section>
  <section><h2 className="text-lg font-extrabold">Current status</h2><p>This repository is a production foundation, not a deployed service. Before public launch, the operator must publish contact details, named subprocessors, hosting region, backup retention, incident procedures, and any jurisdiction-specific rights and lawful bases.</p></section>
  <p><Link className="font-bold text-[#17795b] underline" href="/attribution">Content attribution and licenses</Link></p>
</LegalPage>; }
