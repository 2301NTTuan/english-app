import { describe, expect, it } from "vitest";
import { vocabulary } from "@/data/vocabulary";
import { masterVocabularySources } from "@/data/vocabulary/master-sources";
import { auditMasterVocabularyInventory, loadMasterVocabularyInventory } from "./master-vocabulary";

describe("master vocabulary inventory", () => {
  const records = loadMasterVocabularyInventory();
  const audit = auditMasterVocabularyInventory(records);

  it("contains exactly 6,000 normalized lexical units in the accepted target range", () => {
    expect(records).toHaveLength(6_000);
    expect(vocabulary).toHaveLength(6_000);
    expect(audit.byLevel).toEqual({ A1: 750, A2: 950, B1: 1_200, B2: 1_525, C1: 975, C2: 600 });
    expect(audit.qualityGate).toBe(true);
  });

  it("maps every master entry to one enriched record while preserving identity metadata", () => {
    expect(audit.missingExistingIds).toEqual([]);
    expect(audit.existingMetadataMismatches).toEqual([]);
    expect(new Set(vocabulary.map((item) => item.id))).toEqual(new Set(records.map((record) => record.id)));
  });

  it("contains no duplicate IDs or duplicate lemma/POS lexical units", () => {
    expect(audit.exactDuplicateIds).toEqual([]);
    expect(audit.exactDuplicateLexicalUnits).toEqual([]);
    expect(audit.lemmasWithMultiplePartsOfSpeech).toBeGreaterThan(0);
  });

  it("keeps source-backed claims attributable and exact ranks NGSL-GR-local", () => {
    expect(audit.unresolvedProvenanceIssues).toEqual([]);
    expect(audit.sourceBackedCefr).toBe(5_872);
    expect(audit.editorialCefr).toBe(128);
    expect(audit.sourceBackedFrequency).toBe(4_417);
    expect(audit.editorialFrequency).toBe(1_583);
    expect(masterVocabularySources.every((source) => source.commercialUseAllowed && source.redistributionAllowed && source.sha256.length === 64)).toBe(true);
  });

  it("has no unresolved suspicious CEFR/frequency sanity flags", () => {
    expect(audit.suspiciousCefrAssignments).toEqual([]);
  });
});
