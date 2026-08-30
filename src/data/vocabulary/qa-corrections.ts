import type { VocabularyItem } from "@/types/domain";

interface VocabularyQaCorrection {
  definition?: string;
  vietnamese?: string;
  example?: string;
  topic?: string;
}

/** Confirmed learner-facing corrections found during the 6,000-entry production QA pass. */
export const vocabularyQaCorrections: Record<string, VocabularyQaCorrection> = {
  "v24": { topic: "description" },
  "v82": { topic: "communication" },
  "v14": { definition: "completely necessary or extremely important" },
  "v16": { definition: "happening often or at short intervals" },
  "v36": { topic: "safety" },
  "v37": { topic: "decision-making" },
  "v44": { topic: "description" },
  "v52": { topic: "memory" },
  "v59": { topic: "description" },
  "v72": { definition: "to happen or take place" },
  "v78": { example: "Clear examples enhance learner understanding." },
  "a1-city": { topic: "places" },
  "master-about-adverb": {
    definition: "approximately; a little more or less than a number or amount",
    vietnamese: "khoảng, xấp xỉ",
    example: "The journey takes about an hour.",
  },
  "master-abandoned-adjective": {
    example: "The hikers found an abandoned farmhouse.",
    topic: "places",
  },
  "master-abnormally-adverb": { topic: "description" },
  "master-aboriginal-adjective": {
    vietnamese: "thuộc Thổ dân Úc",
    topic: "culture",
  },
  "master-abruptly-adverb": {
    example: "The meeting ended abruptly when the alarm sounded.",
    topic: "time",
  },
  "master-absentee-noun": {
    definition: "a person who is expected to be present but is absent",
    vietnamese: "người vắng mặt, người nghỉ",
    topic: "education",
  },
  "master-abuse-noun": {
    definition: "cruel, violent, or harmful treatment of a person or animal",
    vietnamese: "sự ngược đãi, sự lạm dụng",
    example: "The organization provides support for victims of abuse.",
    topic: "safety",
  },
  "master-access-verb": {
    vietnamese: "truy cập, tiếp cận",
    topic: "technology",
  },
  "master-accessibility-noun": {
    definition: "the quality of being easy to reach, enter, use, or understand",
    vietnamese: "khả năng tiếp cận, tính dễ sử dụng",
    topic: "places",
  },
  "master-accommodation-noun": { topic: "travel" },
  "master-accordingly-adverb": {
    definition: "in a way that is suitable for the situation or follows from it",
    vietnamese: "theo đó, do vậy",
    example: "The road was closed, so we changed our route accordingly.",
    topic: "language",
  },
  "master-accumulate-verb": {
    definition: "to gradually collect or increase in amount over time",
    vietnamese: "tích lũy, tích tụ",
    topic: "quantity",
  },
  "master-accusation-noun": {
    definition: "a claim that someone has done something wrong or illegal",
    vietnamese: "lời buộc tội, sự cáo buộc",
    example: "She denied the accusation and requested an investigation.",
    topic: "society",
  },
  "master-ache-verb": { topic: "health" },
  "master-achievable-adjective": { topic: "success" },
  "master-acid-noun": {
    definition: "a chemical substance that can react with other materials and may burn them",
    topic: "science",
  },
  "master-acquisition-noun": {
    vietnamese: "sự thu nhận, sự mua lại",
    example: "The company announced the acquisition of a smaller competitor.",
    topic: "business",
  },
  "master-actively-adverb": { topic: "actions" },
  "master-acute-adjective": {
    vietnamese: "nhọn, nhỏ hơn 90 độ",
    topic: "science",
  },
  "master-adaptable-adjective": {
    definition: "able to change in order to suit new conditions",
    vietnamese: "có khả năng thích nghi, linh hoạt",
    topic: "skills",
  },
  "master-addict-noun": {
    definition: "a person who is unable to stop using a harmful substance or activity",
    vietnamese: "người nghiện",
    example: "The recovering addict joined a support program.",
    topic: "health",
  },
  "master-addicted-adjective": {
    vietnamese: "nghiện, lệ thuộc",
    topic: "health",
  },
  "master-addiction-noun": {
    definition: "a strong dependence on a substance or activity that is difficult to stop",
    vietnamese: "chứng nghiện, sự lệ thuộc",
    topic: "health",
  },
  "master-additionally-adverb": {
    definition: "as an extra fact or in addition to something already mentioned",
    topic: "language",
  },
  "master-adequately-adverb": { topic: "description" },
  "master-adjustment-noun": {
    definition: "a small change made to improve something or make it more suitable",
    vietnamese: "sự điều chỉnh, sự sửa đổi",
    example: "A small adjustment improved the chair's height.",
    topic: "change",
  },
  "master-administrative-adjective": { topic: "work" },
  "master-admirable-adjective": { topic: "emotions" },
  "master-admiringly-adverb": {
    vietnamese: "một cách ngưỡng mộ, thán phục",
    example: "That was excellent, she said admiringly.",
    topic: "emotions",
  },
  "master-admittedly-adverb": {
    definition: "used when accepting that something is true, often before adding a contrast",
    example: "Admittedly, the plan still needs more work.",
    topic: "language",
  },
  "master-adopted-adjective": { topic: "family" },
  "master-adoption-noun": {
    definition: "the legal act of taking a child or animal into a new family or home",
    vietnamese: "sự nhận nuôi",
    topic: "family",
  },
  "master-adorn-verb": {
    example: "Colorful flags adorn the entrance to the hall.",
    topic: "arts",
  },
  "master-advance-noun": {
    definition: "progress or improvement in knowledge, technology, or ability",
    vietnamese: "sự tiến bộ, bước tiến",
    example: "The discovery was a major advance in medicine.",
    topic: "success",
  },
  "master-advancement-noun": { topic: "success" },
  "master-advent-noun": {
    example: "The advent of smartphones changed everyday communication.",
    topic: "events",
  },
  "master-adventurous-adjective": {
    example: "The adventurous travelers explored the remote island.",
    topic: "travel",
  },
  "master-adverse-adjective": {
    definition: "harmful or likely to prevent success",
    vietnamese: "bất lợi, có hại",
    example: "The medicine caused no adverse effects.",
  },
  "master-adversely-adverb": { topic: "description" },
  "master-adversity-noun": {
    vietnamese: "nghịch cảnh, hoàn cảnh khó khăn",
    example: "The community remained united during adversity.",
  },
  "master-affectionate-adjective": {
    example: "The child gave her grandmother an affectionate hug.",
    topic: "relationships",
  },
  "master-affectionately-adverb": {
    definition: "in a way that shows love or fondness",
    topic: "relationships",
  },
  "master-affordable-adjective": {
    vietnamese: "có giá phải chăng, có thể chi trả",
    topic: "money",
  },
  "master-aggressively-adverb": {
    vietnamese: "một cách hung hăng, quyết liệt",
    topic: "safety",
  },
  "master-agony-noun": {
    example: "The injured runner cried out in agony.",
    topic: "health",
  },
  "master-aim-verb": {
    vietnamese: "nhằm, hướng đến",
    topic: "planning",
  },
  "master-aircraft-noun": { topic: "travel" },
  "master-aircrew-noun": {
    vietnamese: "phi hành đoàn",
    topic: "work",
  },
  "master-alcoholic-noun": {
    definition: "a person who has a dependence on alcohol",
    example: "The recovering alcoholic receives professional support.",
    topic: "health",
  },
  "master-alcoholism-noun": {
    definition: "a medical condition involving dependence on alcohol",
    vietnamese: "chứng nghiện rượu",
    example: "Treatment for alcoholism can include counseling and medical care.",
    topic: "health",
  },
  "master-alert-verb": { topic: "safety" },
  "master-allegation-noun": {
    vietnamese: "cáo buộc chưa được chứng minh",
    example: "The organization opened an inquiry into the allegation.",
    topic: "society",
  },
  "master-alliance-noun": {
    definition: "an agreement between people, groups, or countries to support one another",
    vietnamese: "liên minh, khối đồng minh",
    example: "The two organizations formed an alliance to protect the river.",
    topic: "society",
  },
  "master-ally-noun": {
    definition: "a person, group, or country that supports another",
    vietnamese: "đồng minh, người ủng hộ",
    example: "The organization found a strong ally in the local council.",
  },
  "master-alphabetical-adjective": {
    vietnamese: "theo thứ tự bảng chữ cái",
    topic: "language",
  },
  "master-altar-noun": {
    definition: "a table or raised structure used in religious ceremonies",
    example: "Flowers were placed on the altar before the ceremony.",
    topic: "culture",
  },
  "master-alternate-verb": {
    definition: "to change repeatedly between two positions, activities, or states",
  },
  "master-alternatively-adverb": {
    vietnamese: "hoặc là, thay vào đó",
    topic: "language",
  },
  "master-altitude-noun": {
    vietnamese: "độ cao so với mực nước biển",
    topic: "nature",
  },
  "master-amaze-verb": { topic: "emotions" },
  "master-amazingly-adverb": { topic: "description" },
  "master-ambassador-noun": { topic: "society" },
  "master-ambiguity-noun": {
    definition: "the quality of having more than one possible meaning",
    vietnamese: "sự mơ hồ, sự đa nghĩa",
    example: "The ambiguity of the sentence confused several readers.",
    topic: "language",
  },
  "master-ammonia-noun": {
    definition: "a colorless gas with a strong smell that is used in cleaning products",
    vietnamese: "amoniac",
    example: "The cleaner contains a small amount of ammonia.",
    topic: "science",
  },
  "master-ample-adjective": {
    vietnamese: "dồi dào, dư dả",
    topic: "quantity",
  },
  "master-amplifier-noun": { topic: "technology" },
  "master-amplify-verb": {
    vietnamese: "khuếch đại, làm lớn hơn",
  },
  "master-amuse-verb": {
    vietnamese: "làm vui, làm thích thú",
    topic: "emotions",
  },
  "master-analogy-noun": { topic: "comparison" },
  "master-analyst-noun": { topic: "work" },
  "master-anchor-noun": { topic: "travel" },
  "master-anchorage-noun": {
    definition: "a safe place where boats can anchor",
    vietnamese: "nơi neo đậu",
    topic: "travel",
  },
  "master-animate-verb": { topic: "technology" },
  "master-anonymous-adjective": {
    definition: "made or given without revealing the name of the person responsible",
    example: "The newspaper received an anonymous letter.",
    topic: "communication",
  },
  "master-antiaircraft-adjective": {
    example: "The base installed antiaircraft defenses.",
    topic: "safety",
  },
  "master-antibacterial-adjective": { topic: "health" },
  "master-anticipate-verb": {
    definition: "to expect something and prepare for it before it happens",
    vietnamese: "dự đoán, lường trước",
    example: "We anticipate heavier traffic during the holiday.",
    topic: "prediction",
  },
  "master-apostrophe-noun": {
    definition: "a punctuation mark used to show missing letters or possession",
    vietnamese: "dấu nháy đơn, dấu lược",
    example: "The word don't contains an apostrophe.",
    topic: "language",
  },
  "master-applicant-noun": { topic: "work" },
  "master-appreciative-adjective": {
    vietnamese: "biết ơn, trân trọng",
    example: "The audience was appreciative of her careful work.",
    topic: "emotions",
  },
  "master-appropriately-adverb": { topic: "description" },
  "master-approximate-adjective": {
    definition: "close to the correct number or amount but not exact",
    vietnamese: "xấp xỉ, gần đúng",
    example: "Can you give me an approximate cost for the repair?",
  },
  "master-arch-noun": { topic: "objects" },
  "master-arctic-adjective": {
    definition: "extremely cold like the Arctic region",
    example: "The expedition faced arctic temperatures.",
    topic: "weather",
  },
  "master-arena-noun": { topic: "places" },
  "master-aristocracy-noun": {
    definition: "the highest social class, traditionally made up of people with inherited titles",
    vietnamese: "tầng lớp quý tộc",
    example: "The old aristocracy owned much of the land.",
    topic: "society",
  },
  "master-armful-noun": {
    definition: "the amount of something that can be carried in one or both arms",
    vietnamese: "một ôm, lượng ôm được",
    example: "She carried an armful of books upstairs.",
  },
  "master-artery-noun": {
    example: "The surgeon repaired a damaged artery.",
    topic: "health",
  },
  "master-articulate-verb": { topic: "communication" },
  "master-artificially-adverb": { topic: "description" },
  "master-artistry-noun": {
    vietnamese: "tài nghệ, kỹ năng nghệ thuật",
    topic: "arts",
  },
  "master-ash-noun": {
    example: "There was nothing left of the wood but ash.",
  },
  "master-aspiration-noun": { topic: "success" },
  "master-aspire-verb": {
    definition: "to have a strong desire to achieve or become something",
    vietnamese: "khao khát, mong muốn đạt tới",
    example: "Many young athletes aspire to compete internationally.",
    topic: "success",
  },
  "master-assault-noun": {
    definition: "a violent physical attack on a person",
    vietnamese: "cuộc tấn công, hành vi hành hung",
    example: "The police investigated the reported assault.",
    topic: "safety",
  },
  "master-assemble-verb": { topic: "actions" },
  "master-assembly-noun": {
    definition: "a meeting of a group of people for a particular purpose",
    vietnamese: "buổi tập trung, cuộc họp",
    topic: "society",
  },
  "master-assert-verb": {
    definition: "to state something firmly and confidently",
    vietnamese: "khẳng định, quả quyết",
    example: "She asserted her right to speak at the meeting.",
  },
  "master-assumption-noun": { topic: "thinking" },
  "master-assurance-noun": { topic: "communication" },
  "master-astonish-verb": { topic: "emotions" },
  "master-astonished-adjective": { topic: "emotions" },
  "master-astonishing-adjective": {
    definition: "extremely surprising or impressive",
    vietnamese: "đáng kinh ngạc, gây sửng sốt",
  },
  "master-astronomy-noun": {
    example: "She studied astronomy at university.",
    topic: "science",
  },
  "master-athletics-noun": { topic: "sports" },
  "master-attached-adjective": { topic: "relationships" },
  "master-attainable-adjective": { topic: "success" },
  "master-attainment-noun": {
    example: "Her degree marked an important personal attainment.",
    topic: "success",
  },
  "master-attendance-noun": { topic: "events" },
  "master-attentively-adverb": {
    example: "The students listened attentively to the instructions.",
  },
  "master-attractiveness-noun": {
    definition: "the quality of being pleasant, appealing, or beautiful",
    vietnamese: "sức hấp dẫn, vẻ thu hút",
    example: "Good transport links increase the town's attractiveness.",
  },
  "master-attribute-noun": {
    definition: "a quality or feature of a person or thing",
    topic: "description",
  },
  "master-attribute-verb": {
    definition: "to regard something as being caused or created by a particular person or thing",
  },
  "master-atypical-adjective": {
    example: "Such warm weather is atypical for January.",
  },
  "master-aubergine-noun": {
    definition: "a purple, egg-shaped fruit that is cooked and eaten as a vegetable",
    example: "She sliced the aubergine before roasting it.",
  },
  "master-audit-noun": {
    definition: "an official examination of financial records or business processes",
    vietnamese: "cuộc kiểm toán, sự kiểm tra",
    example: "The annual audit found no accounting errors.",
    topic: "business",
  },
  "master-audition-noun": {
    definition: "a short performance used to decide whether someone gets a role",
    vietnamese: "buổi thử vai, buổi thử giọng",
    topic: "arts",
  },
  "master-availability-noun": {
    definition: "the state of being ready or able to be used or obtained",
    vietnamese: "tính sẵn có, khả năng sử dụng",
    example: "Ticket availability is limited this weekend.",
  },
  "master-awe-noun": {
    vietnamese: "sự kính sợ, cảm giác thán phục",
  },
  "master-axis-noun": { topic: "science" },
  "master-backup-noun": { topic: "technology" },
  "master-backyard-noun": { topic: "home" },
  "master-badge-noun": { topic: "objects" },
  "master-balance-verb": { topic: "movement" },
  "master-balky-adjective": {
    definition: "unwilling to work, move, or cooperate",
    example: "The mechanic repaired the balky engine.",
  },
  "master-ballad-noun": { topic: "arts" },
  "master-ballet-noun": { topic: "arts" },
  "master-ballot-noun": { topic: "society" },
  "master-ban-noun": { topic: "society" },
  "master-banker-noun": { topic: "money" },
  "master-bankrupt-verb": {
    definition: "to cause a person or business to lose all available money",
    example: "The long legal dispute could bankrupt the small company.",
    topic: "money",
  },
  "master-bankruptcy-noun": { topic: "money" },
  "master-barbershop-noun": { topic: "places" },
  "master-bare-verb": {
    example: "Please bare your arm for the examination.",
    topic: "health",
  },
  "master-bargain-verb": { topic: "business" },
  "master-bark-verb": { topic: "sounds" },
  "master-barley-noun": {
    example: "Farmers grow barley for food and animal feed.",
  },
  "master-barn-noun": {
    vietnamese: "chuồng trại, kho nông trại",
    topic: "places",
  },
  "master-barometer-noun": {
    example: "The barometer showed a sudden drop in air pressure.",
    topic: "science",
  },
  "master-barrier-noun": { topic: "problem-solving" },
  "master-bartender-noun": {
    example: "The bartender prepared drinks for the guests.",
    topic: "work",
  },
  "master-bathhouse-noun": { topic: "places" },
  "master-battlefield-noun": { topic: "history" },
  "master-beagle-noun": {
    example: "The beagle followed the scent through the field.",
  },
  "master-bearing-noun": {
    vietnamese: "mối liên quan, ảnh hưởng",
    topic: "thinking",
  },
  "master-beat-noun": { topic: "arts" },
  "master-beautify-verb": {
    example: "Residents planted flowers to beautify the street.",
  },
  "master-bellow-verb": { topic: "sounds" },
  "master-belongings-noun": {
    vietnamese: "đồ đạc, tư trang",
    topic: "ownership",
  },
  "master-bend-noun": {
    definition: "a curve or change in direction",
  },
  "master-benefit-verb": { topic: "success" },
  "master-bestow-verb": {
    vietnamese: "trao tặng, ban cho",
    example: "The university will bestow an award on the researcher.",
    topic: "society",
  },
  "master-bestseller-noun": { topic: "literature" },
  "master-betray-verb": {
    vietnamese: "phản bội, phụ lòng",
    example: "He refused to betray the trust of his friends.",
    topic: "relationships",
  },
  "master-bewilder-verb": {
    example: "The complicated map may bewilder first-time visitors.",
  },
  "master-bid-verb": { topic: "business" },
  "master-bidding-noun": {
    definition: "the process of offering prices to buy something or win a contract",
    vietnamese: "sự đấu giá, sự dự thầu",
    topic: "business",
  },
  "master-bikini-noun": { topic: "clothing" },
  "master-bind-verb": {
    vietnamese: "buộc, trói, đóng lại",
  },
  "master-biological-adjective": {
    example: "The researchers examined several biological processes.",
    topic: "science",
  },
  "master-biotechnology-noun": { topic: "science" },
  "master-birthplace-noun": {
    example: "The museum stands near the writer's birthplace.",
  },
  "master-bitterly-adverb": { topic: "emotions" },
  "master-blade-noun": {
    example: "The knife has a sharp steel blade.",
    topic: "objects",
  },
  "master-blast-noun": {
    definition: "a sudden explosion or powerful burst of air",
    vietnamese: "vụ nổ, luồng khí mạnh",
    topic: "safety",
  },
  "master-blast-verb": {
    definition: "to produce a very loud and harsh sound",
    vietnamese: "phát ra âm thanh lớn, gầm vang",
    topic: "sounds",
  },
  "master-blaze-noun": {
    example: "Firefighters worked through the night to control the blaze.",
    topic: "safety",
  },
  "master-blaze-verb": { topic: "safety" },
  "master-blend-noun": { topic: "language" },
  "master-blindly-adverb": { topic: "description" },
  "master-blindness-noun": {
    vietnamese: "tình trạng mù lòa, mất thị lực",
    topic: "health",
  },
  "master-blink-verb": { topic: "body" },
  "master-bloody-adjective": {
    definition: "covered with or marked by blood",
    vietnamese: "đẫm máu, dính máu",
    example: "The medic replaced the bloody bandage.",
    topic: "safety",
  },
  "master-bloody-adverb": {
    definition: "used informally to mean very or extremely",
    vietnamese: "rất, vô cùng",
    example: "The final stage was bloody difficult.",
    topic: "language",
  },
  "master-blooming-adjective": {
    definition: "producing flowers or covered with flowers",
    vietnamese: "đang nở hoa",
    topic: "nature",
  },
  "master-blur-verb": {
    example: "Rain can blur the view through the window.",
    topic: "senses",
  },
  "master-blush-verb": { topic: "emotions" },
  "master-bolt-noun": {
    vietnamese: "bu lông, chốt",
  },
  "master-bolt-verb": {
    vietnamese: "chạy vụt đi, bỏ chạy",
    example: "The horse may bolt if it hears a sudden noise.",
  },
  "master-bomber-noun": {
    definition: "an aircraft designed to carry and drop bombs",
    vietnamese: "máy bay ném bom",
    example: "The aviation museum restored a historic bomber.",
    topic: "history",
  },
  "master-bombing-noun": {
    definition: "an attack in which one or more bombs are used",
    example: "The bombing damaged several empty buildings.",
    topic: "safety",
  },
  "master-bony-adjective": {
    definition: "containing many bones or having bones that are easy to see",
    example: "This fish is too bony for young children.",
  },
  "master-booklet-noun": {
    definition: "a small, thin book with a few pages",
    example: "The clinic gave each patient an information booklet.",
  },
  "master-boost-noun": {
    vietnamese: "sự đẩy lên, sự thúc đẩy",
  },
  "master-boost-verb": {
    example: "The campaign helped boost ticket sales.",
  },
  "master-booth-noun": {
    definition: "a small enclosed space or stall for a particular purpose",
    vietnamese: "quầy, gian, buồng nhỏ",
    example: "The company displayed its products at a trade-show booth.",
  },
  "master-bossy-adjective": {
    vietnamese: "hay ra lệnh, thích sai khiến",
  },
  "master-botany-noun": { topic: "science" },
  "master-bottle-verb": {
    definition: "to put a liquid into bottles for storage or sale",
    vietnamese: "đóng chai",
    example: "The farm bottles fresh juice every morning.",
    topic: "business",
  },
  "master-bourbon-noun": {
    vietnamese: "rượu bourbon",
  },
  "master-bow-verb": {
    definition: "to bend the head or upper body forward as a greeting or sign of respect",
    vietnamese: "cúi đầu, cúi chào",
    topic: "culture",
  },
  "master-boxer-noun": {
    example: "The boxer trained daily for the championship.",
    topic: "sports",
  },
  "master-brag-noun": {
    example: "His claim about the record sounded like an empty brag.",
  },
  "master-brake-verb": {
    vietnamese: "phanh, hãm lại",
    topic: "travel",
  },
  "master-bravery-noun": {
    vietnamese: "lòng can đảm, sự dũng cảm",
    topic: "emotions",
  },
  "master-breakdown-noun": { topic: "travel" },
  "master-breakup-noun": {
    vietnamese: "sự chia tay, sự tan vỡ",
    example: "She needed time to recover from the breakup.",
    topic: "relationships",
  },
  "master-breathtaking-adjective": {
    example: "The mountain offered a breathtaking view of the valley.",
  },
  "master-breed-noun": { topic: "animals" },
  "master-breezy-adjective": {
    example: "It was a bright and breezy afternoon.",
    topic: "weather",
  },
  "master-brewery-noun": { topic: "places" },
  "master-brilliantly-adverb": { topic: "description" },
  "master-broadcaster-noun": {
    definition: "a person who presents programs on radio or television",
    vietnamese: "phát thanh viên, người dẫn chương trình",
    example: "The broadcaster interviewed two experts live on air.",
    topic: "work",
  },
  "master-brochure-noun": {
    example: "The clinic published a brochure about gum disease.",
  },
  "master-brother-in-law-noun": { topic: "family" },
  "master-browse-verb": {
    definition: "to look through information or goods casually without a specific goal",
    vietnamese: "xem lướt, duyệt qua",
  },
  "master-browser-noun": {
    definition: "a computer program used to view websites on the internet",
    vietnamese: "trình duyệt web",
    example: "Update your browser before opening the website.",
    topic: "technology",
  },
  "master-bruise-noun": { topic: "health" },
  "master-bulimia-noun": {
    definition: "an eating disorder involving repeated overeating followed by attempts to avoid weight gain",
    vietnamese: "chứng ăn vô độ",
    topic: "health",
  },
  "master-bully-verb": {
    definition: "to frighten or hurt someone repeatedly in order to control them",
    example: "Older students must not bully younger children.",
    topic: "safety",
  },
  "master-bumper-noun": {
    vietnamese: "cản xe, thanh giảm va",
    topic: "travel",
  },
  "master-bun-noun": {
    vietnamese: "bánh mì tròn nhỏ",
  },
  "master-burden-verb": {
    definition: "to give someone a heavy responsibility or difficult problem",
    vietnamese: "làm nặng gánh, gây gánh nặng",
    topic: "responsibility",
  },
  "master-burdensome-adjective": {
    definition: "difficult to carry out or deal with",
    example: "The new reporting process became burdensome for small teams.",
  },
  "master-bureaucracy-noun": {
    definition: "a system with many official rules and administrative procedures",
    vietnamese: "hệ thống quan liêu, bộ máy hành chính",
  },
  "master-burglary-noun": {
    vietnamese: "tội đột nhập trộm cắp",
    topic: "safety",
  },
  "master-burgle-verb": { topic: "safety" },
  "master-burial-noun": {
    example: "The family arranged a private burial.",
    topic: "culture",
  },
  "master-buzz-noun": { topic: "sounds" },
  "master-buzz-verb": { topic: "sounds" },
  "master-calmly-adverb": {
    vietnamese: "một cách bình tĩnh, điềm đạm",
    example: "She calmly explained the problem to the manager.",
    topic: "emotions",
  },
  "master-candidate-noun": { topic: "society" },
  "master-canon-noun": {
    example: "The novel became part of the literary canon.",
    topic: "culture",
  },
  "master-cardigan-noun": { topic: "clothing" },
  "master-caring-adjective": {
    example: "She is a caring and patient teacher.",
    topic: "relationships",
  },
  "master-carnival-noun": { topic: "culture" },
  "master-carve-verb": {
    definition: "to cut food, especially meat, into slices",
    vietnamese: "thái, cắt thành lát",
    example: "Father carved the ham for dinner.",
    topic: "food",
  },
  "master-cascade-noun": {
    example: "A narrow cascade flows down the rocky hillside.",
  },
  "master-cast-noun": {
    vietnamese: "dàn diễn viên",
    topic: "arts",
  },
  "master-cast-verb": { topic: "senses" },
  "master-casually-adverb": { topic: "description" },
  "master-catalyst-noun": {
    example: "The catalyst made the chemical reaction happen faster.",
    topic: "science",
  },
  "master-catastrophe-noun": {
    example: "The flood became a national catastrophe.",
    topic: "safety",
  },
  "master-catastrophic-adjective": {
    vietnamese: "thảm khốc, gây thiệt hại nghiêm trọng",
    example: "The bridge collapse had catastrophic consequences.",
    topic: "safety",
  },
  "master-catchy-adjective": {
    example: "The advertisement uses a catchy song.",
    topic: "arts",
  },
  "master-catering-noun": { topic: "business" },
  "master-cathedral-noun": {
    topic: "culture",
  },
  "master-cellar-noun": { topic: "home" },
  "master-cellist-noun": { topic: "arts" },
  "master-certificate-noun": { topic: "education" },
  "master-certification-noun": {
    example: "The technician completed professional certification last year.",
    topic: "education",
  },
  "master-challenge-verb": { topic: "success" },
  "master-chancellor-noun": { topic: "society" },
  "master-chemotherapy-noun": {
    definition: "medical treatment that uses powerful drugs to destroy cancer cells",
    vietnamese: "hóa trị, phương pháp hóa trị",
    example: "The patient began chemotherapy after consulting the specialist.",
    topic: "health",
  },
  "master-chip-noun": {
    vietnamese: "mảnh vỡ, mảnh nhỏ",
    topic: "objects",
  },
  "master-chop-verb": {
    example: "Chop the vegetables into small pieces.",
    topic: "food",
  },
  "master-chunk-noun": { topic: "objects" },
  "master-circuit-noun": { topic: "movement" },
  "master-classic-noun": {
    definition: "a book, film, song, or other work considered excellent for many years",
    vietnamese: "tác phẩm kinh điển",
    topic: "arts",
  },
  "master-classification-noun": {
    definition: "a system for arranging things into groups according to shared features",
    topic: "science",
  },
  "master-clause-noun": {
    vietnamese: "điều khoản",
    topic: "business",
  },
  "master-client-noun": { topic: "business" },
  "master-closure-noun": {
    definition: "the act or process of closing or ending something",
    vietnamese: "sự đóng cửa, sự kết thúc",
    example: "The factory closure affected hundreds of workers.",
    topic: "events",
  },
  "master-clothing-noun": {
    example: "Coats, shirts, and trousers are types of clothing.",
    topic: "clothing",
  },
  "master-coach-verb": {
    vietnamese: "huấn luyện, hướng dẫn",
    topic: "sports",
  },
  "master-coalition-noun": { topic: "society" },
  "master-collapse-verb": {
    example: "The damaged wall began to collapse during the storm.",
  },
  "master-colonial-adjective": {
    example: "The museum documents the country's colonial history.",
    topic: "history",
  },
  "master-commerce-noun": { topic: "business" },
  "master-commercial-noun": {
    vietnamese: "quảng cáo trên truyền hình hoặc phát thanh",
    topic: "business",
  },
  "master-commission-noun": {
    vietnamese: "ủy ban, hội đồng",
  },
  "master-communicative-adjective": {
    definition: "willing and able to communicate openly with other people",
    vietnamese: "cởi mở, thích giao tiếp",
    example: "The new student is friendly and communicative.",
    topic: "communication",
  },
  "master-compatible-adjective": {
    example: "This software is compatible with older computers.",
    topic: "technology",
  },
  "master-compensate-verb": {
    definition: "to pay someone for loss, damage, or work performed",
    example: "The company agreed to compensate residents for the damage.",
    topic: "money",
  },
  "master-competence-noun": { topic: "skills" },
  "master-competent-adjective": { topic: "skills" },
  "master-compile-verb": {
    topic: "actions",
  },
  "master-completion-noun": { topic: "success" },
  "master-compromise-verb": { topic: "problem-solving" },
  "master-compulsory-adjective": { topic: "society" },
  "master-compute-verb": { topic: "science" },
  "master-conceal-verb": { topic: "actions" },
  "master-concede-verb": {
    example: "She finally conceded that the other team had played better.",
  },
  "master-conceive-verb": { topic: "thinking" },
  "master-conception-noun": {
    definition: "an idea or understanding of what something is or should be",
    vietnamese: "quan niệm, ý niệm",
    example: "His conception of leadership changed over time.",
    topic: "thinking",
  },
  "master-concern-verb": { topic: "communication" },
  "master-concrete-adjective": {
    definition: "clear, specific, and based on facts rather than ideas",
    vietnamese: "cụ thể, xác thực",
  },
  "master-concrete-noun": {
    example: "The sidewalk was made of concrete.",
  },
  "master-condemn-verb": {
    definition: "to publicly state that something is wrong or unacceptable",
    example: "Community leaders condemned the violent attack.",
    topic: "society",
  },
  "master-conduct-verb": { topic: "science" },
  "master-cone-noun": {
    example: "The child built a paper cone for the project.",
    topic: "science",
  },
  "master-conference-noun": { topic: "events" },
  "master-confess-verb": { topic: "society" },
  "master-confession-noun": {
    definition: "a statement in which someone admits doing something wrong or illegal",
    example: "The written confession was presented in court.",
    topic: "society",
  },
  "master-confine-verb": { topic: "actions" },
  "master-confront-verb": { topic: "safety" },
  "master-conjunction-noun": {
    vietnamese: "liên từ",
    topic: "language",
  },
  "master-conscience-noun": { topic: "thinking" },
  "master-consciousness-noun": {
    vietnamese: "ý thức, trạng thái tỉnh táo",
    example: "The patient slowly regained consciousness after the operation.",
    topic: "health",
  },
  "master-consensus-noun": { topic: "society" },
  "master-consent-noun": { topic: "society" },
  "master-considerably-adverb": { topic: "description" },
  "master-constant-adjective": {
    vietnamese: "liên tục, không đổi",
  },
  "master-consultant-noun": {
    vietnamese: "chuyên gia tư vấn, cố vấn",
    topic: "work",
  },
  "master-contemporary-adjective": { topic: "culture" },
  "master-content-adjective": { topic: "emotions" },
  "master-contract-noun": {
    example: "Both companies signed the contract last week.",
    topic: "business",
  },
  "master-contradict-verb": {
    example: "The two witness statements contradict each other.",
    topic: "language",
  },
  "master-contradiction-noun": { topic: "language" },
  "master-contradictory-adjective": { topic: "language" },
  "master-controversy-noun": { topic: "society" },
  "master-convention-noun": { topic: "events" },
  "master-conversion-noun": {
    vietnamese: "sự chuyển đổi, sự biến đổi",
    example: "The conversion of the warehouse into apartments took a year.",
    topic: "change",
  },
  "master-convert-verb": {
    vietnamese: "chuyển đổi, biến đổi",
  },
  "master-cooperate-verb": {
    vietnamese: "hợp tác, cộng tác",
    topic: "relationships",
  },
  "master-cooperation-noun": { topic: "relationships" },
  "master-cooperative-adjective": { topic: "relationships" },
  "master-cope-verb": {
    vietnamese: "đối phó, xoay xở",
    topic: "problem-solving",
  },
  "master-copper-noun": { topic: "materials" },
  "master-core-noun": { topic: "objects" },
  "master-corporate-adjective": { topic: "business" },
  "master-corporation-noun": { topic: "business" },
  "master-correct-verb": { topic: "problem-solving" },
  "master-correspond-verb": { topic: "comparison" },
  "master-correspondence-noun": {
    vietnamese: "thư từ, sự trao đổi thư từ",
  },
  "master-correspondent-noun": {
    example: "The foreign correspondent reported live from the capital.",
    topic: "work",
  },
  "master-corridor-noun": { topic: "places" },
  "master-corrupt-adjective": { topic: "society" },
  "master-corruption-noun": { topic: "society" },
  "master-costly-adjective": {
    example: "Repairing the old bridge was a costly project.",
    topic: "money",
  },
  "master-costume-noun": { topic: "clothing" },
  "master-cottage-noun": { topic: "places" },
  "master-cough-noun": { topic: "health" },
  "master-courtesy-noun": {
    vietnamese: "sự lịch thiệp, phép lịch sự",
    topic: "relationships",
  },
  "master-crack-noun": { topic: "objects" },
  "master-crack-verb": {
    vietnamese: "làm nứt, làm vỡ",
  },
  "master-creation-noun": { topic: "actions" },
  "master-crew-noun": {
    vietnamese: "đội, nhóm nhân viên, thủy thủ đoàn",
    topic: "work",
  },
  "master-criminal-adjective": {
    definition: "relating to crime or the legal punishment of crime",
    vietnamese: "thuộc hình sự, phạm pháp",
    example: "The police opened a criminal investigation.",
    topic: "society",
  },
  "master-critically-adverb": {
    vietnamese: "trong tình trạng nguy kịch, nghiêm trọng",
    topic: "health",
  },
  "master-criticism-noun": { topic: "society" },
  "master-crucial-adjective": {
    vietnamese: "cực kỳ quan trọng, mang tính quyết định",
    example: "Clear communication is crucial during an emergency.",
  },
  "master-cruise-verb": { topic: "travel" },
  "master-cure-verb": {
    definition: "to make an illness or medical condition end",
    example: "The new treatment may cure the infection.",
  },
  "master-damn-adjective": { topic: "language" },
  "master-damn-adverb": { topic: "language" },
  "master-damn-interjection": {
    example: "Damn, I missed the last train!",
  },
  "master-darling-adjective": {
    definition: "dearly loved or regarded with great affection",
    topic: "relationships",
  },
  "master-darling-noun": {
    definition: "a person who is loved very much",
    example: "Come here, my darling.",
    topic: "relationships",
  },
  "master-dash-noun": { topic: "language" },
  "master-dash-verb": {
    vietnamese: "chạy vụt, lao nhanh",
  },
  "master-data-noun": { topic: "science" },
  "master-database-noun": {
    vietnamese: "cơ sở dữ liệu",
    topic: "technology",
  },
  "master-dear-noun": {
    definition: "a person who is loved or treated with affection",
    vietnamese: "người thân yêu",
    example: "Please sit beside me, my dear.",
    topic: "relationships",
  },
  "master-debit-verb": { topic: "money" },
  "master-decade-noun": {
    vietnamese: "thập kỷ, mười năm",
  },
  "master-deceive-verb": { topic: "relationships" },
  "master-decent-adjective": {
    vietnamese: "tử tế, khá tốt, phù hợp",
  },
  "master-decisive-adjective": {
    definition: "able to make decisions quickly and confidently, or settling an issue",
    example: "Her decisive action prevented further delays.",
    topic: "decision-making",
  },
  "master-deck-noun": { topic: "travel" },
  "master-decline-verb": { topic: "change" },
  "master-decorate-verb": {
    topic: "arts",
  },
  "master-decoration-noun": { topic: "arts" },
  "master-deduction-noun": { topic: "thinking" },
  "master-defeat-noun": { topic: "success" },
  "master-deficit-noun": {
    definition: "the amount by which money or resources are less than what is needed",
    vietnamese: "thâm hụt, số tiền thiếu hụt",
    example: "The government announced a large budget deficit.",
    topic: "money",
  },
  "master-defy-verb": { topic: "society" },
  "master-deliberate-adjective": {
    vietnamese: "có chủ ý, được cân nhắc kỹ",
    example: "The change was a deliberate decision, not an accident.",
    topic: "decision-making",
  },
  "master-deliberately-adverb": {
    vietnamese: "cố ý, có chủ tâm",
    example: "She deliberately left extra time for questions.",
    topic: "decision-making",
  },
  "master-deposit-verb": { topic: "money" },
  "master-deputy-noun": { topic: "work" },
  "master-desirable-adjective": {
    definition: "worth having or likely to be wanted",
    vietnamese: "đáng mong muốn, hấp dẫn",
    example: "Good transport makes the area more desirable.",
  },
  "master-desire-verb": {
    vietnamese: "khao khát, mong muốn",
    example: "Many residents desire a quieter neighborhood.",
  },
  "master-desktop-noun": {
    example: "A small lamp stood on the desktop.",
    topic: "objects",
  },
  "master-desperately-adverb": {
    definition: "in a way that shows a very great need or lack of hope",
    vietnamese: "một cách tuyệt vọng, vô cùng cấp thiết",
    topic: "emotions",
  },
  "master-detect-verb": {
    definition: "to discover or notice something, especially something difficult to see",
  },
  "master-devil-noun": {
    definition: "an evil spirit, especially the most powerful evil being in some religions",
    vietnamese: "ác quỷ, ma quỷ",
    example: "The story describes a man who makes a deal with the devil.",
    topic: "culture",
  },
  "master-devote-verb": { topic: "actions" },
  "master-dilemma-noun": {
    definition: "a situation in which you must make a difficult choice",
    vietnamese: "tình thế khó xử, tình thế tiến thoái lưỡng nan",
    example: "She faced a dilemma over whether to accept the job abroad.",
  },
  "master-dimension-noun": {
    vietnamese: "khía cạnh, phương diện",
  },
  "master-dip-verb": {
    definition: "to put something briefly into a liquid and then take it out",
    example: "She dipped the brush into the paint.",
  },
  "master-diplomat-noun": {
    example: "The diplomat represented her country at the peace talks.",
  },
  "master-discharge-noun": {
    definition: "the release of a liquid, gas, or other substance",
    vietnamese: "sự xả ra, sự thoát ra",
  },
  "master-discipline-noun": {
    definition: "the practice of training people to obey rules, or the ability to control yourself",
    example: "Learning a new language requires patience and discipline.",
  },
  "master-disguise-verb": { topic: "actions" },
  "master-dismiss-verb": {
    definition: "to remove someone from their job",
    vietnamese: "sa thải, cho thôi việc",
    topic: "work",
  },
  "master-disorder-noun": {
    definition: "a state in which things are untidy, confused, or not organized",
    vietnamese: "sự lộn xộn, tình trạng mất trật tự",
  },
  "master-disposal-noun": {
    vietnamese: "sự vứt bỏ, sự xử lý chất thải",
    topic: "environment",
  },
  "master-disposition-noun": {
    vietnamese: "tính khí, tính cách",
  },
  "master-disrupt-verb": {
    vietnamese: "làm gián đoạn, gây rối loạn",
    topic: "events",
  },
  "master-distortion-noun": {
    definition: "a change that makes something false, inaccurate, or difficult to recognize",
  },
  "master-distract-verb": {
    definition: "to take someone's attention away from what they should be doing",
    topic: "thinking",
  },
  "master-distributor-noun": {
    definition: "a person or company that supplies goods to shops or customers",
    topic: "business",
  },
  "master-division-noun": {
    definition: "the act of separating something into parts or groups",
  },
  "master-divorce-verb": {
    definition: "to legally end a marriage",
    vietnamese: "ly hôn",
    topic: "relationships",
  },
  "master-dock-noun": { topic: "travel" },
  "master-domestic-adjective": {
    vietnamese: "trong nước, nội địa",
    topic: "society",
  },
  "master-donation-noun": {
    vietnamese: "sự quyên góp, vật quyên góp",
  },
  "master-doom-noun": {
    vietnamese: "sự diệt vong, kết cục bi thảm",
  },
  "master-dose-noun": {
    example: "Take one dose of this cough medicine after every meal.",
    topic: "health",
  },
  "master-double-noun": {
    definition: "an amount or number that is twice as large as another",
    example: "Thirty-six is double eighteen.",
    topic: "quantity",
  },
  "master-doubt-verb": {
    definition: "to feel uncertain about something or not completely believe it",
  },
  "master-doubtful-adjective": {
    definition: "unlikely to be true or to happen",
    vietnamese: "đáng ngờ, không chắc chắn",
    example: "It is doubtful that the repairs will be finished today.",
    topic: "possibility",
  },
  "master-down-adjective": {
    vietnamese: "hướng xuống, úp xuống",
    example: "The picture was lying face down on the table.",
  },
  "master-drain-verb": {
    vietnamese: "rút hết, tháo hết, làm cạn",
  },
  "master-dramatically-adverb": {
    definition: "in a sudden, striking, or emotional way",
    vietnamese: "một cách đột ngột, ấn tượng hoặc kịch tính",
    example: "Sales increased dramatically after the new product was launched.",
    topic: "change",
  },
  "master-drought-noun": {
    definition: "a long period with very little or no rain",
    topic: "weather",
  },
  "master-duplicate-noun": {
    example: "Keep a duplicate of the document in a safe place.",
  },
  "master-dye-noun": {
    definition: "a substance used to change the color of cloth, hair, or other materials",
    example: "The fabric was soaked in blue dye.",
  },
  "master-ease-verb": {
    example: "He eased his conscience by admitting what he had done.",
    topic: "emotions",
  },
  "master-economist-noun": { topic: "business" },
  "master-editorial-noun": {
    example: "The newspaper published an editorial supporting the reform.",
  },
  "master-educator-noun": {
    definition: "a person whose work is teaching or improving education",
    vietnamese: "nhà giáo, nhà giáo dục",
    example: "Experienced educators helped design the new curriculum.",
    topic: "education",
  },
  "master-effectively-adverb": {
    definition: "in a way that produces the intended result",
    vietnamese: "một cách hiệu quả",
    topic: "success",
  },
  "master-effectiveness-noun": {
    definition: "the degree to which something produces the intended result",
    vietnamese: "tính hiệu quả, hiệu lực",
    topic: "success",
  },
  "master-elect-verb": { topic: "decision-making" },
  "master-eligible-adjective": {
    example: "All citizens over eighteen are eligible to vote.",
    topic: "society",
  },
  "master-embassy-noun": {
    vietnamese: "đại sứ quán",
    example: "The American embassy in France is located in Paris.",
    topic: "places",
  },
  "master-emergence-noun": {
    vietnamese: "sự xuất hiện, sự nổi lên",
  },
  "master-employ-verb": {
    definition: "to pay someone to work for you or for an organization",
    vietnamese: "tuyển dụng, thuê làm việc",
    topic: "work",
  },
  "master-employee-noun": { topic: "work" },
  "master-employer-noun": {
    vietnamese: "người sử dụng lao động, chủ lao động",
    example: "My employer offers flexible working hours.",
    topic: "work",
  },
  "master-encounter-verb": {
    definition: "to meet someone or experience something unexpectedly",
    vietnamese: "gặp, gặp phải, bắt gặp",
    topic: "events",
  },
  "master-enforce-verb": {
    definition: "to make sure that a law or rule is obeyed",
    vietnamese: "thi hành, thực thi, bắt tuân thủ",
  },
  "master-engagement-noun": {
    vietnamese: "cuộc hẹn, cam kết tham gia",
    topic: "work",
  },
  "master-enterprise-noun": { topic: "business" },
  "master-entitle-verb": {
    vietnamese: "cho quyền, trao quyền",
  },
  "master-entrepreneur-noun": {
    example: "The young entrepreneur started an online clothing company.",
    topic: "business",
  },
  "master-envy-verb": {
    definition: "to wish that you had something another person has",
  },
  "master-equation-noun": { topic: "science" },
  "master-equity-noun": {
    definition: "fairness and justice in the way people are treated",
    vietnamese: "sự công bằng, sự bình đẳng",
    topic: "society",
  },
  "master-erect-adjective": {
    definition: "straight and upright in position",
    example: "The guard stood erect beside the entrance.",
  },
  "master-essentially-adverb": { topic: "description" },
  "master-estimate-noun": { topic: "thinking" },
  "master-ethnic-adjective": {
    definition: "relating to a group of people who share a culture, language, or ancestry",
    topic: "society",
  },
  "master-evaluation-noun": {
    vietnamese: "sự đánh giá, sự thẩm định",
    topic: "thinking",
  },
  "master-evil-adjective": {
    definition: "morally wrong, cruel, or causing great harm",
  },
  "master-evil-noun": {
    definition: "great cruelty, wickedness, or harmful behavior",
    topic: "society",
  },
  "master-evolution-noun": {
    definition: "the gradual development of living things over many generations",
    vietnamese: "sự tiến hóa",
    topic: "science",
  },
  "master-evolve-verb": { topic: "change" },
  "master-exceed-verb": {
    definition: "to be greater than a particular number, amount, or limit",
    vietnamese: "vượt quá, vượt mức",
    topic: "quantity",
  },
  "master-exception-noun": {
    definition: "a person or thing that is not included in a general rule or statement",
    vietnamese: "ngoại lệ, trường hợp ngoại lệ",
  },
  "master-exceptional-adjective": {
    example: "She has an exceptional memory for names.",
  },
  "master-excessive-adjective": {
    example: "The company was criticized for charging excessive fees.",
  },
  "master-exclude-verb": {
    definition: "to prevent someone or something from entering or taking part",
    vietnamese: "loại trừ, không cho tham gia",
    topic: "relationships",
  },
  "master-exclusion-noun": {
    definition: "the act of preventing someone or something from entering or taking part",
    vietnamese: "sự loại trừ, sự không cho tham gia",
    example: "Her exclusion from the team seemed unfair.",
    topic: "relationships",
  },
  "master-exclusively-adverb": {
    definition: "only and not involving anyone or anything else",
    vietnamese: "chỉ, dành riêng",
    example: "The club is exclusively for people over eighteen.",
  },
  "master-execute-verb": {
    definition: "to kill someone as a legal punishment for a crime",
    vietnamese: "hành quyết, xử tử",
    example: "The prisoner was executed after being convicted of murder.",
    topic: "society",
  },
  "master-execution-noun": {
    definition: "the act or process of carrying out a plan, order, or task",
  },
  "master-executive-adjective": {
    definition: "relating to managing an organization or putting laws and decisions into effect",
    vietnamese: "thuộc điều hành, thuộc hành pháp",
    example: "The executive branch is responsible for enforcing the law.",
    topic: "society",
  },
  "master-executive-noun": { topic: "work" },
  "master-exhaust-noun": {
    definition: "waste gases released from an engine",
    vietnamese: "khí thải, khói thải",
    topic: "environment",
  },
  "master-exhibit-verb": { topic: "communication" },
  "master-exotic-adjective": {
    definition: "unusual and interesting because it comes from a distant foreign place",
    vietnamese: "ngoại lai, lạ và hấp dẫn",
    example: "The market sells exotic fruits from tropical countries.",
  },
  "master-expansion-noun": { topic: "change" },
  "master-expedition-noun": { topic: "travel" },
  "master-experiment-verb": {
    definition: "to try a new idea or method in order to discover what happens",
    topic: "science",
  },
  "master-expert-adjective": {
    definition: "having a high level of knowledge or skill",
    topic: "skills",
  },
  "master-explode-verb": {
    definition: "to burst violently and release energy, noise, and heat",
    vietnamese: "nổ, phát nổ",
    topic: "safety",
  },
  "master-exploit-verb": {
    definition: "to treat someone unfairly in order to benefit from their work",
    vietnamese: "bóc lột, lợi dụng",
  },
  "master-explosive-adjective": {
    example: "Police found an explosive device near the station.",
    topic: "safety",
  },
  "master-explosive-noun": {
    example: "The workers stored the explosive in a secure container.",
    topic: "safety",
  },
  "master-export-noun": { topic: "business" },
  "master-export-verb": { topic: "business" },
  "master-extension-noun": { topic: "home" },
  "master-extensive-adjective": {
    example: "The storm caused extensive damage across the region.",
  },
  "master-extract-noun": {
    definition: "a substance or short piece of text taken from a larger source",
    vietnamese: "chất chiết xuất, đoạn trích",
  },
  "master-extract-verb": {
    vietnamese: "trích xuất, chiết xuất, lấy ra",
    topic: "technology",
  },
  "master-fabric-noun": {
    vietnamese: "vải, chất liệu dệt",
    topic: "materials",
  },
  "master-facilitate-verb": { topic: "actions" },
  "master-factor-noun": { topic: "thinking" },
  "master-faculty-noun": {
    definition: "the teaching staff of a university, college, or school",
    vietnamese: "đội ngũ giảng viên, ban giảng huấn",
    topic: "education",
  },
  "master-faint-verb": {
    definition: "to suddenly become unconscious for a short time",
    vietnamese: "ngất, xỉu",
  },
  "master-faith-noun": { topic: "culture" },
  "master-fat-noun": {
    definition: "an oily substance found in food and in the bodies of people and animals",
    vietnamese: "chất béo, mỡ",
    topic: "food",
  },
  "master-fatal-adjective": { topic: "safety" },
  "master-fate-noun": {
    example: "The novel follows a family struggling to escape its fate.",
  },
  "master-feature-verb": {
    definition: "to include someone or something as an important part",
    example: "The exhibition features work by local artists.",
    topic: "communication",
  },
  "master-federal-adjective": { topic: "society" },
  "master-feedback-noun": {
    vietnamese: "phản hồi, ý kiến góp ý",
    topic: "communication",
  },
  "master-female-noun": {
    vietnamese: "người nữ, con cái, con mái",
    topic: "people",
  },
  "master-file-verb": {
    definition: "to officially submit a document or store it in an organized way",
    topic: "business",
  },
  "master-finance-noun": { topic: "money" },
  "master-financially-adverb": {
    definition: "in a way that relates to money",
    example: "He supported his daughter financially until she recovered from the accident.",
    topic: "money",
  },
  "master-fine-adverb": {
    vietnamese: "ổn, tốt",
    topic: "description",
  },
  "master-fine-verb": {
    vietnamese: "phạt tiền",
    topic: "society",
  },
  "master-fire-verb": { topic: "work" },
  "master-firstly-adverb": {
    definition: "used to introduce the first point in a list or argument",
    vietnamese: "trước hết, thứ nhất",
    example: "Firstly, we need to agree on a realistic budget.",
  },
  "master-fiscal-adjective": {
    definition: "relating to government money, taxes, or public spending",
    vietnamese: "thuộc tài chính, thuộc ngân sách",
    topic: "money",
  },
  "master-fit-noun": {
    definition: "a sudden short period of strong emotion or uncontrolled behavior",
    vietnamese: "cơn, cơn bộc phát",
    topic: "emotions",
  },
  "master-flame-noun": {
    vietnamese: "ngọn lửa, ánh lửa",
    topic: "safety",
  },
  "master-flash-noun": { topic: "technology" },
  "master-flat-adverb": {
    definition: "in a level position against a surface",
    vietnamese: "nằm phẳng, áp sát",
    example: "Lie flat on the floor and stretch your legs.",
    topic: "description",
  },
  "master-fleet-noun": { topic: "travel" },
  "master-flesh-noun": {
    definition: "the soft substance under the skin of a person, animal, or fruit",
    vietnamese: "thịt, phần thịt quả",
    example: "The peach has soft, sweet flesh.",
    topic: "nature",
  },
  "master-flexibility-noun": {
    definition: "the ability to bend, change, or adapt easily",
    vietnamese: "tính linh hoạt, độ dẻo, khả năng thích ứng",
  },
  "master-flip-verb": {
    definition: "to turn something over or move it quickly",
    vietnamese: "lật, bật nhanh, búng",
    example: "She flipped the switch and the lights came on.",
  },
  "master-follower-noun": {
    definition: "a person who supports, admires, or follows another person or group",
  },
  "master-footnote-noun": {
    definition: "a note printed at the bottom of a page that gives extra information",
    vietnamese: "chú thích cuối trang",
    topic: "language",
  },
  "master-formation-noun": {
    definition: "a particular arrangement of people or things",
    vietnamese: "đội hình, cách sắp xếp",
  },
  "master-formerly-adverb": {
    example: "The building was formerly used as a school.",
    topic: "time",
  },
  "master-foul-adjective": {
    example: "The meat had been left out for days and smelled foul.",
  },
  "master-frame-verb": {
    example: "Workers framed the house before installing the roof.",
    topic: "home",
  },
  "master-frankly-adverb": {
    definition: "in an honest and direct way",
    example: "Frankly, I think the proposal needs more work.",
  },
  "master-fraud-noun": {
    example: "The accountant was convicted of a major financial fraud.",
    topic: "society",
  },
  "master-freak-verb": {
    definition: "to suddenly become very frightened, upset, or excited",
    vietnamese: "hoảng hốt, mất bình tĩnh",
  },
  "master-free-verb": { topic: "society" },
  "master-friendly-adjective": {
    example: "The new neighbors were warm and friendly.",
    topic: "relationships",
  },
  "master-furious-adjective": {
    definition: "feeling extremely angry",
    topic: "emotions",
  },
  "master-gang-noun": {
    vietnamese: "băng nhóm, băng đảng",
  },
  "master-gaze-noun": {
    example: "She directed her gaze toward the stage.",
    topic: "senses",
  },
  "master-genre-noun": {
    example: "Jazz is a popular genre of music.",
    topic: "arts",
  },
  "master-gently-adverb": {
    definition: "in a soft, careful, or kind way",
    example: "Michael gently placed the sleeping child in bed.",
  },
  "master-genuine-adjective": {
    definition: "real and exactly what it appears to be, rather than fake",
    example: "The museum confirmed that the painting was genuine.",
  },
  "master-geographic-adjective": {
    definition: "relating to the physical features, location, or study of an area",
    example: "The island's geographic location makes travel difficult.",
    topic: "places",
  },
  "master-glare-noun": {
    vietnamese: "cái nhìn giận dữ, cái nhìn trừng trừng",
    example: "She gave him an angry glare across the table.",
    topic: "emotions",
  },
  "master-globally-adverb": {
    definition: "throughout the whole world",
    vietnamese: "trên toàn cầu, trên toàn thế giới",
    topic: "places",
  },
  "master-glow-noun": {
    definition: "a soft, steady light",
    vietnamese: "ánh sáng dịu, ánh sáng rực nhẹ",
    topic: "senses",
  },
  "master-god-noun": { topic: "culture" },
  "master-good-noun": {
    definition: "what is morally right or beneficial",
    example: "The charity works for the good of the whole community.",
    topic: "society",
  },
  "master-goodwill-noun": {
    example: "The agreement depends on goodwill between the two communities.",
    topic: "relationships",
  },
  "master-governmental-adjective": {
    vietnamese: "thuộc chính phủ, thuộc chính quyền",
    example: "The project requires governmental approval.",
    topic: "society",
  },
  "master-grade-verb": { topic: "education" },
  "master-grain-noun": {
    vietnamese: "ngũ cốc, hạt",
    topic: "food",
  },
  "master-grasp-noun": {
    vietnamese: "sự hiểu biết, khả năng nắm vững",
  },
  "master-grief-noun": { topic: "emotions" },
  "master-grin-noun": {
    vietnamese: "nụ cười toe toét",
    topic: "emotions",
  },
  "master-grip-noun": {
    vietnamese: "sự nắm chặt, cách nắm",
    topic: "actions",
  },
  "master-gross-adjective": {
    vietnamese: "tổng, trước khi khấu trừ",
    topic: "money",
  },
  "master-guarantee-verb": {
    definition: "to promise to repair or replace a product if it does not work properly",
    example: "The manufacturer guarantees the product against defects for three years.",
    topic: "business",
  },
  "master-guard-verb": { topic: "safety" },
  "master-guideline-noun": { topic: "communication" },
  "master-handout-noun": {
    definition: "money, food, or other help given to someone in need",
    vietnamese: "tiền hoặc đồ cứu trợ",
    example: "The shelter provides food handouts to people in need.",
    topic: "society",
  },
  "master-hang-noun": {
    vietnamese: "cách thức, bí quyết",
  },
  "master-hardware-noun": { topic: "technology" },
  "master-harm-noun": { topic: "safety" },
  "master-haunt-verb": {
    definition: "to repeatedly appear in someone's thoughts and cause worry or sadness",
    vietnamese: "ám ảnh, đeo bám",
  },
  "master-heap-noun": { topic: "objects" },
  "master-heap-verb": { topic: "actions" },
  "master-hedge-noun": { topic: "nature" },
  "master-helicopter-noun": { topic: "travel" },
  "master-hell-noun": { topic: "states" },
  "master-herb-noun": { topic: "food" },
  "master-heritage-noun": { topic: "culture" },
  "master-highlight-noun": {
    definition: "the most enjoyable, important, or memorable part of something",
    vietnamese: "điểm nổi bật, phần đáng nhớ nhất",
    example: "The concert was the highlight of our trip.",
    topic: "events",
  },
  "master-holder-noun": {
    vietnamese: "giá đỡ, vật đựng",
    topic: "objects",
  },
  "master-hook-noun": {
    vietnamese: "cái móc",
    example: "He hung his coat on a hook by the door.",
  },
  "master-hospitality-noun": {
    topic: "culture",
  },
  "master-hug-noun": { topic: "relationships" },
  "master-hugely-adverb": {
    definition: "by a very great amount or degree",
    example: "The new series became hugely popular with viewers.",
    topic: "quantity",
  },
  "master-hybrid-adjective": {
    definition: "combining two different types, systems, or technologies",
    vietnamese: "lai, kết hợp",
    topic: "technology",
  },
  "master-icon-noun": {
    definition: "a famous person or symbol that represents a particular idea or field",
    topic: "culture",
  },
  "master-ideally-adverb": {
    definition: "in the best possible situation or way",
    vietnamese: "một cách lý tưởng, tốt nhất là",
  },
  "master-identical-adjective": {
    definition: "exactly the same in every detail",
  },
  "master-identification-noun": {
    definition: "the process of recognizing and naming a person or thing",
    vietnamese: "sự nhận dạng, sự xác định danh tính",
    example: "The witness helped police with the identification of the suspect.",
  },
  "master-identify-verb": {
    vietnamese: "nhận dạng, xác định danh tính",
  },
  "master-ideology-noun": { topic: "society" },
  "master-idle-adjective": {
    vietnamese: "nhàn rỗi, không hoạt động",
    example: "The factory machines stood idle during the strike.",
    topic: "states",
  },
  "master-ignorance-noun": {
    vietnamese: "sự thiếu hiểu biết",
  },
  "master-immigrant-noun": {
    vietnamese: "người nhập cư",
    example: "Many immigrants settled in the city after the war.",
    topic: "society",
  },
  "master-imperative-noun": {
    example: "In the sentence 'Come here,' the verb is in the imperative.",
    topic: "language",
  },
  "master-implement-noun": {
    vietnamese: "dụng cụ, công cụ",
  },
  "master-implement-verb": { topic: "actions" },
  "master-implication-noun": {
    definition: "a possible effect or consequence of an action or decision",
    vietnamese: "hệ quả, hàm ý",
  },
  "master-import-verb": { topic: "business" },
  "master-impulse-noun": {
    definition: "a sudden strong desire to do something",
    vietnamese: "sự thôi thúc, ý muốn bộc phát",
  },
  "master-incentive-noun": {
    vietnamese: "động lực, sự khuyến khích",
    topic: "work",
  },
  "master-incur-verb": {
    definition: "to become subject to something unpleasant, such as a cost or penalty",
    example: "Late payments may incur additional charges.",
    topic: "money",
  },
  "master-independently-adverb": { topic: "actions" },
  "master-index-noun": { topic: "language" },
  "master-infant-noun": {
    vietnamese: "trẻ sơ sinh, em bé",
    topic: "family",
  },
  "master-infectious-adjective": {
    definition: "able to spread from one person, animal, or plant to another",
    vietnamese: "dễ lây, truyền nhiễm",
    topic: "health",
  },
  "master-inference-noun": {
    definition: "a conclusion reached from evidence and reasoning rather than direct observation",
  },
  "master-inflate-verb": {
    definition: "to fill something with air or gas so that it becomes larger",
  },
  "master-inflation-noun": {
    vietnamese: "lạm phát",
    topic: "money",
  },
  "master-influential-adjective": {
    definition: "having the power to affect people's ideas, actions, or decisions",
    example: "She became an influential figure in modern architecture.",
    topic: "society",
  },
  "master-informal-adjective": {
    example: "We held an informal discussion before the official meeting.",
  },
  "master-inhabit-verb": { topic: "places" },
  "master-initial-adjective": {
    definition: "happening or existing at the beginning",
    topic: "time",
  },
  "master-initiative-noun": {
    definition: "the ability to decide and act without waiting for someone else",
    vietnamese: "tính chủ động, sáng kiến",
    example: "She showed initiative by organizing the project herself.",
    topic: "skills",
  },
  "master-injection-noun": { topic: "health" },
  "master-innovation-noun": {
    vietnamese: "sự đổi mới, sáng kiến",
    topic: "technology",
  },
  "master-innovative-adjective": {
    example: "The company is known for its innovative product designs.",
    topic: "technology",
  },
  "master-input-noun": {
    definition: "information, ideas, or advice contributed to a project or decision",
    vietnamese: "ý kiến đóng góp, thông tin đầu vào",
  },
  "master-inspector-noun": {
    definition: "a person whose job is to check that rules or standards are followed",
    topic: "work",
  },
  "master-instantly-adverb": { topic: "time" },
  "master-instinct-noun": {
    example: "Birds have a strong instinct to protect their young.",
    topic: "nature",
  },
  "master-institution-noun": {
    vietnamese: "thể chế, thiết chế xã hội",
    topic: "society",
  },
  "master-insufficient-adjective": {
    example: "The available evidence was insufficient to prove the claim.",
  },
  "master-insult-verb": {
    example: "He apologized after insulting his colleague during the meeting.",
  },
  "master-integrate-verb": {
    definition: "to combine separate parts so that they form a complete whole",
    example: "The course integrates practical training with classroom study.",
  },
  "master-intellectual-adjective": { topic: "thinking" },
  "master-intellectual-noun": {
    example: "She was a respected intellectual who wrote about social change.",
  },
  "master-intent-adjective": { topic: "decision-making" },
  "master-interactive-adjective": {
    definition: "allowing people and a system to communicate with and respond to each other",
    vietnamese: "có tính tương tác",
    example: "The museum has an interactive display for children.",
    topic: "technology",
  },
  "master-interfere-verb": {
    definition: "to become involved in a situation and prevent it from developing normally",
    topic: "relationships",
  },
  "master-interior-noun": {
    example: "The interior of the building was recently renovated.",
  },
  "master-interpreter-noun": { topic: "work" },
  "master-intimate-adjective": {
    example: "They shared an intimate conversation over dinner.",
    topic: "relationships",
  },
  "master-invariably-adverb": { topic: "time" },
  "master-investigate-verb": {
    definition: "to examine a situation carefully in order to discover the facts",
    topic: "thinking",
  },
  "master-investigator-noun": {
    definition: "a person whose job is to discover facts about a crime or problem",
    example: "The investigator interviewed everyone who witnessed the accident.",
    topic: "work",
  },
  "master-investment-noun": { topic: "money" },
  "master-investor-noun": {
    example: "Several investors provided money for the new company.",
    topic: "money",
  },
  "master-invisible-adjective": {
    definition: "unable to be seen",
    vietnamese: "vô hình, không nhìn thấy được",
    example: "The gas is invisible but has a strong smell.",
    topic: "senses",
  },
  "master-invoke-verb": {
    definition: "to mention a law, rule, or authority in order to support an action",
    vietnamese: "viện dẫn, áp dụng",
    topic: "society",
  },
  "master-jam-verb": {
    definition: "to become stuck or make something become stuck",
    vietnamese: "làm kẹt, bị kẹt",
    example: "A sheet of paper jammed inside the printer.",
  },
  "master-jaw-noun": {
    definition: "either of the two bony parts of the mouth that hold the teeth",
    example: "He injured his jaw during the match.",
  },
  "master-joint-noun": {
    vietnamese: "khớp, chỗ nối",
    example: "She injured a joint in her knee while running.",
    topic: "body",
  },
  "master-journalism-noun": {
    example: "She studied journalism before becoming a news reporter.",
    topic: "communication",
  },
  "master-jump-noun": {
    vietnamese: "sự tăng vọt, mức tăng đột ngột",
    example: "The company reported a sharp jump in online sales.",
    topic: "change",
  },
  "master-keen-adjective": { topic: "emotions" },
  "master-label-noun": { topic: "objects" },
  "master-lack-verb": {
    definition: "to not have something or not have enough of it",
  },
  "master-lap-noun": {
    definition: "the area formed by your upper legs when you are sitting down",
    vietnamese: "lòng",
    example: "The tired child fell asleep on his mother's lap.",
  },
  "master-laptop-noun": { topic: "technology" },
  "master-laser-noun": {
    definition: "a device that produces a narrow, powerful beam of light",
    vietnamese: "tia laser, thiết bị laser",
    example: "The surgeon used a laser during the operation.",
    topic: "technology",
  },
  "master-latter-adjective": {
    definition: "nearer the end of a period, or the second of two things mentioned",
    vietnamese: "sau, cuối, thứ hai trong hai điều",
    topic: "time",
  },
  "master-lawn-noun": {
    vietnamese: "bãi cỏ, thảm cỏ",
    topic: "home",
  },
  "master-lawsuit-noun": {
    example: "The customer filed a lawsuit against the company.",
    topic: "society",
  },
  "master-leaflet-noun": {
    definition: "a small sheet or folded piece of paper that gives information",
    vietnamese: "tờ rơi, tờ thông tin",
    topic: "communication",
  },
  "master-leak-noun": { topic: "objects" },
  "master-leak-verb": { topic: "change" },
  "master-leap-noun": { topic: "movement" },
  "master-lease-noun": {
    example: "We signed a two-year lease on the apartment.",
    topic: "business",
  },
  "master-lecturer-noun": {
    vietnamese: "giảng viên",
    topic: "education",
  },
  "master-legend-noun": {
    example: "According to legend, a dragon once lived beneath the mountain.",
    topic: "culture",
  },
  "master-legendary-adjective": { topic: "culture" },
  "master-legislation-noun": {
    vietnamese: "pháp luật, đạo luật",
    topic: "society",
  },
  "master-legislative-adjective": {
    example: "The committee has legislative authority over tax policy.",
    topic: "society",
  },
  "master-legislature-noun": {
    example: "The state legislature approved the new education law.",
  },
  "master-legitimate-adjective": {
    definition: "allowed by law or based on a reasonable and acceptable claim",
    example: "The court recognized the group as a legitimate organization.",
    topic: "society",
  },
  "master-level-verb": {
    definition: "to direct criticism, blame, or an accusation at someone",
    vietnamese: "chĩa vào, nhắm vào",
    example: "Several officials leveled criticism at the proposed policy.",
    topic: "communication",
  },
  "master-liberal-adjective": { topic: "society" },
  "master-lifetime-noun": {
    example: "The artist produced hundreds of paintings during her lifetime.",
  },
  "master-limb-noun": {
    vietnamese: "chi, tay hoặc chân",
    example: "The accident damaged a nerve in his left limb.",
  },
  "master-line-verb": {
    definition: "to arrange or position something in a straight line",
    vietnamese: "xếp thẳng, căn thẳng hàng",
  },
  "master-listener-noun": {
    example: "A good listener pays attention without interrupting.",
    topic: "communication",
  },
  "master-litter-noun": {
    example: "Volunteers collected litter from the beach.",
    topic: "environment",
  },
  "master-load-verb": {
    definition: "to put goods or materials onto a vehicle or into a container",
  },
  "master-loan-noun": {
    vietnamese: "khoản vay, tiền vay",
  },
  "master-lobby-noun": {
    vietnamese: "sảnh, tiền sảnh",
    topic: "places",
  },
  "master-lucrative-adjective": { topic: "money" },
  "master-major-noun": {
    vietnamese: "chuyên ngành chính",
    topic: "education",
  },
  "master-make-noun": {
    definition: "the brand or manufacturer of a product",
    vietnamese: "nhãn hiệu, hãng sản xuất",
    example: "What make of car is that?",
    topic: "business",
  },
  "master-manipulate-verb": {
    definition: "to control or handle something skillfully, sometimes unfairly",
    vietnamese: "điều khiển, thao tác, thao túng",
    topic: "actions",
  },
  "master-manual-adjective": {
    vietnamese: "thủ công, bằng tay",
    topic: "work",
  },
  "master-manual-noun": {
    vietnamese: "sách hướng dẫn, sổ tay",
    example: "I need to fix the printer, but I cannot find the manual.",
    topic: "technology",
  },
  "master-manufacture-noun": { topic: "work" },
  "master-manufacturer-noun": {
    example: "The manufacturer recalled the product after a safety test.",
    topic: "business",
  },
  "master-margin-noun": {
    example: "She wrote a short note in the margin.",
    topic: "language",
  },
  "master-mask-noun": {
    vietnamese: "mặt nạ, khẩu trang",
    topic: "health",
  },
  "master-mass-noun": { topic: "science" },
  "master-master-noun": {
    definition: "a person with exceptional skill in a particular activity",
    vietnamese: "bậc thầy, người tinh thông",
    example: "She is a master of the violin.",
    topic: "skills",
  },
  "master-mate-noun": {
    example: "My roommate helped me carry the boxes.",
    topic: "relationships",
  },
  "master-mathematical-adjective": { topic: "science" },
  "master-mean-noun": {
    vietnamese: "số trung bình, trung bình cộng",
    topic: "science",
  },
  "master-medication-noun": { topic: "health" },
  "master-memorial-noun": { topic: "history" },
  "master-mentor-noun": { topic: "education" },
  "master-merchandise-noun": { topic: "business" },
  "master-merger-noun": {
    definition: "the process of combining two or more organizations into one",
    topic: "business",
  },
  "master-mess-verb": {
    definition: "to make something untidy or spoil a situation",
    vietnamese: "làm lộn xộn, làm hỏng",
    example: "Please do not mess up the documents on my desk.",
    topic: "actions",
  },
  "master-messenger-noun": { topic: "communication" },
  "master-metaphor-noun": { topic: "language" },
  "master-metric-adjective": {
    definition: "relating to the system of measurement based on meters and kilograms",
    vietnamese: "thuộc hệ mét",
    example: "Most countries use the metric system.",
    topic: "science",
  },
  "master-microphone-noun": { topic: "technology" },
  "master-migration-noun": { topic: "nature" },
  "master-mine-noun": {
    example: "The region once had a large coal mine.",
    topic: "materials",
  },
  "master-minister-noun": { topic: "society" },
  "master-missile-noun": {
    vietnamese: "tên lửa, đạn tên lửa",
    topic: "safety",
  },
  "master-mix-noun": { topic: "materials" },
  "master-mixture-noun": {
    example: "The bowl contained a mixture of rice and vegetables.",
  },
  "master-mobility-noun": {
    example: "Regular exercise improved her mobility after the operation.",
    topic: "movement",
  },
  "master-mock-adjective": {
    definition: "not real, but made to look or act like the real thing",
    vietnamese: "giả, mô phỏng",
    example: "Students took part in a mock election at school.",
  },
  "master-modest-adjective": {
    example: "They live in a modest apartment near the station.",
  },
  "master-modification-noun": { topic: "change" },
  "master-moral-adjective": {
    example: "She believed she had a moral duty to tell the truth.",
    topic: "society",
  },
  "master-morality-noun": {
    definition: "principles and beliefs about what behavior is right or wrong",
    example: "The novel raises difficult questions about morality and justice.",
    topic: "society",
  },
  "master-mortgage-noun": {
    vietnamese: "khoản vay thế chấp",
  },
  "master-motion-noun": { topic: "movement" },
  "master-mount-verb": {
    definition: "to climb onto a horse, bicycle, or other object",
  },
  "master-multiple-adjective": { topic: "quantity" },
  "master-multiply-verb": { topic: "science" },
  "master-musical-noun": {
    vietnamese: "nhạc kịch",
    topic: "arts",
  },
  "master-nationwide-adjective": { topic: "society" },
  "master-nationwide-adverb": { topic: "places" },
  "master-naval-adjective": { topic: "society" },
  "master-navy-noun": {
    vietnamese: "màu xanh hải quân, xanh đậm",
  },
  "master-necessity-noun": {
    definition: "something that is needed or must be done",
    example: "Clean drinking water is a basic necessity.",
  },
  "master-need-noun": { topic: "states" },
  "master-neglect-noun": {
    vietnamese: "sự sao nhãng, sự bỏ bê",
    example: "Years of neglect left the building in poor condition.",
  },
  "master-neither-conjunction": {
    vietnamese: "cả hai đều không",
  },
  "master-nicely-adverb": {
    example: "The newly painted walls match the furniture nicely.",
    topic: "description",
  },
  "master-nightmare-noun": {
    example: "She woke suddenly after having a terrible nightmare.",
    topic: "emotions",
  },
  "master-nomination-noun": {
    definition: "the act of officially suggesting someone for a position or award",
    vietnamese: "sự đề cử",
    example: "Her performance earned her a nomination for best actress.",
    topic: "society",
  },
  "master-nominee-noun": {
    definition: "a person who has been officially suggested for a position or award",
    vietnamese: "người được đề cử, ứng viên",
    example: "Each nominee gave a short speech before the vote.",
    topic: "society",
  },
  "master-numerical-adjective": {
    definition: "relating to or expressed in numbers",
    vietnamese: "thuộc số, bằng số",
    topic: "science",
  },
  "master-nursery-noun": {
    definition: "a place where young children are cared for during the day",
    vietnamese: "nhà trẻ, lớp giữ trẻ",
    topic: "education",
  },
  "master-nut-noun": {
    definition: "a dry fruit or seed with a hard shell that can often be eaten",
    vietnamese: "hạt, quả hạch",
    topic: "food",
  },
  "master-object-verb": {
    definition: "to express disagreement with or opposition to something",
  },
  "master-obligation-noun": { topic: "society" },
  "master-observer-noun": {
    example: "Independent observers monitored the election closely.",
  },
  "master-obsession-noun": { topic: "emotions" },
  "master-odd-adjective": {
    vietnamese: "kỳ lạ, khác thường",
  },
  "master-offend-verb": {
    definition: "to make someone feel upset, hurt, or angry",
    example: "I did not mean to offend anyone with my comment.",
    topic: "relationships",
  },
  "master-offender-noun": { topic: "society" },
  "master-official-noun": { topic: "society" },
  "master-offshore-adjective": {
    definition: "located at sea away from the coast, or moving from land toward the sea",
    example: "Strong offshore winds delayed the rescue operation.",
    topic: "places",
  },
  "master-olive-noun": {
    vietnamese: "quả ô liu",
    topic: "food",
  },
  "master-openly-adverb": {
    definition: "in a direct and public way without hiding anything",
    example: "She openly criticized the decision during the meeting.",
  },
  "master-operator-noun": {
    definition: "a person whose job is to control a machine or system",
    vietnamese: "người vận hành, người điều khiển máy",
    topic: "work",
  },
  "master-opponent-noun": {
    definition: "a person or team that competes against another in a contest or argument",
    example: "She defeated her opponent in the final match.",
    topic: "sports",
  },
  "master-optimism-noun": {
    example: "Despite the setback, the team remained full of optimism.",
    topic: "emotions",
  },
  "master-optimistic-adjective": {
    vietnamese: "lạc quan",
    example: "He is optimistic that his plan will succeed.",
    topic: "emotions",
  },
  "master-oral-adjective": { topic: "language" },
  "master-originally-adverb": {
    definition: "at first or at the beginning",
    vietnamese: "ban đầu, lúc đầu",
    example: "The building was originally designed as a library.",
    topic: "time",
  },
  "master-originate-verb": {
    definition: "to begin, arise, or be created in a particular place or situation",
    topic: "change",
  },
  "master-outbreak-noun": {
    definition: "a sudden start of disease, violence, or another harmful event",
    vietnamese: "sự bùng phát, sự bùng nổ",
    example: "The city prepared for a possible outbreak of disease.",
  },
  "master-outfit-noun": {
    vietnamese: "bộ trang phục, quần áo",
    topic: "clothing",
  },
  "master-outline-noun": {
    example: "She drew the outline of the building in pencil.",
    topic: "arts",
  },
  "master-outlook-noun": {
    vietnamese: "quan điểm, cách nhìn, triển vọng",
  },
  "master-output-noun": {
    vietnamese: "sản lượng, đầu ra",
    topic: "work",
  },
  "master-outrage-noun": {
    definition: "an act or event that causes great shock and anger",
    vietnamese: "điều gây phẫn nộ, hành động tàn bạo",
    example: "The attack on the shelter was a public outrage.",
    topic: "society",
  },
  "master-outside-adjective": {
    example: "The outside wall needs a fresh coat of paint.",
  },
  "master-outside-noun": {
    example: "The door can only be opened from the outside.",
  },
  "master-overlook-verb": {
    definition: "to fail to notice something or understand its importance",
    vietnamese: "bỏ sót, không để ý",
    topic: "thinking",
  },
  "master-overseas-adjective": {
    example: "The company hopes to expand into overseas markets.",
    topic: "travel",
  },
  "master-overtime-adverb": { topic: "work" },
  "master-overtime-noun": {
    vietnamese: "hiệp phụ, thời gian thi đấu thêm",
    topic: "sports",
  },
  "master-panel-noun": {
    definition: "a group of people chosen to discuss, judge, or advise on something",
    vietnamese: "ban, hội đồng, nhóm chuyên gia",
    topic: "society",
  },
  "master-panic-verb": {
    vietnamese: "hoảng sợ, hoảng loạn",
    example: "Passengers began to panic when they smelled smoke.",
  },
  "master-paradox-noun": { topic: "thinking" },
  "master-partnership-noun": {
    vietnamese: "quan hệ đối tác, sự hợp tác",
    topic: "business",
  },
  "master-passionate-adjective": {
    example: "She gave a passionate speech about protecting wildlife.",
    topic: "emotions",
  },
  "master-pave-verb": { topic: "work" },
  "master-pavement-noun": {
    vietnamese: "vỉa hè, lối đi lát đá",
    example: "Pedestrians waited on the pavement beside the road.",
    topic: "places",
  },
  "master-payment-noun": { topic: "money" },
  "master-peak-noun": {
    definition: "the highest point or level reached by something",
    vietnamese: "đỉnh, mức cao nhất",
    topic: "change",
  },
  "master-penalty-noun": { topic: "society" },
  "master-penetrate-verb": {
    definition: "to enter or pass through something",
    topic: "movement",
  },
  "master-percentage-noun": { topic: "quantity" },
  "master-perception-noun": {
    definition: "the way someone understands or thinks about something",
    topic: "thinking",
  },
  "master-persist-verb": {
    example: "She persisted with the task despite repeated difficulties.",
    topic: "success",
  },
  "master-personnel-noun": {
    example: "All personnel must attend the safety training.",
    topic: "work",
  },
  "master-philosophical-adjective": {
    example: "The course examines several philosophical questions about freedom.",
    topic: "thinking",
  },
  "master-photograph-verb": { topic: "arts" },
  "master-physician-noun": { topic: "health" },
  "master-pi-noun": {
    definition: "the number representing the ratio of a circle's circumference to its diameter",
    vietnamese: "số pi",
    topic: "science",
  },
  "master-picture-verb": {
    vietnamese: "hình dung, tưởng tượng",
    example: "Picture yourself living beside a quiet lake.",
    topic: "thinking",
  },
  "master-pin-noun": {
    example: "She used a pin to hold the fabric in place.",
  },
  "master-pine-noun": {
    definition: "an evergreen tree with long, thin leaves called needles",
    vietnamese: "cây thông",
  },
  "master-pitch-noun": {
    vietnamese: "cú ném bóng",
    topic: "sports",
  },
  "master-pitch-verb": {
    definition: "to throw a ball toward a target",
    vietnamese: "ném bóng",
    example: "He pitched the ball across the field.",
    topic: "sports",
  },
  "master-plague-noun": { topic: "health" },
  "master-plead-verb": {
    vietnamese: "van xin, khẩn cầu, biện hộ",
    topic: "relationships",
  },
  "master-plot-noun": {
    vietnamese: "âm mưu, kế hoạch bí mật",
    topic: "society",
  },
  "master-poison-verb": { topic: "safety" },
  "master-polish-noun": {
    vietnamese: "chất đánh bóng",
    example: "She applied furniture polish to the wooden table.",
  },
  "master-politically-adverb": {
    example: "The issue remains politically sensitive.",
    topic: "society",
  },
  "master-pop-verb": { topic: "safety" },
  "master-popularity-noun": { topic: "society" },
  "master-portion-noun": { topic: "quantity" },
  "master-postpone-verb": { topic: "time" },
  "master-potential-adjective": {
    definition: "possible or likely to develop into something in the future",
    topic: "possibility",
  },
  "master-potentially-adverb": {
    vietnamese: "có khả năng, tiềm tàng",
    topic: "possibility",
  },
  "master-pound-verb": {
    vietnamese: "đập mạnh, nện",
  },
  "master-powder-verb": {
    definition: "to cover something with a fine powder",
    example: "Powder the cake with a little sugar before serving.",
    topic: "food",
  },
  "master-practically-adverb": {
    definition: "almost or very nearly",
    vietnamese: "gần như, hầu như",
  },
  "master-precede-verb": { topic: "time" },
  "master-precisely-adverb": {
    definition: "in an exact and accurate way",
    example: "The train arrived precisely at nine o'clock.",
    topic: "time",
  },
  "master-predictable-adjective": {
    example: "The film followed a predictable pattern from beginning to end.",
    topic: "possibility",
  },
  "master-predictor-noun": { topic: "prediction" },
  "master-preliminary-adjective": {
    example: "A preliminary investigation found no evidence of fraud.",
    topic: "planning",
  },
  "master-prescribe-verb": {
    definition: "to officially order a medicine or treatment for a patient",
    vietnamese: "kê đơn, chỉ định điều trị",
    example: "The doctor prescribed some tablets for the infection.",
    topic: "health",
  },
  "master-present-verb": {
    example: "She presented the results to the committee.",
    topic: "communication",
  },
  "master-presidency-noun": {
    example: "The economy grew steadily during her presidency.",
    topic: "society",
  },
  "master-presidential-adjective": {
    vietnamese: "thuộc tổng thống, thuộc chủ tịch",
    example: "The presidential election will take place in November.",
    topic: "society",
  },
  "master-presumably-adverb": { topic: "thinking" },
  "master-prevail-verb": {
    definition: "to be common or dominant, or to succeed in the end",
    vietnamese: "chiếm ưu thế, thắng thế",
    topic: "success",
  },
  "master-prevention-noun": { topic: "health" },
  "master-previously-adverb": { topic: "time" },
  "master-price-verb": { topic: "money" },
  "master-primary-adjective": {
    definition: "main, most important, or first in order",
    topic: "education",
  },
  "master-prime-adjective": {
    example: "The prime reason for the delay was a lack of funding.",
  },
  "master-principal-noun": { topic: "education" },
  "master-prior-adjective": {
    definition: "happening or existing before a particular time or event",
    topic: "time",
  },
  "master-privately-adverb": {
    definition: "away from public attention or without other people present",
    topic: "relationships",
  },
  "master-privilege-noun": { topic: "society" },
  "master-probable-adjective": {
    vietnamese: "có khả năng xảy ra, có lẽ đúng",
    topic: "possibility",
  },
  "master-probe-noun": {
    definition: "a thin medical instrument used to examine a wound or part of the body",
    example: "The doctor used a probe to examine the wound.",
    topic: "health",
  },
  "master-process-verb": { topic: "materials" },
  "master-professional-noun": { topic: "work" },
  "master-profile-noun": {
    definition: "a description of the main characteristics of a person or group",
    vietnamese: "hồ sơ, bản mô tả đặc điểm",
    topic: "society",
  },
  "master-profit-noun": {
    vietnamese: "lợi nhuận",
    example: "The company made a substantial profit last year.",
    topic: "money",
  },
  "master-profitable-adjective": { topic: "money" },
  "master-programmer-noun": {
    example: "The programmer fixed a serious error in the application.",
    topic: "technology",
  },
  "master-progress-verb": { topic: "change" },
  "master-prohibit-verb": { topic: "society" },
  "master-project-verb": {
    vietnamese: "dự đoán, ước tính",
    topic: "prediction",
  },
  "master-projection-noun": {
    vietnamese: "sự dự báo, số liệu dự kiến",
    example: "The latest projection shows that sales will rise next year.",
    topic: "prediction",
  },
  "master-prompt-noun": {
    vietnamese: "đề bài, lời gợi ý",
    topic: "education",
  },
  "master-prompt-verb": { topic: "communication" },
  "master-prosecute-verb": {
    definition: "to bring a criminal case against someone in a court of law",
    vietnamese: "truy tố, khởi tố",
    example: "The authorities decided to prosecute the company for fraud.",
  },
  "master-prospect-noun": {
    vietnamese: "triển vọng, khả năng xảy ra",
    topic: "possibility",
  },
  "master-prosper-verb": {
    definition: "to become successful, wealthy, or strong",
    example: "Local businesses began to prosper after tourism increased.",
    topic: "success",
  },
  "master-protest-verb": { topic: "society" },
  "master-province-noun": {
    example: "Canada has ten provinces and three territories.",
  },
  "master-provision-noun": { topic: "society" },
  "master-psychology-noun": { topic: "science" },
  "master-publication-noun": { topic: "communication" },
  "master-publicity-noun": {
    definition: "public attention or information used to promote someone or something",
    vietnamese: "sự chú ý của công chúng, hoạt động quảng bá",
    example: "The charity received extensive publicity after the event.",
  },
  "master-pulse-noun": { topic: "health" },
  "master-punch-noun": {
    example: "The boxer landed a powerful punch to his opponent's body.",
    topic: "safety",
  },
  "master-punch-verb": { topic: "safety" },
  "master-purchase-noun": { topic: "shopping" },
  "master-purchase-verb": { topic: "shopping" },
  "master-pursuit-noun": {
    definition: "the act of trying to achieve or obtain something over time",
    vietnamese: "sự theo đuổi, việc mưu cầu",
    example: "She moved abroad in pursuit of a better career.",
    topic: "success",
  },
  "master-qualification-noun": { topic: "work" },
  "master-quantify-verb": { topic: "science" },
  "master-query-noun": {
    example: "Please contact our office if you have a query.",
  },
  "master-question-verb": {
    vietnamese: "đặt nghi vấn, chất vấn",
    topic: "thinking",
  },
  "master-queue-verb": {
    vietnamese: "xếp hàng, nối đuôi nhau",
    example: "Customers queued outside the shop before it opened.",
  },
  "master-quiet-noun": {
    definition: "a state or period with little or no noise",
    example: "She enjoyed the quiet of the early morning.",
    topic: "sounds",
  },
  "master-quotation-noun": { topic: "language" },
  "master-racism-noun": {
    definition: "unfair treatment based on race, or the belief that some races are superior to others",
    example: "The campaign encourages students to speak out against racism.",
    topic: "society",
  },
  "master-radar-noun": {
    definition: "a system that uses radio waves to find the position and speed of aircraft, ships, and other objects",
    topic: "technology",
  },
  "master-radical-noun": { topic: "society" },
  "master-rally-noun": {
    definition: "a large public meeting held to support or oppose a political or social cause",
    vietnamese: "cuộc mít tinh, cuộc tập hợp công khai",
    example: "Thousands of people attended the rally for climate action.",
  },
  "master-ram-noun": {
    example: "The farmer kept the ram in a separate field.",
  },
  "master-range-verb": {
    vietnamese: "dao động, trải dài từ mức này đến mức khác",
    topic: "quantity",
  },
  "master-rape-noun": { topic: "safety" },
  "master-rate-verb": {
    vietnamese: "đánh giá, xếp hạng, ước lượng",
  },
  "master-reaction-noun": {
    vietnamese: "phản ứng",
  },
  "master-rear-adjective": {
    example: "Passengers entered through the rear door of the bus.",
  },
  "master-reasonably-adverb": {
    example: "The hotel was clean and reasonably priced.",
  },
  "master-rebel-verb": {
    definition: "to oppose or fight against authority, control, or accepted rules",
  },
  "master-recipe-noun": { topic: "food" },
  "master-reference-noun": {
    vietnamese: "sự nhắc đến, lời đề cập",
  },
  "master-reform-noun": { topic: "society" },
  "master-refugee-noun": {
    example: "The organization helps refugees find safe housing and work.",
  },
  "master-regime-noun": {
    example: "The new regime promised to hold elections within a year.",
  },
  "master-regret-noun": {
    vietnamese: "sự hối tiếc, sự nuối tiếc",
  },
  "master-regulate-verb": {
    definition: "to control an activity or process by using rules or laws",
    vietnamese: "quản lý, kiểm soát bằng quy định",
  },
  "master-rehearsal-noun": {
    vietnamese: "buổi tập dượt, buổi diễn tập",
    topic: "arts",
  },
  "master-reinforce-verb": {
    definition: "to make an idea, structure, or feeling stronger",
  },
  "master-reinforcement-noun": {
    definition: "something that makes an idea, structure, or feeling stronger",
    topic: "change",
  },
  "master-rejection-noun": {
    definition: "the act of refusing to accept, approve, or consider someone or something",
    topic: "communication",
  },
  "master-reluctant-adjective": { topic: "emotions" },
  "master-remark-noun": {
    vietnamese: "lời nhận xét, lời bình luận",
  },
  "master-remarkably-adverb": { topic: "description" },
  "master-reminder-noun": {
    definition: "something that makes you remember a person, event, or task",
    vietnamese: "lời nhắc, vật gợi nhớ",
    example: "I set a reminder on my phone for the appointment.",
  },
  "master-rental-noun": {
    definition: "something, especially a home or vehicle, that is rented",
    vietnamese: "nhà, xe hoặc đồ vật cho thuê",
  },
  "master-repertoire-noun": {
    definition: "all the works that a performer or group is prepared to perform",
    vietnamese: "vốn tiết mục biểu diễn",
    topic: "arts",
  },
  "master-repetition-noun": { topic: "language" },
  "master-replacement-noun": { topic: "change" },
  "master-reprint-noun": {
    example: "The publisher issued a reprint of the popular history book.",
  },
  "master-research-verb": { topic: "science" },
  "master-residence-noun": {
    vietnamese: "nơi ở, nhà ở",
    example: "The ambassador's official residence is near the city center.",
    topic: "places",
  },
  "master-resign-verb": { topic: "work" },
  "master-resignation-noun": {
    example: "The director announced her resignation at the meeting.",
    topic: "work",
  },
  "master-resistance-noun": {
    definition: "a force or action that opposes movement, change, or control",
    topic: "science",
  },
  "master-resolution-noun": {
    example: "The council passed a resolution to protect the historic building.",
  },
  "master-respiratory-adjective": {
    vietnamese: "thuộc hô hấp, liên quan đến đường thở",
    example: "Air pollution can cause serious respiratory problems.",
    topic: "health",
  },
  "master-restriction-noun": {
    definition: "a rule or condition that limits what someone can do",
    topic: "society",
  },
  "master-retailer-noun": {
    example: "The retailer sells its products online and in stores.",
    topic: "business",
  },
  "master-retirement-noun": { topic: "work" },
  "master-retreat-noun": {
    vietnamese: "nơi tĩnh dưỡng, nơi ẩn dật",
  },
  "master-retreat-verb": {
    example: "The troops retreated to a safer position.",
  },
  "master-retrieve-verb": {
    definition: "to find and bring back something that was lost or left somewhere",
  },
  "master-revelation-noun": {
    definition: "a surprising fact that becomes known, or the act of making it known",
    example: "The report contained new revelations about the company's finances.",
  },
  "master-revenge-noun": {
    example: "He wanted revenge on those who had betrayed him.",
    topic: "emotions",
  },
  "master-revenue-noun": {
    definition: "money that a business or government receives from its activities",
    vietnamese: "doanh thu, nguồn thu",
  },
  "master-revival-noun": { topic: "change" },
  "master-revolution-noun": {
    vietnamese: "cuộc cách mạng, sự thay đổi lớn",
    topic: "society",
  },
  "master-revolutionary-adjective": {
    example: "The laboratory developed a revolutionary new treatment.",
  },
  "master-reward-verb": {
    definition: "to give someone something in recognition of their effort or achievement",
    example: "The company rewarded the team for completing the project early.",
    topic: "success",
  },
  "master-rib-noun": { topic: "health" },
  "master-rider-noun": {
    vietnamese: "người cưỡi ngựa, người đi xe",
    example: "Every rider must wear a helmet on this course.",
  },
  "master-ridge-noun": {
    example: "We followed the narrow ridge to the mountain peak.",
  },
  "master-risk-verb": { topic: "safety" },
  "master-risky-adjective": { topic: "safety" },
  "master-ritual-noun": { topic: "culture" },
  "master-rival-noun": {
    definition: "a person or group competing with you for the same goal",
  },
  "master-roar-verb": {
    definition: "to make a very loud, deep sound, like a large animal",
    topic: "sounds",
  },
  "master-roast-adjective": {
    example: "We had roast chicken and vegetables for dinner.",
    topic: "food",
  },
  "master-round-verb": {
    definition: "to change a number to the nearest whole number or other convenient value",
    topic: "quantity",
  },
  "master-route-noun": {
    example: "This bus follows the quickest route to the airport.",
    topic: "travel",
  },
  "master-royalty-noun": {
    definition: "a payment made to an author, musician, or owner for each use or sale of their work",
    vietnamese: "tiền bản quyền, nhuận bút",
  },
  "master-rub-verb": {
    definition: "to press and move your hand or an object repeatedly over a surface",
    example: "She rubbed her hands together to warm them.",
  },
  "master-rural-adjective": {
    example: "Many rural communities depend on farming.",
    topic: "places",
  },
  "master-sack-verb": { topic: "work" },
  "master-safeguard-verb": {
    definition: "to protect someone or something from harm or damage",
    example: "The new rules safeguard workers against dangerous conditions.",
    topic: "safety",
  },
  "master-sail-verb": {
    definition: "to travel across water in a boat or ship",
    vietnamese: "đi thuyền, đi tàu",
    topic: "travel",
  },
  "master-satisfactory-adjective": {
    vietnamese: "đạt yêu cầu, thỏa đáng",
  },
  "master-say-noun": {
    vietnamese: "quyền phát biểu, tiếng nói trong quyết định",
    topic: "communication",
  },
  "master-scan-verb": {
    definition: "to examine something carefully or with an electronic device",
    vietnamese: "quét, xem xét kỹ",
    topic: "technology",
  },
  "master-scar-noun": { topic: "health" },
  "master-scarcely-adverb": {
    definition: "only just or almost not",
    vietnamese: "hầu như không, chỉ vừa mới",
    example: "I could scarcely hear her above the traffic noise.",
  },
  "master-scent-noun": { topic: "senses" },
  "master-schedule-verb": {
    definition: "to arrange for an event or activity to happen at a particular time",
    vietnamese: "lên lịch, sắp xếp thời gian",
    topic: "time",
  },
  "master-scheme-noun": {
    vietnamese: "kế hoạch, đề án, âm mưu",
  },
  "master-screen-verb": { topic: "health" },
  "master-seal-noun": { topic: "animals" },
  "master-seasonal-adjective": {
    example: "The farm hires seasonal workers during the harvest.",
    topic: "time",
  },
  "master-secondly-adverb": {
    definition: "used to introduce the second point in a list or argument",
    vietnamese: "thứ hai là, tiếp theo",
    example: "Secondly, we need to consider how much the plan will cost.",
  },
  "master-sector-noun": {
    vietnamese: "lĩnh vực, khu vực",
  },
  "master-segment-noun": {
    example: "She cut a short segment from the rope.",
    topic: "quantity",
  },
  "master-seldom-adverb": {
    example: "We seldom eat at restaurants during the week.",
    topic: "time",
  },
  "master-select-verb": {
    definition: "to carefully choose someone or something as the most suitable from a group",
  },
  "master-seller-noun": {
    definition: "a person or business that sells goods or services",
    vietnamese: "người bán, người bán hàng",
    topic: "business",
  },
  "master-seminar-noun": { topic: "education" },
  "master-senator-noun": {
    example: "The senator spoke in favor of the new education bill.",
    topic: "society",
  },
  "master-sentence-verb": { topic: "society" },
  "master-separately-adverb": {
    definition: "apart from other people or things, rather than together",
    vietnamese: "riêng biệt, tách riêng",
    topic: "description",
  },
  "master-sexual-adjective": {
    vietnamese: "thuộc tình dục, thuộc sinh dục",
    topic: "health",
  },
  "master-sexy-adjective": {
    vietnamese: "gợi cảm, quyến rũ",
    example: "She chose a stylish and sexy outfit for the show.",
  },
  "master-sharp-adverb": {
    definition: "suddenly and at a steep angle",
    vietnamese: "đột ngột, ngoặt gấp",
    topic: "movement",
  },
  "master-sharply-adverb": {
    definition: "suddenly and by a large amount",
    vietnamese: "mạnh, đột ngột, rõ rệt",
    example: "House prices fell sharply during the winter.",
    topic: "change",
  },
  "master-shatter-verb": {
    example: "The window shattered when the ball struck it.",
  },
  "master-shed-noun": { topic: "places" },
  "master-shell-verb": { topic: "safety" },
  "master-shield-noun": { topic: "safety" },
  "master-shift-noun": { topic: "change" },
  "master-shower-verb": {
    vietnamese: "tắm bằng vòi sen",
    topic: "health",
  },
  "master-shrink-noun": {
    vietnamese: "bác sĩ tâm thần, nhà trị liệu tâm lý",
    example: "He talked to a shrink about managing his anxiety.",
    topic: "health",
  },
  "master-shrug-verb": {
    definition: "to raise and lower your shoulders to show doubt, ignorance, or lack of interest",
    example: "She shrugged when I asked where the keys were.",
    topic: "communication",
  },
  "master-sigh-verb": { topic: "emotions" },
  "master-significantly-adverb": {
    vietnamese: "đáng kể, rõ rệt",
    topic: "quantity",
  },
  "master-sketch-verb": { topic: "arts" },
  "master-slam-verb": {
    definition: "to close or put something down with great force and a loud noise",
    example: "He slammed the door and walked away.",
  },
  "master-slap-noun": {
    example: "He felt a sharp slap across his cheek.",
    topic: "actions",
  },
  "master-slap-verb": {
    example: "She slapped the table to get everyone's attention.",
  },
  "master-slash-noun": {
    example: "The knife left a deep slash in the leather seat.",
    topic: "actions",
  },
  "master-smash-verb": {
    definition: "to break something into many small pieces with great force",
  },
  "master-snap-verb": {
    definition: "to break suddenly with a short, sharp sound",
    vietnamese: "gãy, bẻ gãy đánh rắc",
    topic: "change",
  },
  "master-sneeze-verb": {
    definition: "to suddenly force air out through your nose and mouth",
    vietnamese: "hắt hơi",
  },
  "master-sniff-verb": {
    example: "The dog sniffed the floor to look for food.",
  },
  "master-soak-noun": {
    example: "The beans need a long soak before cooking.",
  },
  "master-soar-verb": {
    example: "An eagle soared high above the valley.",
  },
  "master-soil-noun": {
    example: "Tomatoes grow well in rich, moist soil.",
  },
  "master-solar-adjective": {
    example: "The building generates electricity with solar panels.",
    topic: "science",
  },
  "master-solo-adjective": {
    definition: "done or performed by one person alone",
  },
  "master-solo-adverb": {
    example: "She traveled solo across South America.",
    topic: "description",
  },
  "master-solo-noun": {
    definition: "a piece of music performed by one person",
    topic: "arts",
  },
  "master-somewhat-adverb": { topic: "quantity" },
  "master-sort-verb": { topic: "actions" },
  "master-span-verb": {
    definition: "to extend across an area or continue for a period of time",
    vietnamese: "kéo dài, bao trùm, bắc qua",
    example: "Her teaching career spanned more than thirty years.",
    topic: "time",
  },
  "master-spare-adjective": {
    definition: "additional and available to use if needed",
  },
  "master-spare-verb": { topic: "time" },
  "master-spark-noun": { topic: "science" },
  "master-species-noun": {
    definition: "a group of living things that share characteristics and can reproduce with one another",
    example: "Scientists discovered a new species of frog in the forest.",
    topic: "science",
  },
  "master-specifically-adverb": {
    vietnamese: "một cách cụ thể, đặc biệt là",
  },
  "master-spectacle-noun": {
    example: "The fireworks created a magnificent spectacle above the harbor.",
    topic: "events",
  },
  "master-spite-noun": {
    definition: "a desire to hurt, annoy, or upset someone",
    vietnamese: "ác ý, sự hằn học",
  },
  "master-splash-noun": {
    definition: "a small amount of liquid that falls or is thrown through the air",
    vietnamese: "tia nước, sự bắn tóe",
  },
  "master-split-verb": { topic: "change" },
  "master-sponsor-verb": {
    definition: "to provide money for a person, event, or activity, often in exchange for advertising",
    topic: "business",
  },
  "master-spray-noun": {
    definition: "liquid sent through the air in many tiny drops",
    vietnamese: "tia phun, bụi nước",
    example: "A fine spray of seawater covered the deck.",
  },
  "master-spray-verb": {
    definition: "to send liquid through the air in many tiny drops",
  },
  "master-spreadsheet-noun": { topic: "technology" },
  "master-squash-noun": {
    vietnamese: "môn bóng quần",
    topic: "sports",
  },
  "master-squeeze-verb": {
    definition: "to press something firmly, especially with your hands",
  },
  "master-stab-verb": { topic: "safety" },
  "master-stability-noun": { topic: "states" },
  "master-stack-noun": {
    vietnamese: "chồng, đống",
    topic: "objects",
  },
  "master-stagger-noun": {
    example: "He walked with a stagger after getting off the boat.",
    topic: "movement",
  },
  "master-stain-verb": {
    definition: "to leave a dirty or discolored mark on something",
  },
  "master-stamp-verb": { topic: "actions" },
  "master-startle-verb": {
    definition: "to cause someone to feel sudden surprise or fear",
    topic: "emotions",
  },
  "master-starve-verb": {
    definition: "to suffer greatly or die because of not having enough food",
    topic: "health",
  },
  "master-statistics-noun": {
    definition: "numerical facts or data collected for analysis",
    vietnamese: "số liệu thống kê",
    topic: "quantity",
  },
  "master-stiff-adjective": {
    example: "My shoulders felt stiff after the long drive.",
  },
  "master-stitch-noun": {
    vietnamese: "mũi khâu, mũi đan, mũi thêu",
    topic: "health",
  },
  "master-stock-noun": {
    vietnamese: "hàng dự trữ, hàng tồn kho",
    example: "The shop ordered more stock before the holiday season.",
    topic: "business",
  },
  "master-strain-verb": { topic: "actions" },
  "master-strand-noun": {
    definition: "a single thin piece of thread, wire, hair, or similar material",
    topic: "objects",
  },
  "master-stress-verb": {
    definition: "to emphasize that something is especially important",
  },
  "master-stride-verb": {
    example: "She can stride confidently across the stage.",
  },
  "master-strip-verb": {
    definition: "to remove clothing or a covering from someone or something",
    vietnamese: "cởi bỏ, lột bỏ",
    example: "He stripped off his wet clothes and found a towel.",
    topic: "actions",
  },
  "master-strive-verb": {
    example: "We strive to provide every customer with excellent service.",
    topic: "success",
  },
  "master-stroke-noun": {
    vietnamese: "cơn đột quỵ, tai biến mạch máu não",
    example: "She is recovering in hospital after a stroke.",
    topic: "health",
  },
  "master-stroke-verb": {
    vietnamese: "vuốt, vuốt ve",
  },
  "master-substance-noun": {
    example: "The laboratory identified an unknown substance in the water.",
    topic: "materials",
  },
  "master-substitute-verb": { topic: "change" },
  "master-subtract-verb": {
    definition: "to take one number or amount away from another",
    topic: "quantity",
  },
  "master-suck-verb": {
    example: "The baby sucked milk from a bottle.",
  },
  "master-sue-verb": {
    definition: "to take legal action against someone or an organization",
    example: "The customer sued the company for damages.",
  },
  "master-sufficiently-adverb": {
    definition: "enough to meet a particular need or purpose",
    topic: "quantity",
  },
  "master-supervise-verb": { topic: "work" },
  "master-supervision-noun": {
    definition: "the act of watching and directing a person or activity",
    example: "Children may use the pool only under adult supervision.",
    topic: "work",
  },
  "master-supervisor-noun": {
    definition: "a person who directs and checks the work of others",
    topic: "work",
  },
  "master-supplier-noun": { topic: "business" },
  "master-supply-verb": { topic: "business" },
  "master-suppress-verb": { topic: "society" },
  "master-surge-noun": {
    vietnamese: "sự tăng vọt, sự dâng mạnh",
    example: "The hospital reported a surge in flu cases.",
    topic: "change",
  },
  "master-surrender-verb": {
    definition: "to stop fighting and accept defeat",
    vietnamese: "đầu hàng, chịu thua",
    example: "The soldiers surrendered after they ran out of supplies.",
    topic: "safety",
  },
  "master-surveillance-noun": {
    example: "The police kept the building under surveillance for several days.",
    topic: "safety",
  },
  "master-suspect-verb": {
    example: "I suspect that someone has changed the password.",
    topic: "thinking",
  },
  "master-suspend-verb": {
    definition: "to stop an activity or process temporarily",
    vietnamese: "đình chỉ, tạm ngừng",
  },
  "master-sweep-verb": {
    definition: "to clean a surface with a broom or brush",
    vietnamese: "quét, quét dọn",
  },
  "master-swing-noun": {
    definition: "a curving movement backward and forward or from side to side",
    topic: "movement",
  },
  "master-swing-verb": {
    example: "Players swing the bat with both hands.",
  },
  "master-syllable-noun": {
    example: "The word potato has three syllables: po, ta, and to.",
    topic: "language",
  },
  "master-tag-noun": {
    example: "The price tag was still attached to the shirt.",
    topic: "objects",
  },
  "master-tail-noun": {
    example: "The dog wagged its tail when it saw us.",
    topic: "animals",
  },
  "master-tap-verb": {
    definition: "to touch or hit something lightly and quickly",
    vietnamese: "chạm nhẹ, gõ nhẹ",
    topic: "technology",
  },
  "master-tease-verb": {
    example: "We are good friends and often tease each other.",
  },
  "master-technical-adjective": { topic: "technology" },
  "master-technically-adverb": {
    vietnamese: "xét về mặt kỹ thuật, nói một cách chính xác",
  },
  "master-telescope-noun": { topic: "science" },
  "master-temporarily-adverb": { topic: "time" },
  "master-temptation-noun": {
    definition: "a strong desire to do or have something, especially something unwise",
    vietnamese: "sự cám dỗ, điều hấp dẫn khó cưỡng",
    example: "She resisted the temptation to check her phone during class.",
  },
  "master-terrace-noun": { topic: "places" },
  "master-test-verb": { topic: "science" },
  "master-testify-verb": {
    vietnamese: "làm chứng, khai trước tòa",
    example: "Two witnesses testified at the trial.",
    topic: "society",
  },
  "master-testimony-noun": {
    definition: "a formal statement given as evidence in a court of law",
    vietnamese: "lời khai, lời chứng",
    topic: "society",
  },
  "master-theorist-noun": {
    definition: "a person who develops ideas or principles to explain a subject",
    example: "The political theorist wrote extensively about justice and freedom.",
    topic: "thinking",
  },
  "master-therapy-noun": { topic: "health" },
  "master-thereafter-adverb": { topic: "time" },
  "master-thesis-noun": { topic: "education" },
  "master-thirst-noun": {
    example: "Cold water finally satisfied his thirst.",
    topic: "health",
  },
  "master-thoroughly-adverb": { topic: "description" },
  "master-though-adverb": {
    definition: "used at the end of a statement to mean however",
  },
  "master-thread-noun": { topic: "materials" },
  "master-threaten-verb": {
    vietnamese: "đe dọa, hăm dọa",
    example: "The caller threatened to report the company unless it issued a refund.",
    topic: "safety",
  },
  "master-thrill-noun": {
    vietnamese: "sự phấn khích, cảm giác hồi hộp",
    topic: "emotions",
  },
  "master-tight-adverb": { topic: "description" },
  "master-time-verb": { topic: "time" },
  "master-tip-verb": {
    definition: "to move or cause something to move into a sloping position",
    vietnamese: "nghiêng, làm nghiêng, làm lật",
  },
  "master-tolerate-verb": {
    definition: "to accept or allow something unpleasant without opposing it",
    topic: "society",
  },
  "master-toll-noun": { topic: "money" },
  "master-tomb-noun": {
    example: "Archaeologists discovered an ancient tomb beneath the temple.",
    topic: "places",
  },
  "master-ton-noun": {
    example: "The truck carried five tons of sand.",
  },
  "master-torture-verb": {
    example: "International law prohibits officials from torturing prisoners.",
    topic: "safety",
  },
  "master-tough-adjective": {
    vietnamese: "khó khăn, khắc nghiệt",
  },
  "master-toxic-adjective": { topic: "safety" },
  "master-track-verb": {
    definition: "to follow or find someone or something by looking for signs or information",
    topic: "thinking",
  },
  "master-trade-verb": {
    definition: "to buy, sell, or exchange goods and services",
    example: "The two countries trade agricultural products with each other.",
    topic: "business",
  },
  "master-trader-noun": { topic: "business" },
  "master-trailer-noun": {
    definition: "a vehicle without an engine that is pulled behind another vehicle",
    vietnamese: "rơ-moóc, xe kéo",
    topic: "travel",
  },
  "master-trainee-noun": {
    vietnamese: "người tập sự, nhân viên đang được đào tạo",
    example: "Each trainee works with an experienced member of staff.",
    topic: "work",
  },
  "master-trainer-noun": {
    example: "The trainer showed the new employees how to use the equipment.",
    topic: "work",
  },
  "master-trait-noun": {
    example: "Patience is an important trait for a teacher.",
  },
  "master-transfer-noun": { topic: "change" },
  "master-transition-noun": { topic: "change" },
  "master-translation-noun": { topic: "language" },
  "master-translator-noun": {
    vietnamese: "biên dịch viên, người dịch văn bản",
    topic: "language",
  },
  "master-transmission-noun": { topic: "health" },
  "master-transmit-verb": {
    definition: "to send information, signals, energy, or disease from one place or person to another",
    topic: "technology",
  },
  "master-transport-verb": {
    definition: "to carry people or goods from one place to another",
    topic: "travel",
  },
  "master-treat-verb": {
    definition: "to behave toward someone in a particular way",
  },
  "master-treaty-noun": { topic: "society" },
  "master-trial-noun": { topic: "society" },
  "master-troop-noun": {
    vietnamese: "đội quân, đơn vị binh lính",
    example: "A troop of soldiers guarded the border crossing.",
  },
  "master-trunk-noun": {
    example: "The tree trunk was too wide for one person to reach around.",
  },
  "master-trust-noun": { topic: "emotions" },
  "master-tuition-noun": {
    vietnamese: "học phí",
    example: "She works part-time to help pay her college tuition.",
  },
  "master-tunnel-noun": { topic: "places" },
  "master-tutor-noun": {
    vietnamese: "gia sư, người dạy kèm",
    example: "Her math tutor helped her prepare for the exam.",
    topic: "education",
  },
  "master-ultimate-adjective": {
    definition: "final or most important after a series of events or actions",
  },
  "master-ultimately-adverb": { topic: "time" },
  "master-unacceptable-adjective": {
    example: "The committee found the level of risk unacceptable.",
  },
  "master-unchanged-adjective": {
    definition: "remaining the same and not becoming different",
  },
  "master-unconscious-adjective": {
    vietnamese: "bất tỉnh, mất ý thức",
    example: "The patient remained unconscious for several hours after the accident.",
    topic: "health",
  },
  "master-undergraduate-noun": {
    example: "She is an undergraduate studying chemistry at the university.",
    topic: "education",
  },
  "master-underground-adjective": { topic: "places" },
  "master-underground-adverb": { topic: "society" },
  "master-underneath-adverb": {
    example: "The label is attached underneath the box.",
    topic: "places",
  },
  "master-undoubtedly-adverb": {
    definition: "in a way that is certain and cannot reasonably be doubted",
    topic: "thinking",
  },
  "master-unfamiliar-adjective": {
    example: "The streets looked unfamiliar in the dark.",
  },
  "master-unpopular-adjective": {
    vietnamese: "không được ưa chuộng, không phổ biến",
    example: "The decision was deeply unpopular with local residents.",
  },
  "master-unwilling-adjective": { topic: "emotions" },
  "master-update-noun": {
    definition: "the most recent information about a situation",
    vietnamese: "bản cập nhật, thông tin mới nhất",
  },
  "master-upgrade-noun": { topic: "technology" },
  "master-upgrade-verb": {
    definition: "to improve something by replacing it with a newer or better version",
    topic: "technology",
  },
  "master-upset-verb": { topic: "emotions" },
  "master-urban-adjective": {
    definition: "related to a city or town",
    example: "The project will create more green spaces in urban areas.",
    topic: "places",
  },
  "master-urge-verb": {
    definition: "to strongly advise or encourage someone to do something",
  },
  "master-user-noun": {
    example: "Users can change their passwords in the settings menu.",
    topic: "technology",
  },
  "master-utility-noun": { topic: "society" },
  "master-utterly-adverb": {
    example: "The final result was utterly unexpected.",
    topic: "description",
  },
  "master-vaccine-noun": {
    vietnamese: "vắc-xin",
    topic: "health",
  },
  "master-value-verb": { topic: "money" },
  "master-vanish-verb": {
    vietnamese: "biến mất, tiêu tan",
    example: "The bird vanished into the thick fog.",
  },
  "master-variation-noun": { topic: "change" },
  "master-venture-noun": {
    definition: "a new project or business that involves some risk",
    topic: "business",
  },
  "master-venue-noun": {
    vietnamese: "địa điểm tổ chức",
    example: "The conference venue is close to the train station.",
  },
  "master-verbal-adjective": {
    example: "The two companies reached a verbal agreement.",
    topic: "language",
  },
  "master-verse-noun": { topic: "arts" },
  "master-verse-verb": { topic: "education" },
  "master-version-noun": {
    vietnamese: "phiên bản",
    topic: "technology",
  },
  "master-very-adjective": {
    example: "This is the very place where we first met.",
  },
  "master-veteran-noun": {
    example: "The veteran journalist has reported from more than thirty countries.",
  },
  "master-viewer-noun": {
    example: "Millions of television viewers watched the final episode.",
  },
  "master-violate-verb": { topic: "society" },
  "master-virtually-adverb": {
    vietnamese: "hầu như, gần như",
    topic: "quantity",
  },
  "master-vital-adjective": {
    definition: "extremely important or necessary for life or success",
    vietnamese: "thiết yếu, sống còn",
  },
  "master-vitamin-noun": {
    vietnamese: "sinh tố",
    topic: "health",
  },
  "master-volunteer-noun": {
    vietnamese: "tình nguyện viên, người làm việc tự nguyện",
    topic: "society",
  },
  "master-voter-noun": {
    example: "Voters will choose a new mayor next month.",
    topic: "society",
  },
  "master-wage-noun": {
    definition: "money paid to someone for the work they do, usually by the hour or week",
  },
  "master-wait-noun": {
    example: "We had a long wait at the station.",
  },
  "master-want-noun": { topic: "emotions" },
  "master-water-verb": { topic: "nature" },
  "master-wealthy-adjective": {
    example: "The wealthy family donated money to the hospital.",
    topic: "money",
  },
  "master-weave-noun": {
    definition: "the way in which threads are woven together in cloth",
    vietnamese: "kiểu dệt, cách dệt",
    topic: "materials",
  },
  "master-wed-verb": {
    definition: "to marry someone",
    example: "The couple plan to wed in the spring.",
  },
  "master-weed-noun": {
    example: "We pulled weeds from the vegetable garden.",
  },
  "master-welcome-noun": {
    vietnamese: "sự chào đón, sự tiếp đón ân cần",
    topic: "communication",
  },
  "master-welfare-noun": { topic: "society" },
  "master-western-adjective": { topic: "places" },
  "master-whip-verb": { topic: "safety" },
  "master-whistle-verb": { topic: "sounds" },
  "master-widen-verb": {
    definition: "to make or become wider",
  },
  "master-widow-noun": { topic: "family" },
  "master-width-noun": { topic: "quantity" },
  "master-win-noun": {
    definition: "a victory by an individual or team",
    topic: "success",
  },
  "master-wind-verb": {
    definition: "to wrap or twist something around an object",
    vietnamese: "quấn, cuộn",
    topic: "actions",
  },
  "master-wipe-verb": {
    definition: "to rub a surface with a cloth or hand to clean or dry it",
  },
  "master-wire-verb": { topic: "technology" },
  "master-withdraw-verb": {
    definition: "to remove or take back something from a place or situation",
    example: "You can withdraw cash from this machine.",
    topic: "change",
  },
  "master-withdrawal-noun": {
    vietnamese: "hội chứng cai thuốc, triệu chứng cai nghiện",
    example: "The clinic helps patients manage drug withdrawal safely.",
    topic: "health",
  },
  "master-worm-noun": {
    definition: "a small animal with a long, soft body and no legs",
  },
  "master-worsen-verb": {
    example: "Heavy rain could worsen the flooding overnight.",
  },
  "master-worship-noun": {
    definition: "the practice of showing respect and devotion to a god or higher power",
    example: "The law protects freedom of worship for all communities.",
    topic: "culture",
  },
  "master-wound-verb": {
    vietnamese: "làm bị thương, gây thương tích",
    topic: "safety",
  },
  "master-wreck-noun": {
    vietnamese: "xác tàu, xác xe, đống đổ nát",
  },
  "master-yield-verb": {
    vietnamese: "nhường đường, nhượng bộ",
    example: "Drivers must yield to pedestrians at the crossing.",
    topic: "safety",
  },
  "v29": { topic: "description" },
  "v30": {
    example: "She presented a clear and coherent argument.",
    topic: "argumentation",
  },
  "v118": { topic: "certainty" },
  "master-aboard-preposition": {
    example: "She stepped aboard the train before the doors closed.",
    topic: "travel",
  },
  "master-abound-verb": { topic: "quantity" },
  "master-accustomed-adjective": {
    definition: "familiar with something because you have experienced it often",
    example: "She is accustomed to working late during busy periods.",
    topic: "experience",
  },
  "master-acidic-adjective": { topic: "science" },
  "master-acoustic-adjective": { topic: "sounds" },
  "master-acoustically-adverb": {
    example: "The concert hall is acoustically suitable for chamber music.",
    topic: "sounds",
  },
  "master-acoustics-noun": { topic: "sounds" },
  "master-acutely-adverb": {
    example: "She was acutely aware of the risks involved.",
    topic: "emotions",
  },
  "master-adjoin-verb": { topic: "places" },
  "master-adrenaline-noun": { topic: "health" },
  "master-advantageous-adjective": { topic: "success" },
  "master-adversary-noun": {
    example: "The two former adversaries eventually agreed to negotiate.",
  },
  "master-advisory-adjective": {
    definition: "intended to give advice or make recommendations",
    vietnamese: "mang tính tư vấn, cố vấn",
    example: "The government formed an advisory committee on public health.",
  },
  "master-aesthetically-adverb": {
    definition: "in a way that relates to beauty or artistic appearance",
    example: "The new building is aesthetically pleasing and highly practical.",
    topic: "arts",
  },
  "master-agonize-verb": {
    definition: "to spend a long time worrying about a difficult decision",
  },
  "master-aimlessly-adverb": { topic: "movement" },
  "master-alignment-noun": {
    example: "The wheels need adjustment because they are out of alignment.",
  },
  "master-allege-verb": {
    definition: "to claim that someone has done something wrong without proving it",
  },
  "master-alleviate-verb": {
    definition: "to make pain, suffering, or a problem less severe",
    vietnamese: "làm nhẹ bớt, làm giảm bớt, làm dịu",
    topic: "health",
  },
  "master-altruism-noun": {
    example: "Her decision to donate anonymously was an act of altruism.",
    topic: "society",
  },
  "master-altruistic-adjective": {
    vietnamese: "vị tha, vì lợi ích của người khác",
    topic: "society",
  },
  "master-amateur-adjective": {
    definition: "done for enjoyment rather than as a paid profession",
  },
  "master-amateur-noun": {
    example: "The tournament is open to both professionals and amateurs.",
  },
  "master-amid-preposition": {
    vietnamese: "giữa, ở giữa, trong lúc",
  },
  "master-amplification-noun": {
    definition: "the process of making a sound or signal stronger",
    vietnamese: "sự khuếch đại",
    example: "The hall needs electronic amplification for large events.",
    topic: "sounds",
  },
  "master-amply-adverb": { topic: "quantity" },
  "master-anchor-verb": {
    definition: "to hold a boat or object firmly in place",
  },
  "master-animatedly-adverb": {
    definition: "in a lively and energetic way",
    vietnamese: "một cách sôi nổi, đầy hào hứng",
    example: "The students talked animatedly about their travel plans.",
  },
  "master-anthropologist-noun": {
    example: "The anthropologist spent years studying the island community.",
    topic: "science",
  },
  "master-anthropology-noun": { topic: "science" },
  "master-anticlimactic-adjective": {
    vietnamese: "gây hụt hẫng, không ấn tượng như mong đợi",
  },
  "master-antiquity-noun": {
    definition: "the distant past, especially the period of ancient civilizations",
    vietnamese: "thời cổ đại, thời xa xưa",
    example: "The temple contains works of art from antiquity.",
    topic: "history",
  },
  "master-appallingly-adverb": { topic: "description" },
  "master-appliance-noun": {
    definition: "an electrical device used in the home for a particular task",
    vietnamese: "thiết bị, đồ gia dụng",
    topic: "technology",
  },
  "master-apprehensive-adjective": { topic: "emotions" },
  "master-apprentice-noun": {
    example: "The apprentice learned how to repair clocks from a skilled craftsperson.",
    topic: "work",
  },
  "master-apprentice-verb": {
    definition: "to work for a skilled person in order to learn a trade",
    vietnamese: "học việc, học nghề",
    topic: "work",
  },
  "master-apprenticeship-noun": {
    vietnamese: "thời gian học việc, chương trình học nghề",
    example: "He completed a three-year apprenticeship as an electrician.",
    topic: "work",
  },
  "master-aquarium-noun": {
    vietnamese: "thủy cung, bể cá",
    topic: "places",
  },
  "master-artistically-adverb": {
    definition: "in a way that shows artistic skill or beauty",
    vietnamese: "một cách nghệ thuật, có tính thẩm mỹ",
    example: "The room was artistically decorated with local crafts.",
    topic: "arts",
  },
  "master-assertion-noun": {
    vietnamese: "lời khẳng định, sự quả quyết",
  },
  "master-astray-adverb": {
    example: "The misleading sign sent us astray.",
    topic: "movement",
  },
  "master-atmospheric-adjective": {
    vietnamese: "thuộc khí quyển, thuộc không khí",
    example: "Scientists recorded a rise in atmospheric pressure.",
    topic: "science",
  },
  "master-avid-adjective": {
    vietnamese: "say mê, nhiệt tình",
    example: "She is an avid reader of historical fiction.",
    topic: "emotions",
  },
  "master-awe-verb": {
    definition: "to fill someone with wonder, admiration, or respect",
    vietnamese: "làm kinh ngạc, khiến kính phục",
    example: "The scale of the ancient temple awed the visitors.",
  },
  "master-baldly-adverb": {
    definition: "directly and without adding unnecessary details",
  },
  "master-batter-noun": {
    example: "The batter hit the ball over the boundary.",
    topic: "sports",
  },
  "master-battered-adjective": {
    example: "He carried a battered old suitcase onto the train.",
  },
  "master-bearded-adjective": {
    example: "A bearded man opened the door.",
  },
  "master-beforehand-adverb": {
    vietnamese: "trước đó, từ trước",
    example: "Please tell us beforehand if you cannot attend.",
    topic: "time",
  },
  "master-believably-adverb": {
    definition: "in a way that seems true or realistic",
    example: "The actor portrayed the exhausted doctor believably.",
  },
  "master-benign-adjective": {
    example: "Tests confirmed that the tumor was benign.",
    topic: "health",
  },
  "master-benignly-adverb": {
    definition: "in a gentle or harmless way",
    vietnamese: "một cách hiền hòa, vô hại",
    example: "The old professor smiled benignly at the nervous student.",
    topic: "description",
  },
  "master-billiards-noun": {
    example: "They played billiards at the local club.",
    topic: "sports",
  },
  "master-blankness-noun": {
    vietnamese: "sự trống rỗng, trạng thái trống không",
  },
  "master-bliss-noun": { topic: "emotions" },
  "master-blister-noun": { topic: "health" },
  "master-blister-verb": { topic: "health" },
  "master-blithely-adverb": {
    definition: "in a way that shows a casual lack of concern",
    vietnamese: "một cách thản nhiên, vô tư",
  },
  "master-blockbuster-noun": {
    definition: "a film, book, or product that is extremely popular and successful",
    example: "The studio released its summer blockbuster in July.",
    topic: "arts",
  },
  "master-bloom-verb": { topic: "nature" },
  "master-brainwash-verb": {
    definition: "to pressure or manipulate someone into accepting particular beliefs",
    example: "The group tried to brainwash new members through constant propaganda.",
    topic: "society",
  },
  "master-brainwashing-noun": { topic: "society" },
  "master-bribe-noun": {
    definition: "money or a gift offered to persuade someone to act dishonestly",
    example: "The official was arrested for accepting a bribe.",
    topic: "society",
  },
  "master-bribe-verb": {
    definition: "to offer someone money or a gift to make them act dishonestly",
    example: "They attempted to bribe an official to approve the contract.",
    topic: "society",
  },
  "master-bribery-noun": { topic: "society" },
  "master-bubbly-adjective": {
    example: "The freshly poured sparkling water was pleasantly bubbly.",
    topic: "food",
  },
  "master-buffer-noun": { topic: "safety" },
  "master-buffoon-noun": {
    vietnamese: "gã hề thô lỗ, kẻ ngốc lố bịch",
  },
  "master-bulk-noun": { topic: "quantity" },
  "master-bulky-adjective": {
    example: "The bulky package was difficult to carry upstairs.",
  },
  "master-bureaucratic-adjective": {
    definition: "involving complicated official rules and administrative procedures",
    vietnamese: "quan liêu, thuộc bộ máy hành chính",
    topic: "society",
  },
  "master-bureaucratically-adverb": {
    definition: "in a way that involves excessive official rules and procedures",
    example: "The agency handled the simple request bureaucratically and slowly.",
    topic: "society",
  },
  "master-burst-noun": { topic: "events" },
  "master-bypass-verb": { topic: "movement" },
  "master-calorie-noun": {
    definition: "a unit used to measure the energy provided by food",
    example: "This snack contains about two hundred calories.",
    topic: "health",
  },
  "master-canoe-noun": { topic: "travel" },
  "master-carpenter-noun": { topic: "work" },
  "master-carpentry-noun": { topic: "work" },
  "master-carrier-noun": {
    definition: "a person or company that transports people, goods, or messages",
    example: "The carrier delivered the parcel the following morning.",
    topic: "travel",
  },
  "master-cavity-noun": {
    definition: "a hole in a tooth caused by decay",
    vietnamese: "lỗ sâu răng",
    topic: "health",
  },
  "master-ceaseless-adjective": {
    example: "The ceaseless noise from traffic made sleep difficult.",
    topic: "time",
  },
  "master-ceaselessly-adverb": {
    definition: "continuously and without stopping",
    example: "The rain fell ceaselessly throughout the night.",
    topic: "time",
  },
  "master-cessation-noun": {
    example: "Both sides called for an immediate cessation of hostilities.",
    topic: "change",
  },
  "master-charter-noun": {
    definition: "a formal document that establishes an organization and defines its rights",
    example: "The university received its royal charter in 1880.",
  },
  "master-charter-verb": {
    example: "The state chartered the new university in 1965.",
  },
  "master-chill-noun": {
    example: "A sudden chill made her pull her coat tighter.",
    topic: "health",
  },
  "master-chill-verb": {
    definition: "to make food or drink colder",
    vietnamese: "làm lạnh, ướp lạnh",
    example: "Chill the dessert for two hours before serving.",
  },
  "master-chisel-verb": { topic: "actions" },
  "master-churn-verb": {
    definition: "to stir a liquid quickly and repeatedly",
    vietnamese: "khuấy mạnh, đánh",
  },
  "master-circulation-noun": { topic: "movement" },
  "master-citation-noun": {
    definition: "a reference to a source of information in a piece of writing",
    example: "Every quotation in the article requires a citation.",
    topic: "academic",
  },
  "master-classy-adjective": {
    vietnamese: "sang trọng, thanh lịch",
    example: "The restaurant has a classy but relaxed atmosphere.",
  },
  "master-claustrophobia-noun": {
    vietnamese: "chứng sợ không gian kín",
    topic: "health",
  },
  "master-claustrophobic-adjective": {
    vietnamese: "sợ không gian kín, gây cảm giác ngột ngạt",
    example: "He felt claustrophobic inside the crowded lift.",
    topic: "health",
  },
  "master-cleanly-adverb": {
    definition: "in a smooth, neat, or precise way",
    topic: "description",
  },
  "master-clench-verb": {
    example: "He clenched the steering wheel with both hands.",
  },
  "master-climactic-adjective": {
    vietnamese: "thuộc cao trào, dẫn đến cao trào",
    example: "The film ends with a climactic battle.",
  },
  "master-climax-noun": {
    vietnamese: "cao trào, đỉnh điểm",
    example: "The concert reached its climax with the final song.",
  },
  "master-clinical-adjective": {
    vietnamese: "thuộc lâm sàng",
    topic: "health",
  },
  "master-cloak-noun": {
    vietnamese: "áo choàng không tay",
    example: "She wrapped a dark cloak around her shoulders.",
    topic: "clothing",
  },
  "master-closeness-noun": {
    example: "Their shared experience created a lasting closeness between them.",
    topic: "relationships",
  },
  "master-clutch-noun": { topic: "travel" },
  "master-clutch-verb": {
    definition: "to hold someone or something very tightly",
    vietnamese: "nắm chặt, ôm chặt",
  },
  "master-clutter-noun": {
    vietnamese: "đồ đạc bừa bộn, sự lộn xộn",
    example: "She cleared the clutter from her desk.",
    topic: "home",
  },
  "master-clutter-verb": {
    definition: "to fill a place with too many untidy things",
    vietnamese: "làm bừa bộn, làm lộn xộn",
    example: "Old boxes clutter the narrow hallway.",
    topic: "home",
  },
  "master-collaborate-verb": { topic: "work" },
  "master-collaboration-noun": {
    example: "The album was created through collaboration between several musicians.",
    topic: "work",
  },
  "master-collaborative-adjective": {
    definition: "involving two or more people working together",
    vietnamese: "mang tính cộng tác, hợp tác",
    topic: "work",
  },
  "master-collaborator-noun": {
    definition: "a person who works jointly with others on a project",
    topic: "work",
  },
  "master-commend-verb": {
    definition: "to praise someone publicly for something they have done",
    example: "The president commended the soldier for her bravery.",
  },
  "master-commendation-noun": {
    example: "The firefighter received a commendation for exceptional courage.",
    topic: "success",
  },
  "master-commercially-adverb": {
    definition: "in a way that relates to business or making a profit",
    topic: "business",
  },
  "master-commission-verb": { topic: "business" },
  "master-compel-verb": {
    definition: "to force someone to do something",
  },
  "master-compliance-noun": { topic: "society" },
  "master-complimentary-adjective": {
    example: "The reviewer was highly complimentary about her performance.",
    topic: "communication",
  },
  "master-comply-verb": {
    example: "All suppliers must comply with the new safety standards.",
  },
  "master-compulsion-noun": {
    vietnamese: "sự thôi thúc không thể cưỡng lại",
    topic: "emotions",
  },
  "master-con-noun": { topic: "comparison" },
  "master-con-verb": {
    definition: "to trick someone for personal gain",
    example: "The fraudster conned investors into funding a false scheme.",
  },
  "master-concerto-noun": {
    vietnamese: "bản concerto, bản hòa tấu khúc",
    example: "The pianist performed a concerto with the city orchestra.",
    topic: "arts",
  },
  "master-concur-verb": {
    definition: "to agree with an opinion or decision",
    vietnamese: "đồng ý, nhất trí",
    example: "Most experts concur with the report's conclusion.",
  },
  "master-conditionally-adverb": { topic: "certainty" },
  "master-confide-verb": {
    definition: "to tell someone a secret because you trust them",
    vietnamese: "tâm sự, thổ lộ riêng",
    topic: "relationships",
  },
  "master-confinement-noun": { topic: "safety" },
  "master-conform-verb": {
    definition: "to behave according to accepted rules or social expectations",
    topic: "society",
  },
  "master-conformity-noun": { topic: "society" },
  "master-conjure-verb": { topic: "arts" },
  "master-connoisseur-noun": {
    example: "The wine connoisseur identified the region from its aroma.",
    topic: "arts",
  },
  "master-conscientious-adjective": {
    vietnamese: "tận tâm, chu đáo, tỉ mỉ, có trách nhiệm",
    example: "She is a conscientious researcher who checks every source.",
    topic: "work",
  },
  "master-conscientiously-adverb": {
    definition: "in a careful and responsible way",
    topic: "description",
  },
  "master-conservatory-noun": {
    example: "Rare tropical plants grow in the glass conservatory.",
    topic: "places",
  },
  "master-conserve-verb": { topic: "environment" },
  "master-constraint-noun": { topic: "planning" },
  "master-consultancy-noun": {
    definition: "a company that gives expert advice to other organizations",
    vietnamese: "công ty tư vấn, dịch vụ tư vấn",
    example: "She joined a management consultancy after graduation.",
    topic: "business",
  },
  "master-contest-verb": {
    definition: "to challenge the truth or validity of a decision or result",
    topic: "society",
  },
  "master-contextual-adjective": {
    vietnamese: "thuộc ngữ cảnh, phụ thuộc vào bối cảnh",
    example: "Readers need contextual information to understand the reference.",
    topic: "language",
  },
  "master-contextually-adverb": {
    vietnamese: "theo ngữ cảnh, trong bối cảnh cụ thể",
    topic: "language",
  },
  "master-contractor-noun": {
    example: "The contractor completed the roof repairs on schedule.",
    topic: "work",
  },
  "master-convict-noun": {
    example: "The former convict found work after leaving prison.",
    topic: "society",
  },
  "master-convict-verb": { topic: "society" },
  "master-conviction-noun": { topic: "society" },
  "master-convoluted-adjective": {
    definition: "extremely complicated and difficult to follow",
    vietnamese: "phức tạp, rắc rối",
  },
  "master-corps-noun": {
    example: "The medical corps established a field hospital nearby.",
  },
  "master-cost-effective-adjective": { topic: "money" },
  "master-coverage-noun": {
    definition: "financial protection provided by an insurance policy",
    vietnamese: "phạm vi bảo hiểm, mức bảo hiểm",
    example: "The policy provides coverage for accidental damage.",
  },
  "master-craft-verb": {
    example: "The artisan can craft a detailed model from a block of wood.",
  },
  "master-crave-verb": {
    definition: "to have a very strong desire for something",
    vietnamese: "thèm muốn, khao khát",
    topic: "emotions",
  },
  "master-creamy-adjective": {
    example: "The soup has a rich, creamy texture.",
    topic: "food",
  },
  "master-credential-noun": {
    example: "Applicants must provide a valid professional credential.",
    topic: "work",
  },
  "master-credibility-noun": {
    example: "The false claim seriously damaged the newspaper's credibility.",
  },
  "master-credibly-adverb": {
    definition: "in a way that seems believable or convincing",
  },
  "master-crudely-adverb": {
    definition: "in a rough, simple, or offensive way",
    example: "The shelter was crudely built from branches and sheets.",
    topic: "description",
  },
  "master-crumb-noun": {
    vietnamese: "mẩu vụn, mảnh vụn",
  },
  "master-crumble-verb": { topic: "change" },
  "master-cynic-noun": {
    vietnamese: "người hoài nghi, người yếm thế",
    example: "Even the old cynic was impressed by their generosity.",
  },
  "master-cynically-adverb": {
    vietnamese: "một cách hoài nghi, chua chát",
    example: "She cynically dismissed the promise as an election tactic.",
  },
  "master-cynicism-noun": {
    vietnamese: "sự hoài nghi, thái độ yếm thế",
  },
  "master-damply-adverb": {
    definition: "in a slightly wet or moist way",
    topic: "description",
  },
  "master-darkroom-noun": {
    example: "The photographer developed the film in a darkroom.",
    topic: "places",
  },
  "master-daunt-verb": {
    definition: "to make someone feel too afraid or discouraged to continue",
    vietnamese: "làm nản lòng, làm thoái chí",
    example: "The scale of the task did not daunt the research team.",
  },
  "master-daunting-adjective": {
    definition: "seeming very difficult and making you feel less confident",
    vietnamese: "đáng ngại, dễ làm nản lòng",
    example: "From the bottom of the hill, the climb looked daunting.",
  },
  "master-daydream-verb": { topic: "thinking" },
  "master-debut-noun": { topic: "events" },
  "master-debut-verb": { topic: "events" },
  "master-deceit-noun": { topic: "society" },
  "master-degradation-noun": {
    definition: "the process of becoming worse, weaker, or more damaged",
    vietnamese: "sự suy thoái, sự xuống cấp",
    example: "The report documents severe environmental degradation in the region.",
    topic: "change",
  },
  "master-degrade-verb": {
    definition: "to reduce the quality, condition, or value of something",
    vietnamese: "làm suy giảm, làm xuống cấp",
    example: "Repeated exposure to sunlight can degrade the material.",
  },
  "master-degrading-adjective": {
    vietnamese: "hạ nhục, làm mất phẩm giá",
    example: "Workers refused to accept the degrading treatment.",
  },
  "master-demise-noun": {
    example: "Poor management eventually led to the company's demise.",
    topic: "events",
  },
  "master-demo-noun": {
    vietnamese: "bản trình diễn, phiên bản dùng thử",
    topic: "technology",
  },
  "master-demographic-adjective": {
    example: "The survey revealed significant demographic changes in the region.",
    topic: "society",
  },
  "master-demographic-noun": { topic: "society" },
  "master-demography-noun": {
    example: "She studies the demography of rapidly growing cities.",
    topic: "science",
  },
  "master-dependent-noun": {
    example: "The tax allowance increases for each dependent in the household.",
    topic: "family",
  },
  "master-depict-verb": {
    vietnamese: "mô tả, khắc họa",
    topic: "arts",
  },
  "master-depiction-noun": {
    vietnamese: "sự mô tả, sự khắc họa",
    example: "The film offers a realistic depiction of village life.",
    topic: "arts",
  },
  "master-deprivation-noun": { topic: "health" },
  "master-descent-noun": { topic: "movement" },
  "master-desert-verb": { topic: "relationships" },
  "master-desertion-noun": { topic: "society" },
  "master-detestable-adjective": {
    example: "The court condemned his detestable treatment of the animals.",
    topic: "emotions",
  },
  "master-detriment-noun": {
    example: "She focused on work to the detriment of her health.",
    topic: "safety",
  },
  "master-detrimentally-adverb": {
    definition: "in a way that causes harm or damage",
    topic: "description",
  },
  "master-devotee-noun": {
    vietnamese: "người say mê, người hâm mộ nhiệt thành",
    example: "The festival attracts devotees of traditional jazz.",
  },
  "master-discard-verb": {
    vietnamese: "vứt bỏ, loại bỏ",
    example: "Please discard any damaged packaging before use.",
    topic: "actions",
  },
  "master-disdain-noun": {
    example: "She spoke with open disdain for the dishonest proposal.",
  },
  "master-disillusionment-noun": {
    definition: "disappointment caused by discovering that a belief was false",
    topic: "emotions",
  },
  "master-dislodge-verb": {
    definition: "to force or remove something from its fixed position",
  },
  "master-dismal-adjective": {
    definition: "causing sadness or showing little hope of success",
    example: "The team ended a dismal season with another defeat.",
  },
  "master-dismally-adverb": {
    definition: "in a very bad, sad, or unsuccessful way",
    example: "The new product performed dismally in its first year.",
    topic: "description",
  },
  "master-dismay-noun": {
    example: "To her dismay, the application was rejected.",
  },
  "master-dismay-verb": {
    definition: "to make someone feel shocked, disappointed, or worried",
    example: "The sudden increase in costs dismayed the organizers.",
  },
  "master-dispensary-noun": {
    example: "Patients collect their medicine from the hospital dispensary.",
    topic: "health",
  },
  "master-dispense-verb": { topic: "health" },
  "master-disquieting-adjective": {
    example: "The report revealed a disquieting rise in childhood poverty.",
  },
  "master-dissect-verb": {
    definition: "to cut apart a body or plant in order to study its structure",
    vietnamese: "mổ xẻ, giải phẫu",
    topic: "science",
  },
  "master-dissection-noun": {
    vietnamese: "sự mổ xẻ, sự giải phẫu",
    example: "The students observed the dissection in biology class.",
    topic: "science",
  },
  "master-dither-verb": {
    vietnamese: "do dự, lưỡng lự",
    example: "Stop dithering and make a decision.",
    topic: "decision-making",
  },
  "master-divergence-noun": {
    definition: "the process of moving or developing in different directions",
    topic: "change",
  },
  "master-divergent-adjective": {
    example: "The researchers offered two divergent interpretations of the evidence.",
  },
  "master-diversity-noun": {
    definition: "the state of including many different kinds of people or things",
    topic: "society",
  },
  "master-domestically-adverb": { topic: "society" },
  "master-domestication-noun": {
    vietnamese: "sự thuần hóa",
    topic: "history",
  },
  "master-domination-noun": { topic: "society" },
  "master-dramatist-noun": { topic: "arts" },
  "master-durable-adjective": {
    example: "The manufacturer uses durable materials for outdoor furniture.",
  },
  "master-duration-noun": {
    example: "The treatment continued for the duration of the winter.",
  },
  "master-dutiful-adjective": {
    example: "The dutiful assistant completed every task on time.",
  },
  "master-dutifully-adverb": { topic: "description" },
  "master-dynamically-adverb": {
    definition: "in an energetic, forceful, or changing way",
    topic: "description",
  },
  "master-eccentric-adjective": {
    definition: "unusual and slightly strange in behavior or appearance",
    example: "The eccentric inventor filled his garden with strange machines.",
  },
  "master-eccentric-noun": {
    example: "The local eccentric wore a top hat in every season.",
  },
  "master-eccentrically-adverb": { topic: "description" },
  "master-eclectic-adjective": {
    vietnamese: "pha trộn từ nhiều nguồn hoặc phong cách",
  },
  "master-ecstatically-adverb": {
    definition: "in a way that shows overwhelming happiness or excitement",
    topic: "emotions",
  },
  "master-effortless-adjective": {
    vietnamese: "dễ dàng, không tốn sức",
  },
  "master-elaborate-adjective": {
    definition: "very detailed, complicated, and carefully prepared",
    vietnamese: "cầu kỳ, công phu, chi tiết",
    example: "They prepared an elaborate plan for the ceremony.",
  },
  "master-elaboration-noun": {
    vietnamese: "sự giải thích chi tiết, sự phát triển thêm",
    example: "The proposal needs further elaboration before approval.",
    topic: "communication",
  },
  "master-elastic-adjective": {
    vietnamese: "co giãn, đàn hồi",
    example: "The elastic fabric stretches without losing its shape.",
    topic: "materials",
  },
  "master-elevate-verb": {
    definition: "to raise someone or something to a higher position or level",
    example: "The platform can elevate the equipment above the water.",
  },
  "master-elevation-noun": {
    vietnamese: "độ cao, cao độ",
    topic: "quantity",
  },
  "master-elongate-verb": {
    definition: "to make something longer",
    example: "The stretching process can elongate the fibers.",
  },
  "master-elusive-adjective": {
    vietnamese: "khó tìm, khó nắm bắt, khó đạt được",
  },
  "master-embark-verb": { topic: "travel" },
  "master-endorsement-noun": {
    definition: "public approval or support for a person, product, or idea",
    vietnamese: "sự ủng hộ, lời chứng thực quảng bá",
    topic: "business",
  },
  "master-engross-verb": {
    definition: "to absorb all of someone's attention or interest",
    vietnamese: "thu hút toàn bộ sự chú ý, làm mê mải",
  },
  "master-engrossing-adjective": {
    vietnamese: "hấp dẫn, cuốn hút",
  },
  "master-enormously-adverb": {
    vietnamese: "vô cùng, cực kỳ",
    topic: "description",
  },
  "master-enterprising-adjective": {
    vietnamese: "dám nghĩ dám làm, có óc sáng tạo",
    example: "An enterprising student created a successful tutoring service.",
  },
  "master-envisage-verb": {
    definition: "to imagine or expect something happening in the future",
    vietnamese: "hình dung, dự tính",
    example: "We envisage completing the project within two years.",
    topic: "thinking",
  },
  "master-estimation-noun": {
    definition: "an opinion or judgment about the value, size, or quality of something",
    topic: "thinking",
  },
  "master-ethically-adverb": {
    definition: "in a way that follows accepted moral principles",
    example: "The company promised to source its materials ethically.",
    topic: "society",
  },
  "master-ewe-noun": {
    definition: "an adult female sheep",
  },
  "master-exert-verb": {
    topic: "actions",
  },
  "master-exhaust-verb": {
    definition: "to use all of a supply until none remains",
    vietnamese: "dùng hết, làm cạn kiệt",
    example: "The long drought exhausted the town's water reserves.",
    topic: "quantity",
  },
  "master-exhibitionist-noun": {
    definition: "a person who behaves in a showy way to attract attention",
  },
  "master-exhilarate-verb": {
    definition: "to make someone feel very excited and happy",
    example: "The speed of the downhill ride exhilarated everyone.",
  },
  "master-exhilarating-adjective": {
    vietnamese: "gây phấn khích, làm hồ hởi",
    example: "The climb offered an exhilarating sense of achievement.",
  },
  "master-exodus-noun": {
    topic: "society",
  },
  "master-expedite-verb": {
    definition: "to make a process or action happen sooner",
    topic: "work",
  },
  "master-explanatory-adjective": {
    example: "The diagram includes explanatory notes for each stage.",
  },
  "master-exploitation-noun": {
    definition: "the use of people or resources for profit or advantage, often unfairly",
    vietnamese: "sự khai thác, sự lợi dụng",
    topic: "society",
  },
  "master-explosively-adverb": {
    topic: "change",
  },
  "master-exterior-noun": {
    definition: "the outside surface or appearance of something",
    example: "The building's exterior was restored to its original color.",
  },
  "master-extortion-noun": {
    definition: "the crime of obtaining money or property through threats or force",
    vietnamese: "sự tống tiền, sự cưỡng đoạt",
    example: "The official was arrested on charges of bribery and extortion.",
    topic: "safety",
  },
  "master-extravagance-noun": {
    topic: "money",
  },
  "master-exuberance-noun": {
    definition: "a quality of being full of energy, excitement, and happiness",
    vietnamese: "sự hồ hởi, sức sống tràn đầy",
  },
  "master-exuberantly-adverb": {
    definition: "in an energetic, excited, and cheerful way",
    vietnamese: "một cách hồ hởi, đầy sức sống",
    example: "The supporters celebrated exuberantly after the victory.",
    topic: "emotions",
  },
  "master-fabulously-adverb": {
    definition: "in an extremely good or impressive way",
    vietnamese: "tuyệt vời, cực kỳ",
    topic: "description",
  },
  "master-facial-adjective": {
    vietnamese: "thuộc về khuôn mặt",
    example: "The disease can cause temporary facial weakness.",
    topic: "body",
  },
  "master-facial-noun": {
    definition: "a beauty treatment that cleans and cares for the skin of the face",
  },
  "master-facilitation-noun": {
    definition: "the act of making a process or activity easier",
    example: "Skilled facilitation helped the group reach an agreement.",
    topic: "communication",
  },
  "master-fanatic-noun": {
    definition: "a person with excessive enthusiasm or devotion to a particular interest",
    example: "He is a fitness fanatic who exercises every morning.",
  },
  "master-fanatically-adverb": {
    definition: "with excessive enthusiasm or devotion",
    topic: "description",
  },
  "master-farce-noun": {
    definition: "a humorous play or situation involving unlikely events and exaggerated characters",
    vietnamese: "hài kịch tình huống, trò hề",
    example: "The attempted investigation quickly descended into a farce.",
    topic: "arts",
  },
  "master-fatality-noun": {
    definition: "a death caused by an accident, disaster, or violent event",
    vietnamese: "ca tử vong, người thiệt mạng",
    topic: "safety",
  },
  "master-fatigue-noun": {
    definition: "extreme physical or mental tiredness",
    example: "After hours of driving, she began to suffer from fatigue.",
    topic: "health",
  },
  "master-ferocious-adjective": {
    definition: "very fierce, violent, or frightening",
    example: "The hikers took shelter from the ferocious storm.",
  },
  "master-ferociously-adverb": {
    definition: "in a very fierce, violent, or intense way",
    example: "The dogs barked ferociously at the intruder.",
  },
  "master-fiddle-noun": {
    vietnamese: "đàn vĩ cầm, đàn fiddle",
    topic: "arts",
  },
  "master-fiddle-verb": {
    definition: "to waste time doing unimportant things",
    vietnamese: "lãng phí thời gian, loay hoay việc vặt",
    topic: "activities",
  },
  "master-fiddler-noun": {
    vietnamese: "nghệ sĩ chơi vĩ cầm",
  },
  "master-fiendish-adjective": {
    definition: "extremely cruel, evil, or difficult",
    example: "The villain devised a fiendish plan to trap his rivals.",
  },
  "master-fiendishly-adverb": {
    definition: "extremely, especially in a difficult or unpleasant way",
    topic: "description",
  },
  "master-fiercely-adverb": {
    definition: "in a strong, intense, or aggressive way",
    example: "The two companies competed fiercely for the contract.",
    topic: "description",
  },
  "master-firewall-noun": {
    definition: "a security system that controls network traffic and blocks unauthorized access",
    topic: "technology",
  },
  "master-fissure-noun": {
    topic: "nature",
  },
  "master-flashback-noun": {
    definition: "a sudden vivid memory of an event from the past",
    example: "The sound triggered a flashback to his childhood.",
    topic: "thinking",
  },
  "master-flask-noun": {
    vietnamese: "bình nhỏ, bình dẹt đựng đồ uống",
  },
  "master-flick-verb": {
    definition: "to move or hit something with a quick, light movement",
    example: "She flicked the dust from her sleeve.",
  },
  "master-flicker-noun": {
    example: "A faint flicker of candlelight appeared in the window.",
  },
  "master-flourish-noun": {
    definition: "a bold or showy gesture intended to attract attention",
    vietnamese: "động tác phô trương, nét trang trí cầu kỳ",
  },
  "master-folktale-noun": {
    topic: "culture",
  },
  "master-forensic-adjective": {
    definition: "relating to scientific methods used to investigate crimes",
    vietnamese: "thuộc pháp y, thuộc giám định hình sự",
    example: "Forensic experts examined the evidence from the scene.",
    topic: "science",
  },
  "master-formulate-verb": {
    topic: "thinking",
  },
  "master-fossil-noun": {
    example: "Scientists found a fish fossil embedded in the rock.",
    topic: "science",
  },
  "master-fraction-noun": {
    definition: "a small part of a whole or a number expressed as part of another number",
    vietnamese: "một phần nhỏ, phân số",
    topic: "quantity",
  },
  "master-fragmentation-noun": {
    definition: "the process of breaking or dividing into smaller separate parts",
    topic: "change",
  },
  "master-frost-verb": {
    topic: "nature",
  },
  "master-frosty-adjective": {
    example: "We woke to a clear and frosty morning.",
    topic: "weather",
  },
  "master-fuse-verb": {
    definition: "to melt or join separate things together into one",
    vietnamese: "làm nóng chảy, kết hợp",
  },
  "master-fusion-noun": {
    definition: "the process of joining two or more things to form a single whole",
    vietnamese: "sự hợp nhất, phản ứng nhiệt hạch",
    example: "Nuclear fusion releases an enormous amount of energy.",
    topic: "science",
  },
  "master-gadget-noun": {
    vietnamese: "thiết bị nhỏ hữu ích, đồ dùng tiện ích",
  },
  "master-gamely-adverb": {
    definition: "bravely and with determination despite difficulty",
    vietnamese: "một cách quả cảm, kiên cường",
    example: "She struggled gamely to finish the difficult race.",
    topic: "description",
  },
  "master-gape-verb": {
    definition: "to stare with the mouth open in surprise or wonder",
    vietnamese: "há hốc miệng, nhìn chằm chằm kinh ngạc",
    example: "Tourists gaped at the enormous statue.",
    topic: "actions",
  },
  "master-gem-noun": {
    definition: "a precious stone or a person or thing considered especially good",
    vietnamese: "viên ngọc, người hoặc vật quý giá",
    topic: "objects",
  },
  "master-genome-noun": {
    definition: "the complete set of genetic material in an organism",
    topic: "science",
  },
  "master-geological-adjective": {
    definition: "relating to the structure, materials, and history of the Earth",
    vietnamese: "thuộc địa chất",
    example: "The island contains several unusual geological formations.",
    topic: "science",
  },
  "master-geologically-adverb": {
    definition: "in a way that relates to the structure and history of the Earth",
    topic: "science",
  },
  "master-ghostly-adjective": {
    vietnamese: "ma quái, giống như ma",
  },
  "master-gig-noun": {
    topic: "arts",
  },
  "master-glean-verb": {
    vietnamese: "thu thập, chắt lọc",
    example: "We gleaned useful information from several old reports.",
    topic: "learning",
  },
  "master-glumly-adverb": {
    vietnamese: "một cách ủ rũ, rầu rĩ",
    topic: "emotions",
  },
  "master-gnaw-verb": {
    example: "The dog continued to gnaw the old bone.",
  },
  "master-gourmet-noun": {
    definition: "a person who knows a great deal about high-quality food and drink",
    example: "The restaurant attracts gourmets from across the region.",
  },
  "master-graft-verb": {
    definition: "to join living tissue from one plant or body to another",
    vietnamese: "ghép cây, ghép mô",
    topic: "science",
  },
  "master-grapefruit-noun": {
    definition: "a large citrus fruit with yellow skin and sharp-tasting flesh",
    vietnamese: "quả bưởi chùm, bưởi đắng",
    example: "She ate half a grapefruit for breakfast.",
    topic: "food",
  },
  "master-gruelling-adjective": {
    definition: "extremely tiring and requiring great effort",
    vietnamese: "gian khổ, làm kiệt sức",
  },
  "master-gruesome-adjective": {
    example: "The detective described the gruesome details of the crime.",
  },
  "master-gruesomely-adverb": {
    topic: "description",
  },
  "master-gushing-adjective": {
    definition: "flowing out quickly and in large amounts",
    example: "They struggled to stop the gushing water from the pipe.",
  },
  "master-gushingly-adverb": {
    definition: "with excessive enthusiasm, admiration, or praise",
    example: "The critic wrote gushingly about the young actor's performance.",
  },
  "master-gusto-noun": {
    vietnamese: "sự nhiệt tình, sự hăng hái",
  },
  "master-gutsy-adjective": {
    definition: "showing courage and determination in a difficult situation",
  },
  "master-hack-noun": {
    definition: "a person who produces poor-quality work, especially in a creative profession",
    vietnamese: "người làm nghề thiếu năng lực, kẻ viết thuê tồi",
  },
  "master-haggle-verb": {
    example: "I haggled over the price of the shoes.",
    topic: "shopping",
  },
  "master-hanging-noun": {
    definition: "the execution of a person by suspending them by the neck with a rope",
    vietnamese: "việc xử tử bằng cách treo cổ",
    example: "The country abolished hanging as a form of execution.",
    topic: "safety",
  },
  "master-harass-verb": {
    definition: "to repeatedly annoy, threaten, or trouble someone",
    vietnamese: "quấy rối, làm phiền liên tục",
    topic: "safety",
  },
  "master-harassment-noun": {
    definition: "repeated unwanted behavior that annoys, threatens, or upsets someone",
    example: "She reported the repeated messages as workplace harassment.",
    topic: "safety",
  },
  "master-harvest-verb": {
    definition: "to gather a crop when it is ready",
    vietnamese: "gặt hái, thu hoạch",
    topic: "nature",
  },
  "master-hedgehog-noun": {
    example: "A frightened hedgehog rolls into a ball to protect its belly.",
  },
  "master-heifer-noun": {
    example: "The young heifer grazed beside the older cattle.",
  },
  "master-heighten-verb": {
    vietnamese: "làm tăng, tăng cường",
  },
  "master-hence-adverb": {
    definition: "for this reason or as a result",
    vietnamese: "do đó, vì thế",
    topic: "language",
  },
  "master-hibernate-verb": {
    topic: "animals",
  },
  "master-hibernation-noun": {
    topic: "animals",
  },
  "master-homely-adjective": {
    vietnamese: "không hấp dẫn về ngoại hình, bình thường",
    example: "The character is described as homely but warm and generous.",
  },
  "master-honk-noun": {
    definition: "a loud sound made by a vehicle horn or a goose",
    vietnamese: "tiếng còi xe, tiếng ngỗng kêu",
    topic: "sounds",
  },
  "master-honk-verb": {
    vietnamese: "bấm còi, kêu quàng quạc",
    example: "The driver honked to warn the cyclist.",
    topic: "sounds",
  },
  "master-hostess-noun": {
    definition: "a woman who receives guests or welcomes customers at a venue",
    vietnamese: "nữ chủ nhà, nữ nhân viên đón khách",
    example: "The restaurant hostess showed us to our table.",
  },
  "master-hostile-adjective": {
    example: "The audience became openly hostile toward the speaker.",
  },
  "master-hostility-noun": {
    topic: "relationships",
  },
  "master-humble-verb": {
    definition: "to make someone feel less proud or less important",
    vietnamese: "làm bớt kiêu ngạo, hạ thấp",
  },
  "master-hypocrisy-noun": {
    definition: "behavior that contradicts the moral beliefs or standards a person claims to hold",
    vietnamese: "sự đạo đức giả",
    topic: "society",
  },
  "master-hypocritical-adjective": {
    example: "His hypocritical remarks contradicted his own behavior.",
  },
  "master-hypocritically-adverb": {
    topic: "description",
  },
  "master-immensely-adverb": {
    topic: "description",
  },
  "master-immortalize-verb": {
    definition: "to preserve someone's fame or memory for a very long time",
    topic: "arts",
  },
  "master-imp-noun": {
    topic: "culture",
  },
  "master-impede-verb": {
    definition: "to delay or prevent someone or something from making progress",
    example: "Heavy snow impeded the rescue team's progress.",
    topic: "problem-solving",
  },
  "master-impediment-noun": {
    topic: "problem-solving",
  },
  "master-impersonal-adjective": {
    definition: "lacking warmth, personal interest, or an individual character",
    vietnamese: "lạnh lùng, không mang tính cá nhân",
    example: "The automated reply felt cold and impersonal.",
  },
  "master-impersonally-adverb": {
    definition: "without warmth or personal interest",
    vietnamese: "một cách lạnh lùng, không mang tính cá nhân",
    topic: "description",
  },
  "master-impersonate-verb": {
    definition: "to pretend to be another person by copying their appearance or behavior",
    vietnamese: "giả mạo, đóng giả người khác",
    example: "The thief impersonated a supermarket employee.",
  },
  "master-impersonation-noun": {
    definition: "the act of pretending to be another person",
    vietnamese: "sự giả mạo, sự đóng giả người khác",
    example: "Her impersonation of the famous singer delighted the audience.",
  },
  "master-impersonator-noun": {
    definition: "a performer or deceiver who pretends to be another person",
    vietnamese: "người đóng giả, nghệ sĩ bắt chước",
    example: "The comedian is a skilled celebrity impersonator.",
  },
  "master-impervious-adjective": {
    example: "The outer layer is impervious to water.",
    topic: "materials",
  },
  "master-impish-adjective": {
    vietnamese: "tinh nghịch, lém lỉnh",
    example: "The child gave us an impish grin.",
  },
  "master-impishly-adverb": {
    definition: "in a playfully mischievous way",
    topic: "description",
  },
  "master-implicate-verb": {
    definition: "to show that someone was involved in a crime or wrongdoing",
    topic: "safety",
  },
  "master-impoverished-adjective": {
    topic: "society",
  },
  "master-incision-noun": {
    definition: "a surgical cut made in the skin or body tissue",
    vietnamese: "vết mổ, đường rạch",
    topic: "health",
  },
  "master-incisor-noun": {
    vietnamese: "răng cửa",
  },
  "master-inclusion-noun": {
    topic: "society",
  },
  "master-inclusive-adjective": {
    vietnamese: "bao trùm, tạo điều kiện hòa nhập",
    topic: "society",
  },
  "master-indefinite-adjective": {
    definition: "not clearly defined or having no fixed end",
    vietnamese: "không xác định, không rõ ràng",
    topic: "time",
  },
  "master-indefinitely-adverb": {
    vietnamese: "vô thời hạn, không xác định thời điểm kết thúc",
    topic: "time",
  },
  "master-individuality-noun": {
    definition: "the qualities that make a person or thing distinct from others",
    vietnamese: "cá tính, nét riêng biệt",
    example: "Her unusual clothing expresses her strong individuality.",
  },
  "master-induct-verb": {
    definition: "to formally admit someone into an organization or position",
    vietnamese: "kết nạp, làm lễ nhậm chức cho",
  },
  "master-induction-noun": {
    definition: "the formal admission of someone to a position or the introduction of a new employee",
    vietnamese: "lễ kết nạp, quá trình hướng dẫn ban đầu",
    example: "All new employees attend an induction on their first day.",
    topic: "work",
  },
  "master-inexcusably-adverb": {
    topic: "description",
  },
  "master-inexhaustible-adjective": {
    example: "The library offers an apparently inexhaustible supply of information.",
    topic: "quantity",
  },
  "master-inexplicable-adjective": {
    example: "The equipment failed for an inexplicable reason.",
  },
  "master-inexplicably-adverb": {
    definition: "in a way that is impossible to explain",
    topic: "description",
  },
  "master-ingenious-adjective": {
    vietnamese: "tài tình, sáng tạo",
    example: "The engineer devised an ingenious solution to the problem.",
  },
  "master-ingenuity-noun": {
    vietnamese: "sự khéo léo, óc sáng tạo",
  },
  "master-inherently-adverb": {
    definition: "as a natural, permanent, or essential quality",
    example: "No technology is inherently good or bad.",
    topic: "description",
  },
  "master-injustice-noun": {
    topic: "society",
  },
  "master-innovate-verb": {
    definition: "to introduce new ideas, methods, or products",
    vietnamese: "đổi mới, sáng tạo",
    example: "Small companies must innovate to remain competitive.",
    topic: "technology",
  },
  "master-insecure-adjective": {
    definition: "not firmly fixed, protected, or safe",
    example: "The workers replaced the insecure railing.",
    topic: "safety",
  },
  "master-insecurely-adverb": {
    definition: "in a way that shows a lack of confidence",
    vietnamese: "một cách thiếu tự tin, bất an",
    topic: "emotions",
  },
  "master-insensitive-adjective": {
    definition: "not caring about or noticing other people's feelings",
    vietnamese: "thiếu nhạy cảm, vô tâm",
    example: "His insensitive joke upset several colleagues.",
    topic: "relationships",
  },
  "master-insensitively-adverb": {
    definition: "without considering or caring about other people's feelings",
    vietnamese: "một cách thiếu nhạy cảm, vô tâm",
    topic: "relationships",
  },
  "master-insightful-adjective": {
    example: "The article offers an insightful analysis of the conflict.",
    topic: "thinking",
  },
  "master-instinctively-adverb": {
    topic: "description",
  },
  "master-institute-verb": {
    vietnamese: "thiết lập, ban hành",
  },
  "master-insubordinate-adjective": {
    example: "The employee was disciplined for insubordinate behavior.",
    topic: "work",
  },
  "master-insubordination-noun": {
    topic: "work",
  },
  "master-interject-verb": {
    definition: "to interrupt a conversation by inserting a remark",
  },
  "master-interjection-noun": {
    definition: "a short word or phrase that expresses a sudden feeling",
    example: "The word \"Yikes\" is an interjection expressing alarm.",
    topic: "language",
  },
  "master-intuitive-adjective": {
    definition: "based on feelings or instinct rather than conscious reasoning",
    vietnamese: "thuộc trực giác, theo bản năng",
    example: "She had an intuitive sense that something was wrong.",
    topic: "thinking",
  },
  "master-intuitively-adverb": {
    definition: "through instinct or feeling rather than conscious reasoning",
    example: "She intuitively understood what the frightened child needed.",
    topic: "thinking",
  },
  "master-invoice-noun": {
    topic: "business",
  },
  "master-irate-adjective": {
    example: "Irate customers demanded an immediate refund.",
    topic: "emotions",
  },
  "master-irately-adverb": {
    topic: "emotions",
  },
  "master-irony-noun": {
    topic: "communication",
  },
  "master-isolated-adjective": {
    topic: "places",
  },
  "master-itinerary-noun": {
    definition: "a detailed plan of a journey, including places and times",
    vietnamese: "lịch trình, hành trình",
    topic: "travel",
  },
  "master-jersey-noun": {
    definition: "a shirt worn by a member of a sports team",
    vietnamese: "áo thi đấu thể thao",
    topic: "clothing",
  },
  "master-jurisdiction-noun": {
    definition: "the legal authority to make decisions over a territory or particular cases",
    example: "The case falls under the jurisdiction of the federal court.",
    topic: "society",
  },
  "master-justly-adverb": {
    topic: "society",
  },
  "master-juvenile-adjective": {
    definition: "relating to young people or showing childish immaturity",
    vietnamese: "thuộc thanh thiếu niên, trẻ con",
    example: "The teacher refused to tolerate such juvenile behavior.",
  },
  "master-juvenile-noun": {
    definition: "a young person or animal that is not yet fully grown",
    vietnamese: "người vị thành niên, con non",
    example: "The rescued bird was still a juvenile.",
  },
  "master-landscape-verb": {
    vietnamese: "thiết kế, chăm sóc cảnh quan",
    example: "They landscaped the garden with native plants and stone paths.",
  },
  "master-lapse-noun": {
    definition: "a temporary failure in attention, judgment, or behavior",
    example: "A brief lapse in concentration caused the accident.",
  },
  "master-latent-adjective": {
    vietnamese: "tiềm ẩn, tiềm tàng",
    example: "The test revealed a latent defect in the material.",
  },
  "master-lavatory-noun": {
    example: "The lavatory is at the rear of the aircraft.",
    topic: "places",
  },
  "master-legacy-noun": {
    topic: "history",
  },
  "master-lethargic-adjective": {
    vietnamese: "uể oải, lờ đờ",
  },
  "master-lethargically-adverb": {
    topic: "description",
  },
  "master-lethargy-noun": {
    definition: "a state of having very little energy or enthusiasm",
    vietnamese: "trạng thái uể oải, sự thiếu sinh lực",
    topic: "health",
  },
  "master-liaison-noun": {
    definition: "communication and cooperation between people or groups",
    vietnamese: "sự liên lạc, sự phối hợp",
    example: "The officer maintained close liaison with local community leaders.",
  },
  "master-likelihood-noun": {
    vietnamese: "khả năng, xác suất",
    topic: "possibility",
  },
  "master-limitless-adjective": {
    definition: "having no limit in size, amount, or possibility",
    example: "Digital storage does not offer truly limitless capacity.",
  },
  "master-linearly-adverb": {
    definition: "in a straight line or a direct sequence",
    example: "The measured values increased linearly over time.",
    topic: "science",
  },
  "master-ludicrous-adjective": {
    example: "The committee rejected the ludicrous proposal immediately.",
  },
  "master-ludicrously-adverb": {
    topic: "description",
  },
  "master-lust-noun": {
    definition: "a very strong desire, especially for sex, power, or possessions",
  },
  "master-macabre-adjective": {
    definition: "disturbing because it concerns death or other gruesome events",
    example: "The museum displayed macabre paintings of war and plague.",
  },
  "master-magnetic-adjective": {
    vietnamese: "có từ tính, có sức hút",
    topic: "science",
  },
  "master-magnetically-adverb": {
    topic: "science",
  },
  "master-magnetism-noun": {
    definition: "the force by which certain materials attract or repel one another",
    vietnamese: "từ tính, hiện tượng từ",
    example: "The experiment demonstrates magnetism using two bar magnets.",
    topic: "science",
  },
  "master-malfunction-verb": {
    topic: "technology",
  },
  "master-manicure-noun": {
    definition: "a cosmetic treatment for the hands and fingernails",
    vietnamese: "việc chăm sóc móng tay",
    example: "She booked a manicure before the wedding.",
  },
  "master-manicure-verb": {
    example: "The beautician carefully manicured her fingernails.",
  },
  "master-manipulation-noun": {
    vietnamese: "sự thao túng, sự chi phối",
    topic: "society",
  },
  "master-marginal-adjective": {
    definition: "small in importance or relating to the effect of one additional unit",
    vietnamese: "không đáng kể, cận biên",
    topic: "business",
  },
  "master-marginally-adverb": {
    definition: "only slightly or by a small amount",
    topic: "description",
  },
  "master-marvel-verb": {
    example: "Visitors marveled at the skill of the ancient builders.",
    topic: "emotions",
  },
  "master-maternal-adjective": {
    definition: "relating to a mother or a mother's side of a family",
    vietnamese: "thuộc về mẹ, thuộc bên ngoại",
    example: "She inherited the tradition from her maternal grandmother.",
    topic: "family",
  },
  "master-meaningless-adjective": {
    definition: "having no meaning, purpose, or importance",
  },
  "master-mechanism-noun": {
    topic: "science",
  },
  "master-methodical-adjective": {
    example: "The researcher took a methodical approach to the investigation.",
  },
  "master-midwife-noun": {
    topic: "health",
  },
  "master-mingle-verb": {
    definition: "to mix or move among other people or things",
    example: "The dish mingles the cooking traditions of several countries.",
  },
  "master-misplace-verb": {
    definition: "to put something somewhere and then be unable to find it",
    vietnamese: "để thất lạc, để nhầm chỗ",
  },
  "master-monotonously-adverb": {
    topic: "description",
  },
  "master-motley-adjective": {
    definition: "made up of people or things that are very different from one another",
    vietnamese: "hỗn tạp, đủ loại",
    example: "A motley group of volunteers assembled outside the hall.",
  },
  "master-mountaineer-noun": {
    vietnamese: "nhà leo núi",
    topic: "sports",
  },
  "master-munch-verb": {
    definition: "to eat something steadily and often noisily",
    example: "The children munched on apples during the walk.",
  },
  "master-muscular-adjective": {
    definition: "having well-developed and powerful muscles",
    vietnamese: "có cơ bắp, lực lưỡng",
    example: "The muscular athlete lifted the heavy weight easily.",
    topic: "body",
  },
  "master-mutually-adverb": {
    definition: "in a way that is shared by or affects each side equally",
    topic: "relationships",
  },
  "master-mythological-adjective": {
    vietnamese: "thuộc thần thoại",
    topic: "culture",
  },
  "master-mythology-noun": {
    definition: "a collection of traditional stories about gods, heroes, or a culture's origins",
    vietnamese: "thần thoại, hệ thống thần thoại",
    example: "Tolkien invented a complex mythology for Middle-earth.",
    topic: "culture",
  },
  "master-naive-adjective": {
    example: "It was naive of him to trust the false offer.",
  },
  "master-naively-adverb": {
    topic: "description",
  },
  "master-naturalness-noun": {
    vietnamese: "vẻ tự nhiên, tính tự nhiên",
    example: "Critics praised the naturalness of her performance.",
  },
  "master-neglectful-adjective": {
    example: "Neglectful owners failed to provide the animals with clean water.",
    topic: "safety",
  },
  "master-negligent-adjective": {
    example: "The court found the company negligent in maintaining the equipment.",
    topic: "safety",
  },
  "master-negligently-adverb": {
    vietnamese: "một cách cẩu thả, lơ là",
    topic: "description",
  },
  "master-niche-noun": {
    topic: "business",
  },
  "master-nocturnal-adjective": {
    definition: "active mainly during the night",
    vietnamese: "hoạt động về đêm",
    example: "Owls are nocturnal birds that hunt after dark.",
    topic: "animals",
  },
  "master-nondescript-adjective": {
    example: "He wore a nondescript gray coat that attracted no attention.",
  },
  "master-numb-adjective": {
    topic: "body",
  },
  "master-obscure-adjective": {
    vietnamese: "khó hiểu, mơ hồ, ít được biết đến",
    example: "The instructions were obscure and difficult to follow.",
    topic: "language",
  },
  "master-obscure-verb": {
    definition: "to prevent something from being seen or understood clearly",
    vietnamese: "che khuất, làm khó hiểu",
    topic: "perception",
  },
  "master-obscurely-adverb": {
    definition: "in a way that is unclear or difficult to understand",
    vietnamese: "một cách mơ hồ, khó hiểu",
    topic: "language",
  },
  "master-occupant-noun": {
    vietnamese: "người cư ngụ, người sử dụng một chỗ",
    example: "The building's current occupant plans to move next month.",
  },
  "master-occupational-adjective": {
    definition: "relating to a person's job or profession",
    vietnamese: "thuộc nghề nghiệp, liên quan đến công việc",
    example: "Hearing loss is an occupational hazard for some factory workers.",
    topic: "work",
  },
  "master-offspring-noun": {
    definition: "a person's child or an animal's young",
    vietnamese: "con cái, con non",
    example: "The birds feed their offspring until they can fly.",
    topic: "family",
  },
  "master-orchard-noun": {
    topic: "nature",
  },
  "master-ordinarily-adverb": {
    topic: "description",
  },
  "master-organizational-adjective": {
    definition: "relating to the way an organization is arranged or managed",
    vietnamese: "thuộc tổ chức, thuộc cơ cấu tổ chức",
    example: "The merger required major organizational changes.",
    topic: "work",
  },
  "master-orphan-verb": {
    topic: "family",
  },
  "master-otter-noun": {
    definition: "a water-dwelling mammal with thick fur and webbed feet",
    example: "An otter floated on its back while eating a shellfish.",
  },
  "master-outset-noun": {
    definition: "the beginning of an event or process",
  },
  "master-oversee-verb": {
    definition: "to supervise a person, activity, or project",
    example: "A senior engineer will oversee the construction work.",
    topic: "work",
  },
  "master-overseer-noun": {
    definition: "a person who supervises workers or an activity",
    example: "The site overseer checked that everyone followed the safety rules.",
    topic: "work",
  },
  "master-pace-verb": {
    definition: "to walk back and forth, often because of worry or impatience",
  },
  "master-paddle-verb": {
    definition: "to move a small boat through water using a paddle",
    example: "We paddled the canoe across the calm lake.",
  },
  "master-panorama-noun": {
    definition: "a wide, complete view of a surrounding area",
    vietnamese: "toàn cảnh, quang cảnh rộng",
    example: "From the summit, we admired a panorama of the valley.",
    topic: "places",
  },
  "master-panoramic-adjective": {
    example: "The rooftop terrace offers panoramic views of the city.",
    topic: "places",
  },
  "master-parasite-noun": {
    definition: "an organism that lives on or inside another organism and takes nutrients from it",
    vietnamese: "sinh vật ký sinh, ký sinh trùng",
    example: "The tick is a parasite that feeds on its host's blood.",
    topic: "animals",
  },
  "master-paternal-adjective": {
    definition: "relating to a father or a father's side of a family",
    vietnamese: "thuộc về cha, thuộc bên nội",
    example: "Her paternal grandfather taught her to play chess.",
    topic: "family",
  },
  "master-paternalistic-adjective": {
    definition: "controlling people while claiming to act for their benefit",
    vietnamese: "mang tính gia trưởng, bao bọc nhưng kiểm soát",
    topic: "society",
  },
  "master-pathos-noun": {
    topic: "arts",
  },
  "master-paywall-noun": {
    topic: "technology",
  },
  "master-peacock-noun": {
    definition: "a large male bird with long, brightly colored tail feathers",
  },
  "master-peasant-noun": {
    example: "The novel follows a peasant family working a small farm.",
  },
  "master-pedicure-noun": {
    definition: "a cosmetic treatment for the feet and toenails",
    vietnamese: "việc chăm sóc móng chân",
    example: "She booked a pedicure at the salon.",
  },
  "master-pendulous-adjective": {
    example: "Pendulous branches hung low over the stream.",
  },
  "master-pendulum-noun": {
    example: "The clock's pendulum swung steadily from side to side.",
  },
  "master-peninsula-noun": {
    example: "The city lies on a peninsula surrounded by the sea.",
  },
  "master-perceptive-adjective": {
    definition: "quick to notice and understand things that are not obvious",
    vietnamese: "tinh ý, sâu sắc",
    example: "Her perceptive questions revealed the weakness in the proposal.",
    topic: "thinking",
  },
  "master-perceptively-adverb": {
    definition: "in a way that shows clear and sensitive understanding",
    vietnamese: "một cách tinh tế, sâu sắc",
    topic: "thinking",
  },
  "master-perpetuate-verb": {
    vietnamese: "duy trì, làm kéo dài",
    example: "Repeating the rumor will only perpetuate the misunderstanding.",
    topic: "society",
  },
  "master-persecute-verb": {
    definition: "to treat someone cruelly or unfairly because of their identity or beliefs",
    vietnamese: "đàn áp, truy hại",
    topic: "safety",
  },
  "master-persecution-noun": {
    topic: "society",
  },
  "master-persuasively-adverb": {
    definition: "in a way that successfully convinces someone",
    vietnamese: "một cách thuyết phục",
    example: "She argued persuasively for greater investment in education.",
  },
  "master-pertinent-adjective": {
    example: "The witness provided several details pertinent to the investigation.",
  },
  "master-phenomenal-adjective": {
    vietnamese: "phi thường, cực kỳ ấn tượng",
  },
  "master-phenomenally-adverb": {
    topic: "description",
  },
  "master-physicality-noun": {
    definition: "the physical strength, presence, or qualities of a person",
    vietnamese: "thể chất, sức mạnh thể chất",
    topic: "sports",
  },
  "master-physique-noun": {
    vietnamese: "vóc dáng, thể hình",
    topic: "body",
  },
  "master-pigeon-noun": {
    example: "A pigeon nested on the ledge outside our window.",
  },
  "master-pinnacle-noun": {
    definition: "the highest point of achievement or success",
    vietnamese: "đỉnh cao, tột đỉnh",
    topic: "success",
  },
  "master-pioneer-noun": {
    definition: "a person who is among the first to explore or develop a new area",
    vietnamese: "người tiên phong, người khai phá",
    example: "She was a pioneer in the field of computer programming.",
  },
  "master-pioneer-verb": {
    definition: "to be the first to develop or use a new method or field",
    vietnamese: "tiên phong, khai phá",
    example: "The laboratory pioneered a new form of treatment.",
    topic: "technology",
  },
  "master-placid-adjective": {
    definition: "calm, peaceful, and not easily disturbed",
    vietnamese: "yên bình, điềm tĩnh",
  },
  "master-placidly-adverb": {
    topic: "description",
  },
  "master-plague-verb": {
    definition: "to cause someone or something repeated trouble or suffering",
    vietnamese: "gây khổ sở, liên tục gây rắc rối",
    example: "Aircraft delays plagued the airport throughout the winter.",
    topic: "problem-solving",
  },
  "master-plaque-noun": {
    definition: "a flat sign bearing words that commemorate a person or event",
    vietnamese: "tấm biển, bảng kỷ niệm",
    example: "A bronze plaque marks the birthplace of the author.",
    topic: "objects",
  },
  "master-plausibility-noun": {
    definition: "the quality of seeming reasonable or likely to be true",
    topic: "thinking",
  },
  "master-plausible-adjective": {
    example: "She offered a plausible explanation for the delay.",
    topic: "thinking",
  },
  "master-plausibly-adverb": {
    definition: "in a way that seems reasonable or likely to be true",
    topic: "description",
  },
  "master-pleasurable-adjective": {
    example: "The warm bath was a deeply pleasurable experience.",
    topic: "emotions",
  },
  "master-ploy-noun": {
    definition: "a clever plan designed to gain an advantage, often by tricking someone",
    vietnamese: "mánh khóe, chiến thuật",
    example: "The discount was a marketing ploy to attract new customers.",
    topic: "thinking",
  },
  "master-plumbing-noun": {
    definition: "the system of pipes and fittings that carries water through a building",
    vietnamese: "hệ thống ống nước",
    example: "The old house needs extensive plumbing repairs.",
    topic: "home",
  },
  "master-plummet-verb": {
    topic: "change",
  },
  "master-plunge-noun": {
    example: "He took a plunge into the cold lake.",
  },
  "master-poise-noun": {
    definition: "calm confidence and self-control",
    vietnamese: "sự điềm tĩnh, sự tự chủ",
    topic: "emotions",
  },
  "master-popularization-noun": {
    definition: "the process of making something widely known, understood, or enjoyed",
    topic: "education",
  },
  "master-portable-noun": {
    definition: "a small device, such as a computer or radio, designed to be carried",
    vietnamese: "thiết bị xách tay",
    example: "He listened to the match on a battery-powered portable.",
  },
  "master-portray-verb": {
    definition: "to represent or describe someone or something in art, writing, or speech",
    vietnamese: "miêu tả, khắc họa",
    example: "The film portrays the scientist as a determined reformer.",
    topic: "arts",
  },
  "master-portrayal-noun": {
    definition: "the way someone or something is represented in art, writing, or media",
    vietnamese: "sự miêu tả, sự khắc họa",
    example: "Critics praised the actor's sensitive portrayal of the leader.",
    topic: "arts",
  },
  "master-pose-verb": {
    definition: "to present a question, problem, or threat for consideration",
    vietnamese: "đặt ra, nêu ra",
    topic: "communication",
  },
  "master-possessor-noun": {
    topic: "ownership",
  },
  "master-posture-noun": {
    topic: "body",
  },
  "master-preacher-noun": {
    definition: "a person who delivers religious sermons or publicly promotes a belief",
    example: "The preacher addressed the congregation on Sunday morning.",
  },
  "master-precision-noun": {
    example: "The component was manufactured with remarkable precision.",
    topic: "science",
  },
  "master-predecessor-noun": {
    example: "Her predecessor served in the role for ten years.",
  },
  "master-premier-adjective": {
    vietnamese: "hàng đầu, quan trọng nhất",
    example: "The city is one of the country's premier cultural destinations.",
  },
  "master-premier-noun": {
    example: "The provincial premier announced a new housing policy.",
    topic: "society",
  },
  "master-premise-noun": {
    definition: "an idea or statement on which an argument or conclusion is based",
    topic: "thinking",
  },
  "master-premises-noun": {
    vietnamese: "khuôn viên, nhà và đất thuộc một cơ sở",
    example: "The organization will move its headquarters to new premises.",
  },
  "master-primitively-adverb": {
    definition: "in a simple or undeveloped way",
    topic: "description",
  },
  "master-principally-adverb": {
    topic: "description",
  },
  "master-privileged-adjective": {
    topic: "society",
  },
  "master-professionalism-noun": {
    vietnamese: "tính chuyên nghiệp",
    topic: "work",
  },
  "master-profound-adjective": {
    definition: "very great, intense, or showing deep understanding",
    vietnamese: "sâu sắc, to lớn",
    example: "The discovery had a profound effect on modern medicine.",
  },
  "master-profoundly-adverb": {
    topic: "description",
  },
  "master-prohibitive-adjective": {
    definition: "so expensive or difficult that it prevents people from doing something",
    vietnamese: "quá cao hoặc khó đến mức cản trở",
    example: "The prohibitive cost forced the team to abandon the project.",
    topic: "money",
  },
  "master-prohibitively-adverb": {
    topic: "description",
  },
  "master-proliferate-verb": {
    vietnamese: "sinh sôi, tăng nhanh",
  },
  "master-prolific-adjective": {
    definition: "producing many works, results, or offspring",
    vietnamese: "sáng tác nhiều, sinh sản nhiều, năng suất cao",
    example: "She was a prolific writer who published dozens of novels.",
  },
  "master-prop-verb": {
    example: "He propped the ladder securely against the wall.",
  },
  "master-prophet-noun": {
    topic: "culture",
  },
  "master-prophetic-adjective": {
    example: "Her warning proved prophetic when the market collapsed.",
  },
  "master-prospective-adjective": {
    definition: "expected or likely to happen or become something in the future",
    vietnamese: "tiềm năng, sắp tới",
    example: "Prospective students toured the campus before applying.",
    topic: "time",
  },
  "master-protagonist-noun": {
    vietnamese: "nhân vật chính",
    topic: "arts",
  },
  "master-provocative-adjective": {
    definition: "causing a strong reaction by challenging, stimulating, or offending people",
    vietnamese: "khiêu khích, gợi suy nghĩ",
  },
  "master-provocatively-adverb": {
    definition: "in a way intended to cause a strong reaction or attract sexual interest",
    vietnamese: "một cách khiêu khích, khêu gợi",
    topic: "description",
  },
  "master-prowl-verb": {
    definition: "to move around quietly while searching for prey or an opportunity",
    example: "The lioness prowled through the grass in search of prey.",
  },
  "master-psyche-noun": {
    definition: "the human mind and its deepest thoughts and feelings",
    vietnamese: "tâm trí, tâm hồn",
  },
  "master-psychiatric-adjective": {
    definition: "relating to mental illness or its medical treatment",
    vietnamese: "thuộc tâm thần học, thuộc điều trị tâm thần",
    example: "The hospital provides specialist psychiatric care.",
    topic: "health",
  },
  "master-psychiatrist-noun": {
    definition: "a medical doctor who diagnoses and treats mental health conditions",
    vietnamese: "bác sĩ tâm thần",
    example: "The psychiatrist discussed several treatment options with the patient.",
    topic: "health",
  },
  "master-purity-noun": {
    topic: "science",
  },
  "master-quarry-noun": {
    topic: "nature",
  },
  "master-query-verb": {
    example: "The editor queried several claims in the article.",
  },
  "master-quest-noun": {
    example: "The explorers began a long quest for the lost city.",
    topic: "activities",
  },
  "master-quip-noun": {
    vietnamese: "lời nói dí dỏm, câu nói đùa",
    example: "Her quick quip made the whole audience laugh.",
  },
  "master-quirk-noun": {
    vietnamese: "nét kỳ quặc, thói quen khác thường",
  },
  "master-radiator-noun": {
    vietnamese: "bộ tản nhiệt, lò sưởi",
  },
  "master-rapport-noun": {
    vietnamese: "mối quan hệ hòa hợp, sự thấu hiểu lẫn nhau",
    example: "The counselor quickly established a good rapport with the students.",
  },
  "master-raunchy-adjective": {
    example: "The comedian became known for his raunchy jokes.",
  },
  "master-readable-adjective": {
    definition: "easy or enjoyable to read",
  },
  "master-realism-noun": {
    example: "The novel's realism makes its characters feel authentic.",
    topic: "arts",
  },
  "master-realist-noun": {
    vietnamese: "người thực tế, người theo chủ nghĩa hiện thực",
    example: "As a realist, she planned for several possible setbacks.",
  },
  "master-reap-verb": {
    definition: "to obtain a benefit or result from an effort or action",
    vietnamese: "gặt hái, thu được",
  },
  "master-reassurance-noun": {
    definition: "words or actions that reduce someone's doubts or fears",
    vietnamese: "sự trấn an, lời bảo đảm",
    example: "The doctor offered reassurance that the condition was treatable.",
    topic: "emotions",
  },
  "master-reassure-verb": {
    definition: "to make someone feel less worried or doubtful",
    vietnamese: "trấn an, làm yên lòng",
  },
  "master-recess-noun": {
    vietnamese: "giờ nghỉ, thời gian tạm ngừng",
    example: "The children played outside during recess.",
  },
  "master-recessive-adjective": {
    definition: "relating to a gene whose effect appears only when no dominant gene is present",
    vietnamese: "lặn, thuộc gen lặn",
    topic: "science",
  },
  "master-recharge-verb": {
    definition: "to restore power to a battery by charging it again",
    example: "I need to recharge the phone before the trip.",
    topic: "technology",
  },
  "master-rediscover-verb": {
    topic: "thinking",
  },
  "master-reenact-verb": {
    topic: "history",
  },
  "master-refresh-verb": {
    definition: "to make someone feel less tired and more energetic",
  },
  "master-refreshing-adjective": {
    example: "A refreshing breeze cooled the crowded room.",
  },
  "master-refreshingly-adverb": {
    vietnamese: "một cách sảng khoái, dễ chịu",
    topic: "description",
  },
  "master-refurbishment-noun": {
    topic: "change",
  },
  "master-relapse-noun": {
    definition: "a return of an illness or problem after an improvement",
    vietnamese: "sự tái phát, sự trở lại tình trạng xấu",
    topic: "health",
  },
  "master-relapse-verb": {
    definition: "to become ill again or return to a worse condition after improving",
    vietnamese: "tái phát, trở lại tình trạng xấu",
    example: "The patient relapsed shortly after leaving the hospital.",
  },
  "master-relinquish-verb": {
    example: "She refused to relinquish control of the company.",
  },
  "master-reluctantly-adverb": {
    example: "She reluctantly agreed to attend the meeting.",
    topic: "description",
  },
  "master-remedial-adjective": {
    definition: "intended to improve a basic skill or correct a weakness",
    vietnamese: "nhằm bổ trợ, khắc phục kiến thức yếu",
    topic: "education",
  },
  "master-reminiscent-adjective": {
    vietnamese: "gợi nhớ, làm liên tưởng",
    example: "The melody is reminiscent of traditional folk songs.",
  },
  "master-remorsefully-adverb": { topic: "description" },
  "master-remorseless-adjective": {
    example: "The remorseless attacker showed no pity for his victims.",
  },
  "master-remorselessly-adverb": {
    vietnamese: "một cách tàn nhẫn, không thương xót",
    topic: "description",
  },
  "master-remotely-adverb": {
    definition: "from a distant location, usually using technology",
    vietnamese: "từ xa",
    example: "Many employees now work remotely several days a week.",
    topic: "work",
  },
  "master-rendering-noun": {
    definition: "a visual representation of a building, object, or scene",
    vietnamese: "bản phối cảnh, hình ảnh mô phỏng",
    topic: "arts",
  },
  "master-renown-noun": {
    example: "The scientist achieved international renown for her research.",
  },
  "master-repellant-noun": {
    definition: "a substance used to keep insects, water, or other things away",
    topic: "safety",
  },
  "master-repertory-noun": {
    definition: "a collection or stock of available works, skills, or information",
    vietnamese: "kho tàng, bộ sưu tập",
    topic: "quantity",
  },
  "master-resilience-noun": {
    vietnamese: "khả năng phục hồi, tính kiên cường",
    topic: "emotions",
  },
  "master-resilient-adjective": {
    vietnamese: "kiên cường, có khả năng phục hồi",
  },
  "master-resin-noun": {
    example: "Sticky resin oozed from the cut in the pine tree.",
  },
  "master-resonate-verb": { topic: "sounds" },
  "master-resort-verb": {
    example: "When negotiations failed, the workers resorted to a strike.",
    topic: "problem-solving",
  },
  "master-respite-noun": {
    vietnamese: "sự nghỉ ngơi tạm thời, khoảng thời gian nhẹ nhõm",
    topic: "emotions",
  },
  "master-restoration-noun": {
    vietnamese: "sự phục hồi, sự trùng tu",
    example: "The restoration returned the painting to its original condition.",
    topic: "change",
  },
  "master-retention-noun": {
    definition: "the ability or practice of keeping something or someone",
    topic: "work",
  },
  "master-retrace-verb": {
    definition: "to go back over the same route or series of steps",
    vietnamese: "đi lại đường cũ, lần lại",
  },
  "master-revealing-adjective": {
    vietnamese: "hở hang, bộc lộ nhiều",
    example: "She chose a less revealing dress for the formal event.",
  },
  "master-revere-verb": {
    definition: "to admire and respect someone or something deeply",
    example: "Many students revere her as a pioneering scientist.",
  },
  "master-robustly-adverb": { topic: "description" },
  "master-rotate-verb": {
    definition: "to turn around a central point or axis",
    example: "She rotated the image 180 degrees to view it properly.",
  },
  "master-roundup-noun": {
    definition: "a summary or collection of the latest information or events",
    topic: "communication",
  },
  "master-rudimentary-adjective": {
    definition: "basic and not yet fully developed",
    example: "The village had only rudimentary medical facilities.",
  },
  "master-rudiments-noun": {
    definition: "the most basic facts, principles, or skills of a subject",
    vietnamese: "kiến thức hoặc nguyên tắc cơ bản",
    topic: "learning",
  },
  "master-rumble-noun": { topic: "sounds" },
  "master-rumble-verb": {
    example: "Thunder rumbled across the valley.",
    topic: "sounds",
  },
  "master-rustle-noun": {
    example: "We heard the rustle of leaves behind us.",
    topic: "sounds",
  },
  "master-rustle-verb": { topic: "sounds" },
  "master-ruthless-adjective": {
    example: "The ruthless leader removed anyone who opposed him.",
  },
  "master-ruthlessness-noun": {
    definition: "a lack of pity when pursuing a goal",
    example: "Her ruthlessness toward competitors damaged the company's reputation.",
  },
  "master-sacrifice-verb": { topic: "activities" },
  "master-salivate-verb": {
    vietnamese: "chảy nước bọt, thèm thuồng",
    topic: "body",
  },
  "master-saloon-noun": { topic: "places" },
  "master-salvage-verb": {
    example: "Workers salvaged valuable equipment from the damaged building.",
    topic: "safety",
  },
  "master-salvation-noun": {
    definition: "deliverance from sin or rescue from serious danger or difficulty",
    vietnamese: "sự cứu rỗi, sự giải thoát",
    example: "The faithful believed that repentance would bring salvation.",
    topic: "culture",
  },
  "master-salve-noun": {
    vietnamese: "thuốc mỡ, kem bôi làm dịu",
    topic: "health",
  },
  "master-sanctity-noun": { topic: "culture" },
  "master-sap-noun": {
    example: "Clear sap flowed from the cut in the tree trunk.",
  },
  "master-sarcasm-noun": {
    definition: "the use of remarks that mean the opposite of what they say in order to mock someone",
    example: "Her sarcasm was obvious when she called the long delay efficient.",
  },
  "master-sarcastic-adjective": {
    example: "He made a sarcastic comment about the team's poor preparation.",
  },
  "master-sarcastically-adverb": { topic: "description" },
  "master-sauna-noun": { topic: "places" },
  "master-scathing-adjective": {
    example: "The newspaper published a scathing review of the performance.",
  },
  "master-scenario-noun": { topic: "planning" },
  "master-scoff-verb": {
    example: "Critics initially scoffed at the inventor's ambitious proposal.",
  },
  "master-scramble-noun": {
    definition: "a hurried attempt or competition to reach or obtain something",
    vietnamese: "sự tranh giành, sự vội vã",
    example: "There was a frantic scramble for the remaining tickets.",
  },
  "master-screenplay-noun": { topic: "arts" },
  "master-scrutiny-noun": {
    vietnamese: "sự xem xét kỹ lưỡng",
    example: "The proposal came under close public scrutiny.",
  },
  "master-sedate-adjective": {
    definition: "calm, quiet, and dignified",
    example: "The ceremony proceeded at a sedate pace.",
  },
  "master-sedate-verb": {
    definition: "to give someone a drug that makes them calm or sleepy",
    vietnamese: "cho thuốc an thần",
  },
  "master-sedately-adverb": {
    vietnamese: "một cách điềm tĩnh, khoan thai",
    topic: "description",
  },
  "master-sedentary-adjective": {
    vietnamese: "ít vận động, thường ngồi một chỗ",
    example: "A sedentary lifestyle increases the risk of poor health.",
    topic: "health",
  },
  "master-seedling-noun": {
    example: "Each seedling was planted in a separate pot.",
  },
  "master-self-conscious-adjective": {
    definition: "uncomfortably aware of how other people may judge you",
    vietnamese: "ngượng ngùng, thiếu tự nhiên",
    example: "He felt self-conscious about speaking in front of the class.",
    topic: "emotions",
  },
  "master-self-worth-noun": { topic: "emotions" },
  "master-sentient-adjective": {
    example: "The debate asked whether the machine could ever become sentient.",
    topic: "thinking",
  },
  "master-sentimental-adjective": {
    definition: "strongly influenced by tender or nostalgic emotions",
  },
  "master-sentimentally-adverb": { topic: "description" },
  "master-sequel-noun": {
    vietnamese: "phần tiếp theo",
    example: "Did you prefer the original film or its sequel?",
    topic: "arts",
  },
  "master-shambles-noun": {
    vietnamese: "tình trạng hỗn độn, cảnh bừa bộn",
  },
  "master-shed-verb": {
    example: "The snake sheds its skin regularly as it grows.",
    topic: "animals",
  },
  "master-shortlist-noun": { topic: "work" },
  "master-shortlist-verb": { topic: "work" },
  "master-silhouette-noun": { topic: "senses" },
  "master-sketch-noun": { topic: "arts" },
  "master-slack-adjective": {
    vietnamese: "lỏng, chùng",
  },
  "master-slack-noun": {
    definition: "the loose part of a rope or line that is not pulled tight",
    example: "She pulled in the slack before securing the rope.",
    topic: "objects",
  },
  "master-slack-verb": {
    vietnamese: "lười biếng, trốn tránh công việc",
    topic: "work",
  },
  "master-slackly-adverb": {
    vietnamese: "một cách lỏng lẻo, chùng",
    topic: "description",
  },
  "master-slob-noun": {
    vietnamese: "người bừa bộn, người cẩu thả",
  },
  "master-smug-adjective": {
    vietnamese: "tự mãn, đắc ý",
    example: "He wore a smug smile after winning the argument.",
  },
  "master-smugly-adverb": {
    vietnamese: "một cách tự mãn, đắc ý",
    example: "He smiled smugly after predicting the result correctly.",
    topic: "description",
  },
  "master-snail-noun": {
    example: "A snail crawled slowly across the wet path.",
  },
  "master-socialization-noun": { topic: "society" },
  "master-somersault-noun": {
    example: "The gymnast performed a double somersault on the mat.",
    topic: "sports",
  },
  "master-spartan-adjective": {
    definition: "simple, strict, and lacking comfort or luxury",
    vietnamese: "khắc khổ, giản dị nghiêm ngặt",
    example: "The soldiers slept in spartan accommodation.",
  },
  "master-specification-noun": {
    vietnamese: "thông số, yêu cầu kỹ thuật",
    example: "The machine was built according to the client's specification.",
    topic: "technology",
  },
  "master-specimen-noun": {
    example: "The biologist examined the specimen under a microscope.",
    topic: "science",
  },
  "master-speculation-noun": { topic: "thinking" },
  "master-speculative-adjective": {
    definition: "based on guesses or involving a high financial risk",
    vietnamese: "mang tính suy đoán, đầu cơ",
    example: "The article makes several speculative claims about the discovery.",
    topic: "thinking",
  },
  "master-splatter-verb": {
    definition: "to splash liquid in small drops over a surface",
    vietnamese: "bắn tung tóe, làm văng tóe",
    example: "Mud splattered the side of the car.",
  },
  "master-sponsorship-noun": {
    definition: "financial or practical support provided by a sponsor",
    vietnamese: "sự tài trợ, tiền tài trợ",
    example: "Corporate sponsorship paid for the community festival.",
    topic: "business",
  },
  "master-spontaneous-adjective": {
    definition: "happening naturally or suddenly without being planned",
    vietnamese: "tự phát, ngẫu hứng",
  },
  "master-spontaneously-adverb": {
    vietnamese: "một cách tự phát, tự nhiên",
    topic: "description",
  },
  "master-sprawl-noun": {
    vietnamese: "sự lan rộng đô thị",
  },
  "master-sprawl-verb": {
    definition: "to spread over a large area in an irregular way",
    vietnamese: "trải rộng, lan rộng",
    topic: "places",
  },
  "master-squander-verb": {
    example: "He squandered his savings on unnecessary luxuries.",
    topic: "money",
  },
  "master-staccato-adjective": {
    example: "A burst of staccato applause filled the hall.",
    topic: "sounds",
  },
  "master-staccato-adverb": { topic: "sounds" },
  "master-staggering-adjective": {
    vietnamese: "đáng kinh ngạc, gây choáng ngợp",
  },
  "master-stamina-noun": { topic: "sports" },
  "master-staple-noun": { topic: "food" },
  "master-startling-adjective": {
    example: "The report revealed a startling increase in household debt.",
  },
  "master-startlingly-adverb": {
    definition: "in a way that is surprisingly different or shocking",
    vietnamese: "một cách đáng kinh ngạc, gây sửng sốt",
    example: "The two candidates gave startlingly similar answers.",
    topic: "description",
  },
  "master-stately-adjective": {
    example: "Stately columns framed the entrance to the courthouse.",
  },
  "master-stoke-verb": { topic: "actions" },
  "master-strapping-adjective": {
    example: "A strapping young man carried the heavy boxes upstairs.",
  },
  "master-stray-adjective": {
    definition: "separated from the correct place or scattered away from a group",
    vietnamese: "đi lạc, rời rạc",
    example: "She brushed a few stray crumbs from the table.",
  },
  "master-stray-noun": {
    example: "The shelter provides food and care for local strays.",
  },
  "master-stray-verb": {
    example: "Several hikers strayed from the marked path.",
  },
  "master-structural-adjective": {
    definition: "relating to the way something is built or organized",
  },
  "master-structurally-adverb": {
    vietnamese: "về mặt cấu trúc, kết cấu",
    topic: "description",
  },
  "master-stuffily-adverb": { topic: "description" },
  "master-stuffiness-noun": {
    definition: "an unpleasant lack of fresh air in a room or space",
  },
  "master-stuffy-adjective": {
    example: "The office was hot and stuffy after the windows were closed.",
  },
  "master-stylistic-adjective": {
    example: "The editor suggested several stylistic changes to the essay.",
    topic: "language",
  },
  "master-stylistically-adverb": {
    definition: "in a way that relates to artistic or linguistic style",
    vietnamese: "về mặt phong cách, văn phong",
    example: "The two novels are stylistically very different.",
    topic: "description",
  },
  "master-substantially-adverb": {
    definition: "by a large or significant degree",
    topic: "description",
  },
  "master-subtly-adverb": {
    definition: "in a delicate or not immediately obvious way",
    vietnamese: "một cách tinh tế, kín đáo",
    example: "The lighting subtly changes as evening approaches.",
    topic: "description",
  },
  "master-suburban-adjective": { topic: "places" },
  "master-suburbia-noun": {
    vietnamese: "khu vực ngoại ô, đời sống ngoại ô",
  },
  "master-succession-noun": {
    example: "The team won three matches in succession.",
    topic: "time",
  },
  "master-succulent-adjective": {
    vietnamese: "mọng nước, mềm ngon",
    example: "The restaurant served succulent roast beef.",
    topic: "food",
  },
  "master-suds-noun": { topic: "home" },
  "master-suffice-verb": { topic: "quantity" },
  "master-superficial-adjective": {
    definition: "existing only on the surface or lacking depth and thoroughness",
    vietnamese: "hời hợt, bề ngoài",
    example: "The report offered only a superficial analysis of the problem.",
  },
  "master-superficially-adverb": {
    vietnamese: "một cách hời hợt, bề ngoài",
    topic: "description",
  },
  "master-suspension-noun": {
    definition: "the temporary removal of someone from a job, school, or activity",
    vietnamese: "sự đình chỉ, án treo giò",
    topic: "sports",
  },
  "master-sustainable-adjective": {
    vietnamese: "bền vững, có thể duy trì lâu dài",
    topic: "environment",
  },
  "master-swap-noun": { topic: "ownership" },
  "master-swap-verb": {
    example: "We swapped seats so she could sit by the window.",
  },
  "master-symptomatic-adjective": {
    vietnamese: "có tính triệu chứng, biểu hiện của",
    example: "The fever is symptomatic of a wider infection.",
    topic: "health",
  },
  "master-synopsis-noun": {
    example: "The publisher requested a brief synopsis of the novel.",
  },
  "master-synthetic-adjective": {
    example: "The jacket is made from a lightweight synthetic fabric.",
    topic: "materials",
  },
  "master-synthetically-adverb": {
    topic: "science",
  },
  "master-tact-noun": {
    example: "She handled the sensitive complaint with considerable tact.",
    topic: "relationships",
  },
  "master-tactfully-adverb": { topic: "description" },
  "master-tailor-noun": {
    example: "The tailor adjusted the jacket to fit perfectly.",
  },
  "master-tangle-noun": {
    vietnamese: "mớ rối, chỗ rối",
    topic: "objects",
  },
  "master-tangle-verb": {
    example: "The wind tangled the fishing lines together.",
  },
  "master-tangled-adjective": {
    example: "She carefully brushed her tangled hair.",
  },
  "master-tantrum-noun": { topic: "emotions" },
  "master-taut-adjective": {
    example: "The wind kept the sails taut throughout the race.",
  },
  "master-tautly-adverb": {
    vietnamese: "một cách căng chặt",
    topic: "description",
  },
  "master-tedious-adjective": {
    example: "The process was tedious and more trouble than it was worth.",
  },
  "master-tediously-adverb": { topic: "description" },
  "master-tedium-noun": {
    definition: "the feeling of boredom caused by something repetitive or lengthy",
    vietnamese: "sự buồn tẻ, cảm giác chán ngắt",
    example: "Music helped relieve the tedium of the long journey.",
  },
  "master-telltale-adjective": {
    vietnamese: "để lộ, báo hiệu rõ ràng",
    example: "Dark circles under his eyes were a telltale sign of exhaustion.",
  },
  "master-temperament-noun": {
    definition: "a person's usual emotional nature and pattern of behavior",
    example: "Her calm temperament suited the demanding role.",
  },
  "master-temperamental-adjective": {
    definition: "likely to change mood suddenly or behave unpredictably",
    vietnamese: "thất thường, dễ thay đổi tính khí",
    example: "The temperamental actor frequently argued with the director.",
  },
  "master-temperamentally-adverb": {
    definition: "in a way determined by a person's natural temperament",
    example: "The two colleagues were temperamentally very different.",
    topic: "description",
  },
  "master-terrain-noun": {
    vietnamese: "địa thế, địa hình",
  },
  "master-testament-noun": {
    definition: "a person's will or a statement expressing their beliefs and legacy",
    vietnamese: "di chúc, lời tuyên ngôn",
    topic: "communication",
  },
  "master-thereby-adverb": { topic: "language" },
  "master-timid-adjective": {
    example: "The timid child spoke only when the teacher asked directly.",
  },
  "master-tinker-noun": {
    definition: "a traveling worker who traditionally repaired metal household items",
    topic: "work",
  },
  "master-tinker-verb": {
    definition: "to make small experimental changes or repairs to something",
    vietnamese: "mày mò sửa chữa, điều chỉnh lặt vặt",
    topic: "work",
  },
  "master-tone-verb": {
    vietnamese: "điều chỉnh sắc độ, tạo sắc thái",
    topic: "arts",
  },
  "master-torment-noun": { topic: "emotions" },
  "master-torturous-adjective": {
    definition: "causing extreme physical or mental pain",
    example: "The prisoners endured a torturous interrogation.",
  },
  "master-toughness-noun": { topic: "sports" },
  "master-trampoline-noun": {
    example: "The children practiced jumping safely on the trampoline.",
  },
  "master-tranquil-adjective": {
    example: "The garden remained tranquil despite the noise of the city.",
  },
  "master-tranquility-noun": { topic: "emotions" },
  "master-transatlantic-adjective": {
    example: "The airline introduced a new transatlantic flight.",
    topic: "travel",
  },
  "master-transfix-verb": {
    definition: "to hold someone motionless with amazement, fear, or fascination",
    vietnamese: "làm sững sờ, làm mê mẩn",
    example: "The audience was transfixed by the dancer's performance.",
  },
  "master-transit-noun": {
    definition: "the process of carrying people or goods from one place to another",
    vietnamese: "sự vận chuyển, sự quá cảnh",
    topic: "travel",
  },
  "master-trauma-noun": {
    definition: "severe emotional shock or a serious physical injury",
    vietnamese: "sang chấn, chấn thương",
    example: "Counseling helped her recover from the trauma of the accident.",
    topic: "health",
  },
  "master-traumatic-adjective": {
    definition: "causing severe emotional shock or distress",
    vietnamese: "gây sang chấn, đau thương",
    topic: "health",
  },
  "master-trying-adjective": {
    example: "The family remained hopeful during a trying period.",
  },
  "master-tune-verb": { topic: "arts" },
  "master-twitch-noun": {
    vietnamese: "cơn co giật nhẹ, cái giật",
    topic: "body",
  },
  "master-twitch-verb": {
    definition: "to make a sudden small involuntary movement",
    vietnamese: "co giật, giật nhẹ",
    topic: "body",
  },
  "master-tycoon-noun": {
    vietnamese: "ông trùm kinh doanh, đại gia",
    topic: "business",
  },
  "master-unconvincing-adjective": {
    definition: "not seeming true or believable",
    example: "His explanation for the missing funds was unconvincing.",
  },
  "master-unconvincingly-adverb": {
    definition: "in a way that does not seem true or believable",
    vietnamese: "một cách thiếu thuyết phục",
    example: "He argued unconvincingly that the error was unavoidable.",
    topic: "description",
  },
  "master-unenviable-adjective": {
    example: "She faced the unenviable task of announcing the job cuts.",
  },
  "master-uneventful-adjective": {
    example: "The journey home was quiet and uneventful.",
  },
  "master-unison-noun": {
    vietnamese: "sự đồng thanh, đồng loạt",
    example: "The choir members sang the final note in unison.",
    topic: "sounds",
  },
  "master-unmanned-adjective": {
    example: "An unmanned spacecraft was sent to study Mars.",
    topic: "technology",
  },
  "master-unmusical-adjective": {
    example: "His unmusical voice made the simple melody difficult to recognize.",
    topic: "arts",
  },
  "master-unmusically-adverb": {
    vietnamese: "một cách không du dương, lạc điệu",
    topic: "description",
  },
  "master-unoccupied-adjective": {
    vietnamese: "bỏ trống, không có người sử dụng",
    topic: "places",
  },
  "master-unplug-verb": {
    definition: "to disconnect a device from an electrical supply",
    vietnamese: "rút phích cắm, ngắt nguồn",
    topic: "technology",
  },
  "master-unreliably-adverb": {
    definition: "in an inconsistent or undependable way",
    vietnamese: "một cách không đáng tin cậy, thất thường",
    topic: "description",
  },
  "master-unsettle-verb": {
    definition: "to make someone feel worried, upset, or uncomfortable",
    example: "The unexplained noise unsettled everyone in the house.",
  },
  "master-untangle-verb": {
    definition: "to remove knots or tangles from something",
    vietnamese: "gỡ rối, tháo nút",
    example: "She patiently untangled the wires behind the desk.",
  },
  "master-untangled-adjective": {
    definition: "freed from knots, twists, or confusion",
  },
  "master-unwavering-adjective": {
    definition: "firm and determined without changing or weakening",
    example: "Her unwavering support helped the team recover.",
  },
  "master-unwaveringly-adverb": { topic: "description" },
  "master-upheaval-noun": { topic: "society" },
  "master-usher-noun": {
    example: "The usher guided us to our seats before the performance.",
  },
  "master-vegetation-noun": { topic: "nature" },
  "master-ventilate-verb": { topic: "health" },
  "master-ventilation-noun": {
    example: "Good ventilation keeps the classroom air fresh.",
    topic: "health",
  },
  "master-verandah-noun": { topic: "places" },
  "master-verdict-noun": { topic: "society" },
  "master-versatile-adjective": {
    vietnamese: "đa năng, linh hoạt, nhiều tài",
    topic: "skills",
  },
  "master-versatility-noun": {
    definition: "the ability to adapt or perform many different functions well",
    vietnamese: "tính đa năng, sự linh hoạt",
    example: "The tool's versatility makes it useful for many repairs.",
    topic: "skills",
  },
  "master-vertical-adjective": {
    example: "The climbers faced a nearly vertical rock wall.",
  },
  "master-verve-noun": {
    definition: "energy, enthusiasm, and confidence in a performance or activity",
    vietnamese: "sự hăng hái, sức sống",
    example: "The orchestra performed the final movement with great verve.",
    topic: "arts",
  },
  "master-viciously-adverb": {
    definition: "in a deliberately cruel or violent way",
    vietnamese: "một cách tàn nhẫn, hung bạo",
    topic: "description",
  },
  "master-victorious-adjective": {
    example: "The victorious team lifted the trophy in front of its supporters.",
    topic: "sports",
  },
  "master-victoriously-adverb": {
    definition: "in a way that shows victory or triumph",
    vietnamese: "một cách chiến thắng, đắc thắng",
    example: "She raised the trophy victoriously above her head.",
    topic: "description",
  },
  "master-vitality-noun": {
    example: "Regular exercise restored her energy and vitality.",
    topic: "health",
  },
  "master-voluntarily-adverb": {
    vietnamese: "một cách tự nguyện",
    topic: "description",
  },
  "master-voracious-adjective": {
    vietnamese: "háu ăn, say mê, ham học hỏi",
    example: "As a voracious reader, he finishes several novels each week.",
  },
  "master-voraciously-adverb": {
    definition: "with great eagerness or appetite",
    vietnamese: "một cách ngấu nghiến, say mê",
    example: "The children ate voraciously after the long hike.",
    topic: "description",
  },
  "master-wayside-noun": {
    example: "Wildflowers grew along the wayside beside the country road.",
    topic: "places",
  },
  "master-wickedly-adverb": { topic: "description" },
  "master-wizened-adjective": {
    example: "A wizened old sailor sat quietly by the harbor.",
  },
  "master-woo-verb": {
    definition: "to seek someone's affection, support, or approval",
    vietnamese: "ve vãn, tranh thủ tình cảm hoặc sự ủng hộ",
    example: "The company is wooing younger customers with a new campaign.",
    topic: "communication",
  },
  "master-wooded-adjective": {
    example: "Their cabin stands on a wooded hillside above the lake.",
    topic: "nature",
  },
  "master-wrangle-verb": {
    definition: "to argue angrily for a long time",
    vietnamese: "tranh cãi, cãi cọ",
    example: "The two departments continued to wrangle over the budget.",
    topic: "communication",
  },
  "master-wrench-verb": {
    example: "She wrenched the stuck door open with both hands.",
  },
  "master-wry-adjective": {
    vietnamese: "hài hước châm biếm, mỉa mai kín đáo",
    example: "He gave a wry smile when the plan failed exactly as predicted.",
  },
  "master-wryly-adverb": { topic: "description" },
  "master-abundantly-adverb": {
    definition: "in large quantities or to a great degree",
    vietnamese: "dồi dào, rất nhiều",
    topic: "description",
  },
  "master-accountability-noun": {
    definition: "the duty to accept responsibility for one's actions and explain them",
    vietnamese: "trách nhiệm giải trình",
    topic: "society",
  },
  "master-accrue-verb": {
    definition: "to accumulate or increase gradually over time",
    vietnamese: "tích lũy, phát sinh",
    example: "Interest accrues on the account at the end of each month.",
    topic: "money",
  },
  "master-acreage-noun": {
    definition: "the area of a piece of land measured in acres",
    vietnamese: "diện tích tính bằng mẫu Anh",
    topic: "places",
  },
  "master-adept-adjective": { topic: "skills" },
  "master-adept-noun": {
    example: "She is an adept at negotiating complex contracts.",
    topic: "skills",
  },
  "master-adhere-verb": {
    example: "The label will adhere firmly to a clean, dry surface.",
  },
  "master-adornment-noun": {
    definition: "a decoration or the act of decorating someone or something",
    vietnamese: "đồ trang trí, sự tô điểm",
    example: "Fresh flowers served as a simple adornment for the table.",
  },
  "master-affectation-noun": {
    definition: "unnatural behavior or speech adopted to impress other people",
    vietnamese: "điệu bộ, vẻ màu mè giả tạo",
    example: "His exaggerated accent sounded like an affectation.",
    topic: "description",
  },
  "master-allotment-noun": {
    vietnamese: "sự phân bổ, phần được phân bổ",
  },
  "master-allusion-noun": {
    example: "The poem contains an allusion to an ancient Greek myth.",
  },
  "master-ally-verb": {
    definition: "to join with another person or group for mutual support",
    vietnamese: "liên kết, liên minh",
    example: "Several smaller organizations allied themselves with the campaign.",
  },
  "master-anonymity-noun": {
    example: "The witness was granted anonymity for her protection.",
  },
  "master-antediluvian-adjective": {
    vietnamese: "cổ lỗ sĩ, cực kỳ lỗi thời",
    example: "The office still relies on an antediluvian filing system.",
  },
  "master-anthology-noun": {
    example: "The anthology includes poems by writers from six countries.",
    topic: "arts",
  },
  "master-anthropological-adjective": {
    example: "The museum supports anthropological research into local cultures.",
    topic: "science",
  },
  "master-antidote-noun": { topic: "health" },
  "master-antithesis-noun": {
    vietnamese: "sự đối lập, phản đề",
    topic: "thinking",
  },
  "master-antithetical-adjective": {
    vietnamese: "đối lập, trái ngược",
    example: "Such secrecy is antithetical to the principles of open government.",
  },
  "master-apprehend-verb": { topic: "society" },
  "master-arcane-adjective": {
    example: "Only specialists understood the arcane legal terminology.",
  },
  "master-archetypal-adjective": {
    example: "The novel's hero is an archetypal outsider seeking acceptance.",
  },
  "master-articulate-adjective": {
    definition: "able to express ideas clearly and effectively",
    vietnamese: "ăn nói lưu loát, diễn đạt rõ ràng",
    example: "She is an articulate advocate for educational reform.",
    topic: "communication",
  },
  "master-artifact-noun": {
    definition: "an object made by a person, especially one of historical interest",
    vietnamese: "hiện vật, đồ tạo tác",
    example: "Archaeologists uncovered a bronze artifact near the temple.",
    topic: "history",
  },
  "master-athleticism-noun": {
    definition: "physical strength, fitness, and skill in sports",
    vietnamese: "năng lực thể thao, tố chất vận động",
    example: "Her speed and athleticism made her an exceptional defender.",
    topic: "sports",
  },
  "master-audit-verb": {
    example: "Independent accountants audit the company's records each year.",
    topic: "money",
  },
  "master-austere-adjective": {
    definition: "plain and severe, without unnecessary comfort or decoration",
    vietnamese: "khắc khổ, giản dị nghiêm ngặt",
  },
  "master-austerely-adverb": {
    vietnamese: "một cách khắc khổ, giản dị",
    topic: "description",
  },
  "master-austerity-noun": {
    definition: "strict economy or a way of living without comfort or luxury",
    vietnamese: "sự thắt lưng buộc bụng, lối sống khắc khổ",
    topic: "money",
  },
  "master-autopilot-noun": {
    definition: "a system that controls a vehicle automatically, or a state of acting without conscious thought",
    vietnamese: "chế độ lái tự động, trạng thái hành động theo quán tính",
    topic: "technology",
  },
  "master-averse-adjective": {
    example: "The board is averse to taking unnecessary financial risks.",
  },
  "master-avian-adjective": {
    vietnamese: "thuộc về chim",
    topic: "animals",
  },
  "master-axiom-noun": {
    example: "The argument begins with the axiom that all people deserve equal treatment.",
    topic: "thinking",
  },
  "master-babble-verb": {
    definition: "to talk rapidly in a foolish or difficult-to-understand way",
    vietnamese: "nói huyên thuyên, bập bẹ",
  },
  "master-bauble-noun": {
    definition: "a small, showy ornament of little value",
    topic: "objects",
  },
  "master-belligerence-noun": {
    vietnamese: "thái độ hiếu chiến, sự gây hấn",
    topic: "description",
  },
  "master-beneficiary-noun": {
    definition: "a person or organization that receives an advantage or benefit",
    vietnamese: "người hưởng lợi, người thụ hưởng",
    example: "Local students will be the main beneficiaries of the scholarship fund.",
  },
  "master-blight-noun": {
    definition: "a plant disease or a harmful condition that causes serious damage",
    vietnamese: "bệnh tàn lụi, tai họa",
  },
  "master-blight-verb": {
    definition: "to spoil, damage, or destroy something severely",
    topic: "change",
  },
  "master-blitz-noun": {
    definition: "a sudden, intense attack or campaign",
    vietnamese: "cuộc tấn công chớp nhoáng, chiến dịch dồn dập",
    example: "The agency launched a publicity blitz before the election.",
  },
  "master-blitz-verb": {
    example: "The home team blitzed its opponent in the opening quarter.",
  },
  "master-brandish-verb": {
    definition: "to wave a weapon or other object in a threatening or excited way",
    vietnamese: "vung, khua một cách đe dọa",
    example: "The robber brandished a knife and demanded the cash.",
  },
  "master-brimstone-noun": {
    definition: "an old-fashioned or literary name for sulfur",
    example: "The cave smelled strongly of brimstone.",
  },
  "master-brink-noun": {
    definition: "the edge of a steep place or the point just before a major event",
    vietnamese: "bờ, vực; bờ vực",
    example: "Diplomats pulled the two countries back from the brink of war.",
  },
  "master-brood-noun": {
    example: "The hen led her brood of chicks across the yard.",
    topic: "animals",
  },
  "master-calamitous-adjective": {
    example: "The policy had calamitous consequences for the local economy.",
  },
  "master-calamity-noun": {
    example: "The earthquake was a calamity for the entire region.",
  },
  "master-callous-adjective": {
    vietnamese: "nhẫn tâm, vô cảm",
  },
  "master-callously-adverb": {
    vietnamese: "một cách tàn nhẫn, vô cảm",
    topic: "description",
  },
  "master-calorific-adjective": {
    definition: "producing heat or containing a large amount of energy",
    vietnamese: "sinh nhiệt, chứa nhiều calo",
    example: "Coal has a higher calorific value than damp wood.",
    topic: "science",
  },
  "master-catastrophically-adverb": {
    definition: "in a way that causes sudden and extremely serious damage or failure",
    vietnamese: "một cách thảm khốc, thê thảm",
    example: "The dam failed catastrophically after days of heavy rain.",
    topic: "description",
  },
  "master-choreography-noun": { topic: "arts" },
  "master-chronologically-adverb": {
    example: "The documents are arranged chronologically from earliest to latest.",
    topic: "time",
  },
  "master-chronology-noun": {
    definition: "the order in which a series of events happened",
    vietnamese: "trình tự thời gian, niên biểu",
    example: "The report establishes a clear chronology of the accident.",
    topic: "time",
  },
  "master-chrysalis-noun": {
    definition: "the protected pupal stage of a butterfly or moth before it becomes an adult",
    vietnamese: "nhộng, kén nhộng",
  },
  "master-cinematographer-noun": {
    vietnamese: "nhà quay phim, đạo diễn hình ảnh",
    example: "The cinematographer used natural light to create a subdued mood.",
    topic: "arts",
  },
  "master-cinematography-noun": {
    example: "The film's dramatic cinematography earned an international award.",
    topic: "arts",
  },
  "master-circumnavigate-verb": {
    definition: "to travel all the way around a place or the world",
    vietnamese: "đi vòng quanh",
    example: "The crew hopes to circumnavigate the globe in a sailing boat.",
    topic: "travel",
  },
  "master-circumnavigation-noun": {
    definition: "a journey all the way around a place or the world",
    vietnamese: "hành trình vòng quanh",
    example: "The expedition completed a circumnavigation of the globe.",
    topic: "travel",
  },
  "master-cocoon-verb": {
    definition: "to protect or isolate someone as if enclosing them in a cocoon",
    vietnamese: "bao bọc, thu mình",
    example: "She cocooned herself at home during the winter break.",
    topic: "actions",
  },
  "master-cognitive-adjective": { topic: "thinking" },
  "master-colloquial-adjective": {
    definition: "used in ordinary, informal conversation rather than formal language",
    vietnamese: "thuộc khẩu ngữ, thông tục",
    example: "The phrase is common in colloquial English.",
    topic: "language",
  },
  "master-colloquially-adverb": {
    vietnamese: "theo lối khẩu ngữ, một cách thông tục",
    topic: "language",
  },
  "master-colloquium-noun": { topic: "education" },
  "master-combustion-noun": {
    example: "Complete combustion produces heat and releases carbon dioxide.",
    topic: "science",
  },
  "master-commensurate-adjective": {
    definition: "corresponding in size, degree, or importance",
    vietnamese: "tương xứng, tương đương",
  },
  "master-commodity-noun": { topic: "money" },
  "master-concurrence-noun": {
    vietnamese: "sự đồng thuận, sự trùng hợp",
    example: "The proposal cannot proceed without the board's concurrence.",
  },
  "master-condensation-noun": {
    definition: "the process by which a gas cools and becomes a liquid",
    vietnamese: "sự ngưng tụ",
    topic: "science",
  },
  "master-conduit-noun": {
    definition: "a pipe or channel through which liquid, cables, or information can pass",
    vietnamese: "ống dẫn, kênh truyền dẫn",
  },
  "master-confabulate-verb": { topic: "communication" },
  "master-confabulation-noun": {
    definition: "informal conversation or the unconscious invention of false memories",
    vietnamese: "cuộc trò chuyện; sự bịa ký ức vô thức",
  },
  "master-conglomerate-noun": {
    definition: "a large corporation formed from several different companies",
    vietnamese: "tập đoàn, tổ hợp doanh nghiệp",
    example: "The media conglomerate owns television networks and publishing firms.",
    topic: "business",
  },
  "master-conjecture-verb": {
    definition: "to form an opinion or guess based on incomplete evidence",
  },
  "master-connotation-noun": {
    vietnamese: "nghĩa hàm ẩn, sắc thái liên tưởng",
    topic: "language",
  },
  "master-connote-verb": {
    definition: "to imply or suggest an idea or feeling beyond the literal meaning",
    example: "The color white can connote purity in some cultures.",
  },
  "master-consign-verb": {
    definition: "to give or send something to another person's care",
    vietnamese: "gửi, giao phó",
    example: "The gallery consigned the paintings to a specialist auction house.",
  },
  "master-consignment-noun": {
    vietnamese: "lô hàng gửi bán, chuyến hàng",
    topic: "business",
  },
  "master-consternation-noun": {
    definition: "a feeling of anxiety or dismay caused by something unexpected",
    vietnamese: "sự kinh hoàng, nỗi sửng sốt lo âu",
    example: "The sudden cancellation caused consternation among the passengers.",
  },
  "master-constrained-adjective": {
    example: "He offered a constrained smile during the tense meeting.",
  },
  "master-contagion-noun": {
    definition: "the spread of a disease, idea, or emotion from one person to another",
    vietnamese: "sự lây lan, sự truyền nhiễm",
    example: "Fear spread through the market like a contagion.",
    topic: "health",
  },
  "master-contractual-adjective": {
    example: "Both parties must fulfill their contractual obligations.",
    topic: "business",
  },
  "master-contractually-adverb": {
    vietnamese: "theo hợp đồng, về mặt hợp đồng",
    topic: "business",
  },
  "master-contrive-verb": {
    definition: "to plan, arrange, or manage to make something happen",
    example: "They contrived a way to finish the project before the deadline.",
    topic: "thinking",
  },
  "master-converse-adjective": {
    example: "'Parental' and 'filial' are converse terms.",
    topic: "language",
  },
  "master-corpus-noun": {
    vietnamese: "tập hợp văn bản, kho ngữ liệu",
    topic: "language",
  },
  "master-correlate-noun": {
    definition: "a thing or factor that has a mutual relationship with another",
    example: "Income is often a correlate of access to higher education.",
  },
  "master-correlate-verb": {
    definition: "to have or show a mutual relationship with something",
    example: "The researchers examined whether sleep quality correlates with memory.",
    topic: "relationships",
  },
  "master-cosmic-adjective": {
    vietnamese: "thuộc vũ trụ",
    example: "The telescope detected cosmic radiation from a distant galaxy.",
    topic: "science",
  },
  "master-counsel-noun": {
    definition: "formal advice given after careful consideration",
    vietnamese: "lời khuyên, sự cố vấn",
    example: "She sought legal counsel before signing the agreement.",
  },
  "master-crony-noun": {
    vietnamese: "tay chân thân tín, người cùng phe",
  },
  "master-cull-verb": {
    definition: "to select or remove particular members from a larger group",
    vietnamese: "chọn lọc, loại bỏ",
    topic: "actions",
  },
  "master-curator-noun": {
    example: "The museum curator organized an exhibition of regional art.",
  },
  "master-declination-noun": {
    definition: "the variation of a noun, pronoun, or adjective according to grammatical case, number, or gender",
    vietnamese: "sự biến cách",
    example: "Students practiced the declination of Latin nouns.",
    topic: "language",
  },
  "master-deficient-adjective": {
    example: "The diet was deficient in several essential vitamins.",
  },
  "master-deliberate-verb": {
    definition: "to think about or discuss something carefully before deciding",
    topic: "thinking",
  },
  "master-delicatessen-noun": {
    example: "The delicatessen sells imported cheese and freshly prepared salads.",
    topic: "places",
  },
  "master-demystify-verb": { topic: "communication" },
  "master-denotation-noun": {
    vietnamese: "nghĩa biểu thị, nghĩa đen",
    example: "The denotation of 'dove' is a type of bird.",
    topic: "language",
  },
  "master-depraved-adjective": {
    vietnamese: "đồi bại, suy đồi",
    example: "The novel portrays a depraved ruler with no regard for human life.",
  },
  "master-depravity-noun": {
    example: "The investigation exposed the cruelty and depravity of the regime.",
  },
  "master-deprecate-verb": {
    example: "The committee deprecated the use of violence in political debate.",
  },
  "master-derelict-adjective": {
    example: "A derelict warehouse stood beside the railway tracks.",
    topic: "places",
  },
  "master-derelict-noun": {
    definition: "an abandoned building, vehicle, or vessel in very poor condition",
    vietnamese: "tài sản bỏ hoang, tàu vô chủ",
    example: "The council plans to demolish the derelict near the station.",
    topic: "places",
  },
  "master-detract-verb": {
    vietnamese: "làm giảm giá trị, làm mất đi",
  },
  "master-deviant-noun": {
    definition: "a person whose behavior departs markedly from accepted social standards",
    vietnamese: "người có hành vi lệch chuẩn",
    example: "The label of deviant can depend on a society's changing norms.",
  },
  "master-diffuse-adjective": {
    vietnamese: "lan tỏa, phân tán",
  },
  "master-diligently-adverb": {
    definition: "in a careful, thorough, and persistent way",
    vietnamese: "một cách siêng năng, cần mẫn",
    example: "She worked diligently to verify every figure in the report.",
    topic: "description",
  },
  "master-disparage-verb": {
    definition: "to belittle or speak unfairly about someone or something",
    vietnamese: "coi thường, hạ thấp, chê bai",
    example: "The coach refused to disparage the opposing team after the match.",
  },
  "master-disparagement-noun": {
    vietnamese: "sự miệt thị, sự hạ thấp",
  },
  "master-disparaging-adjective": {
    definition: "showing that you have a low opinion of someone or something",
    vietnamese: "mang tính miệt thị, chê bai",
    example: "She objected to his disparaging remarks about her colleagues.",
  },
  "master-dispersal-noun": { topic: "nature" },
  "master-disperse-verb": {
    example: "Police asked the crowd to disperse peacefully after the rally.",
  },
  "master-disseminate-verb": {
    definition: "to distribute information or ideas widely among many people",
    vietnamese: "phổ biến, truyền bá",
    example: "The agency disseminates health information through local clinics.",
  },
  "master-dissemination-noun": {
    definition: "the act of spreading information, ideas, or knowledge widely",
    vietnamese: "sự phổ biến, sự truyền bá",
    example: "Digital platforms allow the rapid dissemination of research findings.",
    topic: "communication",
  },
  "master-distill-verb": {
    definition: "to purify a liquid by heating it and cooling the resulting vapor",
    vietnamese: "chưng cất, tinh lọc",
    example: "The laboratory distills water to remove dissolved impurities.",
    topic: "science",
  },
  "master-distillation-noun": {
    vietnamese: "sự chưng cất",
    example: "Vacuum distillation separates liquids at reduced pressure.",
    topic: "science",
  },
  "master-divination-noun": { topic: "culture" },
  "master-domesticity-noun": {
    definition: "life at home with one's family and the routines associated with it",
    vietnamese: "cuộc sống gia đình, nếp sống gia đình",
    example: "After years of travel, he began to appreciate quiet domesticity.",
    topic: "daily-life",
  },
  "master-dribble-verb": {
    definition: "to let liquid or saliva fall slowly in small drops",
    example: "Water dribbled from the loose connection beneath the sink.",
    topic: "actions",
  },
  "master-dubiously-adverb": {
    vietnamese: "một cách hồ nghi, ngờ vực",
    topic: "description",
  },
  "master-echo-noun": { topic: "communication" },
  "master-echo-verb": {
    definition: "to repeat a sound, idea, or statement",
    example: "Her comments echoed concerns raised by several residents.",
  },
  "master-edification-noun": {
    definition: "instruction or improvement that develops a person's mind or character",
    vietnamese: "sự mở mang trí tuệ, sự giáo hóa",
    topic: "education",
  },
  "master-edify-verb": {
    definition: "to instruct or improve someone morally or intellectually",
    topic: "education",
  },
  "master-egalitarian-adjective": { topic: "society" },
  "master-elasticity-noun": {
    definition: "the ability of a material to return to its original shape after being stretched or compressed",
    vietnamese: "tính co giãn, tính đàn hồi",
    example: "Heat can reduce the elasticity of the rubber seal.",
    topic: "science",
  },
  "master-electrode-noun": {
    definition: "a conductor through which electric current enters or leaves a device or material",
    example: "The technician attached an electrode to each side of the battery.",
    topic: "science",
  },
  "master-embed-verb": {
    definition: "to fix something firmly and deeply within a surrounding material",
    example: "Workers embedded the posts in concrete to keep them stable.",
  },
  "master-embody-verb": {
    definition: "to represent or express a quality, idea, or principle in a clear form",
    example: "The new charter embodies the organization's commitment to equality.",
  },
  "master-eminence-noun": {
    definition: "high rank, distinction, or recognized superiority in a field",
    vietnamese: "sự nổi bật, danh tiếng, địa vị cao",
    example: "The scientist achieved international eminence through her research.",
  },
  "master-eminent-adjective": {
    example: "Several eminent historians contributed essays to the collection.",
  },
  "master-emolument-noun": {
    definition: "a salary, fee, or other payment received from employment or public office",
    example: "The annual emolument includes a salary and housing allowance.",
  },
  "master-emulate-verb": {
    definition: "to imitate someone in an effort to equal or surpass their success",
    vietnamese: "noi gương, cố sánh bằng",
    example: "Young musicians often try to emulate performers they admire.",
    topic: "actions",
  },
  "master-encompass-verb": {
    vietnamese: "bao gồm, bao quát",
  },
  "master-encumber-verb": {
    definition: "to burden or restrict someone or something so that movement or progress is difficult",
    example: "Heavy equipment encumbered the climbers during the ascent.",
  },
  "master-encumbrance-noun": {
    example: "The outdated reporting rule became an administrative encumbrance.",
    topic: "states",
  },
  "master-enduringly-adverb": {
    definition: "for a long time or in a lasting way",
    vietnamese: "một cách lâu dài, bền vững",
    example: "Her work has proved enduringly influential across several disciplines.",
    topic: "time",
  },
  "master-engender-verb": {
    definition: "to cause a feeling, situation, or condition to develop",
    example: "Transparent decisions can engender trust among employees.",
    topic: "change",
  },
  "master-enthuse-verb": {
    example: "The critics enthused about the director's bold new production.",
  },
  "master-ephemera-noun": {
    definition: "printed or collectible items originally intended for short-term use",
    vietnamese: "ấn phẩm phù du, tư liệu ngắn hạn",
    topic: "objects",
  },
  "master-ephemeral-adjective": {
    example: "The artist's ephemeral installation disappeared with the morning tide.",
  },
  "master-equable-adjective": {
    definition: "steady and not varying greatly",
    example: "The island has an equable climate throughout the year.",
  },
  "master-euphemism-noun": {
    example: "'Pass away' is a common euphemism for 'die'.",
    topic: "language",
  },
  "master-euphemistic-adjective": {
    vietnamese: "mang tính uyển ngữ, nói giảm",
    example: "The report used the euphemistic phrase 'workforce adjustment' for layoffs.",
    topic: "language",
  },
  "master-euphemistically-adverb": {
    vietnamese: "một cách uyển chuyển, theo lối nói giảm",
    topic: "language",
  },
  "master-euphoria-noun": {
    definition: "an intense feeling of happiness, excitement, or well-being",
    vietnamese: "trạng thái hưng phấn tột độ",
    example: "A wave of euphoria swept through the crowd after the victory.",
  },
  "master-euphoric-adjective": {
    vietnamese: "hưng phấn tột độ, lâng lâng sung sướng",
    topic: "emotions",
  },
  "master-exact-verb": {
    definition: "to demand and obtain a payment, penalty, or revenge",
    vietnamese: "đòi hỏi, ép nộp",
    example: "The occupying force exacted a heavy tribute from the town.",
  },
  "master-exalted-adjective": {
    vietnamese: "cao quý, tôn quý",
    example: "The speech appealed to an exalted ideal of public service.",
  },
  "master-exorcism-noun": {
    vietnamese: "nghi thức trừ tà",
    example: "The legend describes an exorcism performed in the old house.",
    topic: "culture",
  },
  "master-exorcist-noun": {
    vietnamese: "người trừ tà, pháp sư trừ tà",
    example: "The story follows an exorcist called to investigate a haunted house.",
    topic: "culture",
  },
  "master-extant-adjective": {
    example: "Only three extant manuscripts contain the complete poem.",
  },
  "master-extracurricular-adjective": {
    definition: "taking place outside the normal school or college curriculum",
    topic: "education",
  },
  "master-exude-verb": {
    definition: "to release a liquid, smell, or quality gradually and noticeably",
    vietnamese: "rỉ ra, tỏa ra, toát lên",
    example: "The pine branches exuded a strong scent in the heat.",
    topic: "actions",
  },
  "master-facsimile-noun": {
    example: "The publisher produced a facsimile of the medieval manuscript.",
  },
  "master-fallacy-noun": {
    definition: "a mistaken belief or an error in reasoning",
    vietnamese: "ngụy biện, sai lầm logic",
    example: "The argument rests on the fallacy that correlation proves causation.",
  },
  "master-figuratively-adverb": {
    definition: "in a symbolic or metaphorical way rather than a literal one",
    vietnamese: "theo nghĩa bóng, một cách ẩn dụ",
    example: "Figuratively speaking, the new evidence opened a locked door.",
    topic: "language",
  },
  "master-flightiness-noun": {
    example: "Her apparent flightiness concealed a carefully planned strategy.",
  },
  "master-flighty-adjective": {
    example: "His flighty attention shifted from one proposal to another.",
  },
  "master-flit-verb": {
    vietnamese: "di chuyển nhanh và nhẹ, thoắt qua",
    example: "Small birds flitted between the branches at dawn.",
  },
  "master-fluctuate-verb": { topic: "change" },
  "master-fluctuation-noun": { topic: "change" },
  "master-forfeiture-noun": {
    vietnamese: "sự tịch thu, sự mất quyền",
  },
  "master-frolic-verb": {
    example: "Young goats frolicked in the field after the rain stopped.",
  },
  "master-gale-noun": { topic: "weather" },
  "master-glitz-noun": {
    definition: "showy glamour or decoration that may seem superficial or tasteless",
  },
  "master-gambit-noun": {
    definition: "an opening move or calculated action that involves risk to gain an advantage",
    vietnamese: "nước cờ thí quân, chiến thuật mở màn",
    example: "Offering a temporary discount was a gambit to attract new customers.",
    topic: "thinking",
  },
  "master-gauche-adjective": {
    vietnamese: "vụng về trong giao tiếp, thiếu tế nhị",
    example: "His gauche remark made everyone at the formal dinner uncomfortable.",
  },
  "master-graft-noun": {
    example: "Surgeons used a skin graft to cover the injured area.",
    topic: "health",
  },
  "master-gravitational-adjective": {
    vietnamese: "thuộc lực hấp dẫn, do trọng lực",
    example: "The moon's gravitational force affects ocean tides.",
    topic: "science",
  },
  "master-gravitationally-adverb": {
    definition: "in relation to or as a result of gravity",
    vietnamese: "về mặt hấp dẫn, do trọng lực",
    example: "The two stars are gravitationally bound to each other.",
    topic: "science",
  },
  "master-grievance-noun": {
    definition: "a formal complaint about unfair treatment or an unjust situation",
    vietnamese: "đơn khiếu nại, lời phàn nàn",
    topic: "communication",
  },
  "master-habitation-noun": {
    example: "Logging threatens animal habitation throughout the forest.",
    topic: "places",
  },
  "master-haphazard-adjective": {
    vietnamese: "bừa bãi, thiếu kế hoạch",
    example: "The haphazard evacuation plan caused unnecessary confusion.",
  },
  "master-haphazardly-adverb": { topic: "description" },
  "master-hapless-adjective": {
    vietnamese: "bất hạnh, không may",
    example: "The hapless traveler missed the last train home.",
  },
  "master-haughtily-adverb": {
    vietnamese: "một cách kiêu căng, ngạo mạn",
    topic: "description",
  },
  "master-haughty-adjective": {
    example: "The haughty official refused to answer ordinary citizens' questions.",
  },
  "master-hazard-verb": {
    vietnamese: "liều, đánh liều, phó mặc",
    example: "She hazarded a guess when no one else responded.",
    topic: "actions",
  },
  "master-headmistress-noun": { topic: "education" },
  "master-helm-noun": {
    definition: "the steering apparatus of a ship or the position of control in an organization",
    vietnamese: "bánh lái, vị trí chỉ huy",
    example: "An experienced captain stood at the helm during the storm.",
  },
  "master-herald-noun": {
    vietnamese: "người loan tin, sứ giả",
  },
  "master-hermetic-adjective": {
    example: "The medicine must remain inside a hermetic container.",
  },
  "master-hindsight-noun": {
    vietnamese: "nhận thức khi nhìn lại, sự hiểu ra sau sự việc",
  },
  "master-hitch-verb": {
    definition: "to fasten or attach something with a hook, knot, or similar device",
    vietnamese: "móc, buộc, nối vào",
    example: "They hitched the trailer securely to the car.",
  },
  "master-hitherto-adverb": { topic: "time" },
  "master-homestead-noun": { topic: "places" },
  "master-hotelier-noun": {
    example: "The hotelier renovated every room before the summer season.",
    topic: "work",
  },
  "master-huddle-noun": {
    definition: "a small close group or a brief private meeting",
    vietnamese: "nhóm tụ lại, cuộc hội ý nhanh",
    example: "The coaches held a quick huddle before the final play.",
  },
  "master-huddle-verb": {
    vietnamese: "tụm lại, co cụm",
  },
  "master-hull-noun": {
    definition: "the main body or outer shell of a ship or boat",
    vietnamese: "thân tàu, vỏ tàu",
    topic: "travel",
  },
  "master-hypothesis-noun": { topic: "science" },
  "master-hypothetical-adjective": {
    vietnamese: "giả định, mang tính giả thuyết",
    example: "The class discussed a hypothetical situation involving first contact.",
    topic: "thinking",
  },
  "master-idiomatic-adjective": {
    definition: "natural and correct in expression for native speakers of a language",
    vietnamese: "tự nhiên theo cách nói bản ngữ, thuộc thành ngữ",
    example: "Regular conversation practice made her English more idiomatic.",
    topic: "language",
  },
  "master-idiomatically-adverb": { topic: "language" },
  "master-idiosyncrasy-noun": {
    definition: "a distinctive habit, feature, or manner specific to a person or thing",
    vietnamese: "nét riêng, thói quen đặc trưng",
    example: "One idiosyncrasy of the old clock is its irregular chime.",
  },
  "master-idiosyncratic-adjective": {
    vietnamese: "đặc trưng riêng, khác biệt",
  },
  "master-idle-verb": {
    definition: "to run without doing useful work or to remain inactive",
    vietnamese: "chạy không tải, để không, nhàn rỗi",
    topic: "technology",
  },
  "master-ignominious-adjective": {
    example: "The army suffered an ignominious retreat after the failed campaign.",
  },
  "master-ignominiously-adverb": {
    vietnamese: "một cách nhục nhã, đáng hổ thẹn",
    topic: "description",
  },
  "master-impeccable-adjective": {
    definition: "free from faults or mistakes; flawless",
    example: "Her impeccable research record impressed the selection committee.",
  },
  "master-impeccably-adverb": {
    definition: "in a flawless or faultless way",
    vietnamese: "một cách hoàn hảo, không chê vào đâu được",
    topic: "description",
  },
  "master-imperceptible-adjective": {
    example: "There was an almost imperceptible drop in temperature.",
  },
  "master-imperceptibly-adverb": { topic: "description" },
  "master-imposition-noun": {
    definition: "the act of forcing an unwelcome rule, tax, or burden on someone",
    vietnamese: "sự áp đặt, sự đánh thuế",
    topic: "society",
  },
  "master-impressionistic-adjective": {
    vietnamese: "mang tính ấn tượng, dựa trên cảm nhận chủ quan",
    topic: "arts",
  },
  "master-inartistic-adjective": {
    vietnamese: "thiếu tính nghệ thuật, không có thẩm mỹ",
    example: "Critics dismissed the monument as clumsy and inartistic.",
    topic: "arts",
  },
  "master-incumbent-adjective": { topic: "society" },
  "master-incumbent-noun": {
    example: "The incumbent faces two challengers in the upcoming election.",
    topic: "society",
  },
  "master-indignant-adjective": {
    example: "Residents issued an indignant denial of the accusation.",
    topic: "emotions",
  },
  "master-indignantly-adverb": {
    vietnamese: "một cách phẫn nộ, bất bình",
    example: "She indignantly rejected the claim that her team had cheated.",
    topic: "description",
  },
  "master-individualism-noun": {
    definition: "the principle of personal independence and individual freedom of action",
    topic: "society",
  },
  "master-indolent-adjective": {
    example: "The indolent employee avoided every task that required effort.",
  },
  "master-indolently-adverb": {
    vietnamese: "một cách lười biếng, uể oải",
    topic: "description",
  },
  "master-induce-verb": { topic: "health" },
  "master-inducement-noun": {
    vietnamese: "sự khuyến khích, động cơ thúc đẩy",
    topic: "work",
  },
  "master-indulgence-noun": {
    definition: "the act of allowing a pleasure or treating someone with excessive leniency",
    vietnamese: "sự nuông chiều, sự hưởng thụ",
    example: "Buying the expensive dessert was a rare indulgence.",
    topic: "daily-life",
  },
  "master-indulgently-adverb": {
    vietnamese: "một cách nuông chiều, khoan dung",
    example: "The grandmother smiled indulgently at the children's noisy game.",
    topic: "description",
  },
  "master-infallibility-noun": {
    definition: "the quality of being incapable of making a mistake",
    example: "No scientific theory can claim absolute infallibility.",
  },
  "master-informant-noun": {
    example: "A confidential informant gave police details about the planned robbery.",
  },
  "master-ingratiate-verb": {
    example: "He tried to ingratiate himself with his colleagues by offering help.",
    topic: "communication",
  },
  "master-ingratiating-adjective": {
    example: "She greeted the committee with an ingratiating smile.",
  },
  "master-ingratiatingly-adverb": {
    vietnamese: "một cách lấy lòng, nịnh nọt",
    topic: "description",
  },
  "master-innuendo-noun": {
    definition: "an indirect and often critical or suggestive remark",
    vietnamese: "lời ám chỉ, lời nói bóng gió",
    example: "The article relied on innuendo rather than presenting evidence.",
  },
  "master-inscrutable-adjective": {
    example: "Her inscrutable expression revealed nothing about the decision.",
  },
  "master-insular-adjective": {
    definition: "relating to an island or unwilling to consider ideas beyond one's own experience",
    vietnamese: "thuộc đảo, biệt lập, thiển cận",
    example: "The community gradually abandoned its insular outlook.",
  },
  "master-integration-noun": {
    definition: "the process of combining separate parts into a unified whole",
    vietnamese: "sự hợp nhất, sự tích hợp",
    topic: "society",
  },
  "master-interlude-noun": {
    example: "A brief musical interlude separated the two acts.",
  },
  "master-intermediary-noun": {
    example: "A neutral intermediary carried messages between the two sides.",
  },
  "master-interrogate-verb": {
    definition: "to question someone formally and thoroughly, especially in an investigation",
    topic: "society",
  },
  "master-interrogation-noun": { topic: "society" },
  "master-interrogative-adjective": {
    definition: "having a grammatical form used to ask a question",
    vietnamese: "nghi vấn, dùng để hỏi",
    topic: "language",
  },
  "master-interrogatively-adverb": {
    vietnamese: "một cách dò hỏi, nghi vấn",
    topic: "language",
  },
  "master-intrinsic-adjective": {
    definition: "belonging naturally to something as an essential part of it",
    vietnamese: "nội tại, vốn có, thuộc bản chất",
  },
  "master-intrinsically-adverb": { topic: "description" },
  "master-ironic-adjective": {
    example: "It was ironic that the fire station itself caught fire.",
  },
  "master-irrevocable-adjective": {
    example: "Once signed, the transfer of ownership became irrevocable.",
  },
  "master-irrevocably-adverb": { topic: "description" },
  "master-jargon-noun": {
    definition: "specialized words and expressions used by a particular profession or group",
    vietnamese: "thuật ngữ chuyên ngành, biệt ngữ",
    example: "Doctors often use medical jargon that patients may not understand.",
    topic: "language",
  },
  "master-kinetic-adjective": {
    vietnamese: "thuộc chuyển động, thuộc động năng",
    example: "The falling water's kinetic energy turns the turbine.",
    topic: "science",
  },
  "master-lassitude-noun": {
    definition: "a state of physical or mental weariness and lack of energy",
    topic: "health",
  },
  "master-laud-verb": {
    definition: "to praise someone or something highly",
    example: "Critics lauded the novel for its originality and wit.",
  },
  "master-laudatory-adjective": {
    example: "The committee issued a laudatory statement about her service.",
  },
  "master-liaise-verb": {
    example: "Our coordinator will liaise with local officials throughout the project.",
  },
  "master-locomotion-noun": { topic: "movement" },
  "master-locomotive-noun": {
    example: "A diesel locomotive pulled the freight train through the valley.",
    topic: "travel",
  },
  "master-loiter-verb": { topic: "movement" },
  "master-luridly-adverb": {
    vietnamese: "một cách giật gân, ghê rợn",
    topic: "description",
  },
  "master-lyrical-adjective": { topic: "arts" },
  "master-lyrically-adverb": {
    vietnamese: "một cách trữ tình, nên thơ",
    topic: "arts",
  },
  "master-lyricist-noun": {
    vietnamese: "nhà viết lời bài hát",
    topic: "arts",
  },
  "master-maggot-noun": {
    definition: "the soft, legless larva of a fly",
    example: "A maggot emerged from the spoiled fruit.",
  },
  "master-magnanimity-noun": {
    vietnamese: "lòng hào hiệp, sự cao thượng",
  },
  "master-magnanimous-adjective": {
    example: "The champion was magnanimous toward her defeated opponent.",
  },
  "master-magnanimously-adverb": { topic: "description" },
  "master-magnate-noun": {
    vietnamese: "ông trùm kinh doanh, nhà tài phiệt",
    example: "The media magnate acquired two regional newspapers.",
    topic: "business",
  },
  "master-magpie-noun": {
    example: "A magpie carried a twig to its nest.",
  },
  "master-malicious-adjective": {
    definition: "intended to cause harm, distress, or damage",
    example: "The website removed several malicious and false accusations.",
  },
  "master-maliciously-adverb": {
    vietnamese: "một cách hiểm độc, có ác ý",
    example: "He maliciously spread a false rumor about his colleague.",
    topic: "description",
  },
  "master-malleability-noun": { topic: "science" },
  "master-malleable-adjective": {
    example: "Copper is malleable enough to be shaped into thin sheets.",
    topic: "science",
  },
  "master-mariner-noun": {
    example: "The experienced mariner navigated safely through the narrow channel.",
    topic: "travel",
  },
  "master-marvel-noun": {
    example: "The ancient aqueduct remains a marvel of engineering.",
  },
  "master-materialism-noun": {
    definition: "the philosophical belief that matter is the fundamental substance of reality",
    vietnamese: "chủ nghĩa duy vật",
    example: "The seminar compared materialism with several forms of idealism.",
    topic: "thinking",
  },
  "master-materialistic-adjective": {
    vietnamese: "chạy theo vật chất, coi trọng của cải",
    example: "He became less materialistic after volunteering in the community.",
  },
  "master-maverick-noun": {
    vietnamese: "người độc lập, người không theo khuôn phép",
  },
  "master-mediate-verb": {
    example: "A neutral diplomat mediated a settlement between the two countries.",
  },
  "master-mediocrity-noun": {
    definition: "the quality of being merely ordinary and lacking excellence",
    vietnamese: "sự tầm thường, mức độ xoàng xĩnh",
    example: "The director refused to accept mediocrity in the final production.",
  },
  "master-melancholy-adjective": {
    example: "A melancholy melody drifted through the empty hall.",
    topic: "emotions",
  },
  "master-melodious-adjective": { topic: "arts" },
  "master-melodiously-adverb": {
    vietnamese: "một cách du dương, êm tai",
    example: "The choir sang melodiously throughout the evening concert.",
    topic: "arts",
  },
  "master-menace-noun": { topic: "safety" },
  "master-menacingly-adverb": {
    vietnamese: "một cách đe dọa, hăm dọa",
    topic: "description",
  },
  "master-menial-adjective": {
    vietnamese: "tầm thường, ít kỹ năng",
    topic: "work",
  },
  "master-mercenary-noun": {
    example: "The government hired a mercenary to train its forces.",
  },
  "master-merit-noun": {
    definition: "a quality or achievement that deserves praise or reward",
    vietnamese: "phẩm chất tốt, giá trị, công lao",
    example: "The committee judged each proposal on its own merit.",
  },
  "master-merit-verb": {
    definition: "to deserve attention, praise, or reward",
    example: "The discovery merits further scientific investigation.",
  },
  "master-mesh-verb": {
    definition: "to interlock or combine smoothly and effectively",
    vietnamese: "khớp với nhau, kết hợp hài hòa",
    example: "The two teams' working methods mesh surprisingly well.",
    topic: "relationships",
  },
  "master-mesmeric-adjective": {
    vietnamese: "mê hoặc, cuốn hút như thôi miên",
  },
  "master-meteorological-adjective": {
    vietnamese: "thuộc khí tượng, thuộc thời tiết",
    example: "Meteorological data helped forecasters track the approaching storm.",
    topic: "weather",
  },
  "master-meteorology-noun": {
    example: "She studied meteorology before becoming a weather forecaster.",
    topic: "science",
  },
  "master-methodological-adjective": {
    vietnamese: "thuộc phương pháp luận",
    example: "The reviewers identified several methodological errors in the study.",
    topic: "science",
  },
  "master-methodologically-adverb": { topic: "description" },
  "master-methodology-noun": {
    vietnamese: "phương pháp luận",
    example: "The paper explains its research methodology in a separate section.",
  },
  "master-meticulously-adverb": {
    vietnamese: "một cách tỉ mỉ, kỹ lưỡng",
    topic: "description",
  },
  "master-midwifery-noun": { topic: "health" },
  "master-minefield-noun": {
    definition: "an area containing explosive mines or a situation full of hidden difficulties",
    topic: "safety",
  },
  "master-modernism-noun": {
    vietnamese: "chủ nghĩa hiện đại",
    topic: "arts",
  },
  "master-monastic-adjective": {
    vietnamese: "thuộc tu viện, khổ hạnh",
    topic: "culture",
  },
  "master-moor-noun": {
    vietnamese: "người Moor, người Hồi giáo Bắc Phi",
    topic: "history",
  },
  "master-mundanity-noun": {
    definition: "the quality of being ordinary, dull, or lacking excitement",
  },
  "master-munificence-noun": {
    example: "The library was built through the munificence of a local donor.",
  },
  "master-muscle-bound-adjective": {
    example: "He arrived accompanied by two muscle-bound bodyguards.",
    topic: "body",
  },
  "master-mutinous-adjective": { topic: "society" },
  "master-nigh-adverb": {
    definition: "close to a specified time, place, or condition",
    topic: "time",
  },
  "master-nonchalant-adjective": {
    vietnamese: "thản nhiên, lãnh đạm, hờ hững",
    example: "He gave a nonchalant shrug despite the serious warning.",
  },
  "master-nonchalantly-adverb": {
    vietnamese: "một cách thản nhiên, hờ hững",
    topic: "description",
  },
  "master-nostalgia-noun": {
    vietnamese: "nỗi hoài niệm, nỗi nhớ quá khứ",
  },
  "master-nostalgic-adjective": {
    vietnamese: "hoài niệm, nhớ về quá khứ",
    topic: "emotions",
  },
  "master-nostalgically-adverb": {
    vietnamese: "một cách hoài niệm, lưu luyến",
    topic: "description",
  },
  "master-notoriety-noun": {
    vietnamese: "tai tiếng, sự nổi tiếng theo nghĩa xấu",
    example: "The fraudulent scheme brought the company international notoriety.",
  },
  "master-notoriously-adverb": { topic: "description" },
  "master-octogenarian-noun": {
    vietnamese: "người ở độ tuổi tám mươi",
  },
  "master-opacity-noun": {
    definition: "the quality of preventing light from passing through",
  },
  "master-opulence-noun": {
    definition: "great wealth or luxurious abundance",
    example: "The palace's opulence contrasted sharply with the surrounding poverty.",
  },
  "master-opulent-adjective": {
    example: "Guests dined in an opulent hall decorated with gold and silk.",
  },
  "master-opulently-adverb": {
    vietnamese: "một cách xa hoa, sang trọng",
    topic: "description",
  },
  "master-ornate-adjective": {
    example: "An ornate frame surrounded the seventeenth-century portrait.",
  },
  "master-ostensible-adjective": {
    example: "The ostensible purpose of the visit was to discuss trade.",
  },
  "master-ostensibly-adverb": {
    example: "The meeting was ostensibly about budgets, but staffing dominated the discussion.",
  },
  "master-outmoded-adjective": {
    example: "The policy relies on an outmoded view of family life.",
  },
  "master-painstaking-adjective": {
    example: "Painstaking research revealed the manuscript's true origin.",
  },
  "master-painstakingly-adverb": {
    vietnamese: "một cách công phu, cẩn thận",
    example: "The conservator painstakingly restored the damaged painting.",
    topic: "description",
  },
  "master-palatable-adjective": {
    vietnamese: "ngon miệng, dễ chấp nhận",
    example: "The revised proposal was more palatable to skeptical voters.",
  },
  "master-palate-noun": {
    example: "The hot drink burned the roof of his palate.",
  },
  "master-parable-noun": { topic: "culture" },
  "master-parameter-noun": { topic: "science" },
  "master-parasitic-adjective": {
    example: "The patient received treatment for a parasitic infection.",
    topic: "health",
  },
  "master-parochial-adjective": {
    definition: "relating to a parish or limited to a narrow local outlook",
    vietnamese: "thuộc giáo xứ, thiển cận, cục bộ",
    example: "The committee was criticized for its parochial attitude toward reform.",
    topic: "society",
  },
  "master-pedestrian-adjective": {
    vietnamese: "tẻ nhạt, thiếu sáng tạo",
    example: "The talented cast could not rescue the pedestrian plot.",
  },
  "master-perch-verb": {
    vietnamese: "đậu, ngồi chênh vênh",
  },
  "master-pervasive-adjective": {
    vietnamese: "lan tỏa, hiện diện khắp nơi",
    example: "A pervasive sense of unease filled the office.",
  },
  "master-pervasiveness-noun": {
    vietnamese: "tính lan rộng, sự hiện diện khắp nơi",
    example: "The survey revealed the pervasiveness of online misinformation.",
  },
  "master-perverse-adjective": {
    example: "He took perverse satisfaction in obstructing the simple solution.",
  },
  "master-phantom-noun": {
    example: "The villagers claimed that a phantom haunted the ruined castle.",
    topic: "culture",
  },
  "master-philanthropic-adjective": {
    vietnamese: "từ thiện, nhân đạo",
    example: "Her philanthropic foundation funds schools in rural communities.",
  },
  "master-philanthropically-adverb": {
    vietnamese: "theo hướng từ thiện, một cách nhân đạo",
    topic: "description",
  },
  "master-philanthropist-noun": {
    vietnamese: "nhà hảo tâm, người làm từ thiện",
  },
  "master-philanthropy-noun": {
    vietnamese: "hoạt động từ thiện, lòng nhân ái",
    topic: "society",
  },
  "master-philistine-noun": {
    vietnamese: "người không quan tâm đến văn hóa nghệ thuật",
  },
  "master-physiological-adjective": {
    vietnamese: "thuộc sinh lý, thuộc chức năng cơ thể",
    example: "Stress can trigger several physiological responses.",
    topic: "health",
  },
  "master-physiologically-adverb": {
    vietnamese: "về mặt sinh lý",
    example: "The two species are physiologically adapted to different climates.",
    topic: "health",
  },
  "master-pluck-noun": {
    vietnamese: "lòng can đảm, sự gan dạ",
    example: "She showed remarkable pluck by continuing despite the injury.",
  },
  "master-plutocrat-noun": {
    vietnamese: "nhà tài phiệt, người giàu có quyền lực",
    topic: "society",
  },
  "master-polysyllabic-adjective": { topic: "language" },
  "master-ponderous-adjective": {
    vietnamese: "nặng nề, chậm chạp",
    example: "The ponderous machine moved slowly across the factory floor.",
  },
  "master-ponderously-adverb": {
    vietnamese: "một cách nặng nề, chậm chạp",
    topic: "description",
  },
  "master-portraiture-noun": {
    definition: "the art or practice of creating portraits",
    vietnamese: "nghệ thuật vẽ chân dung",
    topic: "arts",
  },
  "master-postural-adjective": {
    vietnamese: "thuộc tư thế",
    example: "The therapist recommended exercises to correct postural problems.",
    topic: "health",
  },
  "master-posture-verb": {
    vietnamese: "tạo dáng, làm bộ, phô trương",
    topic: "communication",
  },
  "master-posturing-noun": { topic: "communication" },
  "master-practitioner-noun": {
    vietnamese: "người hành nghề, chuyên gia thực hành",
    topic: "work",
  },
  "master-precocious-adjective": {
    vietnamese: "phát triển sớm, sớm trưởng thành",
    example: "The precocious child began reading novels at age five.",
  },
  "master-precociously-adverb": {
    vietnamese: "một cách sớm phát triển, sớm trưởng thành",
    topic: "description",
  },
  "master-predilection-noun": {
    vietnamese: "sự ưa thích đặc biệt, thiên hướng",
    example: "She has a predilection for complex historical novels.",
  },
  "master-preeminent-adjective": {
    example: "She became the preeminent scholar in her field.",
  },
  "master-prescriptive-adjective": {
    vietnamese: "mang tính quy tắc, chỉ dẫn",
    topic: "language",
  },
  "master-pressurize-verb": {
    example: "The system pressurizes the cabin before takeoff.",
  },
  "master-presuppose-verb": {
    definition: "to assume something is true as a necessary condition for an argument or action",
    example: "The plan presupposes that sufficient funding will remain available.",
  },
  "master-primeval-adjective": {
    example: "Ancient trees formed a dense primeval forest.",
    topic: "nature",
  },
  "master-prise-verb": {
    definition: "to move or force something open using leverage",
  },
  "master-prissy-adjective": {
    definition: "excessively concerned with proper behavior, neatness, or formality",
    vietnamese: "quá câu nệ, khó tính kiểu cách",
  },
  "master-procedural-adjective": {
    example: "The court dismissed the case because of a procedural error.",
    topic: "society",
  },
  "master-profitability-noun": {
    definition: "the ability of a business or activity to produce a profit",
    vietnamese: "khả năng sinh lời, mức lợi nhuận",
    example: "Higher transport costs reduced the farm's profitability.",
    topic: "money",
  },
  "master-prolong-verb": {
    definition: "to extend the duration of something",
    example: "Further delays could prolong the negotiations for several months.",
  },
  "master-promenade-noun": {
    example: "Families took an evening promenade along the seafront.",
    topic: "movement",
  },
  "master-prone-adjective": {
    vietnamese: "có xu hướng, dễ mắc phải",
    example: "This low-lying road is prone to flooding after heavy rain.",
  },
  "master-proportional-adjective": {
    definition: "corresponding appropriately in size, amount, or degree",
  },
  "master-proportionally-adverb": { topic: "description" },
  "master-proprietary-adjective": {
    vietnamese: "độc quyền, thuộc sở hữu riêng",
    topic: "business",
  },
  "master-proscribe-verb": {
    definition: "to officially forbid or prohibit something",
    topic: "society",
  },
  "master-proscription-noun": {
    definition: "an official prohibition of an action, practice, or group",
    vietnamese: "sự cấm đoán, sự đặt ngoài vòng pháp luật",
    example: "The law imposed a strict proscription on the sale of the substance.",
    topic: "society",
  },
  "master-prostrate-verb": {
    example: "The worshippers prostrated themselves before the shrine.",
  },
  "master-protrude-verb": {
    example: "A rusty nail protruded from the wooden board.",
    topic: "movement",
  },
  "master-provincial-adjective": {
    vietnamese: "thuộc tỉnh, thuộc địa phương",
    example: "The provincial government announced a new transport plan.",
    topic: "society",
  },
  "master-provocation-noun": { topic: "communication" },
  "master-puritanical-adjective": {
    vietnamese: "khắt khe về đạo đức, khổ hạnh",
    topic: "culture",
  },
  "master-qualitative-adjective": {
    vietnamese: "định tính, thuộc chất lượng",
    example: "The researchers conducted a qualitative analysis of the interviews.",
    topic: "science",
  },
  "master-rebound-noun": {
    definition: "a bounce back or a recovery after a decline or setback",
    topic: "change",
  },
  "master-rebound-verb": { topic: "change" },
  "master-recitation-noun": {
    definition: "the act of saying a poem, passage, or other text aloud from memory",
    vietnamese: "sự đọc thuộc lòng, bài ngâm đọc",
    example: "Her recitation of the poem held the audience silent.",
  },
  "master-reclusive-adjective": {
    example: "The reclusive author rarely appeared in public.",
  },
  "master-reconcile-verb": { topic: "relationships" },
  "master-reconciliation-noun": { topic: "relationships" },
  "master-recourse-noun": {
    example: "Residents had no recourse except to challenge the decision in court.",
    topic: "society",
  },
  "master-recuperation-noun": { topic: "health" },
  "master-recuperative-adjective": {
    definition: "helping someone recover strength or health after illness or exhaustion",
    vietnamese: "giúp hồi phục sức khỏe, phục hồi",
    example: "A quiet week by the sea had a recuperative effect.",
    topic: "health",
  },
  "master-redundancy-noun": {
    definition: "the state of being unnecessary or the loss of a job because it is no longer needed",
    vietnamese: "sự dư thừa, tình trạng mất việc do cắt giảm",
    topic: "work",
  },
  "master-regulatory-adjective": { topic: "society" },
  "master-reissue-verb": {
    definition: "to publish, provide, or issue something again",
    example: "The agency will reissue the corrected document next week.",
    topic: "communication",
  },
  "master-relegate-verb": {
    definition: "to assign someone or something to a lower rank or less important position",
    vietnamese: "hạ cấp, gạt sang vị trí kém quan trọng",
    example: "The defeat relegated the club to a lower division.",
  },
  "master-remit-verb": {
    vietnamese: "chuyển tiền, gửi tiền",
    example: "Customers can remit payment through the bank's online service.",
    topic: "money",
  },
  "master-repose-noun": {
    example: "After the long journey, she sought repose in the quiet garden.",
  },
  "master-repose-verb": {
    definition: "to rest or lie down in a calm, relaxed state",
    vietnamese: "nghỉ ngơi, nằm nghỉ",
    example: "The travelers reposed beneath the trees during the hottest hour.",
    topic: "daily-life",
  },
  "master-reproach-verb": {
    definition: "to criticize someone for actions that caused disappointment or shame",
  },
  "master-reptilian-adjective": {
    vietnamese: "thuộc loài bò sát, giống bò sát",
    topic: "animals",
  },
  "master-repute-noun": {
    definition: "the general opinion held about a person or thing",
    vietnamese: "danh tiếng, tiếng tăm",
    example: "The restaurant is of high repute among local chefs.",
    topic: "society",
  },
  "master-requisition-noun": { topic: "work" },
  "master-residual-adjective": {
    example: "Residual heat kept the oven warm after it was switched off.",
  },
  "master-residue-noun": {
    definition: "a small amount that remains after the main part has been removed or used",
    example: "A sticky residue remained after the label was removed.",
  },
  "master-retrospection-noun": {
    definition: "the act of looking back on or reviewing past events",
    vietnamese: "sự hồi tưởng, sự nhìn lại quá khứ",
    example: "In retrospection, the warning signs seem obvious.",
    topic: "thinking",
  },
  "master-retrospective-adjective": {
    example: "The museum organized a retrospective exhibition of her early work.",
  },
  "master-revile-verb": {
    example: "Opponents reviled the minister in a series of hostile speeches.",
  },
  "master-revulsion-noun": {
    vietnamese: "sự ghê tởm, cảm giác kinh hãi",
  },
  "master-rhetoric-noun": { topic: "communication" },
  "master-rhetorically-adverb": {
    vietnamese: "một cách tu từ, để nhấn mạnh hơn là hỏi",
    topic: "language",
  },
  "master-rickety-adjective": {
    vietnamese: "ọp ẹp, không vững chắc",
    example: "They crossed the stream on a rickety wooden bridge.",
  },
  "master-rife-adjective": {
    example: "Rumors were rife throughout the organization after the announcement.",
  },
  "master-rift-noun": { topic: "relationships" },
  "master-romper-noun": {
    definition: "a one-piece garment worn by a baby or young child",
    vietnamese: "bộ áo liền quần cho trẻ nhỏ",
    topic: "clothes",
  },
  "master-scavenger-noun": {
    vietnamese: "động vật ăn xác thối",
    example: "Vultures are important scavengers in many ecosystems.",
  },
  "master-scroll-noun": {
    vietnamese: "cuộn giấy, cuộn da, bản cuộn",
    example: "The archaeologist carefully unrolled the ancient scroll.",
    topic: "history",
  },
  "master-secular-adjective": {
    vietnamese: "thế tục, không thuộc tôn giáo",
    topic: "culture",
  },
  "master-secure-verb": {
    definition: "to obtain, protect, or fasten something so that it is safe",
    vietnamese: "đạt được, bảo vệ, cố định chắc chắn",
    example: "Workers secured the ladder firmly before climbing it.",
    topic: "safety",
  },
  "master-seismic-adjective": {
    vietnamese: "thuộc địa chấn, do động đất",
    topic: "science",
  },
  "master-shamble-verb": {
    example: "The exhausted hikers shambled toward the shelter.",
  },
  "master-sheaf-noun": {
    example: "She carried a sheaf of documents into the meeting.",
  },
  "master-shimmer-verb": { topic: "description" },
  "master-slab-noun": {
    example: "Workers lowered a concrete slab into place.",
  },
  "master-slither-verb": {
    definition: "to move smoothly over a surface with a twisting or sliding motion",
  },
  "master-snippet-noun": {
    vietnamese: "đoạn ngắn, mẩu nhỏ",
    topic: "communication",
  },
  "master-snobbery-noun": { topic: "society" },
  "master-soliloquize-verb": { topic: "arts" },
  "master-solitary-noun": {
    example: "The elderly solitary lived quietly at the edge of the village.",
  },
  "master-solitude-noun": {
    example: "She sought solitude in the mountains after a difficult year.",
  },
  "master-spatial-adjective": {
    vietnamese: "thuộc không gian",
    topic: "science",
  },
  "master-spatially-adverb": {
    vietnamese: "về mặt không gian",
    example: "The two populations are spatially separated by the river.",
    topic: "description",
  },
  "master-splinter-verb": {
    definition: "to break into small, thin, sharp fragments",
    example: "The wooden board splintered under the impact.",
    topic: "change",
  },
  "master-spontaneity-noun": {
    vietnamese: "tính tự phát, sự tự nhiên",
    example: "The spontaneity of her laughter relaxed everyone in the room.",
  },
  "master-spuriously-adverb": {
    vietnamese: "một cách sai lệch, không xác thực",
    topic: "description",
  },
  "master-sterility-noun": {
    vietnamese: "tình trạng vô trùng",
    topic: "health",
  },
  "master-stipulate-verb": {
    definition: "to state an exact requirement as part of an agreement",
    topic: "business",
  },
  "master-stipulation-noun": { topic: "society" },
  "master-stoicism-noun": {
    definition: "calm endurance of pain or difficulty without complaint",
    vietnamese: "sự khắc kỷ, thái độ bình thản chịu đựng",
    topic: "emotions",
  },
  "master-stratosphere-noun": { topic: "science" },
  "master-subsidize-verb": { topic: "money" },
  "master-subsidy-noun": {
    vietnamese: "khoản trợ cấp, tiền hỗ trợ",
    example: "The government provides a housing subsidy to low-income families.",
  },
  "master-substantiate-verb": {
    example: "The witness could not substantiate the allegation with evidence.",
  },
  "master-succumb-verb": {
    definition: "to stop resisting pressure, temptation, illness, or an opposing force",
    example: "After hours of pressure, the committee finally succumbed to the demands.",
    topic: "actions",
  },
  "master-sulphur-noun": {
    vietnamese: "lưu huỳnh",
    topic: "science",
  },
  "master-sulphuric-adjective": {
    vietnamese: "thuộc lưu huỳnh, chứa lưu huỳnh",
    example: "The laboratory stores sulphuric compounds in sealed containers.",
    topic: "science",
  },
  "master-summarily-adverb": {
    vietnamese: "một cách tức khắc, không qua đầy đủ thủ tục",
    topic: "description",
  },
  "master-superfluously-adverb": { topic: "description" },
  "master-surge-verb": { topic: "change" },
  "master-surrealism-noun": { topic: "arts" },
  "master-surrealist-noun": { topic: "arts" },
  "master-swivel-verb": {
    example: "She swiveled her chair to face the window.",
  },
  "master-syllabic-adjective": {
    vietnamese: "thuộc âm tiết",
    example: "The linguist analyzed the poem's syllabic structure.",
    topic: "language",
  },
  "master-synthesis-noun": {
    example: "Our chemistry teacher explained ammonia synthesis today.",
    topic: "science",
  },
  "master-tactic-noun": {
    example: "Delaying the vote was a tactic to gain more support.",
  },
  "master-tactical-adjective": {
    vietnamese: "thuộc chiến thuật, có tính chiến thuật",
    example: "The coach admitted making a tactical error before halftime.",
    topic: "thinking",
  },
  "master-tactically-adverb": {
    vietnamese: "về mặt chiến thuật, một cách có chiến thuật",
    topic: "description",
  },
  "master-teem-verb": {
    definition: "to be full of people, animals, or activity",
    vietnamese: "đầy, có rất nhiều",
    example: "The wetland teems with birds during the migration season.",
    topic: "states",
  },
  "master-tenacious-adjective": {
    definition: "persistent and determined, or holding firmly to something",
    vietnamese: "kiên trì, bền bỉ, bám chắc",
    example: "The tenacious researcher pursued the answer for several years.",
  },
  "master-tenaciously-adverb": {
    vietnamese: "một cách kiên trì, bền bỉ",
    topic: "description",
  },
  "master-tenacity-noun": {
    definition: "the determination to continue despite difficulty or opposition",
    vietnamese: "sự kiên trì, tính bền bỉ",
  },
  "master-topographical-adjective": {
    vietnamese: "thuộc địa hình, thuộc địa mạo",
    example: "The survey produced a detailed topographical map of the valley.",
    topic: "science",
  },
  "master-topographically-adverb": { topic: "description" },
  "master-topography-noun": {
    vietnamese: "địa hình, địa mạo",
    topic: "science",
  },
  "master-topple-verb": {
    definition: "to cause something to fall or to remove a person or government from power",
    vietnamese: "làm đổ, lật đổ",
    example: "Strong winds toppled several trees beside the road.",
    topic: "actions",
  },
  "master-totemic-adjective": {
    vietnamese: "thuộc vật tổ, mang tính biểu tượng",
    example: "The eagle has totemic significance for the community.",
    topic: "culture",
  },
  "master-transmitter-noun": {
    definition: "a device, person, or organism that sends a signal or spreads something",
    vietnamese: "thiết bị phát, người hoặc vật truyền",
    topic: "technology",
  },
  "master-treacherous-adjective": {
    definition: "dangerous and unpredictable or deliberately disloyal",
    vietnamese: "nguy hiểm, phản trắc",
    example: "Drivers avoided the treacherous mountain road during the storm.",
    topic: "safety",
  },
  "master-treacherously-adverb": {
    vietnamese: "một cách phản bội, xảo trá",
    example: "The commander acted treacherously by revealing the plan to the enemy.",
    topic: "description",
  },
  "master-treachery-noun": { topic: "society" },
  "master-turret-noun": { topic: "places" },
  "master-unencumbered-adjective": {
    definition: "free from a burden, restriction, or obstacle",
    vietnamese: "không bị cản trở, không vướng bận",
    example: "Without the heavy luggage, they could travel unencumbered.",
  },
  "master-unequivocal-adjective": {
    example: "The committee gave its unequivocal support to the proposal.",
  },
  "master-unequivocally-adverb": {
    vietnamese: "một cách rõ ràng, dứt khoát",
    topic: "description",
  },
  "master-unnerve-verb": {
    definition: "to cause someone to lose confidence, courage, or composure",
  },
  "master-unnerving-adjective": {
    definition: "causing someone to feel anxious, frightened, or less confident",
    vietnamese: "gây bất an, khiến mất bình tĩnh",
    example: "An unnerving silence settled over the crowded room.",
  },
  "master-unpromising-adjective": {
    example: "The team recovered despite an unpromising start to the season.",
  },
  "master-unravel-verb": {
    definition: "to separate tangled threads or gradually solve a complicated mystery",
    vietnamese: "tháo rối, làm sáng tỏ",
    example: "Detectives worked for months to unravel the complex scheme.",
  },
  "master-unsurpassed-adjective": {
    vietnamese: "không gì sánh bằng, vượt trội",
  },
  "master-unsuspected-adjective": {
    example: "The quiet clerk remained unsuspected until new evidence emerged.",
  },
  "master-utilitarian-adjective": {
    vietnamese: "thiết thực, chú trọng công dụng",
    example: "The office furniture is plain but highly utilitarian.",
  },
  "master-utilize-verb": {
    definition: "to make practical or effective use of something",
    vietnamese: "sử dụng, tận dụng",
    example: "The program will utilize local expertise to train new staff.",
    topic: "actions",
  },
  "master-venomous-adjective": {
    example: "Several venomous snakes inhabit the region.",
    topic: "animals",
  },
  "master-venomously-adverb": {
    vietnamese: "một cách cay độc, đầy ác ý",
    topic: "description",
  },
  "master-vermin-noun": {
    definition: "small animals or insects that are harmful, destructive, or difficult to control",
    vietnamese: "sâu bọ, động vật gây hại",
    topic: "animals",
  },
  "master-vestigial-adjective": {
    vietnamese: "còn sót lại, thoái hóa",
    topic: "science",
  },
  "master-vicinity-noun": {
    vietnamese: "khu vực lân cận, vùng gần đó",
  },
  "master-vindicate-verb": {
    definition: "to clear someone of blame or prove that a claim was justified",
    topic: "society",
  },
  "master-vindication-noun": { topic: "society" },
  "master-vocational-adjective": {
    vietnamese: "thuộc đào tạo nghề, hướng nghiệp",
    example: "The college offers vocational courses in construction and nursing.",
    topic: "education",
  },
  "master-voracity-noun": {
    definition: "an excessive appetite or eagerness to consume something",
    vietnamese: "tính háu ăn, sự ngấu nghiến",
    example: "The wolves attacked their meal with astonishing voracity.",
    topic: "animals",
  },
  "master-wallow-verb": {
    definition: "to roll or lie in mud or water, or indulge excessively in an emotion",
    vietnamese: "đằm mình, lăn mình; đắm chìm",
    topic: "animals",
  },
  "master-wane-verb": {
    definition: "to decrease gradually in size, strength, or importance",
    vietnamese: "giảm dần, suy yếu, khuyết dần",
  },
  "master-wayward-adjective": {
    example: "The mentor patiently guided the wayward student back to school.",
  },
  "master-whirlwind-noun": { topic: "weather" },
  "master-wholly-adverb": { topic: "description" },
  "master-wordsmith-noun": { topic: "arts" },
  "master-zoologist-noun": {
    example: "The zoologist spent years studying primates in the wild.",
    topic: "science",
  },
  "master-zoology-noun": {
    example: "She wants to study zoology at university because she loves animals.",
    topic: "science",
  },
  "v42": { example: "Please describe your hometown to the class." },
  "a1-clean": { definition: "free from dirt or unwanted marks" },
  "master-again-adverb": {
    definition: "one more time or on another occasion",
    example: "She tried the difficult exercise again.",
  },
  "master-also-adverb": {
    definition: "in addition to what has already been mentioned",
  },
  "master-anybody-pronoun": { definition: "any person at all" },
  "master-behind-adverb": {
    example: "The younger children followed close behind.",
  },
  "master-carefully-adverb": {
    example: "They watched the demonstration very carefully.",
  },
  "master-clean-verb": {
    example: "Please clean the stove after cooking.",
  },
  "master-enjoy-verb": {
    example: "We enjoy dancing together on weekends.",
  },
  "master-everybody-pronoun": { definition: "every person in a group" },
  "master-everything-pronoun": {
    definition: "all things or all aspects of a situation",
  },
  "master-here-adverb": {
    example: "I have worked here since March.",
  },
  "master-little-adverb": {
    definition: "only to a small degree",
  },
  "master-love-verb": {
    example: "I love spending time with my family.",
  },
  "master-no-determiner": { definition: "not any or not one" },
  "master-nothing-pronoun": {
    definition: "not anything or no single thing",
  },
  "master-ready-adjective": {
    definition: "prepared and able to act",
  },
  "master-real-adverb": {
    definition: "very or extremely in informal speech",
  },
  "master-then-adverb": {
    example: "We finished dinner, and then he left.",
  },
  "master-enormous-adjective": {
    definition: "extremely large in size or amount",
  },
  "master-fairly-adverb": {
    definition: "moderately or to a reasonable degree",
  },
  "master-up-adverb": {
    example: "Look up at the night sky.",
  },
  "master-unnecessary-adjective": {
    definition: "not needed or required for a purpose",
  },
  "master-fabulous-adjective": {
    definition: "extraordinarily impressive, attractive, or enjoyable",
  },
  "master-detest-verb": {
    definition: "to dislike someone or something intensely",
  },
  "master-riveting-adjective": {
    definition: "holding someone's attention completely because it is so interesting",
  },
  "master-disdainful-adjective": {
    definition: "showing that someone or something is unworthy of respect",
  },
  "master-activity-noun": {
    definition: "something people do for work, learning, exercise, or enjoyment",
    vietnamese: "hoạt động",
    example: "Reading is a useful classroom activity.",
  },
  "master-actor-noun": {
    definition: "a person who performs a character in a play, film, or television show",
    example: "The actor played the lead role in the film.",
  },
  "master-age-noun": {
    definition: "the length of time that someone or something has existed",
    example: "Children of every age can enjoy the game.",
  },
  "master-animal-noun": { topic: "animals" },
  "master-another-determiner": { example: "Is there another way to do this?" },
  "master-answer-verb": {
    definition: "to respond to a question, request, or communication",
    topic: "communication",
  },
  "master-any-determiner": { example: "Do you want any coffee?" },
  "master-away-adverb": {
    definition: "at a distance from a particular place or person",
    vietnamese: "xa, rời xa",
    example: "The child ran away from the barking dog.",
  },
  "master-baby-noun": {
    definition: "a very young child",
    topic: "family",
  },
  "master-bag-noun": { topic: "objects" },
  "master-ball-noun": {
    definition: "a round object used in games and sports",
    vietnamese: "quả bóng",
    example: "The children kicked the ball across the field.",
    topic: "sports",
  },
  "master-bar-noun": {
    vietnamese: "quán bar",
    topic: "places",
  },
  "master-be-verb": {
    definition: "to exist or have a particular identity, state, or quality",
    vietnamese: "là, ở, tồn tại",
    example: "She wants to be a doctor.",
    topic: "states",
  },
  "master-beautiful-adjective": { vietnamese: "đẹp, xinh đẹp" },
  "master-bedroom-noun": { topic: "home" },
  "master-below-adverb": { example: "The details are listed below." },
  "master-below-preposition": { example: "The temperature fell to ten degrees below zero." },
  "master-blow-verb": { vietnamese: "thổi", example: "A cold wind was blowing from the north." },
  "master-boat-noun": { topic: "travel" },
  "master-body-noun": { topic: "body" },
  "master-boy-noun": { vietnamese: "cậu bé, con trai" },
  "master-break-verb": { example: "Be careful not to break the glass." },
  "master-brother-noun": { vietnamese: "anh trai, em trai", topic: "family" },
  "master-business-noun": { topic: "business" },
  "master-camera-noun": { vietnamese: "máy ảnh" },
  "master-card-noun": { topic: "objects" },
  "master-case-noun": { vietnamese: "hộp, bao đựng" },
  "master-change-noun": { topic: "change" },
  "master-close-adjective": { vietnamese: "thân thiết, gần gũi", topic: "relationships" },
  "master-clothes-noun": { definition: "things that people wear, such as shirts, trousers, and socks" },
  "master-code-noun": { topic: "society" },
  "master-cold-noun": { topic: "health" },
  "master-college-noun": { topic: "education" },
  "master-computer-noun": {
    example: "She uses a computer to write reports at work.",
    topic: "technology",
  },
  "master-concert-noun": {
    vietnamese: "buổi hòa nhạc",
    topic: "culture",
  },
  "master-cook-verb": { topic: "food" },
  "master-cry-noun": { vietnamese: "tiếng kêu, tiếng la, tiếng khóc" },
  "master-cut-verb": {
    definition: "to divide something with a knife or another sharp tool",
    topic: "actions",
  },
  "master-dance-verb": { example: "They danced together to the music." },
  "master-dark-adjective": { definition: "having little or no light" },
  "master-date-noun": {
    vietnamese: "ngày, ngày tháng",
    example: "What is the date today?",
  },
  "master-december-noun": { vietnamese: "tháng mười hai" },
  "master-design-noun": { topic: "planning" },
  "master-dog-noun": { topic: "animals" },
  "master-dollar-noun": { vietnamese: "đô la" },
  "master-down-adverb": { topic: "movement" },
  "master-draw-verb": {
    definition: "to make a picture with a pencil, pen, or similar tool",
    topic: "activities",
  },
  "master-dress-noun": { vietnamese: "váy, đầm" },
  "master-drink-noun": { vietnamese: "đồ uống, thức uống" },
  "master-drive-noun": { topic: "travel" },
  "master-driver-noun": { example: "The bus driver waited for the last passenger." },
  "master-drop-verb": { vietnamese: "làm rơi, thả, rơi" },
  "master-early-adverb": {
    example: "She learned to read early in life.",
    topic: "time",
  },
  "master-easy-adjective": { vietnamese: "dễ, đơn giản" },
  "master-end-noun": {
    definition: "the final part or furthest point of something",
    vietnamese: "phần cuối, điểm cuối",
    topic: "description",
  },
  "master-engineer-noun": { example: "The engineer designed a safer bridge." },
  "master-event-noun": {
    example: "The school is organizing a sports event next week.",
    topic: "events",
  },
  "master-excellent-adjective": { vietnamese: "xuất sắc, tuyệt vời" },
  "master-exercise-verb": { topic: "health" },
  "master-farm-noun": {
    example: "They raise cows and grow apples on their farm.",
    topic: "nature",
  },
  "master-fast-adverb": {
    vietnamese: "nhanh, nhanh chóng",
    example: "How fast can he get here?",
  },
  "master-father-noun": { example: "Her father works at the hospital.", topic: "family" },
  "master-feed-noun": { vietnamese: "thức ăn cho động vật" },
  "master-field-noun": { example: "Cows were grazing in the field." },
  "master-fight-noun": { definition: "a physical struggle or violent argument between people" },
  "master-file-noun": { vietnamese: "hồ sơ, tập tài liệu" },
  "master-fill-verb": { topic: "actions" },
  "master-fire-noun": { topic: "safety" },
  "master-flat-noun": { topic: "home" },
  "master-fly-noun": { topic: "animals" },
  "master-for-preposition": { vietnamese: "cho, dành cho" },
  "master-form-noun": {
    definition: "a document with spaces where information must be written",
    vietnamese: "mẫu đơn, biểu mẫu",
    example: "Please complete this application form.",
    topic: "communication",
  },
  "master-free-adjective": { vietnamese: "miễn phí" },
  "master-full-adjective": { vietnamese: "đầy" },
  "master-future-noun": { definition: "the time that has not happened yet" },
  "master-group-noun": { topic: "people" },
  "master-guy-noun": { vietnamese: "anh chàng, người đàn ông" },
  "master-hall-noun": { vietnamese: "hành lang" },
  "master-hard-adjective": { vietnamese: "cứng, rắn" },
  "master-he-pronoun": {
    definition: "a male person or animal already mentioned or understood",
    vietnamese: "anh ấy, ông ấy, cậu ấy, nó",
  },
  "master-health-noun": { topic: "health" },
  "master-hide-verb": { topic: "actions" },
  "master-history-noun": { topic: "history" },
  "master-hold-noun": { vietnamese: "sự nắm, sự giữ" },
  "master-home-noun": {
    example: "They made their home near the coast.",
    topic: "home",
  },
  "master-horse-noun": { topic: "animals" },
  "master-hurt-verb": {
    definition: "to cause pain or injury to someone or something",
    vietnamese: "làm đau, làm bị thương",
  },
  "master-husband-noun": { example: "Her husband works at the university.", topic: "family" },
  "master-imagine-verb": { topic: "thinking" },
  "master-information-noun": { vietnamese: "thông tin", topic: "communication" },
  "master-island-noun": { example: "The fisherman lived alone on a small island." },
  "master-item-noun": { topic: "objects" },
  "master-join-verb": {
    definition: "to become a member of a group or take part in an activity",
    vietnamese: "tham gia, gia nhập",
    example: "She joined the school music club.",
    topic: "activities",
  },
  "master-jump-verb": { example: "Can you jump over the fence?" },
  "master-just-adverb": { vietnamese: "chỉ, chỉ là" },
  "master-kid-noun": { vietnamese: "đứa trẻ, trẻ con" },
  "master-kind-noun": { example: "What kinds of desserts are there?" },
  "master-lady-noun": { vietnamese: "quý bà, phụ nữ" },
  "master-laugh-verb": { topic: "emotions" },
  "master-leg-noun": { topic: "body" },
  "master-lesson-noun": { topic: "education" },
  "master-letter-noun": { topic: "language" },
  "master-library-noun": { topic: "education" },
  "master-like-preposition": {
    definition: "similar to or in the same way as someone or something",
    vietnamese: "giống như, như",
    example: "She sings like her mother.",
  },
  "master-line-noun": { vietnamese: "đường, đường kẻ" },
  "master-list-noun": { vietnamese: "danh sách" },
  "master-look-noun": { example: "She gave him a look of surprise." },
  "master-love-noun": { example: "Their love for each other remained strong." },
  "master-lunch-noun": { example: "Shall we have sandwiches for lunch?" },
  "master-match-noun": { topic: "sports" },
  "master-matter-noun": {
    definition: "a subject, situation, or problem being considered",
    vietnamese: "vấn đề, sự việc",
    example: "We need to discuss this matter carefully.",
  },
  "master-may-noun": {
    definition: "the fifth month of the year, after April and before June",
    vietnamese: "tháng năm",
    example: "The flowers open in May.",
  },
  "master-meet-verb": { topic: "relationships" },
  "master-memory-noun": { topic: "memory" },
  "master-mother-noun": { topic: "family" },
  "master-move-noun": { topic: "movement" },
  "master-movie-noun": { topic: "culture" },
  "master-music-noun": {
    definition: "sounds arranged in a way that is pleasant or expressive, often using voices or instruments",
    example: "She listens to music while she studies.",
    topic: "culture",
  },
  "master-need-modal": {
    definition: "used in questions and negative statements to say that something is necessary",
    vietnamese: "cần, cần phải",
    example: "You need not bring any food.",
  },
  "master-news-noun": { example: "Did you hear the news that the war has ended?" },
  "master-noise-noun": { vietnamese: "tiếng ồn, âm thanh" },
  "master-note-noun": { vietnamese: "nốt nhạc", topic: "culture" },
  "master-now-adverb": {
    definition: "at this exact moment or immediately",
    example: "She is working from home now.",
  },
  "master-number-noun": {
    definition: "a word or symbol used to show an amount or position in a series",
    topic: "quantity",
  },
  "master-nurse-noun": { example: "The nurse checked the patient's temperature.", topic: "health" },
  "master-off-adjective": {
    definition: "not operating, connected, or switched on",
    vietnamese: "đã tắt, không hoạt động",
  },
  "master-order-noun": { vietnamese: "trật tự, sự ngăn nắp" },
  "master-owner-noun": { example: "Who is the owner of this coat?" },
  "master-paint-verb": { vietnamese: "vẽ, vẽ tranh", topic: "culture" },
  "master-pair-noun": { topic: "quantity" },
  "master-past-preposition": {
    definition: "beyond or on the further side of a place or object",
    vietnamese: "qua, ngang qua",
  },
  "master-people-noun": { example: "Who are these people at the party?" },
  "master-period-noun": { example: "The project lasted for a period of three months." },
  "master-phone-verb": { definition: "to call someone using a telephone" },
  "master-picture-noun": { topic: "culture" },
  "master-plane-noun": { topic: "travel" },
  "master-play-noun": { topic: "culture" },
  "master-player-noun": { topic: "sports" },
  "master-point-noun": { vietnamese: "điểm, chấm" },
  "master-pop-noun": {
    definition: "a sweet drink with bubbles of gas",
    vietnamese: "nước ngọt có ga",
    example: "Cola is his favorite kind of pop.",
    topic: "food",
  },
  "master-post-noun": {
    vietnamese: "thư từ, bưu phẩm",
    topic: "communication",
  },
  "master-present-noun": { vietnamese: "quà, quà tặng", topic: "relationships" },
  "master-quarter-noun": { topic: "quantity" },
  "master-radio-noun": {
    definition: "a device that receives signals through the air and plays speech, music, or other sounds",
    topic: "technology",
  },
  "master-rain-noun": { topic: "weather" },
  "master-rain-verb": { vietnamese: "mưa, rơi như mưa" },
  "master-repeat-verb": { example: "Please repeat the sentence slowly." },
  "master-result-noun": { topic: "events" },
  "master-ride-noun": { topic: "travel" },
  "master-ride-verb": { vietnamese: "cưỡi, đi bằng xe đạp hoặc xe máy" },
  "master-right-adverb": {
    definition: "exactly at a particular place or time",
    vietnamese: "ngay, đúng",
    example: "Please stand right beside the entrance.",
  },
  "master-ring-verb": {
    definition: "to call someone by telephone",
    vietnamese: "gọi điện",
    topic: "communication",
  },
  "master-role-noun": { topic: "work" },
  "master-rule-noun": { topic: "society" },
  "master-run-noun": { vietnamese: "điểm chạy", topic: "sports" },
  "master-sale-noun": { topic: "business" },
  "master-same-adjective": { example: "She wore the same dress as yesterday." },
  "master-science-noun": { example: "Biology is a branch of science." },
  "master-scientist-noun": { example: "The scientist examined the sample under a microscope." },
  "master-seat-noun": {
    vietnamese: "chỗ ngồi, ghế",
    topic: "objects",
  },
  "master-sell-verb": { example: "I sell good shoes for a small amount of money." },
  "master-shake-noun": { topic: "food" },
  "master-she-pronoun": { definition: "a female person or animal already mentioned or understood" },
  "master-short-adverb": {
    definition: "suddenly or before reaching the intended point",
    vietnamese: "đột ngột, ngang",
  },
  "master-side-noun": { topic: "description" },
  "master-sight-noun": {
    definition: "something interesting or famous that people go to see",
    vietnamese: "cảnh đẹp, địa điểm tham quan",
    topic: "travel",
  },
  "master-sing-verb": { topic: "culture" },
  "master-sister-noun": { vietnamese: "chị gái, em gái", topic: "family" },
  "master-smile-noun": { vietnamese: "nụ cười", topic: "emotions" },
  "master-smoke-noun": { topic: "environment" },
  "master-social-adjective": { example: "Humans are social animals." },
  "master-some-determiner": { example: "Would you like some grapes?" },
  "master-son-noun": { topic: "family" },
  "master-song-noun": { topic: "culture" },
  "master-sorry-adjective": { topic: "emotions" },
  "master-special-adjective": { example: "This camera has a special feature for night photos." },
  "master-sport-noun": { topic: "sports" },
  "master-stage-noun": { topic: "culture" },
  "master-stand-noun": {
    definition: "a piece of furniture or support used to hold something",
    vietnamese: "giá, kệ, bàn nhỏ",
    example: "The clock was on the night stand next to the bed.",
    topic: "objects",
  },
  "master-station-noun": { topic: "travel" },
  "master-stay-verb": { topic: "states" },
  "master-step-verb": {
    definition: "to move by lifting one foot and putting it down in another place",
    example: "She stepped carefully over the puddle.",
  },
  "master-stone-noun": { example: "He picked up a smooth stone beside the river." },
  "master-stop-noun": { topic: "travel" },
  "master-store-noun": { topic: "shopping" },
  "master-story-noun": { example: "The teacher read us a story about a lost dog." },
  "master-straight-adverb": { topic: "movement" },
  "master-strange-adjective": { example: "We heard a strange noise outside the window." },
  "master-strong-adjective": {
    vietnamese: "mạnh, khỏe, chắc",
    example: "The radio signal is strong here.",
  },
  "master-student-noun": {
    definition: "a person who studies at a school, college, or university",
    vietnamese: "học sinh, sinh viên",
    example: "Every student received a new textbook.",
    topic: "education",
  },
  "master-successful-adjective": {
    example: "The successful business owner knows how to manage money.",
  },
  "master-suggestion-noun": {
    example: "I have a suggestion: try eating more fruit.",
    topic: "communication",
  },
  "master-sum-noun": { vietnamese: "khoản tiền" },
  "master-summer-noun": { vietnamese: "mùa hè" },
  "master-sun-noun": {
    definition: "the star that gives Earth light and heat",
    vietnamese: "mặt trời",
    example: "The sun rose above the mountains.",
  },
  "master-sure-adjective": { example: "She was sure that she had seen him before." },
  "master-survey-noun": { topic: "communication" },
  "master-swim-noun": {
    vietnamese: "sự bơi, lần đi bơi",
    topic: "sports",
  },
  "master-take-verb": { topic: "movement" },
  "master-taxi-noun": {
    definition: "a car with a driver that passengers pay to take them somewhere",
    vietnamese: "xe taxi",
    example: "We took a taxi to the airport.",
    topic: "travel",
  },
  "master-teach-verb": { topic: "education" },
  "master-technology-noun": {
    vietnamese: "công nghệ",
    example: "Modern technology can make communication faster and cheaper.",
    topic: "technology",
  },
  "master-telephone-noun": {
    vietnamese: "điện thoại",
    topic: "technology",
  },
  "master-television-noun": {
    definition: "a device that receives and displays moving pictures and sound",
    vietnamese: "ti vi, máy truyền hình",
    example: "We watched the football match on television.",
    topic: "technology",
  },
  "master-test-noun": { topic: "education" },
  "master-thing-noun": {
    definition: "an object, situation, idea, or event that is not named precisely",
    vietnamese: "vật, thứ, điều, việc",
    example: "The first thing we need to do is call for help.",
    topic: "description",
  },
  "master-ticket-noun": { topic: "travel" },
  "master-today-noun": {
    definition: "the present day",
    vietnamese: "hôm nay, ngày hôm nay",
    example: "Today is the first day of our holiday.",
  },
  "master-together-adverb": { topic: "relationships" },
  "master-tomorrow-noun": {
    definition: "the day after today",
    vietnamese: "ngày mai",
  },
  "master-tonight-adverb": {
    example: "Please drop by our house tonight.",
    topic: "time",
  },
  "master-town-noun": {
    vietnamese: "thị trấn",
    example: "They drive through the town on their way to work.",
  },
  "master-tree-noun": { definition: "a tall plant with a wooden trunk and branches" },
  "master-turn-noun": {
    definition: "an act of changing direction or moving around a central point",
    vietnamese: "sự quay, lượt",
    example: "One turn of the wheel opened the door.",
    topic: "movement",
  },
  "master-type-noun": { topic: "description" },
  "master-use-verb": {
    definition: "to do something with an object, method, or skill for a particular purpose",
    vietnamese: "sử dụng, dùng",
    example: "We use this room for meetings.",
    topic: "actions",
  },
  "master-video-noun": {
    definition: "a recording of moving pictures and sound",
    vietnamese: "đoạn phim, video",
    topic: "technology",
  },
  "master-vote-noun": { topic: "society" },
  "master-wait-verb": { topic: "time" },
  "master-walk-noun": {
    example: "Are you taking the dog for a walk?",
    topic: "movement",
  },
  "master-wall-noun": { topic: "home" },
  "master-war-noun": { topic: "history" },
  "master-wash-noun": {
    definition: "an act of cleaning your body or an object with water",
    vietnamese: "sự rửa, lần tắm rửa",
    example: "The car needs a wash.",
    topic: "daily-life",
  },
  "master-wash-verb": {
    definition: "to clean someone or something with water and usually soap",
    example: "Wash your hands before dinner.",
    topic: "daily-life",
  },
  "master-way-noun": {
    definition: "a method or manner of doing something",
    vietnamese: "cách, phương pháp",
    example: "This is the easiest way to open the box.",
  },
  "master-wear-verb": {
    definition: "to have clothes, shoes, or an accessory on your body",
    vietnamese: "mặc, mang, đeo",
    example: "She wears glasses when she reads.",
    topic: "daily-life",
  },
  "master-welcome-verb": {
    definition: "to greet someone gladly when they arrive",
    vietnamese: "chào đón, đón tiếp",
    example: "The students welcomed their new teacher.",
    topic: "relationships",
  },
  "master-well-adjective": {
    vietnamese: "khỏe, khỏe mạnh",
    example: "She is well enough to return to school.",
    topic: "health",
  },
  "master-what-determiner": { example: "What book did you buy?" },
  "master-what-pronoun": { example: "What did you see?" },
  "master-white-noun": { example: "White is the main color in this painting." },
  "master-wife-noun": {
    definition: "a married woman considered in relation to her spouse",
    topic: "family",
  },
  "master-wind-noun": {
    definition: "air that moves naturally across the ground",
    example: "The wind blew her hair across her face.",
    topic: "weather",
  },
  "master-window-noun": {
    definition: "an opening in a wall or vehicle that is fitted with glass",
    vietnamese: "cửa sổ",
    topic: "home",
  },
  "master-wonderful-adjective": {
    vietnamese: "tuyệt vời, kỳ diệu",
    example: "We had a wonderful time at the beach.",
  },
  "master-work-verb": { topic: "work" },
  "master-worry-noun": { topic: "emotions" },
  "master-would-modal": {
    definition: "used for an imagined result, a polite request, or the future viewed from the past",
    vietnamese: "sẽ, muốn",
    example: "I would like a cup of tea, please.",
  },
  "master-world-noun": {
    definition: "the Earth and all the people, places, and things on it",
  },
  "master-wrong-adjective": { vietnamese: "sai, không đúng" },
  "master-year-noun": { example: "She started learning English last year." },
  "master-you-pronoun": { vietnamese: "bạn, anh, chị, ông, bà" },
  "a2-manage": { vietnamese: "xoay xở, làm được" },
  "a2-solution": { topic: "problem-solving" },
  "a2-weather": { topic: "weather" },
  "master-accident-noun": {
    definition: "an unexpected event that causes damage or injury",
    vietnamese: "tai nạn",
    example: "Nobody was hurt in the accident.",
    topic: "safety",
  },
  "master-account-noun": { topic: "money" },
  "master-across-adverb": { topic: "movement" },
  "master-act-noun": { topic: "actions" },
  "master-addition-noun": {
    vietnamese: "phần bổ sung, sự thêm vào",
    topic: "change",
  },
  "master-admire-verb": {
    definition: "to look at someone or something with pleasure or respect",
    vietnamese: "ngưỡng mộ, chiêm ngưỡng",
  },
  "master-admit-verb": {
    definition: "to agree that something is true, especially unwillingly",
    vietnamese: "thừa nhận, thú nhận",
    example: "He admitted that he had made a mistake.",
    topic: "communication",
  },
  "master-adult-adjective": {
    definition: "fully grown or developed",
    example: "The young bird becomes an adult bird after two years.",
    topic: "animals",
  },
  "master-affair-noun": { topic: "society" },
  "master-after-adverb": {
    example: "She arrived at noon and left two hours after.",
    topic: "time",
  },
  "master-agent-noun": {
    definition: "a person who represents another person or an organization",
    vietnamese: "đại lý, người đại diện",
    example: "Her agent arranged an interview with the newspaper.",
    topic: "work",
  },
  "master-ahead-adverb": { topic: "movement" },
  "master-air-noun": {
    example: "Fresh air came through the open window.",
    topic: "nature",
  },
  "master-alarm-noun": {
    vietnamese: "chuông báo động, tín hiệu báo động",
    topic: "safety",
  },
  "master-alive-adjective": { topic: "states" },
  "master-allow-verb": { topic: "society" },
  "master-alone-adjective": { topic: "states" },
  "master-along-preposition": {
    definition: "from one part of a road, river, or other line toward another part",
    vietnamese: "dọc theo",
    example: "We walked along the river after lunch.",
  },
  "master-ambition-noun": {
    definition: "a strong wish to achieve something",
    topic: "success",
  },
  "master-among-preposition": {
    definition: "surrounded by or included in a group of people or things",
    vietnamese: "giữa, trong số",
  },
  "master-ancestor-noun": { topic: "family" },
  "master-anymore-adverb": { topic: "time" },
  "master-anyway-adverb": { topic: "language" },
  "master-anywhere-adverb": { topic: "places" },
  "master-apart-adverb": { topic: "places" },
  "master-apartment-noun": { topic: "home" },
  "master-apparently-adverb": { vietnamese: "hình như, có vẻ như" },
  "master-appear-verb": {
    definition: "to seem to have a particular quality or be in a particular state",
    vietnamese: "có vẻ, dường như",
    topic: "perception",
  },
  "master-appearance-noun": {
    vietnamese: "sự xuất hiện, vẻ bề ngoài",
    topic: "description",
  },
  "master-apply-verb": { topic: "work" },
  "master-appreciate-verb": {
    definition: "to understand the value, importance, or difficulty of something",
    vietnamese: "hiểu, đánh giá cao",
    topic: "thinking",
  },
  "master-architecture-noun": { topic: "culture" },
  "master-argue-verb": {
    definition: "to speak angrily because you disagree with someone",
    vietnamese: "tranh luận, cãi nhau",
    example: "The brothers often argue about money.",
  },
  "master-around-adverb": {
    example: "We walked around the park before dinner.",
    topic: "movement",
  },
  "master-artificial-adjective": { example: "The flowers are artificial, but they look real." },
  "master-assistant-adjective": {
    definition: "having a position that helps or supports someone with greater responsibility",
    vietnamese: "trợ lý, phụ tá",
    example: "She was promoted to assistant manager.",
    topic: "work",
  },
  "master-association-noun": { topic: "relationships" },
  "master-atom-noun": {
    definition: "the smallest unit of a chemical element",
    example: "A water molecule contains two hydrogen atoms.",
  },
  "master-attack-noun": { topic: "safety" },
  "master-attack-verb": {
    example: "The dog attacked the man near the gate.",
    topic: "safety",
  },
  "master-audience-noun": { topic: "culture" },
  "master-author-noun": {
    vietnamese: "tác giả, nhà văn",
    topic: "culture",
  },
  "master-automatically-adverb": {
    definition: "without conscious thought or direct human control",
    example: "The doors open automatically when someone approaches.",
    topic: "technology",
  },
  "master-average-noun": { topic: "quantity" },
  "master-award-noun": { topic: "success" },
  "master-awful-adjective": {
    vietnamese: "rất tệ, khủng khiếp",
    example: "The food tasted awful.",
  },
  "master-back-adjective": { example: "The children played in the back yard." },
  "master-background-noun": { topic: "description" },
  "master-bank-verb": {
    definition: "to tilt sideways while turning, especially in an aircraft",
    vietnamese: "nghiêng khi rẽ",
    example: "The plane banked right to line up with the runway.",
    topic: "travel",
  },
  "master-bargain-noun": { topic: "shopping" },
  "master-base-noun": {
    example: "The lamp has a heavy metal base.",
    topic: "objects",
  },
  "master-basket-noun": { topic: "objects" },
  "master-batch-noun": {
    definition: "a group of things made or dealt with at the same time",
    vietnamese: "mẻ, lô",
    topic: "quantity",
  },
  "master-battery-noun": {
    definition: "a device that stores energy and provides electrical power",
    vietnamese: "pin, ắc quy",
    example: "The phone needs a new battery.",
    topic: "technology",
  },
  "master-bend-verb": { vietnamese: "uốn cong, cong, cúi xuống" },
  "master-bit-noun": {
    vietnamese: "một chút, một ít",
    topic: "quantity",
  },
  "master-blame-verb": { vietnamese: "đổ lỗi, trách" },
  "master-blow-noun": { topic: "safety" },
  "master-bonus-noun": { topic: "money" },
  "master-boss-noun": {
    example: "My boss asked me to finish the report today.",
    topic: "work",
  },
  "master-bother-verb": {
    vietnamese: "bận tâm, mất công",
    example: "Do not bother washing the dishes tonight.",
    topic: "actions",
  },
  "master-branch-noun": { topic: "nature" },
  "master-brand-noun": {
    definition: "a name or design that identifies a company's products",
    vietnamese: "nhãn hiệu, thương hiệu",
    example: "This brand of coffee is popular in Vietnam.",
    topic: "business",
  },
  "master-brave-adjective": { topic: "emotions" },
  "master-bug-noun": {
    definition: "a small insect",
    example: "A tiny bug landed on the window.",
  },
  "master-burn-noun": { topic: "health" },
  "master-bury-verb": {
    example: "The dog buried its bone in the garden.",
    topic: "actions",
  },
  "master-businessman-noun": {
    definition: "a man who works in business, especially as an owner or manager",
    example: "The businessman opened a second shop in the city.",
    topic: "business",
  },
  "master-call-verb": { example: "Can you call me tonight at about eight?" },
  "master-camp-verb": { topic: "travel" },
  "master-campus-noun": {
    example: "Students can use the library on campus.",
    topic: "education",
  },
  "master-capital-noun": {
    example: "Hanoi is the capital of Vietnam.",
    topic: "society",
  },
  "master-captain-noun": {
    definition: "the person in charge of a ship or sports team",
    vietnamese: "thuyền trưởng, đội trưởng",
    topic: "work",
  },
  "master-cause-verb": { topic: "events" },
  "master-cent-noun": { vietnamese: "xu" },
  "master-certain-adjective": { example: "She felt certain that the plan would succeed." },
  "master-certainly-adverb": { example: "I will certainly remember your advice." },
  "master-chain-noun": {
    vietnamese: "dây xích, dây chuyền",
    topic: "objects",
  },
  "master-chairman-noun": { topic: "work" },
  "master-chance-noun": {
    definition: "an opportunity to do or achieve something",
    vietnamese: "cơ hội",
    example: "This course gives you a chance to practise speaking.",
    topic: "possibility",
  },
  "master-chapter-noun": { topic: "culture" },
  "master-chart-noun": {
    vietnamese: "biểu đồ, bảng",
    topic: "communication",
  },
  "master-cheap-adjective": {
    example: "The tickets were surprisingly cheap.",
    topic: "money",
  },
  "master-check-verb": {
    vietnamese: "kiểm tra, xem xét",
    example: "Please check the brakes before the trip.",
  },
  "master-chemical-adjective": { topic: "materials" },
  "master-chess-noun": {
    example: "Would you like to play a game of chess?",
    topic: "activities",
  },
  "master-childhood-noun": {
    definition: "the period of a person's life when they are a child",
    vietnamese: "tuổi thơ, thời thơ ấu",
    example: "She spent her childhood in a small coastal town.",
    topic: "time",
  },
  "master-cigarette-noun": {
    definition: "tobacco wrapped in thin paper for smoking",
    example: "He went outside and lit a cigarette.",
    topic: "health",
  },
  "master-citizen-noun": {
    definition: "a legal member of a particular country",
    vietnamese: "công dân",
    example: "Every citizen has the right to vote.",
    topic: "society",
  },
  "master-claim-verb": {
    vietnamese: "khẳng định, tuyên bố",
    example: "The company claims that its product is safe.",
  },
  "master-cleaner-noun": {
    definition: "a person whose job is to clean houses or buildings",
    example: "The cleaner washes the office floors every evening.",
    topic: "work",
  },
  "master-click-verb": { topic: "technology" },
  "master-climb-verb": { definition: "to move up, down, or across something using your hands and feet" },
  "master-clue-noun": { topic: "problem-solving" },
  "master-column-noun": { vietnamese: "cột, trụ" },
  "master-communication-noun": {
    definition: "the process of sharing information and ideas between people",
    vietnamese: "sự giao tiếp, sự truyền đạt",
    topic: "communication",
  },
  "master-company-noun": {
    vietnamese: "công ty, doanh nghiệp",
    topic: "business",
  },
  "master-comparative-noun": { topic: "language" },
  "master-competition-noun": { topic: "business" },
  "master-complaint-noun": {
    definition: "a statement that says you are unhappy or dissatisfied with something",
    vietnamese: "lời phàn nàn, khiếu nại",
    example: "The manager received a complaint about the slow service.",
  },
  "master-composer-noun": {
    example: "The composer wrote music for the new film.",
    topic: "culture",
  },
  "master-concentrate-verb": { topic: "thinking" },
  "master-condition-noun": { topic: "states" },
  "master-consider-verb": { topic: "thinking" },
  "master-contact-noun": { topic: "relationships" },
  "master-contact-verb": {
    vietnamese: "liên lạc, liên hệ",
    example: "Please contact me if you need more information.",
  },
  "master-continent-noun": {
    definition: "one of the world's seven main areas of land",
    vietnamese: "châu lục, đại lục",
    example: "Asia is the largest continent.",
  },
  "master-contrast-noun": { topic: "comparison" },
  "master-control-noun": { topic: "society" },
  "master-copy-verb": {
    definition: "to make something that is the same as another thing",
    vietnamese: "sao chép, chép lại",
    example: "Please copy the address into your notebook.",
    topic: "actions",
  },
  "master-cost-verb": { topic: "money" },
  "master-count-verb": { topic: "quantity" },
  "master-countryside-noun": {
    definition: "land outside towns and cities, often with farms and natural areas",
    vietnamese: "nông thôn, vùng quê",
  },
  "master-couple-noun": { example: "Can you lend me a couple of dollars?" },
  "master-create-verb": { example: "The students created a poster for the event." },
  "master-creature-noun": { topic: "animals" },
  "master-credit-noun": { topic: "money" },
  "master-crime-noun": { topic: "society" },
  "master-cross-noun": {
    definition: "a shape made by two lines that pass across each other",
    vietnamese: "hình chữ thập, cây thánh giá",
    topic: "culture",
  },
  "master-cruise-noun": {
    vietnamese: "chuyến du ngoạn bằng tàu",
    topic: "travel",
  },
  "master-cry-verb": { topic: "emotions" },
  "master-custom-noun": { topic: "culture" },
  "master-daily-adverb": {
    example: "The equipment is inspected daily for damage.",
    vietnamese: "hằng ngày, mỗi ngày",
    topic: "time",
  },
  "master-danger-noun": { topic: "safety" },
  "master-dead-adjective": { topic: "states" },
  "master-deal-noun": {
    vietnamese: "thỏa thuận, giao dịch",
    topic: "business",
  },
  "master-deep-adverb": { topic: "description" },
  "master-deeply-adverb": { topic: "emotions" },
  "master-depend-verb": { vietnamese: "phụ thuộc, dựa vào" },
  "master-desert-noun": {
    definition: "a large, dry area of land with very little rain or plant life",
    vietnamese: "sa mạc",
    example: "Very few plants can survive in the desert.",
    topic: "nature",
  },
  "master-destroy-verb": { topic: "actions" },
  "master-detail-noun": { topic: "description" },
  "master-diary-noun": { topic: "communication" },
  "master-die-verb": { topic: "states" },
  "master-diet-noun": {
    vietnamese: "chế độ ăn, thức ăn thường ngày",
    topic: "health",
  },
  "master-difficulty-noun": { topic: "problem-solving" },
  "master-direction-noun": { topic: "movement" },
  "master-director-noun": {
    definition: "a person who controls how a film or play is made",
    vietnamese: "đạo diễn",
    topic: "culture",
  },
  "master-disagree-verb": {
    definition: "to have a different opinion from someone else",
    vietnamese: "không đồng ý, bất đồng",
    example: "I disagree with your conclusion.",
  },
  "master-discover-verb": {
    example: "Scientists hope to discover a cure for the disease.",
    topic: "thinking",
  },
  "master-dislike-noun": { topic: "emotions" },
  "master-display-noun": { topic: "culture" },
  "master-disturb-verb": { topic: "actions" },
  "master-divide-verb": { topic: "quantity" },
  "master-double-adjective": {
    definition: "made of two similar parts or twice the usual size or amount",
    example: "We opened the double doors to move the piano inside.",
  },
  "master-doubt-noun": { topic: "thinking" },
  "master-down-preposition": {
    definition: "from a higher point toward a lower point of something",
    example: "She walked down the stairs.",
    topic: "movement",
  },
  "master-download-verb": {
    vietnamese: "tải xuống",
    topic: "technology",
  },
  "master-draw-noun": { topic: "sports" },
  "master-dream-verb": { topic: "emotions" },
  "master-dress-verb": { topic: "daily-life" },
  "master-drive-verb": {
    definition: "to control the movement and direction of a vehicle",
    vietnamese: "lái, lái xe",
    topic: "travel",
  },
  "master-drug-noun": {
    definition: "a substance used as medicine or taken for its effect on the body",
    vietnamese: "thuốc, dược phẩm, chất gây nghiện",
    example: "The doctor prescribed a drug to control the pain.",
    topic: "health",
  },
  "master-dry-verb": { example: "Hang the clothes outside to dry them." },
  "master-early-adjective": {
    example: "The early train leaves at six.",
    topic: "time",
  },
  "master-earn-verb": { topic: "money" },
  "master-earthquake-noun": {
    vietnamese: "động đất",
    topic: "nature",
  },
  "master-easily-adverb": { topic: "description" },
  "master-east-adjective": {
    example: "The east entrance opens at eight.",
    topic: "places",
  },
  "master-east-adverb": { topic: "movement" },
  "master-east-noun": {
    definition: "the direction where the sun rises",
    vietnamese: "hướng đông, phía đông",
    example: "The sun rises in the east.",
    topic: "places",
  },
  "master-editor-noun": {
    vietnamese: "biên tập viên",
    example: "The editor corrected several mistakes in the article.",
    topic: "work",
  },
  "master-education-noun": {
    vietnamese: "giáo dục, sự học hành",
    topic: "education",
  },
  "master-educational-adjective": { topic: "education" },
  "master-effect-noun": { topic: "events" },
  "master-effort-noun": { topic: "work" },
  "master-elderly-adjective": {
    vietnamese: "cao tuổi, lớn tuổi",
    topic: "people",
  },
  "master-electric-adjective": { topic: "technology" },
  "master-elsewhere-adverb": {
    example: "Unable to find work locally, he looked elsewhere.",
    topic: "places",
  },
  "master-emergency-noun": { topic: "safety" },
  "master-empty-adjective": { example: "The bottle is completely empty." },
  "master-end-verb": { topic: "events" },
  "master-enough-adverb": { example: "Have I eaten enough?" },
  "master-entertainment-noun": {
    vietnamese: "sự giải trí, hoạt động giải trí",
    topic: "culture",
  },
  "master-entrance-noun": { topic: "places" },
  "master-episode-noun": { topic: "culture" },
  "master-error-noun": { topic: "quality" },
  "master-escape-noun": { topic: "safety" },
  "master-essay-noun": {
    vietnamese: "bài luận, bài tiểu luận",
    topic: "education",
  },
  "master-euro-noun": {
    definition: "the currency used by many countries in the European Union",
    vietnamese: "đồng euro",
    example: "The sandwich costs five euros.",
    topic: "money",
  },
  "master-ever-adverb": { example: "Have you ever visited Singapore?" },
  "master-exam-noun": {
    vietnamese: "kỳ thi, bài thi",
    example: "Did you pass the English exam last week?",
    topic: "education",
  },
  "master-except-preposition": { example: "Except for mercury, most metals are solid." },
  "master-exchange-noun": {
    definition: "an act of giving something and receiving something else in return",
    example: "The students took part in an exchange of ideas.",
    topic: "relationships",
  },
  "master-exercise-noun": { topic: "health" },
  "master-exhibition-noun": {
    vietnamese: "cuộc triển lãm",
    topic: "culture",
  },
  "master-exist-verb": { vietnamese: "tồn tại, hiện hữu" },
  "master-expert-noun": { topic: "work" },
  "master-explore-verb": { topic: "travel" },
  "master-express-noun": { topic: "travel" },
  "master-expression-noun": {
    vietnamese: "nét mặt, biểu cảm",
    topic: "emotions",
  },
  "master-extra-adverb": { topic: "description" },
  "master-face-verb": { topic: "problem-solving" },
  "master-fact-noun": { vietnamese: "sự thật, thực tế" },
  "master-fail-verb": {
    definition: "to not do something that you should or are expected to do",
    vietnamese: "không làm được, thất bại",
    topic: "actions",
  },
  "master-fall-verb": {
    definition: "to move downward, usually quickly and without control",
    vietnamese: "rơi, ngã, rơi xuống",
    example: "The leaves fall from the trees in autumn.",
    topic: "movement",
  },
  "master-fancy-adjective": { definition: "nicer or more decorative than usual" },
  "master-fantastic-adjective": {
    definition: "extremely good or impressive",
    vietnamese: "tuyệt vời, rất ấn tượng",
    example: "We had a fantastic holiday by the sea.",
  },
  "master-far-adverb": {
    vietnamese: "rất, hơn nhiều",
    topic: "comparison",
  },
  "master-fare-noun": { topic: "travel" },
  "master-fashion-noun": { topic: "culture" },
  "master-fault-noun": { topic: "responsibility" },
  "master-feel-noun": {
    definition: "a natural ability to understand or do something",
    vietnamese: "cảm nhận, trực giác",
  },
  "master-fighter-noun": { example: "The young fighter trained every morning before work." },
  "master-figure-noun": {
    vietnamese: "số liệu, con số",
    topic: "quantity",
  },
  "master-figure-verb": {
    definition: "to play an important part in a situation or event",
    vietnamese: "đóng vai trò, xuất hiện",
    topic: "events",
  },
  "master-film-noun": {
    example: "We watched a film about life in the mountains.",
    topic: "culture",
  },
  "master-final-noun": {
    vietnamese: "trận chung kết",
    example: "Brazil will play Germany in the final.",
    topic: "sports",
  },
  "master-finally-adverb": { topic: "time" },
  "master-fit-adjective": {
    vietnamese: "khỏe mạnh, cân đối",
    example: "Regular exercise helps her stay fit.",
    topic: "health",
  },
  "master-fix-noun": {
    definition: "a difficult situation with no easy solution",
    vietnamese: "tình thế khó khăn",
  },
  "master-flight-noun": {
    definition: "a journey made by aircraft",
    vietnamese: "chuyến bay",
    example: "Our flight to Bangkok leaves at noon.",
    topic: "travel",
  },
  "master-flood-noun": { topic: "nature" },
  "master-follow-verb": { definition: "to travel behind or come after someone or something" },
  "master-forbid-verb": {
    definition: "to order someone not to do something",
    topic: "society",
  },
  "master-force-noun": { topic: "materials" },
  "master-forest-noun": { topic: "nature" },
  "master-forever-adverb": { topic: "time" },
  "master-fortune-noun": {
    vietnamese: "gia tài, khối tài sản lớn",
    topic: "money",
  },
  "master-forward-adverb": {
    vietnamese: "về phía trước",
    example: "She stepped forward to accept the award.",
    topic: "movement",
  },
  "master-free-adverb": {
    definition: "without having to pay",
    vietnamese: "miễn phí",
    topic: "money",
  },
  "master-freedom-noun": { topic: "society" },
  "master-fresh-adjective": { topic: "food" },
  "master-friendship-noun": { topic: "relationships" },
  "master-front-noun": {
    vietnamese: "mặt trước, phía trước",
    topic: "description",
  },
  "master-fully-adverb": { topic: "description" },
  "master-furniture-noun": {
    definition: "objects such as chairs, tables, and beds that make a room useful or comfortable",
    vietnamese: "đồ nội thất",
    topic: "home",
  },
  "master-gallery-noun": { topic: "culture" },
  "master-gas-noun": {
    definition: "a substance like air that is neither solid nor liquid",
    example: "The stove uses gas for cooking.",
    topic: "materials",
  },
  "master-gender-noun": {
    definition: "the social or personal identity of being male, female, both, or neither",
    vietnamese: "giới, giới tính",
    topic: "society",
  },
  "master-generation-noun": {
    definition: "all the people in a group or family who are about the same age",
    vietnamese: "thế hệ",
  },
  "master-globe-noun": {
    definition: "a round model of Earth",
    vietnamese: "quả địa cầu",
    example: "The teacher pointed to Vietnam on the globe.",
    topic: "education",
  },
  "master-gold-noun": {
    vietnamese: "vàng, kim loại vàng",
    topic: "materials",
  },
  "master-golf-noun": { vietnamese: "môn gôn", topic: "sports" },
  "master-government-noun": {
    vietnamese: "chính phủ",
    topic: "society",
  },
  "master-gradually-adverb": {
    example: "Life in the town gradually returned to normal after the earthquake.",
    topic: "time",
  },
  "master-graduate-verb": {
    definition: "to complete a course of study and receive a degree or qualification",
    vietnamese: "tốt nghiệp",
    topic: "education",
  },
  "master-grateful-adjective": { topic: "emotions" },
  "master-few-determiner": {
    definition: "a small number of",
    vietnamese: "ít, vài",
  },
  "master-greatly-adverb": { vietnamese: "rất nhiều, đáng kể" },
  "master-green-noun": { vietnamese: "màu xanh lá cây" },
  "master-guard-noun": {
    vietnamese: "nhân viên bảo vệ, lính canh",
    topic: "safety",
  },
  "master-gun-noun": {
    vietnamese: "súng",
    example: "The police found a gun inside the car.",
    topic: "safety",
  },
  "master-hand-verb": { topic: "actions" },
  "master-hardly-adverb": {
    vietnamese: "hầu như không, gần như không",
  },
  "master-harvest-noun": { topic: "nature" },
  "master-head-verb": {
    vietnamese: "hướng tới, đi về phía",
    topic: "movement",
  },
  "master-heat-noun": { topic: "materials" },
  "master-heavily-adverb": {
    definition: "with great weight, force, or effort",
    vietnamese: "nặng nề, nhiều",
  },
  "master-help-noun": { topic: "relationships" },
  "master-helpful-adjective": { vietnamese: "hữu ích, hay giúp đỡ" },
  "master-high-adverb": { topic: "description" },
  "master-highway-noun": {
    example: "The highway connects the two cities.",
    topic: "travel",
  },
  "master-hold-verb": {
    example: "Please hold my bag for a moment.",
    topic: "actions",
  },
  "master-home-adverb": { topic: "places" },
  "master-host-noun": { topic: "relationships" },
  "master-however-adverb": { vietnamese: "tuy nhiên, dù vậy" },
  "master-ill-adjective": {
    definition: "sick or in poor health",
    vietnamese: "ốm, bị bệnh",
    example: "She was too ill to go to work.",
    topic: "health",
  },
  "master-illegal-adjective": { topic: "society" },
  "master-image-noun": {
    example: "The screen displayed a clear image of the moon.",
    topic: "description",
  },
  "master-imagination-noun": {
    example: "Use your imagination to create a new ending for the story.",
  },
  "master-importance-noun": { example: "The teacher explained the importance of regular practice." },
  "master-importantly-adverb": {
    vietnamese: "một cách quan trọng, quan trọng hơn",
    example: "More importantly, everyone returned home safely.",
  },
  "master-in-adverb": { topic: "places" },
  "master-inch-noun": { vietnamese: "in-sơ, inch" },
  "master-include-verb": { topic: "quantity" },
  "master-independence-noun": { topic: "society" },
  "master-influence-noun": {
    example: "Her teacher had a strong influence on her career.",
    topic: "relationships",
  },
  "master-injure-verb": {
    definition: "to cause physical harm to a person or animal",
    vietnamese: "làm bị thương, gây thương tích",
    example: "Two passengers were injured in the accident.",
    topic: "health",
  },
  "master-inner-adjective": {
    vietnamese: "bên trong, nội bộ",
  },
  "master-inside-adverb": { topic: "places" },
  "master-instant-adjective": { example: "The medicine provided instant relief from the pain." },
  "master-intelligence-noun": {
    vietnamese: "trí thông minh, khả năng hiểu biết",
    example: "The puzzle tests both memory and intelligence.",
  },
  "master-international-adjective": {
    definition: "involving or relating to two or more countries",
    topic: "society",
  },
  "master-invade-verb": { topic: "history" },
  "master-invention-noun": { topic: "technology" },
  "master-it-noun": { topic: "technology" },
  "master-joke-noun": { example: "His joke made everyone in the room laugh." },
  "master-joy-noun": { example: "The news filled her with joy." },
  "master-junk-noun": {
    definition: "old or unwanted objects that have little value",
    vietnamese: "đồ bỏ đi, đồ phế thải",
    example: "We cleared all the junk out of the garage.",
    topic: "objects",
  },
  "master-kind-adjective": {
    vietnamese: "tử tế, tốt bụng, ân cần",
    example: "The nurse was very kind to the nervous patient.",
    topic: "relationships",
  },
  "master-knock-noun": {
    definition: "the sound made when something hard hits a surface",
    vietnamese: "tiếng gõ, tiếng va",
    example: "There was a knock at the front door.",
    topic: "sounds",
  },
  "master-land-verb": { vietnamese: "hạ xuống, tiếp đất" },
  "master-last-determiner": {
    definition: "the most recent week, month, year, or other period before the present one",
    vietnamese: "vừa qua, trước",
  },
  "master-lawyer-noun": { topic: "work" },
  "master-lead-noun": {
    vietnamese: "dây dắt, dây buộc",
    topic: "objects",
  },
  "master-left-adverb": { topic: "movement" },
  "master-less-adverb": { example: "The second book was less interesting than the first." },
  "master-level-noun": { topic: "quantity" },
  "master-liberty-noun": { topic: "society" },
  "master-lie-verb": {
    definition: "to rest in a flat position on a surface",
    vietnamese: "nằm, nằm xuống",
    example: "I need to lie down for a while.",
  },
  "master-lifestyle-noun": { topic: "daily-life" },
  "master-lip-noun": { topic: "body" },
  "master-load-noun": { vietnamese: "vật nặng, gánh nặng, tải trọng" },
  "master-long-adverb": { example: "The promotion was long overdue." },
  "master-lot-noun": {
    definition: "a large number or amount of something",
    vietnamese: "nhiều, một lượng lớn",
    example: "They spent a lot of money on the repairs.",
  },
  "master-low-adverb": { topic: "description" },
  "master-mad-adjective": {
    definition: "very angry with someone or about something",
    topic: "emotions",
  },
  "master-male-noun": {
    definition: "a male person or animal",
    vietnamese: "nam giới, con đực",
    example: "The male bird has bright blue feathers.",
    topic: "animals",
  },
  "master-mall-noun": {
    vietnamese: "trung tâm mua sắm",
    topic: "shopping",
  },
  "master-mark-noun": {
    vietnamese: "điểm, điểm số",
    topic: "education",
  },
  "master-mark-verb": { example: "She marked the important passage in pencil." },
  "master-market-noun": { topic: "shopping" },
  "master-marry-verb": { topic: "relationships" },
  "master-material-noun": { topic: "materials" },
  "master-medical-adjective": { topic: "health" },
  "master-member-noun": {
    vietnamese: "thành viên, hội viên",
    example: "She is a member of the local tennis club.",
  },
  "master-metal-noun": { example: "We replaced our wooden door with a stronger metal one." },
  "master-middle-noun": { topic: "places" },
  "master-military-adjective": { topic: "society" },
  "master-mobile-adjective": { topic: "technology" },
  "master-model-noun": {
    definition: "a smaller or simpler copy used to represent how something looks or works",
    example: "The students built a model of the bridge.",
    topic: "description",
  },
  "master-mood-noun": {
    vietnamese: "tâm trạng",
    example: "She was in a cheerful mood after the good news.",
  },
  "master-move-verb": { topic: "movement" },
  "master-murder-noun": {
    definition: "the crime of deliberately killing a person",
    vietnamese: "vụ giết người, tội giết người",
    topic: "society",
  },
  "master-museum-noun": { topic: "culture" },
  "master-musical-adjective": {
    vietnamese: "thuộc âm nhạc, có tính nhạc",
    example: "The child showed musical talent at an early age.",
    topic: "culture",
  },
  "master-nation-noun": { vietnamese: "quốc gia, dân tộc" },
  "master-national-adjective": {
    vietnamese: "quốc gia, toàn quốc",
    example: "The team won the national championship.",
    topic: "society",
  },
  "master-native-adjective": {
    vietnamese: "bản địa, có nguồn gốc tại",
    example: "This plant is native to Southeast Asia.",
    topic: "nature",
  },
  "master-nature-noun": { topic: "nature" },
  "master-nearly-adverb": { example: "We had nearly finished when the lights went out." },
  "master-negative-adjective": {
    vietnamese: "tiêu cực, có hại, âm",
    example: "Constant criticism can have a negative effect on children.",
  },
  "master-nervous-adjective": { topic: "emotions" },
  "master-net-adjective": {
    vietnamese: "ròng, thực",
    example: "The company reported a net profit of two million dollars.",
    topic: "business",
  },
  "master-next-determiner": { vietnamese: "tiếp theo, kế tiếp" },
  "master-north-adjective": {
    vietnamese: "phía bắc, hướng bắc",
    example: "The north entrance is closed today.",
    topic: "places",
  },
  "master-north-adverb": {
    example: "They travelled north for two days.",
    topic: "movement",
  },
  "master-north-noun": {
    definition: "the direction opposite south",
    vietnamese: "phía bắc, hướng bắc",
    example: "The mountains lie to the north.",
    topic: "places",
  },
  "master-novel-noun": { topic: "culture" },
  "master-nowadays-adverb": {
    vietnamese: "ngày nay, hiện nay",
    example: "Nowadays, most students submit their work online.",
    topic: "time",
  },
  "master-occupation-noun": { topic: "work" },
  "master-offer-verb": {
    vietnamese: "cung cấp, đề nghị",
  },
  "master-official-adjective": { vietnamese: "chính thức" },
  "master-oil-noun": { topic: "materials" },
  "master-online-adjective": {
    definition: "available or connected through the internet",
    topic: "technology",
  },
  "master-online-adverb": { topic: "technology" },
  "master-operate-verb": {
    definition: "to control or use a machine or system",
    vietnamese: "vận hành, điều khiển",
    topic: "technology",
  },
  "master-oppose-verb": { topic: "society" },
  "master-outside-preposition": {
    definition: "on or beyond the outer side of a place or thing",
  },
  "master-over-adverb": {
    vietnamese: "qua, sang, đến",
  },
  "master-overseas-adverb": { topic: "travel" },
  "master-pack-noun": { topic: "shopping" },
  "master-pack-verb": {
    example: "Did you pack your swimming suit?",
    topic: "travel",
  },
  "master-pan-noun": { topic: "food" },
  "master-park-verb": {
    definition: "to leave a vehicle in a particular place for a period of time",
    vietnamese: "đỗ xe, đậu xe",
    topic: "travel",
  },
  "master-part-noun": { topic: "quantity" },
  "master-pass-noun": { topic: "travel" },
  "master-passenger-noun": {
    example: "The bus can carry fifty passengers.",
    topic: "travel",
  },
  "master-path-noun": { topic: "places" },
  "master-patient-noun": {
    vietnamese: "bệnh nhân",
    topic: "health",
  },
  "master-peaceful-adjective": { example: "They live in a peaceful village near the coast." },
  "master-perfectly-adverb": { topic: "description" },
  "master-performance-noun": {
    vietnamese: "buổi biểu diễn, màn trình diễn",
    topic: "culture",
  },
  "master-permission-noun": { topic: "society" },
  "master-personality-noun": {
    definition: "the qualities that make one person's character different from another's",
    example: "Her friendly personality makes people feel welcome.",
  },
  "master-photograph-noun": {
    example: "The photograph of the event won a prize.",
    topic: "culture",
  },
  "master-physical-adjective": {
    vietnamese: "thuộc thể chất, vật lý",
    topic: "health",
  },
  "master-physically-adverb": {
    definition: "in a way that relates to the body",
    vietnamese: "về thể chất, về thân thể",
    example: "The long journey was physically tiring.",
    topic: "health",
  },
  "master-pile-noun": {
    vietnamese: "đống, chồng",
    topic: "objects",
  },
  "master-pill-noun": { topic: "health" },
  "master-pilot-noun": {
    example: "The pilot landed the plane safely.",
    topic: "travel",
  },
  "master-pink-noun": { vietnamese: "màu hồng" },
  "master-plant-noun": { topic: "nature" },
  "master-plate-noun": { vietnamese: "đĩa" },
  "master-plenty-noun": { topic: "quantity" },
  "master-population-noun": { topic: "society" },
  "master-power-noun": { topic: "society" },
  "master-powerful-adjective": { example: "The country has a powerful economy." },
  "master-prediction-noun": { vietnamese: "sự dự đoán, lời dự đoán" },
  "master-pressure-noun": {
    vietnamese: "áp lực, sức ép, áp suất",
    topic: "materials",
  },
  "master-print-verb": {
    definition: "to produce words or pictures on paper using a machine",
    vietnamese: "in, in ấn",
    topic: "communication",
  },
  "master-produce-verb": {
    definition: "to make, grow, or create something",
    vietnamese: "sản xuất, tạo ra",
    example: "This tree produces a lot of fruit every year.",
    topic: "work",
  },
  "master-product-noun": { topic: "shopping" },
  "master-production-noun": { topic: "business" },
  "master-professional-adjective": { topic: "work" },
  "master-progressive-adjective": { topic: "society" },
  "master-pronounce-verb": {
    definition: "to say a word or sound in a particular way",
  },
  "master-provide-verb": {
    vietnamese: "cung cấp, chuẩn bị",
    topic: "actions",
  },
  "master-psychologist-noun": {
    vietnamese: "nhà tâm lý học, chuyên gia tâm lý",
    example: "The psychologist studies how people think and behave.",
    topic: "health",
  },
  "master-pursue-verb": { topic: "success" },
  "master-quick-adjective": { example: "She was quick to offer help." },
  "master-quit-verb": { topic: "change" },
  "master-range-noun": { topic: "quantity" },
  "master-rate-noun": {
    definition: "the speed or frequency at which something happens",
    example: "The population is growing at a steady rate.",
    topic: "quantity",
  },
  "master-rather-adverb": { vietnamese: "khá, hơi" },
  "master-reach-verb": {
    vietnamese: "đạt tới, chạm tới",
  },
  "master-receive-verb": { vietnamese: "nhận, tiếp nhận" },
  "master-recent-adjective": { example: "Has there been any recent news about the dispute?" },
  "master-recently-adverb": { topic: "time" },
  "master-recycle-verb": {
    definition: "to process used materials so they can be made into new products",
    vietnamese: "tái chế",
    example: "We recycle paper, glass, and metal at home.",
    topic: "environment",
  },
  "master-red-noun": { vietnamese: "màu đỏ" },
  "master-reflect-verb": { topic: "thinking" },
  "master-regularly-adverb": { topic: "time" },
  "master-relax-verb": { vietnamese: "thư giãn, nghỉ ngơi" },
  "master-release-noun": { topic: "culture" },
  "master-remain-verb": { topic: "states" },
  "master-remote-adjective": { topic: "places" },
  "master-rent-noun": {
    vietnamese: "tiền thuê",
    example: "Have we paid this month's rent yet?",
  },
  "master-rent-verb": { topic: "money" },
  "master-repair-noun": { topic: "actions" },
  "master-research-noun": {
    example: "The team published new research on clean energy.",
    topic: "education",
  },
  "master-response-noun": { topic: "communication" },
  "master-retire-verb": { topic: "work" },
  "master-return-noun": { topic: "travel" },
  "master-rhythm-noun": { topic: "culture" },
  "master-right-noun": {
    definition: "something that a person is legally or morally allowed to do or have",
    example: "Every child has the right to an education.",
    topic: "society",
  },
  "master-ring-noun": { topic: "objects" },
  "master-road-noun": { topic: "travel" },
  "master-roll-noun": { topic: "objects" },
  "master-roof-noun": { topic: "home" },
  "master-rope-noun": { example: "They tied the boat to the post with a rope." },
  "master-roughly-adverb": { vietnamese: "thô bạo, mạnh tay" },
  "master-round-adverb": { topic: "time" },
  "master-rush-noun": { topic: "events" },
  "master-sadly-adverb": { topic: "emotions" },
  "master-sake-noun": {
    definition: "the benefit, purpose, or interest of someone or something",
    vietnamese: "lợi ích, mục đích",
    example: "They stayed together for the sake of their children.",
    topic: "relationships",
  },
  "master-salt-noun": { definition: "a white powder used to improve or preserve food" },
  "master-sample-noun": { topic: "education" },
  "master-satisfy-verb": {
    example: "The final result satisfied everyone on the team.",
  },
  "master-scale-noun": {
    vietnamese: "quy mô, mức độ",
    topic: "quantity",
  },
  "master-scientific-adjective": {
    example: "The claim needs scientific evidence.",
    topic: "education",
  },
  "master-scream-noun": {
    definition: "a loud, high cry caused by fear, pain, or excitement",
    example: "We heard a scream from the next room.",
    topic: "sounds",
  },
  "master-screen-noun": {
    vietnamese: "màn hình",
    topic: "technology",
  },
  "master-script-noun": {
    example: "The language is written in a different script.",
    topic: "language",
  },
  "master-search-noun": { vietnamese: "sự tìm kiếm, cuộc tìm kiếm" },
  "master-secretary-noun": {
    definition: "a person whose job involves organizing records, messages, and meetings",
    vietnamese: "thư ký",
    example: "The secretary arranged a meeting for Thursday.",
    topic: "work",
  },
  "master-seek-verb": {
    example: "You should seek medical advice if the pain continues.",
    topic: "actions",
  },
  "master-senior-adjective": {
    vietnamese: "cao cấp, lớn tuổi hơn, thâm niên hơn",
    example: "A senior officer approved the request.",
    topic: "work",
  },
  "master-senior-noun": {
    definition: "a person who is older or higher in rank than another person",
    example: "She is my senior by ten years.",
  },
  "master-seriously-adverb": {
    definition: "in a serious way, without joking or pretending",
    vietnamese: "nghiêm túc, nghiêm trọng",
    example: "You need to take this warning seriously.",
  },
  "master-serve-verb": { example: "Shall I serve your drinks first?" },
  "master-set-noun": {
    vietnamese: "cảnh trí sân khấu, phim trường",
    topic: "culture",
  },
  "master-shadow-noun": {
    example: "We sat in the shadow of a large tree.",
    topic: "description",
  },
  "master-shoot-verb": {
    definition: "to fire a gun or other weapon",
    vietnamese: "bắn",
    example: "The competitors shoot at paper targets.",
    topic: "safety",
  },
  "master-shot-noun": { topic: "sports" },
  "master-show-noun": { topic: "culture" },
  "master-shut-verb": {
    definition: "to close something such as a door, window, or container",
    topic: "actions",
  },
  "master-silence-noun": { topic: "sounds" },
  "master-silver-adjective": { example: "She wore two silver bracelets." },
  "master-simple-adjective": { example: "The problem has a simple solution." },
  "master-situation-noun": {
    vietnamese: "tình huống, hoàn cảnh",
    example: "The situation became more difficult after the storm.",
  },
  "master-slave-noun": {
    example: "Slaves were denied freedom and forced to work.",
    topic: "history",
  },
  "master-slide-noun": { topic: "activities" },
  "master-slim-adjective": { example: "The jacket has a slim and modern shape." },
  "master-slowly-adverb": { topic: "movement" },
  "master-smoke-verb": {
    vietnamese: "hút thuốc",
    topic: "health",
  },
  "master-smooth-adjective": { vietnamese: "nhẵn, trơn, mượt" },
  "master-so-adverb": {
    definition: "at such a great degree",
    vietnamese: "rất, quá",
  },
  "master-software-noun": {
    example: "The company installed new accounting software.",
    topic: "technology",
  },
  "master-soldier-noun": { topic: "history" },
  "master-somewhere-adverb": { topic: "places" },
  "master-sound-noun": {
    vietnamese: "âm thanh, tiếng động",
    topic: "sounds",
  },
  "master-sound-verb": {
    definition: "to seem a particular way when heard or described",
    vietnamese: "nghe có vẻ",
  },
  "master-source-noun": {
    vietnamese: "nguồn, nguồn cung cấp",
    topic: "business",
  },
  "master-south-adjective": {
    vietnamese: "phía nam, hướng nam",
    example: "The south entrance is beside the car park.",
    topic: "places",
  },
  "master-south-adverb": {
    example: "The birds moved south before winter.",
    topic: "movement",
  },
  "master-south-noun": { topic: "places" },
  "master-space-noun": {
    vietnamese: "khoảng trống, không gian",
    topic: "places",
  },
  "master-speed-noun": { topic: "movement" },
  "master-spell-verb": { topic: "language" },
  "master-split-adjective": { example: "The committee was split over the proposal." },
  "master-spread-noun": { topic: "food" },
  "master-square-noun": {
    definition: "a flat shape with four equal sides and four right angles",
    vietnamese: "hình vuông",
  },
  "master-stadium-noun": {
    definition: "a large place with seats around an area used for sports events",
    example: "Thousands of fans filled the stadium before the match.",
    topic: "sports",
  },
  "master-staff-noun": { topic: "work" },
  "master-stand-verb": { topic: "movement" },
  "master-state-noun": { topic: "states" },
  "master-statement-noun": { vietnamese: "lời tuyên bố, phát biểu" },
  "master-steal-verb": {
    example: "Someone tried to steal her bicycle.",
    topic: "society",
  },
  "master-step-noun": { topic: "movement" },
  "master-still-adverb": { example: "No one has fixed the oven, so it is still broken." },
  "master-storm-noun": { topic: "weather" },
  "master-strength-noun": { topic: "body" },
  "master-strike-noun": { topic: "work" },
  "master-study-noun": { topic: "education" },
  "master-stuff-noun": { example: "What is all that stuff on your bedroom floor?" },
  "master-succeed-verb": {
    vietnamese: "thành công, đạt được mục tiêu",
    topic: "success",
  },
  "master-success-noun": { topic: "success" },
  "master-successfully-adverb": { topic: "success" },
  "master-suggest-verb": { vietnamese: "gợi ý, đề nghị" },
  "master-suit-noun": {
    definition: "a set of matching formal clothes, usually a jacket with trousers or a skirt",
    topic: "daily-life",
  },
  "master-suitable-adjective": { example: "These shoes are suitable for long walks." },
  "master-support-noun": { topic: "relationships" },
  "master-sure-adverb": { vietnamese: "chắc chắn" },
  "master-survive-verb": { topic: "safety" },
  "master-symbol-noun": { example: "Most languages use the same symbols to represent numbers." },
  "master-system-noun": { topic: "technology" },
  "master-talent-noun": {
    example: "Her talent for music was clear from an early age.",
    topic: "skills",
  },
  "master-tap-noun": {
    definition: "a device that controls the flow of water from a pipe",
    vietnamese: "vòi nước",
    example: "Please turn off the tap after washing your hands.",
    topic: "home",
  },
  "master-target-noun": {
    definition: "a result, amount, or level that someone tries to achieve",
    vietnamese: "mục tiêu, chỉ tiêu",
    topic: "success",
  },
  "master-task-noun": { topic: "work" },
  "master-tear-noun": {
    definition: "a drop of liquid that comes from the eye when someone cries",
    vietnamese: "nước mắt, giọt lệ",
    example: "A tear rolled down her cheek.",
    topic: "emotions",
  },
  "master-temperature-noun": { topic: "weather" },
  "master-text-verb": {
    vietnamese: "nhắn tin",
    example: "Will you text me tomorrow?",
  },
  "master-textbook-noun": { topic: "education" },
  "master-timetable-noun": {
    vietnamese: "thời khóa biểu, lịch trình",
    topic: "time",
  },
  "master-tip-noun": {
    vietnamese: "đầu, mũi, chóp",
    topic: "description",
  },
  "master-title-noun": { example: "I finished the book, but I cannot remember its title." },
  "master-tone-noun": {
    definition: "the quality of a person's voice that shows a feeling or attitude",
    vietnamese: "giọng điệu",
    example: "Her calm tone made everyone feel better.",
    topic: "communication",
  },
  "master-tour-noun": { topic: "travel" },
  "master-tourist-noun": { topic: "travel" },
  "master-track-noun": {
    vietnamese: "đường ray, đường chạy, dấu vết",
    topic: "travel",
  },
  "master-trade-noun": { topic: "business" },
  "master-traditional-adjective": { topic: "culture" },
  "master-train-verb": {
    example: "The company trains new staff for six weeks.",
    topic: "education",
  },
  "master-trap-noun": {
    vietnamese: "bẫy",
    topic: "safety",
  },
  "master-travel-noun": { topic: "travel" },
  "master-trouble-noun": { topic: "problem-solving" },
  "master-trust-verb": { topic: "relationships" },
  "master-try-verb": { topic: "actions" },
  "master-tune-noun": { topic: "culture" },
  "master-twice-adverb": {
    definition: "two times or on two occasions",
    topic: "quantity",
  },
  "master-unfair-adjective": { topic: "society" },
  "master-unhappy-adjective": { topic: "emotions" },
  "master-uniform-noun": { topic: "daily-life" },
  "master-unit-noun": { vietnamese: "đơn vị" },
  "master-university-noun": { topic: "education" },
  "master-unlike-adjective": {
    definition: "different from another person or thing",
    example: "The two sisters have very unlike personalities.",
  },
  "master-unusual-adjective": { example: "The bird has an unusual blue tail." },
  "master-upset-adjective": { topic: "emotions" },
  "master-use-noun": { topic: "actions" },
  "master-valley-noun": { definition: "a long, low area between hills or mountains, often with a river through it" },
  "master-value-noun": { topic: "quantity" },
  "master-view-noun": {
    definition: "an opinion or way of thinking about something",
    vietnamese: "quan điểm, ý kiến",
    example: "In my view, the plan is too expensive.",
  },
  "master-village-noun": { topic: "places" },
  "master-violent-adjective": {
    example: "The violent storm damaged several houses.",
    topic: "safety",
  },
  "master-voice-noun": {
    vietnamese: "tiếng nói, giọng nói",
    topic: "sounds",
  },
  "master-wave-noun": { topic: "nature" },
  "master-weak-adjective": { topic: "body" },
  "master-wealth-noun": { example: "The family gained its wealth through trade." },
  "master-weigh-verb": { topic: "quantity" },
  "master-weight-noun": { topic: "quantity" },
  "master-west-adjective": {
    example: "The west entrance is near the bus stop.",
    topic: "places",
  },
  "master-west-adverb": { topic: "movement" },
  "master-west-noun": { topic: "places" },
  "master-wide-adverb": { topic: "description" },
  "master-widely-adverb": {
    definition: "by many people or in many places",
    vietnamese: "rộng rãi, phổ biến",
    example: "English is widely spoken around the world.",
  },
  "master-wild-adjective": {
    vietnamese: "hoang dã, mọc tự nhiên",
    topic: "animals",
  },
  "master-wine-noun": { vietnamese: "rượu vang" },
  "master-winner-noun": { topic: "sports" },
  "master-wisdom-noun": {
    example: "Her grandmother shared years of wisdom and experience.",
    topic: "thinking",
  },
  "master-wonder-verb": { vietnamese: "tự hỏi, muốn biết" },
  "master-wrong-adverb": {
    example: "She guessed the final answer wrong.",
    topic: "description",
  },
  "master-yeah-adverb": {
    definition: "an informal way of saying yes",
    vietnamese: "vâng, ừ",
    example: "Yeah, I can help you with that.",
  },
  "master-youth-noun": {
    example: "She spent her youth in a small village.",
    topic: "time",
  },
  "master-zone-noun": { vietnamese: "khu vực, vùng" },
  "v63": { example: "Regular sleep contributes to stronger memory." },
  "v67": { topic: "change" },
  "master-able-adjective": {
    definition: "having the skill or means needed to do something",
    vietnamese: "có khả năng, có năng lực",
    example: "She is able to swim across the pool.",
  },
  "master-absence-noun": {
    definition: "the state of not being present or available",
    example: "His absence from class was unusual.",
  },
  "master-access-noun": {
    definition: "the right or opportunity to enter or use something",
    vietnamese: "quyền truy cập, lối vào",
    example: "Students have free access to the library computers.",
    topic: "technology",
  },
  "master-accompany-verb": { topic: "movement" },
  "master-account-verb": {
    vietnamese: "chiếm",
    topic: "quantity",
  },
  "master-accountant-noun": {
    definition: "a person whose job is to prepare and examine financial records",
    example: "The accountant prepared the company's annual accounts.",
    topic: "work",
  },
  "master-accuracy-noun": {
    definition: "the quality of being correct and exact",
  },
  "master-accuse-verb": {
    definition: "to say that someone has done something wrong or illegal",
    example: "The police accused him of stealing the car.",
  },
  "master-achievement-noun": {
    definition: "something important that is completed successfully through effort",
    topic: "success",
  },
  "master-active-adjective": {
    definition: "involved in activity or doing things regularly",
    example: "She stays active by walking every morning.",
    topic: "health",
  },
  "master-address-verb": {
    definition: "to speak to someone using a particular name or title",
    vietnamese: "xưng hô, gọi",
    example: "Please address the judge as 'Your Honor.'",
    topic: "communication",
  },
  "master-administration-noun": {
    definition: "the work of managing an organization, business, or government",
    topic: "work",
  },
  "master-adopt-verb": {
    definition: "to choose and begin to use a method, idea, or plan",
    vietnamese: "áp dụng, tiếp nhận",
    topic: "decision-making",
  },
  "master-advance-verb": {
    definition: "to move forward or make progress",
    vietnamese: "tiến lên, thúc đẩy",
    example: "The team advanced to the next stage of the project.",
  },
  "master-advertise-verb": {
    vietnamese: "quảng cáo",
  },
  "master-afford-verb": { topic: "money" },
  "master-afterward-adverb": { topic: "time" },
  "master-agenda-noun": {
    definition: "a list of subjects to discuss or tasks to complete",
    vietnamese: "chương trình nghị sự, danh sách công việc",
    example: "Budget planning is the first item on today's agenda.",
  },
  "master-agreement-noun": {
    definition: "an arrangement or decision accepted by two or more people",
    vietnamese: "sự đồng ý, thỏa thuận",
    example: "The two companies reached an agreement on the price.",
  },
  "master-agriculture-noun": {
    definition: "the work and science of growing crops and raising animals",
    topic: "nature",
  },
  "master-aid-noun": {
    definition: "help or supplies given to people in need",
    example: "Emergency aid reached the village after the flood.",
    topic: "society",
  },
  "master-aid-verb": {
    definition: "to help someone or something succeed or improve",
    example: "A local guide aided the rescue team.",
  },
  "master-alike-adjective": {
    definition: "similar to each other in appearance or character",
  },
  "master-alike-adverb": {
    definition: "in the same or a similar way",
    topic: "comparison",
  },
  "master-alternative-noun": {
    definition: "one of two or more choices or possibilities",
    vietnamese: "lựa chọn thay thế",
    topic: "decision-making",
  },
  "master-ambitious-adjective": {
    definition: "determined to be successful or achieve difficult goals",
    vietnamese: "có tham vọng, có hoài bão",
    example: "She is ambitious and hopes to lead the department.",
    topic: "success",
  },
  "master-amount-noun": {
    vietnamese: "số lượng",
    topic: "quantity",
  },
  "master-analysis-noun": {
    definition: "a careful study of something to understand its parts or causes",
    example: "The report includes an analysis of customer feedback.",
  },
  "master-anger-noun": {
    definition: "a strong feeling of displeasure about someone or something",
    example: "He struggled to control his anger during the argument.",
  },
  "master-annual-adjective": {
    definition: "happening once every year",
    vietnamese: "hằng năm, thường niên",
    example: "The company published its annual report in June.",
    topic: "time",
  },
  "master-annually-adverb": { topic: "time" },
  "master-appetite-noun": {
    definition: "a natural desire for food",
    example: "My blocked nose is making me lose my appetite.",
    topic: "health",
  },
  "master-appoint-verb": {
    definition: "to officially choose someone for a job or position",
    vietnamese: "bổ nhiệm",
    topic: "work",
  },
  "master-appreciation-noun": {
    definition: "the ability to recognize and understand the value of something",
    vietnamese: "sự trân trọng, sự đánh giá cao",
    example: "The course gave her a greater appreciation of local art.",
    topic: "emotions",
  },
  "master-approve-verb": {
    definition: "to officially accept or agree to something",
    topic: "decision-making",
  },
  "master-approximately-adverb": {
    definition: "close to a particular number or amount, but not exact",
    topic: "quantity",
  },
  "master-arise-verb": { topic: "events" },
  "master-arm-verb": { topic: "safety" },
  "master-army-noun": { example: "The army protected the country's northern border." },
  "master-arrange-verb": {
    definition: "to organize or put things in a particular order",
  },
  "master-arrangement-noun": {
    definition: "a plan or preparation made for a particular purpose",
    vietnamese: "sự sắp xếp, kế hoạch",
    example: "We made travel arrangements before booking the hotel.",
    topic: "planning",
  },
  "master-arrest-noun": {
    definition: "the act of taking someone into police custody",
    topic: "safety",
  },
  "master-arrest-verb": { topic: "safety" },
  "master-arrival-noun": {
    vietnamese: "sự đến nơi",
    topic: "travel",
  },
  "master-arrow-noun": {
    definition: "a thin weapon with a pointed end that is shot from a bow",
    vietnamese: "mũi tên",
    example: "Her arrow landed near the center of the target.",
    topic: "sports",
  },
  "master-artist-noun": {
    definition: "a person who creates paintings, drawings, music, or other art",
    vietnamese: "nghệ sĩ, họa sĩ",
    topic: "arts",
  },
  "master-artistic-adjective": {
    definition: "showing skill or imagination in creating art",
    vietnamese: "có tính nghệ thuật",
    example: "Her artistic talent was clear in every painting.",
    topic: "arts",
  },
  "master-aside-adverb": {
    example: "She stepped aside to let us pass.",
    topic: "movement",
  },
  "master-aspect-noun": {
    definition: "one part or feature of a situation, idea, or problem",
    vietnamese: "khía cạnh",
  },
  "master-assignment-noun": {
    vietnamese: "bài tập, nhiệm vụ được giao",
    topic: "education",
  },
  "master-assistance-noun": { topic: "society" },
  "master-associate-verb": {
    definition: "to connect someone or something with another person or thing in your mind",
  },
  "master-athletic-adjective": {
    definition: "relating to sports or physically strong and active",
    vietnamese: "thuộc thể thao, khỏe mạnh",
    example: "She joined the university's athletic program.",
    topic: "sports",
  },
  "master-attach-verb": {
    definition: "to fasten or join one thing to another",
    example: "Attach the label firmly to the container.",
  },
  "master-attain-verb": {
    definition: "to succeed in reaching a particular level, state, or goal",
    example: "She attained the highest level in the course.",
    topic: "success",
  },
  "master-attempt-verb": {
    example: "She will attempt to finish the climb before sunset.",
    topic: "actions",
  },
  "master-attract-verb": {
    definition: "to cause someone or something to come closer or pay attention",
    vietnamese: "thu hút, hấp dẫn",
  },
  "master-authority-noun": { topic: "society" },
  "master-award-verb": {
    definition: "to officially give someone a prize, payment, or honor",
    example: "The judges awarded her first prize.",
    topic: "success",
  },
  "master-aware-adjective": { topic: "thinking" },
  "master-awkward-adjective": {
    definition: "causing difficulty, discomfort, or embarrassment",
    vietnamese: "bất tiện, khó xử",
  },
  "master-back-verb": {
    definition: "to support a person, plan, or idea",
    vietnamese: "ủng hộ, hậu thuẫn",
  },
  "master-bang-noun": { topic: "sounds" },
  "master-bang-verb": { example: "He banged his fist on the table." },
  "master-bar-verb": { topic: "society" },
  "master-barrel-noun": {
    definition: "a large round container with flat ends",
    example: "The workers stored the wine in a wooden barrel.",
  },
  "master-base-verb": { topic: "places" },
  "master-basis-noun": {
    definition: "the main reason, principle, or support for something",
    example: "Trust is the basis of their partnership.",
  },
  "master-battle-noun": {
    definition: "a difficult struggle against a person, problem, or illness",
    vietnamese: "cuộc chiến, sự đấu tranh",
    topic: "society",
  },
  "master-beat-verb": {
    definition: "to hit something repeatedly",
  },
  "master-behalf-noun": {
    vietnamese: "thay mặt, nhân danh",
    topic: "society",
  },
  "master-besides-preposition": {
    definition: "in addition to someone or something",
    vietnamese: "ngoài, bên cạnh",
    example: "Besides homework, she has a part-time job.",
  },
  "master-bet-verb": { topic: "money" },
  "master-bilingual-adjective": {
    definition: "able to speak two languages",
    vietnamese: "song ngữ, thông thạo hai ngôn ngữ",
    example: "She is bilingual in English and Vietnamese.",
    topic: "language",
  },
  "master-bill-verb": {
    vietnamese: "tính tiền, gửi hóa đơn",
    topic: "money",
  },
  "master-biography-noun": {
    definition: "the written story of a person's life by someone else",
    example: "She wrote a biography of the famous scientist.",
    topic: "literature",
  },
  "master-biology-noun": { topic: "education" },
  "master-bitter-adjective": {
    definition: "having a sharp, unpleasant taste like black coffee",
    example: "The medicine left a bitter taste in my mouth.",
    topic: "food",
  },
  "master-blame-noun": {
    definition: "responsibility for something bad that has happened",
    vietnamese: "trách nhiệm, sự đổ lỗi",
    topic: "society",
  },
  "master-bleed-verb": { example: "His cut finger continued to bleed." },
  "master-blend-verb": {
    definition: "to mix substances together until they combine",
    example: "Blend the fruit, yogurt, and milk until smooth.",
    topic: "food",
  },
  "master-block-verb": {
    definition: "to prevent movement through a place or passage",
    vietnamese: "chặn, ngăn cản",
  },
  "master-board-verb": {
    definition: "to get onto a train, bus, ship, or aircraft",
    vietnamese: "lên tàu, xe hoặc máy bay",
    topic: "travel",
  },
  "master-bomb-noun": {
    definition: "a weapon designed to explode",
    example: "The police safely removed the unexploded bomb.",
    topic: "safety",
  },
  "master-bomb-verb": {
    topic: "safety",
  },
  "master-bond-noun": {
    definition: "a close connection between people based on love or shared experience",
    vietnamese: "mối liên kết, tình cảm gắn bó",
    topic: "relationships",
  },
  "master-book-verb": {
    vietnamese: "đặt trước",
    topic: "travel",
  },
  "master-border-noun": {
    definition: "the official line separating two countries or regions",
    vietnamese: "biên giới, ranh giới",
    topic: "places",
  },
  "master-bounce-verb": { topic: "movement" },
  "master-breath-noun": { topic: "body" },
  "master-brick-noun": {
    definition: "a small rectangular block used for building walls",
    example: "The mason placed each brick carefully in the wall.",
  },
  "master-builder-noun": {
    topic: "people",
  },
  "master-bull-noun": {
    definition: "an adult male cow",
    vietnamese: "bò đực",
  },
  "master-bullet-noun": {
    definition: "a small metal object fired from a gun",
    example: "The officer found a bullet near the damaged wall.",
    topic: "safety",
  },
  "master-bust-verb": {
    definition: "to break or damage something",
    vietnamese: "làm vỡ, phá hỏng",
    example: "The fall busted the old suitcase.",
  },
  "master-but-preposition": {
    definition: "with the exception of someone or something",
    vietnamese: "ngoại trừ, trừ",
  },
  "master-calculation-noun": { topic: "thinking" },
  "master-calm-adjective": {
    vietnamese: "bình tĩnh, yên lặng",
  },
  "master-cancer-noun": {
    definition: "a serious disease in which abnormal cells grow uncontrollably",
    example: "Doctors detected the cancer at an early stage.",
    topic: "health",
  },
  "master-capable-adjective": {
    definition: "having the ability or qualities needed to do something",
    vietnamese: "có khả năng, có năng lực",
  },
  "master-capacity-noun": { topic: "quantity" },
  "master-capture-noun": {
    definition: "the act of catching and holding a person or animal",
    topic: "safety",
  },
  "master-capture-verb": {
    example: "The officers captured the escaped prisoner.",
    topic: "safety",
  },
  "master-care-verb": {
    definition: "to feel concern or interest about someone or something",
    vietnamese: "quan tâm, để ý",
    example: "She cares deeply about the environment.",
  },
  "master-career-noun": {
    definition: "a job or profession that you do for many years",
    example: "She began her career as a science teacher.",
    topic: "work",
  },
  "master-casual-adjective": {
    definition: "relaxed and not formal",
    vietnamese: "thoải mái, không trang trọng",
  },
  "master-category-noun": {
    definition: "a group of people or things that share similar features",
    example: "Books are divided into several subject categories.",
    topic: "thinking",
  },
  "master-cattle-noun": {
    definition: "cows and bulls kept on a farm",
    vietnamese: "gia súc, bò",
    example: "The cattle are grazing in the field.",
  },
  "master-caution-noun": { topic: "safety" },
  "master-cautious-adjective": { topic: "safety" },
  "master-celebrity-noun": {
    vietnamese: "người nổi tiếng",
    example: "The actor became an international celebrity.",
  },
  "master-cell-noun": {
    definition: "a small room in a prison where a prisoner is kept",
    vietnamese: "phòng giam",
    topic: "places",
  },
  "master-channel-noun": {
    definition: "a television or radio service that broadcasts programs",
    vietnamese: "kênh truyền hình, kênh phát thanh",
  },
  "master-citizenship-noun": {
    definition: "the legal status of being a citizen of a country",
    example: "She applied for citizenship after living there for ten years.",
    topic: "society",
  },
  "master-civil-adjective": {
    definition: "relating to citizens and their rights rather than the military",
    vietnamese: "dân sự, thuộc công dân",
    topic: "society",
  },
  "master-claim-noun": {
    vietnamese: "lời tuyên bố, lời khẳng định",
  },
  "master-classify-verb": {
    definition: "to arrange people or things into groups by their features",
    example: "Scientists classify animals according to shared characteristics.",
  },
  "master-clear-verb": {
    definition: "to remove unwanted things from a place",
    vietnamese: "dọn, dọn sạch",
    example: "Please clear the table after dinner.",
    topic: "daily-life",
  },
  "master-climate-noun": {
    definition: "the usual weather conditions of a place over a long period",
    example: "The region has a hot, dry climate.",
    topic: "nature",
  },
  "master-clinic-noun": { topic: "health" },
  "master-closely-adverb": {
    definition: "in a way that has a strong or direct connection",
    vietnamese: "chặt chẽ, mật thiết",
    topic: "relationships",
  },
  "master-coast-verb": {
    definition: "to move without using power, especially downhill",
    vietnamese: "trôi theo quán tính",
  },
  "master-collapse-noun": { topic: "events" },
  "master-collar-noun": { topic: "clothing" },
  "master-combination-noun": { topic: "relationships" },
  "master-comfort-noun": {
    definition: "a state of physical ease and freedom from pain or worry",
    vietnamese: "sự thoải mái, dễ chịu",
    topic: "emotions",
  },
  "master-command-noun": {
    definition: "the authority to give orders and control people",
    vietnamese: "quyền chỉ huy",
    topic: "society",
  },
  "master-commercial-adjective": {
    vietnamese: "thuộc thương mại, buôn bán",
    topic: "business",
  },
  "master-commonly-adverb": {
    definition: "often or by many people",
    example: "This plant is commonly found near rivers.",
    topic: "description",
  },
  "master-comparison-noun": {
    definition: "the act of examining how two or more things are similar or different",
    example: "A comparison of the two plans revealed several differences.",
    topic: "comparison",
  },
  "master-compete-verb": {
    definition: "to try to win or be more successful than others",
    example: "Athletes from twenty countries competed in the race.",
  },
  "master-competitive-adjective": { topic: "success" },
  "master-complement-noun": {
    definition: "something that improves another thing when added to it",
    example: "The salad is a fresh complement to the main dish.",
    topic: "relationships",
  },
  "master-complete-verb": { topic: "success" },
  "master-completely-adverb": { topic: "description" },
  "master-complicate-verb": {
    definition: "to make something more difficult to understand or deal with",
    example: "The new rules may complicate the application process.",
  },
  "master-concentration-noun": {
    definition: "the amount of a substance present in a particular volume",
    vietnamese: "nồng độ, sự tập trung",
    topic: "quantity",
  },
  "master-concept-noun": {
    definition: "an idea or principle used to understand something",
    example: "Students discussed the concept of equal opportunity.",
  },
  "master-conclude-verb": {
    definition: "to bring a speech, meeting, or event to an end",
    topic: "communication",
  },
  "master-conclusion-noun": {
    definition: "an opinion or decision reached after considering the evidence",
    vietnamese: "kết luận",
    topic: "thinking",
  },
  "master-conduct-noun": {
    example: "The school expects high standards of conduct from students.",
    topic: "society",
  },
  "master-confidence-noun": { topic: "emotions" },
  "master-confirmation-noun": { topic: "communication" },
  "master-conflict-noun": {
    definition: "a serious disagreement or struggle between people or groups",
    example: "Both sides agreed to seek a peaceful end to the conflict.",
    topic: "society",
  },
  "master-connect-verb": {
    definition: "to join or link two or more things",
    vietnamese: "kết nối, nối liền",
    example: "The technician connected the device to the battery.",
    topic: "relationships",
  },
  "master-conservation-noun": {
    definition: "the protection of natural resources from damage or waste",
    example: "Water conservation is essential during a drought.",
    topic: "nature",
  },
  "master-conservative-adjective": {
    definition: "preferring traditional ideas and being cautious about change",
    vietnamese: "bảo thủ, truyền thống",
    topic: "society",
  },
  "master-considerable-adjective": {
    definition: "large enough in amount or degree to be important",
    example: "The repairs will require considerable time and money.",
    topic: "quantity",
  },
  "master-constantly-adverb": {
    definition: "all the time or very often",
    example: "The weather here is constantly changing.",
    topic: "time",
  },
  "master-constitution-noun": { topic: "society" },
  "master-construct-verb": {
    vietnamese: "xây dựng, chế tạo",
    topic: "actions",
  },
  "master-construction-noun": { topic: "work" },
  "master-consumer-noun": { topic: "business" },
  "master-consumption-noun": {
    definition: "the use of goods, energy, or other resources",
    example: "The new equipment reduced electricity consumption.",
    topic: "business",
  },
  "master-content-noun": {
    definition: "the information, ideas, or material contained in something",
    example: "The website provides useful educational content.",
    topic: "communication",
  },
  "master-continually-adverb": {
    definition: "repeatedly over a period of time",
    example: "The software is continually updated with new features.",
    topic: "time",
  },
  "master-continuously-adverb": {
    example: "The machine ran continuously for twelve hours.",
    topic: "time",
  },
  "master-contribution-noun": { topic: "society" },
  "master-control-verb": {
    definition: "to direct, limit, or manage how something works",
    topic: "actions",
  },
  "master-copyright-noun": {
    definition: "the legal right to control how an original work is used",
    example: "The author owns the copyright to the book.",
    topic: "society",
  },
  "master-correction-noun": { topic: "education" },
  "master-cotton-noun": { example: "This shirt is made from soft cotton." },
  "master-council-noun": {
    definition: "a group of people elected or appointed to make decisions",
    example: "The local council approved the new housing plan.",
  },
  "master-count-noun": {
    vietnamese: "số lượng, tổng số",
  },
  "master-county-noun": {
    definition: "an area with its own local government that includes several towns",
  },
  "master-crash-verb": {
    definition: "to hit something violently while moving",
    vietnamese: "đâm, va mạnh",
    topic: "events",
  },
  "master-criminal-noun": {
    definition: "a person who has committed or been convicted of a crime",
    example: "The police arrested the criminal near the station.",
    topic: "society",
  },
  "master-crisis-noun": {
    definition: "a time of great danger, difficulty, or uncertainty",
    example: "The government introduced emergency measures during the crisis.",
  },
  "master-critical-adjective": {
    definition: "expressing careful judgment or disapproval",
    example: "The newspaper published a critical review of the policy.",
  },
  "master-crop-noun": {
    definition: "a plant grown by farmers for food or other uses",
    vietnamese: "cây trồng, vụ mùa",
  },
  "master-crush-noun": { topic: "relationships" },
  "master-cultural-adjective": {
    definition: "relating to the customs, arts, and beliefs of a society",
    vietnamese: "thuộc văn hóa",
  },
  "master-cure-noun": { topic: "health" },
  "master-currency-noun": {
    example: "You can exchange foreign currency at the bank.",
  },
  "master-current-adjective": {
    example: "The current situation requires immediate action.",
    topic: "time",
  },
  "master-currently-adverb": {
    definition: "during the present period or situation",
    example: "They are currently trying to call home.",
    topic: "time",
  },
  "master-curriculum-noun": {
    definition: "the subjects and courses taught by a school or college",
    topic: "education",
  },
  "master-cut-noun": {
    definition: "an injury or opening in the skin caused by something sharp",
    vietnamese: "vết cắt",
    topic: "health",
  },
  "master-cycle-verb": {
    definition: "to travel by bicycle",
    vietnamese: "đi xe đạp",
    example: "I cycle to work whenever the weather is dry.",
  },
  "master-date-verb": {
    vietnamese: "hẹn hò",
    topic: "relationships",
  },
  "master-deal-verb": { topic: "problem-solving" },
  "master-debt-noun": {
    definition: "money that a person or organization owes",
    example: "She paid off her bank debt within two years.",
  },
  "master-decision-noun": {
    definition: "a choice made after considering different possibilities",
    vietnamese: "quyết định, sự lựa chọn",
    example: "After careful thought, she made a decision to accept the job.",
    topic: "decision-making",
  },
  "master-decline-noun": { topic: "quantity" },
  "master-decrease-noun": { topic: "quantity" },
  "master-deed-noun": { topic: "actions" },
  "master-defend-verb": {
    definition: "to protect someone or something from attack or criticism",
    example: "The soldiers defended the town against the attack.",
    topic: "safety",
  },
  "master-define-verb": {
    definition: "to explain the exact meaning of a word or idea",
    example: "The dictionary defines each technical term clearly.",
  },
  "master-definite-adjective": {
    definition: "clear, certain, and unlikely to change",
    vietnamese: "chắc chắn, rõ ràng",
    example: "We need a definite answer by Friday.",
  },
  "master-definitely-adverb": {
    definition: "without any doubt",
    vietnamese: "chắc chắn, nhất định",
    topic: "certainty",
  },
  "master-definition-noun": {
    definition: "an explanation of the meaning of a word or phrase",
    example: "Please look up the definition in a dictionary.",
  },
  "master-deliver-verb": {
    vietnamese: "giao, chuyển đến",
  },
  "master-delivery-noun": {
    definition: "the act of taking goods or mail to a person or place",
    vietnamese: "sự giao hàng, sự chuyển phát",
    topic: "business",
  },
  "master-demand-noun": { topic: "business" },
  "master-democracy-noun": {
    definition: "a system of government in which people choose their leaders by voting",
  },
  "master-demonstration-noun": {
    definition: "an act of showing how something works or proving that it is true",
    example: "The chef gave a demonstration of the new cooking technique.",
  },
  "master-departure-noun": {
    definition: "the act of leaving a place",
    example: "Our departure was delayed by heavy snow.",
    topic: "travel",
  },
  "master-depression-noun": {
    definition: "a medical condition that causes persistent sadness and loss of interest",
    vietnamese: "bệnh trầm cảm",
    example: "She sought professional help for her depression.",
    topic: "health",
  },
  "master-deprive-verb": {
    definition: "to prevent someone from having something necessary or desired",
    example: "The punishment deprived prisoners of phone access.",
  },
  "master-designer-noun": {
    definition: "a person who plans how products, clothes, or other things will look and work",
  },
  "master-desire-noun": {
    definition: "a strong feeling of wanting something",
    vietnamese: "mong muốn, khát khao",
    example: "She expressed a strong desire to continue her studies.",
  },
  "master-desperate-adjective": { topic: "emotions" },
  "master-destination-noun": {
    definition: "the place to which someone or something is traveling",
    vietnamese: "điểm đến",
    topic: "travel",
  },
  "master-development-noun": { topic: "change" },
  "master-diagram-noun": { vietnamese: "sơ đồ, biểu đồ" },
  "master-diameter-noun": { topic: "quantity" },
  "master-differ-verb": {
    vietnamese: "khác, không giống",
    topic: "comparison",
  },
  "master-dioxide-noun": {
    vietnamese: "đioxit",
    example: "Carbon dioxide is released when fuels burn.",
  },
  "master-direct-verb": {
    definition: "to point or guide someone or something toward a place",
    vietnamese: "hướng, chỉ dẫn",
  },
  "master-disability-noun": {
    definition: "a physical or mental condition that limits some activities",
    vietnamese: "khuyết tật, tình trạng khuyết tật",
    example: "The school provides support for students with disabilities.",
    topic: "health",
  },
  "master-disable-verb": {
    definition: "to make a device or system unable to work",
    vietnamese: "vô hiệu hóa, tắt",
    topic: "technology",
  },
  "master-disagreement-noun": {
    definition: "a situation in which people have different opinions",
    vietnamese: "sự bất đồng, sự không đồng ý",
    topic: "communication",
  },
  "master-disaster-noun": {
    definition: "an event that causes great damage, loss, or suffering",
    topic: "safety",
  },
  "master-discount-noun": {
    definition: "a reduction in the usual price of something",
    vietnamese: "khoản giảm giá",
    example: "Students receive a ten percent discount on tickets.",
    topic: "money",
  },
  "master-discrimination-noun": {
    definition: "unfair treatment of people because of characteristics such as race or sex",
    vietnamese: "sự phân biệt đối xử",
    example: "The law protects workers from discrimination.",
    topic: "society",
  },
  "master-disease-noun": { topic: "health" },
  "master-display-verb": {
    definition: "to show something where people can see it",
    topic: "communication",
  },
  "master-distance-noun": { topic: "quantity" },
  "master-distinction-noun": {
    definition: "an important difference between two similar things",
    example: "The report makes a clear distinction between cost and value.",
    topic: "comparison",
  },
  "master-distribute-verb": { topic: "actions" },
  "master-distribution-noun": {
    definition: "the process of supplying goods to different people or places",
    topic: "business",
  },
  "master-district-noun": {
    vietnamese: "quận, khu vực",
  },
  "master-divide-noun": {
    definition: "a strong difference or separation between groups of people",
    vietnamese: "sự chia rẽ, khoảng cách",
    example: "There is a growing divide between rich and poor families.",
    topic: "society",
  },
  "master-dot-noun": {
    vietnamese: "dấu chấm, chấm nhỏ",
  },
  "master-downward-adjective": {
    example: "The graph shows a downward trend in prices.",
  },
  "master-dump-noun": { topic: "places" },
  "master-dump-verb": { topic: "nature" },
  "master-duty-noun": { topic: "work" },
  "master-eager-adjective": { topic: "emotions" },
  "master-economic-adjective": {
    vietnamese: "thuộc kinh tế",
    topic: "business",
  },
  "master-economy-noun": {
    definition: "the system by which a country produces, trades, and uses goods and services",
    vietnamese: "nền kinh tế",
    topic: "business",
  },
  "master-edge-noun": {
    definition: "the outer boundary or side of a surface",
    vietnamese: "cạnh, rìa",
    example: "She placed the cup near the edge of the table.",
    topic: "description",
  },
  "master-edition-noun": {
    definition: "a particular version of a book, newspaper, or program",
    vietnamese: "ấn bản, phiên bản",
    example: "The second edition includes three new chapters.",
    topic: "literature",
  },
  "master-educate-verb": { topic: "education" },
  "master-either-determiner": {
    vietnamese: "một trong hai, bất kỳ bên nào",
  },
  "master-election-noun": { topic: "society" },
  "master-electrical-adjective": {
    example: "An electrical engineer inspected the damaged circuit.",
    topic: "technology",
  },
  "master-electricity-noun": { topic: "technology" },
  "master-electron-noun": {
    definition: "a tiny particle with a negative electrical charge",
    example: "Each electron carries a negative charge.",
    topic: "science",
  },
  "master-electronic-adjective": {
    definition: "using or relating to electronic equipment and technology",
    example: "What does that electronic device do?",
    topic: "technology",
  },
  "master-emotional-adjective": { topic: "emotions" },
  "master-emphasis-noun": { topic: "communication" },
  "master-employment-noun": {
    definition: "paid work or the state of having a job",
    vietnamese: "việc làm, sự tuyển dụng",
    example: "The new factory created employment for local workers.",
    topic: "work",
  },
  "master-directly-adverb": { topic: "description" },
  "master-enable-verb": {
    definition: "to make it possible for someone or something to do something",
    example: "The new software enables users to share files securely.",
  },
  "master-encounter-noun": { topic: "events" },
  "master-endless-adjective": {
    definition: "continuing for a very long time or seeming never to end",
    example: "The meeting became an endless debate about minor details.",
  },
  "master-endure-verb": { topic: "emotions" },
  "master-engage-verb": {
    definition: "to take part in a particular activity",
    vietnamese: "tham gia",
    example: "Students engage in several outdoor activities each week.",
    topic: "activities",
  },
  "master-engine-noun": {
    definition: "the part of a machine that produces power",
    vietnamese: "động cơ",
    example: "The mechanic repaired the car's engine.",
  },
  "master-ensure-verb": { topic: "certainty" },
  "master-enthusiastic-adjective": { topic: "emotions" },
  "master-entirely-adverb": {
    definition: "completely and in every way",
    topic: "description",
  },
  "master-entry-noun": { topic: "places" },
  "master-environmental-adjective": {
    definition: "relating to the natural world and its protection",
    topic: "nature",
  },
  "master-equal-adjective": {
    example: "The two groups contain an equal number of students.",
    topic: "comparison",
  },
  "master-equality-noun": {
    definition: "the state of having the same rights and opportunities",
    vietnamese: "sự bình đẳng",
    topic: "society",
  },
  "master-equally-adverb": { topic: "comparison" },
  "master-equipment-noun": {
    definition: "the tools or machines needed for a job or activity",
    vietnamese: "thiết bị, dụng cụ",
    example: "The team checked its safety equipment before climbing.",
  },
  "master-escape-verb": {
    definition: "to get away from a dangerous or unpleasant situation",
    example: "We reached a shelter to escape the storm.",
    topic: "safety",
  },
  "master-estimate-verb": {
    definition: "to roughly calculate an amount, cost, or time",
    vietnamese: "ước tính, ước lượng",
    example: "Can you estimate how long the journey will take?",
    topic: "quantity",
  },
  "master-eventually-adverb": { topic: "time" },
  "master-examination-noun": {
    definition: "a formal test of knowledge or ability",
    vietnamese: "kỳ thi, bài kiểm tra",
    example: "Did you pass the English examination last week?",
    topic: "education",
  },
  "master-exclusive-adjective": {
    definition: "limited to one person or group and not shared with others",
    vietnamese: "độc quyền, dành riêng",
  },
  "master-existence-noun": {
    definition: "the state of being real or present",
    example: "Scientists found evidence of the lake's earlier existence.",
  },
  "master-exit-noun": {
    vietnamese: "lối ra",
    example: "The emergency exit is at the end of the corridor.",
    topic: "places",
  },
  "master-exit-verb": {
    example: "Please exit the building through the rear door.",
  },
  "master-expense-noun": {
    vietnamese: "chi phí, khoản chi",
  },
  "master-experience-verb": { topic: "experience" },
  "master-experiment-noun": { topic: "science" },
  "master-exploration-noun": { topic: "science" },
  "master-explosion-noun": {
    definition: "a sudden violent burst that releases energy and causes damage",
    vietnamese: "vụ nổ",
    topic: "safety",
  },
  "master-expose-verb": {
    definition: "to leave someone unprotected from something harmful",
    vietnamese: "để tiếp xúc, phơi nhiễm",
    topic: "health",
  },
  "master-extend-verb": {
    definition: "to make something last longer or reach farther",
    vietnamese: "kéo dài, mở rộng",
    topic: "time",
  },
  "master-extent-noun": {
    definition: "the degree or amount to which something is true or happens",
    vietnamese: "mức độ, phạm vi",
    topic: "quantity",
  },
  "master-extra-noun": { topic: "shopping" },
  "master-extreme-adjective": {
    definition: "very great or far beyond what is usual",
    vietnamese: "cực độ, nghiêm trọng",
  },
  "master-facility-noun": { topic: "places" },
  "master-failure-noun": {
    definition: "a lack of success or an unsuccessful person or thing",
    vietnamese: "sự thất bại, thất bại",
    topic: "success",
  },
  "master-fascinate-verb": { topic: "emotions" },
  "master-fax-noun": {
    definition: "a document sent electronically through a fax machine",
    vietnamese: "bản fax, điện fax",
    example: "Did you receive the fax I sent this morning?",
    topic: "communication",
  },
  "master-feed-verb": { example: "I feed my dog twice a day." },
  "master-fellow-noun": {
    vietnamese: "người đàn ông, anh chàng",
  },
  "master-fight-verb": {
    example: "The children often fight over the same toy.",
    topic: "society",
  },
  "master-film-verb": {
    vietnamese: "quay phim, ghi hình",
    topic: "communication",
  },
  "master-finance-verb": { topic: "money" },
  "master-financial-adjective": { topic: "money" },
  "master-fine-noun": {
    vietnamese: "tiền phạt",
  },
  "master-firm-noun": { topic: "business" },
  "master-fish-verb": { topic: "actions" },
  "master-fit-verb": {
    definition: "to be the right size or shape for someone or something",
    topic: "clothing",
  },
  "master-flow-noun": { topic: "movement" },
  "master-form-verb": {
    definition: "to create or develop a particular shape or structure",
    example: "The students formed a circle around the teacher.",
  },
  "master-formally-adverb": {
    definition: "in an official or appropriately serious way",
    example: "The ambassador was formally introduced to the guests.",
    topic: "description",
  },
  "master-formula-noun": { topic: "problem-solving" },
  "master-forth-adverb": { topic: "movement" },
  "master-freely-adverb": { topic: "description" },
  "master-frequently-adverb": {
    vietnamese: "thường xuyên",
    topic: "time",
  },
  "master-frustration-noun": {
    definition: "the feeling of being annoyed because you cannot achieve something",
    vietnamese: "sự thất vọng, sự bực bội",
  },
  "master-fuel-noun": {
    definition: "a substance used to produce heat or power",
    example: "The truck uses diesel as fuel.",
  },
  "master-function-noun": { topic: "description" },
  "master-fund-noun": {
    vietnamese: "quỹ, nguồn tiền",
  },
  "master-fund-verb": {
    definition: "to provide money for a project or activity",
    vietnamese: "tài trợ, cấp vốn",
    topic: "money",
  },
  "master-furnish-verb": {
    definition: "to provide a room or building with furniture",
    vietnamese: "trang bị nội thất",
    topic: "home",
  },
  "master-further-adverb": { topic: "description" },
  "master-future-adjective": { topic: "time" },
  "master-gain-noun": {
    definition: "an increase or a benefit obtained from something",
    vietnamese: "sự gia tăng, lợi ích",
    example: "The company reported a significant gain in sales.",
    topic: "quantity",
  },
  "master-gain-verb": {
    definition: "to obtain something useful or valuable",
    example: "She gained valuable experience during the internship.",
  },
  "master-gap-noun": {
    vietnamese: "khoảng cách, sự chênh lệch",
    topic: "society",
  },
  "master-gay-adjective": {
    definition: "sexually or romantically attracted to people of the same sex",
    vietnamese: "đồng tính",
    example: "He is an openly gay actor.",
    topic: "relationships",
  },
  "master-gene-noun": {
    definition: "a section of DNA that controls an inherited characteristic",
    example: "Scientists identified a gene linked to the disease.",
    topic: "science",
  },
  "master-general-adjective": {
    example: "The report begins with a general overview of the problem.",
  },
  "master-generally-adverb": { topic: "description" },
  "master-generate-verb": { topic: "technology" },
  "master-generous-adjective": { topic: "emotions" },
  "master-gentleman-noun": {
    definition: "a polite and well-mannered man",
    vietnamese: "quý ông, người đàn ông lịch thiệp",
    example: "He behaved like a gentleman throughout the evening.",
  },
  "master-geographical-adjective": {
    definition: "relating to the physical features and locations of places",
    example: "The mountains form a clear geographical boundary.",
    topic: "nature",
  },
  "master-geography-noun": {
    definition: "the study of places, people, and the physical features of the Earth",
    topic: "education",
  },
  "master-global-adjective": { example: "Climate change is a global problem." },
  "master-go-noun": {
    definition: "a turn or opportunity to do something",
    vietnamese: "lượt",
    example: "It is my go, so please pass me the dice.",
    topic: "activities",
  },
  "master-governor-noun": { vietnamese: "thống đốc" },
  "master-graduate-noun": {
    definition: "a person who has completed a course at a school or university",
    vietnamese: "người tốt nghiệp, cử nhân",
    topic: "education",
  },
  "master-grant-noun": {
    definition: "money given by an organization for a particular purpose",
    vietnamese: "khoản trợ cấp, khoản tài trợ",
  },
  "master-grant-verb": {
    definition: "to officially give someone permission, a right, or a request",
    example: "The council granted permission for the new building.",
    topic: "society",
  },
  "master-graph-noun": { topic: "quantity" },
  "master-graphics-noun": { vietnamese: "đồ họa, hình ảnh đồ họa" },
  "master-grave-noun": { topic: "places" },
  "master-greenhouse-noun": {
    definition: "a glass building that traps heat for growing plants",
    example: "Tomatoes grow well inside the warm greenhouse.",
    topic: "nature",
  },
  "master-group-verb": {
    example: "The teacher grouped students by reading level.",
    topic: "actions",
  },
  "master-growth-noun": { topic: "change" },
  "master-guess-noun": {
    example: "My guess is that the repairs will cost about eighty dollars.",
    topic: "thinking",
  },
  "master-guidance-noun": {
    definition: "advice or help that shows someone what to do",
    example: "The new employees received guidance from an experienced manager.",
  },
  "master-guilty-adjective": {
    definition: "responsible for committing a crime or doing something wrong",
    example: "The court found him guilty of theft.",
    topic: "society",
  },
  "master-habitat-noun": {
    example: "Wetlands provide a natural habitat for many birds.",
    topic: "nature",
  },
  "master-half-adverb": { topic: "quantity" },
  "master-handle-verb": {
    definition: "to hold, touch, or move something with your hands",
    example: "Please handle the glass equipment carefully.",
  },
  "master-hang-verb": { example: "Please hang the picture on the living-room wall." },
  "master-hazard-noun": {
    definition: "something that may cause danger or harm",
    vietnamese: "mối nguy hiểm, nguy cơ",
    example: "Ice on the road is a serious driving hazard.",
    topic: "safety",
  },
  "master-headline-noun": {
    definition: "the title of a newspaper article, usually printed in large letters",
    vietnamese: "tiêu đề báo, dòng tít",
  },
  "master-height-noun": {
    example: "The wall reaches a height of three meters.",
    topic: "quantity",
  },
  "master-highlight-verb": { topic: "communication" },
  "master-highly-adverb": { topic: "description" },
  "master-hip-noun": {
    definition: "the joint or outer area where the leg meets the body",
    vietnamese: "hông, khớp hông",
  },
  "master-hire-verb": {
    definition: "to employ someone and pay them to work",
    topic: "work",
  },
  "master-hit-noun": {
    definition: "an act of striking someone or something",
    topic: "actions",
  },
  "master-honest-adjective": {
    vietnamese: "trung thực, thật thà",
    example: "Please give me an honest answer.",
  },
  "master-horizon-noun": {
    definition: "the line where the land or sea appears to meet the sky",
    example: "The sun disappeared below the horizon.",
    topic: "nature",
  },
  "master-household-noun": {
    example: "Four people live in our household.",
    topic: "family",
  },
  "master-human-noun": {
    definition: "a person; a member of the human species",
    example: "Humans have a major effect on the natural world.",
    topic: "people",
  },
  "master-hunt-noun": {
    vietnamese: "cuộc tìm kiếm, cuộc săn tìm",
    example: "The police began a nationwide hunt for the suspect.",
    topic: "safety",
  },
  "master-hunt-verb": { topic: "animals" },
  "master-hurt-adjective": { topic: "emotions" },
  "master-identity-noun": {
    definition: "the qualities, beliefs, and details that make a person who they are",
    vietnamese: "danh tính, bản sắc",
    topic: "society",
  },
  "master-ignore-verb": {
    definition: "to deliberately pay no attention to someone or something",
  },
  "master-illness-noun": { topic: "health" },
  "master-immediate-adjective": { topic: "time" },
  "master-immediately-adverb": { topic: "time" },
  "master-improvement-noun": {
    definition: "a change that makes something better",
    example: "The latest update is a major improvement over the old version.",
    topic: "change",
  },
  "master-incident-noun": {
    definition: "an event, especially one that is unusual or unpleasant",
    example: "The police recorded the incident in their report.",
  },
  "master-increase-noun": { topic: "quantity" },
  "master-increasingly-adverb": {
    definition: "more and more over time",
    vietnamese: "ngày càng",
    topic: "change",
  },
  "master-incredible-adjective": {
    example: "The athlete completed the race at incredible speed.",
  },
  "master-incredibly-adverb": {
    definition: "in an extreme or hard-to-believe way",
    topic: "description",
  },
  "master-indirectly-adverb": { topic: "description" },
  "master-industry-noun": {
    definition: "businesses that produce a particular type of goods or services",
    topic: "business",
  },
  "master-inevitable-adjective": {
    vietnamese: "không thể tránh khỏi, chắc chắn xảy ra",
    example: "Some delays were inevitable during the repairs.",
    topic: "certainty",
  },
  "master-inform-verb": { topic: "communication" },
  "master-ingredient-noun": {
    definition: "one of the foods or substances used to make a dish",
    vietnamese: "nguyên liệu, thành phần",
    example: "The main ingredients in the pie are apples and peaches.",
  },
  "master-initially-adverb": {
    definition: "at the beginning",
    example: "Initially, the new system seemed difficult to use.",
    topic: "time",
  },
  "master-inject-verb": {
    definition: "to put medicine into the body using a needle",
    example: "The nurse injected the medicine into his arm.",
  },
  "master-injury-noun": {
    definition: "physical harm or damage to a person's or animal's body",
    vietnamese: "chấn thương, thương tích",
    topic: "health",
  },
  "master-insist-verb": {
    definition: "to demand something firmly and refuse to accept disagreement",
    example: "She insisted on paying for the meal.",
  },
  "master-inspire-verb": {
    definition: "to make someone feel eager or able to do something creative or worthwhile",
    vietnamese: "truyền cảm hứng, khơi gợi",
    topic: "emotions",
  },
  "master-institute-noun": { topic: "education" },
  "master-instructor-noun": {
    definition: "a person whose job is to teach a skill or subject",
    example: "The driving instructor taught her how to park safely.",
    topic: "education",
  },
  "master-intend-verb": { example: "Do you intend to stay online much longer?" },
  "master-interact-verb": { topic: "relationships" },
  "master-interaction-noun": {
    definition: "communication or activity between people or things that affect each other",
    example: "The course encourages interaction between students and teachers.",
    topic: "relationships",
  },
  "master-intermediate-adjective": { topic: "education" },
  "master-interview-verb": {
    definition: "to ask someone questions formally for a job, report, or study",
    vietnamese: "phỏng vấn",
    example: "The manager interviewed three job applicants.",
  },
  "master-invasion-noun": {
    definition: "the act of entering a country by force with an army",
    example: "Thousands of residents fled during the invasion.",
    topic: "safety",
  },
  "master-invest-verb": {
    definition: "to put money, time, or effort into something for a future benefit",
    example: "The company plans to invest in renewable energy.",
    topic: "money",
  },
  "master-investigation-noun": {
    vietnamese: "sự điều tra, nghiên cứu",
    topic: "thinking",
  },
  "master-isolation-noun": { topic: "emotions" },
  "master-jazz-noun": {
    definition: "a style of music with strong rhythms and improvisation",
    vietnamese: "nhạc jazz",
    example: "The club hosts live jazz every Friday night.",
    topic: "arts",
  },
  "master-joint-adjective": {
    example: "The two organizations issued a joint statement.",
    topic: "relationships",
  },
  "master-joke-verb": { topic: "communication" },
  "master-journalist-noun": { vietnamese: "nhà báo, phóng viên" },
  "master-justice-noun": {
    definition: "fair treatment according to the law and accepted principles",
    example: "The victims continued their campaign for justice.",
    topic: "society",
  },
  "master-kid-verb": {
    definition: "to say something that is not true as a joke",
    vietnamese: "nói đùa, trêu",
  },
  "master-lab-noun": {
    vietnamese: "phòng thí nghiệm",
    topic: "science",
  },
  "master-landlord-noun": {
    example: "The landlord repaired the heating in our apartment.",
  },
  "master-largely-adverb": { topic: "description" },
  "master-last-adverb": {
    definition: "at the most recent time",
    topic: "time",
  },
  "master-last-verb": { topic: "time" },
  "master-lately-adverb": { topic: "time" },
  "master-laugh-noun": { topic: "sounds" },
  "master-laughter-noun": {
    example: "Laughter filled the classroom after the teacher's joke.",
    topic: "sounds",
  },
  "master-launch-verb": { topic: "business" },
  "master-lay-verb": {
    definition: "to put something down flat or in a particular position",
    example: "Lay the book on the table, please.",
  },
  "master-layer-noun": {
    definition: "a level or thickness of material covering a surface",
    vietnamese: "lớp, tầng",
  },
  "master-lead-verb": {
    definition: "to guide a person or group toward a place or goal",
    vietnamese: "dẫn dắt, chỉ đường",
    topic: "movement",
  },
  "master-lean-adjective": {
    vietnamese: "thon gọn, ít mỡ",
    example: "Regular exercise helped him stay lean and healthy.",
    topic: "body",
  },
  "master-least-adverb": { topic: "quantity" },
  "master-leave-noun": {
    vietnamese: "kỳ nghỉ phép, thời gian nghỉ",
    example: "She took ten days of leave to visit her mother.",
    topic: "work",
  },
  "master-legal-adjective": {
    example: "It is legal to park here after six o'clock.",
    topic: "society",
  },
  "master-legally-adverb": {
    example: "The document must be signed before it is legally valid.",
    topic: "society",
  },
  "master-length-noun": { topic: "quantity" },
  "master-lie-noun": { vietnamese: "lời nói dối" },
  "master-lift-noun": {
    vietnamese: "chuyến đi nhờ xe",
    topic: "travel",
  },
  "master-lift-verb": {
    definition: "to raise someone or something to a higher position",
    topic: "actions",
  },
  "master-light-verb": {
    definition: "to start a fire or make something begin to burn",
    example: "We used dry wood to light the fire.",
  },
  "master-limit-noun": {
    example: "There is a strict limit on the number of visitors.",
    topic: "quantity",
  },
  "master-link-verb": {
    definition: "to connect two or more people, places, or things",
    vietnamese: "kết nối, liên kết",
    topic: "relationships",
  },
  "master-literature-noun": { topic: "literature" },
  "master-little-determiner": {
    definition: "a small amount of something",
  },
  "master-liver-noun": {
    vietnamese: "gan",
    topic: "body",
  },
  "master-locate-verb": { topic: "places" },
  "master-location-noun": {
    example: "The store moved to a more convenient location.",
    topic: "places",
  },
  "master-lock-verb": {
    definition: "to fasten something with a key or locking device",
    topic: "safety",
  },
  "master-loss-noun": {
    definition: "the state of no longer having something or being unable to find it",
    topic: "ownership",
  },
  "master-loyal-adjective": { topic: "relationships" },
  "master-loyalty-noun": {
    definition: "the quality of continuing to support a person, group, or cause",
    example: "Her loyalty to the team continued through difficult seasons.",
    topic: "relationships",
  },
  "master-mail-verb": {
    vietnamese: "gửi qua bưu điện",
    topic: "communication",
  },
  "master-majority-noun": { topic: "quantity" },
  "master-management-noun": {
    definition: "the work of controlling and organizing a business or activity",
    example: "This building uses a computerized energy management system.",
    topic: "business",
  },
  "master-marble-noun": {
    definition: "a hard polished stone used for floors, walls, and sculptures",
    example: "The entrance hall has a polished marble floor.",
  },
  "master-market-verb": {
    definition: "to advertise and promote a product for sale",
    vietnamese: "tiếp thị, quảng bá",
    topic: "business",
  },
  "master-marriage-noun": { topic: "relationships" },
  "master-match-verb": {
    definition: "to be similar to or suitable for something",
    vietnamese: "phù hợp, tương xứng",
    topic: "comparison",
  },
  "master-mathematics-noun": { topic: "education" },
  "master-maximum-adjective": {
    example: "The machine can operate at maximum pressure.",
    topic: "quantity",
  },
  "master-meaningful-adjective": {
    definition: "having an important purpose or value",
  },
  "master-meanwhile-adverb": { topic: "time" },
  "master-measure-noun": { topic: "problem-solving" },
  "master-measure-verb": { topic: "quantity" },
  "master-mechanical-adjective": { topic: "technology" },
  "master-medium-adjective": {
    example: "Would you like a small, medium, or large drink?",
    topic: "quantity",
  },
  "master-medium-noun": {
    definition: "a substance through which energy or signals can travel",
    vietnamese: "môi trường, chất trung gian",
    topic: "science",
  },
  "master-mental-adjective": {
    definition: "relating to the mind or processes of thinking and feeling",
    vietnamese: "thuộc tinh thần, tâm lý",
    topic: "health",
  },
  "master-merchant-noun": { topic: "business" },
  "master-merely-adverb": { topic: "description" },
  "master-minimum-adjective": {
    example: "Workers must receive the minimum wage.",
    topic: "quantity",
  },
  "master-minority-noun": {
    definition: "the smaller part of a group, usually less than half",
    vietnamese: "thiểu số, phần ít",
  },
  "master-mislead-verb": {
    definition: "to cause someone to believe something that is not true",
    vietnamese: "làm hiểu lầm, đánh lừa",
    example: "The advertisement may mislead customers about the true cost.",
    topic: "communication",
  },
  "master-model-adjective": {
    example: "She was praised as a model citizen.",
  },
  "master-model-verb": {
    definition: "to demonstrate behavior that others can copy",
    vietnamese: "làm gương, làm mẫu",
    example: "Parents should model the behavior they expect from their children.",
    topic: "education",
  },
  "master-molecule-noun": { topic: "science" },
  "master-monitor-noun": { topic: "technology" },
  "master-monitor-verb": {
    definition: "to watch or check something regularly for changes or problems",
    vietnamese: "theo dõi, giám sát",
    example: "Nurses monitor the patient's condition throughout the night.",
    topic: "safety",
  },
  "master-moral-noun": {
    definition: "a principle about what is right and wrong",
    vietnamese: "nguyên tắc đạo đức, bài học",
    example: "The story teaches a clear moral about honesty.",
    topic: "society",
  },
  "master-more-adverb": {
    definition: "in a greater degree or amount than before",
    example: "This chapter is more interesting than the last one.",
    topic: "comparison",
  },
  "master-moreover-adverb": {
    definition: "used to add another related and important point",
  },
  "master-motive-noun": { topic: "thinking" },
  "master-movement-noun": { topic: "movement" },
  "master-murder-verb": { topic: "safety" },
  "master-myth-noun": { topic: "literature" },
  "master-naked-adjective": { topic: "clothing" },
  "master-narrow-adjective": {
    definition: "having only a small distance from side to side",
    example: "The truck crossed a narrow bridge.",
  },
  "master-nasty-adjective": {
    definition: "very unpleasant, unkind, or difficult to deal with",
    vietnamese: "khó chịu, tồi tệ",
    example: "He was in a nasty mood after the argument.",
  },
  "master-naturally-adverb": { topic: "description" },
  "master-near-adverb": {
    definition: "at or to a short distance away",
    example: "The deadline is drawing near.",
    topic: "time",
  },
  "master-nearby-adjective": {
    example: "We walked to a nearby village.",
    topic: "places",
  },
  "master-nearby-adverb": { topic: "places" },
  "master-negotiation-noun": {
    definition: "a discussion intended to produce an agreement",
    topic: "business",
  },
  "master-network-noun": { topic: "relationships" },
  "master-nevertheless-adverb": {
    definition: "despite what has just been said or mentioned",
  },
  "master-nonetheless-adverb": {
    definition: "despite what has just been said or done",
  },
  "master-normally-adverb": { topic: "time" },
  "master-northern-adjective": { topic: "places" },
  "master-nuclear-adjective": {
    definition: "relating to atomic energy or weapons that use it",
    vietnamese: "thuộc hạt nhân",
    example: "The country closed its oldest nuclear power station.",
    topic: "science",
  },
  "master-nucleus-noun": {
    vietnamese: "hạt nhân, trung tâm",
    topic: "science",
  },
  "master-numerous-adjective": {
    definition: "existing in large numbers",
    example: "Numerous ants gathered near the food.",
    topic: "quantity",
  },
  "master-nurse-verb": {
    definition: "to care for a sick or injured person or animal",
    vietnamese: "chăm sóc, điều dưỡng",
    topic: "health",
  },
  "master-nutrient-noun": {
    definition: "a substance in food that supports growth and health",
    vietnamese: "chất dinh dưỡng",
    topic: "health",
  },
  "master-object-noun": { topic: "objects" },
  "master-objection-noun": { topic: "communication" },
  "master-objective-noun": { topic: "success" },
  "master-observation-noun": { topic: "senses" },
  "master-obstacle-noun": { topic: "problem-solving" },
  "master-obviously-adverb": { topic: "description" },
  "master-occasion-verb": {
    definition: "to cause an event or situation to happen",
    topic: "events",
  },
  "master-off-preposition": {
    definition: "away from or no longer supported by a surface",
    vietnamese: "khỏi, rời khỏi",
  },
  "master-offensive-adjective": { topic: "communication" },
  "master-officially-adverb": { topic: "society" },
  "master-operation-noun": {
    definition: "a medical procedure in which a surgeon treats the body",
    vietnamese: "ca phẫu thuật, cuộc mổ",
    topic: "health",
  },
  "master-opposite-adverb": {
    definition: "in a position facing another person or thing",
    example: "They sat opposite each other at the table.",
    topic: "places",
  },
  "master-opposite-noun": { topic: "comparison" },
  "master-opposition-noun": { topic: "society" },
  "master-option-noun": { topic: "decision-making" },
  "master-oral-noun": {
    definition: "an examination in which answers are spoken rather than written",
    example: "The language course ends with a short oral.",
    topic: "education",
  },
  "master-organ-noun": { topic: "body" },
  "master-organism-noun": { topic: "nature" },
  "master-otherwise-adverb": {
    vietnamese: "nếu không, bằng cách khác",
  },
  "master-outer-adjective": {
    example: "The outer layer of the coat is waterproof.",
  },
  "master-overnight-adjective": {
    example: "We booked an overnight train to Paris.",
    topic: "time",
  },
  "master-overnight-adverb": { topic: "time" },
  "master-owe-verb": { topic: "money" },
  "master-oxygen-noun": {
    definition: "a colorless gas that people and animals need to breathe",
    example: "Patients with breathing difficulties may need extra oxygen.",
    topic: "science",
  },
  "master-package-noun": { topic: "objects" },
  "master-pain-noun": { topic: "health" },
  "master-painful-adjective": {
    definition: "causing physical or emotional pain",
    example: "Walking was painful after she injured her ankle.",
    topic: "health",
  },
  "master-pardon-verb": { topic: "society" },
  "master-parental-adjective": {
    definition: "relating to a parent or parents",
    vietnamese: "thuộc cha mẹ",
    topic: "family",
  },
  "master-partial-adjective": {
    definition: "not complete or affecting only part of something",
  },
  "master-participant-noun": {
    example: "Each participant received a certificate after the event.",
  },
  "master-particularly-adverb": { topic: "description" },
  "master-passport-noun": {
    definition: "an official document that allows a person to travel between countries",
    example: "Show your passport at the border checkpoint.",
    topic: "travel",
  },
  "master-past-adjective": {
    example: "Past experience helped her solve the problem.",
    topic: "time",
  },
  "master-pause-noun": {
    definition: "a short period when an activity stops",
    example: "There was a brief pause before the speaker continued.",
  },
  "master-pause-verb": {
    definition: "to stop an activity for a short time",
    example: "She paused the video to answer the phone.",
    topic: "time",
  },
  "master-permanently-adverb": {
    vietnamese: "vĩnh viễn, lâu dài",
    topic: "time",
  },
  "master-permit-verb": {
    definition: "to allow someone to do something",
    vietnamese: "cho phép",
    example: "The rules permit visitors to take photographs.",
  },
  "master-phenomenon-noun": { topic: "science" },
  "master-physics-noun": { topic: "science" },
  "master-pin-verb": {
    definition: "to fasten something in place with a pin",
  },
  "master-pit-noun": {
    vietnamese: "hố sâu",
  },
  "master-place-verb": {
    example: "Please place the keys on the table.",
  },
  "master-plan-verb": {
    vietnamese: "lập kế hoạch, dự định",
    topic: "planning",
  },
  "master-plant-verb": {
    vietnamese: "trồng, gieo",
    topic: "nature",
  },
  "master-plastic-noun": {
    definition: "a light artificial material that can be shaped into many forms",
    vietnamese: "nhựa, chất dẻo",
    example: "The bottle is made from recycled plastic.",
  },
  "master-platform-noun": {
    example: "The speaker stepped onto the platform to address the crowd.",
  },
  "master-poison-noun": { topic: "safety" },
  "master-policy-noun": { topic: "society" },
  "master-politician-noun": {
    definition: "a person who works in politics or holds elected office",
    example: "The politician answered questions from local voters.",
    topic: "society",
  },
  "master-politics-noun": { topic: "society" },
  "master-port-noun": {
    example: "The cargo ship arrived at the port before sunrise.",
  },
  "master-positive-adjective": {
    vietnamese: "tích cực, lạc quan",
    topic: "emotions",
  },
  "master-positively-adverb": {
    vietnamese: "một cách tích cực",
    topic: "description",
  },
  "master-possibility-noun": {
    vietnamese: "khả năng, điều có thể xảy ra",
    topic: "possibility",
  },
  "master-potential-noun": {
    definition: "the ability to develop, succeed, or become useful in the future",
    vietnamese: "tiềm năng",
    topic: "possibility",
  },
  "master-pound-noun": {
    vietnamese: "bảng Anh",
    example: "The pound rose slightly against the dollar.",
    topic: "money",
  },
  "master-powder-noun": {
    definition: "a dry substance made of very small particles",
    example: "Mix the cocoa powder with warm milk.",
  },
  "master-precious-adjective": {
    example: "The old photographs are precious to her family.",
    topic: "emotions",
  },
  "master-prejudice-noun": {
    definition: "an unfair opinion about a person or group formed without enough knowledge",
    example: "The campaign challenges prejudice against religious minorities.",
    topic: "society",
  },
  "master-preparation-noun": {
    definition: "the process of getting ready for something",
    topic: "planning",
  },
  "master-prescription-noun": { topic: "health" },
  "master-presence-noun": {
    definition: "the state of being in a particular place",
    example: "Her presence at the meeting surprised everyone.",
  },
  "master-preserve-verb": {
    definition: "to keep something in its original or good condition",
    example: "The museum works to preserve ancient manuscripts.",
    topic: "change",
  },
  "master-press-noun": {
    vietnamese: "báo chí, giới truyền thông",
    topic: "communication",
  },
  "master-previous-adjective": { topic: "time" },
  "master-primarily-adverb": {
    definition: "mainly or for the most important reason",
    vietnamese: "chủ yếu, phần lớn",
    example: "The course is designed primarily for beginners.",
    topic: "description",
  },
  "master-principle-noun": {
    definition: "a basic rule or belief that guides behavior",
    vietnamese: "nguyên tắc, nguyên lý",
    topic: "thinking",
  },
  "master-prison-noun": { topic: "places" },
  "master-prisoner-noun": { topic: "society" },
  "master-privacy-noun": {
    definition: "the state of being free from unwanted attention or observation",
    example: "The curtains give the room more privacy.",
  },
  "master-prize-noun": { topic: "success" },
  "master-process-noun": { topic: "planning" },
  "master-productive-adjective": {
    definition: "achieving useful results in a reasonable amount of time",
    vietnamese: "hiệu quả, năng suất",
    example: "We had a productive meeting and solved three problems.",
    topic: "work",
  },
  "master-professor-noun": {
    example: "Professor Karrow is my favorite university teacher.",
    topic: "education",
  },
  "master-prominent-adjective": {
    definition: "important, well known, or easy to notice",
    vietnamese: "nổi bật, đáng chú ý",
  },
  "master-promote-verb": {
    definition: "to support or encourage the growth of something",
    vietnamese: "thúc đẩy, khuyến khích",
    topic: "change",
  },
  "master-properly-adverb": { topic: "description" },
  "master-property-noun": { topic: "ownership" },
  "master-proportion-noun": { topic: "quantity" },
  "master-prosperity-noun": {
    definition: "the state of being successful and financially secure",
    example: "Improved trade brought greater prosperity to the region.",
    topic: "success",
  },
  "master-protect-verb": { topic: "safety" },
  "master-protection-noun": { topic: "safety" },
  "master-protest-noun": { topic: "society" },
  "master-proud-adjective": {
    vietnamese: "tự hào, hãnh diện",
    example: "She felt proud of completing the difficult course.",
    topic: "emotions",
  },
  "master-pub-noun": { topic: "places" },
  "master-publicly-adverb": { topic: "society" },
  "master-punishment-noun": { topic: "society" },
  "master-pupil-noun": { topic: "education" },
  "master-push-noun": { example: "Can you give the stalled car a push?" },
  "master-puzzle-noun": { example: "I have just completed a thousand-piece puzzle." },
  "master-qualify-verb": { topic: "success" },
  "master-questionnaire-noun": {
    definition: "a written set of questions used to collect information",
    vietnamese: "bảng câu hỏi, phiếu khảo sát",
    example: "The researchers gave a questionnaire to every participant.",
  },
  "master-queue-noun": {
    vietnamese: "hàng người, hàng chờ",
  },
  "master-race-noun": { topic: "sports" },
  "master-radiation-noun": {
    definition: "energy transmitted as waves or particles",
    example: "The equipment measures radiation levels in the building.",
    topic: "science",
  },
  "master-railway-noun": {
    definition: "a track and transport system used by trains",
    example: "The railway connects the city with several coastal towns.",
    topic: "travel",
  },
  "master-rank-noun": {
    definition: "a position in a list based on importance or achievement",
    vietnamese: "thứ hạng, cấp bậc",
    topic: "success",
  },
  "master-rapidly-adverb": {
    definition: "very quickly or at a fast rate",
    example: "The town grew rapidly after the new factory opened.",
    topic: "time",
  },
  "master-rarely-adverb": {
    example: "I rarely see the North Star from the city.",
    topic: "time",
  },
  "master-reach-noun": {
    definition: "the distance within which someone can touch or get something",
    vietnamese: "tầm với, phạm vi",
    topic: "quantity",
  },
  "master-realistic-adjective": {
    definition: "showing things as they really are or likely to be",
    example: "The team set a realistic deadline for the project.",
  },
  "master-reality-noun": { topic: "thinking" },
  "master-reduction-noun": { topic: "quantity" },
  "master-refuse-noun": {
    definition: "waste material that people throw away",
    vietnamese: "rác thải, đồ bỏ đi",
    example: "The city collects household refuse every Tuesday.",
  },
  "master-regain-verb": {
    definition: "to get back something that was lost",
  },
  "master-regional-adjective": {
    definition: "relating to a particular area of a country or the world",
    vietnamese: "thuộc khu vực, vùng miền",
    topic: "places",
  },
  "master-register-verb": { topic: "education" },
  "master-regulation-noun": {
    definition: "an official rule that controls an activity",
    vietnamese: "quy định, điều lệ",
    topic: "society",
  },
  "master-reject-verb": {
    vietnamese: "từ chối, bác bỏ",
    topic: "decision-making",
  },
  "master-relate-verb": { topic: "relationships" },
  "master-relation-noun": { topic: "relationships" },
  "master-relative-adjective": {
    definition: "considered in comparison with something else",
    vietnamese: "tương đối",
    topic: "comparison",
  },
  "master-relative-noun": { topic: "family" },
  "master-relatively-adverb": {
    definition: "in comparison with something else",
    vietnamese: "tương đối",
    topic: "comparison",
  },
  "master-release-verb": {
    example: "The court ordered officials to release the prisoner.",
    topic: "society",
  },
  "master-religion-noun": { topic: "culture" },
  "master-religious-adjective": { topic: "culture" },
  "master-remainder-noun": { topic: "quantity" },
  "master-remark-verb": {
    definition: "to say something as a comment or observation",
    vietnamese: "nhận xét, bình luận",
    example: "Several visitors remarked on the building's unusual design.",
  },
  "master-remarkable-adjective": {
    example: "She made remarkable progress in just three months.",
  },
  "master-remedy-noun": { topic: "health" },
  "master-renew-verb": { topic: "change" },
  "master-repeatedly-adverb": { topic: "time" },
  "master-report-verb": {
    definition: "to give information about an event or situation",
    vietnamese: "báo cáo, tường thuật",
  },
  "master-representative-noun": {
    definition: "a person chosen to speak or act for others",
    vietnamese: "người đại diện, đại biểu",
  },
  "master-reproduce-verb": {
    example: "The museum reproduced the painting for an exhibition.",
    topic: "actions",
  },
  "master-reputation-noun": {
    definition: "the opinion that people generally have about someone or something",
    vietnamese: "danh tiếng, uy tín",
    example: "The restaurant has a reputation for excellent service.",
    topic: "society",
  },
  "master-researcher-noun": { topic: "science" },
  "master-resemble-verb": { topic: "comparison" },
  "master-reservation-noun": {
    definition: "a feeling of doubt about accepting an idea or plan",
    vietnamese: "sự dè dặt, điều nghi ngại",
    example: "I have reservations about approving the plan so quickly.",
    topic: "thinking",
  },
  "master-reserve-noun": { topic: "quantity" },
  "master-reserve-verb": {
    definition: "to keep something for a particular person or future use",
    vietnamese: "dành trước, đặt trước",
    topic: "planning",
  },
  "master-resident-adjective": {
    example: "Only resident students may use this accommodation.",
    topic: "places",
  },
  "master-residential-adjective": { topic: "places" },
  "master-respect-noun": { topic: "relationships" },
  "master-respect-verb": {
    example: "I respect her calm and honest leadership.",
    topic: "relationships",
  },
  "master-responsibility-noun": { topic: "responsibility" },
  "master-rest-verb": { topic: "health" },
  "master-restore-verb": { topic: "change" },
  "master-result-verb": { topic: "events" },
  "master-retail-noun": { topic: "business" },
  "master-revision-noun": {
    definition: "a change made to improve a text, plan, or piece of work",
    topic: "education",
  },
  "master-reward-noun": {
    definition: "something given in return for good work or behavior",
    vietnamese: "phần thưởng",
    example: "The dog received a small treat as a reward.",
    topic: "success",
  },
  "master-rewrite-verb": {
    example: "Please rewrite the final paragraph more clearly.",
  },
  "master-rise-noun": { topic: "quantity" },
  "master-rise-verb": { topic: "movement" },
  "master-risk-noun": { topic: "safety" },
  "master-robot-noun": { topic: "technology" },
  "master-room-verb": { topic: "home" },
  "master-round-adjective": {
    vietnamese: "tròn, tròn trịa",
    example: "The child drew a round face.",
  },
  "master-round-noun": {
    definition: "one complete stage or series in an activity",
    vietnamese: "vòng, lượt",
    example: "Our team reached the final round of the competition.",
    topic: "activities",
  },
  "master-safety-noun": { topic: "safety" },
  "master-satellite-noun": {
    definition: "an object that moves in orbit around a planet or other body",
    example: "The satellite sends weather images back to Earth.",
    topic: "science",
  },
  "master-satisfaction-noun": {
    definition: "a pleasant feeling that something has met your needs or expectations",
    vietnamese: "sự hài lòng, sự thỏa mãn",
    example: "She looked at the finished work with satisfaction.",
  },
  "master-scatter-verb": {
    definition: "to throw or spread things in different directions",
    example: "The wind scattered papers across the street.",
  },
  "master-scholarship-noun": {
    definition: "money given to a student to support their education",
    example: "She received a scholarship to study engineering.",
    topic: "education",
  },
  "master-score-noun": { topic: "sports" },
  "master-scratch-noun": {
    vietnamese: "vết xước, vết cào",
    topic: "objects",
  },
  "master-scream-verb": { topic: "sounds" },
  "master-search-verb": {
    vietnamese: "tìm kiếm, lục tìm",
    example: "I searched the shelf but could not find the book.",
    topic: "problem-solving",
  },
  "master-second-adverb": { topic: "description" },
  "master-secret-adjective": {
    example: "The recipe contains a secret ingredient.",
  },
  "master-security-noun": {
    definition: "protection from danger or the state of being safe and stable",
    topic: "safety",
  },
  "master-seize-verb": {
    example: "Police seized the stolen goods at the border.",
    topic: "safety",
  },
  "master-select-adjective": {
    example: "The shop offers a select range of fine wines.",
    topic: "description",
  },
  "master-sensation-noun": { topic: "body" },
  "master-separation-noun": {
    definition: "the act of dividing or keeping people or things apart",
    vietnamese: "sự phân chia, sự tách biệt",
    topic: "actions",
  },
  "master-sequence-noun": { topic: "planning" },
  "master-series-noun": {
    definition: "a number of similar or related events or things that follow one another",
    example: "The library hosted a series of public lectures.",
    topic: "events",
  },
  "master-serious-adjective": {
    vietnamese: "nghiêm trọng, nghiêm túc",
  },
  "master-service-noun": { topic: "business" },
  "master-service-verb": { topic: "work" },
  "master-settle-verb": { topic: "problem-solving" },
  "master-settlement-noun": {
    example: "The first settlement grew beside the river.",
    topic: "places",
  },
  "master-severe-adjective": {
    vietnamese: "nghiêm trọng, dữ dội",
    topic: "safety",
  },
  "master-severely-adverb": {
    definition: "in a very serious or extreme way",
    vietnamese: "nghiêm trọng, nặng nề",
    example: "The storm severely damaged several houses.",
    topic: "description",
  },
  "master-sex-noun": {
    definition: "physical sexual activity between people",
    vietnamese: "quan hệ tình dục",
    example: "The course provides factual information about sex and health.",
    topic: "health",
  },
  "master-shake-verb": {
    example: "The blast made the windows shake.",
    topic: "movement",
  },
  "master-shallow-adjective": {
    definition: "having only a small distance from the surface to the bottom",
  },
  "master-shape-verb": {
    definition: "to form something into a particular shape",
    example: "She shaped the clay into a bowl.",
    topic: "actions",
  },
  "master-sharp-adjective": {
    definition: "having a thin edge or point that can cut",
    vietnamese: "sắc, nhọn",
    example: "Be careful with the sharp knife.",
    topic: "safety",
  },
  "master-sheer-adjective": {
    vietnamese: "hoàn toàn, tuyệt đối",
    topic: "description",
  },
  "master-sheet-noun": { topic: "home" },
  "master-shift-verb": {
    definition: "to move or change something from one position or focus to another",
  },
  "master-ship-verb": {
    vietnamese: "gửi, vận chuyển",
    topic: "business",
  },
  "master-shop-verb": { topic: "shopping" },
  "master-shortage-noun": { topic: "quantity" },
  "master-shortly-adverb": { topic: "time" },
  "master-shout-verb": {
    example: "Please do not shout in the library.",
  },
  "master-shut-adjective": {
    definition: "closed and not open",
  },
  "master-sign-verb": {
    vietnamese: "ký, ký tên",
  },
  "master-signal-noun": {
    example: "The green light is a signal to continue.",
    topic: "communication",
  },
  "master-similarity-noun": { topic: "comparison" },
  "master-simultaneously-adverb": { topic: "time" },
  "master-single-noun": {
    definition: "a song released separately from an album",
    vietnamese: "đĩa đơn, bài hát đơn",
    topic: "arts",
  },
  "master-slavery-noun": {
    definition: "the system of owning people and forcing them to work",
    vietnamese: "chế độ nô lệ",
    example: "The law finally abolished slavery in the region.",
    topic: "society",
  },
  "master-sleep-noun": { topic: "health" },
  "master-slight-noun": {
    definition: "a deliberate act of treating someone as unimportant",
    example: "She never forgave him for the public slight.",
    topic: "relationships",
  },
  "master-slightly-adverb": {
    vietnamese: "hơi, một chút",
    topic: "description",
  },
  "master-slip-noun": {
    definition: "an accidental slide or loss of balance",
    vietnamese: "sự trượt chân",
    example: "A slip on the wet floor injured his ankle.",
    topic: "safety",
  },
  "master-slot-noun": {
    definition: "a particular time or position in a schedule",
    vietnamese: "khung giờ, vị trí được xếp",
    example: "I booked the earliest appointment slot.",
    topic: "time",
  },
  "master-slow-adverb": { topic: "movement" },
  "master-slow-verb": {
    example: "Heavy traffic can slow the journey.",
  },
  "master-smile-verb": { topic: "emotions" },
  "master-socially-adverb": {
    definition: "in a way that relates to society or interaction with other people",
    vietnamese: "về mặt xã hội, trong giao tiếp xã hội",
    example: "The children learn to interact socially at school.",
    topic: "society",
  },
  "master-somehow-adverb": {
    vietnamese: "bằng cách nào đó, không hiểu sao",
    topic: "thinking",
  },
  "master-sometime-adverb": {
    vietnamese: "vào một lúc nào đó",
    topic: "time",
  },
  "master-sometimes-adverb": { topic: "time" },
  "master-sort-noun": {
    example: "This sort of apple grows well here.",
    topic: "description",
  },
  "master-soul-noun": { topic: "society" },
  "master-southern-adjective": { topic: "places" },
  "master-specialist-noun": { topic: "work" },
  "master-speed-verb": {
    example: "The new engine can speed the boat across the lake.",
  },
  "master-spirit-noun": {
    vietnamese: "linh hồn, thần linh",
    topic: "society",
  },
  "master-split-noun": { topic: "relationships" },
  "master-stable-adjective": {
    vietnamese: "ổn định, vững chắc",
  },
  "master-stall-noun": {
    definition: "a small enclosed area for one person, animal, or business",
    vietnamese: "gian nhỏ, buồng nhỏ, chuồng",
    topic: "places",
  },
  "master-standard-noun": { topic: "description" },
  "master-star-verb": { topic: "arts" },
  "master-stare-verb": {
    example: "Why are so many people staring at me?",
  },
  "master-status-noun": { topic: "society" },
  "master-stay-noun": {
    definition: "a period of time spent in a particular place",
    vietnamese: "kỳ lưu trú, thời gian ở lại",
    topic: "travel",
  },
  "master-steadily-adverb": { topic: "change" },
  "master-steady-adjective": {
    definition: "firm and regular, without sudden changes",
    example: "She kept a steady pace throughout the race.",
  },
  "master-steam-noun": {
    vietnamese: "hơi nước",
  },
  "master-stick-verb": {
    definition: "to attach something to a surface so that it stays in place",
    vietnamese: "dán, gắn",
    example: "Stick the label firmly onto the box.",
  },
  "master-strain-noun": { topic: "health" },
  "master-strategic-adjective": {
    vietnamese: "mang tính chiến lược",
    example: "The bridge has great strategic importance.",
    topic: "planning",
  },
  "master-stream-verb": {
    definition: "to send or receive audio or video continuously over the internet",
    vietnamese: "phát trực tuyến, xem trực tuyến",
    example: "Users can stream music through the app.",
    topic: "technology",
  },
  "master-stress-noun": { topic: "health" },
  "master-stretch-verb": {
    example: "Stretch the fabric gently across the frame.",
  },
  "master-strike-verb": {
    definition: "to hit someone or something with force",
    example: "Be careful not to strike the wall with the ladder.",
  },
  "master-struggle-noun": {
    example: "Learning to walk again was a long struggle.",
  },
  "master-studio-noun": {
    topic: "arts",
  },
  "master-substantial-adjective": {
    definition: "large in amount, value, or importance",
    vietnamese: "đáng kể, lớn, quan trọng",
    topic: "quantity",
  },
  "master-suddenly-adverb": {
    example: "The lights suddenly went out.",
    topic: "time",
  },
  "master-suffer-verb": {
    vietnamese: "chịu đựng, đau khổ",
  },
  "master-suicide-noun": {
    definition: "the act of intentionally ending one's own life",
    vietnamese: "sự tự sát, sự tự tử",
    example: "The campaign focuses on suicide prevention and mental health support.",
    topic: "health",
  },
  "master-summit-noun": {
    definition: "the highest point of a mountain",
    example: "The climbers reached the summit before noon.",
    topic: "nature",
  },
  "master-supply-noun": {
    vietnamese: "nguồn cung, lượng dự trữ",
  },
  "master-supporter-noun": {
    vietnamese: "người ủng hộ, cổ động viên",
    topic: "society",
  },
  "master-suppose-verb": { topic: "thinking" },
  "master-supposedly-adverb": {
    definition: "according to what people claim or believe to be true",
    vietnamese: "được cho là, theo như lời kể",
    example: "The building is supposedly more than two hundred years old.",
    topic: "thinking",
  },
  "master-surely-adverb": { topic: "thinking" },
  "master-surface-noun": { topic: "nature" },
  "master-surgeon-noun": {
    definition: "a doctor who performs medical operations",
    topic: "health",
  },
  "master-surprise-verb": { topic: "emotions" },
  "master-suspect-noun": {
    vietnamese: "nghi phạm, người bị tình nghi",
    topic: "safety",
  },
  "master-switch-verb": {
    definition: "to change from one thing, choice, or position to another",
    vietnamese: "chuyển, đổi",
    example: "We switched seats before the show began.",
  },
  "master-sword-noun": {
    example: "The museum displayed a medieval sword.",
    topic: "safety",
  },
  "master-sympathy-noun": {
    example: "She expressed sympathy for the grieving family.",
  },
  "master-symptom-noun": { topic: "health" },
  "master-syndrome-noun": {
    definition: "a group of signs and symptoms that occur together in a medical condition",
    vietnamese: "hội chứng",
    example: "The doctor explained the symptoms of the syndrome.",
    topic: "health",
  },
  "master-systematic-adjective": { topic: "planning" },
  "master-take-noun": {
    definition: "a particular opinion or interpretation of something",
    vietnamese: "quan điểm, cách nhìn",
    topic: "thinking",
  },
  "master-talk-noun": {
    vietnamese: "bài nói chuyện, bài phát biểu",
  },
  "master-tape-verb": {
    definition: "to record sound or pictures using recording equipment",
    vietnamese: "ghi âm, ghi hình",
  },
  "master-taste-noun": { topic: "senses" },
  "master-tax-noun": {
    definition: "money that people and businesses must pay to the government",
    vietnamese: "thuế",
  },
  "master-tear-verb": {
    definition: "to pull something apart or damage it by making a hole or split",
    vietnamese: "xé, làm rách",
    example: "Be careful not to tear the paper.",
    topic: "actions",
  },
  "master-technique-noun": {
    vietnamese: "kỹ thuật, phương pháp",
    topic: "education",
  },
  "master-technological-adjective": {
    vietnamese: "thuộc về công nghệ",
    example: "The laboratory has made rapid technological progress.",
    topic: "technology",
  },
  "master-tense-adjective": {
    definition: "stretched tight and not relaxed",
    example: "The rope remained tense under the heavy load.",
  },
  "master-tense-noun": {
    vietnamese: "thì của động từ",
    topic: "language",
  },
  "master-tension-noun": {
    vietnamese: "sự căng thẳng",
    topic: "emotions",
  },
  "master-term-noun": {
    vietnamese: "thuật ngữ",
    topic: "language",
  },
  "master-terminal-noun": { topic: "travel" },
  "master-terribly-adverb": {
    definition: "very or to a great and often unpleasant degree",
    vietnamese: "rất, vô cùng",
    example: "I am terribly sorry about the mistake.",
    topic: "description",
  },
  "master-terrorism-noun": { topic: "society" },
  "master-terrorist-noun": {
    example: "Police identified the suspect as a terrorist.",
    topic: "society",
  },
  "master-theft-noun": {
    example: "The store reported the theft to the police.",
    topic: "safety",
  },
  "master-thorough-adjective": {
    definition: "careful and complete, including every important detail",
    vietnamese: "kỹ lưỡng, toàn diện",
  },
  "master-threat-noun": { topic: "safety" },
  "master-through-adverb": { topic: "language" },
  "master-thumb-noun": {
    vietnamese: "ngón cái",
    example: "In many countries, a raised thumb means approval.",
    topic: "body",
  },
  "master-thus-adverb": { topic: "language" },
  "master-tick-noun": {
    vietnamese: "dấu tích, dấu kiểm",
  },
  "master-tick-verb": {
    example: "The old clock continued to tick through the night.",
    topic: "sounds",
  },
  "master-tide-noun": { topic: "nature" },
  "master-tie-verb": {
    vietnamese: "buộc, thắt",
  },
  "master-tighten-verb": {
    vietnamese: "siết chặt, làm căng",
    example: "Can you tighten the lid so the jar does not leak?",
  },
  "master-tire-verb": {
    vietnamese: "trở nên mệt, làm mệt",
  },
  "master-tobacco-noun": { topic: "health" },
  "master-total-adjective": {
    example: "The project was a total failure.",
  },
  "master-total-noun": {
    definition: "the complete amount obtained by adding everything together",
    example: "The total came to fifty dollars.",
    topic: "quantity",
  },
  "master-totally-adverb": { topic: "description" },
  "master-touch-verb": { topic: "senses" },
  "master-tour-verb": {
    vietnamese: "đi tham quan",
    example: "We toured the old castle with a local guide.",
    topic: "travel",
  },
  "master-trace-noun": {
    vietnamese: "dấu vết, một lượng rất nhỏ",
  },
  "master-traditionally-adverb": { topic: "culture" },
  "master-transfer-verb": {
    example: "Please transfer the files to the new computer.",
    topic: "change",
  },
  "master-transformation-noun": {
    example: "The building underwent a complete transformation after the renovation.",
    topic: "change",
  },
  "master-transport-noun": { topic: "travel" },
  "master-treat-noun": {
    vietnamese: "điều thú vị hiếm có, món quà đặc biệt",
    topic: "activities",
  },
  "master-treatment-noun": { topic: "health" },
  "master-tremendous-adjective": {
    vietnamese: "to lớn, rất lớn, tuyệt vời",
  },
  "master-trend-noun": {
    vietnamese: "xu hướng",
    topic: "change",
  },
  "master-trim-noun": {
    definition: "a neat and tidy condition or appearance",
    example: "The garden is in good trim.",
    topic: "description",
  },
  "master-triumph-noun": { topic: "success" },
  "master-tropical-adjective": { topic: "places" },
  "master-tumble-verb": {
    example: "The stack of boxes began to tumble.",
  },
  "master-type-verb": { topic: "technology" },
  "master-typical-adjective": {
    vietnamese: "điển hình, tiêu biểu",
  },
  "master-typically-adverb": { topic: "description" },
  "master-unable-adjective": {
    definition: "not having the ability or opportunity to do something",
    vietnamese: "không thể, không có khả năng",
  },
  "master-unclear-adjective": {
    vietnamese: "không rõ ràng, khó hiểu",
  },
  "master-unemployed-adjective": {
    vietnamese: "thất nghiệp, không có việc làm",
    topic: "work",
  },
  "master-unemployment-noun": { topic: "work" },
  "master-unexpected-adjective": { topic: "events" },
  "master-union-noun": { topic: "society" },
  "master-unlikely-adjective": { topic: "possibility" },
  "master-unusually-adverb": {
    definition: "in a way that is not usual or expected",
    vietnamese: "khác thường, một cách bất thường",
    topic: "description",
  },
  "master-upward-adjective": {
    definition: "moving or directed toward a higher position",
    example: "The graph shows an upward trend.",
  },
  "master-urge-noun": { topic: "emotions" },
  "master-urgent-adjective": { topic: "safety" },
  "master-usage-noun": {
    definition: "the way in which a word, phrase, or object is used",
    vietnamese: "cách dùng, việc sử dụng",
    topic: "language",
  },
  "master-variety-noun": {
    vietnamese: "sự đa dạng, nhiều loại khác nhau",
    topic: "quantity",
  },
  "master-various-adjective": {
    definition: "including several different types or kinds",
  },
  "master-vehicle-noun": { topic: "travel" },
  "master-vein-noun": {
    example: "The nurse found a vein in his arm.",
  },
  "master-victim-noun": {
    definition: "a person harmed by a crime, accident, or other event",
    vietnamese: "nạn nhân",
    topic: "safety",
  },
  "master-victory-noun": {
    example: "The team celebrated a clear victory.",
    topic: "success",
  },
  "master-view-verb": {
    definition: "to regard or consider someone or something in a particular way",
    vietnamese: "xem, coi, nhìn nhận",
  },
  "master-violence-noun": { topic: "safety" },
  "master-virtual-adjective": {
    definition: "created or experienced through computer technology rather than physically",
    vietnamese: "ảo, trực tuyến",
    topic: "technology",
  },
  "master-vision-noun": {
    vietnamese: "thị lực, khả năng nhìn",
    topic: "senses",
  },
  "master-volume-noun": {
    vietnamese: "âm lượng",
    topic: "sounds",
  },
  "master-volunteer-verb": { topic: "society" },
  "master-vowel-noun": { topic: "language" },
  "master-wake-verb": {
    example: "Could you please wake Donald up?",
  },
  "master-warn-verb": { topic: "safety" },
  "master-warranty-noun": {
    definition: "a written promise to repair or replace a product within a certain time",
    vietnamese: "sự bảo hành, giấy bảo hành",
    example: "The laptop comes with a two-year warranty.",
    topic: "business",
  },
  "master-waste-adjective": {
    definition: "no longer wanted or suitable for ordinary use",
    vietnamese: "thải, bỏ đi",
    example: "The factory treats its waste water before release.",
    topic: "materials",
  },
  "master-waste-verb": { topic: "quantity" },
  "master-wave-verb": {
    vietnamese: "vẫy, vẫy tay",
    topic: "communication",
  },
  "master-weapon-noun": {
    example: "The guard locked the weapon in a secure cabinet.",
    topic: "safety",
  },
  "master-welcome-adjective": {
    vietnamese: "được hoan nghênh, dễ chịu",
    example: "The cool rain brought welcome relief after the heat.",
  },
  "master-whoever-pronoun": {
    definition: "any person who does a particular thing or is in a particular situation",
    example: "Whoever arrives first should open the windows.",
  },
  "master-whole-noun": {
    definition: "all of something considered as one complete thing",
    example: "The whole of the building was renovated.",
    topic: "quantity",
  },
  "master-willingness-noun": { topic: "emotions" },
  "master-wire-noun": { topic: "technology" },
  "master-witness-verb": {
    definition: "to see an event happen, especially an important or unusual one",
    example: "Several people witnessed the accident.",
  },
  "master-workplace-noun": { topic: "work" },
  "master-workshop-noun": { topic: "work" },
  "master-worth-adjective": { topic: "money" },
  "master-worthwhile-adjective": { topic: "success" },
  "master-worthy-adjective": {
    example: "The committee supported this worthy cause.",
  },
  "master-wound-noun": { topic: "health" },
};

export function applyVocabularyQaCorrection(item: VocabularyItem): VocabularyItem {
  const correction = vocabularyQaCorrections[item.id];
  if (!correction) return item;
  return {
    ...item,
    meanings: [{
      ...item.meanings[0],
      definition: correction.definition ?? item.meanings[0].definition,
      vietnamese: correction.vietnamese ?? item.meanings[0].vietnamese,
    }, ...item.meanings.slice(1)],
    examples: correction.example ? [correction.example, ...item.examples.slice(1)] : item.examples,
    topics: correction.topic ? [correction.topic, ...(item.topics ?? []).slice(1)] : item.topics,
  };
}
