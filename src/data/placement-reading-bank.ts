import type { CEFRLevel, PlacementQuestion, ReadingPassage } from "@/types/domain";

const provenanceId = "placement-core-2026-08";
type QuestionSeed = [subtopic: string, prompt: string, options: string[], answer: string, explanation: string];
interface ReadingSet { passage: ReadingPassage; questions: QuestionSeed[] }

const sets: ReadingSet[] = [
  {
    passage: { id: "reading-a1-pool", title: "Green Street pool", level: "A1", status: "validated", provenanceId, text: "Green Street pool opens at nine from Tuesday to Sunday. It is closed on Monday. Children under twelve must come with an adult. Swimming lessons are on Thursday afternoon. The café does not take cash, so customers need a card." },
    questions: [
      ["detail", "On which day is the pool closed?", ["Monday", "Tuesday", "Thursday", "Sunday"], "Monday", "The notice directly says the pool is closed on Monday."],
      ["requirement", "Who must come with an adult?", ["Children under twelve", "All café customers", "Swimming teachers", "People who visit on Sunday"], "Children under twelve", "The age rule applies to children younger than twelve."],
      ["time", "When are swimming lessons held?", ["Thursday afternoon", "Monday morning", "Tuesday evening", "Sunday afternoon"], "Thursday afternoon", "The passage gives Thursday afternoon as the lesson time."],
      ["inference", "Why should a café customer bring a card?", ["The café does not accept cash", "The pool requires identification", "Lessons must be paid for online", "The café closes before the pool"], "The café does not accept cash", "A card is needed because cash cannot be used at the café."],
    ],
  },
  {
    passage: { id: "reading-a1-saturday", title: "A plan for Saturday", level: "A1", status: "validated", provenanceId, text: "On Saturday morning, Sam will buy fruit at the market. He will meet Leo outside the library at eleven. They plan to eat sandwiches in the park. If it rains, they will go to the café opposite the library. Sam's bus home leaves at 4:15." },
    questions: [
      ["detail", "What will Sam buy at the market?", ["Fruit", "Sandwiches", "Books", "Bus tickets"], "Fruit", "The first sentence says Sam will buy fruit."],
      ["location", "Where will Sam meet Leo?", ["Outside the library", "Inside the market", "At the bus station", "Opposite the park"], "Outside the library", "The meeting point is outside the library."],
      ["condition", "Where will they go if it rains?", ["To the café", "To the market", "To Sam's home", "To the park"], "To the café", "The café is their wet-weather alternative."],
      ["time", "When does Sam's bus leave?", ["At 4:15", "At 11:00", "At 4:50", "At 10:15"], "At 4:15", "The final sentence gives the departure time as 4:15."],
    ],
  },

  {
    passage: { id: "reading-a2-language-exchange", title: "Wednesday language exchange", level: "A2", status: "validated", provenanceId, text: "The language exchange meets every Wednesday at 6:30 in room 3 of the community centre. Learners work in pairs and change partners after fifteen minutes. This week, everyone should bring one topic they would like to discuss. The meeting is free, but new visitors must book online by noon on Tuesday." },
    questions: [
      ["detail", "Where does the exchange meet?", ["Room 3 of the community centre", "The town library", "A café beside the station", "Room 6 of the college"], "Room 3 of the community centre", "The first sentence gives room 3 in the community centre."],
      ["procedure", "What happens after fifteen minutes?", ["Learners change partners", "The meeting ends", "Visitors choose a room", "Everyone books online"], "Learners change partners", "Pairs switch partners after fifteen minutes."],
      ["preparation", "What should participants bring this week?", ["A discussion topic", "A printed ticket", "Food for their partner", "A language textbook"], "A discussion topic", "Each person is asked to bring one topic for discussion."],
      ["requirement", "What must a new visitor do?", ["Book by Tuesday noon", "Pay at the door", "Arrive fifteen minutes early", "Bring an existing member"], "Book by Tuesday noon", "New visitors need an online booking before the stated deadline."],
    ],
  },
  {
    passage: { id: "reading-a2-bike-hire", title: "Riverside bike hire", level: "A2", status: "validated", provenanceId, text: "Riverside Bikes is open daily from 8 a.m. to 6 p.m. Customers need photo identification to hire a bike, and a helmet is included in the price. Bikes must be returned to the same shop. A late fee is charged for every hour after closing time. The riverside path is currently closed near West Bridge, so staff can suggest another route." },
    questions: [
      ["detail", "What is included in the hire price?", ["A helmet", "A late return", "A guide", "A train ticket"], "A helmet", "The passage explicitly says a helmet is included."],
      ["requirement", "What must customers show to hire a bike?", ["Photo identification", "A driving licence only", "A hotel booking", "Their own helmet"], "Photo identification", "Photo identification is the stated hiring requirement."],
      ["return", "Where must customers return a bike?", ["To the same shop", "At West Bridge", "To any bike shop", "Beside the riverside path"], "To the same shop", "The return location must be the original shop."],
      ["purpose", "Why might a customer ask staff about the route?", ["Part of the riverside path is closed", "The shop closes at noon", "Bikes cannot cross bridges", "Helmets are unavailable"], "Part of the riverside path is closed", "Staff can suggest an alternative around the closure near West Bridge."],
    ],
  },
  {
    passage: { id: "reading-a2-lost-cat", title: "Looking for Nori", level: "A2", status: "validated", provenanceId, text: "Our cat Nori went missing on Tuesday evening. She is grey with one white front paw and wears a green collar. Nori is nervous around strangers, so please do not chase her. Take a photo and text it to 07700 341221. She often hides behind sheds near the river." },
    questions: [
      ["identification", "Which detail helps identify Nori?", ["One front paw is white", "Both ears are black", "She wears a red collar", "Her tail is very short"], "One front paw is white", "The notice describes one white front paw."],
      ["instruction", "What should someone avoid doing?", ["Chasing the cat", "Taking a photograph", "Sending a text", "Looking near sheds"], "Chasing the cat", "The owner says not to chase Nori because she is nervous."],
      ["action", "What should a person do after seeing Nori?", ["Photograph her and send a text", "Take her directly to the river", "Remove her green collar", "Wait until Tuesday evening"], "Photograph her and send a text", "The notice requests a photo by text."],
      ["location", "Where may Nori be hiding?", ["Behind sheds near the river", "Inside the community centre", "Under a bridge in town", "Beside a bicycle shop"], "Behind sheds near the river", "The final sentence identifies her usual hiding area."],
    ],
  },

  {
    passage: { id: "reading-b1-repair-volunteer", title: "Learning to repair", level: "B1", status: "validated", provenanceId, text: "When Ana first volunteered at a repair café, she expected experienced technicians to do all the difficult work. Instead, they taught her to ask an owner what had happened before opening an appliance. That simple habit helped her trace a radio fault to a loose wire. Ana now guides visitors through small repairs themselves. She says the café's real aim is not speed but giving people confidence to understand their possessions." },
    questions: [
      ["expectation", "What surprised Ana when she began volunteering?", ["The technicians taught her how to investigate faults", "Visitors were not allowed to watch repairs", "Every broken object required a new part", "The café valued speed above learning"], "The technicians taught her how to investigate faults", "Ana expected technicians to do the work but was taught their diagnostic approach."],
      ["detail", "What caused the radio fault?", ["A loose wire", "A damaged speaker", "A missing battery", "An incorrect instruction"], "A loose wire", "The passage directly identifies a loose wire."],
      ["purpose", "According to Ana, what is the café's main aim?", ["To build people's confidence in understanding repairs", "To complete as many repairs as possible", "To train only professional technicians", "To sell replacement appliances"], "To build people's confidence in understanding repairs", "Ana contrasts confidence and understanding with speed."],
      ["inference", "How has Ana's role changed?", ["She has moved from learner to guide", "She now avoids speaking to owners", "She repairs radios alone for payment", "She has stopped opening appliances"], "She has moved from learner to guide", "She was initially taught and now guides visitors herself."],
    ],
  },
  {
    passage: { id: "reading-b1-school-garden", title: "A dry year in the garden", level: "B1", status: "validated", provenanceId, text: "After a dry winter, students at Bell School knew their garden would have less water than usual. The rainwater tank helped, but it was not enough for every planned crop. They chose herbs that tolerate dry conditions and planted earlier to avoid the hottest weeks. The harvest was smaller than last year's, yet the garden used half as much water. Next season, the students will compare beds with and without mulch." },
    questions: [
      ["problem", "What problem did the students face?", ["There was not enough water for all planned crops", "The rainwater tank was broken", "No students wanted to plant early", "The herbs could not tolerate dry weather"], "There was not enough water for all planned crops", "The dry winter and limited tank supply created a water shortage."],
      ["response", "How did the students adapt their planting?", ["They chose dry-tolerant herbs and planted earlier", "They doubled the number of crops", "They emptied the rainwater tank", "They waited for the hottest weeks"], "They chose dry-tolerant herbs and planted earlier", "Both choices reduced exposure to water shortage and extreme heat."],
      ["contrast", "What was true of this year's harvest?", ["It was smaller but used much less water", "It was larger and used more water", "It matched last year's in every way", "It failed because no herbs grew"], "It was smaller but used much less water", "The passage contrasts lower yield with half the water use."],
      ["future", "What will the students investigate next?", ["Whether mulch changes the results", "Whether the tank can be removed", "Whether winter is hotter than summer", "Whether herbs need more rain than other crops"], "Whether mulch changes the results", "Comparing mulched and unmulched beds tests the effect of mulch."],
    ],
  },
  {
    passage: { id: "reading-b1-flexible-hours", title: "Flexible-hours pilot", level: "B1", status: "validated", provenanceId, text: "For eight weeks, office staff may start work at any time between seven and ten. Everyone must be available from ten until three, and each person must still complete their normal weekly hours. The customer desk will operate from eight until six through a team rota. Managers will review service records and an employee survey before deciding whether to continue the arrangement." },
    questions: [
      ["detail", "During which hours must every employee be available?", ["From ten until three", "From seven until ten", "From eight until six", "From three until seven"], "From ten until three", "Ten to three is the compulsory shared period."],
      ["clarification", "What does the pilot not change?", ["The number of weekly hours employees must work", "The possible starting times", "How customer-desk coverage is organized", "The use of an employee survey"], "The number of weekly hours employees must work", "Staff retain their normal weekly total."],
      ["operation", "How will the customer desk stay open for its full schedule?", ["Staff will cover it using a rota", "Every employee will work from eight to six", "Managers will close it during lunch", "Customers will serve themselves"], "Staff will cover it using a rota", "A team rota provides coverage across the longer desk hours."],
      ["purpose", "Why will managers examine records and a survey?", ["To decide whether the pilot should continue", "To calculate a new weekly salary", "To choose a different customer desk", "To require everyone to start at seven"], "To decide whether the pilot should continue", "The evidence will inform the continuation decision."],
    ],
  },

  {
    passage: { id: "reading-b2-library-things", title: "A library of things", level: "B2", status: "validated", provenanceId, text: "The Eastside Library now lends drills, tents, sewing machines, and other objects that residents may need only occasionally. An annual membership covers ordinary loans, while popular items must be reserved. Free workshops show borrowers how to use equipment safely. Organizers measure success by repeated use and avoided purchases, not simply by loan numbers. Maintenance and late returns remain costly challenges. They rejected a large cash deposit because it would have excluded residents the scheme was intended to serve." },
    questions: [
      ["main-idea", "What is the scheme designed to do?", ["Let residents borrow infrequently needed objects", "Replace the library's collection of books", "Sell professional equipment at a discount", "Provide storage for residents' possessions"], "Let residents borrow infrequently needed objects", "The library lends items people need only occasionally."],
      ["measure", "How do organizers judge success?", ["By use that avoids purchases and encourages reuse", "Only by the total number of loans", "By the value of cash deposits", "By how quickly every item is returned"], "By use that avoids purchases and encourages reuse", "The passage explicitly contrasts this measure with raw loan totals."],
      ["challenge", "What continuing difficulty is mentioned?", ["Maintaining items and dealing with late returns", "Finding any objects residents want", "Charging for every safety workshop", "Preventing members from reserving items"], "Maintaining items and dealing with late returns", "Both maintenance and lateness are described as costly."],
      ["inference", "Why was a large deposit rejected?", ["It would have reduced access for lower-income residents", "It would have increased the number of loans", "The library could not accept cash legally", "Borrowers preferred to purchase the objects"], "It would have reduced access for lower-income residents", "Excluding intended users implies an affordability barrier."],
    ],
  },
  {
    passage: { id: "reading-b2-urban-shade", title: "Planning shade, not just trees", level: "B2", status: "validated", provenanceId, text: "Residents helped map summer heat by carrying small sensors along their usual walking routes. The council used the results to prioritize streets where heat and pedestrian exposure overlapped. Trees form part of the plan, but young trees will take years to provide substantial shade. Temporary awnings and drinking-water points are therefore planned as immediate measures. Community groups have warned that planting totals make attractive headlines, whereas long-term maintenance determines whether the trees survive." },
    questions: [
      ["method", "How did residents contribute to the project?", ["They collected heat data on normal walking routes", "They planted every tree in the city", "They designed the temperature sensors", "They closed streets during summer"], "They collected heat data on normal walking routes", "Residents carried sensors along routes they normally used."],
      ["priority", "Which streets received priority?", ["Those with both high heat and pedestrian exposure", "Those with the newest trees", "Those used only by vehicles", "Those closest to council offices"], "Those with both high heat and pedestrian exposure", "The council combined heat and pedestrian exposure in its decision."],
      ["reason", "Why are awnings and water points included?", ["New trees will not provide enough shade immediately", "Residents refused to plant trees", "Sensors cannot operate near trees", "Awnings require no maintenance"], "New trees will not provide enough shade immediately", "The temporary measures address the delay before trees mature."],
      ["stance", "What concern do community groups express?", ["Planting numbers may distract from long-term care", "The council collected too much maintenance data", "Trees make headlines impossible to write", "Pedestrians prefer streets without shade"], "Planting numbers may distract from long-term care", "They contrast visible planting totals with the maintenance needed for survival."],
    ],
  },
  {
    passage: { id: "reading-b2-four-day", title: "A four-day trial", level: "B2", status: "validated", provenanceId, text: "A software company tested a four-day, 32-hour week without reducing salaries. Output remained broadly stable, partly because teams shortened meetings and protected blocks of uninterrupted work. Customer support still operated five days through staggered schedules. Reported stress fell overall, although the improvement was uneven: employees with caring responsibilities described the clearest benefit. The company cautioned that volunteers for the trial may already have been more enthusiastic about flexible working." },
    questions: [
      ["detail", "What happened to employees' salaries?", ["They stayed the same", "They fell by one fifth", "They depended on output", "They were replaced by bonuses"], "They stayed the same", "The trial reduced hours without reducing salary."],
      ["explanation", "What helped teams maintain output?", ["Shorter meetings and protected focused work", "Longer customer-support hours for everyone", "Hiring a second workforce", "Removing all flexible schedules"], "Shorter meetings and protected focused work", "The passage connects these changes with stable output."],
      ["comparison", "Who reported the clearest benefit?", ["Employees with caring responsibilities", "Only customer-support managers", "Employees who worked five full days", "People who opposed flexible work"], "Employees with caring responsibilities", "This group described the strongest improvement."],
      ["limitation", "Why should the trial results be interpreted cautiously?", ["Volunteers may have been unusually positive about flexibility", "The company did not measure working hours", "Customer support closed for a full day", "Output fell sharply during the trial"], "Volunteers may have been unusually positive about flexibility", "Self-selection could make the group unrepresentative."],
    ],
  },

  {
    passage: { id: "reading-c1-algorithm-explanations", title: "Explaining a recommendation", level: "C1", status: "validated", provenanceId, text: "An explanation generated by a recommendation system often identifies the features most associated with one output: a film was suggested because the viewer watched similar films, for instance. Such an account can be useful without revealing what would have happened under different conditions. It is therefore a local description, not necessarily a causal explanation. Designers face a further trade-off: a simple account may be comprehensible but omit qualifications, while a faithful technical account may overwhelm its audience. A responsible interface should document that uncertainty and provide a route for users to contest consequential decisions." },
    questions: [
      ["distinction", "What limitation of a typical system explanation does the writer identify?", ["It may describe an association without establishing cause", "It always reveals every alternative outcome", "It cannot mention a viewer's earlier choices", "It is necessarily too technical to understand"], "It may describe an association without establishing cause", "The writer distinguishes a local association from causal explanation."],
      ["trade-off", "What trade-off do designers face?", ["Comprehensibility versus technical fidelity", "Speed versus the number of users", "Causation versus data collection", "Film quality versus viewer preference"], "Comprehensibility versus technical fidelity", "Simple explanations can omit nuance, while faithful ones can overwhelm."],
      ["reference", "What does “that uncertainty” refer to?", ["The limitations and trade-offs in what the explanation can show", "Whether users have watched any films", "The cost of building a recommendation system", "The exact number of interface designers"], "The limitations and trade-offs in what the explanation can show", "The phrase gathers the preceding cautions about association and simplification."],
      ["recommendation", "What does the writer recommend for consequential decisions?", ["Disclose uncertainty and allow users to challenge outcomes", "Replace explanations with raw source code", "Prevent users from seeing recommendations", "Offer only the simplest possible account"], "Disclose uncertainty and allow users to challenge outcomes", "The final sentence calls for documentation and a contest route."],
    ],
  },
  {
    passage: { id: "reading-c1-citizen-science", title: "Counting birds together", level: "C1", status: "validated", provenanceId, text: "Volunteer bird surveys can cover an area no professional team could monitor at comparable cost. Their scale, however, does not automatically produce a representative sample. Participants tend to visit accessible routes and may differ in their ability to identify species. Clear protocols, training, and repeated observations improve consistency. Statistical models can adjust for some uneven effort, but they cannot reconstruct observations that were never made. The data are most persuasive when researchers state these limits and focus on broad trends supported across years rather than isolated counts." },
    questions: [
      ["main-idea", "What is the writer's overall assessment of volunteer surveys?", ["They are valuable at scale when their sampling limits are managed openly", "They are always representative because many people participate", "They should replace all professional observation", "They cannot contribute to research under any conditions"], "They are valuable at scale when their sampling limits are managed openly", "The passage balances broad coverage with explicit methodological limits."],
      ["sampling", "Why might the sample be uneven?", ["Volunteers favour accessible routes and have different identification skills", "Every participant follows an identical route", "Professionals remove uncommon species from the count", "The surveys cover only one year"], "Volunteers favour accessible routes and have different identification skills", "Both sources of unevenness are stated directly."],
      ["limitation", "What can statistical models not do?", ["Create observations from places that nobody surveyed", "Adjust for any difference in effort", "Compare results across multiple years", "Use repeated observations"], "Create observations from places that nobody surveyed", "The writer says models cannot reconstruct missing observations."],
      ["recommendation", "Which use of the data does the writer consider most persuasive?", ["Transparent analysis of broad trends across years", "A strong claim based on one unusual count", "Ignoring differences in volunteer skill", "Reporting scale without discussing sampling"], "Transparent analysis of broad trends across years", "The final sentence favours stated limits and repeated broad patterns."],
    ],
  },
  {
    passage: { id: "reading-c1-remote-ties", title: "The colleagues we rarely schedule", level: "C1", status: "validated", provenanceId, text: "Remote teams often preserve strong working relationships through scheduled meetings. What disappears more easily are weak ties: brief contact with colleagues outside one's immediate project. Attempts to recreate chance encounters through compulsory online coffee sessions can fail because their formality changes the interaction. Some organizations coordinate office days so teams overlap, but this may simply produce separate clusters in the same building. More promising approaches create low-stakes reasons for cross-team contact while allowing participation to remain flexible." },
    questions: [
      ["contrast", "Which relationships are described as harder to preserve remotely?", ["Brief connections beyond the immediate team", "Strong relationships maintained through meetings", "Formal relationships with direct managers", "Connections among people on one project"], "Brief connections beyond the immediate team", "The passage defines weak ties as contact beyond one's project."],
      ["cause", "Why may compulsory online coffee sessions fail?", ["Their formal structure alters the spontaneous interaction", "They include too many strong working relationships", "Employees cannot use video at home", "They prevent teams from scheduling meetings"], "Their formal structure alters the spontaneous interaction", "Compulsion and formality change the nature of a chance encounter."],
      ["inference", "What risk is associated with coordinated office days?", ["Teams may remain isolated in separate groups", "No employees will attend the office", "Strong ties will disappear immediately", "Every conversation will become compulsory"], "Teams may remain isolated in separate groups", "Separate clusters can coexist without creating cross-team contact."],
      ["stance", "Which approach does the writer favour?", ["Optional, low-pressure opportunities for cross-team contact", "Mandatory social calls with fixed scripts", "Keeping every team on a different office day", "Replacing scheduled work meetings with chance encounters"], "Optional, low-pressure opportunities for cross-team contact", "The final sentence explicitly presents this as more promising."],
    ],
  },

  {
    passage: { id: "reading-c2-restitution", title: "Beyond possession", level: "C2", status: "validated", provenanceId, text: "Debates over the restitution of museum objects are sometimes framed as a contest between universal access and exclusive national ownership. That opposition is too neat. A museum's claim to serve a global public does not dissolve questions about how an object was acquired, while legal title may not exhaust the ethical obligations created by coercive histories. Long-term loans can widen access and rebuild institutional relationships, but they may also postpone the underlying question of ownership. A credible process therefore requires case-specific provenance research, transparent criteria, and participation by communities whose claims have too often been treated as merely advisory." },
    questions: [
      ["main-claim", "Why does the writer reject the usual two-sided framing?", ["Access, acquisition, law, and ethical obligation cannot be reduced to one opposition", "National ownership always prevents public access", "Legal title resolves every ethical question", "Long-term loans are identical to restitution"], "Access, acquisition, law, and ethical obligation cannot be reduced to one opposition", "The passage complicates the supposed choice with several independent considerations."],
      ["qualification", "What limitation of legal title is identified?", ["It may not settle obligations arising from coercive acquisition", "It prevents museums from researching provenance", "It applies only to objects on short loans", "It guarantees participation by source communities"], "It may not settle obligations arising from coercive acquisition", "The writer distinguishes legal ownership from broader ethical duties."],
      ["stance", "How does the writer view long-term loans?", ["Potentially constructive but capable of deferring the central issue", "Always deceptive and without public value", "A complete substitute for provenance research", "Useful only when ownership is uncontested"], "Potentially constructive but capable of deferring the central issue", "The sentence acknowledges relationship benefits and an ownership limitation."],
      ["recommendation", "What would make a restitution process credible?", ["Specific research, clear criteria, and meaningful claimant participation", "A universal rule based only on museum size", "Private negotiation without published standards", "Treating community views as optional advice"], "Specific research, clear criteria, and meaningful claimant participation", "The final sentence lists these three requirements."],
    ],
  },
  {
    passage: { id: "reading-c2-metrics", title: "When a measure becomes a target", level: "C2", status: "validated", provenanceId, text: "Performance measures do not merely describe institutions; once tied to rewards, they reshape conduct. This is often called gaming, a label that can imply individual bad faith where the deeper problem is predictable adaptation to an imperfect proxy. Abandoning measurement altogether would leave consequential judgments less visible, not necessarily fairer. A better response combines several measures with qualitative review, monitors who benefits from the chosen definitions, and permits appeal. Crucially, the system must be revisable: a metric that once tracked the desired outcome may cease to do so after people organize their work around it." },
    questions: [
      ["main-idea", "What central problem does the passage examine?", ["Measures can change behaviour and lose their value as proxies", "Institutions cannot collect any reliable information", "Qualitative review always eliminates unfairness", "Rewards have no effect on conduct"], "Measures can change behaviour and lose their value as proxies", "The opening and closing sentences describe this feedback problem."],
      ["wording", "Why does the writer question the label “gaming”?", ["It may blame individuals for a predictable response to system design", "It refers only to recreational activity", "It proves that every participant acted dishonestly", "It prevents metrics from being linked to rewards"], "It may blame individuals for a predictable response to system design", "The passage contrasts bad-faith framing with adaptation to a proxy."],
      ["contrast", "Why does the writer not recommend abandoning measurement?", ["Doing so could make important judgments less transparent", "All existing measures remain accurate forever", "Qualitative evidence has no value", "Appeals are possible only with one metric"], "Doing so could make important judgments less transparent", "The writer argues that absence of measurement does not guarantee fairness."],
      ["recommendation", "Which feature is presented as crucial?", ["The ability to revise measures as behaviour and fit change", "Using one permanent measure for consistency", "Removing all opportunities to appeal", "Rewarding the highest score automatically"], "The ability to revise measures as behaviour and fit change", "The final sentence emphasizes revision when a metric ceases to track its goal."],
    ],
  },
];

const levels: CEFRLevel[] = ["A1", "A2", "B1", "B2", "C1", "C2"];
export const additionalReadingPassages = sets.map(({ passage }) => passage);
export const additionalReadingQuestions: PlacementQuestion[] = sets.flatMap(({ passage, questions }) => questions.map(([subtopic, prompt, options, answer, explanation], index) => ({
  id: `placement-reading-${passage.id.replace("reading-", "")}-${index + 1}`,
  itemId: passage.id,
  knowledgeType: "vocabulary",
  type: "context",
  prompt,
  options,
  answer,
  explanation,
  level: passage.level,
  dimension: "reading",
  topic: "reading-comprehension",
  subtopic,
  difficulty: Math.min(0.97, (levels.indexOf(passage.level) + 0.4 + index * 0.08) / levels.length),
  discrimination: 1.1,
  status: "validated",
  provenanceId,
  passageId: passage.id,
})));
