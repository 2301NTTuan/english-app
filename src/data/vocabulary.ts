import type { VocabularyItem } from "@/types/domain";
import { extendedVocabulary } from "@/data/vocabulary/extended";
import { foundationVocabulary001 } from "@/data/vocabulary/foundations-001";
import { enrichedVocabulary001 } from "@/data/vocabulary/enriched-001";
import { enrichedVocabulary002 } from "@/data/vocabulary/enriched-002";
import { enrichedVocabulary003 } from "@/data/vocabulary/enriched-003";
import { enrichedVocabulary004 } from "@/data/vocabulary/enriched-004";
import { enrichedVocabulary005a } from "@/data/vocabulary/enriched-005a";
import { enrichedVocabulary005b } from "@/data/vocabulary/enriched-005b";
import { enrichedVocabulary005c } from "@/data/vocabulary/enriched-005c";
import { enrichedVocabulary005d } from "@/data/vocabulary/enriched-005d";
import { enrichedVocabulary006a } from "@/data/vocabulary/enriched-006a";
import { enrichedVocabulary006b } from "@/data/vocabulary/enriched-006b";
import { enrichedVocabulary006c } from "@/data/vocabulary/enriched-006c";
import { enrichedVocabulary006d } from "@/data/vocabulary/enriched-006d";
import { enrichedVocabulary007a } from "@/data/vocabulary/enriched-007a";
import { enrichedVocabulary007b } from "@/data/vocabulary/enriched-007b";
import { enrichedVocabulary007c } from "@/data/vocabulary/enriched-007c";
import { enrichedVocabulary007d } from "@/data/vocabulary/enriched-007d";
import { enrichedVocabulary008 } from "@/data/vocabulary/enriched-008";
import { enrichedVocabulary009a } from "@/data/vocabulary/enriched-009a";
import { enrichedVocabulary009b } from "@/data/vocabulary/enriched-009b";
import { enrichedVocabulary009c } from "@/data/vocabulary/enriched-009c";
import { enrichedVocabulary009d } from "@/data/vocabulary/enriched-009d";
import { enrichedVocabulary010a } from "@/data/vocabulary/enriched-010a";
import { enrichedVocabulary010b } from "@/data/vocabulary/enriched-010b";
import { enrichedVocabulary011a } from "@/data/vocabulary/enriched-011a";
import { enrichedVocabulary011b } from "@/data/vocabulary/enriched-011b";
import { enrichedVocabulary011c } from "@/data/vocabulary/enriched-011c";
import { enrichedVocabulary011d } from "@/data/vocabulary/enriched-011d";

