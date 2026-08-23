import { z } from "zod";
import { appStateSchema } from "@/lib/validation/app-state";

const isoDate = z.string().datetime({ offset: true });
const idempotencyKey = z.string().min(16).max(160);

export const studySessionWriteSchema = z.object({
  idempotencyKey,
  startedAt: isoDate,
  completedAt: isoDate,
  state: appStateSchema,
  items: z.array(z.object({
    knowledgeType: z.enum(["vocabulary", "grammar", "expression"]),
    knowledgeContentId: z.string().min(1).max(160),
    exerciseType: z.string().min(1).max(100),
    answer: z.string().max(2_000),
    correct: z.boolean(),
    rating: z.enum(["again", "hard", "good", "easy"]),
    position: z.number().int().nonnegative(),
  })).min(1).max(200),
}).refine((value) => new Date(value.completedAt) >= new Date(value.startedAt), { path: ["completedAt"], message: "Completion must follow start." });

export const placementWriteSchema = z.object({
  idempotencyKey,
  startedAt: isoDate,
  state: appStateSchema.refine((state) => Boolean(state.placement), { message: "Placement result is required." }),
});

export type StudySessionWrite = z.infer<typeof studySessionWriteSchema>;
export type PlacementWrite = z.infer<typeof placementWriteSchema>;
