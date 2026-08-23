import type { VocabularyItem } from "@/types/domain";

type Seed = [string, string, VocabularyItem["cefrLevel"], string, string, string, string[], string[]];
const seeds: Seed[] = [
  ["acquire", "verb", "B2", "to gain knowledge or obtain something", "đạt được, có được", "She acquired valuable skills abroad.", ["gain", "obtain"], ["lose"]],
  ["adapt", "verb", "B1", "to change to suit new conditions", "thích nghi", "It takes time to adapt to a new culture.", ["adjust"], ["resist"]],
  ["analyze", "verb", "B2", "to examine something carefully", "phân tích", "We analyzed the survey results.", ["examine"], ["ignore"]],
  ["approach", "noun", "B1", "a way of dealing with something", "cách tiếp cận", "This approach makes grammar clearer.", ["method"], []],
  ["benefit", "noun", "A2", "a helpful or good effect", "lợi ích", "Daily practice has a lasting benefit.", ["advantage"], ["drawback"]],
  ["brief", "adjective", "B1", "lasting only a short time", "ngắn gọn", "We had a brief conversation.", ["short"], ["lengthy"]],
  ["challenge", "noun", "A2", "a difficult task that tests ability", "thử thách", "Speaking confidently is a challenge.", ["test"], ["ease"]],
  ["clarify", "verb", "B2", "to make something easier to understand", "làm rõ", "Could you clarify that point?", ["explain"], ["confuse"]],
  ["consistent", "adjective", "B2", "acting in the same way over time", "nhất quán", "Consistent practice builds fluency.", ["steady"], ["erratic"]],
  ["context", "noun", "B1", "the situation that gives something meaning", "ngữ cảnh", "Learn new words in context.", ["setting"], []],
  ["decide", "verb", "A1", "to make a choice", "quyết định", "I decided to study tonight.", ["choose"], ["hesitate"]],
  ["develop", "verb", "A2", "to grow or improve", "phát triển", "Reading develops your vocabulary.", ["improve"], ["decline"]],
  ["effective", "adjective", "B1", "producing the intended result", "hiệu quả", "Retrieval practice is effective.", ["successful"], ["ineffective"]],
  ["essential", "adjective", "B1", "completely necessary", "thiết yếu", "Sleep is essential for memory.", ["necessary"], ["optional"]],
  ["evaluate", "verb", "B2", "to judge quality or value", "đánh giá", "Evaluate your progress each week.", ["assess"], []],
  ["frequent", "adjective", "B1", "happening often", "thường xuyên", "Frequent review prevents forgetting.", ["common"], ["rare"]],
  ["improve", "verb", "A2", "to become or make better", "cải thiện", "Her pronunciation improved quickly.", ["enhance"], ["worsen"]],
  ["knowledge", "noun", "A2", "information and understanding", "kiến thức", "Practice turns knowledge into skill.", ["understanding"], ["ignorance"]],
  ["maintain", "verb", "B2", "to keep at the same level", "duy trì", "Maintain a steady study routine.", ["preserve"], ["neglect"]],
  ["notice", "verb", "A2", "to become aware of something", "nhận thấy", "Did you notice the tense change?", ["observe"], ["overlook"]],
  ["progress", "noun", "A2", "movement toward improvement", "tiến bộ", "You are making good progress.", ["advancement"], ["setback"]],
  ["reliable", "adjective", "B2", "consistently good and trustworthy", "đáng tin cậy", "Use a reliable dictionary.", ["dependable"], ["unreliable"]],
  ["review", "verb", "A2", "to study something again", "ôn tập", "Review difficult words tomorrow.", ["revise"], []],
  ["significant", "adjective", "B2", "important or large enough to notice", "đáng kể", "She made significant progress.", ["important"], ["minor"]],
  ["temporary", "adjective", "B1", "lasting for a limited time", "tạm thời", "The difficulty is temporary.", ["short-term"], ["permanent"]],
  ["understand", "verb", "A1", "to know the meaning of something", "hiểu", "I understand the question.", ["comprehend"], ["misunderstand"]],
  ["accurate", "adjective", "B2", "correct and without mistakes", "chính xác", "Her summary was accurate.", ["precise"], ["inaccurate"]],
  ["complex", "adjective", "B2", "made of many connected parts", "phức tạp", "The sentence has a complex structure.", ["complicated"], ["simple"]],
  ["subtle", "adjective", "C1", "not obvious and requiring attention", "tinh tế, khó nhận thấy", "There is a subtle difference in tone.", ["nuanced"], ["obvious"]],
  ["coherent", "adjective", "C1", "logical and well organized", "mạch lạc", "Write a coherent argument.", ["logical"], ["incoherent"]],
];

export const vocabulary: VocabularyItem[] = seeds.map(([word, partOfSpeech, cefrLevel, definition, vietnamese, example, synonyms, antonyms], index) => ({
  id: `v${index + 1}`, word, partOfSpeech, cefrLevel, meanings: [{ definition, vietnamese }], examples: [example],
  synonyms: synonyms.map((item, i) => ({ word: item, strength: 70 + i * 10, register: "neutral", notes: "Similar in this context, but not always interchangeable." })),
  antonyms: antonyms.map((item) => ({ word: item, strength: 80, register: "neutral" })),
  wordFamily: word === "decide" ? [{ word: "decision", partOfSpeech: "noun" }, { word: "decisive", partOfSpeech: "adjective" }] : [],
  collocations: ({ acquire: ["acquire knowledge", "acquire skills"], decide: ["make a decision"], significant: ["significant progress"], frequent: ["frequent practice"] } as Record<string, string[]>)[word] ?? [],
  tags: [cefrLevel.toLowerCase(), partOfSpeech],
}));
