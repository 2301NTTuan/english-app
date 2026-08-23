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
