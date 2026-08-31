import type { CEFRLevel, PlacementQuestion } from "@/types/domain";

type ContextSeed = [prompt: string, answer: string, rationale: string];
type ContextGroup = [level: CEFRLevel, topic: string, subtopic: string, entries: ContextSeed[]];

const groups: ContextGroup[] = [
  ["A1", "everyday-interaction", "short-responses", [
    ["A cashier asks, “Would you like a bag?” What is the natural reply if you want one?", "Yes, please.", "Yes, please accepts the offered bag politely."],
    ["You arrive late for class. What should you say first?", "I'm sorry I'm late.", "A brief apology directly acknowledges arriving late."],
    ["A visitor asks, “Where is the post office?” It is beside the bank. What do you say?", "It's next to the bank.", "Next to the bank gives the requested location."],
    ["Someone asks, “What time does dinner start?” Dinner starts at 7:30. What do you say?", "At half past seven.", "Half past seven states 7:30 naturally."],
    ["A classmate says, “Thanks for your help.” What is the natural response?", "You're welcome.", "You're welcome conventionally responds to thanks."],
  ]],
  ["A1", "public-information", "simple-notices", [
    ["A sign says, “NO PARKING.” What does it mean?", "Drivers must not leave cars here.", "No parking prohibits leaving a vehicle in that place."],
    ["A shop window says, “CLOSED MONDAY.” What does it mean?", "The shop does not open on Monday.", "The notice gives Monday as the closing day."],
    ["A library notice says, “PLEASE RETURN BOOKS HERE.” What should visitors do?", "Put borrowed books in this place.", "Return books here directs borrowers to the return point."],
    ["A door says, “STAFF ONLY.” Who may enter?", "People who work there.", "Staff means the people employed at the place."],
    ["A café board says, “BREAKFAST UNTIL 10:30.” What can customers understand?", "Breakfast is available before 10:30.", "Until 10:30 sets the final time for breakfast service."],
  ]],

  ["A2", "invitations", "plans-and-responses", [
    ["A friend writes, “Would you like to see a film on Saturday?” You want to go. Which reply fits?", "That sounds great. What time?", "The reply accepts and asks for the missing practical detail."],
    ["You cannot attend a party. Which message is polite and clear?", "Thanks for inviting me, but I can't come.", "The message thanks the host and declines without sounding abrupt."],
    ["Your train is delayed, so you will reach your friend late. What should you text?", "My train is late. I'll arrive around eight.", "The message explains the delay and gives an updated arrival time."],
    ["A classmate asks to borrow your notes. You agree. What do you say?", "Of course. I'll bring them tomorrow.", "The response grants the request and states when the notes will arrive."],
    ["You want to change a meeting from Tuesday to Wednesday. Which request is natural?", "Could we meet on Wednesday instead?", "Could we makes a polite proposal and instead marks the change."],
  ]],
  ["A2", "services", "transactional-language", [
    ["At a restaurant, you are ready to order. What do you say?", "I'd like the vegetable soup, please.", "I'd like is a conventional polite way to order food."],
    ["A hotel receptionist asks how they can help. You have a reservation. What do you say?", "I have a booking under the name Tran.", "The reply identifies the reservation and the name used for it."],
    ["You bought a lamp, but it does not work. What is the clearest request at the shop?", "Could I exchange this? It's faulty.", "The request names the desired solution and explains the defect."],
    ["You need a return ticket to Oxford. What do you ask at the station?", "A return to Oxford, please.", "A return is the standard request for travel out and back."],
    ["You did not hear a receptionist's last sentence. What should you say?", "Sorry, could you repeat that?", "The apology plus could you repeat that politely requests repetition."],
  ]],
  ["A2", "messages", "purpose-and-detail", [
    ["Message: “I'm at the dentist. Please start lunch without me.” Why was it sent?", "To explain a delay and tell others not to wait.", "Both the dentist visit and the instruction about lunch show the purpose."],
    ["Message: “The blue folder is on my desk. Could you bring it to room 4?” What is requested?", "Take a particular folder to another room.", "The message identifies both the object and its destination."],
    ["Message: “Practice is indoors today because the field is wet.” What changed?", "The place where practice will happen.", "Indoors replaces the usual outdoor field location."],
    ["Message: “Your parcel will arrive between two and four. Someone must sign for it.” What is important?", "A person needs to be present for delivery.", "Requiring a signature means someone must receive the parcel."],
    ["Message: “I've left your key with Ms Dao next door.” Where is the key?", "At a neighbour's home.", "Next door identifies Ms Dao as the neighbour holding the key."],
  ]],
  ["A2", "conversation", "appropriate-follow-up", [
    ["A: “I passed my driving test!” Which response is most appropriate?", "Congratulations! That's excellent news.", "Congratulations responds naturally to another person's success."],
    ["A: “I have a terrible headache.” Which response is considerate?", "You should rest. Can I get you some water?", "The response offers sensible advice and practical help."],
    ["A: “I can't find the station.” Which response is helpful?", "I'll show you on the map.", "The offer directly helps with finding the location."],
    ["A: “I'm worried about tomorrow's exam.” Which response is supportive?", "You've prepared well. Try to get some sleep.", "The response acknowledges the worry and offers reassurance."],
    ["A: “Would you mind closing the window?” You agree. What do you say?", "Not at all.", "Not at all conventionally agrees to a Would you mind request."],
  ]],

  ["B1", "workplace", "polite-email", [
    ["You need a colleague's comments by Thursday. Which email sentence is appropriately polite?", "Could you send me your comments by Thursday?", "The request is direct, courteous, and includes a clear deadline."],
    ["You attached the wrong file. Which correction is clearest?", "Please ignore my previous attachment; the correct file is attached here.", "The message identifies the error and supplies the replacement."],
    ["You need to postpone a meeting because you are ill. Which message is suitable?", "I'm unwell today. Could we reschedule our meeting?", "The message gives a concise reason and makes a polite request."],
    ["A task instruction is unclear. Which question is most constructive?", "Could you clarify which figures should be included?", "The question identifies the exact information that needs clarification."],
    ["A colleague completed urgent work for you. Which response is appropriate?", "Thank you for handling that so quickly.", "The response specifically recognizes the colleague's prompt help."],
  ]],
  ["B1", "cohesion", "logical-connectors", [
    ["The forecast predicted rain. ___, the event was moved indoors as a precaution.", "Therefore", "Therefore introduces the decision as a result of the forecast."],
    ["The apartment is small. ___, it has plenty of natural light.", "However", "However marks the contrast between limited size and abundant light."],
    ["Several routes were considered. ___, the committee chose the least expensive one.", "In the end", "In the end introduces the final outcome after deliberation."],
    ["The course covers report writing. ___, it includes weekly presentation practice.", "In addition", "In addition adds a second course feature."],
    ["You can submit the form online. ___, you can hand it in at reception.", "Alternatively", "Alternatively presents a different available method."],
  ]],
  ["B1", "conversation", "repair-and-clarification", [
    ["A speaker uses a word you do not know. Which response keeps the conversation moving?", "What does that word mean in this context?", "The question requests the specific meaning needed for understanding."],
    ["You think you misunderstood a date. Which response checks it?", "Did you say the fifteenth or the fiftieth?", "The question isolates the two sounds that may have been confused."],
    ["Someone gives several fast instructions. What is a useful response?", "Could you go through the steps once more, please?", "The request asks for the sequence to be repeated clearly."],
    ["A colleague says, “The launch has been put back.” How can you confirm the meaning?", "Do you mean it has been postponed?", "The paraphrase checks the meaning of put back."],
    ["You cannot hear because of background noise. What should you say?", "Sorry, the line is noisy. Could you speak up?", "The response explains the problem and requests a practical adjustment."],
  ]],
  ["B1", "narrative", "sequence-and-reference", [
    ["Nora checked the address twice. ___, she still went to the wrong building.", "Even so", "Even so marks an unexpected outcome despite careful checking."],
    ["First, back up the files. ___, install the update.", "Then", "Then introduces the next step in a sequence."],
    ["The café had no tables free. ___, we ordered our drinks to take away.", "As a result", "As a result links the lack of tables to the decision."],
    ["The guide described three routes. The shortest ___ crossed a steep ridge.", "one", "One substitutes for the repeated countable noun route."],
    ["I expected the repair to take hours. ___, it was finished in twenty minutes.", "To my surprise", "To my surprise signals that the outcome differed from expectation."],
  ]],

  ["B2", "formal-communication", "requests-and-updates", [
    ["A project deadline is at risk. Which update is precise and professional?", "The supplier delay may affect Friday's deadline; I will confirm the revised schedule tomorrow.", "The update states the risk, cause, and next communication without overclaiming."],
    ["You disagree with part of a proposal. Which opening is constructive?", "I support the overall aim, but I have concerns about the proposed timeline.", "The wording recognizes common ground before identifying a specific concern."],
    ["You need a decision documented. Which request is most suitable?", "Could you confirm the agreed changes in writing?", "The request clearly asks for written confirmation of a defined decision."],
    ["A report contains an uncertain figure. Which note is responsible?", "This figure is provisional and will be updated after verification.", "The note labels the uncertainty and explains when it will be resolved."],
    ["A meeting produced no final decision. Which summary is accurate?", "The options were discussed, but no agreement was reached.", "The summary separates discussion from an outcome that did not occur."],
  ]],
  ["B2", "discourse", "argument-relations", [
    ["The method is inexpensive. ___, it is unsuitable for very small samples.", "Nevertheless", "Nevertheless introduces a limitation that contrasts with the advantage."],
    ["The two studies used different measures. ___, their results cannot be compared directly.", "Consequently", "Consequently presents non-comparability as the result of the methodological difference."],
    ["The first explanation concerns cost. ___, the second focuses on timing.", "By contrast", "By contrast explicitly compares different emphases."],
    ["The evidence is limited. ___, the conclusion should be treated as tentative.", "For that reason", "For that reason connects weak evidence to the cautious conclusion."],
    ["The policy could reduce delays. ___, it may increase administrative work.", "At the same time", "At the same time adds a simultaneous countervailing consequence."],
  ]],
  ["B2", "register", "audience-appropriate-language", [
    ["Which sentence is most suitable in a formal complaint?", "I would appreciate a written explanation of how this error occurred.", "The sentence is courteous, specific, and appropriately formal."],
    ["Which sentence is most suitable in a research summary?", "The findings indicate a gradual decline in reported usage.", "Indicate and reported usage present the observation precisely."],
    ["Which sentence is most suitable when giving a friend informal advice?", "I'd talk to her before making a final decision.", "The contraction and direct suggestion fit friendly conversation."],
    ["Which sentence is most suitable in public safety instructions?", "Keep the exit clear at all times.", "The concise imperative communicates an unambiguous safety requirement."],
    ["Which sentence is most suitable in meeting minutes?", "The committee agreed to review the proposal in September.", "The sentence neutrally records the actor, decision, and date."],
  ]],
  ["B2", "pragmatics", "implied-meaning", [
    ["A reviewer writes, “The introduction is rather long.” What is most likely implied?", "The introduction would benefit from being shorter.", "The restrained observation functions as an indirect criticism."],
    ["A manager says, “We may need to revisit the schedule.” What is implied?", "The current schedule may no longer be workable.", "Revisit signals that the existing plan requires reconsideration."],
    ["A colleague says, “I wouldn't rely on that estimate yet.” What is implied?", "The estimate is not sufficiently dependable at present.", "Wouldn't rely on expresses caution about present reliability."],
    ["A chair says, “Perhaps we could return to the main question.” What are they doing?", "Politely redirecting the discussion.", "The tentative wording softens an attempt to restore focus."],
    ["An editor writes, “This claim needs further support.” What is requested?", "Additional evidence or reasoning for the claim.", "Support in this context means justification, not stylistic encouragement."],
  ]],

  ["C1", "academic-discourse", "stance-and-scope", [
    ["A study used one sample. Which claim explicitly limits its scope to that sample and avoids certainty?", "Within this sample, the pattern appears broadly consistent across age groups.", "The sentence limits scope and uses appears rather than claiming certainty."],
    ["Which sentence clearly distinguishes evidence from interpretation?", "The survey shows a decline in attendance; one possible explanation is rising cost.", "The semicolon separates the observation from a qualified interpretation."],
    ["Which sentence acknowledges a limitation without dismissing the study?", "Although the sample is small, the consistent pattern warrants further investigation.", "The concessive structure balances limitation with justified value."],
    ["Which sentence avoids an unsupported causal claim?", "Participation rose after the policy changed, but the data do not establish why.", "The sentence reports sequence while explicitly withholding causal inference."],
    ["Which sentence attributes a contested position clearly?", "According to the authors, the discrepancy reflects differences in sampling.", "According to attributes the interpretation rather than presenting it as settled fact."],
  ]],
  ["C1", "professional-diplomacy", "measured-responses", [
    ["A senior colleague proposes an impractical deadline. Which response is diplomatic but clear?", "I understand the urgency; however, meeting that date would require reducing the scope.", "The response recognizes the priority and states the concrete trade-off."],
    ["You need to correct a misunderstanding in a meeting. Which response is measured?", "I may not have explained that clearly; the figures refer to the previous quarter.", "The speaker repairs the misunderstanding without blaming the listener."],
    ["A draft has serious gaps. Which feedback is constructive?", "The argument is promising, but two key claims need supporting evidence.", "The feedback identifies strengths and actionable weaknesses."],
    ["You cannot approve a request as submitted. Which response preserves cooperation?", "I can't approve the current version, but I'm happy to review a revised proposal.", "The response states the limit while offering a path forward."],
    ["Two teams disagree about responsibility. Which intervention is neutral?", "Let's clarify which decisions belong to each team before assigning responsibility.", "The wording proposes a fact-finding step without prejudging blame."],
  ]],

  ["C2", "nuanced-stance", "implication-and-distance", [
    ["A critic writes, “The conclusion is not entirely compelled by the evidence.” What is the stance?", "The evidence permits the conclusion but does not make it necessary.", "Not entirely compelled questions inferential strength without rejecting every possibility."],
    ["A report says, “The apparent consensus may owe more to framing than agreement.” What is suggested?", "How the issue was presented may have produced the appearance of agreement.", "The sentence distinguishes apparent consensus from genuine shared views."],
    ["An author writes, “This is less an explanation than a restatement.” What is the criticism?", "The account repeats the issue instead of explaining its cause.", "Less X than Y reclassifies the account as restatement rather than explanation."],
    ["A reviewer says, “The omission is conspicuous.” What do they imply?", "The missing material is noticeable and potentially significant.", "Conspicuous marks the absence as difficult to overlook."],
    ["A chair remarks, “That distinction may be doing rather more work than the argument acknowledges.” What is implied?", "The argument relies heavily on an underexamined distinction.", "The understated phrasing points to hidden argumentative dependence."],
  ]],
  ["C2", "cohesion", "reference-and-reformulation", [
    ["Two models are discussed. The first predicts demand; the second predicts cost. Which continuation is unambiguous?", "The latter prediction proved more accurate.", "Latter has exactly two clear antecedents and selects the second prediction."],
    ["A policy removed the income cap. Which next sentence creates explicit cohesion?", "This eligibility change increased applications.", "This plus the encapsulating noun change labels the preceding event."],
    ["A paragraph shifts from a common view to the writer's correction. Which opening best marks that move?", "More precisely, the issue concerns access rather than demand.", "More precisely signals a refinement of the preceding formulation."],
    ["Several limitations have just been listed. Which sentence refers back clearly?", "Taken together, these constraints reduce confidence in the estimate.", "These constraints gathers the listed limitations into one explicit reference."],
    ["A writer wants to reject an inference, not the underlying data. Which sentence is clearest?", "The figures are not disputed; what remains questionable is the conclusion drawn from them.", "The contrast preserves the data while focusing criticism on the inference."],
  ]],
];

const levels: CEFRLevel[] = ["A1", "A2", "B1", "B2", "C1", "C2"];

export const contextPlacementQuestions: PlacementQuestion[] = groups.flatMap(([level, topic, subtopic, entries], groupIndex) => entries.map(([prompt, answer, rationale], entryIndex) => ({
  id: `placement-context-${level.toLocaleLowerCase()}-${String(groupIndex + 1).padStart(2, "0")}-${entryIndex + 1}`,
  itemId: `placement-context-${topic}`,
  knowledgeType: "vocabulary",
  type: "context",
  prompt,
  options: [answer, ...[1, 2, 3].map((offset) => entries[(entryIndex + offset) % entries.length][1])],
  answer,
  explanation: rationale,
  level,
  dimension: "context",
  topic,
  subtopic,
  difficulty: Math.min(0.97, (levels.indexOf(level) + 0.4 + entryIndex * 0.07) / levels.length),
  discrimination: 1.05,
  status: "validated",
  provenanceId: "placement-core-2026-08",
})));
