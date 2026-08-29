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
const batchNumber = batchId.match(/enriched-([0-9a-z]+)/i)?.[1] ?? "Batch";
const exportName = `enrichedVocabulary${batchNumber}`;

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
  "master-advertisement-noun": { example: "I saw an advertisement for the new café." },
  "master-against-preposition": { definition: "in opposition to someone or something", vietnamese: "chống lại, đối lập với", example: "Most people voted against the proposal." },
  "master-alone-adjective": { vietnamese: "một mình, cô độc", example: "She felt alone in the new city." },
  "master-although-conjunction": { definition: "used to introduce a fact that makes another fact surprising", vietnamese: "mặc dù", example: "Although it was raining, we went for a walk." },
  "master-another-pronoun": { definition: "one more person or thing of the same type", vietnamese: "một người hoặc vật khác", example: "This cup is dirty; please give me another." },
  "master-as-conjunction": { definition: "used to show that two things happen at the same time", vietnamese: "khi, trong lúc", example: "I waved as the train left." },
  "master-batch-noun": { example: "The bakery made a fresh batch of bread." },
  "master-battery-noun": { example: "The phone needs a new battery." },
  "master-before-conjunction": { definition: "earlier than the time when something happens", vietnamese: "trước khi", example: "Wash your hands before you eat." },
  "master-brown-noun": { example: "Brown is her favorite color." },
  "master-can-noun": { definition: "a metal container used for food or drink", vietnamese: "lon, hộp kim loại", example: "He opened a can of soup." },
  "master-chairman-noun": { example: "The chairman opened the meeting." },
  "master-cheer-verb": { example: "The crowd began to cheer when the team scored." },
  "master-dislike-noun": { example: "He has a strong dislike of crowded places." },
  "master-during-preposition": { definition: "throughout or at some time in a period or event", vietnamese: "trong, trong suốt", example: "Please turn off your phone during the movie." },
  "master-either-conjunction": { definition: "used with or to show a choice between two possibilities", vietnamese: "hoặc", example: "You can either walk or take the bus." },
  "master-email-verb": { definition: "to send a message to someone by email", vietnamese: "gửi email", example: "Please email the report to me." },
  "master-enough-pronoun": { definition: "as much or as many as is needed", vietnamese: "đủ", example: "We have enough to share with everyone." },
  "master-except-conjunction": { definition: "used before a statement that is the only thing not included", vietnamese: "ngoại trừ, trừ khi", example: "I would go, except I have to work." },
  "master-express-noun": { definition: "a fast train or bus that stops at only a few places", vietnamese: "tàu hoặc xe tốc hành", example: "We took the express to the city center." },
  "master-for-conjunction": { definition: "because; used to introduce a reason", vietnamese: "vì", example: "We stayed inside, for it was raining heavily." },
  "master-free-adverb": { example: "Children under five can travel free." },
  "master-front-noun": { example: "Write your name on the front of the envelope." },
  "master-gas-noun": { example: "The stove uses gas for cooking." },
  "master-golf-noun": { example: "They play golf every Saturday." },
  "master-green-noun": { example: "The walls were painted a pale green." },
  "master-half-determiner": { definition: "an amount equal to one of two equal parts", vietnamese: "một nửa", example: "Half the class was absent." },
  "master-half-pronoun": { definition: "one of two equal parts of something", vietnamese: "một nửa", example: "I ate half and saved the rest." },
  "master-herself-pronoun": { vietnamese: "chính cô ấy, bản thân cô ấy", example: "She made the dress herself." },
  "master-himself-pronoun": { vietnamese: "chính anh ấy, bản thân anh ấy", example: "He fixed the bicycle himself." },
  "master-horror-noun": { example: "She watched in horror as the car left the road." },
  "master-hundred-numeral": { definition: "the number 100", vietnamese: "một trăm", example: "The hall can hold one hundred people." },
  "master-independence-noun": { example: "The country gained independence in 1960." },
  "master-inside-adverb": { vietnamese: "ở bên trong, vào trong", example: "It was cold, so we went inside." },
  "master-it-noun": { definition: "information technology; the use of computers and electronic systems", vietnamese: "công nghệ thông tin", example: "She works in IT at a local company." },
  "master-last-pronoun": { definition: "the final person or thing in a group", vietnamese: "người hoặc vật cuối cùng", example: "I was the last to leave." },
  "master-latter-pronoun": { definition: "the second of two people or things just mentioned", vietnamese: "người hoặc vật thứ hai", example: "Of tea and coffee, I prefer the latter." },
  "master-left-adverb": { vietnamese: "sang trái, về bên trái", example: "Turn left at the traffic lights." },
  "master-less-determiner": { definition: "a smaller amount of something", vietnamese: "ít hơn", example: "Try to eat less sugar." },
  "master-less-pronoun": { definition: "a smaller amount", vietnamese: "ít hơn", example: "This job pays less than my old one." },
  "master-lie-verb": { example: "I need to lie down for a while." },
  "master-lifestyle-noun": { vietnamese: "lối sống", example: "Regular exercise is part of a healthy lifestyle." },
  "master-low-adverb": { vietnamese: "thấp, ở mức thấp", example: "The plane flew low over the fields." },
  "master-marry-verb": { example: "They plan to marry next summer." },
  "master-might-modal": { definition: "used to say that something is possible", vietnamese: "có thể", example: "It might rain this afternoon." },
  "master-million-numeral": { definition: "the number 1,000,000", vietnamese: "một triệu", example: "The video received a million views." },
  "master-most-pronoun": { definition: "the largest part or number", vietnamese: "phần lớn, đa số", example: "Most of the students passed." },
  "master-myself-pronoun": { definition: "used when the speaker is also affected by an action", vietnamese: "chính tôi, bản thân tôi", example: "I made this cake myself." },
  "master-nobody-pronoun": { definition: "not one person; no one", vietnamese: "không ai", example: "Nobody knew the answer." },
  "master-off-adverb": { vietnamese: "đi khỏi, tắt", example: "Please turn the light off." },
  "master-online-adjective": { example: "The course includes an online dictionary." },
  "master-online-adverb": { vietnamese: "trực tuyến, trên mạng", example: "You can book your ticket online." },
  "master-other-pronoun": { definition: "a different person or thing from the one already mentioned", vietnamese: "người hoặc vật khác", example: "One shoe is black and the other is brown." },
  "master-ourselves-pronoun": { vietnamese: "chính chúng tôi, bản thân chúng tôi", example: "We painted the room ourselves." },
  "master-overseas-adverb": { vietnamese: "ở nước ngoài, ra nước ngoài", example: "She worked overseas for three years." },
  "master-own-pronoun": { definition: "something that belongs to the person mentioned", vietnamese: "của riêng mình", example: "I would like a room of my own." },
  "master-pan-noun": { example: "Heat the oil in a large pan." },
  "master-pass-noun": { definition: "a card or document that allows someone to enter or travel", vietnamese: "thẻ, giấy phép", example: "Show your pass at the entrance." },
  "master-pink-noun": { example: "Pink is often used in the bedroom." },
  "master-policeman-noun": { example: "A policeman helped us cross the road." },
  "master-prediction-noun": { example: "Her prediction about the weather was correct." },
  "master-ray-noun": { example: "A ray of sunlight came through the window." },
  "master-red-noun": { example: "The traffic light changed from green to red." },
  "master-rent-verb": { vietnamese: "thuê, cho thuê", example: "We rent a small apartment near the office." },
  "master-acceptable-adjective": { definition: "good enough to be allowed or approved", vietnamese: "có thể chấp nhận được", example: "Your ideas are acceptable to the group." },
  "master-account-noun": { definition: "an arrangement with a bank for keeping and using money", vietnamese: "tài khoản", example: "I opened a bank account last week." },
  "master-agency-noun": { definition: "an organization that provides a particular service", vietnamese: "cơ quan, đại lý", example: "She works for a travel agency." },
  "master-apply-verb": { definition: "to make a formal request for something such as a job or course", vietnamese: "nộp đơn, đăng ký", example: "I plan to apply for the job." },
  "master-argument-noun": { definition: "an angry disagreement between people", vietnamese: "cuộc tranh cãi", example: "They had an argument about money." },
  "master-attractive-adjective": { definition: "pleasant to look at or interesting", vietnamese: "hấp dẫn, thu hút", example: "The town is attractive to young families." },
  "master-audience-noun": { definition: "the people who watch or listen to a performance or speech", vietnamese: "khán giả, thính giả", example: "The audience applauded at the end." },
  "master-break-noun": { definition: "a short period of rest between activities", vietnamese: "giờ nghỉ, sự nghỉ", example: "We took a short break after lunch." },
  "master-clear-adjective": { definition: "easy to understand, see, or hear", vietnamese: "rõ ràng", example: "The instructions are clear and simple." },
  "master-click-verb": { definition: "to press a button on a computer mouse or screen", vietnamese: "nhấp chuột, bấm", example: "Click the button to continue." },
  "master-condition-noun": { definition: "the state that someone or something is in", vietnamese: "tình trạng", example: "The bicycle is still in good condition." },
  "master-confuse-verb": { definition: "to make someone unable to understand something clearly", vietnamese: "làm bối rối, gây nhầm lẫn", example: "The similar names confuse many people." },
  "master-consist-verb": { definition: "to be made of particular things or people", vietnamese: "bao gồm, gồm có", example: "The course consists of ten lessons." },
  "master-court-noun": { definition: "a place where legal cases are decided by a judge", vietnamese: "tòa án", example: "The case will go to court next month." },
  "master-crazy-adjective": { definition: "extremely unreasonable, strange, or foolish", vietnamese: "điên rồ, mất trí", example: "It would be crazy to drive in this storm." },
  "master-destroy-verb": { definition: "to damage something so badly that it no longer exists or works", vietnamese: "phá hủy", example: "The fire could destroy the whole building." },
  "master-die-verb": { definition: "to stop being alive", vietnamese: "chết, qua đời", example: "Many plants die without enough water." },
  "master-display-noun": { definition: "a collection of things arranged for people to look at", vietnamese: "phần trưng bày, màn hình", example: "The museum has a display of old photographs." },
  "master-disturb-verb": { definition: "to interrupt or prevent someone from resting or working", vietnamese: "làm phiền, quấy rầy", example: "Please do not disturb her while she is working." },
  "master-draw-noun": { definition: "a result in which neither side wins a game or competition", vietnamese: "trận hòa", example: "The match ended in a draw." },
  "master-easily-adverb": { definition: "without difficulty or effort", vietnamese: "dễ dàng", example: "You can easily walk there in ten minutes." },
  "master-episode-noun": { definition: "one part of a television or radio series", vietnamese: "tập phim, tập chương trình", example: "We watched the final episode last night." },
  "master-exercise-noun": { definition: "physical activity done to stay healthy or become stronger", vietnamese: "sự tập thể dục, bài tập", example: "Regular exercise helps me sleep better." },
  "master-explore-verb": { definition: "to travel around a place to learn about it", vietnamese: "khám phá, thăm dò", example: "We spent the day exploring the old city." },
  "master-fairly-adverb": { definition: "moderately; quite", vietnamese: "khá, tương đối", example: "The test was fairly easy." },
  "master-help-noun": { definition: "support or assistance given to someone", vietnamese: "sự giúp đỡ", example: "Thank you for your help." },
  "master-hero-noun": { definition: "a person admired for being brave or doing something great", vietnamese: "người anh hùng", example: "The firefighter became a local hero." },
  "master-human-adjective": { definition: "relating to people rather than animals or machines", vietnamese: "thuộc về con người", example: "Every person has basic human rights." },
  "master-impress-verb": { definition: "to make someone admire or respect you", vietnamese: "gây ấn tượng", example: "Her calm answer impressed the interviewers." },
  "master-instrument-noun": { definition: "a tool or device used for a particular purpose", vietnamese: "dụng cụ, nhạc cụ", example: "The doctor checked the instrument before using it." },
  "master-killer-noun": { definition: "a person or thing that kills", vietnamese: "kẻ giết người, thứ gây chết người", example: "Police are still searching for the killer." },
  "master-lip-noun": { definition: "one of the two soft edges around the mouth", vietnamese: "môi", example: "She cut her lower lip." },
  "master-logical-adjective": { definition: "reasonable and based on clear thinking", vietnamese: "hợp lý, hợp logic", example: "That seems like a logical solution." },
  "master-lose-verb": { definition: "to no longer have something because you cannot find it", vietnamese: "mất, làm mất", example: "Try not to lose your keys." },
  "master-low-adjective": { definition: "not high or below the usual level", vietnamese: "thấp", example: "The table is too low for this chair." },
  "master-mad-adjective": { definition: "very angry", vietnamese: "tức giận", example: "She was mad at me for being late." },
  "master-mean-adjective": { definition: "unkind or cruel", vietnamese: "xấu tính, ác ý", example: "It was mean of him to laugh at her." },
  "master-nature-noun": { definition: "the physical world, including plants, animals, and landscapes", vietnamese: "thiên nhiên", example: "The program teaches children about nature." },
  "master-notice-noun": { definition: "a written or spoken announcement that gives information", vietnamese: "thông báo", example: "A notice on the door said the shop was closed." },
  "master-plant-noun": { definition: "a living thing that usually grows in soil and has leaves and roots", vietnamese: "cây, thực vật", example: "This plant needs plenty of sunlight." },
  "master-point-verb": { definition: "to show the direction of something with a finger or object", vietnamese: "chỉ, chỉ vào", example: "She pointed at the name on the list." },
  "master-post-verb": { definition: "to send a letter or package through the mail", vietnamese: "gửi qua bưu điện", example: "I need to post this letter today." },
  "master-power-noun": { definition: "the ability to control people or events", vietnamese: "quyền lực, sức mạnh", example: "The president has the power to change the policy." },
  "master-production-noun": { definition: "the process of making or growing goods in large amounts", vietnamese: "sự sản xuất", example: "The factory increased production this year." },
  "master-professional-adjective": { definition: "relating to a job that needs special training or skill", vietnamese: "chuyên nghiệp, thuộc nghề nghiệp", example: "You should ask for professional advice." },
  "master-proper-adjective": { definition: "correct or suitable for a particular purpose", vietnamese: "đúng, phù hợp", example: "Wear proper shoes for walking." },
  "master-publish-verb": { definition: "to make a book, article, or other work available to the public", vietnamese: "xuất bản, công bố", example: "The magazine will publish her article next month." },
  "master-pursue-verb": { definition: "to continue trying to achieve or obtain something", vietnamese: "theo đuổi", example: "She moved abroad to pursue her career." },
  "master-quality-noun": { definition: "how good or bad something is", vietnamese: "chất lượng", example: "The quality of the food has improved." },
  "master-refer-verb": { definition: "to mention or speak about someone or something", vietnamese: "đề cập, nhắc đến", example: "The report refers to several recent studies." },
  "master-ring-noun": { definition: "a small circular piece of jewelry worn on a finger", vietnamese: "nhẫn", example: "She wears a silver ring." },
  "master-rock-noun": { definition: "a hard natural material that forms part of the earth", vietnamese: "đá", example: "He sat on a large rock beside the river." },
  "master-rush-noun": { definition: "a sudden quick movement or period of busy activity", vietnamese: "sự vội vã, lúc cao điểm", example: "There was a rush to leave after the show." },
  "master-adjust-verb": { definition: "to change something slightly so that it works or fits better", vietnamese: "điều chỉnh", example: "I adjusted the chair to a comfortable height." },
  "master-area-noun": { definition: "a particular part of a place or surface", vietnamese: "khu vực, vùng", example: "This is a quiet residential area." },
  "master-bear-verb": { definition: "to support or carry the weight of something", vietnamese: "chịu, nâng đỡ", example: "These walls bear the weight of the roof." },
  "master-concentrate-verb": { definition: "to give all your attention to one thing", vietnamese: "tập trung", example: "I cannot concentrate with the television on." },
  "master-creature-noun": { definition: "a living being, especially an animal", vietnamese: "sinh vật", example: "The forest is home to many small creatures." },
  "master-drill-noun": { definition: "a tool or machine used for making holes", vietnamese: "máy khoan, mũi khoan", example: "He used a drill to make a hole in the wall." },
  "master-earth-noun": { definition: "soil or the ground", vietnamese: "đất, mặt đất", example: "The farmer planted the seeds in the earth." },
  "master-invade-verb": { definition: "to enter a country by force with an army", vietnamese: "xâm lược", example: "The army tried to invade the neighboring country." },
  "master-level-noun": { definition: "a particular height, amount, standard, or position", vietnamese: "mức, cấp độ", example: "The water level rose after the rain." },
  "master-major-adjective": { definition: "important, serious, or large in size", vietnamese: "lớn, quan trọng, chủ yếu", example: "Traffic is a major problem in the city." },
  "master-most-adverb": { definition: "more than anyone or anything else", vietnamese: "nhất", example: "What matters most to you?" },
  "master-nervous-adjective": { definition: "worried or slightly afraid about what may happen", vietnamese: "lo lắng, hồi hộp", example: "I felt nervous before the interview." },
  "master-perform-verb": { definition: "to do a task, action, or piece of work", vietnamese: "thực hiện, biểu diễn", example: "The machine can perform several tasks." },
  "master-plastic-adjective": { definition: "made of plastic", vietnamese: "bằng nhựa", example: "Please put the bottles in a plastic bag." },
  "master-purpose-noun": { definition: "the reason why something exists or is done", vietnamese: "mục đích", example: "The purpose of the meeting is to choose a leader." },
  "master-reflect-verb": { definition: "to show or express the nature of something", vietnamese: "phản ánh", example: "The results reflect a change in public opinion." },
  "master-retire-verb": { definition: "to stop working permanently, usually because of age", vietnamese: "nghỉ hưu", example: "She plans to retire at sixty-five." },
  "master-common-adjective": { definition: "shared by two or more people or things", vietnamese: "chung", example: "The two teams have a common goal." },
  "master-direction-noun": { definition: "the way that someone or something moves or faces", vietnamese: "hướng, phương hướng", example: "Are we walking in the right direction?" },
  "master-enormous-adjective": { definition: "extremely large", vietnamese: "to lớn, khổng lồ", example: "An enormous crowd gathered outside." },
  "master-mind-verb": { definition: "to be annoyed or upset by something", vietnamese: "phiền, ngại", example: "Do you mind if I open the window?" },
  "master-release-noun": { definition: "the act of making a product, film, or recording available to the public", vietnamese: "sự phát hành", example: "Fans are waiting for the album's release." },
  "master-reply-noun": { definition: "an answer given in words or writing", vietnamese: "câu trả lời, hồi đáp", example: "I sent an email but received no reply." },
  "master-across-adverb": { definition: "on or toward the opposite side", vietnamese: "ở phía bên kia, ngang qua", example: "The river is only twenty meters across." },
  "master-across-preposition": { definition: "from one side of something to the other", vietnamese: "qua, ngang qua", example: "We walked across the bridge." },
  "master-all-adverb": { definition: "completely or entirely", vietnamese: "hoàn toàn, toàn bộ", example: "The directions were all wrong." },
  "master-average-adjective": { definition: "neither especially good nor especially bad", vietnamese: "trung bình", example: "He is an average student." },
  "master-deep-adverb": { definition: "far below the surface or top", vietnamese: "sâu", example: "The roots grow deep into the soil." },
  "master-deeply-adverb": { definition: "very strongly or seriously", vietnamese: "sâu sắc, rất", example: "They were deeply worried about him." },
  "master-east-adverb": { definition: "toward or in the east", vietnamese: "về hướng đông", example: "We traveled east for several miles." },
  "master-fear-noun": { definition: "an unpleasant feeling caused by danger or worry", vietnamese: "nỗi sợ hãi", example: "She has a fear of heights." },
  "master-fully-adverb": { definition: "completely or to the greatest possible degree", vietnamese: "hoàn toàn, đầy đủ", example: "The hotel is fully booked." },
  "master-in-adverb": { definition: "inside or toward the inside of a place", vietnamese: "vào trong, ở trong", example: "Please come in and sit down." },
  "master-quite-adverb": { definition: "fairly or completely, depending on the context", vietnamese: "khá, hoàn toàn", example: "The room is quite small." },
  "master-least-determiner": { example: "Choose the route with the least traffic." },
  "master-along-adverb": { definition: "forward or onward in a line", vietnamese: "dọc theo, tiến về phía trước", example: "Come along with us." },
  "master-hand-verb": { definition: "to pass something directly to another person", vietnamese: "đưa, trao tận tay", example: "Please hand me that tool." },
  "master-move-verb": { definition: "to change position or location", vietnamese: "di chuyển, dời", example: "Do not move until the bus stops." },
  "master-second-pronoun": { definition: "the second person or thing in a group", vietnamese: "người hoặc vật thứ hai", example: "The first answer was wrong, but the second was correct." },
  "master-several-pronoun": { definition: "more than two but not many people or things", vietnamese: "vài người hoặc vật", example: "Several of us stayed after class." },
  "master-shall-modal": { definition: "used with I or we to talk about the future or make a suggestion", vietnamese: "sẽ, nhé", example: "Shall we meet at eight?" },
  "master-shot-noun": { definition: "an attempt to hit a target or score in a sport", vietnamese: "cú sút, cú đánh", example: "His first shot missed the goal." },
  "master-single-adjective": { vietnamese: "đơn, duy nhất", example: "There was not a single empty seat." },
  "master-somebody-pronoun": { definition: "an unspecified or unknown person", vietnamese: "ai đó", example: "Somebody left a bag on the bus." },
  "master-south-noun": { example: "They live in the south of France." },
  "master-strongly-adverb": { vietnamese: "mạnh mẽ, rất", example: "I strongly agree with your decision." },
  "master-such-pronoun": { definition: "people or things of the kind just mentioned", vietnamese: "người hoặc vật như vậy", example: "Such was the situation when we arrived." },
  "master-suggest-verb": { example: "I suggest taking an earlier train." },
  "master-themselves-pronoun": { vietnamese: "chính họ, bản thân họ", example: "They built the house themselves." },
  "master-though-conjunction": { definition: "despite the fact that; although", vietnamese: "mặc dù", example: "Though it was late, nobody wanted to leave." },
  "master-thousand-numeral": { definition: "the number 1,000", vietnamese: "một nghìn", example: "More than a thousand people attended." },
  "master-tonight-noun": { definition: "the present or coming evening or night", vietnamese: "tối nay", example: "Tonight is our last night here." },
  "master-trap-noun": { example: "The mouse escaped from the trap." },
  "master-unnecessary-adjective": { example: "The extra form creates unnecessary work." },
  "master-upset-adjective": { vietnamese: "buồn, khó chịu", example: "She was upset about the bad news." },
  "master-valley-noun": { example: "A river runs through the valley." },
  "master-west-noun": { example: "The sun sets in the west." },
  "master-while-conjunction": { definition: "during the time that something else happens", vietnamese: "trong khi", example: "I listened to music while I cooked." },
  "master-share-noun": { definition: "one part of something divided among several people", vietnamese: "phần, phần chia", example: "Everyone paid their share of the bill." },
  "master-shock-noun": { definition: "a sudden feeling of surprise or distress", vietnamese: "cú sốc, sự bàng hoàng", example: "The news came as a shock to everyone." },
  "master-show-noun": { definition: "a performance or public display", vietnamese: "buổi biểu diễn, cuộc trưng bày", example: "We saw an art show at the museum." },
  "master-society-noun": { definition: "people living together in an organized community", vietnamese: "xã hội", example: "Technology has changed modern society." },
  "master-spread-noun": { definition: "a soft food put on bread or crackers", vietnamese: "đồ phết lên bánh mì", example: "This cheese spread tastes good on toast." },
  "master-square-adjective": { definition: "having four equal sides and four right angles", vietnamese: "vuông", example: "They sat around a square table." },
  "master-staff-noun": { definition: "the people who work for an organization", vietnamese: "nhân viên", example: "The hotel staff were very helpful." },
  "master-state-noun": { definition: "the condition that someone or something is in", vietnamese: "trạng thái, tình trạng", example: "The building is in a poor state." },
  "master-study-noun": { definition: "a detailed investigation of a subject", vietnamese: "nghiên cứu", example: "A recent study found that sleep improves memory." },
  "master-style-noun": { definition: "a particular way of doing, designing, or wearing something", vietnamese: "phong cách, kiểu", example: "I like her simple writing style." },
  "master-support-noun": { definition: "help, approval, or encouragement given to someone", vietnamese: "sự hỗ trợ, sự ủng hộ", example: "Her family gave her a lot of support." },
  "master-survive-verb": { definition: "to continue living or existing after danger or difficulty", vietnamese: "sống sót, tồn tại", example: "Few plants can survive in this heat." },
  "master-sweet-noun": { definition: "a small piece of food made mainly from sugar", vietnamese: "kẹo, đồ ngọt", example: "The child chose a sweet from the bag." },
  "master-trouble-noun": { definition: "problems, difficulty, or an unpleasant situation", vietnamese: "rắc rối, khó khăn", example: "We had trouble finding the address." },
  "master-trust-verb": { definition: "to believe that someone is honest or reliable", vietnamese: "tin tưởng, tin cậy", example: "I trust her to keep the secret." },
  "master-web-noun": { definition: "a net of thin threads made by a spider", vietnamese: "mạng nhện", example: "A spider built a web in the corner." },
  "master-whole-adjective": { definition: "including every part of something", vietnamese: "toàn bộ, cả", example: "We spent the whole day at the beach." },
  "master-wood-noun": { definition: "the hard material that forms the trunk and branches of a tree", vietnamese: "gỗ", example: "The table is made of wood." },
  "master-west-adverb": { definition: "toward or in the west", vietnamese: "về hướng tây", example: "We drove west toward the coast." },
  "master-ad-noun": { example: "I saw an ad for the job online." },
  "master-adopt-verb": { example: "The school decided to adopt a new teaching method." },
  "master-after-conjunction": { definition: "later than the time when something happens", vietnamese: "sau khi", example: "We went home after the meeting ended." },
  "master-arise-verb": { example: "Problems may arise if we rush the work." },
  "master-boast-verb": { vietnamese: "khoe khoang", example: "He likes to boast about his achievements." },
  "master-bore-verb": { vietnamese: "làm chán", example: "Long speeches bore the audience." },
  "master-bound-adjective": { definition: "certain or very likely to happen", vietnamese: "chắc chắn, nhất định", example: "Mistakes are bound to happen." },
  "master-branch-verb": { example: "The road branches into two paths near the village." },
  "master-chemical-noun": { vietnamese: "hóa chất", example: "The factory stores each chemical safely." },
  "master-collapse-noun": { definition: "a sudden failure or fall", vietnamese: "sự sụp đổ", example: "The bridge collapse blocked the road." },
  "master-constitution-noun": { example: "The constitution protects basic rights." },
  "master-correction-noun": { example: "The teacher made one correction to my answer." },
  "master-curriculum-noun": { example: "The school added coding to its curriculum." },
  "master-dozen-determiner": { definition: "a group or amount of twelve", vietnamese: "một tá", example: "She bought a dozen eggs." },
  "master-either-pronoun": { definition: "one or the other of two people or things", vietnamese: "một trong hai", example: "Either of these routes will take us there." },
  "master-equality-noun": { example: "The law promotes equality between men and women." },
  "master-exploration-noun": { example: "Space exploration requires advanced technology." },
  "master-few-pronoun": { definition: "a small number of people or things", vietnamese: "một vài, ít người hoặc vật", example: "Many were invited, but few attended." },
  "master-frustration-noun": { example: "She cried with frustration when the computer failed again." },
  "master-goodness-interjection": { definition: "used to express surprise or worry", vietnamese: "trời ơi", example: "Goodness, is it that late already?" },
  "master-grant-noun": { example: "The project received a research grant." },
  "master-graphics-noun": { example: "The game has impressive graphics." },
  "master-hurt-adjective": { vietnamese: "bị tổn thương, đau lòng", example: "She felt hurt by his comment." },
  "master-ink-noun": { example: "The printer has run out of black ink." },
  "master-judge-noun": { example: "The judge listened to both sides of the case." },
  "master-kid-verb": { example: "I am not angry; I am only kidding." },
  "master-lab-noun": { example: "Scientists tested the material in a lab." },
  "master-like-conjunction": { definition: "in the same way as", vietnamese: "như, giống như", example: "It looks like the train has left." },
  "master-link-noun": { example: "Researchers found a link between sleep and memory." },
  "master-link-verb": { example: "The bridge will link the island to the mainland." },
  "master-little-pronoun": { definition: "a small amount", vietnamese: "một ít, không nhiều", example: "Little is known about the early history of the town." },
  "master-mass-adjective": { definition: "involving or affecting a large number of people or things", vietnamese: "đại chúng, hàng loạt", example: "The internet changed mass communication." },
  "master-minus-preposition": { vietnamese: "trừ đi, không có", example: "Ten minus three equals seven." },
  "master-nearby-adverb": { vietnamese: "ở gần, gần đó", example: "We found a café nearby." },
  "master-abandon-verb": { definition: "to leave someone or something permanently", vietnamese: "từ bỏ, bỏ rơi", example: "The crew had to abandon the damaged ship." },
  "master-absorb-verb": { definition: "to take in liquid, heat, light, or information", vietnamese: "hấp thụ, tiếp thu", example: "This cloth can absorb a lot of water." },
  "master-academic-adjective": { definition: "connected with education, study, or schools", vietnamese: "thuộc học thuật, thuộc nhà trường", example: "The course develops academic writing skills." },
  "master-accent-noun": { definition: "a particular way of pronouncing a language", vietnamese: "giọng, âm sắc", example: "She speaks English with a French accent." },
  "master-acceptance-noun": { definition: "the act of agreeing to or approving something", vietnamese: "sự chấp nhận", example: "The plan gained wide acceptance." },
  "master-accompany-verb": { definition: "to go somewhere with someone", vietnamese: "đi cùng, tháp tùng", example: "A guide will accompany us on the tour." },
  "master-account-verb": { definition: "to form a particular amount or part of something", vietnamese: "chiếm, giải thích", example: "Online sales account for half of our income." },
  "master-act-verb": { definition: "to behave in a particular way", vietnamese: "hành động, cư xử", example: "We must act quickly to prevent more damage." },
  "master-admission-noun": { definition: "permission to enter a place or organization", vietnamese: "sự cho vào, quyền vào cửa", example: "Admission to the museum is free." },
  "master-aim-noun": { definition: "something that you hope to achieve", vietnamese: "mục tiêu", example: "Our main aim is to reduce waste." },
  "master-allowance-noun": { definition: "an amount of money given regularly for personal use", vietnamese: "tiền tiêu vặt, khoản trợ cấp", example: "She saves part of her weekly allowance." },
  "master-alternative-adjective": { definition: "different from the usual or original choice", vietnamese: "thay thế, khác", example: "We need an alternative route to the airport." },
  "master-application-noun": { definition: "a formal request for a job, place, or permission", vietnamese: "đơn đăng ký, đơn xin", example: "Please submit your application by Friday." },
  "master-arrest-verb": { definition: "to take someone into police custody", vietnamese: "bắt giữ", example: "Police arrested the suspect at the station." },
  "master-atmosphere-noun": { definition: "the feeling or mood of a place or situation", vietnamese: "bầu không khí", example: "The restaurant has a relaxed atmosphere." },
  "master-balance-noun": { definition: "a steady position in which weight is evenly spread", vietnamese: "sự thăng bằng, cân bằng", example: "He lost his balance and fell." },
  "master-bar-verb": { definition: "to prevent someone from entering or doing something", vietnamese: "cấm, ngăn", example: "The rules bar visitors from entering this area." },
  "master-base-verb": { definition: "to use a particular place as the main location for something", vietnamese: "đặt trụ sở, đặt căn cứ", example: "The company is based in Singapore." },
  "master-basin-noun": { definition: "a wide open container used for holding water", vietnamese: "chậu, bồn", example: "She filled the basin with warm water." },
  "master-breakthrough-noun": { definition: "an important discovery or achievement that helps solve a problem", vietnamese: "bước đột phá", example: "Scientists made a major breakthrough in cancer treatment." },
  "master-builder-noun": { definition: "a person whose job is to construct or repair buildings", vietnamese: "thợ xây, người xây dựng", example: "The builder repaired the damaged wall." },
  "master-burn-verb": { definition: "to damage or destroy something with fire or heat", vietnamese: "đốt, làm cháy", example: "Be careful not to burn the food." },
  "master-calculation-noun": { definition: "the process or result of using numbers to find an answer", vietnamese: "phép tính, sự tính toán", example: "I checked the calculation twice." },
  "master-capacity-noun": { definition: "the largest amount that a container or place can hold", vietnamese: "sức chứa, dung tích", example: "The hall has a capacity of five hundred people." },
  "master-capture-verb": { definition: "to catch and hold a person, animal, or place", vietnamese: "bắt giữ, chiếm giữ", example: "The camera captured the bird in flight." },
  "master-chaos-noun": { definition: "a state of complete confusion and disorder", vietnamese: "sự hỗn loạn", example: "The power cut caused chaos at the station." },
  "master-charge-noun": { definition: "a formal statement that someone may have committed a crime", vietnamese: "cáo buộc, tội danh", example: "The police brought a serious charge against him." },
  "master-clinic-noun": { definition: "a place where people receive medical treatment or advice", vietnamese: "phòng khám", example: "She went to the clinic for a checkup." },
  "master-commit-verb": { definition: "to promise or decide firmly to do something", vietnamese: "cam kết", example: "The company committed to reducing its emissions." },
  "master-confidence-noun": { definition: "belief in your own ability or in someone you trust", vietnamese: "sự tự tin, lòng tin", example: "Practice helped her gain confidence." },
  "master-confirmation-noun": { definition: "proof or a message showing that something is certain or arranged", vietnamese: "sự xác nhận", example: "You will receive confirmation by email." },
  "master-contain-verb": { definition: "to have something inside or as a part", vietnamese: "chứa, bao gồm", example: "This drink contains no added sugar." },
  "master-contrary-adjective": { definition: "opposite in nature, direction, or meaning", vietnamese: "trái ngược", example: "The evidence supports the contrary view." },
  "master-crash-noun": { definition: "an accident in which a vehicle hits something", vietnamese: "vụ va chạm, tai nạn", example: "Two people were injured in the car crash." },
  "master-crush-noun": { definition: "a strong but often temporary romantic feeling for someone", vietnamese: "cảm nắng, sự mê thích", example: "She had a crush on a classmate." },
  "master-damage-noun": { definition: "physical harm that makes something less useful or valuable", vietnamese: "thiệt hại, hư hỏng", example: "The storm caused serious damage to the roof." },
  "master-deal-verb": { definition: "to take action to solve or manage a problem", vietnamese: "xử lý, giải quyết", example: "We need to deal with this problem today." },
  "master-demand-noun": { definition: "the need or desire for a product or service", vietnamese: "nhu cầu", example: "Demand for electric cars is increasing." },
  "master-deny-verb": { definition: "to say that something is not true", vietnamese: "phủ nhận", example: "He denied taking the money." },
  "master-department-noun": { definition: "a section of an organization with a particular purpose", vietnamese: "phòng, ban, bộ phận", example: "She works in the sales department." },
  "master-development-noun": { definition: "the process of growing, changing, or becoming more advanced", vietnamese: "sự phát triển", example: "The project supports child development." },
  "master-device-noun": { definition: "a piece of equipment made for a particular purpose", vietnamese: "thiết bị", example: "This device measures air quality." },
  "master-dramatic-adjective": { definition: "sudden, large, and noticeable", vietnamese: "mạnh mẽ, đáng kể", example: "There was a dramatic rise in prices." },
  "master-dump-noun": { definition: "a place where waste is taken and left", vietnamese: "bãi rác", example: "The old factory site became a rubbish dump." },
  "master-duty-noun": { definition: "something that you are responsible for doing", vietnamese: "nhiệm vụ, bổn phận", example: "It is our duty to keep passengers safe." },
  "master-election-noun": { definition: "an organized vote to choose a person for an official position", vietnamese: "cuộc bầu cử", example: "The country will hold an election in May." },
  "master-entry-noun": { definition: "the act or right of going into a place", vietnamese: "sự vào, lối vào", example: "Entry is not allowed after midnight." },
  "master-essence-noun": { definition: "the most basic and important quality of something", vietnamese: "bản chất, cốt lõi", example: "Trust is the essence of a good partnership." },
  "master-experience-verb": { definition: "to have something happen to you", vietnamese: "trải qua, trải nghiệm", example: "The city experienced rapid growth." },
  "master-express-verb": { definition: "to show or communicate a thought or feeling", vietnamese: "bày tỏ, diễn đạt", example: "She found it difficult to express her feelings." },
  "master-facility-noun": { definition: "a place, building, or equipment provided for a particular purpose", vietnamese: "cơ sở, tiện nghi", example: "The sports facility is open to the public." },
  "master-fascinate-verb": { definition: "to interest someone very much", vietnamese: "làm say mê, cuốn hút", example: "Stories about space fascinate the children." },
  "master-firm-adjective": { definition: "solid, hard, or not likely to change", vietnamese: "chắc, kiên quyết", example: "The mattress provides firm support." },
  "master-formal-adjective": { definition: "official, serious, or suitable for an important occasion", vietnamese: "trang trọng, chính thức", example: "The committee made a formal announcement." },
  "master-foundation-noun": { definition: "the basic idea, principle, or support on which something is built", vietnamese: "nền tảng, cơ sở", example: "Trust is the foundation of their relationship." },
  "master-general-noun": { definition: "a high-ranking officer who commands an army", vietnamese: "tướng", example: "The general spoke to the soldiers." },
  "master-generally-adverb": { definition: "in most cases or usually", vietnamese: "nói chung, thường", example: "The buses are generally on time." },
  "master-graph-noun": { definition: "a diagram that shows how numbers or amounts are related", vietnamese: "biểu đồ, đồ thị", example: "The graph shows a steady increase in sales." },
  "master-guide-noun": { definition: "a person who shows visitors around a place", vietnamese: "hướng dẫn viên", example: "Our guide explained the history of the temple." },
  "master-guide-verb": { definition: "to show someone the way or help them make a decision", vietnamese: "hướng dẫn, dẫn đường", example: "Signs guide visitors through the museum." },
  "master-highly-adverb": { definition: "very much or to a high degree", vietnamese: "rất, ở mức độ cao", example: "The course is highly recommended." },
  "master-historical-adjective": { definition: "connected with the past or the study of history", vietnamese: "thuộc lịch sử", example: "The novel is based on historical events." },
  "master-hunt-verb": { definition: "to chase and kill wild animals for food or sport", vietnamese: "săn, săn bắn", example: "The animals hunt at night." },
  "master-immediate-adjective": { definition: "happening or done without delay", vietnamese: "ngay lập tức, tức thời", example: "The patient needs immediate treatment." },
  "master-instruction-noun": { definition: "a direction or order that explains what to do", vietnamese: "chỉ dẫn, hướng dẫn", example: "Read each instruction carefully." },
  "master-interest-verb": { definition: "to make someone want to know or learn more", vietnamese: "làm quan tâm, gây hứng thú", example: "This course may interest students who enjoy science." },
  "master-launch-verb": { definition: "to introduce a new product, service, or project", vietnamese: "ra mắt, khởi động", example: "The company will launch a new app next month." },
  "master-literature-noun": { definition: "written works such as novels, poems, and plays", vietnamese: "văn học", example: "She studied English literature at university." },
  "master-loyal-adjective": { definition: "continuing to support a person, group, or idea", vietnamese: "trung thành", example: "The team has many loyal supporters." },
  "master-measure-noun": { definition: "an action taken to achieve a purpose or solve a problem", vietnamese: "biện pháp", example: "The new safety measure reduced accidents." },
  "master-monitor-noun": { definition: "a screen used to display information from a computer", vietnamese: "màn hình", example: "The results appeared on the monitor." },
  "master-network-noun": { definition: "a connected group of people, places, or systems", vietnamese: "mạng lưới", example: "The company has a network of local offices." },
  "master-ad-noun": { definition: "a short public message that promotes a product, service, or job", vietnamese: "mẩu quảng cáo", example: "I saw an ad for the job online." },
  "master-afterward-adverb": { definition: "at a later time, after an event has finished", vietnamese: "sau đó", example: "We had dinner and went for a walk afterward." },
  "master-assist-verb": { definition: "to give support to someone doing a task", vietnamese: "hỗ trợ, giúp đỡ", example: "A nurse assisted the doctor during the procedure." },
  "master-authority-noun": { definition: "the official power to make decisions or give orders", vietnamese: "thẩm quyền, quyền lực", example: "Only the manager has the authority to approve this." },
  "master-eager-adjective": { definition: "very interested and excited about doing something", vietnamese: "háo hức, hăm hở", example: "The students were eager to begin." },
  "master-exploration-noun": { definition: "the activity of traveling or examining something to discover more", vietnamese: "sự khám phá, thăm dò", example: "Space exploration requires advanced technology." },
  "master-forth-adverb": { definition: "forward or away from a place", vietnamese: "về phía trước, ra ngoài", example: "The ship sailed forth into the open sea." },
  "master-further-adverb": { definition: "at a greater degree, distance, or more advanced point", vietnamese: "xa hơn, thêm nữa", example: "We need to investigate the matter further." },
  "master-generate-verb": { definition: "to produce energy, income, or a result", vietnamese: "tạo ra, phát sinh", example: "The panels generate electricity from sunlight." },
  "master-none-pronoun": { definition: "not one or not any of a group", vietnamese: "không ai, không cái nào", example: "I offered help, but none was needed." },
  "master-nor-conjunction": { definition: "used before a second negative idea or choice", vietnamese: "cũng không", example: "She did not call, nor did she send a message." },
  "master-obviously-adverb": { vietnamese: "rõ ràng, hiển nhiên", example: "He was obviously tired after the journey." },
  "master-off-preposition": { vietnamese: "khỏi, ra khỏi", example: "The cup fell off the table." },
  "master-pace-noun": { example: "The work continued at a steady pace." },
  "master-parental-adjective": { example: "Children need parental support." },
  "master-per-preposition": { vietnamese: "mỗi, theo", example: "The car was traveling at sixty kilometers per hour." },
  "master-plenty-pronoun": { definition: "more than enough of something", vietnamese: "nhiều, dư dả", example: "There is plenty for everyone." },
  "master-plus-conjunction": { definition: "and also; in addition", vietnamese: "cộng với, thêm vào đó", example: "The room is large, plus it has a balcony." },
  "master-quality-adjective": { definition: "of a high standard", vietnamese: "chất lượng cao", example: "The shop sells quality furniture." },
  "master-objection-noun": { definition: "a reason for disagreeing with or opposing something", vietnamese: "sự phản đối, ý kiến phản đối", example: "She raised an objection to the plan." },
  "master-organ-noun": { definition: "a part of the body with a particular function", vietnamese: "cơ quan nội tạng", example: "The heart is a vital organ." },
  "master-outline-verb": { definition: "to describe the main facts or ideas briefly", vietnamese: "phác thảo, trình bày khái quát", example: "The report outlines three possible solutions." },
  "master-overwhelm-verb": { definition: "to defeat someone completely or affect them very strongly", vietnamese: "áp đảo, làm cho choáng ngợp", example: "The size of the task overwhelmed him." },
  "master-plug-noun": { definition: "a device used to connect electrical equipment to a power supply", vietnamese: "phích cắm", example: "Remove the plug from the wall socket." },
  "master-practical-adjective": { definition: "useful and suitable for a real situation", vietnamese: "thiết thực, thực tế", example: "She offered practical advice." },
  "master-prescription-noun": { definition: "a doctor's written order for medicine or treatment", vietnamese: "đơn thuốc", example: "The pharmacist checked my prescription." },
  "master-presentation-noun": { definition: "a formal talk in which someone explains a topic to an audience", vietnamese: "bài thuyết trình", example: "She gave a presentation about climate change." },
  "master-president-noun": { definition: "the elected leader of a country or organization", vietnamese: "tổng thống, chủ tịch", example: "The president addressed the nation." },
  "master-producer-noun": { definition: "a person or company that makes goods, films, or programs", vietnamese: "nhà sản xuất", example: "The producer approved the final version of the film." },
  "master-qualify-verb": { definition: "to have the skills or conditions needed for something", vietnamese: "đủ điều kiện, đạt tiêu chuẩn", example: "She hopes to qualify for the final." },
  "master-representative-noun": { example: "A company representative answered our questions." },
  "master-scream-verb": { example: "She began to scream when she saw the snake." },
  "master-second-adverb": { vietnamese: "thứ hai, ở vị trí thứ hai", example: "Our team finished second in the competition." },
  "master-separation-noun": { example: "The separation of waste makes recycling easier." },
  "master-ship-verb": { example: "The company will ship the order tomorrow." },
  "master-shut-adjective": { vietnamese: "đóng, khép", example: "Keep the door shut during the meeting." },
  "master-since-conjunction": { definition: "because; used to introduce a reason", vietnamese: "vì, bởi vì", example: "Since everyone is here, we can begin." },
  "master-single-noun": { definition: "one person or thing, especially a ticket or recorded song", vietnamese: "vé một chiều, đĩa đơn", example: "The band released a new single." },
  "master-race-noun": { definition: "a competition to find who is fastest", vietnamese: "cuộc đua", example: "She won the race by two seconds." },
  "master-race-verb": { definition: "to move or go very quickly", vietnamese: "chạy nhanh, đua", example: "We raced to catch the last bus." },
  "master-regard-verb": { definition: "to consider or think of someone or something in a particular way", vietnamese: "coi là, xem như", example: "Many people regard the book as a classic." },
  "master-relation-noun": { definition: "the connection between two or more people or things", vietnamese: "mối quan hệ, sự liên hệ", example: "The study examines the relation between diet and health." },
  "master-restore-verb": { definition: "to return something to an earlier good condition", vietnamese: "khôi phục, phục hồi", example: "Workers restored the old building." },
  "master-result-verb": { definition: "to happen or exist because of something else", vietnamese: "dẫn đến, bắt nguồn từ", example: "Poor planning can result in delays." },
  "master-routine-noun": { definition: "the usual order and way in which activities are done", vietnamese: "thói quen, lịch thường lệ", example: "Exercise is part of her daily routine." },
  "master-service-verb": { definition: "to examine, maintain, or repair a machine or vehicle", vietnamese: "bảo dưỡng, sửa chữa", example: "You should service the car once a year." },
  "master-settle-verb": { definition: "to solve or end an argument or disagreement", vietnamese: "giải quyết, dàn xếp", example: "They settled the dispute peacefully." },
  "master-shallow-adjective": { definition: "not deep", vietnamese: "nông, cạn", example: "Children can play in the shallow water." },
  "master-shop-verb": { definition: "to visit stores or websites in order to buy things", vietnamese: "mua sắm", example: "We usually shop for food on Saturday." },
  "master-sink-verb": { definition: "to go down below the surface of water", vietnamese: "chìm", example: "Heavy objects sink in water." },
  "master-slip-verb": { definition: "to slide accidentally and lose your balance", vietnamese: "trượt, trượt chân", example: "Be careful not to slip on the wet floor." },
  "master-southern-adjective": { vietnamese: "thuộc phía nam, ở miền nam", example: "They live on the southern coast." },
  "master-split-noun": { definition: "a division or separation into parts or groups", vietnamese: "sự chia tách, vết nứt", example: "The decision caused a split in the team." },
  "master-surgeon-noun": { example: "The surgeon performed the operation successfully." },
  "master-till-conjunction": { definition: "up to the time when; until", vietnamese: "cho đến khi", example: "Wait here till I return." },
  "master-top-adjective": { vietnamese: "hàng đầu, cao nhất", example: "She is one of the country's top scientists." },
  "master-traditionally-adverb": { vietnamese: "theo truyền thống", example: "The festival is traditionally held in spring." },
  "master-underneath-preposition": { vietnamese: "ở dưới, bên dưới", example: "The keys were underneath the newspaper." },
  "master-unless-conjunction": { definition: "except if; used to say what must happen to avoid a result", vietnamese: "trừ khi", example: "We will be late unless we leave now." },
  "master-until-conjunction": { definition: "up to the time when something happens", vietnamese: "cho đến khi", example: "Stay here until the rain stops." },
  "master-urge-noun": { example: "She felt a strong urge to laugh." },
  "master-spectacular-adjective": { definition: "very impressive or exciting to look at", vietnamese: "ngoạn mục", example: "The view from the mountain was spectacular." },
  "master-standard-noun": { definition: "an accepted level of quality or achievement", vietnamese: "tiêu chuẩn", example: "The work meets a high standard." },
  "master-star-verb": { definition: "to have one of the main roles in a film, play, or show", vietnamese: "đóng vai chính", example: "She will star in a new television series." },
  "master-strain-noun": { definition: "pressure or worry caused by a difficult situation", vietnamese: "sự căng thẳng, áp lực", example: "The long hours put a strain on his health." },
  "master-stream-noun": { definition: "a small narrow river", vietnamese: "dòng suối", example: "A clear stream runs through the forest." },
  "master-superior-adjective": { definition: "better in quality or greater in ability than something else", vietnamese: "vượt trội, ưu việt", example: "This material is superior to the cheaper version." },
  "master-suppose-verb": { definition: "to think that something is probably true", vietnamese: "cho rằng, giả sử", example: "I suppose he will arrive soon." },
  "master-switch-noun": { definition: "a small control used to turn a device on or off", vietnamese: "công tắc", example: "The light switch is beside the door." },
  "master-terminal-noun": { definition: "a building where passengers begin or end a journey", vietnamese: "nhà ga, nhà ga hành khách", example: "We waited for the bus inside the terminal." },
  "master-trail-noun": { definition: "a path through the countryside or forest", vietnamese: "đường mòn", example: "The trail leads to the lake." },
  "master-treatment-noun": { definition: "medical care given to cure an illness or injury", vietnamese: "sự điều trị, cách chữa trị", example: "The patient responded well to treatment." },
  "master-trouble-verb": { definition: "to cause someone worry, difficulty, or pain", vietnamese: "làm phiền, làm lo lắng", example: "The decision continued to trouble him." },
  "master-update-verb": { definition: "to make something more current by adding new information", vietnamese: "cập nhật", example: "Please update your contact details." },
  "master-warm-verb": { vietnamese: "làm ấm, ấm lên", example: "Warm the soup over a low heat." },
  "master-whatever-pronoun": { vietnamese: "bất cứ điều gì", example: "You can choose whatever you prefer." },
  "master-whenever-conjunction": { definition: "at any time that something happens", vietnamese: "bất cứ khi nào", example: "Call me whenever you need help." },
  "master-whether-conjunction": { definition: "used to introduce two possibilities or express doubt", vietnamese: "liệu, có hay không", example: "I do not know whether he will come." },
  "master-workplace-noun": { vietnamese: "nơi làm việc", example: "Safety is important in every workplace." },
  "master-yet-conjunction": { definition: "but; despite what was just mentioned", vietnamese: "nhưng, tuy vậy", example: "The task was difficult, yet we finished on time." },
  "master-violence-noun": { definition: "behavior intended to hurt people or damage property", vietnamese: "bạo lực", example: "The campaign aims to reduce violence." },
  "master-warn-verb": { definition: "to tell someone about possible danger or trouble", vietnamese: "cảnh báo", example: "They warned us about the strong current." },
  "master-waste-noun": { definition: "unwanted material or things that are no longer useful", vietnamese: "rác thải, chất thải", example: "The factory must reduce its waste." },
  "master-wonder-noun": { definition: "a feeling of surprise and admiration caused by something unusual", vietnamese: "sự kinh ngạc, điều kỳ diệu", example: "The children stared at the stars in wonder." },
  "master-since-conjunction": { definition: "given that something is true; because", vietnamese: "vì, bởi vì", example: "Since the road is closed, we must take another route." },
  "master-scare-verb": { definition: "to cause someone to feel afraid", vietnamese: "làm sợ, dọa", example: "The sudden noise scared the child." },
  "master-whatever-pronoun": { definition: "anything at all, regardless of what it is", vietnamese: "bất cứ điều gì", example: "You can choose whatever you prefer." },
  "master-pardon-verb": { definition: "to officially forgive someone for a crime or wrongdoing", vietnamese: "ân xá, tha thứ", example: "The governor agreed to pardon the prisoner." },
  "master-relate-verb": { definition: "to show or explain how two things are connected", vietnamese: "liên hệ, kết nối", example: "The report relates income to health outcomes." },
  "master-adopted-adjective": { vietnamese: "được nhận nuôi, được chọn dùng", example: "She grew up with her adopted family." },
  "master-alert-verb": { vietnamese: "cảnh báo, báo cho biết", example: "The alarm alerted staff to the fire." },
  "master-alongside-preposition": { vietnamese: "bên cạnh, cùng với", example: "She worked alongside experienced engineers." },
  "master-analyst-noun": { example: "A financial analyst reviewed the company's results." },
  "master-anchorage-noun": { example: "The bay provides a safe anchorage for small boats." },
  "master-anchorman-noun": { definition: "a male presenter who leads a television or radio news program", vietnamese: "nam dẫn chương trình tin tức", example: "The anchorman introduced the evening's main story." },
  "master-anchorperson-noun": { definition: "a presenter who leads a television or radio news program", vietnamese: "người dẫn chương trình tin tức", example: "The anchorperson interviewed the minister." },
  "master-antibacterial-adjective": { definition: "able to kill bacteria or stop them from growing", vietnamese: "kháng khuẩn", example: "Wash the surface with antibacterial soap." },
  "master-artistry-noun": { example: "The dancer's artistry impressed the audience." },
  "master-aspiration-noun": { example: "Her main aspiration is to become a doctor." },
  "master-assembly-noun": { example: "The students gathered for the morning assembly." },
  "master-attribute-noun": { example: "Patience is an important attribute for a teacher." },
  "master-audition-noun": { example: "She sang two songs at the audition." },
  "master-accommodation-noun": { definition: "a place where someone can stay or live", vietnamese: "chỗ ở, nơi lưu trú", example: "The hotel provides accommodation for visitors." },
  "master-ache-verb": { definition: "to feel a continuous dull pain", vietnamese: "đau, nhức", example: "My legs ache after the long walk." },
  "master-advancement-noun": { definition: "progress or improvement in knowledge, position, or technology", vietnamese: "sự tiến bộ, thăng tiến", example: "The discovery led to a major advancement in medicine." },
  "master-anchor-noun": { definition: "a heavy object dropped from a boat to keep it in place", vietnamese: "mỏ neo", example: "The crew lowered the anchor near the island." },
  "master-anticipation-noun": { definition: "a feeling of excitement about something expected to happen", vietnamese: "sự mong đợi, háo hức", example: "The children waited in anticipation." },
  "master-arouse-verb": { definition: "to cause a feeling, interest, or reaction", vietnamese: "khơi dậy, gợi lên", example: "The announcement aroused public interest." },
  "master-articulate-verb": { definition: "to express an idea or feeling clearly in words", vietnamese: "diễn đạt rõ ràng", example: "She articulated her concerns clearly." },
  "master-assess-verb": { definition: "to judge the quality, value, or importance of something", vietnamese: "đánh giá", example: "The doctor assessed the patient's condition." },
  "master-assessment-noun": { definition: "a judgment about the quality, value, or ability of something", vietnamese: "sự đánh giá", example: "The report gives an honest assessment of the risks." },
  "master-athletics-noun": { definition: "sports involving running, jumping, or throwing", vietnamese: "điền kinh", example: "She competes in athletics at national level." },
  "master-authoritative-adjective": { definition: "confident, reliable, and showing expert knowledge", vietnamese: "có thẩm quyền, đáng tin cậy", example: "This book is an authoritative guide to the subject." },
  "master-backup-noun": { definition: "a reserve person, system, or copy used if the main one fails", vietnamese: "phương án dự phòng, bản sao lưu", example: "Always keep a backup of important files." },
  "master-balanced-adjective": { vietnamese: "cân bằng, hài hòa", example: "A balanced diet includes a variety of foods." },
  "master-ban-noun": { definition: "an official rule that forbids something", vietnamese: "lệnh cấm", example: "The city introduced a ban on smoking indoors." },
  "master-ban-verb": { example: "The school banned phones during exams." },
  "master-barbershop-noun": { definition: "a shop where a barber cuts hair", vietnamese: "tiệm cắt tóc nam", example: "He gets his hair cut at the local barbershop." },
  "master-barrier-noun": { vietnamese: "rào cản, vật chắn", example: "Language can be a barrier to communication." },
  "master-bathhouse-noun": { example: "The old bathhouse has separate bathing rooms." },
  "master-bellow-verb": { vietnamese: "gầm, hét lớn", example: "The coach bellowed instructions from the side of the field." },
  "master-berry-noun": { example: "She added a fresh berry to each cake." },
  "master-bestseller-noun": { example: "Her first novel became a bestseller." },
  "master-bewilderment-noun": { example: "He stared at the instructions in bewilderment." },
  "master-bidding-noun": { example: "Several companies took part in the bidding for the contract." },
  "master-billion-noun": { definition: "the number 1,000,000,000", vietnamese: "một tỷ", example: "The company is worth more than a billion dollars." },
  "master-birdcage-noun": { vietnamese: "lồng chim", example: "The birdcage stood beside the window." },
  "master-blast-noun": { example: "The blast damaged several nearby buildings." },
  "master-blaze-verb": { vietnamese: "cháy rực, bùng cháy", example: "The fire continued to blaze through the night." },
  "master-bloodstream-noun": { example: "The medicine quickly entered the bloodstream." },
  "master-blooming-adjective": { vietnamese: "đang nở hoa", example: "The garden was full of blooming roses." },
  "master-bold-noun": { definition: "a thick dark style of printed letters", vietnamese: "chữ in đậm", example: "Use bold for the main heading." },
  "master-bolt-noun": { example: "Tighten the bolt with a tool." },
  "master-bombard-noun": { definition: "a large cannon used in the past", vietnamese: "đại bác cổ", example: "The museum displays a medieval bombard." },
  "master-bothered-adjective": { vietnamese: "bận tâm, khó chịu", example: "She did not seem bothered by the noise." },
  "master-bourbon-noun": { example: "The sauce contains a small amount of bourbon." },
  "master-bow-verb": { example: "The actors bow at the end of the performance." },
  "master-bruise-noun": { example: "The fall left a bruise on his arm." },
  "master-bulimia-noun": { example: "Bulimia is a serious eating disorder." },
  "master-burden-verb": { example: "We should not burden children with adult problems." },
  "master-bureaucracy-noun": { example: "The permit was delayed by government bureaucracy." },
  "master-bustling-adjective": { vietnamese: "nhộn nhịp, tấp nập", example: "The market was bustling with shoppers." },
  "master-cannonball-noun": { vietnamese: "đạn đại bác", example: "The old cannonball was found near the fort." },
  "master-cardigan-noun": { example: "She wore a warm cardigan over her shirt." },
  "master-bark-verb": { definition: "to make the short loud sound of a dog", vietnamese: "sủa", example: "The dog began to bark at the stranger." },
  "master-barren-adjective": { definition: "unable to produce plants or crops", vietnamese: "cằn cỗi", example: "Very little grows on the barren land." },
  "master-benevolent-adjective": { definition: "kind and willing to help others", vietnamese: "nhân từ, rộng lượng", example: "The charity was supported by a benevolent donor." },
  "master-bitterly-adverb": { vietnamese: "một cách cay đắng, dữ dội", example: "She complained bitterly about the decision." },
  "master-bounce-noun": { definition: "an upward movement after hitting a surface", vietnamese: "sự nảy lên", example: "The ball took a high bounce." },
  "master-bracket-noun": { definition: "a group between a lower and upper limit", vietnamese: "nhóm, khung", example: "Most participants were in the 20–30 age bracket." },
  "master-bum-noun": { definition: "a person who avoids work and depends on others", vietnamese: "kẻ ăn bám, người vô công rồi nghề", example: "He worried that people would see him as a bum." },
  "master-cane-noun": { definition: "a long stick used to support someone while walking", vietnamese: "gậy chống", example: "He used a cane after the operation." },
  "master-carbon-noun": { definition: "a chemical element found in all living things", vietnamese: "cacbon", example: "Carbon is present in coal and oil." },
  "master-cast-verb": { definition: "to cause light or shadow to appear on a surface", vietnamese: "chiếu, tạo ra", example: "The lamp cast a shadow on the wall." },
  "master-attached-adjective": { definition: "feeling strong affection or connection to someone or something", vietnamese: "gắn bó", example: "She became deeply attached to the old house." },
  "master-amongst-preposition": { definition: "surrounded by or included in a group", vietnamese: "giữa, trong số", example: "She felt comfortable amongst friends." },
  "master-bad-tempered-adjective": { definition: "easily annoyed or made angry", vietnamese: "hay cáu, dễ nổi nóng", example: "The bad-tempered customer shouted at the staff." },
  "master-brother-in-law-noun": { definition: "the brother of your spouse or the husband of your sibling", vietnamese: "anh/em rể, anh/em của vợ hoặc chồng", example: "My brother-in-law joined us for dinner." },
  "master-catering-noun": { vietnamese: "dịch vụ ăn uống", example: "The hotel provides catering for large events." },
  "master-cellist-noun": { example: "The cellist performed a solo at the concert." },
  "master-circumstance-noun": { example: "We may change the plan if the circumstance requires it." },
  "master-cooperate-verb": { example: "The two teams agreed to cooperate on the project." },
  "master-correspondence-noun": { example: "She kept all her business correspondence in one folder." },
  "master-corridor-noun": { example: "His office is at the end of the corridor." },
  "master-courtesy-noun": { example: "He treated every guest with courtesy." },
  "master-crack-noun": { vietnamese: "vết nứt", example: "A narrow crack appeared in the wall." },
  "master-crew-noun": { example: "The rescue crew arrived within minutes." },
  "master-damn-adjective": { vietnamese: "chết tiệt, đáng ghét", example: "This damn machine has stopped again." },
  "master-damn-adverb": { vietnamese: "cực kỳ, quá", example: "The test was damn difficult." },
  "master-damn-interjection": { definition: "used to express anger or disappointment", vietnamese: "chết tiệt", example: "Damn! I forgot my keys." },
  "master-certify-verb": { definition: "to state officially that something is true or meets a standard", vietnamese: "chứng nhận", example: "An engineer must certify that the building is safe." },
  "master-challenge-verb": { definition: "to test someone's ability or skill", vietnamese: "thử thách", example: "The course will challenge advanced students." },
  "master-chancellor-noun": { definition: "a senior political, legal, or university official", vietnamese: "thủ tướng, hiệu trưởng danh dự", example: "The chancellor announced a new education policy." },
  "master-competent-adjective": { definition: "having enough skill or knowledge to do something well", vietnamese: "có năng lực, thành thạo", example: "She is a competent and careful engineer." },
  "master-conceive-verb": { definition: "to imagine or form an idea in your mind", vietnamese: "hình dung, nghĩ ra", example: "It is difficult to conceive of life without electricity." },
  "master-concession-noun": { definition: "something given up or allowed in order to reach an agreement", vietnamese: "sự nhượng bộ", example: "Both sides made a concession during the talks." },
  "master-conduct-verb": { definition: "to organize and carry out an activity", vietnamese: "tiến hành, thực hiện", example: "Researchers conducted a survey of local residents." },
  "master-confess-verb": { definition: "to admit that you did something wrong or illegal", vietnamese: "thú nhận, thú tội", example: "He confessed to stealing the money." },
  "master-confine-verb": { definition: "to keep someone or something within a limited area or activity", vietnamese: "giới hạn, giam giữ", example: "Please confine your comments to the main issue." },
  "master-conventional-adjective": { definition: "following the usual or accepted way of doing something", vietnamese: "thông thường, theo truyền thống", example: "They chose a conventional method of construction." },
  "master-copper-noun": { definition: "a reddish-brown metal used in wires and pipes", vietnamese: "đồng", example: "The cable contains copper wire." },
  "master-corporate-adjective": { definition: "connected with a large company or business", vietnamese: "thuộc công ty, doanh nghiệp", example: "She works in corporate finance." },
  "master-counter-noun": { definition: "a long flat surface where customers are served", vietnamese: "quầy", example: "Please pay at the counter." },
  "master-dash-noun": { definition: "a short horizontal line used in writing", vietnamese: "dấu gạch ngang", example: "Use a dash between the two phrases." },
  "master-decay-verb": { definition: "to gradually rot or become damaged", vietnamese: "mục nát, phân hủy", example: "Fallen leaves decay on the forest floor." },
  "master-defy-verb": { example: "The group continued to defy the government's order." },
  "master-delegate-noun": { example: "Each delegate received a copy of the report." },
  "master-dense-adjective": { vietnamese: "dày đặc, đặc", example: "A dense forest covers the hillside." },
  "master-dissident-noun": { example: "The dissident publicly criticized the government." },
  "master-distortion-noun": { example: "The article presents a distortion of the facts." },
  "master-divorce-noun": { example: "Their divorce was completed last year." },
  "master-divorce-verb": { example: "They decided to divorce after ten years of marriage." },
  "master-economist-noun": { example: "The economist expects inflation to fall." },
  "master-elite-noun": { example: "The country's political elite opposed the reform." },
  "master-embrace-noun": { example: "She welcomed her daughter with a warm embrace." },
  "master-equation-noun": { example: "Students learned how to solve the equation." },
  "master-equity-noun": { example: "The policy aims to improve equity in education." },
  "master-exhaust-noun": { example: "Black exhaust came from the truck." },
  "master-export-noun": { example: "Coffee is the country's main export." },
  "master-export-verb": { vietnamese: "xuất khẩu", example: "The company exports machinery to Europe." },
  "master-file-verb": { vietnamese: "nộp, lưu hồ sơ", example: "You must file the form by Friday." },
  "master-fox-noun": { example: "A fox crossed the road at night." },
  "master-deduction-noun": { definition: "a conclusion reached by reasoning from known facts", vietnamese: "sự suy luận", example: "The detective reached the answer by logical deduction." },
  "master-delight-verb": { definition: "to give great pleasure or find great pleasure in something", vietnamese: "làm vui thích, thích thú", example: "The performance delighted the audience." },
  "master-disguise-noun": { definition: "clothes or an appearance used to hide someone's identity", vietnamese: "sự cải trang, đồ cải trang", example: "He wore dark glasses as a disguise." },
  "master-dock-noun": { definition: "an area beside water where ships load, unload, or are repaired", vietnamese: "bến tàu, cầu tàu", example: "The ship returned to the dock." },
  "master-drain-noun": { definition: "a pipe or opening that carries away water or waste", vietnamese: "cống, ống thoát nước", example: "Leaves blocked the drain." },
  "master-dumb-adjective": { definition: "temporarily unable to speak, especially because of shock", vietnamese: "câm lặng, không nói nên lời", example: "The news left everyone dumb with shock." },
  "master-dynamic-adjective": { definition: "changing, active, and full of energy", vietnamese: "năng động, luôn thay đổi", example: "The company operates in a dynamic market." },
  "master-edit-verb": { definition: "to change and improve written, recorded, or digital material", vietnamese: "biên tập, chỉnh sửa", example: "Please edit the report before sending it." },
  "master-energy-noun": { definition: "power from electricity, fuel, or other physical sources", vietnamese: "năng lượng", example: "The building uses solar energy." },
  "master-evolve-verb": { definition: "to develop gradually over time", vietnamese: "tiến hóa, phát triển", example: "The language continues to evolve." },
  "master-executive-noun": { definition: "a senior manager in a business or organization", vietnamese: "giám đốc điều hành, quản lý cấp cao", example: "The executive approved the new strategy." },
  "master-exile-noun": { definition: "a person forced to live away from their own country", vietnamese: "người lưu vong", example: "The writer lived as an exile for many years." },
  "master-expedition-noun": { definition: "an organized journey made for a particular purpose", vietnamese: "chuyến thám hiểm", example: "The expedition across the desert lasted two weeks." },
  "master-extension-noun": { definition: "an extra part added to make something longer or larger", vietnamese: "phần mở rộng, phần nối thêm", example: "They built an extension at the back of the house." },
  "master-fabulous-adjective": { definition: "extremely good or impressive", vietnamese: "tuyệt vời", example: "The view from our room was fabulous." },
  "master-fatal-adjective": { definition: "causing or resulting in death", vietnamese: "gây tử vong, chí mạng", example: "The driver suffered a fatal injury." },
  "master-fire-verb": { definition: "to dismiss someone from a job", vietnamese: "sa thải", example: "The company fired him for breaking the rules." },
  "master-fluid-adjective": { definition: "smooth, graceful, and able to change easily", vietnamese: "linh hoạt, uyển chuyển", example: "Her movements were fluid and controlled." },
  "master-force-verb": { definition: "to make someone do something against their wishes", vietnamese: "ép buộc, cưỡng ép", example: "Nobody can force you to sign the agreement." },
  "master-forthcoming-adjective": { definition: "planned or expected to happen soon", vietnamese: "sắp tới", example: "Details will appear in the forthcoming report." },
  "master-competence-noun": { definition: "the ability or skill needed to do something well", vietnamese: "năng lực, khả năng", example: "The interview tests each candidate's professional competence." },
  "master-elegant-adjective": { definition: "attractive and graceful in appearance or style", vietnamese: "thanh lịch, tao nhã", example: "She wore an elegant black dress." },
  "master-decline-verb": { definition: "to become smaller, weaker, or less", vietnamese: "giảm sút, suy giảm", example: "Sales declined during the winter." },
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
    tags: [row.cefrLevel.toLocaleLowerCase(), row.partOfSpeech, topic, `enriched-${batchNumber}`],
  });
}

const serialized = `import type { VocabularyItem } from "@/types/domain";\n\nexport const ${exportName}: VocabularyItem[] = ${JSON.stringify(records, null, 2)};\n`;
fs.writeFileSync(outputPath, serialized);
fs.writeFileSync(reportPath, JSON.stringify({ requested: targets.length, generated: records.length, unresolved, senseRisks, sourceCounts }, null, 2));
console.log(JSON.stringify({ requested: targets.length, generated: records.length, unresolved: unresolved.length, senseRisks: senseRisks.length, sourceCounts }));
