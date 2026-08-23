import { exercises as seedExercises } from "@/data/exercises";
import { grammarTopics } from "@/data/grammar";
import { vocabulary } from "@/data/vocabulary";
import { selectDailyPlan } from "@/lib/learning/selectors";
import { weakestDimension } from "@/lib/learning/mastery";
import { recommendableTopics } from "@/lib/learning/prerequisites";
import { prioritizeMistakes } from "@/lib/learning/mistakes";
import type { AppState, Exercise, PlanCategory, SessionExercise, VocabularyItem } from "@/types/domain";

const unique = <T,>(items: T[]) => [...new Set(items)];
const levels = ["A1", "A2", "B1", "B2", "C1", "C2"] as const;
const atOrBelow = (level: VocabularyItem["cefrLevel"], target: VocabularyItem["cefrLevel"]) => levels.indexOf(level) <= levels.indexOf(target);
const rotate = <T,>(items: T[], offset: number) => items.map((_, index) => items[(index + offset) % items.length]);
function optionsForWord(item: VocabularyItem, mode: "meaning" | "word"): string[] {
  const correct = mode === "meaning" ? item.meanings[0].definition : item.word;
  const distractors = vocabulary
    .filter((candidate) => candidate.id !== item.id && candidate.cefrLevel === item.cefrLevel)
    .map((candidate) => mode === "meaning" ? candidate.meanings[0].definition : candidate.word);
  return rotate(unique([correct, ...distractors]).slice(0, 4), item.id.charCodeAt(item.id.length - 1) % 4);
}

function vocabularyExercise(item: VocabularyItem, source: PlanCategory, preferred?: SessionExercise["targetDimension"]): SessionExercise {
  const seeded = seedExercises.find((exercise) => exercise.itemId === item.id && (
    preferred === "recall" ? exercise.type === "recall" : preferred === "context" ? exercise.type === "fill-blank" : exercise.type === "recognition"
  ));
  if (seeded) return { ...seeded, id: `${source}-${seeded.id}`, source, targetDimension: preferred ?? "recognition" };
  if (preferred === "recall") return { id: `${source}-${item.id}-recall`, itemId: item.id, knowledgeType: "vocabulary", type: "recall", source, targetDimension: "recall", prompt: `Which English word means “${item.meanings[0].vietnamese ?? item.meanings[0].definition}”?`, options: optionsForWord(item, "word"), answer: item.word, explanation: `${item.word}: ${item.meanings[0].definition}` };
  if (preferred === "spelling" && item.wordFamily.length) { const answer = item.wordFamily[0].word; return { id: `${source}-${item.id}-family`, itemId: item.id, knowledgeType: "vocabulary", type: "fill-blank", source, targetDimension: "spelling", prompt: `Choose the ${item.wordFamily[0].partOfSpeech} in the word family of “${item.word}”.`, options: rotate(unique([answer, item.word, ...item.wordFamily.slice(1).map((entry) => entry.word), "none of these"]).slice(0, 4), 1), answer, explanation: `${answer} is the ${item.wordFamily[0].partOfSpeech} form.` }; }
  if (preferred === "context" && item.collocations.length) { const [first, ...rest] = item.collocations[0].split(" "); return { id: `${source}-${item.id}-collocation`, itemId: item.id, knowledgeType: "vocabulary", type: "collocation", source, targetDimension: "context", prompt: `Complete the natural collocation: ___ ${rest.join(" ")}`, options: rotate(unique([first, "do", "make", "perform"]).slice(0, 4), 1), answer: first, explanation: `“${item.collocations[0]}” is the natural combination.` }; }
  if (preferred === "context" && item.synonyms.length) return { id: `${source}-${item.id}-synonym`, itemId: item.id, knowledgeType: "vocabulary", type: "synonym", source, targetDimension: "context", prompt: `Which word is closest in meaning to “${item.word}”?`, options: rotate(unique([item.synonyms[0].word, ...vocabulary.filter((candidate) => candidate.id !== item.id).slice(0, 3).map((candidate) => candidate.word)]), 1), answer: item.synonyms[0].word, explanation: `${item.synonyms[0].word} is similar here, though synonyms are not always interchangeable.` };
  return { id: `${source}-${item.id}-recognition`, itemId: item.id, knowledgeType: "vocabulary", type: "recognition", source, targetDimension: "recognition", prompt: `What does “${item.word}” mean?`, options: optionsForWord(item, "meaning"), answer: item.meanings[0].definition, explanation: item.examples[0] };
}

