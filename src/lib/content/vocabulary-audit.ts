import type { CEFRLevel, VocabularyItem } from "@/types/domain";

const levels: CEFRLevel[] = ["A1", "A2", "B1", "B2", "C1", "C2"];
const normalize = (value: string) => value.toLocaleLowerCase().replace(/[^\p{L}\p{N}]+/gu, " ").trim();
const tokens = (value: string) => new Set(normalize(value).split(/\s+/).filter((token) => token.length > 2));
const similarity = (left: string, right: string) => {
  const a = tokens(left); const b = tokens(right); const union = new Set([...a, ...b]);
  return union.size ? [...a].filter((token) => b.has(token)).length / union.size : 0;
};
const deterministicKey = (value: string) => [...value].reduce((hash, character) => Math.imul(hash ^ character.charCodeAt(0), 16_777_619) >>> 0, 2_166_136_261);
const countBy = <T>(values: T[], keys: string[], key: (value: T) => string) => Object.fromEntries(keys.map((candidate) => [candidate, values.filter((value) => key(value) === candidate).length]));
const deterministicItems = (items: VocabularyItem[], salt: string, requested: number) => [...items].sort((a, b) => deterministicKey(`${salt}:${a.id}`) - deterministicKey(`${salt}:${b.id}`) || a.id.localeCompare(b.id)).slice(0, requested);
const exampleContainsTarget = (item: VocabularyItem) => {
  const lemma = normalize(item.lemma ?? item.word).replaceAll(" ", "");
  const forms = item.examples.flatMap((example) => normalize(example).split(" "));
  const stem = lemma.endsWith("y") ? lemma.slice(0, -1) : lemma.endsWith("e") ? lemma.slice(0, -1) : lemma;
  const irregular: Record<string, string[]> = { buy: ["bought"] };
  return forms.some((form) => form === lemma || form.startsWith(stem) || (irregular[lemma] ?? []).includes(form));
};

export interface VocabularyDuplicateCandidate { firstId: string; secondId: string; reason: string; similarity: number }

export function findVocabularyDuplicateCandidates(items: VocabularyItem[]): VocabularyDuplicateCandidate[] {
  const candidates: VocabularyDuplicateCandidate[] = [];
  for (let left = 0; left < items.length; left += 1) {
    for (let right = left + 1; right < items.length; right += 1) {
      const a = items[left]; const b = items[right];
      const sameLexicalUnit = normalize(a.lemma ?? a.word) === normalize(b.lemma ?? b.word) && normalize(a.partOfSpeech) === normalize(b.partOfSpeech);
      const sameDefinition = normalize(a.meanings[0]?.definition ?? "") === normalize(b.meanings[0]?.definition ?? "");
      if (!sameLexicalUnit && !sameDefinition) continue;
      const score = similarity(a.meanings[0]?.definition ?? "", b.meanings[0]?.definition ?? "");
      if (sameDefinition || score >= 0.72) candidates.push({ firstId: a.id, secondId: b.id, reason: sameDefinition ? "different lexical units with an identical definition" : "same lemma/POS with near-identical definitions", similarity: Number(score.toFixed(2)) });
    }
  }
  return candidates;
}

export function deterministicVocabularySample(items: VocabularyItem[], level: CEFRLevel, requested = 100): VocabularyItem[] {
  return deterministicItems(items.filter((item) => item.cefrLevel === level), level, requested);
}

