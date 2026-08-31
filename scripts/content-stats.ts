import { contentProvenanceBatches } from "../src/data/content-provenance";
import { exercises } from "../src/data/exercises";
import { expressions } from "../src/data/expressions";
import { detailedGrammarTopics, grammarTopics } from "../src/data/grammar";
import { placementQuestions } from "../src/data/placement";
import { readingPassages } from "../src/data/placement-reading";
import { vocabulary } from "../src/data/vocabulary";
import { validateLearningContent } from "../src/lib/content/validate";
import { auditGrammarLessons } from "../src/lib/content/grammar-quality";
import { auditMasterVocabularyInventory } from "../src/lib/content/master-vocabulary";
import { auditVocabulary } from "../src/lib/content/vocabulary-audit";
import { auditPlacementBank } from "../src/lib/content/placement-quality";
import { auditExpressions, deterministicExpressionSample, expressionSemanticRubricIssues } from "../src/lib/content/expression-quality";
import type { CEFRLevel, PlacementDimension } from "../src/types/domain";

const levels: CEFRLevel[] = ["A1", "A2", "B1", "B2", "C1", "C2"];
const domains: PlacementDimension[] = ["vocabulary", "grammar", "context", "reading"];
const countBy = <T>(values: T[], keys: string[], key: (value: T) => string) => Object.fromEntries(keys.map((candidate) => [candidate, values.filter((value) => key(value) === candidate).length]));
const validationErrors = validateLearningContent({ vocabulary, grammar: grammarTopics, expressions, exercises, placement: placementQuestions, readingPassages, provenance: contentProvenanceBatches });
const vocabularyAudit = auditVocabulary(vocabulary);
const masterVocabularyAudit = auditMasterVocabularyInventory();
const grammarAudit = auditGrammarLessons(grammarTopics);
const placementAudit = auditPlacementBank(placementQuestions, readingPassages);
const expressionAudit = auditExpressions(expressions);
const expressionSample = [
  ...deterministicExpressionSample(expressions, "idiom", 60),
  ...deterministicExpressionSample(expressions, "phrasal-verb", 60),
  ...deterministicExpressionSample(expressions, "collocation", 100),
];

const report = {
  masterVocabulary: {
    total: masterVocabularyAudit.total,
    byLevel: masterVocabularyAudit.byLevel,
    byPartOfSpeech: masterVocabularyAudit.byPartOfSpeech,
    sourceBackedCefr: masterVocabularyAudit.sourceBackedCefr,
    editorialCefr: masterVocabularyAudit.editorialCefr,
    sourceBackedFrequency: masterVocabularyAudit.sourceBackedFrequency,
    editorialCoarseFrequency: masterVocabularyAudit.editorialFrequency,
    exactDuplicateIds: masterVocabularyAudit.exactDuplicateIds.length,
    exactDuplicateLexicalUnits: masterVocabularyAudit.exactDuplicateLexicalUnits.length,
    lemmasWithMultiplePartsOfSpeech: masterVocabularyAudit.lemmasWithMultiplePartsOfSpeech,
    unresolvedProvenanceIssues: masterVocabularyAudit.unresolvedProvenanceIssues.length,
    suspiciousCefrAssignments: masterVocabularyAudit.suspiciousCefrAssignments.length,
    preservedExistingIds: vocabulary.length - masterVocabularyAudit.missingExistingIds.length,
    qualityGate: masterVocabularyAudit.qualityGate,
  },
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
  grammar: { catalogue: grammarTopics.length, detailedRecords: detailedGrammarTopics.length, productionQualifiedDetailed: grammarAudit.productionReady, detailedByLevel: countBy(detailedGrammarTopics, levels, (item) => item.level), qualityIssues: grammarAudit.issues },
  expressions: {
    total: expressions.length,
    byKind: countBy(expressions, ["idiom", "phrasal-verb", "collocation", "common-expression"], (item) => item.kind),
    byLevel: countBy(expressions, levels, (item) => item.cefrLevel),
    byStatus: countBy(expressions, ["draft", "validated", "reviewed", "published", "retired"], (item) => item.status),
    quality: expressionAudit,
    semanticSample: { total: expressionSample.length, issues: expressionSample.flatMap(expressionSemanticRubricIssues), pass: expressionSample.flatMap(expressionSemanticRubricIssues).length === 0 },
  },
  placement: {
    items: placementQuestions.length,
    passages: readingPassages.length,
    byDomain: countBy(placementQuestions, domains, (item) => item.dimension),
    byLevel: countBy(placementQuestions, levels, (item) => item.level),
    byStatus: countBy(placementQuestions, ["draft", "validated", "reviewed", "published", "retired"], (item) => item.status),
    quality: placementAudit,
  },
  releaseGates: {
    contentValidation: validationErrors.length === 0,
    educatorReviewComplete: placementQuestions.every((item) => ["reviewed", "published"].includes(item.status)),
    productionPublishedBankAvailable: placementQuestions.some((item) => item.status === "published"),
    psychometricCalibrationComplete: false,
    masterVocabularyInventory: masterVocabularyAudit.qualityGate,
    vocabularyCountAtLeast5800: vocabulary.length >= 5_800,
    vocabularySamplingAtLeast100PerLevel: vocabularyAudit.samplingGate,
    vocabularyProductionCorpus: vocabulary.filter((item) => item.status === "published").length >= 5_800 && vocabularyAudit.samplingGate && validationErrors.length === 0 && vocabularyAudit.duplicateCandidates.length === 0,
    grammarProductionCorpus: grammarAudit.productionReady >= 110 && grammarAudit.issues.length === 0 && validationErrors.length === 0,
    placementEngineeringBaseline: placementQuestions.length >= 600 && placementAudit.criticalIssues.length === 0 && validationErrors.length === 0,
    expressionsEngineeringBaseline: expressionAudit.byKind.idiom >= 300 && expressionAudit.byKind["phrasal-verb"] >= 300 && expressionAudit.byKind.collocation >= 1_000 && expressionAudit.criticalIssues.length === 0 && validationErrors.length === 0,
    placementProductionBank: placementQuestions.filter((item) => item.status === "published").length >= 600 && placementAudit.criticalIssues.length === 0 && validationErrors.length === 0,
  },
  validationErrors,
};

if (process.argv.includes("--json")) console.log(JSON.stringify(report, null, 2));
else {
  console.log("English Mastery content statistics");
  console.log(JSON.stringify(report, null, 2));
}
if (validationErrors.length || !masterVocabularyAudit.qualityGate) process.exitCode = 1;
