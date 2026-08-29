import type { ContentStatus } from "@/types/domain";

export interface ContentProvenanceBatch {
  id: string;
  title: string;
  sourceType: "repository-authored" | "licensed-import";
  license: string;
  attribution: string;
  status: ContentStatus;
  notes: string;
}

export const contentProvenanceBatches: ContentProvenanceBatch[] = [
  {
    id: "vocabulary-core-2026-08",
    title: "Repository-authored vocabulary core",
    sourceType: "repository-authored",
    license: "Project-owned; no third-party definitions or examples incorporated",
    attribution: "English Mastery content team",
    status: "validated",
    notes: "CEFR levels and coarse frequency bands are editorial estimates; exact corpus ranks are intentionally omitted.",
  },
  {
    id: "vocabulary-foundations-001-2026-08",
    title: "Foundational A1/A2 vocabulary batch 001",
    sourceType: "repository-authored",
    license: "Project-owned; no third-party definitions or examples incorporated",
    attribution: "English Mastery content team",
    status: "validated",
    notes: "106 common foundational lexical units. CEFR and frequency bands are editorial estimates; optional relations intentionally omitted pending review.",
  },
  {
    id: "vocabulary-enriched-001-2026-08",
    title: "Master vocabulary enrichment batch 001 (A1)",
    sourceType: "licensed-import",
    license: "CC BY-SA 4.0 (Simple English and Vietnamese Wiktionary adaptations); CC BY 4.0 plus Princeton WordNet license (Open English WordNet)",
    attribution: "Wiktionary contributors; Open English WordNet Team and Princeton University WordNet; adapted and normalized by the English Mastery content team",
    status: "validated",
    notes: "650 learner-facing A1 records. Stable IDs, CEFR evidence, and frequency evidence are preserved from master-inventory.tsv; one definition, Vietnamese meaning, example, and topic are retained per lexical unit.",
  },
  {
    id: "vocabulary-enriched-002-2026-08",
    title: "Master vocabulary enrichment batch 002 (A2)",
    sourceType: "licensed-import",
    license: "CC BY-SA 4.0 (Simple English and Vietnamese Wiktionary adaptations); CC BY 4.0 plus Princeton WordNet license (Open English WordNet)",
    attribution: "Wiktionary contributors; Open English WordNet Team and Princeton University WordNet; adapted and normalized by the English Mastery content team",
    status: "validated",
    notes: "650 learner-facing A2 records. Stable IDs, CEFR evidence, and frequency evidence are preserved from master-inventory.tsv; one definition, Vietnamese meaning, example, and topic are retained per lexical unit.",
  },
  {
    id: "placement-core-2026-08",
    title: "Placement core and reading pilot",
    sourceType: "repository-authored",
    license: "Project-owned; no third-party text incorporated",
    attribution: "English Mastery content team",
    status: "validated",
    notes: "Editorial parameters are provisional until educator review and response calibration.",
  },
];

export const contentProvenanceById = new Map(contentProvenanceBatches.map((batch) => [batch.id, batch]));