function grammarExercise(topicId: string, source: PlanCategory): SessionExercise | undefined {
  const seeded = seedExercises.find((exercise) => exercise.itemId === topicId);
  if (seeded) return { ...seeded, id: `${source}-${seeded.id}`, source };
  const topic = grammarTopics.find((candidate) => candidate.id === topicId);
  const mistake = topic?.commonMistakes[0];
  if (!topic || !mistake) return undefined;
  const distractors = grammarTopics.filter((candidate) => candidate.id !== topic.id).slice(0, 3).map((candidate) => candidate.commonMistakes[0]?.incorrect).filter((value): value is string => Boolean(value));
  return { id: `${source}-${topic.id}`, itemId: topic.id, knowledgeType: "grammar", type: "error-correction", source, prompt: `Correct the sentence: “${mistake.incorrect}”`, options: rotate(unique([mistake.correct, ...distractors]).slice(0, 4), 1), answer: mistake.correct, explanation: mistake.explanation };
}

function mistakeExercise(state: AppState, index: number): SessionExercise | undefined {
  const active = prioritizeMistakes(state.mistakes);
  const mistake = active[index % active.length];
  if (!mistake) return undefined;
  const seeded = seedExercises.find((exercise) => exercise.itemId === mistake.itemId);
  if (seeded) return { ...seeded, id: `mistake-${seeded.id}-${index}`, source: "mistakes" };
  return { id: `mistake-${mistake.id}-${index}`, itemId: mistake.itemId, knowledgeType: mistake.knowledgeType, type: mistake.exerciseType as Exercise["type"], source: "mistakes", prompt: mistake.label, options: unique([mistake.correctAnswer, mistake.wrongAnswer, "Not enough context", "None of these"]), answer: mistake.correctAnswer, explanation: `You previously answered “${mistake.wrongAnswer}”.` };
}

export function buildStudySession(state: AppState, now = new Date()): SessionExercise[] {
  const plan = selectDailyPlan(state, now);
  const startOfDay = new Date(now); startOfDay.setHours(0, 0, 0, 0);
  const overdue = (value?: string) => Boolean(value && new Date(value) < startOfDay);
  const dueToday = (value?: string) => Boolean(value && new Date(value) >= startOfDay && new Date(value) <= now);
  const learnedIds = new Set(state.vocabularyProgress.map((item) => item.itemId));
  const learnedGrammarIds = new Set(state.grammarProgress.map((item) => item.topicId));
  const vocabularyBySource: Partial<Record<PlanCategory, VocabularyItem[]>> = {
    overdueVocabulary: state.vocabularyProgress.filter((item) => overdue(item.review.nextReview)).sort((a, b) => a.review.nextReview.localeCompare(b.review.nextReview)).map((item) => vocabulary.find((word) => word.id === item.itemId)).filter((item): item is VocabularyItem => Boolean(item)),
    dueVocabulary: state.vocabularyProgress.filter((item) => dueToday(item.review.nextReview)).map((item) => vocabulary.find((word) => word.id === item.itemId)).filter((item): item is VocabularyItem => Boolean(item)),
    weakVocabulary: state.vocabularyProgress.filter((item) => item.mastery.overall < 60).sort((a, b) => a.mastery.overall - b.mastery.overall).map((item) => vocabulary.find((word) => word.id === item.itemId)).filter((item): item is VocabularyItem => Boolean(item)),
    newVocabulary: vocabulary.filter((item) => !learnedIds.has(item.id) && atOrBelow(item.cefrLevel, state.settings.currentLevel)),
  };
  const grammarBySource: Partial<Record<PlanCategory, string[]>> = {
    overdueGrammar: state.grammarProgress.filter((item) => overdue(item.review.nextReview)).map((item) => item.topicId),
    dueGrammar: state.grammarProgress.filter((item) => dueToday(item.review.nextReview)).map((item) => item.topicId),
    weakGrammar: state.grammarProgress.filter((item) => item.mastery < 60).sort((a, b) => a.mastery - b.mastery).map((item) => item.topicId),
    newGrammar: recommendableTopics(grammarTopics, state.grammarProgress).filter((item) => !learnedGrammarIds.has(item.id) && atOrBelow(item.level, state.settings.currentLevel)).map((item) => item.id),
  };

  const result: SessionExercise[] = [];
  for (const allocation of plan.allocations) {
    for (let index = 0; index < allocation.count; index += 1) {
      if (allocation.category === "mistakes") {
        const exercise = mistakeExercise(state, index); if (exercise) result.push(exercise); continue;
      }
      const words = vocabularyBySource[allocation.category];
      if (words?.length) {
        const word = words[index % words.length];
        const progress = state.vocabularyProgress.find((item) => item.itemId === word.id);
        result.push(vocabularyExercise(word, allocation.category, progress ? weakestDimension(progress.mastery) : index % 2 ? "recall" : "recognition"));
        continue;
      }
      const topics = grammarBySource[allocation.category];
      if (topics?.length) { const exercise = grammarExercise(topics[index % topics.length], allocation.category); if (exercise) result.push(exercise); }
    }
  }
  return result.length ? result : seedExercises.slice(0, 5).map((exercise) => ({ ...exercise, source: "mistakes" }));
}
