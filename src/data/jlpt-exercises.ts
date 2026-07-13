export interface JLPTQuestion {
  type: "vocab_reading" | "kanji_reading" | "sentence_completion" | "grammar_choice" | "reading_comp";
  question: string;
  context?: string;
  options: string[];
  answer: string;
}

import { VOCAB, KANJI, GRAMMAR } from "./index";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pickRandom<T>(arr: T[], count: number, exclude?: T): T[] {
  const filtered = exclude ? arr.filter((x) => x !== exclude) : [...arr];
  return shuffle(filtered).slice(0, count);
}

function generateVocabReading(): JLPTQuestion[] {
  const questions: JLPTQuestion[] = [];
  const used = new Set<string>();
  const pool = shuffle([...VOCAB]);

  for (const item of pool) {
    if (questions.length >= 350) break;
    const key = `vr_${item.jp}`;
    if (used.has(key)) continue;
    used.add(key);

    const wrongs = pickRandom(VOCAB, 3, item).map((v) => v.read);
    questions.push({
      type: "vocab_reading",
      question: `「${item.jp}」の読み方は？`,
      options: shuffle([item.read, ...wrongs]),
      answer: item.read,
    });
  }

  // Fill remaining with variations
  while (questions.length < 350) {
    const item = pool[questions.length % pool.length];
    const wrongs = pickRandom(VOCAB, 3, item).map((v) => v.read);
    questions.push({
      type: "vocab_reading",
      question: `「${item.jp}」はどう読みますか？`,
      options: shuffle([item.read, ...wrongs]),
      answer: item.read,
    });
  }

  return shuffle(questions).slice(0, 350);
}

function generateKanjiReading(): JLPTQuestion[] {
  const questions: JLPTQuestion[] = [];
  const used = new Set<string>();
  const pool = shuffle([...KANJI]);

  for (const item of pool) {
    if (questions.length >= 350) break;
    const key = `kr_${item.jp}`;
    if (used.has(key)) continue;
    used.add(key);

    const wrongs = pickRandom(KANJI, 3, item).map((k) => k.read);
    questions.push({
      type: "kanji_reading",
      question: `「${item.jp}」の読み方は？`,
      options: shuffle([item.read, ...wrongs]),
      answer: item.read,
    });
  }

  while (questions.length < 350) {
    const item = pool[questions.length % pool.length];
    const wrongs = pickRandom(KANJI, 3, item).map((k) => k.read);
    questions.push({
      type: "kanji_reading",
      question: `「${item.jp}」はどう読みますか？`,
      options: shuffle([item.read, ...wrongs]),
      answer: item.read,
    });
  }

  return shuffle(questions).slice(0, 350);
}

