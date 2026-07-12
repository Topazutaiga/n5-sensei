export interface ListeningPhrase {
  jp: string;
  mean: string;
  q: string;
}

export interface ListeningDialogue {
  jp: string;
  mean: string;
  q: string;
  note: string;
}

export interface ListeningData {
  phrases: ListeningPhrase[];
  dialogues: ListeningDialogue[];
}

export const LISTENING: ListeningData = {
  phrases: [
    { jp: "おはようございます。", mean: "Bonjour (poli, le matin)", q: "Quelle est la signification de cette phrase ?" },
    { jp: "こんにちは。お元気ですか。", mean: "Bonjour. Comment allez-vous ?", q: "Que demande-t-on ?" },
    { jp: "すみません。お手洗いはどこですか。", mean: "Excusez-moi. Où sont les toilettes ?", q: "Que cherche la personne ?" },
    { jp: "いきましょう。", mean: "Allons-y / partons", q: "Que propose-t-on ?" },
    { jp: "これはいくらですか。", mean: "Combien coûte ceci ?", q: "Que demande-t-on ?" },
    { jp: "おはようございます。お名前は何ですか。", mean: "Bonjour. Comment vous appelez-vous ?", q: "Quelle est la deuxième question ?" },
    { jp: "ありがとうございます。", mean: "Merci beaucoup (poli)", q: "Que signifie cette phrase ?" },
    { jp: "おはようございます。私はジョンです。", mean: "Bonjour. Je suis Jean.", q: "Comment s'appelle la personne ?" },
    { jp: "毎にち、としょぶんすをします。", mean: "J'étudie tous les jours le japonais.", q: "Quelle est la fréquence de l'action ?" },
    { jp: "きのうは、ぐんばんしました。", mean: "Hier, j'ai travaillé dur.", q: "Quand l'action s'est-elle passée ?" },
    { jp: "あした、ともちにいきます。", mean: "Demain, j'irai chez mon ami.", q: "Où ira la personne demain ?" },
    { jp: "おはようございます。このおすしをください。", mean: "Bonjour. Ce sushi, s'il vous plaît.", q: "Que commande la personne ?" },
    { jp: "小さいイングリッシュをひとつください。", mean: "Un petit sandwich, s'il vous plaît.", q: "Quelle taille de sandwich veut la personne ?" },
    { jp: "大学はどこですか。", mean: "Où est l'université ?", q: "Que cherche la personne ?" },
    { jp: "いまなにじかんですか。", mean: "Quelle heure est-il maintenant ?", q: "Que demande-t-on ?" },
    { jp: "おはよう。日本語をべんきょうしています。", mean: "Salut ! J'apprends le japonais.", q: "Qu'apprend la personne ?" },
    { jp: "としのあたんじょうになにごよようをいわれますか。", mean: "Quels sont vos souhaits pour la nouvelle année ?", q: "De quel événement parle-t-on ?" },
    { jp: "さきんのにちょうびはもすくなかったですが、いまは多いです。", mean: "Avant il n'y avait pas beaucoup de chats, mais maintenant il y en a beaucoup.", q: "Qu'est-ce qui a augmenté ?" },
    { jp: "でんしゃでいきます。これはいくらですか。", mean: "Je vais en train. Combien coûte ce trajet ?", q: "Quel moyen de transport utilise-t-on ?" },
    { jp: "このほんはあなたのですか。", mean: "Ce livre est-il à vous ?", q: "Que demande-t-on ?" },
  ],
  dialogues: [
    { jp: "A: こんにちは。\nB: あ、こんにちは。おげんきですか。\nA: くりです。あなたは。\nB: わたしもげんきです。", mean: "A: Bonjour - B: Oh bonjour, ça va ? - A: Oui ça va. Et toi ? - B: Ça va aussi.", q: "Comment vont les deux personnes ?", note: "Les deux vont bien." },
    { jp: "A: いつひまですか。\nB: じゅうにじです。\nA: ありがとうごさいます。", mean: "A: Quelle heure est-il ? - B: Il est midi (12h). - A: Merci.", q: "Quelle heure est-il ?", note: "Il est midi (12h)." },
    { jp: "A: おはよう。まいにちなにをしますか。\nB: にほんごをべんきょうします。\nA: いいですね。", mean: "A: Salut ! Que fais-tu tous les jours ? - B: J'étudie le japonais. - A: C'est bien.", q: "Qu'est-ce que B fait tous les jours ?", note: "B étudie le japonais tous les jours." },
    { jp: "A: おはようございます。このカレーはいくらですか。\nB: 1000えんです。\nA: はい、ください。", mean: "A: Bonjour ! Combien coûte ce curry ? - B: 1000 yens. - A: Oui, s'il vous plaît.", q: "Combien coûte le curry ?", note: "1000 yens." },
    { jp: "A: おはよう。あしたともちにいきますか。\nB: うん、いいですよ。なんだでいきますか。\nA: でんしゃでいきます。", mean: "A: Salut ! Tu vas chez ton ami demain ? - B: Oui d'accord. On y va comment ? - A: On y va en train.", q: "Comment vont-ils chez l'ami ?", note: "En train." },
    { jp: "A: おはよう。このほんはあなたのですか。\nB: はい、わたしのほんです。たんとうしです。\nA: なるほど。", mean: "A: Salut ! Ce livre est à toi ? - B: Oui, c'est mon livre. C'est un dictionnaire. - A: Je vois.", q: "Quel livre B a-t-il ?", note: "Un dictionnaire." },
    { jp: "A: おはよう。きのうはなにをしましたか。\nB: いえでにほんごをふくしゅうしました。\nA: いつもなんだね。", mean: "A: Salut ! Qu'as-tu fait hier ? - B: J'ai révisé le japonais à la maison. - A: Toujours aussi sérieux.", q: "Qu'a fait B hier ?", note: "Révisé le japonais à la maison." },
    { jp: "A: おはようございます。がっこうはどこですか。\nB: あちらです。こっちです。\nA: ありがとうごさいます。", mean: "A: Excusez-moi, où est l'école ? - B: Par là. Par ici. - A: Merci.", q: "Que cherche A ?", note: "L'école." },
    { jp: "A: わたしはまいにちうんどうをします。あなたは。\nB: わたしもうんどうをします。いっしょにしますか。\nA: いいですね。", mean: "A: Je fais du sport tous les jours. Et toi ? - B: Je fais aussi du sport. On fait ensemble ? - A: D'accord.", q: "Que fait A tous les jours ?", note: "Du sport (course)." },
  ],
};
