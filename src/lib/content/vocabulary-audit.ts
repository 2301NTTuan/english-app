import type { CEFRLevel, VocabularyItem } from "@/types/domain";

const levels: CEFRLevel[] = ["A1", "A2", "B1", "B2", "C1", "C2"];
const validLevels = new Set(levels);
const validPartsOfSpeech = new Set(["noun", "verb", "adjective", "adverb", "pronoun", "preposition", "conjunction", "determiner", "interjection", "modal", "auxiliary", "numeral", "particle", "phrase"]);
const validStatuses = new Set(["draft", "validated", "reviewed", "published", "retired"]);
const validFrequencyBands = new Set(["very-common", "common", "less-common", "advanced"]);
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
  const collapsedExamples = item.examples.map((example) => normalize(example).replaceAll(" ", ""));
  const forms = item.examples.flatMap((example) => normalize(example).split(" "));
  const stem = lemma.endsWith("y") ? lemma.slice(0, -1) : lemma.endsWith("e") ? lemma.slice(0, -1) : lemma;
  const irregular: Record<string, string[]> = { buy: ["bought"] };
  return collapsedExamples.some((example) => example.includes(lemma)) || forms.some((form) => form === lemma || form.startsWith(stem) || (irregular[lemma] ?? []).includes(form));
};

export interface VocabularyDuplicateCandidate { firstId: string; secondId: string; reason: string; similarity: number }
export interface VocabularyAuditOptions { knownProvenanceIds?: Set<string>; knownSourceIds?: Set<string> }

function duplicateGroups(items: VocabularyItem[], key: (item: VocabularyItem) => string) {
  const groups = new Map<string, VocabularyItem[]>();
  for (const item of items) {
    const value = key(item);
    const group = groups.get(value) ?? [];
    group.push(item);
    groups.set(value, group);
  }
  return [...groups.entries()].filter(([value, group]) => value && group.length > 1);
}

export function findVocabularyDuplicateCandidates(items: VocabularyItem[]): VocabularyDuplicateCandidate[] {
  const candidates: VocabularyDuplicateCandidate[] = [];
  const addPairs = (groups: [string, VocabularyItem[]][], reason: string) => {
    for (const [, group] of groups) {
      for (let left = 0; left < group.length; left += 1) {
        for (let right = left + 1; right < group.length; right += 1) {
          const a = group[left]; const b = group[right];
          candidates.push({ firstId: a.id, secondId: b.id, reason, similarity: Number(similarity(a.meanings[0]?.definition ?? "", b.meanings[0]?.definition ?? "").toFixed(2)) });
        }
      }
    }
  };
  addPairs(duplicateGroups(items, (item) => `${normalize(item.lemma ?? item.word)}:${normalize(item.partOfSpeech)}`), "same lemma/POS lexical unit");
  addPairs(duplicateGroups(items, (item) => normalize(item.meanings[0]?.definition ?? "")).filter(([, group]) => new Set(group.map((item) => `${normalize(item.lemma ?? item.word)}:${normalize(item.partOfSpeech)}`)).size > 1), "different lexical units with an identical definition");
  return candidates;
}

export function deterministicVocabularySample(items: VocabularyItem[], level: CEFRLevel, requested = 100): VocabularyItem[] {
  return deterministicItems(items.filter((item) => item.cefrLevel === level), level, requested);
}

