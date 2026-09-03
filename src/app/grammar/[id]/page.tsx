import Link from "next/link";
import { ArrowLeft, ArrowRight, CheckCircle2, XCircle } from "lucide-react";
import { notFound } from "next/navigation";
import { Badge, CefrBadge, PageHeader } from "@/components/ui";
import { queryGrammarLesson } from "@/lib/content/database";

export const dynamic = "force-dynamic";

export default async function GrammarLessonPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const lesson = await queryGrammarLesson(id);
  if (!lesson) notFound();

  return <>
    <PageHeader
      eyebrow="Grammar lesson"
      title={lesson.title}
      description={lesson.description}
      action={<Link href="/grammar" className="btn-secondary"><ArrowLeft size={17} aria-hidden="true"/>Grammar path</Link>}
    />

    <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(280px,.38fr)]">
      <article className="space-y-4">
        <section className="card p-5 sm:p-6">
          <div className="mb-4 flex flex-wrap gap-2"><CefrBadge level={lesson.level}/><Badge tone="neutral">{lesson.category}</Badge></div>
          <h2 className="text-xl font-[820] text-[var(--ink-strong)]">Explanation</h2>
          <p className="muted mt-3 leading-7">{lesson.explanation}</p>
        </section>

        <section className="card p-5 sm:p-6">
          <h2 className="text-xl font-[820] text-[var(--ink-strong)]">Form and rules</h2>
          <ul className="mt-4 space-y-2">{lesson.structures.map((structure) => <li key={structure} className="rounded-xl bg-[var(--surface-muted)] px-4 py-3 font-semibold">{structure}</li>)}</ul>
        </section>

        <section className="card p-5 sm:p-6">
          <h2 className="text-xl font-[820] text-[var(--ink-strong)]">Examples</h2>
          <div className="mt-4 space-y-3">{lesson.examples.map((example, index) => <div key={`${example.sentence}-${index}`} className="rounded-xl border border-[var(--line)] p-4"><p className="font-semibold text-[var(--ink-strong)]">{example.sentence}</p>{example.explanation && <p className="muted mt-1 text-sm leading-relaxed">{example.explanation}</p>}</div>)}</div>
        </section>

        <section className="card p-5 sm:p-6">
          <h2 className="text-xl font-[820] text-[var(--ink-strong)]">Common mistakes</h2>
          <div className="mt-4 space-y-3">{lesson.commonMistakes.map((mistake, index) => <div key={`${mistake.incorrect}-${index}`} className="rounded-xl border border-[var(--line)] p-4"><div className="flex items-start gap-2 text-sm"><XCircle className="mt-0.5 shrink-0 text-[var(--danger)]" size={17} aria-hidden="true"/><span className="line-through">{mistake.incorrect}</span></div><div className="mt-2 flex items-start gap-2 text-sm font-bold text-[var(--success)]"><CheckCircle2 className="mt-0.5 shrink-0" size={17} aria-hidden="true"/><span>{mistake.correct}</span></div><p className="muted mt-2 text-sm leading-relaxed">{mistake.explanation}</p></div>)}</div>
        </section>
      </article>

      <aside className="card p-5 lg:sticky lg:top-8">
        <div className="eyebrow">Lesson outline</div>
        <h2 className="mt-2 font-[820] text-[var(--ink-strong)]">What you will cover</h2>
        <ul className="mt-4 space-y-2 text-sm">{lesson.subtopics.map((subtopic) => <li key={subtopic.id} className="flex gap-2 rounded-lg bg-[var(--surface-muted)] px-3 py-2"><CheckCircle2 className="mt-0.5 shrink-0 text-[var(--brand)]" size={15} aria-hidden="true"/><span>{subtopic.title}</span></li>)}</ul>
        <Link href="/learn" className="btn-primary mt-5 w-full">Practice now <ArrowRight size={17} aria-hidden="true"/></Link>
      </aside>
    </div>
  </>;
}
