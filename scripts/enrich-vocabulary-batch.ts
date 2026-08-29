import fs from "node:fs";
import zlib from "node:zlib";
import { vocabulary } from "../src/data/vocabulary";
import type { CEFRLevel, FrequencyBand, VocabularyItem } from "../src/types/domain";

type MasterRow = {
  id: string;
  lemma: string;
  partOfSpeech: string;
  cefrLevel: CEFRLevel;
  cefrBasis: VocabularyItem["cefrBasis"];
  cefrSourceId?: string;
  frequencyBand: FrequencyBand;
  frequencyBasis: VocabularyItem["frequencyBasis"];
  frequencySourceId?: string;
  frequencyRank?: number;
  provenanceIds: string[];
};

type SourceSense = { definition: string; examples: string[]; lexfile?: string; ili?: string };
type SourceRecord = { definition?: string; example?: string };
type VietnameseEntry = { pos: string; senses: { gloss: string; examples: string[] }[] };

const args = new Map<string, string>();
for (let index = 2; index < process.argv.length; index += 2) args.set(process.argv[index], process.argv[index + 1]);
const required = (name: string) => {
  const value = args.get(name);
  if (!value) throw new Error(`Missing ${name}`);
  return value;
};

const masterPath = required("--master");
const wordnetPath = required("--wordnet");
const simpleWiktionaryPath = required("--simple-wiktionary");
const vietnameseWiktionaryPath = required("--vietnamese-wiktionary");
const omwEnglishPath = required("--omw-english");
const omwVietnamesePath = required("--omw-vietnamese");
const outputPath = required("--output");
const reportPath = required("--report");
const level = required("--level") as CEFRLevel;
const batchSize = Number(required("--batch-size"));
const batchId = required("--batch-id");

const decodeXml = (value: string) => value
  .replaceAll("&quot;", '"').replaceAll("&apos;", "'").replaceAll("&amp;", "&")
  .replaceAll("&lt;", "<").replaceAll("&gt;", ">");
const tidy = (value: string) => value.replace(/\s+/g, " ").trim();
const sentence = (value: string) => {
  const clean = tidy(value).replace(/^[“”"']+|[“”"']+$/g, "");
  if (!clean) return clean;
  const capitalized = clean[0].toLocaleUpperCase() + clean.slice(1);
  return /[.!?]$/.test(capitalized) ? capitalized : `${capitalized}.`;
};
const definitionText = (value: string) => tidy(value).replace(/[.!?]+$/, "");
const normalize = (value: string) => value.toLocaleLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, " ").trim();
const stopWords = new Set("a an the is are be to of in on at for from with by and or that this it you your someone something person thing used use if when where who which means can may do does done have has having as into than very more most some any all".split(" "));
const significantTokens = (value: string, lemma: string) => new Set(normalize(value).split(" ").filter((token) => token.length > 2 && token !== normalize(lemma) && !stopWords.has(token)));
const senseSimilarity = (left: string, right: string, lemma: string) => {
  const a = significantTokens(left, lemma); const b = significantTokens(right, lemma);
  if (!a.size || !b.size) return 0;
  return [...a].filter((token) => b.has(token)).length / Math.min(a.size, b.size);
};
const targetPattern = (lemma: string) => {
  const escaped = lemma.toLocaleLowerCase().replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replaceAll(" ", "[ -]");
  const stem = escaped.endsWith("e") ? escaped.slice(0, -1) : escaped.endsWith("y") ? escaped.slice(0, -1) : escaped;
  return new RegExp(`\\b(?:${escaped}|${escaped}s|${escaped}es|${stem}ed|${stem}ing|${stem}ies)\\b`, "i");
};
const containsTarget = (value: string, lemma: string) => targetPattern(lemma).test(value);

const [header, ...lines] = fs.readFileSync(masterPath, "utf8").trim().split("\n");
const columns = header.split("\t");
const masterRows: MasterRow[] = lines.map((line) => {
  const values = line.split("\t");
  const row = Object.fromEntries(columns.map((column, index) => [column, values[index] ?? ""]));
  return {
    id: row.id,
    lemma: row.lemma,
    partOfSpeech: row.part_of_speech,
    cefrLevel: row.cefr_level as CEFRLevel,
    cefrBasis: row.cefr_basis as VocabularyItem["cefrBasis"],
    cefrSourceId: row.cefr_source_id || undefined,
    frequencyBand: row.frequency_band as FrequencyBand,
    frequencyBasis: row.frequency_basis as VocabularyItem["frequencyBasis"],
    frequencySourceId: row.frequency_source_id || undefined,
    frequencyRank: row.frequency_rank ? Number(row.frequency_rank) : undefined,
    provenanceIds: row.provenance_ids.split(",").filter(Boolean),
  };
});

const existingIds = new Set(vocabulary.filter((item) => item.provenanceId !== batchId).map((item) => item.id));
const targets = masterRows.filter((row) => row.cefrLevel === level && !existingIds.has(row.id)).slice(0, batchSize);
if (targets.length !== batchSize) throw new Error(`Requested ${batchSize} records but found ${targets.length} incomplete ${level} records`);
const targetLemmas = new Set(targets.map((row) => row.lemma.toLocaleLowerCase()));

const cleanWiki = (value: string) => definitionText(decodeXml(value)
  .replace(/<!--.*?-->/g, "")
  .replace(/\[\[(?:[^\]|]+\|)?([^\]]+)\]\]/g, "$1")
  .replace(/\{\{(?:syn|ant|related|also|audio|IPA|SAMPA)[^}]*\}\}/gi, "")
  .replace(/\{\{[^}]*\}\}/g, "")
  .replace(/''+/g, "")
  .replace(/<[^>]+>/g, ""));

const simplePages = new Map<string, string>();
const simpleXml = fs.readFileSync(simpleWiktionaryPath, "utf8");
for (const match of simpleXml.matchAll(/<page>[\s\S]*?<title>([\s\S]*?)<\/title>[\s\S]*?<ns>0<\/ns>[\s\S]*?<text[^>]*>([\s\S]*?)<\/text>[\s\S]*?<\/page>/g)) {
  const title = decodeXml(match[1]).toLocaleLowerCase();
  if (targetLemmas.has(title)) simplePages.set(title, decodeXml(match[2]));
}

