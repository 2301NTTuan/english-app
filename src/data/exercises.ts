import type { Exercise } from "@/types/domain";

export const exercises: Exercise[] = [
  { id: "x1", knowledgeType: "vocabulary", itemId: "v1", type: "recognition", prompt: "What does ‘acquire’ mean?", options: ["to refuse", "to gain or obtain", "to divide", "to forget"], answer: "to gain or obtain", explanation: "Acquire means to gain knowledge, skills, or possession." },
  { id: "x2", knowledgeType: "vocabulary", itemId: "v1", type: "recall", prompt: "Which English word means ‘đạt được, có được’?", options: ["acquire", "avoid", "assume", "announce"], answer: "acquire" },
  { id: "x3", knowledgeType: "vocabulary", itemId: "v1", type: "fill-blank", prompt: "She _____ considerable experience while working abroad.", options: ["acquired", "refused", "lost", "ignored"], answer: "acquired" },
  { id: "x4", knowledgeType: "vocabulary", itemId: "v25", type: "antonym", prompt: "Choose the opposite of ‘temporary’.", options: ["brief", "permanent", "minor", "frequent"], answer: "permanent" },
  { id: "x5", knowledgeType: "vocabulary", itemId: "v15", type: "synonym", prompt: "Which word is closest to ‘evaluate’?", options: ["assess", "refuse", "expand", "collect"], answer: "assess" },
  { id: "x6", knowledgeType: "expression", itemId: "e5", type: "collocation", prompt: "___ a decision", options: ["do", "make", "build", "create"], answer: "make", explanation: "English uses the collocation ‘make a decision’." },
  { id: "g1", knowledgeType: "grammar", itemId: "present-perfect", type: "multiple-choice", prompt: "I _____ here for three years.", options: ["live", "lived", "have lived", "am living yesterday"], answer: "have lived" },
  { id: "g2", knowledgeType: "grammar", itemId: "past-simple", type: "fill-blank", prompt: "We _____ Hue last year. (visit)", options: ["visit", "visited", "have visited", "visiting"], answer: "visited" },
  { id: "g3", knowledgeType: "grammar", itemId: "perfect-vs-past", type: "error-correction", prompt: "Correct the sentence: ‘I have seen her yesterday.’", options: ["I saw her yesterday.", "I have saw her yesterday.", "I see her yesterday.", "I had see her yesterday."], answer: "I saw her yesterday.", explanation: "Use past simple with a finished time such as yesterday." },
];
