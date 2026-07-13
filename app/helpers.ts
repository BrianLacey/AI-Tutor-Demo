export const camelToEnglish = (property: string) =>
  property
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (m) => m.toUpperCase())
    .trim();

export const profileBuildInstructions = (profile) => {
  const baseInstructions =
    "You are a tutor helping a student prepare for the AP Biology exam. Whenever the student reveals something worth remembering — their name, communication preferences, test date, strengths/weaknesses, practice preferences, or how they're feeling about the exam — call the saveProfileInfo tool with just the new information. Don't call it for trivial or already-known details. Always continue with a normal conversational reply after any tool call.";

  if (!profile) return baseInstructions;

  const additionalInstructions = [];

  if (profile.preferredName) {
    additionalInstructions.push(
      `The student's name is ${profile.preferredName}`,
    );
  }
  if (profile.examDate) {
    const daysLeft = Math.ceil(
      (new Date(profile.examDate).getTime() - Date.now()) / 86_400_000,
    );
    additionalInstructions.push(
      daysLeft > 0
        ? `Exam is in ${daysLeft} days (${profile.examDate}). Adjust pacing: if fewer than 14 days remain, prioritize triage and high-yield review over deep new content.`
        : `The exam date has passed or is today — focus on final review.`,
    );
  }
  if (profile.unitMastery) {
    const weakUnits = Object.entries(profile.unitMastery)
      .filter(([, level]) => level === "weak")
      .map(([unit]) => unit.replace(/_/g, " "));
    if (weakUnits.length > 0) {
      additionalInstructions.push(
        `Prioritize review of these weak units: ${weakUnits.join(", ")}.`,
      );
    }
  }

  if (profile.recurringErrorPatterns?.length) {
    additionalInstructions.push(
      `Watch for these recurring error patterns and correct them when relevant: ${profile.recurringErrorPatterns.join("; ")}.`,
    );
  }

  if (profile.frqComfort === "low") {
    additionalInstructions.push(
      "The student struggles with FRQ structure — emphasize claim-evidence-reasoning format, showing work on calculations, and including units.",
    );
  }

  if (profile.mathStatsComfort === "low") {
    additionalInstructions.push(
      "The student is weak on stats/math (chi-square, standard error, Hardy-Weinberg) — walk through calculations step-by-step rather than assuming comfort with the formulas.",
    );
  }

  if (profile.strongerFormat && profile.strongerFormat !== "balanced") {
    additionalInstructions.push(
      `The student performs notably better on ${profile.strongerFormat.replace("_", " ")} than the other format — bias practice toward their weaker format to close the gap.`,
    );
  }

  if (profile.weeklyStudyTimeMinutes) {
    additionalInstructions.push(
      `The student has about ${profile.weeklyStudyTimeMinutes} minutes/week to study — scope suggestions realistically.`,
    );
  }

  if (profile.practiceStylePreference) {
    const styleMap = {
      flashcard_recall: "quick recall-style drills",
      worked_frq_walkthrough: "worked FRQ walkthroughs with full explanations",
      cold_quizzing: "being quizzed cold with feedback after",
    };
    additionalInstructions.push(
      `Prefer ${styleMap[profile.practiceStylePreference]} when offering practice.`,
    );
  }

  if (profile.wantsHintsBeforeAnswers === false) {
    additionalInstructions.push(
      "Let the student attempt problems fully before giving hints or answers.",
    );
  }

  if (profile.respondsToMnemonics) {
    additionalInstructions.push(
      "The student responds well to mnemonics — use them when introducing memorization-heavy content.",
    );
  }

  if (profile.targetScore) {
    additionalInstructions.push(
      `Target score is a ${profile.targetScore} — ${
        profile.targetScore >= 4
          ? "don't shy away from edge-case content and nuance."
          : "prioritize solidifying core concepts over edge cases."
      }`,
    );
  }

  if (profile.examAnxietyLevel === "high") {
    additionalInstructions.push(
      "The student has expressed exam anxiety — keep tone encouraging, break work into small wins, and avoid overwhelming them with too much at once.",
    );
  }

  if (profile.confidenceVsPerformanceGap === "overconfident") {
    additionalInstructions.push(
      "The student tends to be overconfident — gently push them toward foundational review and practice FRQs rather than skipping ahead.",
    );
  } else if (profile.confidenceVsPerformanceGap === "underconfident") {
    additionalInstructions.push(
      "The student tends to be underconfident despite reasonable performance — encourage more practice tests and reinforce genuine progress.",
    );
  }

  return additionalInstructions.length > 0
    ? `${baseInstructions} Known context about this student: ${additionalInstructions.join(" ")}`
    : baseInstructions;
};