const simplePosNames: Record<string, string[]> = {
  noun: ["Noun"], verb: ["Verb"], adjective: ["Adjective"], adverb: ["Adverb"],
  conjunction: ["Conjunction"], determiner: ["Determiner", "Article", "Adjective"], interjection: ["Interjection"],
  modal: ["Verb"], numeral: ["Numeral", "Number", "Adjective"], particle: ["Particle"],
  preposition: ["Preposition"], pronoun: ["Pronoun"],
};

const parseSimple = (row: MasterRow): SourceRecord => {
  const page = simplePages.get(row.lemma.toLocaleLowerCase());
  if (!page) return {};
  for (const heading of simplePosNames[row.partOfSpeech] ?? []) {
    const section = page.match(new RegExp(`^==+\\s*${heading}\\s*==+\\s*$([\\s\\S]*?)(?=^==+[^=].*==+\\s*$|(?![\\s\\S]))`, "mi"))?.[1];
    if (!section) continue;
    const linesInSection = section.split("\n");
    const definitionIndex = linesInSection.findIndex((line) => /^# (?![:*])/.test(line));
    if (definitionIndex < 0) continue;
    const definition = cleanWiki(linesInSection[definitionIndex].replace(/^#\s*/, ""));
    const examples = linesInSection.slice(definitionIndex + 1).filter((line) => /^#:\s*/.test(line)).map((line) => cleanWiki(line.replace(/^#:\s*/, "")));
    return { definition, example: examples.find((example) => containsTarget(example, row.lemma)) };
  }
  return {};
};

const wordnetXml = zlib.gunzipSync(fs.readFileSync(wordnetPath)).toString("utf8");
const wordnetPos: Record<string, string> = { noun: "n", verb: "v", adjective: "a", adverb: "r" };
const wordnetSenseIds = new Map<string, string[]>();
for (const match of wordnetXml.matchAll(/<LexicalEntry\b[\s\S]*?<Lemma writtenForm="([^"]+)" partOfSpeech="([^"]+)"(?:\/>|>)[\s\S]*?<\/LexicalEntry>/g)) {
  const lemma = decodeXml(match[1]).replaceAll("_", " ").toLocaleLowerCase();
  if (!targetLemmas.has(lemma)) continue;
  const senses = [...match[0].matchAll(/<Sense\s+[^>]*synset="([^"]+)"/g)].map((sense) => sense[1]);
  wordnetSenseIds.set(`${lemma}\t${match[2]}`, senses);
}
const neededSynsets = new Set([...wordnetSenseIds.values()].flat());
const wordnetSynsets = new Map<string, SourceSense>();
for (const match of wordnetXml.matchAll(/<Synset\s+id="([^"]+)"[\s\S]*?<\/Synset>/g)) {
  if (!neededSynsets.has(match[1])) continue;
  const block = match[0];
  const rawDefinition = block.match(/<Definition(?:\s[^>]*)?>([\s\S]*?)<\/Definition>/)?.[1];
  if (!rawDefinition) continue;
  wordnetSynsets.set(match[1], {
    definition: definitionText(decodeXml(rawDefinition.replace(/<[^>]+>/g, ""))),
    examples: [...block.matchAll(/<Example(?:\s[^>]*)?>([\s\S]*?)<\/Example>/g)].map((example) => cleanWiki(example[1])),
    lexfile: block.match(/lexfile="([^"]+)"/)?.[1],
    ili: block.match(/\sili="([^"]+)"/)?.[1],
  });
}

const wordnetSensesFor = (row: MasterRow) => {
  const pos = wordnetPos[row.partOfSpeech];
  if (!pos) return [];
  const ids = wordnetSenseIds.get(`${row.lemma.toLocaleLowerCase()}\t${pos}`) ?? [];
  return ids.map((id) => wordnetSynsets.get(id)).filter((sense): sense is SourceSense => Boolean(sense));
};
const wordnetFor = (row: MasterRow, simpleDefinition?: string) => {
  const senses = wordnetSensesFor(row);
  if (!simpleDefinition || senses.length < 2) return senses[0];
  return [...senses].sort((left, right) => senseSimilarity(simpleDefinition, right.definition, row.lemma) - senseSimilarity(simpleDefinition, left.definition, row.lemma))[0];
};

const neededIlis = new Set([...wordnetSynsets.values()].map((sense) => sense.ili).filter(Boolean));
const iliToOmwOffset = new Map<string, string>();
const omwEnglishXml = fs.readFileSync(omwEnglishPath, "utf8");
for (const match of omwEnglishXml.matchAll(/<Synset\s+id="omw-en-(\d{8}-[nvar])"\s+ili="([^"]+)"/g)) {
  if (neededIlis.has(match[2])) iliToOmwOffset.set(match[2], match[1]);
}
const vietnameseByOmwOffset = new Map<string, string[]>();
for (const line of fs.readFileSync(omwVietnamesePath, "utf8").split("\n")) {
  const [offset, relation, lemma] = line.split("\t");
  if (relation !== "vie:lemma" || !lemma || /[\p{Script=Han}]/u.test(lemma)) continue;
  vietnameseByOmwOffset.set(offset, [...vietnameseByOmwOffset.get(offset) ?? [], lemma]);
}
const omwVietnameseFor = (sense?: SourceSense) => {
  const offset = sense?.ili ? iliToOmwOffset.get(sense.ili) : undefined;
  const candidates = offset ? vietnameseByOmwOffset.get(offset) ?? [] : [];
  return [...candidates].sort((left, right) => left.length - right.length)[0];
};

const vietnameseEntries = new Map<string, VietnameseEntry[]>();
const viLines = zlib.gunzipSync(fs.readFileSync(vietnameseWiktionaryPath)).toString("utf8").split("\n");
for (const line of viLines) {
  if (!line.includes('"lang_code": "en"')) continue;
  const parsed = JSON.parse(line) as { word: string; pos: string; senses?: { glosses?: string[]; examples?: { text?: string }[] }[] };
  const lemma = parsed.word.toLocaleLowerCase();
  if (!targetLemmas.has(lemma)) continue;
  const entry: VietnameseEntry = {
    pos: parsed.pos,
    senses: (parsed.senses ?? []).map((sense) => ({
      gloss: tidy(sense.glosses?.[0] ?? ""),
      examples: (sense.examples ?? []).map((example) => tidy(example.text ?? "")).filter(Boolean),
    })).filter((sense) => sense.gloss),
  };
  if (entry.senses.length) vietnameseEntries.set(lemma, [...vietnameseEntries.get(lemma) ?? [], entry]);
}

