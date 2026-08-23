export interface MasterVocabularySource {
  id: string;
  name: string;
  version: string;
  canonicalUrl: string;
  license: string;
  licenseUrl: string;
  commercialUseAllowed: boolean;
  redistributionAllowed: boolean;
  attribution: string;
  fieldsUsed: string[];
  retrievedAt: string;
  sha256: string;
  notes: string;
}

/** Sources actually incorporated into master-inventory.tsv. */
export const masterVocabularySources: MasterVocabularySource[] = [
  {
    id: "cefrj-1.5",
    name: "CEFR-J Vocabulary Profile",
    version: "1.5",
    canonicalUrl: "https://github.com/openlanguageprofiles/olp-en-cefrj/blob/master/cefrj-vocabulary-profile-1.5.csv",
    license: "CEFR-J / Open Language Profiles terms of use: research and commercial use without charge, with citation",
    licenseUrl: "https://github.com/openlanguageprofiles/olp-en-cefrj#terms-of-use",
    commercialUseAllowed: true,
    redistributionAllowed: true,
    attribution: "The CEFR-J Wordlist Version 1.5, compiled by Yukio Tono, Tono Laboratory, Tokyo University of Foreign Studies; distributed by Open Language Profiles.",
    fieldsUsed: ["headword", "part of speech", "CEFR-J level A1-B2"],
    retrievedAt: "2026-08-23",
    sha256: "b0dd3c635f1c9a4fdf1490c7e5b7c48e8bbe55b652ad0c9860a95f98e10ae498",
    notes: "CEFR-J is a localized pedagogical profile, not an official Council of Europe word-to-level mapping. Source permission requires citation and disclaims accuracy warranties.",
  },
  {
    id: "octanove-c1c2-1.0",
    name: "Octanove Vocabulary Profile C1/C2",
    version: "1.0",
    canonicalUrl: "https://github.com/openlanguageprofiles/olp-en-cefrj/blob/master/octanove-vocabulary-profile-c1c2-1.0.csv",
    license: "Creative Commons Attribution-ShareAlike 4.0 International",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
    commercialUseAllowed: true,
    redistributionAllowed: true,
    attribution: "Octanove Labs, Octanove Vocabulary Profile C1/C2 Version 1.0, via Open Language Profiles.",
    fieldsUsed: ["headword", "part of speech", "C1/C2 level"],
    retrievedAt: "2026-08-23",
    sha256: "18c33a407f2f89f7b8de9671c6d45fe3ea0bce45e7d2d7dcaab48d73e0f7b380",
    notes: "Used only for metadata. No definitions or examples were imported.",
  },
  {
    id: "ngsl-gr-1.0",
    name: "New General Service List – Graded Reader",
    version: "1.0",
    canonicalUrl: "https://www.newgeneralservicelist.com/ngsl-graded-reader",
    license: "Creative Commons Attribution-ShareAlike 4.0 International",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
    commercialUseAllowed: true,
    redistributionAllowed: true,
    attribution: "Browne, C., and Culligan, B. New General Service List – Graded Reader 1.0.",
    fieldsUsed: ["headword candidate evidence", "list-local frequency rank"],
    retrievedAt: "2026-08-23",
    sha256: "5c4f7bb84b5d74d7481d43483b811f1591bd667b86a6131f1566fdf07cade91e",
    notes: "Ranks are preserved only as NGSL-GR list-local ranks; they are not presented as universal corpus ranks.",
  },
  {
    id: "nawl-1.2",
    name: "New Academic Word List",
    version: "1.2",
    canonicalUrl: "https://www.newgeneralservicelist.com/new-academic-word-list",
    license: "Creative Commons Attribution-ShareAlike 4.0 International",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
    commercialUseAllowed: true,
    redistributionAllowed: true,
    attribution: "Browne, C., Culligan, B., and Phillips, J. New Academic Word List 1.2.",
    fieldsUsed: ["academic headword membership as inclusion-priority evidence"],
    retrievedAt: "2026-08-23",
    sha256: "88a99099e10010ea40992cca4a5119102d05a0f2888ee5d43d4c8b4afd597fef",
    notes: "No definitions and no fabricated cross-list rank were imported.",
  },
  {
    id: "bsl-1.2",
    name: "Business Service List",
    version: "1.2",
    canonicalUrl: "https://www.newgeneralservicelist.com/business-service-list",
    license: "Creative Commons Attribution-ShareAlike 4.0 International",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
    commercialUseAllowed: true,
    redistributionAllowed: true,
    attribution: "Browne, C., and Culligan, B. Business Service List 1.2.",
    fieldsUsed: ["business headword membership as inclusion-priority evidence"],
    retrievedAt: "2026-08-23",
    sha256: "8a17b77465ecb382b33af4567ab1427c0950e2c0db8490cb83abf286bf9379ac",
    notes: "No definitions and no fabricated cross-list rank were imported.",
  },
  {
    id: "oewn-2025",
    name: "Open English WordNet",
    version: "2025",
    canonicalUrl: "https://en-word.net/downloads",
    license: "Creative Commons Attribution 4.0 plus underlying Princeton WordNet license",
    licenseUrl: "https://github.com/globalwordnet/english-wordnet/blob/main/LICENSE.md",
    commercialUseAllowed: true,
    redistributionAllowed: true,
    attribution: "Open English WordNet Team and Princeton University WordNet; see the OEWN LICENSE.md and WNDB_License.txt.",
    fieldsUsed: ["lemma existence", "part-of-speech existence"],
    retrievedAt: "2026-08-23",
    sha256: "38b16326159f51853626b7d24a44c453fa88ab33f06fce5ec8fc5996d1c2be93",
    notes: "Used only to reject unverified content-word candidates. Definitions, examples, synsets, and relations were not imported.",
  },
];

export const masterVocabularySourceById = new Map(masterVocabularySources.map((source) => [source.id, source]));
