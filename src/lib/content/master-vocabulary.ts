import { readFileSync } from "node:fs";
import path from "node:path";
import { contentProvenanceBatches } from "@/data/content-provenance";
import { vocabulary } from "@/data/vocabulary";
import { masterVocabularySourceById } from "@/data/vocabulary/master-sources";
import type { CEFRLevel, ContentStatus, FrequencyBand } from "@/types/domain";

export type MasterFrequencyBasis = "source-backed-rank" | "editorial-band";
export interface MasterVocabularyRecord {
  id: string;
  lemma: string;
  partOfSpeech: string;
  cefrLevel: CEFRLevel;
  cefrBasis: "source-backed" | "editorial-estimate";
  cefrSourceId?: string;
  frequencyBand: FrequencyBand;
  frequencyBasis: MasterFrequencyBasis;
  frequencySourceId?: string;
  frequencyRank?: number;
  provenanceIds: string[];
  status: ContentStatus;
  spellingVariants: string[];
}

const expectedHeader = ["id", "lemma", "part_of_speech", "cefr_level", "cefr_basis", "cefr_source_id", "frequency_band", "frequency_basis", "frequency_source_id", "frequency_rank", "provenance_ids", "spelling_variants", "status"];
const levels: CEFRLevel[] = ["A1", "A2", "B1", "B2", "C1", "C2"];
const statuses: ContentStatus[] = ["draft", "validated", "reviewed", "published", "retired"];
const frequencyBands: FrequencyBand[] = ["very-common", "common", "less-common", "advanced"];
const partsOfSpeech = new Set(["adjective", "adverb", "conjunction", "determiner", "interjection", "modal", "noun", "numeral", "particle", "preposition", "pronoun", "verb"]);
const cefrSourceIds = new Set(["cefrj-1.5", "octanove-c1c2-1.0"]);
const masterPath = path.join(process.cwd(), "src/data/vocabulary/master-inventory.tsv");

export function loadMasterVocabularyInventory(filePath = masterPath): MasterVocabularyRecord[] {
  const lines = readFileSync(filePath, "utf8").split(/\r?\n/).filter(Boolean);
  const header = lines.shift()?.split("\t") ?? [];
  if (header.join("\t") !== expectedHeader.join("\t")) throw new Error(`Unexpected master vocabulary header: ${header.join(",")}`);
  return lines.map((line, index) => {
    const columns = line.split("\t");
    if (columns.length !== expectedHeader.length) throw new Error(`Master vocabulary line ${index + 2} has ${columns.length} columns; expected ${expectedHeader.length}`);
    const [id, lemma, partOfSpeech, cefrLevel, cefrBasis, cefrSourceId, frequencyBand, frequencyBasis, frequencySourceId, rank, provenanceIds, spellingVariants, status] = columns;
    return {
      id, lemma, partOfSpeech, cefrLevel: cefrLevel as CEFRLevel, cefrBasis: cefrBasis as MasterVocabularyRecord["cefrBasis"],
      cefrSourceId: cefrSourceId || undefined, frequencyBand: frequencyBand as FrequencyBand, frequencyBasis: frequencyBasis as MasterFrequencyBasis,
      frequencySourceId: frequencySourceId || undefined, frequencyRank: rank ? Number(rank) : undefined,
      provenanceIds: provenanceIds ? provenanceIds.split(",") : [], status: status as ContentStatus,
      spellingVariants: spellingVariants ? spellingVariants.split(",") : [],
    };
  });
}

export interface MasterVocabularyAudit {
  total: number;
  byLevel: Record<CEFRLevel, number>;
  byPartOfSpeech: Record<string, number>;
  sourceBackedCefr: number;
  editorialCefr: number;
  sourceBackedFrequency: number;
  editorialFrequency: number;
  exactDuplicateIds: string[];
  exactDuplicateLexicalUnits: string[];
  lemmasWithMultiplePartsOfSpeech: number;
  unresolvedProvenanceIssues: string[];
  suspiciousCefrAssignments: string[];
  missingExistingIds: string[];
  existingMetadataMismatches: string[];
  errors: string[];
  qualityGate: boolean;
}