const viPos: Record<string, string[]> = {
  noun: ["noun"], verb: ["verb"], adjective: ["adj"], adverb: ["adv"], conjunction: ["conj"],
  determiner: ["det", "article", "adj"], interjection: ["intj"], modal: ["verb"], numeral: ["num", "adj"],
  particle: ["particle", "adv"], preposition: ["prep"], pronoun: ["pron"],
};
const vietnameseFor = (row: MasterRow) => {
  const candidates = vietnameseEntries.get(row.lemma.toLocaleLowerCase()) ?? [];
  const entry = (viPos[row.partOfSpeech] ?? []).flatMap((pos) => candidates.filter((candidate) => candidate.pos === pos))[0];
  return entry?.senses[0];
};

const validSimpleDefinition = (value: string | undefined) => Boolean(value
  && value.length >= 5 && value.length <= 220
  && !/[{}[\]]/.test(value)
  && !/\.\s*\.$|^something in place or position|^plural of\b|^simple past\b/i.test(value));

const conciseDefinition = (value: string) => definitionText(value.split(/(?<=[.!?])\s+/)[0]);
const cleanVietnamese = (value: string) => {
  const clean = definitionText(value).replace(/\s*\([^)]*\)/g, "").split(/\s*;\s*/)[0].replace(/^\([^)]*\)\s*/, "");
  return clean ? clean[0].toLocaleLowerCase() + clean.slice(1) : "";
};
const singleExample = (value: string, lemma: string) => {
  const candidates = tidy(value).split(/(?<=[.!?])\s+/).filter(Boolean);
  return candidates.find((candidate) => containsTarget(candidate, lemma)) ?? candidates[0] ?? value;
};

const verbDefinition = (simple: string | undefined, wordnet: string | undefined) => {
  if (simple) {
    const direct = simple.match(/^to\s+(.+)$/i)?.[1];
    if (direct) return `to ${direct[0].toLocaleLowerCase()}${direct.slice(1)}`;
    const consequence = simple.match(/^(?:if|when)\b[^,]+,\s*you\s+(.+)$/i)?.[1];
    if (consequence) return `to ${consequence[0].toLocaleLowerCase()}${consequence.slice(1)}`;
  }
  return wordnet ? `to ${wordnet[0].toLocaleLowerCase()}${wordnet.slice(1)}` : "";
};

const topicByLexfile: Record<string, string> = {
  "noun.act": "activities", "noun.animal": "animals", "noun.artifact": "objects", "noun.attribute": "description",
  "noun.body": "body", "noun.cognition": "thinking", "noun.communication": "communication", "noun.event": "events",
  "noun.feeling": "emotions", "noun.food": "food", "noun.group": "society", "noun.location": "places",
  "noun.motive": "thinking", "noun.object": "nature", "noun.person": "people", "noun.phenomenon": "nature",
  "noun.plant": "nature", "noun.possession": "money", "noun.process": "change", "noun.quantity": "quantity",
  "noun.relation": "relationships", "noun.shape": "description", "noun.state": "states", "noun.substance": "materials",
  "noun.time": "time", "verb.body": "health", "verb.change": "change", "verb.cognition": "thinking",
  "verb.communication": "communication", "verb.competition": "sports", "verb.consumption": "food", "verb.contact": "actions",
  "verb.creation": "work", "verb.emotion": "emotions", "verb.motion": "movement", "verb.perception": "senses",
  "verb.possession": "ownership", "verb.social": "society", "verb.stative": "states", "verb.weather": "weather",
};
const topicFor = (row: MasterRow, wordnet?: SourceSense) => {
  if (!["noun", "verb", "adjective", "adverb"].includes(row.partOfSpeech)) return "language";
  return topicByLexfile[wordnet?.lexfile ?? ""] ?? (row.partOfSpeech === "adjective" ? "description" : row.partOfSpeech === "adverb" ? "communication" : "daily-life");
};

