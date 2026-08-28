import { LegalPage } from "@/components/legal-page";
import { masterVocabularySources } from "@/data/vocabulary/master-sources";

export default function AttributionPage() {
  return <LegalPage title="Content attribution" updated="28 August 2026">
    <section><h2 className="text-lg font-extrabold">English Mastery authored content</h2><p>Definitions, Vietnamese meanings, examples, grammar explanations, expressions, placement passages, and placement questions in the current enriched catalogue are repository-authored. Machine validation is not independent educator or translator review.</p></section>
    <section><h2 className="text-lg font-extrabold">Master vocabulary inventory</h2><p>The normalized 6,000-unit metadata inventory is distributed under <a className="font-bold text-[#17795b] underline" href="https://creativecommons.org/licenses/by-sa/4.0/">CC BY-SA 4.0</a>. It uses third-party metadata only; no third-party definitions, translations, examples, synonyms, antonyms, collocations, or WordNet synsets were copied into it.</p></section>
    <section><h2 className="text-lg font-extrabold">Sources and required credits</h2><ul className="mt-3 space-y-5">{masterVocabularySources.map((source) => <li key={source.id}><h3 className="font-extrabold"><a className="text-[#17795b] underline" href={source.canonicalUrl}>{source.name} {source.version}</a></h3><p>{source.attribution}</p><p className="muted text-xs">License: <a className="underline" href={source.licenseUrl}>{source.license}</a>. Fields used: {source.fieldsUsed.join(", ")}.</p></li>)}</ul></section>
    <section><h2 className="text-lg font-extrabold">Important scope note</h2><p>CEFR-J is a localized pedagogical profile, not an official Council of Europe word-to-level certification. NGSL-GR ranks are list-local evidence, not universal corpus ranks. Open English WordNet and Princeton WordNet were used only to check lemma and part-of-speech existence.</p></section>
  </LegalPage>;
}