const duplicates = (values: string[]) => [...new Set(values.filter((value, index) => values.indexOf(value) !== index))];
const lexicalKey = (record: Pick<MasterVocabularyRecord, "lemma" | "partOfSpeech">) => `${record.lemma.toLocaleLowerCase()}:${record.partOfSpeech.toLocaleLowerCase()}`;
const countBy = <T>(items: T[], key: (item: T) => string) => Object.fromEntries([...new Set(items.map(key))].sort().map((candidate) => [candidate, items.filter((item) => key(item) === candidate).length]));

export function auditMasterVocabularyInventory(records = loadMasterVocabularyInventory()): MasterVocabularyAudit {
  const errors: string[] = [];
  const exactDuplicateIds = duplicates(records.map((record) => record.id));
  const exactDuplicateLexicalUnits = duplicates(records.map(lexicalKey));
  const sourceIds = new Set([...masterVocabularySourceById.keys(), ...contentProvenanceBatches.map((batch) => batch.id)]);
  const recordById = new Map(records.map((record) => [record.id, record]));
  const recordByLexicalKey = new Map(records.map((record) => [lexicalKey(record), record]));
  const unresolvedProvenanceIssues: string[] = [];
  const suspiciousCefrAssignments: string[] = [];

  for (const record of records) {
    const key = `master vocabulary ${record.id}`;
    if (!record.id || !/^[a-z0-9-]+$/.test(record.id)) errors.push(`${key}: invalid stable ID`);
    if (!record.lemma || !/^[a-z]+(?:[-'][a-z]+)*$/.test(record.lemma)) errors.push(`${key}: invalid normalized lemma`);
    if (!partsOfSpeech.has(record.partOfSpeech)) errors.push(`${key}: unsupported part of speech`);
    if (!levels.includes(record.cefrLevel)) errors.push(`${key}: invalid CEFR level`);
    if (!["source-backed", "editorial-estimate"].includes(record.cefrBasis)) errors.push(`${key}: invalid CEFR basis`);
    if (!frequencyBands.includes(record.frequencyBand)) errors.push(`${key}: invalid frequency band`);
    if (!["source-backed-rank", "editorial-band"].includes(record.frequencyBasis)) errors.push(`${key}: invalid frequency basis`);
    if (!statuses.includes(record.status)) errors.push(`${key}: invalid status`);
    if (!record.provenanceIds.length) unresolvedProvenanceIssues.push(`${key}: no provenance`);
    for (const sourceId of record.provenanceIds) if (!sourceIds.has(sourceId)) unresolvedProvenanceIssues.push(`${key}: unknown provenance ${sourceId}`);
    if (record.cefrBasis === "source-backed" && (!record.cefrSourceId || !cefrSourceIds.has(record.cefrSourceId))) unresolvedProvenanceIssues.push(`${key}: invalid source-backed CEFR reference`);
    if (record.cefrSourceId && !record.provenanceIds.includes(record.cefrSourceId)) unresolvedProvenanceIssues.push(`${key}: CEFR source missing from provenance`);
    if (record.cefrBasis === "editorial-estimate" && record.cefrSourceId) errors.push(`${key}: editorial CEFR must not claim a source`);
    if (record.frequencyBasis === "source-backed-rank" && (!record.frequencySourceId || record.frequencySourceId !== "ngsl-gr-1.0" || !Number.isInteger(record.frequencyRank) || record.frequencyRank! < 1 || record.frequencyRank! > 5_050)) unresolvedProvenanceIssues.push(`${key}: invalid source-backed frequency rank`);
    if (record.frequencySourceId && !record.provenanceIds.includes(record.frequencySourceId)) unresolvedProvenanceIssues.push(`${key}: frequency source missing from provenance`);
    if (record.frequencyBasis === "source-backed-rank" && record.frequencyRank) {
      const expectedBand: FrequencyBand = record.frequencyRank <= 1_500 ? "very-common" : record.frequencyRank <= 3_500 ? "common" : "less-common";
      if (record.frequencyBand !== expectedBand) errors.push(`${key}: NGSL-GR rank and frequency band disagree`);
    }
    if (record.frequencyBasis === "editorial-band" && (record.frequencySourceId || record.frequencyRank !== undefined)) errors.push(`${key}: editorial frequency must not claim a source or exact rank`);
    if ((record.cefrLevel === "C1" || record.cefrLevel === "C2") && record.frequencyBand === "very-common") suspiciousCefrAssignments.push(`${record.id}: ${record.cefrLevel} with very-common frequency`);
    if (record.spellingVariants.some((variant) => !/^[a-z]+(?:[-'][a-z]+)*$/.test(variant) || variant === record.lemma) || new Set(record.spellingVariants).size !== record.spellingVariants.length) errors.push(`${key}: invalid spelling variant`);
    for (const variant of record.spellingVariants) if (recordByLexicalKey.has(`${variant}:${record.partOfSpeech}`)) errors.push(`${key}: spelling variant ${variant} is also counted as a separate lexical unit`);
  }
  if (exactDuplicateIds.length) errors.push(`duplicate master IDs: ${exactDuplicateIds.join(", ")}`);
  if (exactDuplicateLexicalUnits.length) errors.push(`duplicate master lexical units: ${exactDuplicateLexicalUnits.join(", ")}`);

  const missingExistingIds = vocabulary.map((item) => item.id).filter((id) => !recordById.has(id));
  const existingMetadataMismatches = vocabulary.flatMap((item) => {
    const record = recordById.get(item.id); if (!record) return [];
    const expectedLemma = (item.lemma ?? item.word).toLocaleLowerCase();
    return record.lemma !== expectedLemma || record.partOfSpeech !== item.partOfSpeech || record.cefrLevel !== item.cefrLevel
      ? [`${item.id}: enriched ${expectedLemma}/${item.partOfSpeech}/${item.cefrLevel} vs master ${record.lemma}/${record.partOfSpeech}/${record.cefrLevel}`] : [];
  });
  if (missingExistingIds.length) errors.push(`missing existing vocabulary IDs: ${missingExistingIds.join(", ")}`);
  if (existingMetadataMismatches.length) errors.push(`existing vocabulary metadata mismatches: ${existingMetadataMismatches.join("; ")}`);
  const a1Records = records.filter((record) => record.cefrLevel === "A1");
  const a1VeryCommonShare = a1Records.filter((record) => record.frequencyBand === "very-common").length / Math.max(1, a1Records.length);
  if (a1VeryCommonShare < 0.9) suspiciousCefrAssignments.push(`A1 very-common share ${(a1VeryCommonShare * 100).toFixed(1)}% is below 90%`);
  if (unresolvedProvenanceIssues.length) errors.push(`unresolved provenance issues: ${unresolvedProvenanceIssues.length}`);
  if (suspiciousCefrAssignments.length) errors.push(`suspicious CEFR/frequency assignments: ${suspiciousCefrAssignments.length}`);
  if (records.length < 5_800 || records.length > 6_200) errors.push(`master vocabulary count ${records.length} is outside 5,800-6,200`);

  const lemmaPosCounts = new Map<string, Set<string>>();
  for (const record of records) { const parts = lemmaPosCounts.get(record.lemma) ?? new Set<string>(); parts.add(record.partOfSpeech); lemmaPosCounts.set(record.lemma, parts); }
  return {
    total: records.length,
    byLevel: Object.fromEntries(levels.map((level) => [level, records.filter((record) => record.cefrLevel === level).length])) as Record<CEFRLevel, number>,
    byPartOfSpeech: countBy(records, (record) => record.partOfSpeech),
    sourceBackedCefr: records.filter((record) => record.cefrBasis === "source-backed").length,
    editorialCefr: records.filter((record) => record.cefrBasis === "editorial-estimate").length,
    sourceBackedFrequency: records.filter((record) => record.frequencyBasis === "source-backed-rank").length,
    editorialFrequency: records.filter((record) => record.frequencyBasis === "editorial-band").length,
    exactDuplicateIds, exactDuplicateLexicalUnits,
    lemmasWithMultiplePartsOfSpeech: [...lemmaPosCounts.values()].filter((parts) => parts.size > 1).length,
    unresolvedProvenanceIssues, suspiciousCefrAssignments, missingExistingIds, existingMetadataMismatches, errors,
    qualityGate: errors.length === 0,
  };
}