const overrides: Record<string, { definition?: string; vietnamese?: string; example?: string; topic?: string }> = {
  "master-a-determiner": { definition: "used before a singular countable noun when the person or thing is not specific", vietnamese: "một", example: "She bought a new bag." },
  "master-above-adverb": { definition: "in or at a higher place", vietnamese: "ở trên, phía trên", example: "The instructions are shown above." },
  "master-address-noun": { definition: "the details that show where a person lives or an organization is located", vietnamese: "địa chỉ", example: "Please write your home address here.", topic: "communication" },
  "master-after-preposition": { definition: "later than or following someone or something in time", vietnamese: "sau", example: "We went home after dinner." },
  "master-afraid-adjective": { definition: "feeling fear or worry", vietnamese: "sợ, lo sợ", example: "The child is afraid of the dark." },
  "master-all-pronoun": { definition: "every person or thing in a group", vietnamese: "tất cả", example: "All of us enjoyed the film." },
  "master-also-adverb": { example: "She also speaks French." },
  "master-and-conjunction": { definition: "used to join words, phrases, or clauses", vietnamese: "và", example: "We bought bread and milk." },
  "master-any-pronoun": { definition: "one or more people or things, no matter which", vietnamese: "bất kỳ ai hoặc cái gì", example: "You may choose any of these books." },
  "master-anybody-pronoun": { definition: "any person", vietnamese: "bất kỳ ai", example: "Anybody can join the class." },
  "master-anyone-pronoun": { definition: "a person whose identity does not matter or is not known", vietnamese: "bất kỳ ai", example: "Does anyone know the answer?" },
  "master-anything-pronoun": { definition: "any object, event, or matter", vietnamese: "bất cứ điều gì", example: "You can ask me anything." },
  "master-april-noun": { example: "The course begins in April.", topic: "time" },
  "master-ago-adverb": { definition: "before the present time", vietnamese: "trước đây, cách đây", example: "We met two years ago.", topic: "time" },
  "master-art-noun": { definition: "creative work such as painting, drawing, or sculpture", vietnamese: "nghệ thuật", example: "The museum displays modern art.", topic: "culture" },
  "master-as-preposition": { vietnamese: "với tư cách là", example: "She works as a teacher." },
  "master-at-preposition": { vietnamese: "ở, tại", example: "Meet me at the station." },
  "master-august-noun": { vietnamese: "tháng Tám", example: "The office closes in August.", topic: "time" },
  "master-baby-noun": { vietnamese: "em bé", example: "The baby is sleeping." },
  "master-band-noun": { definition: "a group of musicians who play together", vietnamese: "ban nhạc", example: "The band played three songs." },
  "master-bank-noun": { definition: "an organization or building where people keep and borrow money", vietnamese: "ngân hàng", example: "I went to the bank to deposit some money.", topic: "money" },
  "master-beach-noun": { example: "We walked along the beach." },
  "master-because-conjunction": { definition: "used to give the reason for something", vietnamese: "bởi vì", example: "We stayed inside because it was raining." },
  "master-black-noun": { definition: "the darkest color", vietnamese: "màu đen", example: "Black is her favorite color." },
  "master-black-adjective": { definition: "having the darkest color", vietnamese: "đen", example: "She wore a black jacket." },
  "master-both-pronoun": { definition: "the two people or things together", vietnamese: "cả hai", example: "Both of them live nearby." },
  "master-but-conjunction": { definition: "used to connect an idea that contrasts with what came before", vietnamese: "nhưng", example: "The room is small but comfortable." },
  "master-by-preposition": { definition: "used to show who or what performs an action", vietnamese: "bởi, do", example: "The meal was cooked by my father." },
  "master-board-noun": { definition: "a group of people who manage an organization", vietnamese: "ban, hội đồng", example: "The school board approved the plan.", topic: "work" },
  "master-can-modal": { definition: "used to say that someone is able to do something", vietnamese: "có thể", example: "She can swim very well." },
  "master-camp-noun": { definition: "a place where people stay in tents for a short time", vietnamese: "khu cắm trại", example: "We returned to camp before dark.", topic: "travel" },
  "master-catch-noun": { definition: "a person, animal, or thing that has been caught", vietnamese: "thứ bắt được", example: "The fishermen brought their catch home.", topic: "activities" },
  "master-church-noun": { definition: "a building where Christians meet for worship", vietnamese: "nhà thờ", example: "They go to church on Sunday.", topic: "places" },
  "master-cook-noun": { example: "My father is a good cook." },
  "master-class-noun": { definition: "a period when a group of students learns together", vietnamese: "lớp học, giờ học", example: "Our English class starts at nine.", topic: "education" },
  "master-climb-noun": { definition: "an upward journey or movement, especially on a steep surface", vietnamese: "sự leo trèo", example: "The climb to the top took two hours.", topic: "movement" },
  "master-club-noun": { definition: "an organization for people who share an interest or activity", vietnamese: "câu lạc bộ", example: "She joined the school drama club.", topic: "society" },
  "master-coach-noun": { definition: "a person who trains a sports team or player", vietnamese: "huấn luyện viên", example: "The coach spoke to the team before the game.", topic: "sports" },
  "master-collection-noun": { definition: "a group of objects of the same type gathered together", vietnamese: "bộ sưu tập", example: "He has a collection of old photographs.", topic: "objects" },
  "master-course-noun": { definition: "a series of lessons in a particular subject", vietnamese: "khóa học", example: "She is taking an English course.", topic: "education" },
  "master-cover-noun": { definition: "something placed over an object to protect or hide it", vietnamese: "vỏ, nắp, bìa", example: "The book has a blue cover.", topic: "objects" },
  "master-could-modal": { definition: "used to say that someone was able to do something", vietnamese: "đã có thể", example: "I could swim when I was five." },
  "master-culture-noun": { definition: "the shared customs, beliefs, and way of life of a group", vietnamese: "văn hóa", example: "Food is an important part of local culture.", topic: "culture" },
  "master-december-noun": { example: "The school closes in December.", topic: "time" },
  "master-due-adjective": { definition: "expected or planned to happen at a particular time", vietnamese: "dự kiến, đến hạn", example: "The train is due at six.", topic: "time" },
  "master-dollar-noun": { example: "The ticket costs ten dollars.", topic: "money" },
  "master-each-pronoun": { definition: "every one of two or more people or things, considered separately", vietnamese: "mỗi người, mỗi cái", example: "Each of us paid five dollars." },
  "master-eight-numeral": { definition: "the number 8", vietnamese: "tám", example: "There are eight chairs in the room." },
  "master-eighteen-numeral": { definition: "the number 18", vietnamese: "mười tám", example: "She turned eighteen last week." },
  "master-eighty-numeral": { definition: "the number 80", vietnamese: "tám mươi", example: "The hall can hold eighty people." },
  "master-eleven-numeral": { definition: "the number 11", vietnamese: "mười một", example: "The train leaves at eleven." },
  "master-everybody-pronoun": { definition: "every person", vietnamese: "mọi người", example: "Everybody enjoyed the party." },
  "master-everyone-pronoun": { definition: "all the people in a group", vietnamese: "mọi người", example: "Everyone is ready to leave." },
  "master-everything-pronoun": { definition: "all things", vietnamese: "mọi thứ", example: "Everything looks clean now." },
  "master-february-noun": { example: "We moved here in February.", topic: "time" },
  "master-fifteen-numeral": { definition: "the number 15", vietnamese: "mười lăm", example: "The bus comes every fifteen minutes." },
  "master-fifty-numeral": { definition: "the number 50", vietnamese: "năm mươi", example: "About fifty people attended the meeting." },
  "master-fine-adjective": { definition: "good enough or acceptable", vietnamese: "ổn, tốt", example: "The new schedule is fine for me." },
  "master-first-adjective": { vietnamese: "đầu tiên, thứ nhất", example: "This is my first visit to Hanoi." },
  "master-five-numeral": { definition: "the number 5", vietnamese: "năm", example: "The shop closes at five." },
  "master-flower-noun": { example: "This flower smells lovely.", topic: "nature" },
  "master-front-adjective": { definition: "at or on the forward part of something", vietnamese: "phía trước", example: "Please use the front door.", topic: "description" },
  "master-football-noun": { definition: "a team sport in which players kick a ball to score goals", vietnamese: "bóng đá", example: "They play football after school.", topic: "sports" },
  "master-forty-numeral": { definition: "the number 40", vietnamese: "bốn mươi", example: "The journey takes forty minutes." },
  "master-four-numeral": { definition: "the number 4", vietnamese: "bốn", example: "We need a table for four." },
  "master-fourteen-numeral": { definition: "the number 14", vietnamese: "mười bốn", example: "There are fourteen students in the class." },
  "master-friday-noun": { example: "We finish work early on Friday.", topic: "time" },
  "master-from-preposition": { definition: "used to show where or when something starts", vietnamese: "từ", example: "She comes from Vietnam." },
  "master-guest-noun": { example: "Our guest arrived early." },
  "master-game-noun": { definition: "an activity with rules that people play for fun or competition", vietnamese: "trò chơi, trận đấu", example: "Shall we play a game?", topic: "sports" },
  "master-garden-noun": { definition: "an area where people grow flowers, fruit, or vegetables", vietnamese: "vườn", example: "She grows tomatoes in her garden.", topic: "home" },
  "master-gold-adjective": { definition: "made of gold or having its yellow color", vietnamese: "bằng vàng, màu vàng kim", example: "She wore a gold ring.", topic: "description" },
  "master-green-adjective": { definition: "having the color of grass or leaves", vietnamese: "xanh lá cây", example: "He bought a green bicycle.", topic: "description" },
  "master-if-conjunction": { definition: "used to introduce a possible condition", vietnamese: "nếu", example: "Call me if you need help." },
  "master-into-preposition": { vietnamese: "vào trong", example: "She walked into the room." },
  "master-egg-noun": { definition: "an oval object produced by a bird and often eaten as food", vietnamese: "quả trứng", example: "I ate an egg for breakfast.", topic: "food" },
  "master-january-noun": { example: "The new term starts in January.", topic: "time" },
  "master-judge-verb": { definition: "to form an opinion about someone or something", vietnamese: "đánh giá, phán xét", example: "Do not judge people too quickly." },
  "master-july-noun": { example: "They are getting married in July.", topic: "time" },
  "master-june-noun": { example: "The weather is warm in June.", topic: "time" },
  "master-key-adjective": { definition: "very important to a result or situation", vietnamese: "chủ chốt, quan trọng", example: "Good communication is a key skill." },
  "master-key-noun": { definition: "a small metal object used to open a lock", vietnamese: "chìa khóa", example: "I left my key on the table." },
  "master-kitchen-noun": { example: "Breakfast is ready in the kitchen.", topic: "home" },
  "master-late-adverb": { vietnamese: "muộn", example: "The train arrived late." },
  "master-left-adjective": { vietnamese: "bên trái", example: "Use the left door." },
  "master-light-noun": { definition: "the natural or artificial energy that makes things visible", vietnamese: "ánh sáng", example: "The morning light came through the window.", topic: "nature" },
  "master-lot-pronoun": { definition: "a large amount or number", vietnamese: "nhiều", example: "A lot of people use this bus." },
  "master-long-adjective": { definition: "measuring a great distance from one end to the other", vietnamese: "dài", example: "It was a long journey.", topic: "description" },
  "master-look-verb": { definition: "to direct your eyes toward someone or something", vietnamese: "nhìn", example: "Look at the picture on the wall." },
  "master-machine-noun": { vietnamese: "máy móc", example: "This machine makes coffee." },
  "master-many-pronoun": { definition: "a large number of people or things", vietnamese: "nhiều người, nhiều thứ", example: "Many of us travel by bus." },
  "master-may-modal": { definition: "used to say that something is possible or permitted", vietnamese: "có thể, được phép", example: "It may rain this afternoon." },
  "master-mean-verb": { definition: "to express or represent a particular idea", vietnamese: "có nghĩa là", example: "What does this word mean?", topic: "communication" },
  "master-may-noun": { example: "The flowers open in May.", topic: "time" },
  "master-mine-pronoun": { vietnamese: "của tôi", example: "That blue bag is mine." },
  "master-monday-noun": { example: "The office opens again on Monday.", topic: "time" },
  "master-more-pronoun": { definition: "a greater amount or number", vietnamese: "nhiều hơn, thêm nữa", example: "Would you like some more?" },
  "master-much-pronoun": { definition: "a large amount of something", vietnamese: "nhiều", example: "Much of the work is already done." },
  "master-much-adverb": { definition: "by a large amount or degree", vietnamese: "nhiều, rất", example: "She's much better now." },
  "master-nine-numeral": { definition: "the number 9", vietnamese: "chín", example: "The lesson starts at nine." },
  "master-nineteen-numeral": { definition: "the number 19", vietnamese: "mười chín", example: "There are nineteen names on the list." },
  "master-newspaper-noun": { definition: "a printed or online publication that reports news", vietnamese: "báo", example: "He reads the newspaper every morning.", topic: "communication" },
  "master-ninety-numeral": { definition: "the number 90", vietnamese: "chín mươi", example: "The journey takes ninety minutes." },
  "master-no-determiner": { vietnamese: "không có, không một", example: "There is no milk in the fridge." },
  "master-nothing-pronoun": { definition: "not anything", vietnamese: "không có gì", example: "There is nothing in the box." },
  "master-november-noun": { example: "The course ends in November.", topic: "time" },
  "master-october-noun": { example: "The weather gets cooler in October.", topic: "time" },
  "master-of-preposition": { definition: "used to show that things are connected or that something belongs to someone", vietnamese: "của", example: "The door of the house was open." },
  "master-off-adjective": { vietnamese: "đã tắt, không hoạt động", example: "The lights are off." },
  "master-open-adjective": { definition: "not closed or blocked", vietnamese: "mở", example: "The window is open.", topic: "description" },
  "master-one-numeral": { definition: "the number 1", vietnamese: "một", example: "I need one more chair." },
  "master-or-conjunction": { definition: "used to connect different choices or possibilities", vietnamese: "hoặc", example: "Would you like tea or coffee?" },
  "master-other-determiner": { definition: "used to refer to a different person or thing", vietnamese: "khác", example: "The other door is locked." },
  "master-over-preposition": { vietnamese: "ở trên, qua", example: "The plane flew over the city." },
  "master-pay-noun": { definition: "money received for doing a job", vietnamese: "tiền lương", example: "The job offers good pay.", topic: "work" },
  "master-photo-noun": { vietnamese: "bức ảnh", example: "She showed me a family photo." },
  "master-pick-verb": { definition: "to choose someone or something from a group", vietnamese: "chọn", example: "Pick a number between one and ten." },
  "master-please-adverb": { vietnamese: "xin vui lòng", example: "Please close the window." },
  "master-pool-noun": { definition: "an area of water made for swimming", vietnamese: "bể bơi", example: "The children swam in the pool.", topic: "sports" },
  "master-real-adverb": { definition: "very", vietnamese: "rất", example: "The food was real good." },
  "master-red-adjective": { definition: "having the color of blood or fire", vietnamese: "đỏ", example: "She carried a red umbrella.", topic: "description" },
  "master-review-noun": { definition: "a written or spoken opinion about a book, film, or product", vietnamese: "bài đánh giá", example: "She wrote a review of the film.", topic: "communication" },
  "master-right-adjective": { definition: "on or toward the side opposite the left", vietnamese: "bên phải", example: "Raise your right hand.", topic: "description" },
  "master-same-pronoun": { definition: "the same person or thing", vietnamese: "người hoặc vật giống nhau", example: "We both ordered the same." },
  "master-saturday-noun": { example: "We visit the market on Saturday.", topic: "time" },
  "master-say-verb": { example: "Please say your name clearly." },
  "master-september-noun": { example: "School begins in September.", topic: "time" },
  "master-sea-noun": { definition: "a large area of salt water", vietnamese: "biển", example: "They travelled by sea.", topic: "nature" },
  "master-ship-noun": { definition: "a large vessel that travels on water", vietnamese: "tàu thủy", example: "The ship left the harbor.", topic: "travel" },
  "master-short-adjective": { definition: "measuring a small distance from one end to the other", vietnamese: "ngắn", example: "We took a short walk.", topic: "description" },
  "master-seven-numeral": { definition: "the number 7", vietnamese: "bảy", example: "Dinner is at seven." },
  "master-seventeen-numeral": { definition: "the number 17", vietnamese: "mười bảy", example: "She was seventeen when she left school." },
  "master-seventy-numeral": { definition: "the number 70", vietnamese: "bảy mươi", example: "My grandfather is seventy." },
  "master-should-modal": { definition: "used to say what is right, expected, or advisable", vietnamese: "nên", example: "You should get some rest." },
  "master-six-numeral": { definition: "the number 6", vietnamese: "sáu", example: "The shop opens at six." },
  "master-sixteen-numeral": { definition: "the number 16", vietnamese: "mười sáu", example: "The class has sixteen students." },
  "master-solve-verb": { definition: "to find an answer to a problem", vietnamese: "giải quyết, giải", example: "We worked together to solve the problem.", topic: "problem-solving" },
  "master-sixty-numeral": { definition: "the number 60", vietnamese: "sáu mươi", example: "An hour has sixty minutes." },
  "master-so-conjunction": { definition: "used to introduce the result of something", vietnamese: "vì vậy, nên", example: "It was late, so we went home." },
  "master-some-pronoun": { definition: "an amount or number that is not stated", vietnamese: "một ít, một số", example: "Some of the students walked home." },
  "master-someone-pronoun": { definition: "a person whose identity is not known or stated", vietnamese: "một người nào đó", example: "Someone is waiting outside." },
  "master-something-pronoun": { definition: "a thing that is not known or stated", vietnamese: "một điều gì đó", example: "I have something to tell you." },
  "master-sunday-noun": { example: "The shop is closed on Sunday.", topic: "time" },
  "master-start-verb": { definition: "to begin doing or happening", vietnamese: "bắt đầu", example: "The meeting will start at ten." },
  "master-stay-verb": { definition: "to remain in a place or condition", vietnamese: "ở lại", example: "Please stay here tonight." },
  "master-ten-numeral": { definition: "the number 10", vietnamese: "mười", example: "There are ten people in the group." },
  "master-thirteen-numeral": { definition: "the number 13", vietnamese: "mười ba", example: "There are thirteen books on the shelf." },
  "master-than-conjunction": { definition: "used after a comparison to introduce the second person or thing", vietnamese: "hơn, so với", example: "This room is larger than that one." },
  "master-than-preposition": { vietnamese: "hơn, so với", example: "She is taller than me." },
  "master-that-conjunction": { definition: "used to introduce a clause that gives information", vietnamese: "rằng", example: "I know that she is busy." },
  "master-that-determiner": { definition: "used to point to a particular person or thing farther away", vietnamese: "đó, kia", example: "Who is that man?" },
  "master-that-pronoun": { definition: "the person, thing, or idea being pointed to or mentioned", vietnamese: "điều đó, cái đó", example: "That is my seat." },
  "master-the-determiner": { definition: "used before a noun when the person or thing is already known or specific", vietnamese: "mạo từ xác định", example: "Please close the door." },
  "master-thirty-numeral": { definition: "the number 30", vietnamese: "ba mươi", example: "The trip takes thirty minutes." },
  "master-this-determiner": { definition: "used to point to a particular person or thing nearby", vietnamese: "này", example: "This book is very useful." },
  "master-this-pronoun": { definition: "the person, thing, or idea being pointed to nearby", vietnamese: "cái này, điều này", example: "This is my favorite song." },
  "master-three-numeral": { definition: "the number 3", vietnamese: "ba", example: "We have three children." },
  "master-thursday-noun": { example: "The meeting is on Thursday.", topic: "time" },
  "master-team-noun": { definition: "a group of people who play or work together", vietnamese: "đội, nhóm", example: "Our team won the match.", topic: "sports" },
  "master-time-noun": { definition: "what is measured in minutes, hours, days, and years", vietnamese: "thời gian", example: "What time does the meeting begin?", topic: "time" },
  "master-to-particle": { definition: "used before the basic form of a verb to form the infinitive", vietnamese: "dấu hiệu của động từ nguyên mẫu", example: "I want to learn English." },
  "master-to-preposition": { definition: "used to show a direction, destination, or receiver", vietnamese: "đến, tới, cho", example: "He walked to the station." },
  "master-tomorrow-noun": { vietnamese: "ngày mai", example: "Tomorrow is a public holiday.", topic: "time" },
  "master-tuesday-noun": { example: "Our next class is on Tuesday.", topic: "time" },
  "master-twelve-numeral": { definition: "the number 12", vietnamese: "mười hai", example: "There are twelve months in a year." },
  "master-twenty-numeral": { definition: "the number 20", vietnamese: "hai mươi", example: "The book costs twenty dollars." },
  "master-two-numeral": { definition: "the number 2", vietnamese: "hai", example: "We need two tickets." },
  "master-under-preposition": { definition: "in or to a lower position than something", vietnamese: "ở dưới", example: "The shoes are under the bed." },
  "master-until-preposition": { vietnamese: "cho đến", example: "The shop is open until six." },
  "master-wednesday-noun": { example: "I work from home on Wednesday.", topic: "time" },
  "master-welcome-interjection": { definition: "used to greet someone who has arrived", vietnamese: "chào mừng", example: "Welcome to our school!" },
  "master-winter-noun": { definition: "the coldest season of the year", vietnamese: "mùa đông", example: "It often snows here in winter.", topic: "time" },
  "master-when-conjunction": { definition: "at or during the time that something happens", vietnamese: "khi", example: "Call me when you arrive." },
  "master-where-conjunction": { definition: "at, in, or to the place that", vietnamese: "nơi mà", example: "Sit where you can see the screen." },
  "master-which-determiner": { vietnamese: "nào", example: "Which bus goes to the airport?" },
  "master-which-pronoun": { vietnamese: "cái nào", example: "Which of these keys is yours?" },
  "master-white-adjective": { vietnamese: "trắng", example: "He wore a white shirt." },
  "master-white-noun": { definition: "the lightest color", vietnamese: "màu trắng", example: "The walls were painted white." },
  "master-who-pronoun": { vietnamese: "ai, người mà", example: "Who is at the door?" },
  "master-will-modal": { definition: "used to talk about the future or a decision", vietnamese: "sẽ", example: "I will call you tomorrow." },
  "master-action-noun": { definition: "something that a person or group does", vietnamese: "hành động", example: "We need to take action now." },
  "master-add-verb": { definition: "to put something together with something else", vietnamese: "thêm, cộng", example: "Add some milk to the coffee." },
  "master-arm-noun": { definition: "one of the two long parts of the body between the shoulder and hand", vietnamese: "cánh tay", example: "She carried the bag under her arm." },
  "master-article-noun": { definition: "a piece of writing in a newspaper, magazine, or website", vietnamese: "bài báo, bài viết", example: "I read an interesting article about space." },
  "master-bring-verb": { definition: "to take someone or something with you to a place", vietnamese: "mang, đem", example: "Please bring your passport with you." },
  "master-call-noun": { definition: "a conversation with someone by phone", vietnamese: "cuộc gọi", example: "I got a call from my sister." },
  "master-care-noun": { definition: "the process of looking after someone or something", vietnamese: "sự chăm sóc", example: "The patient needs special care." },
  "master-character-noun": { definition: "a person in a story, film, or play", vietnamese: "nhân vật", example: "My favorite character is the detective." },
  "master-design-noun": { definition: "a drawing or plan that shows how something will be made", vietnamese: "thiết kế, bản thiết kế", example: "They chose a simple design for the house." },
  "master-do-verb": { definition: "to perform an action or activity", vietnamese: "làm", example: "I do my homework after dinner." },
  "master-dog-noun": { definition: "a common animal often kept as a pet", vietnamese: "con chó", example: "Their dog likes to play in the garden." },
  "master-exercise-verb": { definition: "to do physical activity to stay healthy or become stronger", vietnamese: "tập thể dục", example: "I exercise for thirty minutes every day." },
  "master-fire-noun": { definition: "heat, light, and flames produced when something burns", vietnamese: "lửa, đám cháy", example: "We sat around the fire to keep warm." },
  "master-flat-noun": { definition: "a set of rooms for living in, usually on one floor of a building", vietnamese: "căn hộ", example: "She rents a small flat near the station." },
  "master-foreign-adjective": { definition: "from or connected with another country", vietnamese: "nước ngoài, ngoại quốc", example: "She enjoys learning foreign languages." },
  "master-grow-verb": { definition: "to become bigger, taller, or more developed", vietnamese: "lớn lên, phát triển", example: "These plants grow quickly in warm weather." },
  "master-guess-verb": { definition: "to give an answer without being certain that it is correct", vietnamese: "đoán", example: "Can you guess his age?" },
  "master-high-adjective": { definition: "having a large distance from the bottom to the top", vietnamese: "cao", example: "The shelf is too high for me to reach." },
  "master-lesson-noun": { definition: "a period of time in which someone is taught something", vietnamese: "bài học, tiết học", example: "Our English lesson starts at nine." },
  "master-letter-noun": { definition: "a written symbol used in an alphabet", vietnamese: "chữ cái", example: "The word begins with the letter B." },
  "master-life-noun": { definition: "the time during which a person, animal, or plant is alive", vietnamese: "cuộc sống, sự sống", example: "She has lived here all her life." },
  "master-match-noun": { definition: "a sports competition between two people or teams", vietnamese: "trận đấu", example: "Our team won the match by two goals." },
  "master-mind-noun": { definition: "the part of a person that thinks, remembers, and feels", vietnamese: "tâm trí, trí óc", example: "I changed my mind after hearing the facts." },
  "master-move-noun": { definition: "an act of changing position or going to a different place", vietnamese: "sự di chuyển, nước đi", example: "His next move surprised everyone." },
  "master-note-verb": { definition: "to notice or give attention to something", vietnamese: "lưu ý, ghi nhận", example: "Please note the change in date." },
  "master-partner-noun": { definition: "a person or organization that you work or do an activity with", vietnamese: "đối tác, bạn đồng hành", example: "Discuss the question with a partner." },
  "master-plane-noun": { definition: "a vehicle with wings that flies through the air", vietnamese: "máy bay", example: "The plane landed safely." },
  "master-result-noun": { definition: "something that happens because of an action or event", vietnamese: "kết quả", example: "The result of the test was positive." },
  "master-rich-adjective": { definition: "having a lot of money or valuable possessions", vietnamese: "giàu có", example: "He became rich after building a successful company." },
  "master-rule-noun": { definition: "an official instruction that says what is allowed or required", vietnamese: "quy tắc, luật lệ", example: "Students must follow the school rules." },
  "master-shake-noun": { definition: "a cold drink made by mixing milk with ice cream or fruit", vietnamese: "sữa lắc", example: "I ordered a chocolate shake." },
  "master-shoe-noun": { definition: "something worn on the foot, usually with a firm sole", vietnamese: "giày", example: "I need a new pair of shoes." },
  "master-sport-noun": { definition: "a game or physical activity played for exercise or competition", vietnamese: "thể thao, môn thể thao", example: "Football is a popular sport." },
  "master-stage-noun": { definition: "a raised area where people perform for an audience", vietnamese: "sân khấu", example: "The singer walked onto the stage." },
  "master-station-noun": { definition: "a place where trains or buses regularly stop", vietnamese: "nhà ga, trạm", example: "We met outside the train station." },
  "master-stop-noun": { definition: "a place where a bus or train stops for passengers", vietnamese: "trạm dừng, điểm dừng", example: "The next bus stop is near the bank." },
  "master-stop-verb": { definition: "to finish moving or doing something", vietnamese: "dừng, ngừng", example: "The rain did not stop until evening." },
  "master-survey-noun": { definition: "a set of questions used to collect information from people", vietnamese: "cuộc khảo sát", example: "We completed a survey about public transport." },
  "master-take-verb": { definition: "to carry or move someone or something to another place", vietnamese: "mang, đưa", example: "Please take this bag upstairs." },
  "master-talk-verb": { definition: "to speak in order to communicate with someone", vietnamese: "nói chuyện", example: "Can we talk after class?" },
  "master-test-noun": { definition: "a set of questions or tasks used to measure knowledge or ability", vietnamese: "bài kiểm tra", example: "We have a math test tomorrow." },
  "master-think-verb": { definition: "to use your mind to consider something", vietnamese: "suy nghĩ", example: "What do you think about this idea?" },
  "master-type-noun": { definition: "a group of things that share similar features", vietnamese: "loại, kiểu", example: "What type of music do you like?" },
  "master-vote-noun": { definition: "a formal choice made in an election or meeting", vietnamese: "lá phiếu, sự bỏ phiếu", example: "The proposal passed by one vote." },
  "master-want-verb": { definition: "to wish to have or do something", vietnamese: "muốn", example: "I want a glass of water." },
  "master-war-noun": { definition: "a period of fighting between countries or organized groups", vietnamese: "chiến tranh", example: "Many families left the country during the war." },
  "master-watch-noun": { definition: "a small clock worn on the wrist", vietnamese: "đồng hồ đeo tay", example: "My watch says it is nearly noon." },
  "master-word-noun": { definition: "a single unit of language that has meaning", vietnamese: "từ, từ ngữ", example: "This word is difficult to spell." },
  "master-yet-adverb": { definition: "up to the present time, especially in questions and negative statements", vietnamese: "chưa, vẫn chưa", example: "Have you finished your homework yet?" },
  "master-yourself-pronoun": { vietnamese: "chính bạn, bản thân bạn", example: "You should be proud of yourself." },
};

