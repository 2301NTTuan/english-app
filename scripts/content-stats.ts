import { contentProvenanceBatches } from "../src/data/content-provenance";
import { exercises } from "../src/data/exercises";
import { expressions } from "../src/data/expressions";
import { detailedGrammarTopics, grammarTopics } from "../src/data/grammar";
import { placementQuestions } from "../src/data/placement";
import { readingPassages } from "../src/data/placement-reading";
import { vocabulary } from "../src/data/vocabulary";
import { validateLearningContent } from "../src/lib/content/validate";
import { auditVocabulary } from "../src/lib/content/vocabulary-audit";
import type { CEFRLevel, PlacementDimension } from "../src/types/domain";

const levels: CEFRLevel[] = ["A1", "A2", "B1", "B2", "C1", "C2"];
const domains: PlacementDimension[] = ["vocabulary", "grammar", "context", "reading"];
const countBy = <T>(values: T[], keys: string[], key: (value: T) => string) => Object.fromEntries(keys.map((candidate) => [candidate, values.filter((value) => key(value) === candidate).length]));
const validationErrors = validateLearningContent({ vocabulary, grammar: grammarTopics, expressions, exercises, placement: placementQuestions, readingPassages, provenance: contentProvenanceBatches });
const vocabularyAudit = auditVocabulary(vocabulary);
const productionDetailedGrammar = detailedGrammarTopics.filter((topic) => topic.explanation.length >= 400 && topic.examples.length >= 3 && topic.commonMistakes.length >= 2 && topic.subtopics.length >= 3 && !topic.explanation.includes("retrieve it through guided practice rather than memorizing"));

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
    byStatus: countBy(vocabulary, ["draft", "validated", "reviewed", "published", "retired"], (item) => item.status),
    byCefrBasis: countBy(vocabulary, ["editorial-estimate", "source-backed"], (item) => item.cefrBasis),
    byFrequencyBasis: countBy(vocabulary, ["editorial-band", "source-backed-rank"], (item) => item.frequencyBasis),
    quality: vocabularyAudit,
  },
  grammar: { catalogue: grammarTopics.length, detailedRecords: detailedGrammarTopics.length, productionQualifiedDetailed: productionDetailedGrammar.length, detailedByLevel: countBy(detailedGrammarTopics, levels, (item) => item.level) },
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
    vocabularyCountAtLeast5800: vocabulary.length >= 5_800,
    vocabularySamplingAtLeast100PerLevel: vocabularyAudit.samplingGate,
    vocabularyProductionCorpus: vocabulary.filter((item) => item.status === "published").length >= 5_800 && vocabularyAudit.samplingGate && validationErrors.length === 0 && vocabularyAudit.duplicateCandidates.length === 0,
    grammarProductionCorpus: productionDetailedGrammar.length >= 110 && validationErrors.length === 0,
    placementProductionBank: placementQuestions.filter((item) => item.status === "published").length >= 600 && validationErrors.length === 0,
  },
  validationErrors,
};

if (process.argv.includes("--json")) console.log(JSON.stringify(report, null, 2));
else {
  console.log("English Mastery content statistics");
  console.log(JSON.stringify(report, null, 2));
}
if (validationErrors.length) process.exitCode = 1;