type Seed = [string, string, VocabularyItem["cefrLevel"], string, string, string, string[], string[]];
const seeds: Seed[] = [
  ["acquire", "verb", "B2", "to gain knowledge or obtain something", "đạt được, có được", "She acquired valuable skills abroad.", ["gain", "obtain"], ["lose"]],
  ["adapt", "verb", "B1", "to change to suit new conditions", "thích nghi", "It takes time to adapt to a new culture.", ["adjust"], ["resist"]],
  ["analyze", "verb", "B2", "to examine something carefully", "phân tích", "We analyzed the survey results.", ["examine"], ["ignore"]],
  ["approach", "noun", "B1", "a way of dealing with something", "cách tiếp cận", "This approach makes grammar clearer.", ["method"], []],
  ["benefit", "noun", "A2", "a helpful or good effect", "lợi ích", "Daily practice has a lasting benefit.", ["advantage"], ["drawback"]],
  ["brief", "adjective", "B1", "lasting only a short time", "ngắn, trong thời gian ngắn", "We had a brief conversation.", ["short"], ["lengthy"]],
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
  ["maintain", "verb", "B2", "to continue something or keep it in good condition", "duy trì", "Maintain a steady study routine.", ["preserve"], ["neglect"]],
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
  ["achieve", "verb", "A2", "to succeed in reaching a goal", "đạt được", "She achieved her study goal.", ["accomplish"], ["fail"]],
  ["advice", "noun", "A1", "an opinion about what someone should do", "lời khuyên", "He gave me useful advice.", ["guidance"], []],
  ["agree", "verb", "A1", "to have the same opinion", "đồng ý", "I agree with your answer.", ["accept"], ["disagree"]],
  ["answer", "noun", "A1", "a response to a question", "câu trả lời", "Check your answer carefully.", ["response"], ["question"]],
  ["borrow", "verb", "A2", "to take something temporarily and return it", "mượn", "Can I borrow your dictionary?", ["use temporarily"], ["lend"]],
  ["careful", "adjective", "A1", "giving attention to avoid mistakes", "cẩn thận", "Be careful with irregular verbs.", ["cautious"], ["careless"]],
  ["choice", "noun", "A1", "an act of selecting between possibilities", "sự lựa chọn", "That was the best choice.", ["selection"], []],
  ["communicate", "verb", "A2", "to share information or ideas", "giao tiếp", "We communicate in English at work.", ["convey"], []],
  ["confident", "adjective", "A2", "sure of your abilities or judgment", "tự tin", "Practice made her more confident.", ["self-assured"], ["uncertain"]],
  ["conversation", "noun", "A1", "an informal talk between people", "cuộc trò chuyện", "We had a short conversation.", ["discussion"], []],
  ["correct", "adjective", "A1", "free from error", "đúng, chính xác", "Choose the correct form.", ["right"], ["incorrect"]],
  ["describe", "verb", "A1", "to say what someone or something is like", "miêu tả", "Describe your hometown.", ["portray"], []],
  ["difference", "noun", "A1", "a way in which things are not the same", "sự khác biệt", "Notice the difference in meaning.", ["distinction"], ["similarity"]],
  ["difficult", "adjective", "A1", "needing effort or skill", "khó", "This exercise is difficult.", ["hard"], ["easy"]],
  ["example", "noun", "A1", "something that shows a general idea", "ví dụ", "Read the example aloud.", ["illustration"], []],
  ["explain", "verb", "A1", "to make an idea clear", "giải thích", "Can you explain this rule?", ["clarify"], ["confuse"]],
  ["focus", "verb", "A2", "to give full attention to something", "tập trung", "Focus on the key words.", ["concentrate"], ["distract"]],
  ["habit", "noun", "A2", "something done regularly", "thói quen", "Reading became a daily habit.", ["routine"], []],
  ["learn", "verb", "A1", "to gain knowledge or skill", "học", "We learn from our mistakes.", ["study"], ["forget"]],
  ["meaning", "noun", "A1", "the idea expressed by a word or sign", "ý nghĩa", "Guess the meaning from context.", ["sense"], []],
  ["practice", "noun", "A1", "repeated activity that improves a skill", "sự luyện tập", "Regular practice builds confidence.", ["training"], []],
  ["remember", "verb", "A1", "to keep or bring information back to mind", "nhớ", "I remember that expression.", ["recall"], ["forget"]],
  ["sentence", "noun", "A1", "a group of words expressing a complete thought", "câu", "Write a complete sentence.", ["statement"], []],
  ["similar", "adjective", "A2", "almost the same but not identical", "tương tự", "These two words are similar.", ["alike"], ["different"]],
  ["skill", "noun", "A1", "an ability developed through practice", "kỹ năng", "Speaking is a practical skill.", ["ability"], []],
  ["specific", "adjective", "A2", "clear and exact rather than general", "cụ thể", "Give a specific example.", ["particular"], ["general"]],
  ["study", "verb", "A1", "to spend time learning", "học tập", "I study English every evening.", ["learn"], []],
  ["translate", "verb", "A2", "to express words in another language", "dịch", "Translate the idea, not each word.", ["interpret"], []],
  ["useful", "adjective", "A1", "helpful for a purpose", "hữu ích", "This phrase is useful at work.", ["helpful"], ["useless"]],
  ["avoid", "verb", "B1", "to stay away from or prevent something", "tránh", "Avoid translating word for word.", ["prevent"], ["seek"]],
  ["compare", "verb", "B1", "to examine similarities and differences", "so sánh", "Compare the two verb forms.", ["contrast"], []],
  ["consequence", "noun", "B1", "a result of an action", "hậu quả", "Every choice has a consequence.", ["result"], ["cause"]],
  ["contribute", "verb", "B1", "to help cause or provide something", "đóng góp", "Sleep contributes to good memory.", ["add"], ["withhold"]],
  ["determine", "verb", "B1", "to discover or decide something", "xác định", "Context determines the best word.", ["establish"], []],
  ["emphasize", "verb", "B1", "to give special importance to something", "nhấn mạnh", "The speaker emphasized the deadline.", ["stress"], ["downplay"]],
  ["evidence", "noun", "B1", "facts that support a conclusion", "bằng chứng", "The claim needs stronger evidence.", ["proof"], []],
  ["flexible", "adjective", "B1", "able to change easily when needed", "linh hoạt", "Use a flexible study plan.", ["adaptable"], ["rigid"]],
  ["indicate", "verb", "B1", "to show or suggest", "chỉ ra", "The time phrase indicates the tense.", ["show"], ["conceal"]],
  ["interpret", "verb", "B1", "to understand or explain meaning", "diễn giải", "Readers may interpret the tone differently.", ["understand"], []],
  ["likely", "adjective", "B1", "expected or probable", "có khả năng", "Rain is likely this afternoon.", ["probable"], ["unlikely"]],
  ["method", "noun", "B1", "a particular way of doing something", "phương pháp", "This method improves recall.", ["approach"], []],
  ["occur", "verb", "B1", "to happen", "xảy ra", "The error often occurs in questions.", ["happen"], []],
  ["require", "verb", "B1", "to need something", "yêu cầu, cần", "Fluency requires regular use.", ["need"], []],
  ["respond", "verb", "B1", "to answer or react", "phản hồi", "Respond in a complete sentence.", ["reply"], ["ignore"]],
  ["strategy", "noun", "B1", "a plan designed to achieve a goal", "chiến lược", "Spaced review is a memory strategy.", ["plan"], []],
  ["assume", "verb", "B2", "to accept something as true without proof", "giả định", "Do not assume synonyms are interchangeable.", ["suppose"], ["verify"]],
  ["distinguish", "verb", "B2", "to recognize a difference", "phân biệt", "Can you distinguish formal from informal usage?", ["differentiate"], ["confuse"]],
  ["enhance", "verb", "B2", "to improve quality or value", "nâng cao", "Examples enhance understanding.", ["improve"], ["weaken"]],
  ["establish", "verb", "B2", "to create or prove firmly", "thiết lập", "Establish a sustainable routine.", ["found"], ["abolish"]],
  ["imply", "verb", "B2", "to suggest without stating directly", "hàm ý", "Her tone implied disagreement.", ["suggest"], ["state"]],
  ["justify", "verb", "B2", "to give a valid reason for something", "biện minh, giải thích", "Justify your choice with evidence.", ["defend"], ["condemn"]],
  ["relevant", "adjective", "B2", "directly connected to the matter", "liên quan", "Include only relevant details.", ["pertinent"], ["irrelevant"]],
  ["retain", "verb", "B2", "to continue to remember or keep", "ghi nhớ, giữ lại", "Retrieval helps you retain vocabulary.", ["preserve"], ["discard"]],
  ["sufficient", "adjective", "B2", "enough for a purpose", "đủ", "One example is not sufficient evidence.", ["adequate"], ["insufficient"]],
  ["vary", "verb", "B2", "to differ or change", "thay đổi", "Register varies with context.", ["differ"], ["remain"]],
  ["ambiguous", "adjective", "C1", "having more than one possible meaning", "mơ hồ, đa nghĩa", "The sentence is deliberately ambiguous.", ["unclear"], ["explicit"]],
  ["compelling", "adjective", "C1", "very convincing or engaging", "thuyết phục", "She presented a compelling argument.", ["persuasive"], ["unconvincing"]],
  ["convey", "verb", "C1", "to communicate an idea or feeling", "truyền đạt", "Word order can convey emphasis.", ["communicate"], ["conceal"]],
  ["nuance", "noun", "C1", "a subtle difference in meaning", "sắc thái", "The translation misses an important nuance.", ["distinction"], []],
  ["pragmatic", "adjective", "C1", "focused on practical solutions and effects", "thực tế, thực dụng", "We took a pragmatic approach to the budget problem.", ["practical"], ["idealistic"]],
  ["ability", "noun", "A2", "the skill to do something", "khả năng", "Reading builds your language ability.", ["skill"], ["inability"]],
  ["accept", "verb", "A2", "to agree to receive or allow something", "chấp nhận", "She accepted the correction.", ["approve"], ["reject"]],
  ["ancient", "adjective", "A2", "belonging to the very distant past", "cổ xưa", "They visited an ancient temple.", ["old"], ["modern"]],
  ["announce", "verb", "A2", "to make information publicly known", "thông báo", "The school announced a new course.", ["declare"], ["conceal"]],
  ["attend", "verb", "A2", "to go to an event or place", "tham dự", "She attends class twice a week.", ["join"], ["miss"]],
  ["cause", "noun", "A2", "the reason something happens", "nguyên nhân", "Stress was the main cause of the error.", ["reason"], ["effect"]],
  ["decrease", "verb", "A2", "to become or make smaller", "giảm", "The review backlog decreased.", ["decline"], ["increase"]],
  ["expand", "verb", "B1", "to become or make larger", "mở rộng", "Reading expands your vocabulary.", ["enlarge"], ["contract"]],
  ["familiar", "adjective", "B1", "well known from previous experience", "quen thuộc", "The phrase sounds familiar.", ["known"], ["unfamiliar"]],
  ["feature", "noun", "B1", "an important or noticeable part", "đặc điểm", "Aspect is a key feature of English verbs.", ["characteristic"], []],
  ["influence", "verb", "B1", "to affect how something develops", "ảnh hưởng", "Context influences word choice.", ["affect"], []],
  ["lend", "verb", "B1", "to give something temporarily", "cho mượn", "Could you lend me your notes?", ["loan"], ["borrow"]],
  ["natural", "adjective", "B1", "usual and appropriate to native usage", "tự nhiên", "This collocation sounds natural.", ["idiomatic"], ["unnatural"]],
  ["pattern", "noun", "B1", "a regular repeated arrangement", "mẫu, quy luật", "Notice the sentence pattern.", ["structure"], []],
  ["predict", "verb", "B1", "to say what is likely to happen", "dự đoán", "Can you predict the next review date?", ["forecast"], []],
  ["recognize", "verb", "B1", "to identify something seen or learned before", "nhận ra", "I recognize the word but cannot recall it.", ["identify"], ["overlook"]],
  ["resolve", "verb", "B1", "to solve a difficulty or settle a problem", "giải quyết", "Practice can resolve this confusion.", ["solve"], ["complicate"]],
  ["temporary", "noun", "B1", "a person employed for a limited period", "nhân viên tạm thời", "The company hired a temporary.", ["temp"], ["permanent employee"]],
  ["appropriate", "adjective", "B2", "suitable for a situation", "phù hợp", "Choose an appropriate register.", ["suitable"], ["inappropriate"]],
  ["contract", "verb", "B2", "to become smaller or narrower", "thu hẹp", "The market contracted last year.", ["shrink"], ["expand"]],
  ["derive", "verb", "B2", "to obtain something from a source", "bắt nguồn, thu được", "The word derives from Latin.", ["obtain"], []],
  ["explicit", "adjective", "B2", "stated clearly and directly", "rõ ràng", "The instructions are explicit.", ["clear"], ["implicit"]],
  ["infer", "verb", "B2", "to reach a conclusion from evidence", "suy ra", "We can infer the meaning from context.", ["deduce"], []],
  ["permanent", "adjective", "B2", "lasting without an expected end", "vĩnh viễn", "The change is permanent.", ["lasting"], ["temporary"]],
  ["precise", "adjective", "B2", "exact and accurate", "chính xác", "Use precise language in the summary.", ["exact"], ["vague"]],
  ["register", "noun", "C1", "a style of language suited to a context", "văn phong", "The expression belongs to an informal register.", ["style"], []],
  ["rhetorical", "adjective", "C1", "designed to persuade or create an effect", "tu từ", "The writer uses a rhetorical question.", ["persuasive"], []],
  ["tentative", "adjective", "C1", "not fully certain or decided", "thăm dò, chưa chắc chắn", "The conclusion remains tentative.", ["provisional"], ["definite"]],
  ["ubiquitous", "adjective", "C2", "present or found everywhere", "phổ biến khắp nơi", "Smartphones have become ubiquitous.", ["omnipresent"], ["rare"]],
  ["equivocal", "adjective", "C2", "open to more than one interpretation", "nước đôi, mơ hồ", "His response was deliberately equivocal.", ["ambiguous"], ["unequivocal"]],
];

