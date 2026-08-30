import type { GrammarTopic } from "@/types/domain";

const normalized = (value: string) => value.trim().toLocaleLowerCase().replace(/\s+/g, " ");
const placeholderPattern = /build accurate control|this example demonstrates|retrieve it through guided practice|a common learner form|study the core form/i;

export function grammarLessonIssues(topic: GrammarTopic): string[] {
  const issues: string[] = [];
  const key = `grammar ${topic.id}`;
  if (topic.explanation.length < 400) issues.push(`${key}: explanation is too short`);
  if (!topic.explanation.includes("Tiếng Việt:")) issues.push(`${key}: Vietnamese support is missing`);
  if (placeholderPattern.test([topic.description, topic.explanation, ...topic.examples.map((example) => example.sentence), ...topic.commonMistakes.flatMap((mistake) => [mistake.incorrect, mistake.correct, mistake.explanation])].join(" "))) issues.push(`${key}: placeholder or generic copy remains`);
  if (topic.structures.length < 2 || topic.structures.some((structure) => structure.trim().length < 4)) issues.push(`${key}: substantive form coverage is incomplete`);
  if (topic.examples.length < 3) issues.push(`${key}: fewer than three examples`);
  if (topic.examples.some((example) => example.sentence.trim().length < 8 || (example.explanation?.trim().length ?? 0) < 12)) issues.push(`${key}: malformed or unexplained example`);
  if (new Set(topic.examples.map((example) => normalized(example.sentence))).size !== topic.examples.length) issues.push(`${key}: duplicate examples`);
  if (topic.commonMistakes.length < 2) issues.push(`${key}: fewer than two common mistakes`);
  if (topic.commonMistakes.some((mistake) => normalized(mistake.incorrect) === normalized(mistake.correct) || mistake.explanation.trim().length < 12)) issues.push(`${key}: invalid correction pair`);
  if (topic.subtopics.length < 3 || new Set(topic.subtopics.map((subtopic) => subtopic.id)).size !== topic.subtopics.length) issues.push(`${key}: subtopic coverage is incomplete`);
  return issues;
}

export function isProductionReadyGrammarTopic(topic: GrammarTopic): boolean {
  return grammarLessonIssues(topic).length === 0;
}

export function auditGrammarLessons(topics: GrammarTopic[]) {
  const issues = topics.flatMap(grammarLessonIssues);
  const exampleOwners = new Map<string, string>();
  for (const topic of topics) {
    for (const example of topic.examples) {
      const key = normalized(example.sentence);
      const owner = exampleOwners.get(key);
      if (owner && owner !== topic.id) issues.push(`grammar examples: duplicate between ${owner} and ${topic.id}`);
      else exampleOwners.set(key, topic.id);
    }
  }
  return { productionReady: topics.filter(isProductionReadyGrammarTopic).length, issues };
}
