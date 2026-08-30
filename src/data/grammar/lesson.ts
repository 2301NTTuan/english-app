import type { CEFRLevel, GrammarTopic } from "@/types/domain";

export interface GrammarLessonSpec {
  id: string;
  title: string;
  level: CEFRLevel;
  description: string;
  meaning: string;
  usage: string;
  restrictions: string;
  contrast: string;
  vietnamese: string;
  structures: string[];
  examples: Array<[sentence: string, explanation: string]>;
  mistakes: Array<[incorrect: string, correct: string, explanation: string]>;
  subtopics: string[];
  prerequisites?: string[];
  category?: string;
}

export function lesson(spec: GrammarLessonSpec): GrammarTopic {
  return {
    id: spec.id,
    title: spec.title,
    level: spec.level,
    category: spec.category ?? "Core grammar",
    description: spec.description,
    prerequisites: spec.prerequisites ?? [],
    explanation: [spec.meaning, spec.usage, spec.restrictions, spec.contrast, `Tiếng Việt: ${spec.vietnamese}`, `Form focus: ${spec.structures.join("; ")}.`].join(" "),
    structures: spec.structures,
    examples: spec.examples.map(([sentence, explanation]) => ({ sentence, explanation })),
    commonMistakes: spec.mistakes.map(([incorrect, correct, explanation]) => ({ incorrect, correct, explanation })),
    subtopics: spec.subtopics.map((title, index) => ({ id: `${spec.id}-${index + 1}`, title })),
  };
}
