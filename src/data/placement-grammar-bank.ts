import { grammarTopics } from "@/data/grammar";
import type { CEFRLevel, GrammarTopic, PlacementQuestion } from "@/types/domain";

const levels: CEFRLevel[] = ["A1", "A2", "B1", "B2", "C1", "C2"];
const topicsByLevel = new Map(levels.map((level) => [level, grammarTopics.filter((topic) => topic.level === level)]));
const extraByLevel: Record<CEFRLevel, number> = { A1: 6, A2: 6, B1: 6, B2: 5, C1: 5, C2: 4 };

function distributedTopics(topics: GrammarTopic[], count: number) {
  return new Set(Array.from({ length: count }, (_, index) => topics[Math.floor(index * (topics.length - 1) / (count - 1))].id));
}

const extraTopicIds = new Set(levels.flatMap((level) => [...distributedTopics(topicsByLevel.get(level) ?? [], extraByLevel[level])]));
const analysisStems = [
  (sentence: string) => `Which analysis best explains the grammar in this sentence? “${sentence}”`,
  (sentence: string) => `What grammatical choice is demonstrated most clearly here? “${sentence}”`,
  (sentence: string) => `Which explanation best accounts for the form and meaning of this example? “${sentence}”`,
  (sentence: string) => `Read the sentence and select the most precise grammatical analysis: “${sentence}”`,
];
const exampleStems = [
  (analysis: string) => `Which sentence best demonstrates this grammatical effect? “${analysis}”`,
  (analysis: string) => `Select the example that matches this analysis: “${analysis}”`,
  (analysis: string) => `Which option is the clearest illustration of this explanation? “${analysis}”`,
  (analysis: string) => `Choose the sentence whose form and meaning fit this description: “${analysis}”`,
];

function choicesFor(topic: GrammarTopic, exampleIndex: number, selectAnalysis: boolean) {
  const peers = topicsByLevel.get(topic.level) ?? [];
  const topicIndex = peers.findIndex((candidate) => candidate.id === topic.id);
  const candidates = [0, 1, 5, 11].map((offset) => peers[(topicIndex + offset) % peers.length]);
  return candidates.map((candidate) => {
    const example = candidate.examples[Math.min(exampleIndex, candidate.examples.length - 1)];
    return selectAnalysis ? example.explanation! : example.sentence;
  });
}

function buildQuestion(topic: GrammarTopic, globalIndex: number, exampleIndex: number, selectAnalysis: boolean): PlacementQuestion {
  const example = topic.examples[Math.min(exampleIndex, topic.examples.length - 1)];
  const options = choicesFor(topic, exampleIndex, selectAnalysis);
  const answer = selectAnalysis ? example.explanation! : example.sentence;
  const prompt = selectAnalysis
    ? analysisStems[(globalIndex + exampleIndex) % analysisStems.length](example.sentence)
    : exampleStems[(globalIndex + exampleIndex) % exampleStems.length](example.explanation!);
  return {
    id: `placement-grammar-${topic.id}-${exampleIndex + 1}-${selectAnalysis ? "analysis" : "example"}`,
    itemId: topic.id,
    knowledgeType: "grammar",
    type: selectAnalysis ? "grammar-contrast" : "multiple-choice",
    prompt,
    options,
    answer,
    explanation: `This item draws on ${topic.title}: ${example.explanation}`,
    level: topic.level,
    dimension: "grammar",
    topic: topic.id,
    subtopic: topic.subtopics[exampleIndex % topic.subtopics.length]?.id ?? topic.id,
    difficulty: Math.min(0.97, (levels.indexOf(topic.level) + 0.4 + exampleIndex * 0.08 + globalIndex % 3 * 0.04) / levels.length),
    discrimination: 1.1,
    status: "validated",
    provenanceId: "placement-core-2026-08",
  };
}

export const grammarPlacementQuestions: PlacementQuestion[] = grammarTopics.flatMap((topic, index) => {
  const baseSelectsAnalysis = index % 2 === 0;
  const items = [buildQuestion(topic, index, 0, baseSelectsAnalysis)];
  if (extraTopicIds.has(topic.id)) items.push(buildQuestion(topic, index, 1, !baseSelectsAnalysis));
  return items;
});
