import type { CEFRLevel, PlacementDimension, PlacementQuestion } from "@/types/domain";

type Seed = [CEFRLevel, PlacementDimension, string, string, string[], string, string?];
const seeds: Seed[] = [
  ["A1", "vocabulary", "daily-life", "Which word means “a place where you live”?", ["home", "hour", "hope", "help"], "home"],
  ["A1", "vocabulary", "food", "Choose the opposite of “hot”.", ["cold", "fast", "high", "dry"], "cold"],
  ["A1", "grammar", "verb-to-be", "My sister ___ a student.", ["is", "are", "am", "be"], "is"],
  ["A1", "grammar", "present-simple", "He ___ English every evening.", ["studies", "study", "studying", "is study"], "studies"],
  ["A1", "context", "natural-language", "Choose the most natural sentence.", ["I usually walk to work.", "I walk usually to work.", "Usually I to work walk.", "I am usually walk to work."], "I usually walk to work."],
  ["A1", "context", "questions", "Choose the natural question.", ["Where do you live?", "Where you live?", "Where are live you?", "Where does you live?"], "Where do you live?"],

  ["A2", "vocabulary", "travel", "If you “borrow” a book, you ___.", ["use it and return it", "give it away", "write it", "sell it"], "use it and return it"],
  ["A2", "vocabulary", "emotions", "Which word is closest to “confident”?", ["self-assured", "careless", "ancient", "temporary"], "self-assured"],
  ["A2", "grammar", "past-simple", "We ___ Hue last summer.", ["visited", "have visited", "visit", "are visiting"], "visited"],
  ["A2", "grammar", "comparatives", "This exercise is ___ than the last one.", ["easier", "more easy", "easiest", "easy"], "easier"],
  ["A2", "context", "requests", "Choose the most natural polite request.", ["Could you open the window?", "You open the window.", "Open you the window?", "Do opening the window."], "Could you open the window?"],
  ["A2", "context", "collocations", "Choose the natural combination.", ["make a mistake", "do a mistake", "build a mistake", "perform a mistake"], "make a mistake"],

  ["B1", "vocabulary", "communication", "To “clarify” something means to ___.", ["make it clearer", "make it longer", "hide it", "repeat it loudly"], "make it clearer"],
  ["B1", "vocabulary", "work", "Choose the opposite of “flexible”.", ["rigid", "reliable", "frequent", "natural"], "rigid"],
  ["B1", "grammar", "present-perfect", "I ___ here since 2022.", ["have lived", "lived", "am living", "live"], "have lived"],
  ["B1", "grammar", "second-conditional", "If I had more time, I ___ another language.", ["would learn", "will learn", "learned", "have learned"], "would learn"],
  ["B1", "context", "tense-contrast", "Choose the sentence that naturally describes life experience.", ["I have visited Singapore twice.", "I visited Singapore twice in my life so far yesterday.", "I am visiting Singapore twice.", "I have visit Singapore twice."], "I have visited Singapore twice."],
  ["B1", "context", "phrasal-verbs", "The meeting was delayed, so they decided to ___ it until Friday.", ["put off", "take after", "look after", "give in"], "put off"],

  ["B2", "vocabulary", "academic", "Which word is closest in meaning to “evaluate”?", ["assess", "announce", "assume", "avoid"], "assess"],
  ["B2", "vocabulary", "communication", "If a statement is “explicit”, it is ___.", ["clear and direct", "deliberately vague", "probably false", "highly emotional"], "clear and direct"],
  ["B2", "grammar", "third-conditional", "If she ___ earlier, she would have caught the train.", ["had left", "left", "would leave", "has left"], "had left"],
  ["B2", "grammar", "modal-perfect", "He isn't here. He ___ the earlier bus.", ["might have taken", "might took", "must taking", "can have take"], "might have taken"],
  ["B2", "context", "register", "Choose the most appropriate sentence for a formal report.", ["The results indicate a significant change.", "The results are, like, a huge change.", "Results kinda changed loads.", "The result thing got big."], "The results indicate a significant change."],
  ["B2", "context", "collocations", "Choose the natural combination.", ["draw a conclusion", "paint a conclusion", "do a conclusion", "build a conclusion"], "draw a conclusion"],

  ["C1", "vocabulary", "academic", "A “tentative” conclusion is ___.", ["not yet fully certain", "completely proven", "deliberately irrelevant", "widely celebrated"], "not yet fully certain"],
  ["C1", "vocabulary", "communication", "Which word best describes a small but meaningful difference?", ["nuance", "routine", "benefit", "sequence"], "nuance"],
  ["C1", "grammar", "inversion", "Rarely ___ such a compelling argument.", ["have I heard", "I have heard", "did I have heard", "I heard have"], "have I heard"],
  ["C1", "grammar", "hedging", "Choose the appropriately hedged academic claim.", ["The evidence appears to support this view.", "The evidence proves this forever.", "Everyone clearly knows this is true.", "There can be no possible alternative."], "The evidence appears to support this view."],
  ["C1", "context", "register", "Choose the most natural formal alternative to “a lot of problems”.", ["a considerable number of problems", "a massive bunch of problems", "loads and loads of problems", "a pretty big problem pile"], "a considerable number of problems"],
  ["C1", "context", "cohesion", "The sample was small; ___, the findings should be interpreted cautiously.", ["consequently", "similarly", "for instance", "meanwhile"], "consequently"],

  ["C2", "vocabulary", "academic", "An “equivocal” response is ___.", ["open to more than one interpretation", "fully transparent and decisive", "unusually enthusiastic", "supported by extensive data"], "open to more than one interpretation"],
  ["C2", "vocabulary", "society", "Which word means “present or found everywhere”?", ["ubiquitous", "tentative", "pragmatic", "coherent"], "ubiquitous"],
  ["C2", "grammar", "stylistic-inversion", "Choose the correctly inverted literary sentence.", ["Gone are the days of simple answers.", "Gone the days of simple answers are.", "The days gone are of simple answers.", "Are gone the days simple answers."], "Gone are the days of simple answers."],
  ["C2", "grammar", "aspect-nuance", "Which sentence naturally frames an earlier ongoing intention?", ["I had been meaning to call you.", "I was meant calling you.", "I have meaning to call you yesterday.", "I had meaning called you."], "I had been meaning to call you."],
  ["C2", "context", "pragmatics", "Choose the sentence that most carefully distances the writer from the claim.", ["The findings would seem to suggest a limited association.", "The findings absolutely prove a connection.", "Obviously, the two things are the same.", "There is definitely no other explanation."], "The findings would seem to suggest a limited association."],
  ["C2", "context", "information-structure", "Choose the version with natural emphatic focus.", ["What the study reveals is a change in priorities.", "What reveals the study is priorities change.", "The study what reveals a priorities change.", "What is the study revealing are priority."], "What the study reveals is a change in priorities."],
];

export const placementQuestions: PlacementQuestion[] = seeds.map(([level, dimension, topic, prompt, options, answer, explanation], index) => ({
  id: `placement-${level.toLowerCase()}-${dimension}-${index + 1}`,
  itemId: `placement-${topic}`,
  knowledgeType: dimension === "grammar" ? "grammar" : "vocabulary",
  type: dimension === "context" ? "context" : "multiple-choice",
  prompt, options, answer, explanation, level, dimension, topic,
  difficulty: Math.min(5, ["A1", "A2", "B1", "B2", "C1", "C2"].indexOf(level) + 1) as 1 | 2 | 3 | 4 | 5,
}));
