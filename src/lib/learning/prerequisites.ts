import type { GrammarProgress, GrammarTopic } from "@/types/domain";

export function prerequisitesMet(topic: GrammarTopic, progress: GrammarProgress[], threshold = 70): boolean {
  return topic.prerequisites.every((id) => (progress.find((item) => item.topicId === id)?.mastery ?? 0) >= threshold);
}

export function recommendableTopics(topics: GrammarTopic[], progress: GrammarProgress[]): GrammarTopic[] {
  return topics.filter((topic) => !progress.some((item) => item.topicId === topic.id && item.mastery >= 85) && prerequisitesMet(topic, progress));
}
