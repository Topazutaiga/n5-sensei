export interface JLPTQuestion {
  type: "vocab_reading" | "kanji_reading" | "sentence_completion" | "grammar_choice" | "reading_comp";
  question: string;
  context?: string;
  options: string[];
  answer: string;
}

export const JLPT_EXERCISES: JLPTQuestion[] = [
  // Vocab reading
  {
    type: "vocab_reading",
    question: "What does 食べる mean?",
    options: ["to eat", "to drink", "to sleep", "to run"],
    answer: "to eat",
  },
  {
    type: "vocab_reading",
    question: "What does 大きい mean?",
    options: ["big", "small", "fast", "slow"],
    answer: "big",
  },
  {
    type: "vocab_reading",
    question: "What does 新しい mean?",
    options: ["new", "old", "hot", "cold"],
    answer: "new",
  },
  {
    type: "vocab_reading",
    question: "What does 元気 mean?",
    options: ["healthy/energetic", "tired", "sad", "busy"],
    answer: "healthy/energetic",
  },
  {
    type: "vocab_reading",
    question: "What does 好き mean?",
    options: ["like/love", "hate", "fear", "doubt"],
    answer: "like/love",
  },
  {
    type: "vocab_reading",
    question: "What does 時計 mean?",
    options: ["clock/watch", "phone", "book", "bag"],
    answer: "clock/watch",
  },
  {
    type: "vocab_reading",
    question: "What does 友達 mean?",
    options: ["friend", "teacher", "student", "parent"],
    answer: "friend",
  },
  {
    type: "vocab_reading",
    question: "What does 電話 mean?",
    options: ["telephone", "television", "radio", "computer"],
    answer: "telephone",
  },
  {
    type: "vocab_reading",
    question: "What does 病院 mean?",
    options: ["hospital", "school", "park", "store"],
    answer: "hospital",
  },
  {
    type: "vocab_reading",
    question: "What does 公園 mean?",
    options: ["park", "river", "mountain", "ocean"],
    answer: "park",
  },

  // Kanji reading
  {
    type: "kanji_reading",
    question: "What is the reading of 山?",
    options: ["yama", "kawa", "sora", "hi"],
    answer: "yama",
  },
  {
    type: "kanji_reading",
    question: "What is the reading of 川?",
    options: ["kawa", "yama", "mori", "umi"],
    answer: "kawa",
  },
  {
    type: "kanji_reading",
    question: "What is the reading of 水?",
    options: ["mizu", "hi", "tsuchi", "ki"],
    answer: "mizu",
  },
  {
    type: "kanji_reading",
    question: "What is the reading of 日?",
    options: ["hi/nichi", "tsuki", "hana", "hana"],
    answer: "hi/nichi",
  },
  {
    type: "kanji_reading",
    question: "What is the reading of 月?",
    options: ["tsuki/getsu", "hi", "yume", "neko"],
    answer: "tsuki/getsu",
  },
  {
    type: "kanji_reading",
    question: "What is the reading of 人?",
    options: ["hito", "te", "ashi", "me"],
    answer: "hito",
  },
  {
    type: "kanji_reading",
    question: "What is the reading of 車?",
    options: ["kuruma", "ie", "tokei", "hon"],
    answer: "kuruma",
  },
  {
    type: "kanji_reading",
    question: "What is the reading of 本?",
    options: ["hon", "sakana", "kami", "neko"],
    answer: "hon",
  },
  {
    type: "kanji_reading",
    question: "What is the reading of 手?",
    options: ["te", "ashi", "kuchi", "me"],
    answer: "te",
  },
  {
    type: "kanji_reading",
    question: "What is the reading of 目?",
    options: ["me", "mimi", "hana", "kuchi"],
    answer: "me",
  },

  // Sentence completion
  {
    type: "sentence_completion",
    question: "___は 日本語を 勉強します。",
    context: "I study Japanese every day.",
    options: ["毎日", "今日", "昨日", "明日"],
    answer: "毎日",
  },
  {
    type: "sentence_completion",
    question: "きのう、___へ 行きました。",
    context: "Yesterday, I went to the park.",
    options: ["公園", "病院", "学校", "銀行"],
    answer: "公園",
  },
  {
    type: "sentence_completion",
    question: "これは ___ですか。",
    context: "How much is this?",
    options: ["いくら", "いつ", "どこ", "だれ"],
    answer: "いくら",
  },
  {
    type: "sentence_completion",
    question: "___が きみの ほんですか。",
    context: "Is this book yours?",
    options: ["これ", "あれ", "どれ", "それ"],
    answer: "これ",
  },
  {
    type: "sentence_completion",
    question: "あした、___と 会います。",
    context: "I will meet my friend tomorrow.",
    options: ["ともだち", "せんせい", "りょうしん", "いもうと"],
    answer: "ともだち",
  },
  {
    type: "sentence_completion",
    question: "___は どこに ありますか。",
    context: "Where is the toilet?",
    options: ["トイレ", "テレビ", "パソコン", "ケータイ"],
    answer: "トイレ",
  },
  {
    type: "sentence_completion",
    question: "おなまえは ___ですか。",
    context: "What is your name?",
    options: ["なん", "いつ", "どこ", "なに"],
    answer: "なん",
  },
  {
    type: "sentence_completion",
    question: "にほんごが ___です。",
    context: "Japanese is fun.",
    options: ["たのしい", "つまらない", "むずかしい", "やさしい"],
    answer: "たのしい",
  },

  // Grammar choice
  {
    type: "grammar_choice",
    question: "わたし ___ ジョンです。",
    context: "I am John (introducing yourself)",
    options: ["は", "が", "を", "の"],
    answer: "は",
  },
  {
    type: "grammar_choice",
    question: "せんせい ___ いますか。",
    context: "Is the teacher there? (existence of living things)",
    options: ["が", "は", "を", "に"],
    answer: "が",
  },
  {
    type: "grammar_choice",
    question: "でんしゃ ___ いきます。",
    context: "I go by train (means of transport)",
    options: ["で", "に", "を", "と"],
    answer: "で",
  },
  {
    type: "grammar_choice",
    question: "にほん ___ いきます。",
    context: "I go to Japan (destination)",
    options: ["に", "で", "を", "から"],
    answer: "に",
  },
  {
    type: "grammar_choice",
    question: "たべもの ___ かいます。",
    context: "I buy food (object)",
    options: ["を", "に", "で", "が"],
    answer: "を",
  },
  {
    type: "grammar_choice",
    question: "ともだち ___ いっしょに いきます。",
    context: "I go together with a friend",
    options: ["と", "に", "で", "を"],
    answer: "と",
  },
  {
    type: "grammar_choice",
    question: "にほんご ___ べんきょうします。",
    context: "I study Japanese (what you study)",
    options: ["を", "が", "に", "で"],
    answer: "を",
  },
  {
    type: "grammar_choice",
    question: "でんわ ___ はなします。",
    context: "I talk on the phone (means/location)",
    options: ["で", "に", "を", "から"],
    answer: "で",
  },
  {
    type: "grammar_choice",
    question: "これ ___ あなたの 本ですか。",
    context: "Is this your book?",
    options: ["は", "が", "を", "の"],
    answer: "は",
  },
  {
    type: "grammar_choice",
    question: "なに ___ たべますか。",
    context: "What will you eat?",
    options: ["を", "が", "に", "で"],
    answer: "を",
  },

  // Reading comprehension
  {
    type: "reading_comp",
    question: "たなかさんは まいにち にほんごを べんきょうします。\nきのうは ともだちと えいがを みました。\nあしたは うんどうを します。\n\nQuestion: What did Tanaka do yesterday?",
    context: "Tanaka studies Japanese every day. Yesterday, he watched a movie with his friend. Tomorrow, he will exercise.",
    options: ["Watched a movie", "Studied Japanese", "Exercised", "Went to school"],
    answer: "Watched a movie",
  },
  {
    type: "reading_comp",
    question: "わたしの かみは がくせいです。\nまいにち がっこうで にほんごを べんきょうします。\nともだちと ひるごはんを たべます。\nいえに かえって もう べんきょうします。\n\nQuestion: Where does the speaker study?",
    context: "I am a student. Every day, I study Japanese at school. I eat lunch with friends. I go home and study more.",
    options: ["At school", "At home", "At a restaurant", "At the park"],
    answer: "At school",
  },
];
