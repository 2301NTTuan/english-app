import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import { inflateRawSync } from "node:zlib";
import { vocabulary } from "../src/data/vocabulary";
import type { CEFRLevel, ContentStatus, FrequencyBand } from "../src/types/domain";

const levels: CEFRLevel[] = ["A1", "A2", "B1", "B2", "C1", "C2"];
const targetByLevel: Record<CEFRLevel, number> = { A1: 750, A2: 950, B1: 1_200, B2: 1_400, C1: 1_100, C2: 600 };
const sourceIds = {
  cefrj: "cefrj-1.5",
  octanove: "octanove-c1c2-1.0",
  ngsl: "ngsl-gr-1.0",
  nawl: "nawl-1.2",
  bsl: "bsl-1.2",
  oewn: "oewn-2025",
} as const;

type SourceId = typeof sourceIds[keyof typeof sourceIds];
type MasterFrequencyBasis = "source-backed-rank" | "editorial-band";
interface SourceRow { lemma: string; partOfSpeech: string; level: CEFRLevel; sourceId: SourceId; order: number }
interface Candidate {
  canonicalKey: string;
  lemma: string;
  partOfSpeech: string;
  level: CEFRLevel;
  cefrSourceId: SourceId;
  sourceOrder: number;
  sourceLevels: Set<CEFRLevel>;
  sourceIds: Set<SourceId>;
  sourceIdsByLevel: Map<CEFRLevel, SourceId[]>;
  spellingVariants: Set<string>;
}
interface MasterRow {
  id: string;
  lemma: string;
  partOfSpeech: string;
  level: CEFRLevel;
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

const args = new Map(process.argv.slice(2).map((argument) => {
  const [key, ...value] = argument.split("=");
  return [key.replace(/^--/, ""), value.join("=")];
}));
const requiredPath = (name: string) => {
  const value = args.get(name);
  if (!value) throw new Error(`Missing --${name}=PATH`);
  return value;
};

const normalizeLemma = (value: string) => value.normalize("NFKC").trim().toLocaleLowerCase().replace(/[’‘]/g, "'");
const validLemma = (value: string) => /^[a-z]+(?:[-'][a-z]+)*$/.test(value);
const posAliases: Record<string, string> = {
  "be-verb": "verb", "do-verb": "verb", "have-verb": "verb", "modal auxiliary": "modal",
  "infinitive-to": "particle", number: "numeral", vern: "verb",
};
const normalizePartOfSpeech = (value: string) => posAliases[value.trim().toLocaleLowerCase()] ?? value.trim().toLocaleLowerCase();
const contentPartsOfSpeech = new Set(["noun", "verb", "adjective", "adverb"]);
const variantCanonical: Record<string, string> = {
  ageing: "aging", aluminium: "aluminum", analyse: "analyze", analysed: "analyzed", analysing: "analyzing", behaviour: "behavior",
  catalogue: "catalog", centre: "center", cheque: "check", colour: "color", counsellor: "counselor", defence: "defense", dialogue: "dialog",
  favour: "favor", favourite: "favorite", fibre: "fiber", fulfil: "fulfill", grey: "gray", honour: "honor", jewellery: "jewelry",
  judgement: "judgment", labour: "labor", litre: "liter", manoeuvre: "maneuver", neighbour: "neighbor", offence: "offense",
  organise: "organize", organised: "organized", organisation: "organization", practise: "practice", programme: "program",
  realise: "realize", realised: "realized", recognise: "recognize", recognised: "recognized", theatre: "theater", travelling: "traveling",
};
const canonicalLemma = (lemma: string) => variantCanonical[lemma] ?? lemma;
const lexicalKey = (lemma: string, partOfSpeech: string) => `${canonicalLemma(normalizeLemma(lemma))}:${normalizePartOfSpeech(partOfSpeech)}`;
const parseCsvLine = (line: string) => {
  const values: string[] = []; let value = ""; let quoted = false;
  for (let index = 0; index < line.length; index += 1) {
    const character = line[index];
    if (character === '"' && quoted && line[index + 1] === '"') { value += '"'; index += 1; }
    else if (character === '"') quoted = !quoted;
    else if (character === "," && !quoted) { values.push(value); value = ""; }
    else value += character;
  }
  values.push(value);
  return values;
};

function readCefrRows(path: string, sourceId: SourceId): SourceRow[] {
  const lines = readFileSync(path, "utf8").replace(/^\uFEFF/, "").split(/\r?\n/).slice(1);
  return lines.flatMap((line, order) => {
    if (!line.trim()) return [];
    const [headword, pos, rawLevel] = parseCsvLine(line);
    const lemma = normalizeLemma(headword); const partOfSpeech = normalizePartOfSpeech(pos); const level = rawLevel?.trim() as CEFRLevel;
    if (!validLemma(lemma) || !levels.includes(level) || !partOfSpeech) return [];
    return [{ lemma, partOfSpeech, level, sourceId, order }];
  });
}

function extractZipEntry(archive: Buffer, wantedSuffix: string): Buffer {
  const centralSignature = 0x02014b50;
  for (let offset = 0; offset <= archive.length - 46;) {
    if (archive.readUInt32LE(offset) !== centralSignature) { offset += 1; continue; }
    const method = archive.readUInt16LE(offset + 10);
    const compressedSize = archive.readUInt32LE(offset + 20);
    const fileNameLength = archive.readUInt16LE(offset + 28);
    const extraLength = archive.readUInt16LE(offset + 30);
    const commentLength = archive.readUInt16LE(offset + 32);
    const localOffset = archive.readUInt32LE(offset + 42);
    const name = archive.subarray(offset + 46, offset + 46 + fileNameLength).toString("utf8");
    if (name.endsWith(wantedSuffix)) {
      if (archive.readUInt32LE(localOffset) !== 0x04034b50) throw new Error(`Invalid ZIP local header for ${name}`);
      const localNameLength = archive.readUInt16LE(localOffset + 26);
      const localExtraLength = archive.readUInt16LE(localOffset + 28);
      const start = localOffset + 30 + localNameLength + localExtraLength;
      const compressed = archive.subarray(start, start + compressedSize);
      if (method === 0) return compressed;
      if (method === 8) return inflateRawSync(compressed);
      throw new Error(`Unsupported ZIP compression method ${method} for ${name}`);
    }
    offset += 46 + fileNameLength + extraLength + commentLength;
  }
  throw new Error(`Missing ZIP entry ending in ${wantedSuffix}`);
}

function readOewnKeys(path: string): Set<string> {
  const archive = readFileSync(path); const keys = new Set<string>();
  const files: Array<[string, string]> = [["index.noun", "noun"], ["index.verb", "verb"], ["index.adj", "adjective"], ["index.adv", "adverb"]];
  for (const [file, partOfSpeech] of files) {
    for (const line of extractZipEntry(archive, file).toString("utf8").split(/\r?\n/)) {
      if (!line || /^\s/.test(line)) continue;
      const lemma = normalizeLemma(line.split(/\s+/)[0].replaceAll("_", " "));
      if (validLemma(lemma)) keys.add(lexicalKey(lemma, partOfSpeech));
    }
  }
  return keys;
}

function readNgslRanks(path: string): Map<string, number> {
  const rows = readFileSync(path, "utf8").replace(/^\uFEFF/, "").split(/\r?\n/).slice(1); const ranks = new Map<string, number>();
  for (const line of rows) {
    const [rankText, word] = parseCsvLine(line); const rank = Number(rankText); const lemma = normalizeLemma(word ?? "");
    if (Number.isInteger(rank) && rank > 0 && validLemma(lemma)) ranks.set(canonicalLemma(lemma), rank);
  }
  return ranks;
}

function readHeadwordSet(path: string): Set<string> {
  return new Set(readFileSync(path, "utf8").split(/\r?\n/).slice(5).map(normalizeLemma).filter(validLemma).map(canonicalLemma));
}

const cefrjPath = requiredPath("cefrj"); const octanovePath = requiredPath("octanove"); const ngslPath = requiredPath("ngsl-gr");
const nawlPath = requiredPath("nawl"); const bslPath = requiredPath("bsl"); const oewnPath = requiredPath("oewn");
const outputPath = args.get("output") ?? "src/data/vocabulary/master-inventory.tsv";
const ngslRanks = readNgslRanks(ngslPath); const nawlWords = readHeadwordSet(nawlPath); const bslWords = readHeadwordSet(bslPath); const oewnKeys = readOewnKeys(oewnPath);
const rawRows = [...readCefrRows(cefrjPath, sourceIds.cefrj), ...readCefrRows(octanovePath, sourceIds.octanove)];
const rejectedLexicallyUnverified: SourceRow[] = [];
const verifiedRows = rawRows.filter((row) => {
  if (!contentPartsOfSpeech.has(row.partOfSpeech)) return true;
  if (oewnKeys.has(lexicalKey(row.lemma, row.partOfSpeech))) return true;
  rejectedLexicallyUnverified.push(row); return false;
});

const grouped = new Map<string, SourceRow[]>();
for (const row of verifiedRows) {
  const key = lexicalKey(row.lemma, row.partOfSpeech); const group = grouped.get(key) ?? []; group.push(row); grouped.set(key, group);
}
const candidates: Candidate[] = [];
const resolvedSourceConflicts: Array<{ key: string; levels: CEFRLevel[]; selected: CEFRLevel }> = [];
for (const [canonicalKey, rows] of grouped) {
  const sourceLevels = new Set(rows.map((row) => row.level));
  const level = [...sourceLevels].sort((a, b) => levels.indexOf(a) - levels.indexOf(b))[0];
  const supporting = rows.filter((row) => row.level === level).sort((a, b) => a.order - b.order);
  const canonical = canonicalKey.slice(0, canonicalKey.lastIndexOf(":"));
  const lemma = supporting.find((row) => row.lemma === canonical)?.lemma ?? supporting[0].lemma;
  if (sourceLevels.size > 1) resolvedSourceConflicts.push({ key: canonicalKey, levels: [...sourceLevels].sort((a, b) => levels.indexOf(a) - levels.indexOf(b)), selected: level });
  candidates.push({
    canonicalKey, lemma, partOfSpeech: supporting[0].partOfSpeech, level, cefrSourceId: supporting[0].sourceId,
    sourceOrder: Math.min(...supporting.map((row) => row.order)), sourceLevels, sourceIds: new Set(rows.map((row) => row.sourceId)),
    sourceIdsByLevel: new Map(levels.map((candidateLevel) => [candidateLevel, [...new Set(rows.filter((row) => row.level === candidateLevel).map((row) => row.sourceId))]])),
    spellingVariants: new Set(rows.map((row) => row.lemma).filter((word) => word !== lemma)),
  });
}
const candidateByKey = new Map(candidates.map((candidate) => [candidate.canonicalKey, candidate]));

const bandFromRank = (rank: number): FrequencyBand => rank <= 1_500 ? "very-common" : rank <= 3_500 ? "common" : "less-common";
const editorialBand = (level: CEFRLevel): FrequencyBand => level === "A1" ? "very-common" : level === "A2" || level === "B1" ? "common" : level === "B2" ? "less-common" : "advanced";
const frequencyFor = (lemma: string, level: CEFRLevel) => {
  const rank = ngslRanks.get(canonicalLemma(lemma));
  return rank ? { band: bandFromRank(rank), basis: "source-backed-rank" as const, sourceId: sourceIds.ngsl, rank } : { band: editorialBand(level), basis: "editorial-band" as const };
};
const provenanceFor = (candidate: Candidate | undefined, lemma: string, original?: string) => {
  const ids = new Set<string>(); if (original) ids.add(original); if (candidate) { ids.add(candidate.cefrSourceId); if (contentPartsOfSpeech.has(candidate.partOfSpeech)) ids.add(sourceIds.oewn); }
  const canonical = canonicalLemma(lemma); if (ngslRanks.has(canonical)) ids.add(sourceIds.ngsl); if (nawlWords.has(canonical)) ids.add(sourceIds.nawl); if (bslWords.has(canonical)) ids.add(sourceIds.bsl);
  return [...ids].sort();
};
const makeId = (lemma: string, partOfSpeech: string) => `master-${lemma.replace(/'/g, "-")}-${partOfSpeech.replaceAll(" ", "-")}`;

const masterRows: MasterRow[] = [];
const occupiedKeys = new Set<string>(); const occupiedIds = new Set<string>();
const existingEditorialConflicts: Array<{ id: string; key: string; existing: CEFRLevel; sources: CEFRLevel[] }> = [];
for (const item of vocabulary) {
  const lemma = normalizeLemma(item.lemma ?? item.word); const key = lexicalKey(lemma, item.partOfSpeech); const candidate = candidateByKey.get(key);
  if (occupiedKeys.has(key)) throw new Error(`Existing vocabulary duplicates canonical lexical key ${key}`);
  const exactLevelSource = candidate?.sourceIdsByLevel.get(item.cefrLevel)?.[0];
  if (candidate && !exactLevelSource) existingEditorialConflicts.push({ id: item.id, key, existing: item.cefrLevel, sources: [...candidate.sourceLevels] });
  const frequency = frequencyFor(lemma, item.cefrLevel);
  masterRows.push({
    id: item.id, lemma, partOfSpeech: normalizePartOfSpeech(item.partOfSpeech), level: item.cefrLevel,
    cefrBasis: exactLevelSource ? "source-backed" : "editorial-estimate", cefrSourceId: exactLevelSource,
    frequencyBand: frequency.band, frequencyBasis: frequency.basis, frequencySourceId: frequency.sourceId, frequencyRank: frequency.rank,
    provenanceIds: provenanceFor(candidate, lemma, item.provenanceId), status: item.status,
    spellingVariants: candidate ? [...candidate.spellingVariants].sort() : [],
  });
  occupiedKeys.add(key); occupiedIds.add(item.id);
}

const selectedNewByLevel: Record<CEFRLevel, number> = { A1: 0, A2: 0, B1: 0, B2: 0, C1: 0, C2: 0 };
const existingByLevel = Object.fromEntries(levels.map((level) => [level, masterRows.filter((row) => row.level === level).length])) as Record<CEFRLevel, number>;
const eligible = candidates.filter((candidate) => {
  if (occupiedKeys.has(candidate.canonicalKey)) return false;
  const rank = ngslRanks.get(canonicalLemma(candidate.lemma));
  if (candidate.level === "A1" && rank && rank > 2_500) return false;
  if ((candidate.level === "C1" || candidate.level === "C2") && rank && rank <= 1_500) return false;
  return true;
});
const adjustedTargetByLevel = { ...targetByLevel };
const targetAdjustments: Array<{ level: CEFRLevel; requested: number; accepted: number; reason: string }> = [];
for (const level of levels) {
  const maximum = existingByLevel[level] + eligible.filter((candidate) => candidate.level === level).length;
  if (maximum >= adjustedTargetByLevel[level]) continue;
  const deficit = adjustedTargetByLevel[level] - maximum;
  targetAdjustments.push({ level, requested: adjustedTargetByLevel[level], accepted: maximum, reason: "insufficient normalized candidates verified by Open English WordNet" });
  adjustedTargetByLevel[level] = maximum;
  const b2Capacity = existingByLevel.B2 + eligible.filter((candidate) => candidate.level === "B2").length - adjustedTargetByLevel.B2;
  if (level !== "B2" && b2Capacity >= deficit) adjustedTargetByLevel.B2 += deficit;
  else throw new Error(`Cannot reallocate ${deficit} rejected ${level} slots without exceeding trustworthy source capacity`);
}
const evidenceScore = (candidate: Candidate) => {
  const lemma = canonicalLemma(candidate.lemma); const rank = ngslRanks.get(lemma);
  return (rank ? 1_000_000 - rank : 0) + (nawlWords.has(lemma) ? 100_000 : 0) + (bslWords.has(lemma) ? 50_000 : 0);
};
for (const level of levels) {
  const needed = adjustedTargetByLevel[level] - existingByLevel[level];
  const pool = eligible.filter((candidate) => candidate.level === level)
    .sort((a, b) => evidenceScore(b) - evidenceScore(a) || a.sourceOrder - b.sourceOrder || a.lemma.localeCompare(b.lemma) || a.partOfSpeech.localeCompare(b.partOfSpeech));
  if (pool.length < needed) throw new Error(`${level} has only ${pool.length} eligible candidates for ${needed} open slots`);
  for (const candidate of pool.slice(0, needed)) {
    const frequency = frequencyFor(candidate.lemma, level); const id = makeId(candidate.lemma, candidate.partOfSpeech);
    if (occupiedIds.has(id)) throw new Error(`Generated duplicate stable ID ${id}`);
    masterRows.push({
      id, lemma: candidate.lemma, partOfSpeech: candidate.partOfSpeech, level, cefrBasis: "source-backed", cefrSourceId: candidate.cefrSourceId,
      frequencyBand: frequency.band, frequencyBasis: frequency.basis, frequencySourceId: frequency.sourceId, frequencyRank: frequency.rank,
      provenanceIds: provenanceFor(candidate, candidate.lemma), status: "validated", spellingVariants: [...candidate.spellingVariants].sort(),
    });
    occupiedKeys.add(candidate.canonicalKey); occupiedIds.add(id); selectedNewByLevel[level] += 1;
  }
}

masterRows.sort((a, b) => levels.indexOf(a.level) - levels.indexOf(b.level) || a.lemma.localeCompare(b.lemma) || a.partOfSpeech.localeCompare(b.partOfSpeech));
const header = ["id", "lemma", "part_of_speech", "cefr_level", "cefr_basis", "cefr_source_id", "frequency_band", "frequency_basis", "frequency_source_id", "frequency_rank", "provenance_ids", "spelling_variants", "status"];
const tsv = [header.join("\t"), ...masterRows.map((row) => [
  row.id, row.lemma, row.partOfSpeech, row.level, row.cefrBasis, row.cefrSourceId ?? "", row.frequencyBand, row.frequencyBasis,
  row.frequencySourceId ?? "", row.frequencyRank?.toString() ?? "", row.provenanceIds.join(","), row.spellingVariants.join(","), row.status,
].join("\t")), ""].join("\n");
writeFileSync(outputPath, tsv, "utf8");

const report = {
  outputPath,
  checksum: createHash("sha256").update(tsv).digest("hex"),
  total: masterRows.length,
  byLevel: Object.fromEntries(levels.map((level) => [level, masterRows.filter((row) => row.level === level).length])),
  existing: vocabulary.length,
  selectedNewByLevel,
  sourceBackedCefr: masterRows.filter((row) => row.cefrBasis === "source-backed").length,
  editorialCefr: masterRows.filter((row) => row.cefrBasis === "editorial-estimate").length,
  sourceBackedFrequency: masterRows.filter((row) => row.frequencyBasis === "source-backed-rank").length,
  editorialFrequency: masterRows.filter((row) => row.frequencyBasis === "editorial-band").length,
  rawRows: rawRows.length,
  lexicallyUnverifiedRejected: rejectedLexicallyUnverified.length,
  sourceLevelConflictsResolvedToLowerLevel: resolvedSourceConflicts.length,
  existingEditorialConflicts: existingEditorialConflicts.length,
  targetAdjustments,
};
console.log(JSON.stringify(report, null, 2));
