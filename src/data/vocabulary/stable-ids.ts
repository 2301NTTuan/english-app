/** IDs that existed before the production vocabulary-quality phase. Never remove or reuse them silently. */
export const legacyVocabularyIds = [
  ...Array.from({ length: 120 }, (_, index) => `v${index + 1}`),
  ...["arrive", "begin", "buy", "carry", "city", "clean", "family", "friend", "happy", "help", "house", "important", "job", "live", "meal", "morning", "need", "question", "read", "speak", "teacher", "travel", "water", "work"].map((word) => `a1-${word}`),
  ...["abroad", "appointment", "available", "customer", "environment", "experience", "healthy", "invite", "journey", "manage", "opportunity", "organize", "patient", "prepare", "recommend", "relationship", "repair", "schedule", "share", "solution", "surprise", "tradition", "weather", "worry"].map((word) => `a2-${word}`),
  ...["advantage", "behavior", "commitment", "concern", "convince", "deadline", "efficient", "encourage", "expectation", "goal", "impact", "independent", "issue", "negotiate", "outcome", "participate", "prevent", "priority", "recover", "resource", "responsible", "support", "tend", "requirement"].map((word) => `b1-${word}`),
];

/** IDs accepted after validating foundational batch 001. Keep this list literal so ID regeneration is detectable. */
const foundation001Ids = [
  ...["person", "man", "woman", "child", "parent", "name", "place", "room", "door", "table", "chair", "bed", "school", "book", "phone", "car", "bus", "train", "street", "shop", "food", "bread", "rice", "coffee", "tea", "day", "night", "week", "today", "tomorrow", "yesterday", "go", "come", "eat", "drink", "sleep", "write", "listen", "watch", "open", "close", "big", "small", "good", "bad", "new", "old", "young", "hot", "cold", "fast", "slow", "near", "far"].map((word) => `foundation-a1-${word}`),
  ...["airport", "hotel", "restaurant", "hospital", "office", "neighbour", "colleague", "manager", "meeting", "project", "problem", "idea", "plan", "price", "cost", "money", "bill", "receipt", "holiday", "trip", "map", "traffic", "crowded", "quiet", "noisy", "comfortable", "dangerous", "safe", "possible", "impossible", "popular", "local", "public", "private", "change", "continue", "return", "choose", "leave", "miss", "catch", "spend", "save", "pay", "order", "cancel", "forget", "hope", "feel", "seem", "happen", "visit"].map((word) => `foundation-a2-${word}`),
];

export const acceptedVocabularyIds = [...legacyVocabularyIds, ...foundation001Ids];