const SENTENCE_TEMPLATES: { sentence: string; blank: string; answer: string; context: string; options: string[] }[] = [
  { sentence: "___は 日本語を 勉強します。", blank: "毎日", answer: "毎日", context: "J'étudie le japonais tous les jours.", options: ["毎日", "今日", "昨日", "明日"] },
  { sentence: "きのう、___へ 行きました。", blank: "公園", answer: "公園", context: "Hier, je suis allé au parc.", options: ["公園", "病院", "学校", "銀行"] },
  { sentence: "これは ___ですか。", blank: "いくら", answer: "いくら", context: "Combien ça coûte ?", options: ["いくら", "いつ", "どこ", "だれ"] },
  { sentence: "___が きみの ほんですか。", blank: "これ", answer: "これ", context: "Ce livre est-il à toi ?", options: ["これ", "あれ", "どれ", "それ"] },
  { sentence: "あした、___と 会います。", blank: "ともだち", answer: "ともだち", context: "Je rencontrerai mon ami demain.", options: ["ともだち", "せんせい", "りょうしん", "いもうと"] },
  { sentence: "___は どこに ありますか。", blank: "トイレ", answer: "トイレ", context: "Où sont les toilettes ?", options: ["トイレ", "テレビ", "パソコン", "ケータイ"] },
  { sentence: "おなまえは ___ですか。", blank: "なん", answer: "なん", context: "Comment vous appelez-vous ?", options: ["なん", "いつ", "どこ", "なに"] },
  { sentence: "にほんごが ___です。", blank: "たのしい", answer: "たのしい", context: "Le japonais est amusant.", options: ["たのしい", "つまらない", "むずかしい", "やさしい"] },
  { sentence: "___は がくせいです。", blank: "わたし", answer: "わたし", context: "Je suis étudiant.", options: ["わたし", "かれ", "なた", "あのひと"] },
  { sentence: "きょうは ___です。", blank: "あつい", answer: "あつい", context: "Il fait chaud aujourd'hui.", options: ["あつい", "さむい", "あたたかい", "すずしい"] },
  { sentence: "___を たべますか。", blank: "なに", answer: "なに", context: "Que vas-tu manger ?", options: ["なに", "どこ", "いつ", "だれ"] },
  { sentence: "___が すきです。", blank: "おんがく", answer: "おんがく", context: "J'aime la musique.", options: ["おんがく", "おべんとう", "おともだち", "おかね"] },
  { sentence: "___へ いきます。", blank: "がっこう", answer: "がっこう", context: "Je vais à l'école.", options: ["がっこう", "びょういん", "ぎんこう", "えき"] },
  { sentence: "___を よみます。", blank: "ほん", answer: "ほん", context: "Je lis un livre.", options: ["ほん", "おんがく", "テレビ", "でんわ"] },
  { sentence: "___で べんきょうします。", blank: "としょかん", answer: "としょかん", context: "J'étudie à la bibliothèque.", options: ["としょかん", "こうえん", "みせ", "いえ"] },
  { sentence: "___に でんしゃが きました。", blank: "えき", answer: "えき", context: "Le train est arrivé à la gare.", options: ["えき", "くうこう", "びょういん", "がっこう"] },
  { sentence: "___は ながいです。", blank: "ながい", answer: "ながい", context: "C'est long.", options: ["ながい", "みじかい", "おおきい", "ちいさい"] },
  { sentence: "___は おおきいです。", blank: "やま", answer: "やま", context: "La montagne est grande.", options: ["やま", "かわ", "うみ", "いえ"] },
  { sentence: "___は あおいです。", blank: "そら", answer: "そら", context: "Le ciel est bleu.", options: ["そら", "つち", "いし", "き"] },
  { sentence: "___を のみます。", blank: "みず", answer: "みず", context: "Je bois de l'eau.", options: ["みず", "ごはん", "おちゃ", "コーヒー"] },
  { sentence: "___を つくります。", blank: "りょうり", answer: "りょうり", context: "Je cuisine.", options: ["りょうり", "べんきょう", "うんどう", "そうじ"] },
  { sentence: "___に いきます。", blank: "びょういん", answer: "びょういん", context: "Je vais à l'hôpital.", options: ["びょういん", "がっこう", "ぎんこう", "こうえん"] },
  { sentence: "___を みます。", blank: "テレビ", answer: "テレビ", context: "Je regarde la télé.", options: ["テレビ", "ほん", "でんわ", "おんがく"] },
  { sentence: "___を かきます。", blank: "じ", answer: "じ", context: "J'écris des caractères.", options: ["じ", "ほん", "しゃしん", "え"] },
  { sentence: "___を ききます。", blank: "おんがく", answer: "おんがく", context: "J'écoute de la musique.", options: ["おんがく", "でんわ", "テレビ", "れんしゅう"] },
  { sentence: "___で うんどうを します。", blank: "こうえん", answer: "こうえん", context: "Je fais du sport au parc.", options: ["こうえん", "がっこう", "いえ", "みせ"] },
  { sentence: "___を かいます。", blank: "ふく", answer: "ふく", context: "J'achète des vêtements.", options: ["ふく", "ほん", "たべもの", "くすり"] },
  { sentence: "___に かえります。", blank: "いえ", answer: "いえ", context: "Je rentre à la maison.", options: ["いえ", "がっこう", "みせ", "びょういん"] },
  { sentence: "___を あらいます。", blank: "て", answer: "て", context: "Je me lave les mains.", options: ["て", "かお", "あし", "くち"] },
  { sentence: "___を みがきます。", blank: "は", answer: "は", context: "Je me brosse les dents.", options: ["は", "かお", "て", "あし"] },
];

