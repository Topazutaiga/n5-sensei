export interface GrammarItem {
  jp: string;
  read: string;
  mean: string;
}

export const GRAMMAR: GrammarItem[] = [
  // === PARTICULES ===
  { jp: "〜は〜です", read: "wa desu", mean: "A est B (thème)" },
  { jp: "〜が〜です", read: "ga desu", mean: "A est B (sujet nouvelle info)" },
  { jp: "〜を〜", read: "wo", mean: "particule d'objet direct" },
  { jp: "〜に〜", read: "ni", mean: "direction, lieu, temps" },
  { jp: "〜で〜", read: "de", mean: "lieu d'action, moyen" },
  { jp: "〜へ〜", read: "e", mean: "direction (mouvement)" },
  { jp: "〜と〜", read: "to", mean: "avec, et (énumération)" },
  { jp: "〜も〜", read: "mo", mean: "aussi, même" },
  { jp: "〜から〜", read: "kara", mean: "depuis, parce que" },
  { jp: "〜まで〜", read: "made", mean: "jusqu'à" },
  { jp: "〜か", read: "ka", mean: "question, ou (alternative)" },
  { jp: "〜の〜", read: "no", mean: "possession, lien nominal" },
  { jp: "〜ね", read: "ne", mean: "confirmations (n'est-ce pas)" },
  { jp: "〜よ", read: "yo", mean: "affirmation (info nouvelle)" },
  { jp: "〜な", read: "na", mean: "interdiction (verbe + na)" },

  // === FORMES VERBALES ===
  { jp: "〜ます / 〜ません", read: "masu / masen", mean: "forme polie affirmative/négative" },
  { jp: "〜ました / 〜ませんでした", read: "mashita / masen deshita", mean: "passé poli affirmatif/négatif" },
  { jp: "〜た / 〜なかった", read: "ta / nakatta", mean: "passé simple affirmatif/négatif" },
  { jp: "〜ない", read: "nai", mean: "forme négative" },
  { jp: "〜てください", read: "te kudasai", mean: "veuillez faire (requête polie)" },
  { jp: "〜てもいいです", read: "te mo ii desu", mean: "j'ai le droit de (permission)" },
  { jp: "〜てはいけません", read: "te wa ikemasen", mean: "il ne faut pas (interdiction)" },
  { jp: "〜たほうがいい", read: "ta hou ga ii", mean: "il vaut mieux (conseil)" },
  { jp: "〜ている", read: "te iru", mean: "action en cours / résultat" },
  { jp: "〜たことがあります", read: "ta koto ga aru", mean: "j'ai déjà fait (expérience)" },

  // === ADJECTIFS ===
  { jp: "〜い (adjectif)", read: "i", mean: "adjectif en -i" },
  { jp: "〜な (adjectif)", read: "na", mean: "adjectif en -na" },
  { jp: "〜くて / 〜で", read: "kute / de", mean: "liaison adjectivale (te-form)" },
  { jp: "〜かった / 〜くなかった", read: "katta / kunakatta", mean: "passé de l'adjectif -i" },
  { jp: "〜でした / 〜じゃなかった", read: "deshita / janakatta", mean: "passé de l'adjectif -na" },
  { jp: "〜くない / 〜じゃない", read: "kunai / janai", mean: "négation adjectivale" },

  // === COMPARAISONS & SUPERLATIF ===
  { jp: "〜より〜", read: "yori", mean: "que (comparatif)" },
  { jp: "〜のほうが〜", read: "hou ga", mean: "le plus (superlatif)" },
  { jp: "〜の中で何/どれが一番〜", read: "ichiban", mean: "le plus parmi (superlatif)" },

  // === EXISTENCE & QUANTITÉ ===
  { jp: "〜がいます / があります", read: "ga imasu / ga arimasu", mean: "il y a (êtres objets)" },
  { jp: "〜がいくつありますか", read: "ga ikutsu arimasu ka", mean: "combien y a-t-il de" },
  { jp: "〜だけ", read: "dake", mean: "seulement, juste" },
  { jp: "〜など", read: "nado", mean: "et cetera, de type" },
  { jp: "〜たくさん", read: "takusan", mean: "beaucoup de" },
  { jp: "〜少し", read: "sukoshi", mean: "un peu" },

  // === CAPACITÉ & POTENTIEL ===
  { jp: "〜ことができる", read: "koto ga dekiru", mean: "pouvoir faire (capacité)" },
  { jp: "〜がわかります", read: "ga wakarimasu", mean: "comprendre" },
  { jp: "〜ができます", read: "ga dekimasu", mean: "savoir faire, être capable" },

  // === DÉSIR & INTENTION ===
  { jp: "〜たい", read: "tai", mean: "vouloir faire" },
  { jp: "〜つもりです", read: "tsumori desu", mean: "j'ai l'intention de" },
  { jp: "〜ますように", read: "masu you ni", mean: "espérer que (souhait)" },

  // === CONDITIONNEL & HYPOTHÈSE ===
  { jp: "〜たら", read: "tara", mean: "si, quand (condition)" },
  { jp: "〜ば", read: "ba", mean: "si (condition générale)" },
  { jp: "〜とき", read: "toki", mean: "quand, au moment de" },
  { jp: "〜前に", read: "mae ni", mean: "avant de" },
  { jp: "〜てから", read: "te kara", mean: "après avoir fait" },

  // === CAUSE & RAISON ===
  { jp: "〜から (cause)", read: "kara", mean: "parce que (cause)" },
  { jp: "〜ので", read: "node", mean: "parce que (poli, cause)" },

  // === DONNER & RECEVOIR ===
  { jp: "〜をあげる", read: "wo ageru", mean: "donner (je donne)" },
  { jp: "〜をもらう", read: "wo morau", mean: "recevoir" },
  { jp: "〜をくれる", read: "wo kureru", mean: "donner (à moi, par autrui)" },

  // === DIVERSES ===
  { jp: "〜でしょう", read: "deshou", mean: "probablement, je pense" },
  { jp: "〜でしょうか", read: "deshou ka", mean: "est-ce que... (doute poli)" },
  { jp: "〜ませんか", read: "masen ka", mean: "n'est-ce pas que (invitation)" },
  { jp: "〜ために", read: "tame ni", mean: "pour (but, raison)" },
  { jp: "〜について", read: "ni tsuite", mean: "à propos de" },
  { jp: "〜が好きです / が嫌いです", read: "ga suki desu / kirai desu", mean: "aimer / détester" },
  { jp: "〜に興味があります", read: "ni kyoumi ga arimasu", mean: "s'intéresser à" },
  { jp: "〜ようにする", read: "you ni suru", mean: "faire en sorte de" },
  { jp: "〜ようになる", read: "you ni naru", mean: "en arriver à (changement)" },
  { jp: "〜すぎる", read: "sugiru", mean: "trop, excessive-ment" },

  // === EXPRÉSIONS FIXES ===
  { jp: "はじめまして", read: "hajimemashite", mean: "enchanté (se présenter)" },
  { jp: "おはようございます", read: "ohayou gozaimasu", mean: "bonjour (matin, poli)" },
  { jp: "こんにちは", read: "konnichiwa", mean: "bonjour (après-midi)" },
  { jp: "こんばんは", read: "konbanwa", mean: "bonsoir" },
  { jp: "さようなら", read: "sayounara", mean: "au revoir" },
  { jp: "すみません", read: "sumimasen", mean: "excusez-moi, désolé" },
  { jp: "ありがとうございます", read: "arigatou gozaimasu", mean: "merci (poli)" },
  { jp: "いただきます", read: "itadakimasu", mean: "je mange (avant le repas)" },
  { jp: "ごちそうさまでした", read: "gochisousama deshita", mean: "merci du repas" },
  { jp: "おやすみなさい", read: "oyasumi nasai", mean: "bonne nuit" },
  { jp: "いってきます", read: "ittekimasu", mean: "je sors (et je reviens)" },
  { jp: "いってらっしゃい", read: "itterasshai", mean: "bonne journée (réponse)" },
];