export function auditVocabulary(items: VocabularyItem[], options: VocabularyAuditOptions = {}) {
  const duplicateCandidates = findVocabularyDuplicateCandidates(items);
  const duplicateIds = duplicateGroups(items, (item) => item.id).flatMap(([, group]) => group.map((item) => item.id));
  const duplicateLexicalUnits = duplicateGroups(items, (item) => `${normalize(item.lemma ?? item.word)}:${normalize(item.partOfSpeech)}`).map(([lexicalUnit, group]) => ({ lexicalUnit, ids: group.map((item) => item.id) }));
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
  const invalidPartsOfSpeech = items.filter((item) => !validPartsOfSpeech.has(normalize(item.partOfSpeech))).map((item) => item.id);
  const invalidCefr = items.filter((item) => !validLevels.has(item.cefrLevel)).map((item) => item.id);
  const invalidLifecycleStates = items.filter((item) => !validStatuses.has(item.status)).map((item) => item.id);
  const invalidFrequencyMetadata = items.filter((item) =>
    !item.frequencyBasis
    || !item.frequencyBand
    || !validFrequencyBands.has(item.frequencyBand)
    || (item.frequencyBasis === "editorial-band" && (item.frequencyRank !== undefined || item.frequencySourceId !== undefined))
    || (item.frequencyBasis === "source-backed-rank" && (!Number.isInteger(item.frequencyRank) || (item.frequencyRank ?? 0) < 1 || !item.frequencySourceId)),
  ).map((item) => item.id);
  const brokenProvenance = items.flatMap((item) => {
    const issues: { id: string; reference: string; reason: string }[] = [];
    if (options.knownProvenanceIds && !options.knownProvenanceIds.has(item.provenanceId)) issues.push({ id: item.id, reference: item.provenanceId, reason: "unknown primary provenance" });
    const knownReferences = new Set([...(options.knownProvenanceIds ?? []), ...(options.knownSourceIds ?? [])]);
    for (const reference of item.provenanceIds ?? []) if (knownReferences.size && !knownReferences.has(reference)) issues.push({ id: item.id, reference, reason: "unknown provenance reference" });
    if (item.cefrBasis === "source-backed" && (!item.cefrSourceId || (options.knownSourceIds && !options.knownSourceIds.has(item.cefrSourceId)))) issues.push({ id: item.id, reference: item.cefrSourceId ?? "", reason: "missing or unknown CEFR source" });
    if (item.frequencyBasis === "source-backed-rank" && (!item.frequencySourceId || (options.knownSourceIds && !options.knownSourceIds.has(item.frequencySourceId)))) issues.push({ id: item.id, reference: item.frequencySourceId ?? "", reason: "missing or unknown frequency source" });
    return issues;
  });
  const placeholderPattern = /\b(?:todo|tbd|placeholder|lorem ipsum|undefined|null)\b|\{\{|\[object object\]/iu;
  const malformedPattern = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\uFFFD]|\s{2,}|\s+[,.!?;:]|[!?.,]{3,}/u;
  const textFields = items.flatMap((item) => ([
    ["word", item.word], ["lemma", item.lemma ?? ""],
    ...item.meanings.flatMap((meaning) => [["definition", meaning.definition], ["vietnamese", meaning.vietnamese ?? ""]]),
    ...item.examples.map((example) => ["example", example]),
  ] as [string, string][]).map(([field, value]) => ({ id: item.id, field, value })));
  const placeholderText = textFields.filter(({ value }) => placeholderPattern.test(value)).map(({ id, field }) => ({ id, field }));
  const malformedText = textFields.filter(({ value }) => value !== value.trim() || malformedPattern.test(value)).map(({ id, field }) => ({ id, field }));
  const repeatedVietnameseCandidates = duplicateGroups(items, (item) => normalize(item.meanings[0]?.vietnamese ?? ""))
    .filter(([, group]) => group.length >= 5)
    .map(([vietnamese, group]) => ({ vietnamese, ids: group.map((item) => item.id) }));
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
    duplicateIds,
    duplicateLexicalUnits,
    duplicateCandidates,
    duplicateExamples,
    missingFields,
    invalidPartsOfSpeech,
    invalidCefr,
    invalidFrequencyMetadata,
    invalidLifecycleStates,
    brokenProvenance,
    placeholderText,
    malformedText,
    repeatedVietnameseCandidates,
    exactFrequencyRanksClaimed: items.filter((item) => item.frequencyRank !== undefined).length,
    genericTopics: items.filter((item) => item.topics?.includes("general")).map((item) => item.id),
    posDefinitionMismatches: items.filter((item) => (item.partOfSpeech === "verb") !== normalize(item.meanings[0]?.definition ?? "").startsWith("to ")).map((item) => item.id),
    exampleTargetMissing: items.filter((item) => !exampleContainsTarget(item)).map((item) => item.id),
    cefrFrequencyMismatches: items.filter((item) => item.frequencyBasis === "editorial-band" && ((item.cefrLevel === "A1" && item.frequencyBand !== "very-common") || (["C1", "C2"].includes(item.cefrLevel) && item.frequencyBand !== "advanced"))).map((item) => item.id),
    samples,
    samplingGate: levels.every((level) => items.filter((item) => item.cefrLevel === level).length >= 100),
  };
}