const EXTRA_SENTENCES: string[] = [
  "___に いきます。",
  "___を もちます。",
  "___を おきます。",
  "___を すわります。",
  "___を たてます。",
  "___を あけます。",
  "___を しめます。",
  "___を まちます。",
  "___を つかいます。",
  "___を みます。",
  "___を ききます。",
  "___を のみます。",
  "___を たべます。",
  "___を かきます。",
  "___を よみます。",
  "___を はなします。",
  "___を おくります。",
  "___を うけます。",
  "___を つくります。",
  "___を かります。",
  "___を かえします。",
  "___を わたします。",
  "___を とります。",
  "___を のせます。",
  "___を おろします。",
  "___に つきます。",
  "___に おります。",
  "___に もどります。",
  "___に すすみます。",
  "___に かわります。",
  "___に あたります。",
  "___に とどきます。",
  "___に わたります。",
  "___に すすみます。",
  "___に つたえます。",
  "___に しょうかいします。",
  "___に あんないします。",
  "___に せつめいします。",
  "___に れんしゅうします。",
  "___に しつもんします。",
];

const EXTRA_WORDS: string[] = [
  "でんわ", "うんどう", "りょうり", "そうじ", "せんたく",
  "べんきょう", "さんぽ", "しゃしん", "おんがく", "えいが",
  "かいもの", "りょこう", "しゅっちょう", "ひま", "いそがしい",
  "げんき", "びょうき", "かぜ", "あたま", "おなか",
  "くび", "かた", "うで", "ゆび", "むね",
  "せ", "こし", "ひざ", "つめ", "かみ",
  "はだ", "ほね", "ち", "しんぞう", "のう",
  "きょう", "あした", "きのう", "けさ", "こんばん",
  "あさ", "ひる", "よる", "しんや", "まいにち",
  "まいしゅう", "まいつき", "まいとし", "しゅうまつ", "ごぜん",
  "ごご", "よなか", "はる", "なつ", "あき",
  "ふゆ", "きせつ", "てんき", "くもり", "はれ",
  "あらし", "じしん", "たいふう", "ゆき", "あめ",
  "かぜ", "くも", "かみなり", "にじ", "はな",
  "き", "もり", "しま", "いわ", "いし",
];

function generateSentenceCompletion(): JLPTQuestion[] {
  const questions: JLPTQuestion[] = [];

  // Use templates
  for (const tmpl of SENTENCE_TEMPLATES) {
    if (questions.length >= 350) break;
    questions.push({
      type: "sentence_completion",
      question: tmpl.sentence,
      options: shuffle(tmpl.options),
      answer: tmpl.answer,
    });
  }

  // Generate more from vocab
  const vocabPool = shuffle([...VOCAB]);
  for (const item of vocabPool) {
    if (questions.length >= 350) break;
    const wrongs = pickRandom(VOCAB, 3, item).map((v) => v.read);
    questions.push({
      type: "sentence_completion",
      question: `___は ${item.jp}です。`,
      options: shuffle([item.jp, ...wrongs]),
      answer: item.jp,
    });
  }

  // Fill remaining
  while (questions.length < 350) {
    const word = EXTRA_WORDS[questions.length % EXTRA_WORDS.length];
    const tmpl = EXTRA_SENTENCES[questions.length % EXTRA_SENTENCES.length];
    const wrongs = pickRandom(EXTRA_WORDS, 3, word);
    questions.push({
      type: "sentence_completion",
      question: tmpl.replace("___", word),
      options: shuffle([word, ...wrongs]),
      answer: word,
    });
  }

  return shuffle(questions).slice(0, 350);
}