const topicGroups: Record<string, string[]> = {
  education: ["learn", "study", "practice", "knowledge", "skill", "example", "sentence", "translate", "answer", "evaluate", "analyze"],
  communication: ["communicate", "conversation", "explain", "clarify", "describe", "respond", "meaning", "interpret", "convey", "rhetorical"],
  work: ["acquire", "develop", "progress", "maintain", "effective", "strategy", "method", "achieve", "contribute", "establish"],
  emotions: ["confident", "agree", "challenge", "difficult", "careful", "flexible", "tentative"],
  society: ["evidence", "influence", "consequence", "significant", "relevant", "ubiquitous"],
  "daily-life": ["habit", "notice", "remember", "borrow", "lend", "choice", "advice", "useful"],
};
const topicOverrides: Record<string, string> = {
  adapt: "change", approach: "problem-solving", benefit: "success", brief: "time", consistent: "quality", context: "language",
  decide: "decision-making", essential: "daily-life", frequent: "time", improve: "success", reliable: "quality", review: "education",
  temporary: "time", understand: "communication", accurate: "quality", complex: "description", subtle: "communication", coherent: "communication",
  correct: "education", difference: "comparison", focus: "education", similar: "comparison", specific: "communication", avoid: "daily-life",
  compare: "comparison", determine: "decision-making", emphasize: "communication", indicate: "communication", likely: "prediction", occur: "events",
  require: "daily-life", assume: "reasoning", distinguish: "comparison", enhance: "change", imply: "communication", justify: "argumentation",
  retain: "education", sufficient: "quantity", vary: "change", ambiguous: "communication", compelling: "argumentation", nuance: "communication",
  pragmatic: "problem-solving", ability: "education", accept: "relationships", ancient: "history", announce: "communication", attend: "education",
  cause: "reasoning", decrease: "change", expand: "change", familiar: "experience", feature: "description", natural: "language", pattern: "language",
  predict: "prediction", recognize: "perception", resolve: "problem-solving", appropriate: "communication", contract: "change", derive: "language",
  explicit: "communication", infer: "reasoning", permanent: "time", precise: "communication", register: "language", equivocal: "communication",
};
const topicFor = (word: string, partOfSpeech?: string) => word === "temporary" && partOfSpeech === "noun" ? "work" : topicOverrides[word] ?? Object.entries(topicGroups).find(([, words]) => words.includes(word))?.[0] ?? "daily-life";
const wordFamilies: Record<string, { word: string; partOfSpeech: string }[]> = {
  decide: [{ word: "decision", partOfSpeech: "noun" }, { word: "decisive", partOfSpeech: "adjective" }, { word: "decisively", partOfSpeech: "adverb" }],
  analyze: [{ word: "analysis", partOfSpeech: "noun" }, { word: "analytical", partOfSpeech: "adjective" }],
  achieve: [{ word: "achievement", partOfSpeech: "noun" }, { word: "achievable", partOfSpeech: "adjective" }],
  communicate: [{ word: "communication", partOfSpeech: "noun" }, { word: "communicative", partOfSpeech: "adjective" }],
  compare: [{ word: "comparison", partOfSpeech: "noun" }, { word: "comparative", partOfSpeech: "adjective" }],
  contribute: [{ word: "contribution", partOfSpeech: "noun" }, { word: "contributor", partOfSpeech: "noun" }],
  effective: [{ word: "effect", partOfSpeech: "noun" }, { word: "effectively", partOfSpeech: "adverb" }],
  improve: [{ word: "improvement", partOfSpeech: "noun" }, { word: "improved", partOfSpeech: "adjective" }],
  reliable: [{ word: "reliability", partOfSpeech: "noun" }, { word: "reliably", partOfSpeech: "adverb" }],
  significant: [{ word: "significance", partOfSpeech: "noun" }, { word: "significantly", partOfSpeech: "adverb" }],
};
const collocationsByWord: Record<string, string[]> = {
  acquire: ["acquire knowledge", "acquire skills"], decide: ["make a decision"], significant: ["significant progress"], frequent: ["frequent practice"],
  advice: ["give advice", "useful advice"], attention: ["pay attention"], challenge: ["face a challenge"], conclusion: ["draw a conclusion"],
  consequence: ["serious consequence"], experience: ["gain experience"], knowledge: ["acquire knowledge"], progress: ["make progress"], responsibility: ["take responsibility"],
};

