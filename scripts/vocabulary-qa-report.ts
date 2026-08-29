import { contentProvenanceBatches } from "../src/data/content-provenance";
import { vocabulary } from "../src/data/vocabulary";
import { masterVocabularySources } from "../src/data/vocabulary/master-sources";
import { auditVocabulary, deterministicVocabularySample } from "../src/lib/content/vocabulary-audit";
import type { CEFRLevel, VocabularyItem } from "../src/types/domain";

const levels: CEFRLevel[] = ["A1", "A2", "B1", "B2", "C1", "C2"];
const levelArgument = process.argv.find((argument) => argument.startsWith("--level="))?.split("=")[1] as CEFRLevel | undefined;
const includeDetails = process.argv.includes("--details");
const includeRecords = process.argv.includes("--records");
const offset = Number(process.argv.find((argument) => argument.startsWith("--offset="))?.split("=")[1] ?? 0);
const limitArgument = process.argv.find((argument) => argument.startsWith("--limit="))?.split("=")[1];
if (levelArgument && !levels.includes(levelArgument)) throw new Error(`Unsupported CEFR level: ${levelArgument}`);

const normalize = (value: string) => value.toLocaleLowerCase().replace(/[^\p{L}\p{N}]+/gu, " ").trim();
const wordCount = (value: string) => normalize(value).split(/\s+/).filter(Boolean).length;
const levelItems = levelArgument ? vocabulary.filter((item) => item.cefrLevel === levelArgument) : vocabulary;
const limit = limitArgument ? Number(limitArgument) : levelItems.length;
if (!Number.isInteger(offset) || offset < 0 || !Number.isInteger(limit) || limit < 1) throw new Error("Offset and limit must be positive integers");
const selected = levelItems.slice(offset, offset + limit);
const audit = auditVocabulary(selected, {
  knownProvenanceIds: new Set(contentProvenanceBatches.map((batch) => batch.id)),
  knownSourceIds: new Set(masterVocabularySources.map((source) => source.id)),
});

interface SemanticCandidate { id: string; reason: string }
const semanticCandidates: SemanticCandidate[] = [];
const flag = (items: VocabularyItem[], reason: string) => {
  for (const item of items) semanticCandidates.push({ id: item.id, reason });
};

flag(selected.filter((item) => wordCount(item.meanings[0]?.definition ?? "") < 3), "definition has fewer than three words");
flag(selected.filter((item) => wordCount(item.examples[0] ?? "") < 4), "example has fewer than four words");
flag(selected.filter((item) => {
  const example = item.examples[0]?.trim() ?? "";
  return example && !/[.!?][\"')\]]?$/.test(example);
}), "example lacks terminal punctuation");
flag(selected.filter((item) => {
  const definition = normalize(item.meanings[0]?.definition ?? "");
  const example = normalize(item.examples[0] ?? "");
  return definition.length > 0 && definition === example;
}), "example duplicates the definition");
flag(selected.filter((item) => normalize(item.meanings[0]?.vietnamese ?? "") === normalize(item.word)), "Vietnamese meaning repeats the English headword");
flag(selected.filter((item) => /^(?:if|when) you\b|^(?:someone|something) (?:who|that)\b/i.test(item.examples[0]?.trim() ?? "")), "example reads like a definition template");

const blockerCounts = {
  duplicateIds: audit.duplicateIds.length,
  duplicateLexicalUnits: audit.duplicateLexicalUnits.length,
  missingFields: audit.missingFields.length,
  invalidPartsOfSpeech: audit.invalidPartsOfSpeech.length,
  invalidCefr: audit.invalidCefr.length,
  invalidFrequencyMetadata: audit.invalidFrequencyMetadata.length,
  invalidLifecycleStates: audit.invalidLifecycleStates.length,
  brokenProvenance: audit.brokenProvenance.length,
  placeholderText: audit.placeholderText.length,
  malformedText: audit.malformedText.length,
  duplicateExamples: audit.duplicateExamples.length,
  exampleTargetMissing: audit.exampleTargetMissing.length,
  posDefinitionMismatches: audit.posDefinitionMismatches.length,
};
const semanticCandidateIds = new Set(semanticCandidates.map((candidate) => candidate.id));
const summarizeItem = (item: VocabularyItem) => ({
  id: item.id,
  word: item.word,
  partOfSpeech: item.partOfSpeech,
  definition: item.meanings[0]?.definition,
  vietnamese: item.meanings[0]?.vietnamese,
  example: item.examples[0],
  topic: item.topics?.[0],
});

console.log(JSON.stringify({
  scope: levelArgument ?? "ALL",
  checked: selected.length,
  firstEntry: selected[0]?.id ?? null,
  lastEntry: selected.at(-1)?.id ?? null,
  nextEntry: levelItems[offset + selected.length]?.id ?? null,
  blockerCounts,
  ...(includeDetails ? { blockers: Object.fromEntries(Object.entries(audit).filter(([key]) => key in blockerCounts)) } : {}),
  reviewCandidates: {
    semanticByReason: Object.fromEntries([...new Set(semanticCandidates.map((candidate) => candidate.reason))].map((reason) => [reason, semanticCandidates.filter((candidate) => candidate.reason === reason).length])),
    repeatedDefinitions: audit.duplicateCandidates.length,
    repeatedVietnameseGroups: audit.repeatedVietnameseCandidates.length,
    ...(includeDetails ? {
      semantic: semanticCandidates,
      semanticCandidateRecords: selected.filter((item) => semanticCandidateIds.has(item.id)).map(summarizeItem),
      deterministicSample: (levelArgument ? deterministicVocabularySample(selected, levelArgument, 50) : []).map(summarizeItem),
      repeatedDefinitionDetails: audit.duplicateCandidates,
      repeatedVietnameseDetails: audit.repeatedVietnameseCandidates,
    } : {}),
  },
  ...(includeRecords ? { records: selected.map(summarizeItem) } : {}),
}, null, 2));

if (Object.values(blockerCounts).some((count) => count > 0)) process.exitCode = 1;