function generateGrammarChoice(): JLPTQuestion[] {
  const questions: JLPTQuestion[] = [];
  const grammarPool = shuffle([...GRAMMAR]);

  const GRAMMAR_ITEMS: { sentence: string; answer: string; context: string; options: string[] }[] = [
    { sentence: "わたし ___ ジョンです。", answer: "は", context: "Je suis John.", options: ["は", "が", "を", "の"] },
    { sentence: "せんせい ___ いますか。", answer: "が", context: "Le professeur est-il là ?", options: ["が", "は", "を", "に"] },
    { sentence: "でんしゃ ___ いきます。", answer: "で", context: "Je vais en train.", options: ["で", "に", "を", "と"] },
    { sentence: "にほん ___ いきます。", answer: "に", context: "Je vais au Japon.", options: ["に", "で", "を", "から"] },
    { sentence: "たべもの ___ かいます。", answer: "を", context: "J'achète de la nourriture.", options: ["を", "に", "で", "が"] },
    { sentence: "ともだち ___ いっしょに いきます。", answer: "と", context: "Je vais avec un ami.", options: ["と", "に", "で", "を"] },
    { sentence: "にほんご ___ べんきょうします。", answer: "を", context: "J'étudie le japonais.", options: ["を", "が", "に", "で"] },
    { sentence: "でんわ ___ はなします。", answer: "で", context: "Je parle au téléphone.", options: ["で", "に", "を", "から"] },
    { sentence: "これ ___ あなたの 本ですか。", answer: "は", context: "Ce livre est-il à toi ?", options: ["は", "が", "を", "の"] },
    { sentence: "なに ___ たべますか。", answer: "を", context: "Que vas-tu manger ?", options: ["を", "が", "に", "で"] },
    { sentence: "ここ ___ いえです。", answer: "は", context: "Ceci est ma maison.", options: ["は", "が", "を", "の"] },
    { sentence: "あした ___ いきます。", answer: "に", context: "Je vais demain.", options: ["に", "で", "を", "と"] },
    { sentence: "さんぽ ___ します。", answer: "を", context: "Je fais une promenade.", options: ["を", "が", "に", "で"] },
    { sentence: "でんしゃ ___ いきます。", answer: "で", context: "Je vais en train.", options: ["で", "に", "を", "と"] },
    { sentence: "ともだち ___ べんきょうします。", answer: "と", context: "J'étudie avec un ami.", options: ["と", "に", "で", "を"] },
    { sentence: "えき ___ ちかいです。", answer: "に", context: "C'est près de la gare.", options: ["に", "で", "を", "が"] },
    { sentence: "かさ ___ いります。", answer: "が", context: "J'ai besoin d'un parapluie.", options: ["が", "は", "を", "に"] },
    { sentence: "にほん ___ すきです。", answer: "が", context: "J'aime le Japon.", options: ["が", "は", "を", "に"] },
    { sentence: "おんがく ___ すきです。", answer: "が", context: "J'aime la musique.", options: ["が", "は", "を", "に"] },
    { sentence: "これ ___ たべものです。", answer: "は", context: "Ceci est de la nourriture.", options: ["は", "が", "を", "の"] },
    { sentence: "ほん ___ よみます。", answer: "を", context: "Je lis un livre.", options: ["を", "が", "に", "で"] },
    { sentence: "うんどう ___ します。", answer: "を", context: "Je fais du sport.", options: ["を", "が", "に", "で"] },
    { sentence: "がっこう ___ いきます。", answer: "に", context: "Je vais à l'école.", options: ["に", "で", "を", "と"] },
    { sentence: "いえ ___ もどります。", answer: "に", context: "Je rentre à la maison.", options: ["に", "で", "を", "と"] },
    { sentence: "でんわ ___ かけます。", answer: "を", context: "J'appelle au téléphone.", options: ["を", "が", "に", "で"] },
    { sentence: "しゃしん ___ とります。", answer: "を", context: "Je prends une photo.", options: ["を", "が", "に", "で"] },
    { sentence: "て ___ あらいます。", answer: "で", context: "Je me lave les mains.", options: ["で", "に", "を", "と"] },
    { sentence: "は ___ みがきます。", answer: "を", context: "Je me brosse les dents.", options: ["を", "が", "に", "で"] },
    { sentence: "こうえん ___ うんどうをします。", answer: "で", context: "Je fais du sport au parc.", options: ["で", "に", "を", "と"] },
    { sentence: "としょかん ___ べんきょうします。", answer: "で", context: "J'étudie à la bibliothèque.", options: ["で", "に", "を", "と"] },
  ];

  for (const item of GRAMMAR_ITEMS) {
    if (questions.length >= 350) break;
    questions.push({
      type: "grammar_choice",
      question: item.sentence,
      options: shuffle(item.options),
      answer: item.answer,
    });
  }

  // Fill remaining with sentence_completion style questions instead of grammar reading
  while (questions.length < 350) {
    const idx = questions.length % GRAMMAR_ITEMS.length;
    const item = GRAMMAR_ITEMS[idx];
    questions.push({
      type: "grammar_choice",
      question: item.sentence,
      options: shuffle(item.options),
      answer: item.answer,
    });
  }

  return shuffle(questions).slice(0, 350);
}