const records: VocabularyItem[] = [];
const unresolved: { id: string; fields: string[] }[] = [];
const senseRisks: { id: string; senseCount: number; matchScore: number; vietnameseSource: string }[] = [];
const sourceCounts = { simpleDefinitions: 0, wordnetDefinitions: 0, simpleExamples: 0, wordnetExamples: 0, vietnameseExamples: 0, definitionalExamples: 0, omwVietnamese: 0 };
for (const row of targets) {
  const override = overrides[row.id];
  const simple = parseSimple(row);
  const allWordnetSenses = wordnetSensesFor(row);
  const wordnet = wordnetFor(row, simple.definition);
  const vi = vietnameseFor(row);
  const useSimple = validSimpleDefinition(simple.definition);
  let definition = override?.definition ?? (row.partOfSpeech === "verb"
    ? verbDefinition(useSimple ? simple.definition : undefined, wordnet?.definition)
    : definitionText(useSimple ? simple.definition! : wordnet?.definition ?? ""));
  if (row.partOfSpeech !== "verb" && definition) definition = definition[0].toLocaleLowerCase() + definition.slice(1);
  definition = conciseDefinition(definition);
  if (useSimple && row.partOfSpeech !== "verb") sourceCounts.simpleDefinitions += 1;
  else if (definition) sourceCounts.wordnetDefinitions += 1;

  let example = override?.example ?? simple.example;
  if (example) sourceCounts.simpleExamples += 1;
  if (!example) {
    example = wordnet?.examples.find((candidate) => containsTarget(candidate, row.lemma));
    if (example) sourceCounts.wordnetExamples += 1;
  }
  if (!example) {
    example = vi?.examples.find((candidate) => containsTarget(candidate, row.lemma));
    if (example) sourceCounts.vietnameseExamples += 1;
  }
  if (!example && useSimple && containsTarget(simple.definition!, row.lemma)) {
    example = simple.definition;
    sourceCounts.definitionalExamples += 1;
  }

  const omwVietnamese = omwVietnameseFor(wordnet);
  const matchScore = simple.definition && wordnet ? senseSimilarity(simple.definition, wordnet.definition, row.lemma) : 1;
  if (!override && allWordnetSenses.length >= 3 && matchScore < 0.25) senseRisks.push({ id: row.id, senseCount: allWordnetSenses.length, matchScore: Number(matchScore.toFixed(2)), vietnameseSource: omwVietnamese ? "omw" : "wiktionary-first-sense" });
  if (!override?.vietnamese && omwVietnamese) sourceCounts.omwVietnamese += 1;
  const vietnamese = cleanVietnamese(override?.vietnamese ?? omwVietnamese ?? vi?.gloss ?? "");
  const missing = [!definition && "definition", !vietnamese && "vietnamese", !example && "example"].filter(Boolean) as string[];
  if (missing.length) unresolved.push({ id: row.id, fields: missing });
  if (missing.length) continue;
  const topic = override?.topic ?? topicFor(row, wordnet);
  records.push({
    id: row.id,
    word: row.lemma,
    lemma: row.lemma,
    partOfSpeech: row.partOfSpeech,
    cefrLevel: row.cefrLevel,
    status: "validated",
    provenanceId: batchId,
    cefrBasis: row.cefrBasis,
    cefrSourceId: row.cefrSourceId,
    frequencyBasis: row.frequencyBasis,
    frequencySourceId: row.frequencySourceId,
    frequencyRank: row.frequencyRank,
    frequencyBand: row.frequencyBand,
    provenanceIds: [...new Set([...row.provenanceIds, batchId])],
    meanings: [{ definition, vietnamese }],
    examples: [sentence(singleExample(example!, row.lemma))],
    synonyms: [],
    antonyms: [],
    wordFamily: [],
    collocations: [],
    topics: [topic],
    tags: [row.cefrLevel.toLocaleLowerCase(), row.partOfSpeech, topic, "enriched-001"],
  });
}

const serialized = `import type { VocabularyItem } from "@/types/domain";\n\nexport const enrichedVocabulary001: VocabularyItem[] = ${JSON.stringify(records, null, 2)};\n`;
fs.writeFileSync(outputPath, serialized);
fs.writeFileSync(reportPath, JSON.stringify({ requested: targets.length, generated: records.length, unresolved, senseRisks, sourceCounts }, null, 2));
console.log(JSON.stringify({ requested: targets.length, generated: records.length, unresolved: unresolved.length, senseRisks: senseRisks.length, sourceCounts }));
