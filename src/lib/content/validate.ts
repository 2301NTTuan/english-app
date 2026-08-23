import type { ContentProvenanceBatch } from "@/data/content-provenance";
import type { Exercise, ExpressionItem, GrammarTopic, PlacementQuestion, ReadingPassage, VocabularyItem } from "@/types/domain";

const levels = new Set(["A1", "A2", "B1", "B2", "C1", "C2"]);
const partsOfSpeech = new Set(["noun", "verb", "adjective", "adverb", "pronoun", "preposition", "conjunction", "determiner", "interjection", "modal", "auxiliary", "phrase"]);
const contentStatuses = new Set(["draft", "validated", "reviewed", "published", "retired"]);
const normalized = (value: string) => value.trim().toLocaleLowerCase();
const duplicates = (values: string[]) => values.filter((value, index) => values.indexOf(value) !== index);
const genericPlacementExplanation = (value: string) => /only (option|answer).*(correct|completes)|is correct because it is correct/i.test(value);

export interface LearningContent { vocabulary: VocabularyItem[]; grammar: GrammarTopic[]; expressions: ExpressionItem[]; exercises: Exercise[]; placement?: PlacementQuestion[]; readingPassages?: ReadingPassage[]; provenance?: ContentProvenanceBatch[] }

export function validateLearningContent(content: LearningContent): string[] {
  const errors: string[] = [];
  const checkUnique = (label: string, values: string[]) => { for (const value of new Set(duplicates(values))) errors.push(`${label}: duplicate ${value}`); };
  checkUnique("vocabulary id", content.vocabulary.map((item) => item.id));
  checkUnique("vocabulary sense", content.vocabulary.map((item) => `${normalized(item.word)}:${normalized(item.partOfSpeech)}:${normalized(item.meanings[0]?.definition ?? "")}`));
  checkUnique("vocabulary example", content.vocabulary.flatMap((item) => item.examples.map(normalized)));
  checkUnique("grammar id", content.grammar.map((item) => item.id));
  checkUnique("expression id", content.expressions.map((item) => item.id));
  checkUnique("expression", content.expressions.map((item) => normalized(item.expression)));
  checkUnique("exercise id", content.exercises.map((item) => item.id));
  if (content.placement) checkUnique("placement id", content.placement.map((item) => item.id));
  if (content.placement) checkUnique("placement item", content.placement.map((item) => `${normalized(item.prompt)}:${item.options?.map(normalized).sort().join("|") ?? ""}`));
  if (content.readingPassages) checkUnique("reading passage id", content.readingPassages.map((item) => item.id));
  if (content.provenance) checkUnique("provenance id", content.provenance.map((item) => item.id));

  for (const item of content.vocabulary) {
    const key = `vocabulary ${item.id}`;
    if (!item.id.trim() || !item.word.trim() || !item.partOfSpeech.trim()) errors.push(`${key}: missing identity field`);
    if (!contentStatuses.has(item.status)) errors.push(`${key}: invalid content status ${item.status}`);
    if (!levels.has(item.cefrLevel)) errors.push(`${key}: invalid CEFR ${item.cefrLevel}`);
    if (!partsOfSpeech.has(normalized(item.partOfSpeech))) errors.push(`${key}: invalid part of speech ${item.partOfSpeech}`);
    if (!item.provenanceId.trim() || !content.provenance?.some((batch) => batch.id === item.provenanceId)) errors.push(`${key}: unknown provenance ${item.provenanceId}`);
    if (!item.cefrBasis || !["editorial-estimate", "source-backed"].includes(item.cefrBasis)) errors.push(`${key}: invalid CEFR basis`);
    if (!item.frequencyBasis || !["editorial-band", "source-backed-rank"].includes(item.frequencyBasis)) errors.push(`${key}: invalid frequency basis`);
    if (!item.frequencyBand) errors.push(`${key}: frequency band is required`);
    if (item.frequencyBasis === "editorial-band" && item.frequencyRank !== undefined) errors.push(`${key}: editorial frequency must not claim an exact rank`);
    if (item.frequencyBasis === "source-backed-rank" && item.frequencyRank === undefined) errors.push(`${key}: source-backed frequency rank is missing`);
    if (item.status === "published" && content.provenance?.find((batch) => batch.id === item.provenanceId)?.status !== "published") errors.push(`${key}: published content requires published provenance`);
    if (!item.meanings.length || item.meanings.some((meaning) => !meaning.definition.trim())) errors.push(`${key}: missing definition`);
    if (item.meanings.some((meaning) => !meaning.vietnamese?.trim())) errors.push(`${key}: missing Vietnamese meaning`);
    if (item.meanings.some((meaning) => normalized(meaning.definition) === normalized(item.word) || normalized(meaning.definition) === normalized(item.lemma ?? item.word))) errors.push(`${key}: circular definition`);
    if (item.meanings.some((meaning) => (normalized(item.partOfSpeech) === "verb") !== normalized(meaning.definition).startsWith("to "))) errors.push(`${key}: definition form conflicts with declared part of speech`);
    if (!item.examples.length || item.examples.some((example) => example.trim().length < 4)) errors.push(`${key}: malformed example`);
    if (!item.topics?.length || item.topics.some((topic) => !topic.trim() || normalized(topic) === "general")) errors.push(`${key}: specific topic is required`);
    if (!item.tags.length) errors.push(`${key}: tags are required`);
    if (item.frequencyRank !== undefined && (!Number.isInteger(item.frequencyRank) || item.frequencyRank < 1)) errors.push(`${key}: invalid frequency rank`);
    const synonyms = item.synonyms.map((relation) => normalized(relation.word)); const antonyms = item.antonyms.map((relation) => normalized(relation.word)); const word = normalized(item.word);
    if (synonyms.includes(word)) errors.push(`${key}: self-referencing synonym`);
    if (antonyms.includes(word)) errors.push(`${key}: self-referencing antonym`);
    if ([...item.synonyms, ...item.antonyms].some((relation) => !relation.word.trim())) errors.push(`${key}: empty lexical relation target`);
    for (const relation of new Set(duplicates(synonyms))) errors.push(`${key}: duplicate synonym ${relation}`);
    for (const relation of new Set(duplicates(antonyms))) errors.push(`${key}: duplicate antonym ${relation}`);
    for (const conflict of synonyms.filter((relation) => antonyms.includes(relation))) errors.push(`${key}: synonym/antonym conflict ${conflict}`);
    if (item.wordFamily.some((relation) => !relation.word.trim() || !relation.partOfSpeech.trim() || normalized(relation.word) === word)) errors.push(`${key}: malformed word-family relation`);
    for (const relation of new Set(duplicates(item.wordFamily.map((entry) => `${normalized(entry.word)}:${normalized(entry.partOfSpeech)}`)))) errors.push(`${key}: duplicate word-family relation ${relation}`);
    if (item.collocations.some((relation) => relation.trim().split(/\s+/).length < 2)) errors.push(`${key}: malformed collocation`);
    for (const relation of new Set(duplicates(item.collocations.map(normalized)))) errors.push(`${key}: duplicate collocation ${relation}`);
    if ([...item.synonyms, ...item.antonyms].some((relation) => !Number.isFinite(relation.strength) || relation.strength < 0 || relation.strength > 100)) errors.push(`${key}: relation strength must be between 0 and 100`);
  }

  const grammarIds = new Set(content.grammar.map((item) => item.id));
  for (const topic of content.grammar) {
    if (!levels.has(topic.level)) errors.push(`grammar ${topic.id}: invalid CEFR ${topic.level}`);
    for (const prerequisite of topic.prerequisites) if (!grammarIds.has(prerequisite)) errors.push(`grammar ${topic.id}: broken prerequisite ${prerequisite}`);
    if (!topic.explanation.trim() || !topic.examples.length || !topic.commonMistakes.length) errors.push(`grammar ${topic.id}: incomplete lesson content`);
  }
  const visiting = new Set<string>(); const visited = new Set<string>();
  const findCycle = (topicId: string, trail: string[]): void => {
    if (visiting.has(topicId)) { errors.push(`grammar prerequisite cycle: ${[...trail, topicId].join(" -> ")}`); return; }
    if (visited.has(topicId)) return;
    visiting.add(topicId);
    const topic = content.grammar.find((candidate) => candidate.id === topicId);
    for (const prerequisite of topic?.prerequisites ?? []) if (grammarIds.has(prerequisite)) findCycle(prerequisite, [...trail, topicId]);
    visiting.delete(topicId); visited.add(topicId);
  };
  for (const topic of content.grammar) findCycle(topic.id, []);

  const contentIds = new Set([...content.vocabulary.map((item) => item.id), ...content.grammar.map((item) => item.id), ...content.expressions.map((item) => item.id)]);
  const validateExercise = (exercise: Exercise, standalone = false) => {
    if (!standalone && !contentIds.has(exercise.itemId)) errors.push(`exercise ${exercise.id}: invalid item reference ${exercise.itemId}`);
    if (!exercise.prompt.trim() || !exercise.answer.trim()) errors.push(`exercise ${exercise.id}: missing prompt or answer`);
    if (exercise.options) {
      const choices = exercise.options.map(normalized);
      if (new Set(choices).size !== choices.length) errors.push(`exercise ${exercise.id}: duplicate choices`);
      if (choices.filter((choice) => choice === normalized(exercise.answer)).length !== 1) errors.push(`exercise ${exercise.id}: answer must appear exactly once`);
      if (exercise.options.length < 3) errors.push(`exercise ${exercise.id}: insufficient distractors`);
    }
  };
  content.exercises.forEach((exercise) => validateExercise(exercise));
  const provenanceIds = new Set(content.provenance?.map((batch) => batch.id) ?? []);
  const passageIds = new Set(content.readingPassages?.map((passage) => passage.id) ?? []);
  for (const batch of content.provenance ?? []) {
    if (!batch.title.trim() || !batch.license.trim() || !batch.attribution.trim() || !contentStatuses.has(batch.status)) errors.push(`provenance ${batch.id}: incomplete or invalid batch metadata`);
  }
  for (const passage of content.readingPassages ?? []) {
    if (passage.text.trim().length < 40) errors.push(`reading passage ${passage.id}: passage is too short`);
    if (!levels.has(passage.level)) errors.push(`reading passage ${passage.id}: invalid CEFR ${passage.level}`);
    if (!contentStatuses.has(passage.status)) errors.push(`reading passage ${passage.id}: invalid content status ${passage.status}`);
    if (!provenanceIds.has(passage.provenanceId)) errors.push(`reading passage ${passage.id}: unknown provenance ${passage.provenanceId}`);
    if (passage.status === "published" && content.provenance?.find((batch) => batch.id === passage.provenanceId)?.status !== "published") errors.push(`reading passage ${passage.id}: published content requires published provenance`);
  }
  content.placement?.forEach((exercise) => {
    validateExercise(exercise, true);
    const key = `placement ${exercise.id}`;
    if (!contentStatuses.has(exercise.status)) errors.push(`${key}: invalid content status ${exercise.status}`);
    if (!exercise.options || exercise.options.length !== 4) errors.push(`${key}: exactly four choices are required`);
    if (!exercise.explanation?.trim() || exercise.explanation.trim().length < 12) errors.push(`${key}: substantive explanation is required`);
    if (genericPlacementExplanation(exercise.explanation ?? "")) errors.push(`${key}: explanation is generic rather than instructional`);
    if (!exercise.subtopic.trim()) errors.push(`${key}: subtopic is required`);
    if (!Number.isFinite(exercise.difficulty) || exercise.difficulty < 0 || exercise.difficulty > 1) errors.push(`${key}: difficulty must be between 0 and 1`);
    if (!Number.isFinite(exercise.discrimination) || exercise.discrimination < 0.45 || exercise.discrimination > 2.2) errors.push(`${key}: discrimination must be between 0.45 and 2.2`);
    if (!provenanceIds.has(exercise.provenanceId)) errors.push(`${key}: unknown provenance ${exercise.provenanceId}`);
    if (exercise.dimension === "reading" && (!exercise.passageId || !passageIds.has(exercise.passageId))) errors.push(`${key}: reading item requires a valid passage`);
    if (exercise.dimension !== "reading" && exercise.passageId) errors.push(`${key}: non-reading item cannot reference a passage`);
    if (exercise.status === "published" && content.provenance?.find((batch) => batch.id === exercise.provenanceId)?.status !== "published") errors.push(`${key}: published content requires published provenance`);
  });
  return errors;
}

export function assertValidLearningContent(content: LearningContent): void {
  const errors = validateLearningContent(content);
  if (errors.length) throw new Error(`Learning content validation failed (${errors.length}):\n${errors.join("\n")}`);
}
