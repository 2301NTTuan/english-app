import { contentProvenanceBatches } from "../src/data/content-provenance";
import { exercises } from "../src/data/exercises";
import { expressions } from "../src/data/expressions";
import { detailedGrammarTopics, grammarTopics } from "../src/data/grammar";
import { placementQuestions } from "../src/data/placement";
import { readingPassages } from "../src/data/placement-reading";
import { vocabulary } from "../src/data/vocabulary";
import { validateLearningContent } from "../src/lib/content/validate";
import type { CEFRLevel, PlacementDimension } from "../src/types/domain";

const levels: CEFRLevel[] = ["A1", "A2", "B1", "B2", "C1", "C2"];
const domains: PlacementDimension[] = ["vocabulary", "grammar", "context", "reading"];
const countBy = <T>(values: T[], keys: string[], key: (value: T) => string) => Object.fromEntries(keys.map((candidate) => [candidate, values.filter((value) => key(value) === candidate).length]));
const validationErrors = validateLearningContent({ vocabulary, grammar: grammarTopics, expressions, exercises, placement: placementQuestions, readingPassages, provenance: contentProvenanceBatches });

const report = {
  vocabulary: {
    total: vocabulary.length,
    byLevel: countBy(vocabulary, levels, (item) => item.cefrLevel),
    withFrequencyRank: vocabulary.filter((item) => item.frequencyRank !== undefined).length,
    withFrequencyBand: vocabulary.filter((item) => item.frequencyBand !== undefined).length,
    synonyms: vocabulary.reduce((sum, item) => sum + item.synonyms.length, 0),
    antonyms: vocabulary.reduce((sum, item) => sum + item.antonyms.length, 0),
    wordFamilies: vocabulary.reduce((sum, item) => sum + item.wordFamily.length, 0),
    collocations: vocabulary.reduce((sum, item) => sum + item.collocations.length, 0),
  },
  grammar: { catalogue: grammarTopics.length, detailed: detailedGrammarTopics.length, detailedByLevel: countBy(detailedGrammarTopics, levels, (item) => item.level) },
  expressions: {
    total: expressions.length,
    byKind: countBy(expressions, ["idiom", "phrasal-verb", "collocation", "common-expression"], (item) => item.kind),
    byLevel: countBy(expressions, levels, (item) => item.cefrLevel),
  },
  placement: {
    items: placementQuestions.length,
    passages: readingPassages.length,
    byDomain: countBy(placementQuestions, domains, (item) => item.dimension),
    byLevel: countBy(placementQuestions, levels, (item) => item.level),
    byStatus: countBy(placementQuestions, ["draft", "validated", "reviewed", "published", "retired"], (item) => item.status),
  },
  releaseGates: {
    contentValidation: validationErrors.length === 0,
    educatorReviewComplete: placementQuestions.every((item) => ["reviewed", "published"].includes(item.status)),
    productionPublishedBankAvailable: placementQuestions.some((item) => item.status === "published"),
    psychometricCalibrationComplete: false,
  },
  validationErrors,
};

if (process.argv.includes("--json")) console.log(JSON.stringify(report, null, 2));
else {
  console.log("English Mastery content statistics");
  console.log(JSON.stringify(report, null, 2));
}
if (validationErrors.length) process.exitCode = 1;
