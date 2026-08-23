import type { Exercise, ExpressionItem, GrammarTopic, PlacementQuestion, VocabularyItem } from "@/types/domain";

const levels = new Set(["A1", "A2", "B1", "B2", "C1", "C2"]);
const normalized = (value: string) => value.trim().toLocaleLowerCase();
const duplicates = (values: string[]) => values.filter((value, index) => values.indexOf(value) !== index);

export interface LearningContent { vocabulary: VocabularyItem[]; grammar: GrammarTopic[]; expressions: ExpressionItem[]; exercises: Exercise[]; placement?: PlacementQuestion[] }

export function validateLearningContent(content: LearningContent): string[] {
  const errors: string[] = [];
  const checkUnique = (label: string, values: string[]) => { for (const value of new Set(duplicates(values))) errors.push(`${label}: duplicate ${value}`); };
  checkUnique("vocabulary id", content.vocabulary.map((item) => item.id));
  checkUnique("vocabulary sense", content.vocabulary.map((item) => `${normalized(item.word)}:${normalized(item.partOfSpeech)}`));
  checkUnique("grammar id", content.grammar.map((item) => item.id));
  checkUnique("expression id", content.expressions.map((item) => item.id));
  checkUnique("expression", content.expressions.map((item) => normalized(item.expression)));
  checkUnique("exercise id", content.exercises.map((item) => item.id));
  if (content.placement) checkUnique("placement id", content.placement.map((item) => item.id));

  for (const item of content.vocabulary) {
    const key = `vocabulary ${item.id}`;
    if (!item.id.trim() || !item.word.trim() || !item.partOfSpeech.trim()) errors.push(`${key}: missing identity field`);
    if (!levels.has(item.cefrLevel)) errors.push(`${key}: invalid CEFR ${item.cefrLevel}`);
    if (!item.meanings.length || item.meanings.some((meaning) => !meaning.definition.trim())) errors.push(`${key}: missing definition`);
    if (!item.examples.length || item.examples.some((example) => example.trim().length < 4)) errors.push(`${key}: malformed example`);
    const synonyms = item.synonyms.map((relation) => normalized(relation.word)); const antonyms = item.antonyms.map((relation) => normalized(relation.word)); const word = normalized(item.word);
    if (synonyms.includes(word)) errors.push(`${key}: self-referencing synonym`);
    if (antonyms.includes(word)) errors.push(`${key}: self-referencing antonym`);
    for (const relation of new Set(duplicates(synonyms))) errors.push(`${key}: duplicate synonym ${relation}`);
    for (const relation of new Set(duplicates(antonyms))) errors.push(`${key}: duplicate antonym ${relation}`);
    for (const conflict of synonyms.filter((relation) => antonyms.includes(relation))) errors.push(`${key}: synonym/antonym conflict ${conflict}`);
    if (item.wordFamily.some((relation) => !relation.word.trim() || !relation.partOfSpeech.trim() || normalized(relation.word) === word)) errors.push(`${key}: malformed word-family relation`);
    if (item.collocations.some((relation) => relation.trim().split(/\s+/).length < 2)) errors.push(`${key}: malformed collocation`);
    for (const relation of new Set(duplicates(item.collocations.map(normalized)))) errors.push(`${key}: duplicate collocation ${relation}`);
  }

  const grammarIds = new Set(content.grammar.map((item) => item.id));
  for (const topic of content.grammar) {
    if (!levels.has(topic.level)) errors.push(`grammar ${topic.id}: invalid CEFR ${topic.level}`);
    for (const prerequisite of topic.prerequisites) if (!grammarIds.has(prerequisite)) errors.push(`grammar ${topic.id}: broken prerequisite ${prerequisite}`);
    if (!topic.explanation.trim() || !topic.examples.length || !topic.commonMistakes.length) errors.push(`grammar ${topic.id}: incomplete lesson content`);
  }

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
  content.placement?.forEach((exercise) => validateExercise(exercise, true));
  return errors;
}

export function assertValidLearningContent(content: LearningContent): void {
  const errors = validateLearningContent(content);
  if (errors.length) throw new Error(`Learning content validation failed (${errors.length}):\n${errors.join("\n")}`);
}
