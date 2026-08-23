import { exercises as curatedExercises } from "@/data/exercises";
import { grammarTopics } from "@/data/grammar";
import { vocabulary } from "@/data/vocabulary";
import type { CEFRLevel, GrammarTopic, PlanCategory, SessionExercise, VocabularyItem } from "@/types/domain";

const levels: CEFRLevel[] = ["A1", "A2", "B1", "B2", "C1", "C2"];
const unique = <T,>(items: T[]) => [...new Set(items)];
const rotate = <T,>(items: T[], offset: number) => items.map((_, index) => items[(index + offset) % items.length]);
const sharedTopic = (a: VocabularyItem, b: VocabularyItem) => (a.topics ?? []).some((topic) => b.topics?.includes(topic));
const contextClue = (item: VocabularyItem) => {
  const stem = item.word.replace(/e$/i, "").slice(0, Math.max(4, item.word.length - 1)).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return item.examples[0].replace(new RegExp(`\\b${stem}[a-z'-]*`, "i"), "___");
};

export function selectVocabularyDistractors(item: VocabularyItem, pool: VocabularyItem[], excludedWords: string[] = [], limit = 3): VocabularyItem[] {
  const excluded = new Set([item.word, ...excludedWords].map((word) => word.toLocaleLowerCase()));
  return pool.filter((candidate) => candidate.id !== item.id && !excluded.has(candidate.word.toLocaleLowerCase())).sort((a, b) => {
    const score = (candidate: VocabularyItem) => (candidate.partOfSpeech === item.partOfSpeech ? 30 : 0) + (6 - Math.abs(levels.indexOf(candidate.cefrLevel) - levels.indexOf(item.cefrLevel))) * 4 + (sharedTopic(item, candidate) ? 8 : 0) + (candidate.word[0] === item.word[0] ? 2 : 0);
    return score(b) - score(a) || (a.frequencyRank ?? 99_999) - (b.frequencyRank ?? 99_999) || a.id.localeCompare(b.id);
  }).slice(0, limit);
}

function choices(correct: string, distractors: string[], seed: string): string[] | undefined {
  const values = unique([correct, ...distractors]).slice(0, 4);
  if (values.length !== 4 || values.filter((value) => value === correct).length !== 1) return undefined;
  return rotate(values, seed.split("").reduce((sum, character) => sum + character.charCodeAt(0), 0) % values.length);
}

export function validGeneratedExercise(exercise?: SessionExercise): exercise is SessionExercise {
  if (!exercise?.prompt.trim() || !exercise.answer.trim() || !exercise.options) return false;
  return exercise.options.length === 4 && new Set(exercise.options.map((option) => option.toLocaleLowerCase())).size === 4 && exercise.options.filter((option) => option === exercise.answer).length === 1;
}

