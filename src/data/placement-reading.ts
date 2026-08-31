import type { CEFRLevel, PlacementQuestion, ReadingPassage } from "@/types/domain";
import { additionalReadingPassages, additionalReadingQuestions } from "@/data/placement-reading-bank";

const provenanceId = "placement-core-2026-08";
const CEFR_LEVELS: CEFRLevel[] = ["A1", "A2", "B1", "B2", "C1", "C2"];

const coreReadingPassages: ReadingPassage[] = [
  { id: "reading-a1-library", title: "At the library", level: "A1", status: "validated", provenanceId, text: "Mina goes to the library after school on Tuesday. She returns one book and borrows a book about animals. The library closes at six, so she leaves at half past five." },
  { id: "reading-a2-garden", title: "A shared garden", level: "A2", status: "validated", provenanceId, text: "People in West Street turned an empty space into a small garden last spring. Neighbours grow vegetables there and meet on Saturday mornings. New members do not need gardening experience, but they should bring their own gloves." },
  { id: "reading-b1-remote", title: "A different workday", level: "B1", status: "validated", provenanceId, text: "When Ravi began working from home, he expected to save time and feel less tired. He did enjoy avoiding the crowded train, but he found it difficult to stop working in the evening. He now takes a short walk at the end of the day. The walk creates a clear boundary between work and free time." },
  { id: "reading-b2-repair", title: "Repair cafés", level: "B2", status: "validated", provenanceId, text: "At a repair café, volunteers help visitors mend household objects that might otherwise be discarded. The aim is not merely to offer a free repair service. Visitors are encouraged to observe, ask questions, and attempt part of the repair themselves. Supporters argue that this exchange of practical knowledge is as valuable as the reduction in waste." },
  { id: "reading-c1-forecast", title: "The limits of a forecast", level: "C1", status: "validated", provenanceId, text: "A forecast can appear precise while resting on assumptions that remain highly uncertain. This does not make forecasting pointless; models can clarify which outcomes are plausible and which variables matter most. Trouble arises when a single projection is presented without its range of uncertainty, inviting readers to mistake a conditional estimate for an inevitable result." },
  { id: "reading-c2-memory", title: "Remembering together", level: "C2", status: "validated", provenanceId, text: "Public memory is sometimes treated as an archive from which a society simply retrieves an intact past. Yet commemoration is also an act of selection: monuments are raised, ceremonies revised, and once-marginal accounts brought into view. The resulting narrative need not be fraudulent merely because it changes. Rather, its revisions reveal the concerns through which each generation interprets what it has inherited." },
];

