import { z } from "zod";
import { tool } from "ai";
import { saveProfile } from "./profile";

const profileSchema = z.object({
  preferredName: z.string().optional(),
  communicationStyle: z
    .enum(["concise", "detailed", "casual", "formal"])
    .optional(),
  unitMastery: z
    .array(
      z.object({
        unit: z.enum([
          "chemistryOfLife",
          "cellStructure",
          "cellularEnergetics",
          "cellCommunicationCycle",
          "heredity",
          "geneExpression",
          "naturalSelection",
          "ecology",
        ]),
        level: z.enum(["weak", "developing", "solid"]),
      }),
    )
    .optional(),
  recurringErrorPatterns: z.array(z.string()).optional(),
  strongerFormat: z.enum(["multiple_choice", "frq", "balanced"]).optional(),
  examDate: z.string().optional(),
  weeklyStudyTimeMinutes: z.number().optional(),
  practiceStylePreference: z
    .enum(["drill_recall", "worked_examples", "cold_quizzing"])
    .optional(),
  wantsHintsBeforeAnswers: z.boolean().optional(),
  respondsToMnemonics: z.boolean().optional(),
  targetScore: z.number().optional(),
  examAnxietyLevel: z.enum(["low", "moderate", "high"]).optional(),
  confidenceVsPerformanceGap: z
    .enum(["overconfident", "underconfident", "calibrated"])
    .optional(),
  notes: z.string().optional(),
});

export const saveProfileTool = (userId: string) =>
  tool({
    description:
      "Save newly learned information about the student's AP Biology exam prep profile — unit mastery, exam format comfort, timeline, practice preferences, or motivational factors.",
    inputSchema: profileSchema,
    execute: async (input: Record<string, unknown>) => {
      await saveProfile(userId, input);
      return { saved: true };
    },
  });