export function generateVocabularyExercise(item: VocabularyItem, source: PlanCategory, preferred: SessionExercise["targetDimension"] = "recognition", showVietnamese = true): SessionExercise {
  const curated = curatedExercises.find((exercise) => exercise.itemId === item.id && (preferred === "recall" ? exercise.type === "recall" : preferred === "context" ? exercise.type === "fill-blank" : exercise.type === "recognition"));
  if (curated) return { ...curated, id: `${source}-${curated.id}`, source, targetDimension: preferred, difficulty: curated.difficulty ?? (preferred === "recognition" ? 1 : 2) };
  const relatedWords = [...item.synonyms, ...item.antonyms].map((relation) => relation.word);
  const distractors = selectVocabularyDistractors(item, vocabulary, relatedWords);
  const base = { itemId: item.id, knowledgeType: "vocabulary" as const, source };

  if (preferred === "recall") {
    const options = choices(item.word, distractors.map((candidate) => candidate.word), `${item.id}-recall`);
    if (options) return { ...base, id: `${source}-${item.id}-recall`, type: "recall", targetDimension: "recall", difficulty: 2, prompt: `Which English word means “${showVietnamese && item.meanings[0].vietnamese ? item.meanings[0].vietnamese : item.meanings[0].definition}”?`, options, answer: item.word, explanation: `${item.word}: ${item.meanings[0].definition}` };
  }

  if (preferred === "spelling" && item.wordFamily.length) {
    const target = item.wordFamily[0]; const familyDistractors = unique([item.word, ...item.wordFamily.slice(1).map((relation) => relation.word), ...distractors.map((candidate) => candidate.word)]);
    const options = choices(target.word, familyDistractors, `${item.id}-family`);
    if (options) return { ...base, id: `${source}-${item.id}-family`, type: "word-family", targetDimension: "spelling", difficulty: 3, prompt: `Choose the ${target.partOfSpeech} in the word family of “${item.word}”.`, options, answer: target.word, explanation: `${target.word} is the ${target.partOfSpeech} form related to ${item.word}.` };
  }

  if (preferred === "context") {
    const options = choices(item.word, distractors.map((candidate) => candidate.word), `${item.id}-context`);
    if (options) return { ...base, id: `${source}-${item.id}-context`, type: "context", targetDimension: "context", difficulty: 3, prompt: `Which vocabulary item is demonstrated by this context? “${contextClue(item)}”`, options, answer: item.word, explanation: `${item.word} means ${item.meanings[0].definition}. Full example: ${item.examples[0]}` };
  }

  const meaningDistractors = selectVocabularyDistractors(item, vocabulary, relatedWords).map((candidate) => candidate.meanings[0].definition);
  const options = choices(item.meanings[0].definition, meaningDistractors, `${item.id}-recognition`);
  if (options) return { ...base, id: `${source}-${item.id}-recognition`, type: "recognition", targetDimension: "recognition", difficulty: 1, prompt: `What does “${item.word}” mean?`, options, answer: item.meanings[0].definition, explanation: item.examples[0] };

  const fallback = curatedExercises.find((exercise) => exercise.knowledgeType === "vocabulary")!;
  return { ...fallback, id: `${source}-${item.id}-fallback`, itemId: item.id, source, targetDimension: preferred };
}

export function generateRelationExercise(item: VocabularyItem, relation: "synonym" | "antonym", source: PlanCategory): SessionExercise | undefined {
  const correct = item[relation === "synonym" ? "synonyms" : "antonyms"][0]?.word;
  if (!correct) return undefined;
  const excluded = [...item.synonyms, ...item.antonyms].map((entry) => entry.word);
  const options = choices(correct, selectVocabularyDistractors(item, vocabulary, excluded).map((candidate) => candidate.word), `${item.id}-${relation}`);
  if (!options) return undefined;
  return { id: `${source}-${item.id}-${relation}`, itemId: item.id, knowledgeType: "vocabulary", type: relation, source, targetDimension: "context", difficulty: 3, prompt: `${relation === "synonym" ? "Closest in meaning" : "Opposite in meaning"} to “${item.word}”?`, options, answer: correct, explanation: relation === "synonym" ? "The words are related in this context but may differ in register or intensity." : `${correct} contrasts with ${item.word}.` };
}

export function generateGrammarExercise(topicId: string, source: PlanCategory, topics: GrammarTopic[] = grammarTopics): SessionExercise | undefined {
  const curated = curatedExercises.find((exercise) => exercise.itemId === topicId);
  if (curated) return { ...curated, id: `${source}-${curated.id}`, source, difficulty: curated.difficulty ?? 3 };
  const topic = topics.find((candidate) => candidate.id === topicId); const mistake = topic?.commonMistakes[0];
  if (!topic || !mistake) return undefined;
  const distractors = unique(topics.filter((candidate) => candidate.id !== topic.id && candidate.level === topic.level).map((candidate) => candidate.commonMistakes[0]?.incorrect).filter((value): value is string => Boolean(value))).slice(0, 3);
  const options = choices(mistake.correct, distractors, topic.id);
  if (!options) return undefined;
  return { id: `${source}-${topic.id}`, itemId: topic.id, knowledgeType: "grammar", type: topic.title.toLocaleLowerCase().includes(" vs ") ? "grammar-contrast" : "error-correction", source, difficulty: topic.level === "A1" || topic.level === "A2" ? 2 : topic.level === "B1" ? 3 : 4, prompt: `Correct the sentence: “${mistake.incorrect}”`, options, answer: mistake.correct, explanation: mistake.explanation };
}
