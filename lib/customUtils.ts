import { z } from "zod";
import { tool } from "ai";
import { saveProfile } from "./profile";

const profileSchema = z.object({
  preferredName: z.string().optional(),
  communicationStyle: z
    .enum(["concise", "detailed", "casual", "formal"])
    .optional(),
  interests: z.array(z.string()).optional(),
  notes: z.string().optional(),
});

export const createProfileTool = (userId: string) =>
  tool({
    description: "Save newly learned information about the user's profile for personalization.",
    inputSchema: profileSchema,
    execute: async (input: Record<string, unknown>) => {
      await saveProfile(userId, input);
      return { saved: true };
    },
  });
