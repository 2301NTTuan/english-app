import type { GrammarTopic } from "@/types/domain";

const topic = (id: string, title: string, level: GrammarTopic["level"], description: string, prerequisites: string[], structures: string[], example: string, mistake: [string, string, string], subtopics: string[]): GrammarTopic => ({
  id, title, level, category: "Core grammar", description, prerequisites,
  explanation: `${title} helps you express time, relationships, and meaning accurately. Study the pattern, notice it in context, then retrieve it through practice.`,
  structures, examples: [{ sentence: example, explanation: `A natural example of ${title.toLowerCase()}.` }],
  commonMistakes: [{ incorrect: mistake[0], correct: mistake[1], explanation: mistake[2] }],
  subtopics: subtopics.map((title, index) => ({ id: `${id}-${index + 1}`, title })),
});

const detailedTopics: GrammarTopic[] = [
  topic("be", "Be: am / is / are", "A1", "Use be to identify and describe.", [], ["I am", "he/she/it is", "you/we/they are"], "She is a student.", ["She are happy.", "She is happy.", "Use is with she."], ["affirmative", "negative", "questions"]),
  topic("present-simple", "Present Simple", "A1", "Habits, facts, and routines.", ["be"], ["subject + base verb", "he/she/it + verb-s"], "He studies every morning.", ["He study daily.", "He studies daily.", "Add -s in the third person singular."], ["forms", "third person", "frequency"]),
  topic("present-continuous", "Present Continuous", "A1", "Actions happening around now.", ["be"], ["am/is/are + verb-ing"], "They are studying now.", ["They studying.", "They are studying.", "The auxiliary be is required."], ["forms", "spelling", "time markers"]),
  topic("past-simple", "Past Simple", "A2", "Completed past events.", ["present-simple"], ["subject + past form", "did not + base verb"], "We visited Hue last year.", ["I didn't went.", "I didn't go.", "Use the base verb after did."], ["regular verbs", "irregular verbs", "questions"]),
  topic("present-perfect", "Present Perfect", "A2", "Past events connected to now.", ["past-simple"], ["have/has + past participle"], "I have lived here for three years.", ["I have seen him yesterday.", "I saw him yesterday.", "Use past simple with a finished time."], ["structure", "past participle", "since and for", "already yet just"]),
  topic("first-conditional", "First Conditional", "A2", "Likely future results.", ["present-simple"], ["if + present, will + base verb"], "If I finish early, I will call you.", ["If I will finish, I call.", "If I finish, I will call.", "Use present tense in the if-clause."], ["if clause", "result clause"]),
  topic("perfect-vs-past", "Present Perfect vs Past Simple", "B1", "Choose between life experience/current relevance and finished past time.", ["present-perfect", "past-simple"], ["have/has + participle", "past form + finished time"], "I have visited Da Nang, but I went there in 2024.", ["I have gone last week.", "I went last week.", "A finished time requires past simple."], ["unfinished time", "finished time", "experience"]),
  topic("passive", "Passive Voice", "B1", "Focus on an action or receiver.", ["past-simple"], ["be + past participle"], "The lesson was designed carefully.", ["The lesson designed.", "The lesson was designed.", "A passive form needs be."], ["present passive", "past passive", "agent"]),
  topic("reported-speech", "Reported Speech", "B1", "Report another person's words.", ["past-simple"], ["said (that) + backshifted clause"], "She said that she was tired.", ["She said me.", "She told me.", "Tell takes an object; say does not."], ["statements", "questions", "time words"]),
  topic("third-conditional", "Third Conditional", "B2", "Imagine a different past result.", ["first-conditional", "past-simple"], ["if + had + participle, would have + participle"], "If I had known, I would have helped.", ["If I knew, I would have helped.", "If I had known, I would have helped.", "Use past perfect for the unreal past condition."], ["condition", "result", "inversion"]),
  topic("modal-perfect", "Modal Perfect", "B2", "Make deductions or judgments about the past.", ["present-perfect"], ["modal + have + past participle"], "She might have missed the bus.", ["She might missed it.", "She might have missed it.", "Use have plus a participle."], ["deduction", "regret", "criticism"]),
  topic("inversion", "Advanced Inversion", "C1", "Create emphasis in formal styles.", ["reported-speech", "third-conditional"], ["negative adverbial + auxiliary + subject"], "Rarely have I seen such clarity.", ["Rarely I have seen it.", "Rarely have I seen it.", "Invert auxiliary and subject after negative fronting."], ["negative adverbials", "conditional inversion", "only phrases"]),
  topic("hedging", "Hedging", "C1", "Express appropriate caution and academic distance.", ["modal-perfect"], ["may/might appear to", "tends to suggest"], "The evidence appears to support this view.", ["This proves everyone is wrong.", "This may suggest a different conclusion.", "Academic claims often need calibrated certainty."], ["modal hedges", "lexical hedges", "academic register"]),
  topic("stylistic-inversion", "Stylistic Inversion", "C2", "Control rhythm, emphasis, and literary register.", ["inversion"], ["complement + verb + subject"], "Gone are the days of simple answers.", ["Gone the days are.", "Gone are the days.", "Invert subject and verb in this literary pattern."], ["locative inversion", "complement inversion", "register"]),
  topic("aspect-nuance", "Subtle Tense and Aspect", "C2", "Choose aspect for nuanced viewpoint and discourse effect.", ["hedging", "perfect-vs-past"], ["perfect progressive", "prospective aspect"], "I had been meaning to call you.", ["I was meaning to call since Monday.", "I had been meaning to call since Monday.", "The past perfect progressive frames earlier ongoing intention."], ["viewpoint", "duration", "discourse effects"]),
];