const rejectedSynonyms = new Set(["sentence:statement", "translate:interpret", "avoid:prevent", "compare:contrast"]);
const rejectedAntonyms = new Set([
  "adapt:resist", "analyze:ignore", "challenge:ease", "decide:hesitate", "maintain:neglect", "answer:question", "borrow:lend",
  "learn:forget", "consequence:cause", "contribute:withhold", "indicate:conceal", "respond:ignore", "assume:verify", "distinguish:confuse",
  "establish:abolish", "justify:condemn", "ambiguous:explicit", "convey:conceal", "cause:effect", "lend:borrow", "recognize:overlook",
  "resolve:complicate", "temporary:permanent employee", "ubiquitous:rare",
]);

const coreVocabulary: VocabularyItem[] = seeds.map(([word, partOfSpeech, cefrLevel, definition, vietnamese, example, synonyms, antonyms], index) => ({
  id: `v${index + 1}`, word, partOfSpeech, cefrLevel, meanings: [{ definition, vietnamese }], examples: [example],
  lemma: word, status: "validated", provenanceId: "vocabulary-core-2026-08", cefrBasis: "editorial-estimate", frequencyBasis: "editorial-band",
  frequencyBand: cefrLevel === "A1" ? "very-common" : cefrLevel === "A2" || cefrLevel === "B1" ? "common" : cefrLevel === "B2" ? "less-common" : "advanced",
  synonyms: synonyms.filter((item) => !rejectedSynonyms.has(`${word}:${item}`)).map((item, i) => ({ word: item, strength: 70 + i * 10, register: "neutral", notes: "Similar in this context, but not always interchangeable." })),
  antonyms: antonyms.filter((item) => !rejectedAntonyms.has(`${word}:${item}`)).map((item) => ({ word: item, strength: 80, register: "neutral" })),
  wordFamily: wordFamilies[word] ?? [], collocations: collocationsByWord[word] ?? [], topics: [topicFor(word, partOfSpeech)],
  tags: [cefrLevel.toLowerCase(), partOfSpeech, topicFor(word, partOfSpeech)],
}));

/** Stable, modular content catalogue. Add future CEFR batches under src/data/vocabulary/. */
export const vocabulary: VocabularyItem[] = [...coreVocabulary, ...extendedVocabulary, ...foundationVocabulary001, ...enrichedVocabulary001, ...enrichedVocabulary002, ...enrichedVocabulary003, ...enrichedVocabulary004, ...enrichedVocabulary005a, ...enrichedVocabulary005b, ...enrichedVocabulary005c, ...enrichedVocabulary005d, ...enrichedVocabulary006a, ...enrichedVocabulary006b, ...enrichedVocabulary006c, ...enrichedVocabulary006d, ...enrichedVocabulary007a, ...enrichedVocabulary007b, ...enrichedVocabulary007c, ...enrichedVocabulary007d, ...enrichedVocabulary008, ...enrichedVocabulary009a, ...enrichedVocabulary009b, ...enrichedVocabulary009c, ...enrichedVocabulary009d, ...enrichedVocabulary010a, ...enrichedVocabulary010b, ...enrichedVocabulary011a, ...enrichedVocabulary011b, ...enrichedVocabulary011c, ...enrichedVocabulary011d];
export const publishedVocabulary = vocabulary.filter((item) => item.status === "published");
