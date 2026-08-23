import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return <section className="card mx-auto max-w-xl p-8 text-center"><div className="eyebrow">404 · Page not found</div><h1 className="mt-3 text-3xl font-extrabold">This lesson isn&apos;t here</h1><p className="muted mt-2">Return to your dashboard and continue with today&apos;s learning plan.</p><Link href="/" className="btn-primary mt-6"><ArrowLeft size={17}/>Back to dashboard</Link></section>;
}