export function auditVocabulary(items: VocabularyItem[]) {
  const duplicateCandidates = findVocabularyDuplicateCandidates(items);
  const duplicateExamples = [...new Map(items.flatMap((item) => item.examples.map((example) => [normalize(example), item.id] as const)).filter(([example], index, all) => all.findIndex(([candidate]) => candidate === example) !== index)).entries()].map(([example, id]) => ({ id, example }));
  const missingFields = items.flatMap((item) => [
    !item.lemma?.trim() && "lemma", !item.partOfSpeech.trim() && "partOfSpeech", !item.meanings[0]?.definition.trim() && "definition",
    !item.meanings[0]?.vietnamese?.trim() && "vietnamese", !item.examples[0]?.trim() && "example", !item.frequencyBand && "frequencyBand",
    !item.topics?.length && "topic", !item.provenanceId.trim() && "provenance",
  ].filter(Boolean).map((field) => ({ id: item.id, field })));
  const samples = Object.fromEntries(levels.map((level) => [level, deterministicVocabularySample(items, level).map((item) => item.id)]));
  const partsOfSpeech = [...new Set(items.map((item) => item.partOfSpeech))].sort();
  const topics = [...new Set(items.flatMap((item) => item.topics ?? []))].sort();
  const frequencyBands = ["very-common", "common", "less-common", "advanced"];
  const edgeCategories = {
    polysemous: items.filter((item) => item.meanings.length > 1),
    verbLike: items.filter((item) => item.partOfSpeech === "verb" || item.partOfSpeech === "phrase"),
    advanced: items.filter((item) => item.cefrLevel === "C1" || item.cefrLevel === "C2"),
    withSynonyms: items.filter((item) => item.synonyms.length > 0),
    withAntonyms: items.filter((item) => item.antonyms.length > 0),
    withWordFamilies: items.filter((item) => item.wordFamily.length > 0),
    withMultipleCollocations: items.filter((item) => item.collocations.length > 1),
  };
  const edgeAudit = Object.fromEntries(Object.entries(edgeCategories).map(([category, candidates]) => [category, {
    available: candidates.length,
    audited: Math.min(50, candidates.length),
    ids: deterministicItems(candidates, `edge:${category}`, 50).map((item) => item.id),
  }]));
  const lexicalTargets = new Set(items.map((item) => normalize(item.word)));
  const relationTargets = items.flatMap((item) => [...item.synonyms, ...item.antonyms].map((relation) => normalize(relation.word)));
  return {
    total: items.length,
    byLevel: countBy(items, levels, (item) => item.cefrLevel),
    byPartOfSpeech: countBy(items, partsOfSpeech, (item) => item.partOfSpeech),
    byTopic: countBy(items, topics, (item) => item.topics?.[0] ?? "missing"),
    byFrequencyBand: countBy(items, frequencyBands, (item) => item.frequencyBand ?? "missing"),
    averageExamples: Number((items.reduce((sum, item) => sum + item.examples.length, 0) / Math.max(1, items.length)).toFixed(2)),
    relationCoverage: {
      synonyms: Number((items.filter((item) => item.synonyms.length).length / Math.max(1, items.length) * 100).toFixed(1)),
      antonyms: Number((items.filter((item) => item.antonyms.length).length / Math.max(1, items.length) * 100).toFixed(1)),
      wordFamilies: Number((items.filter((item) => item.wordFamily.length).length / Math.max(1, items.length) * 100).toFixed(1)),
      collocations: Number((items.filter((item) => item.collocations.length).length / Math.max(1, items.length) * 100).toFixed(1)),
    },
    relationTargets: {
      total: relationTargets.length,
      inCorpus: relationTargets.filter((target) => lexicalTargets.has(target)).length,
      externalLexicalStrings: relationTargets.filter((target) => !lexicalTargets.has(target)).length,
    },
    edgeAudit,
    duplicateCandidates,
    duplicateExamples,
    missingFields,
    exactFrequencyRanksClaimed: items.filter((item) => item.frequencyRank !== undefined).length,
    genericTopics: items.filter((item) => item.topics?.includes("general")).map((item) => item.id),
    posDefinitionMismatches: items.filter((item) => (item.partOfSpeech === "verb") !== normalize(item.meanings[0]?.definition ?? "").startsWith("to ")).map((item) => item.id),
    exampleTargetMissing: items.filter((item) => !exampleContainsTarget(item)).map((item) => item.id),
    cefrFrequencyMismatches: items.filter((item) => (item.cefrLevel === "A1" && item.frequencyBand !== "very-common") || (["C1", "C2"].includes(item.cefrLevel) && item.frequencyBand !== "advanced")).map((item) => item.id),
    samples,
    samplingGate: levels.every((level) => items.filter((item) => item.cefrLevel === level).length >= 100),
  };
}