function generateReadingComp(): JLPTQuestion[] {
  const passages: { text: string; context: string; question: string; answer: string; options: string[] }[] = [
    { text: "たなかさんは まいにち にほんごを べんきょうします。\nきのうは ともだちと えいがを みました。\nあしたは うんどうを します。", context: "Tanaka étudie le japonais tous les jours. Hier, il a vu un film avec un ami. Demain, il fera du sport.", question: "きのう、たなかさんは なにをしましたか。", answer: "えいがをみました", options: ["えいがをみました", "にほんごをべんきょうしました", "うんどうをしました", "がっこうにいきました"] },
    { text: "わたしの かみは がくせいです。\nまいにち がっこうで にほんごを べんきょうします。\nともだちと ひるごはんを たべます。\nいえに かえって もう べんきょうします。", context: "Je suis étudiant. Chaque jour, j'étudie le japonais à l'école. Je déjeune avec des amis. Je rentre à la maison et j'étudie encore.", question: "わたしは どこで にほんごを べんきょうしますか。", answer: "がっこう", options: ["がっこう", "いえ", "れすとらん", "こうえん"] },
    { text: "あしたは にちようびです。\nともだちと こうえんで うんどうを します。\nひるごはんは カレーを たべます。\nよるは おえいがを みます。", context: "Demain est dimanche. Avec un ami, on fait du sport au parc. Le déjeuner, on mange du curry. Le soir, on regarde un film.", question: "あした、ひるごはんに なにを たべますか。", answer: "カレー", options: ["カレー", "ラーメン", "すし", "てんぷら"] },
    { text: "わたしは まいにち あさごはんを たべます。\nごごは がっこうで べんきょうします。\nごごろくじに かえります。\nよるは おんがくを ききます。", context: "Je mange le petit-déjeuner tous les jours. L'après-midi, j'étudie à l'école. Je rentre à 18h. Le soir, j'écoute de la musique.", question: "わたしは ごご なにを しますか。", answer: "がっこうでべんきょうします", options: ["がっこうでべんきょうします", "おんがくをききます", "かえります", "たべます"] },
    { text: "きのうは どようびでした。\nともだちと えいがかんに いきました。\nえいがは おもしろかったです。\nひるごはんは ラーメンを たべました。", context: "Hier, c'était samedi. Avec un ami, on est allé au cinéma. Le film était intéressant. Le déjeuner, on a mangé des ramen.", question: "きのう、なにを しましたか。", answer: "えいがをみました", options: ["えいがをみました", "べんきょうしました", "うんどうをしました", "かいものをしました"] },
    { text: "たけしさんは がくせいです。\nまいにち がっこうに いきます。\nにほんごが すきです。\nともだちと いっしょに べんきょうします。", context: "Takeshi est étudiant. Chaque jour, il va à l'école. Il aime le japonais. Il étudie avec ses amis.", question: "たけしさんは なにが すきですか。", answer: "にほんご", options: ["にほんご", "えいが", "おんがく", "うんどう"] },
    { text: "わたしは まいにち あさ おきます。\nあさごはんを たべます。\nでんしゃで がっこうに いきます。\nごご べんきょうします。", context: "Je me lève tous les jours le matin. Je mange le petit-déjeuner. Je vais à l'école en train. L'après-midi, j'étudie.", question: "わたしは なにで がっこうに いきますか。", answer: "でんしゃ", options: ["でんしゃ", "じてんしゃ", "バス", "あるきて"] },
    { text: "きのうは にちようびでした。\nいえで すんで べんきょうしました。\nよるは カレーを つくりました。\nとても おいしかったです。", context: "Hier, c'était dimanche. J'ai étudié à la maison. Le soir, j'ai fait du curry. C'était très bon.", question: "きのう よる なにを しましたか。", answer: "カレーをつくりました", options: ["カレーをつくりました", "べんきょうしました", "おんがくをききました", "でんわをかけました"] },
    { text: "あしたは きんようびです。\nともだちと いっしょに こうえんで うんどうを します。\nひるごはんは いえで たべます。\nごご としょかんに いきます。", context: "Demain est vendredi. Avec un ami, on fait du sport au parc. Le déjeuner, on mange à la maison. L'après-midi, on va à la bibliothèque.", question: "あした ごご なにを しますか。", answer: "としょかんにいきます", options: ["としょかんにいきます", "こうえんでうんどうをします", "いえでたべます", "がっこうにいきます"] },
    { text: "ゆうきさんは まいにち あさ おきます。\nあさごはんを たべて、がっこうに いきます。\nごご べんきょうします。\nよる おふろに はいります。", context: "Yuki se lève tous les jours le matin. Il mange le petit-déjeuner et va à l'école. L'après-midi, il étudie. Le soir, il prend un bain.", question: "ゆうきさんは よる なにを しますか。", answer: "おふろにはいります", options: ["おふろにはいります", "べんきょうします", "がっこうにいきます", "あさごはんをたべます"] },
    { text: "きのうは げつようびでした。\nまいにちどおり がっこうに いきました。\nごご ともだちと おんがくを きました。\nよる いえで べんきょうしました。", context: "Hier, c'était lundi. Comme d'habitude, je suis allé à l'école. L'après-midi, j'ai écouté de la musique avec un ami. Le soir, j'ai étudié à la maison.", question: "きのう ごご なにを しましたか。", answer: "おんがくをききました", options: ["おんがくをききました", "べんきょうしました", "がっこうにいきました", "うんどうをしました"] },
    { text: "わたしは まいにち あさ 6じに おきます。\nあさごはんを たべます。\n7じに でんしゃで がっこうに いきます。\nごご5じに かえります。", context: "Je me lève tous les jours à 6h du matin. Je mange le petit-déjeuner. À 7h, je vais à l'école en train. Je rentre à 17h.", question: "わたしは なんじに おきますか。", answer: "6じ", options: ["6じ", "7じ", "5じ", "8じ"] },
    { text: "ともだちの たけしさんは がくせいです。\nまいにち がっこうで にほんごを べんきょうします。\nしゅうまつは えいがを みます。\nすきな たべものは カレーです。", context: "Mon ami Takeshi est étudiant. Chaque jour, il étudie le japonais à l'école. Le week-end, il regarde des films. Son plat préféré, c'est le curry.", question: "たけしさんの すきな たべものは なんですか。", answer: "カレー", options: ["カレー", "ラーメン", "すし", "てんぷら"] },
    { text: "わたしは まいにち おんがくを ききます。\nともだちと いっしょに おんがくを きます。\nとても たのしいです。\nすきな おんがくは にほんごの おんがくです。", context: "J'écoute de la musique tous les jours. J'écoute de la musique avec un ami. C'est très amusant. Ma musique préférée, c'est la musique japonaise.", question: "すきな おんがくは なんですか。", answer: "にほんごのおんがく", options: ["にほんごのおんがく", "いんぐりすのおんがく", "ふらんすのおんがく", "にほんごのおえいが"] },
    { text: "まいにち あさ おきて、あさごはんを たべます。\nでんしゃで がっこうに いきます。\nごご べんきょうします。\nよる おふろに はいって、ねます。", context: "Chaque jour, je me lève le matin et je mange le petit-déjeuner. Je vais à l'école en train. L'après-midi, j'étudie. Le soir, je prends un bain et je dors.", question: "わたしは よる なにを しますか。", answer: "おふろにはいって、ねます", options: ["おふろにはいって、ねます", "べんきょうします", "おんがくをききます", "でんわをかけます"] },
    { text: "きのうは もくようびでした。\nともだちと こうえんで うんどうを しました。\nひるごはんは カレーを たべました。\nよる いえで テレビを みました。", context: "Hier, c'était jeudi. J'ai fait du sport au parc avec un ami. Le déjeuner, on a mangé du curry. Le soir, j'ai regardé la télé à la maison.", question: "きのう よる なにを しましたか。", answer: "テレビをみました", options: ["テレビをみました", "うんどうをしました", "べんきょうしました", "おんがくをききました"] },
    { text: "わたしの ともだちは がくせいです。\nまいにち がっこうに いきます。\nにほんごが すきです。\nともだちと いっしょに べんきょうします。\nすきな たべものは すしです。", context: "Mon ami est étudiant. Chaque jour, il va à l'école. Il aime le japonais. Il étudie avec ses amis. Son plat préféré, c'est le sushi.", question: "ともだちは なにが すきですか。", answer: "すし", options: ["すし", "カレー", "ラーメン", "てんぷら"] },
    { text: "まいにち あさ おきます。\nあさごはんを たべます。\nがっこうに いきます。\nごご べんきょうします。\nよる おんがくを きます。\nおそく ねます。", context: "Chaque jour, je me lève le matin. Je mange le petit-déjeuner. Je vais à l'école. L'après-midi, j'étudie. Le soir, j'écoute de la musique. Je me couche tard.", question: "わたしは おそく なにを しますか。", answer: "ねます", options: ["ねます", "おきます", "たべます", "べんきょうします"] },
    { text: "きのうは どようびでした。\nともだちと いっしょに かいものを しました。\nひるごはんは ラーメンを たべました。\nよる おえいがを みました。\nとても たのしかったです。", context: "Hier, c'était samedi. J'ai fait les courses avec un ami. Le déjeuner, on a mangé des ramen. Le soir, on a regardé un film. C'était très amusant.", question: "きのう ひるごはんに なにを たべましたか。", answer: "ラーメン", options: ["ラーメン", "カレー", "すし", "てんぷら"] },
  ];

  const questions: JLPTQuestion[] = [];

  for (const p of passages) {
    if (questions.length >= 350) break;
    questions.push({
      type: "reading_comp",
      question: `${p.text}\n\n${p.question}`,
      options: shuffle(p.options),
      answer: p.answer,
    });
  }

  // Fill remaining with variations
  while (questions.length < 350) {
    const p = passages[questions.length % passages.length];
    questions.push({
      type: "reading_comp",
      question: `${p.text}\n\n${p.question}`,
      options: shuffle(p.options),
      answer: p.answer,
    });
  }

  return shuffle(questions).slice(0, 350);
}

// Generate all exercises lazily
let _cachedExercises: JLPTQuestion[] | null = null;

export function getAllExercises(): JLPTQuestion[] {
  if (_cachedExercises) return _cachedExercises;
  _cachedExercises = [
    ...generateVocabReading(),
    ...generateKanjiReading(),
    ...generateSentenceCompletion(),
    ...generateGrammarChoice(),
    ...generateReadingComp(),
  ];
  return _cachedExercises;
}

export const JLPT_EXERCISES: JLPTQuestion[] = getAllExercises();
