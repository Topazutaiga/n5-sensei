export interface JLPTQuestion {
  type: "vocab_reading" | "kanji_reading" | "sentence_completion" | "grammar_choice" | "reading_comp";
  question: string;
  context?: string;
  options: string[];
  answer: string;
}

export const JLPT_EXERCISES: JLPTQuestion[] = [
  // Vocab reading — question en japonais, réponses en japonais
  {
    type: "vocab_reading",
    question: "「食べる」の意味は？",
    options: ["たべる", "のむ", "ねる", "はしる"],
    answer: "たべる",
  },
  {
    type: "vocab_reading",
    question: "「大きい」の意味は？",
    options: ["おおきい", "ちいさい", "はやい", "おそい"],
    answer: "おおきい",
  },
  {
    type: "vocab_reading",
    question: "「新しい」の意味は？",
    options: ["あたらしい", "ふるい", "あつい", "さむい"],
    answer: "あたらしい",
  },
  {
    type: "vocab_reading",
    question: "「元気」の意味は？",
    options: ["げんき", "つかれる", "かなしい", "いそがしい"],
    answer: "げんき",
  },
  {
    type: "vocab_reading",
    question: "「好き」の意味は？",
    options: ["すき", "きらい", "こわい", "うたがう"],
    answer: "すき",
  },
  {
    type: "vocab_reading",
    question: "「時計」の読み方は？",
    options: ["とけい", "でんわ", "ほん", "バッグ"],
    answer: "とけい",
  },
  {
    type: "vocab_reading",
    question: "「友達」の読み方は？",
    options: ["ともだち", "せんせい", "がくせい", "りょうしん"],
    answer: "ともだち",
  },
  {
    type: "vocab_reading",
    question: "「病院」の読み方は？",
    options: ["びょういん", "がっこう", "こうえん", "みせ"],
    answer: "びょういん",
  },
  {
    type: "vocab_reading",
    question: "「公園」の読み方は？",
    options: ["こうえん", "かわ", "やま", "うみ"],
    answer: "こうえん",
  },
  {
    type: "vocab_reading",
    question: "「勉強する」の意味は？",
    options: ["べんきょうする", "うんどうする", "りょうりする", "そうじする"],
    answer: "べんきょうする",
  },

  // Kanji reading
  {
    type: "kanji_reading",
    question: "「山」の読み方は？",
    options: ["やま", "かわ", "そら", "ひ"],
    answer: "やま",
  },
  {
    type: "kanji_reading",
    question: "「川」の読み方は？",
    options: ["かわ", "やま", "もり", "うみ"],
    answer: "かわ",
  },
  {
    type: "kanji_reading",
    question: "「水」の読み方は？",
    options: ["みず", "ひ", "つち", "き"],
    answer: "みず",
  },
  {
    type: "kanji_reading",
    question: "「日」の読み方は？",
    options: ["ひ / にち", "つき", "はな", "はな"],
    answer: "ひ / にち",
  },
  {
    type: "kanji_reading",
    question: "「月」の読み方は？",
    options: ["つき / げつ", "ひ", "ゆめ", "ねこ"],
    answer: "つき / げつ",
  },
  {
    type: "kanji_reading",
    question: "「人」の読み方は？",
    options: ["ひと", "て", "あし", "め"],
    answer: "ひと",
  },
  {
    type: "kanji_reading",
    question: "「車」の読み方は？",
    options: ["くるま", "いえ", "とけい", "ほん"],
    answer: "くるま",
  },
  {
    type: "kanji_reading",
    question: "「本」の読み方は？",
    options: ["ほん", "さかな", "かみ", "ねこ"],
    answer: "ほん",
  },
  {
    type: "kanji_reading",
    question: "「手」の読み方は？",
    options: ["て", "あし", "くち", "め"],
    answer: "て",
  },
  {
    type: "kanji_reading",
    question: "「目」の読み方は？",
    options: ["め", "みみ", "はな", "くち"],
    answer: "め",
  },

  // Sentence completion — réponses en japonais
  {
    type: "sentence_completion",
    question: "___は 日本語を 勉強します。",
    context: "J'étudie le japonais tous les jours.",
    options: ["毎日", "今日", "昨日", "明日"],
    answer: "毎日",
  },
  {
    type: "sentence_completion",
    question: "きのう、___へ 行きました。",
    context: "Hier, je suis allé au parc.",
    options: ["公園", "病院", "学校", "銀行"],
    answer: "公園",
  },
  {
    type: "sentence_completion",
    question: "これは ___ですか。",
    context: "Combien ça coûte ?",
    options: ["いくら", "いつ", "どこ", "だれ"],
    answer: "いくら",
  },
  {
    type: "sentence_completion",
    question: "___が きみの ほんですか。",
    context: "Ce livre est-il à toi ?",
    options: ["これ", "あれ", "どれ", "それ"],
    answer: "これ",
  },
  {
    type: "sentence_completion",
    question: "あした、___と 会います。",
    context: "Je rencontrerai mon ami demain.",
    options: ["ともだち", "せんせい", "りょうしん", "いもうと"],
    answer: "ともだち",
  },
  {
    type: "sentence_completion",
    question: "___は どこに ありますか。",
    context: "Où sont les toilettes ?",
    options: ["トイレ", "テレビ", "パソコン", "ケータイ"],
    answer: "トイレ",
  },
  {
    type: "sentence_completion",
    question: "おなまえは ___ですか。",
    context: "Comment vous appelez-vous ?",
    options: ["なん", "いつ", "どこ", "なに"],
    answer: "なん",
  },
  {
    type: "sentence_completion",
    question: "にほんごが ___です。",
    context: "Le japonais est amusant.",
    options: ["たのしい", "つまらない", "むずかしい", "やさしい"],
    answer: "たのしい",
  },

  // Grammar choice — réponses en japonais
  {
    type: "grammar_choice",
    question: "わたし ___ ジョンです。",
    context: "Je suis John (se présenter)",
    options: ["は", "が", "を", "の"],
    answer: "は",
  },
  {
    type: "grammar_choice",
    question: "せんせい ___ いますか。",
    context: "Le professeur est-il là ?",
    options: ["が", "は", "を", "に"],
    answer: "が",
  },
  {
    type: "grammar_choice",
    question: "でんしゃ ___ いきます。",
    context: "Je vais en train",
    options: ["で", "に", "を", "と"],
    answer: "で",
  },
  {
    type: "grammar_choice",
    question: "にほん ___ いきます。",
    context: "Je vais au Japon",
    options: ["に", "で", "を", "から"],
    answer: "に",
  },
  {
    type: "grammar_choice",
    question: "たべもの ___ かいます。",
    context: "J'achète de la nourriture",
    options: ["を", "に", "で", "が"],
    answer: "を",
  },
  {
    type: "grammar_choice",
    question: "ともだち ___ いっしょに いきます。",
    context: "Je vais avec un ami",
    options: ["と", "に", "で", "を"],
    answer: "と",
  },
  {
    type: "grammar_choice",
    question: "にほんご ___ べんきょうします。",
    context: "J'étudie le japonais",
    options: ["を", "が", "に", "で"],
    answer: "を",
  },
  {
    type: "grammar_choice",
    question: "でんわ ___ はなします。",
    context: "Je parle au téléphone",
    options: ["で", "に", "を", "から"],
    answer: "で",
  },
  {
    type: "grammar_choice",
    question: "これ ___ あなたの 本ですか。",
    context: "Ce livre est-il à toi ?",
    options: ["は", "が", "を", "の"],
    answer: "は",
  },
  {
    type: "grammar_choice",
    question: "なに ___ たべますか。",
    context: "Que vas-tu manger ?",
    options: ["を", "が", "に", "で"],
    answer: "を",
  },

  // Reading comprehension — réponses en japonais
  {
    type: "reading_comp",
    question: "たなかさんは まいにち にほんごを べんきょうします。\nきのうは ともだちと えいがを みました。\nあしたは うんどうを します。\n\nきのう、たなかさんは なにをしましたか。",
    context: "Tanaka étudie le japonais tous les jours. Hier, il a vu un film avec un ami. Demain, il fera du sport.",
    options: ["えいがをみました", "にほんごをべんきょうしました", "うんどうをしました", "がっこうにいきました"],
    answer: "えいがをみました",
  },
  {
    type: "reading_comp",
    question: "わたしの かみは がくせいです。\nまいにち がっこうで にほんごを べんきょうします。\nともだちと ひるごはんを たべます。\nいえに かえって もう べんきょうします。\n\nわたしは どこで にほんごを べんきょうしますか。",
    context: "Je suis étudiant. Chaque jour, j'étudie le japonais à l'école. Je déjeune avec des amis. Je rentre à la maison et j'étudie encore.",
    options: ["がっこう", "いえ", "れすとらん", "こうえん"],
    answer: "がっこう",
  },
];
