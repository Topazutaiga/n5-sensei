export interface GrammarItem {
  jp: string;
  read: string;
  mean: string;
}

export const GRAMMAR: GrammarItem[] = [
  // === PARTICULES ===
  { jp: "〜は〜です", read: "わ です", mean: "A est B (thème)" },
  { jp: "〜が〜です", read: "が です", mean: "A est B (sujet nouvelle info)" },
  { jp: "〜を〜", read: "を", mean: "particule d'objet direct" },
  { jp: "〜に〜", read: "に", mean: "direction, lieu, temps" },
  { jp: "〜で〜", read: "で", mean: "lieu d'action, moyen" },
  { jp: "〜へ〜", read: "へ", mean: "direction (mouvement)" },
  { jp: "〜と〜", read: "と", mean: "avec, et (énumération)" },
  { jp: "〜も〜", read: "も", mean: "aussi, même" },
  { jp: "〜から〜", read: "から", mean: "depuis, parce que" },
  { jp: "〜まで〜", read: "まで", mean: "jusqu'à" },
  { jp: "〜か", read: "か", mean: "question, ou (alternative)" },
  { jp: "〜の〜", read: "の", mean: "possession, lien nominal" },
  { jp: "〜ね", read: "ね", mean: "confirmation (n'est-ce pas)" },
  { jp: "〜よ", read: "よ", mean: "affirmation (info nouvelle)" },
  { jp: "〜な", read: "な", mean: "interdiction (verbe + na)" },

  // === FORMES VERBALES ===
  { jp: "〜ます / 〜ません", read: "ます / ません", mean: "forme polie affirmative/négative" },
  { jp: "〜ました / 〜ませんでした", read: "ました / ませんでした", mean: "passé poli affirmatif/négatif" },
  { jp: "〜た / 〜なかった", read: "た / なかった", mean: "passé simple affirmatif/négatif" },
  { jp: "〜ない", read: "ない", mean: "forme négative" },
  { jp: "〜てください", read: "てください", mean: "veuillez faire (requête polie)" },
  { jp: "〜てもいいです", read: "てもいいです", mean: "j'ai le droit de (permission)" },
  { jp: "〜てはいけません", read: "てはいけません", mean: "il ne faut pas (interdiction)" },
  { jp: "〜たほうがいい", read: "たほうがいい", mean: "il vaut mieux (conseil)" },
  { jp: "〜ている", read: "ている", mean: "action en cours / résultat" },
  { jp: "〜たことがあります", read: "たことがあります", mean: "j'ai déjà fait (expérience)" },

  // === ADJECTIFS ===
  { jp: "〜い (adjectif)", read: "い", mean: "adjectif en -i" },
  { jp: "〜な (adjectif)", read: "な", mean: "adjectif en -na" },
  { jp: "〜くて / 〜で", read: "くて / で", mean: "liaison adjectivale (te-form)" },
  { jp: "〜かった / 〜くなかった", read: "かった / くなかった", mean: "passé de l'adjectif -i" },
  { jp: "〜でした / 〜じゃなかった", read: "でした / じゃなかった", mean: "passé de l'adjectif -na" },
  { jp: "〜くない / 〜じゃない", read: "くない / じゃない", mean: "négation adjectivale" },

  // === COMPARAISONS & SUPERLATIF ===
  { jp: "〜より〜", read: "より", mean: "que (comparatif)" },
  { jp: "〜のほうが〜", read: "のほうが", mean: "le plus (superlatif)" },
  { jp: "〜の中で何/どれが一番〜", read: "いちばん", mean: "le plus parmi (superlatif)" },

  // === EXISTENCE & QUANTITÉ ===
  { jp: "〜がいます / があります", read: "がいます / があります", mean: "il y a (êtres objets)" },
  { jp: "〜がいくつありますか", read: "がいくつありますか", mean: "combien y a-t-il de" },
  { jp: "〜だけ", read: "だけ", mean: "seulement, juste" },
  { jp: "〜など", read: "など", mean: "et cetera, de type" },
  { jp: "〜たくさん", read: "たくさん", mean: "beaucoup de" },
  { jp: "〜少し", read: "すこし", mean: "un peu" },

  // === CAPACITÉ & POTENTIEL ===
  { jp: "〜ことができる", read: "ことができる", mean: "pouvoir faire (capacité)" },
  { jp: "〜がわかります", read: "がわかります", mean: "comprendre" },
  { jp: "〜ができます", read: "ができます", mean: "savoir faire, être capable" },

  // === DÉSIR & INTENTION ===
  { jp: "〜たい", read: "たい", mean: "vouloir faire" },
  { jp: "〜つもりです", read: "つもりです", mean: "j'ai l'intention de" },
  { jp: "〜ますように", read: "ますように", mean: "espérer que (souhait)" },

  // === CONDITIONNEL & HYPOTHÈSE ===
  { jp: "〜たら", read: "たら", mean: "si, quand (condition)" },
  { jp: "〜ば", read: "ば", mean: "si (condition générale)" },
  { jp: "〜とき", read: "とき", mean: "quand, au moment de" },
  { jp: "〜前に", read: "まえに", mean: "avant de" },
  { jp: "〜てから", read: "てから", mean: "après avoir fait" },

  // === CAUSE & RAISON ===
  { jp: "〜から (cause)", read: "から", mean: "parce que (cause)" },
  { jp: "〜ので", read: "ので", mean: "parce que (poli, cause)" },

  // === DONNER & RECEVOIR ===
  { jp: "〜をあげる", read: "をあげる", mean: "donner (je donne)" },
  { jp: "〜をもらう", read: "をもらう", mean: "recevoir" },
  { jp: "〜をくれる", read: "をくれる", mean: "donner (à moi, par autrui)" },

  // === DIVERSES ===
  { jp: "〜でしょう", read: "でしょう", mean: "probablement, je pense" },
  { jp: "〜でしょうか", read: "でしょうか", mean: "est-ce que... (doute poli)" },
  { jp: "〜ませんか", read: "ませんか", mean: "n'est-ce pas que (invitation)" },
  { jp: "〜ために", read: "ために", mean: "pour (but, raison)" },
  { jp: "〜について", read: "について", mean: "à propos de" },
  { jp: "〜が好きです / が嫌いです", read: "がすきです / がきらいです", mean: "aimer / détester" },
  { jp: "〜に興味があります", read: "にきょうみがあります", mean: "s'intéresser à" },
  { jp: "〜ようにする", read: "ようにする", mean: "faire en sorte de" },
  { jp: "〜ようになる", read: "ようになる", mean: "en arriver à (changement)" },
  { jp: "〜すぎる", read: "すぎる", mean: "trop, excessive-ment" },

  // === EXPRÉSIONS FIXES ===
  { jp: "はじめまして", read: "はじめまして", mean: "enchanté (se présenter)" },
  { jp: "おはようございます", read: "おはようございます", mean: "bonjour (matin, poli)" },
  { jp: "こんにちは", read: "こんにちは", mean: "bonjour (après-midi)" },
  { jp: "こんばんは", read: "こんばんは", mean: "bonsoir" },
  { jp: "さようなら", read: "さようなら", mean: "au revoir" },
  { jp: "すみません", read: "すみません", mean: "excusez-moi, désolé" },
  { jp: "ありがとうございます", read: "ありがとうございます", mean: "merci (poli)" },
  { jp: "いただきます", read: "いただきます", mean: "je mange (avant le repas)" },
  { jp: "ごちそうさまでした", read: "ごちそうさまでした", mean: "merci du repas" },
  { jp: "おやすみなさい", read: "おやすみなさい", mean: "bonne nuit" },
  { jp: "いってきます", read: "いってきます", mean: "je sors (et je reviens)" },
  { jp: "いってらっしゃい", read: "いってらっしゃい", mean: "bonne journée (réponse)" },
];