export const curriculumOutline: Record<GrammarTopic["level"], string[]> = {
  A1: ["Verb to be", "Subject pronouns", "Object pronouns", "Possessive adjectives", "Possessive pronouns", "Articles: a / an / the", "Plural nouns", "Demonstratives", "There is / There are", "Have / Have got", "Present Simple", "Present Continuous", "Present Simple vs Present Continuous", "Can / Can't", "Imperatives", "Possessive 's", "Some / Any", "Much / Many", "Countable / Uncountable nouns", "Prepositions of place", "Prepositions of time", "Wh- questions", "Adverbs of frequency", "Basic conjunctions"],
  A2: ["Past Simple", "Past Continuous", "Past Simple vs Past Continuous", "Future with will", "Be going to", "Present Continuous for future", "Comparatives", "Superlatives", "Too / Enough", "Should", "Must", "Have to", "Must vs Have to", "Gerund basics", "Infinitive basics", "Present Perfect basics", "For / Since", "Already / Yet / Just", "Ever / Never", "First Conditional", "Relative clauses basics", "Adverbs", "Quantifiers", "Both / Either / Neither basics"],
  B1: ["Present Perfect vs Past Simple", "Present Perfect Continuous", "Present Perfect vs Present Perfect Continuous", "Past Perfect", "Past Perfect vs Past Simple", "Future Continuous", "Future Perfect", "Zero Conditional", "First Conditional review", "Second Conditional", "Passive Voice", "Reported Speech", "Defining Relative Clauses", "Non-defining Relative Clauses", "Modal verbs", "Modal deduction basics", "Gerund vs Infinitive", "Used to", "Be used to", "Get used to", "Question tags", "Indirect questions", "So / Such", "Too / Enough", "Both / Either / Neither", "Articles intermediate"],
  B2: ["Third Conditional", "Mixed Conditionals", "Advanced Passive", "Causative: have something done", "Causative: get something done", "Should have", "Could have", "Might have", "Must have", "Can't have", "Wish", "If only", "Reported Speech advanced", "Reporting verbs basics", "Participle clauses", "Reduced relative clauses", "Inversion basics", "Emphasis", "Cleft sentences", "Future Perfect Continuous", "Advanced gerund and infinitive patterns", "Subjunctive basics", "Advanced linking structures", "Complex noun phrases"],
  C1: ["Advanced inversion", "Negative inversion", "Not only... but also inversion", "Conditional inversion", "Had I known...", "Were I to...", "Should you need...", "Advanced modality", "Advanced passive structures", "Advanced reporting verbs", "Nominalisation", "Ellipsis", "Substitution", "Fronting", "Cleft sentences", "Pseudo-cleft sentences", "Advanced participle clauses", "Complex prepositions", "Discourse markers", "Hedging", "Advanced emphasis", "Formal vs informal grammar", "Advanced relative structures", "Advanced conditionals"],
  C2: ["Stylistic inversion", "Complex ellipsis", "Advanced modality nuances", "Tense and aspect nuance", "Formal subjunctive", "Literary grammatical structures", "Register-dependent grammar", "Advanced discourse structures", "Nuanced conditionals", "Complex embedded clauses", "Rhetorical structures", "Information structure", "Stylistic fronting", "Academic grammar conventions", "Advanced cohesive devices"],
};

const slug = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
const prerequisiteByTitle: Record<string, string[]> = {
  "Present Perfect basics": ["past-simple"], "Present Perfect vs Past Simple": ["present-perfect", "past-simple"],
  "Second Conditional": ["first-conditional"], "Third Conditional": ["first-conditional"], "Mixed Conditionals": ["third-conditional"],
  "Advanced Passive": ["passive"], "Advanced passive structures": ["b2-advanced-passive"], "Advanced inversion": ["third-conditional"],
  "Stylistic inversion": ["inversion"], "Tense and aspect nuance": ["perfect-vs-past"],
};

const catalogueTopics = Object.entries(curriculumOutline).flatMap(([level, titles]) => titles.map((title) => {
  const existing = detailedTopics.find((item) => item.title.toLowerCase() === title.toLowerCase() || (title === "Verb to be" && item.id === "be") || (title === "Present Perfect basics" && item.id === "present-perfect") || (title === "Advanced inversion" && item.id === "inversion") || (title === "Tense and aspect nuance" && item.id === "aspect-nuance"));
  if (existing) return existing;
  const id = `${level.toLowerCase()}-${slug(title)}`;
  return topic(id, title, level as GrammarTopic["level"], `Build accurate control of ${title.toLowerCase()} in meaningful English.`, prerequisiteByTitle[title] ?? [], ["Study the core form and its common variations"], `This example demonstrates ${title.toLowerCase()}.`, ["A common learner form.", "A natural corrected form.", "Check the form, meaning, and context together."], ["form", "meaning", "usage"]);
}));

/** Full A1–C2 catalogue; selected high-value topics above contain richer authored lessons. */
export const grammarTopics: GrammarTopic[] = [...catalogueTopics, ...detailedTopics.filter((item) => !catalogueTopics.some((topicItem) => topicItem.id === item.id))];
export const detailedGrammarTopics = detailedTopics;