type ReadingSeed = [CEFRLevel, string, string, string, string[], string, string];
const readingSeeds: ReadingSeed[] = [
  ["A1", "reading-a1-library", "detail", "When does Mina go to the library?", ["On Tuesday", "On Monday", "On Friday", "On Sunday"], "On Tuesday", "The first sentence says that Mina visits on Tuesday."],
  ["A1", "reading-a1-library", "detail", "What kind of book does Mina borrow?", ["A book about animals", "A book about trains", "A school dictionary", "A cookery book"], "A book about animals", "The passage directly identifies the subject as animals."],
  ["A1", "reading-a1-library", "time", "Why does Mina leave before six?", ["The library closes at six", "Her class starts at six", "The bookshop opens at six", "Her bus leaves at four"], "The library closes at six", "She leaves at 5:30 because the library closes at 6:00."],
  ["A2", "reading-a2-garden", "purpose", "What did the neighbours create?", ["A shared garden", "A sports club", "A street market", "A new car park"], "A shared garden", "They changed the empty space into a garden."],
  ["A2", "reading-a2-garden", "detail", "When do neighbours usually meet?", ["On Saturday mornings", "On Sunday evenings", "Every weekday", "On Friday nights"], "On Saturday mornings", "The passage gives Saturday mornings as the meeting time."],
  ["A2", "reading-a2-garden", "requirement", "What should a new member bring?", ["Their own gloves", "Gardening experience", "Vegetable seeds", "A membership card"], "Their own gloves", "Experience is not required, but members should bring gloves."],
  ["B1", "reading-b1-remote", "contrast", "What unexpected problem did Ravi have?", ["He kept working too late", "He missed the crowded train", "He had no work to do", "He disliked walking"], "He kept working too late", "Although commuting improved, Ravi found it hard to stop work in the evening."],
  ["B1", "reading-b1-remote", "purpose", "Why does Ravi walk at the end of the day?", ["To separate work from free time", "To reach the train station", "To meet his manager", "To make the journey longer"], "To separate work from free time", "The walk creates a boundary between his working and personal time."],
  ["B1", "reading-b1-remote", "inference", "How did Ravi's view of home working change?", ["He discovered both benefits and difficulties", "He decided it had no benefits", "He found it exactly as expected", "He stopped working from home immediately"], "He discovered both benefits and difficulties", "He saved commuting time but needed a new way to end the workday."],
  ["B2", "reading-b2-repair", "main-idea", "What broader purpose do repair cafés serve?", ["They share skills while reducing waste", "They replace all professional repair shops", "They sell inexpensive household objects", "They prevent visitors from repairing things"], "They share skills while reducing waste", "The passage emphasizes both knowledge exchange and waste reduction."],
  ["B2", "reading-b2-repair", "detail", "What are visitors encouraged to do?", ["Take part in the repair", "Leave the object and return later", "Pay for a replacement", "Avoid asking questions"], "Take part in the repair", "Visitors observe, ask questions, and attempt some of the work."],
  ["B2", "reading-b2-repair", "reference", "What does “this exchange” refer to?", ["Sharing practical knowledge", "Discarding broken objects", "Offering paid employment", "Selling repaired goods"], "Sharing practical knowledge", "The phrase points back to volunteers and visitors working and learning together."],
  ["C1", "reading-c1-forecast", "main-idea", "What is the writer's main claim?", ["Forecasts are useful when uncertainty is made clear", "Precise forecasts are always reliable", "All forecasting should be abandoned", "Models remove the need for assumptions"], "Forecasts are useful when uncertainty is made clear", "The writer defends forecasting while warning against hiding uncertainty."],
  ["C1", "reading-c1-forecast", "inference", "What error may readers make?", ["Treat a conditional projection as certain", "Ignore every numerical result", "Assume all variables are equally important", "Confuse a model with historical evidence"], "Treat a conditional projection as certain", "The final clause warns against reading an estimate as an inevitable outcome."],
  ["C1", "reading-c1-forecast", "stance", "How does the writer view models?", ["Useful but dependent on assumptions", "Accurate only when they show one result", "Misleading in every situation", "Unnecessary when uncertainty is high"], "Useful but dependent on assumptions", "Models can clarify possibilities, but their assumptions and ranges matter."],
  ["C2", "reading-c2-memory", "main-idea", "How does the passage characterize public memory?", ["As an evolving interpretation of the past", "As a complete and unchanging archive", "As a necessarily dishonest invention", "As a set of private recollections only"], "As an evolving interpretation of the past", "Selection and revision make public memory interpretive and changeable."],
  ["C2", "reading-c2-memory", "inference", "What do revisions to commemoration reveal?", ["The concerns of the generation making them", "That inherited events never occurred", "A refusal to consider marginal accounts", "The permanent meaning of every monument"], "The concerns of the generation making them", "The final sentence explicitly connects revisions with each generation's concerns."],
  ["C2", "reading-c2-memory", "argument", "Why is a changing narrative not necessarily fraudulent?", ["Selection is part of how societies interpret inheritance", "All historical narratives are equally accurate", "Ceremonies preserve every account without alteration", "Public memory has no connection to the past"], "Selection is part of how societies interpret inheritance", "The writer distinguishes interpretive revision from deliberate falsification."],
];

const coreReadingPlacementQuestions: PlacementQuestion[] = readingSeeds.map(([level, passageId, subtopic, prompt, options, answer, explanation], index) => ({
  id: `placement-reading-${level.toLowerCase()}-${index + 1}`,
  itemId: passageId,
  knowledgeType: "vocabulary",
  type: "context",
  prompt,
  options,
  answer,
  explanation,
  level,
  dimension: "reading",
  topic: "reading-comprehension",
  subtopic,
  difficulty: Math.min(0.96, (CEFR_LEVELS.indexOf(level) + 0.38 + index % 3 * 0.1) / CEFR_LEVELS.length),
  discrimination: 1.05,
  status: "validated",
  provenanceId,
  passageId,
}));

export const readingPassages: ReadingPassage[] = [...coreReadingPassages, ...additionalReadingPassages];
export const readingPlacementQuestions: PlacementQuestion[] = [...coreReadingPlacementQuestions, ...additionalReadingQuestions];
export const readingPassagesById = new Map(readingPassages.map((passage) => [passage.id, passage]));
