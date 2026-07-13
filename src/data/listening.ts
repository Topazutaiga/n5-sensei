export interface JLTPListeningItem {
  scene?: string;
  audio: string;
  question: string;
  options: { emoji: string; text: string }[];
  answerIndex: number;
  note?: string;
}

export interface JLPTListeningData {
  phrases: JLTPListeningItem[];
  dialogues: JLTPListeningItem[];
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const EXTRA_DISTRACTORS = [
  { emoji: "🤷", text: "わかりません" },
  { emoji: "🙅", text: "いいえ" },
  { emoji: "💭", text: "ちょっと" },
  { emoji: "🤔", text: "どうですか" },
  { emoji: "😐", text: "そうですね" },
  { emoji: "😲", text: "そうですか" },
  { emoji: "💡", text: "いいですね" },
  { emoji: "👎", text: "よくないです" },
  { emoji: "👀", text: "ちょっとまって" },
  { emoji: "💪", text: "がんばります" },
];

function ensure4opts(opts: { emoji: string; text: string }[]): { emoji: string; text: string }[] {
  if (opts.length >= 4) return opts;
  const usedTexts = new Set(opts.map((o) => o.text));
  const pool = shuffle(EXTRA_DISTRACTORS.filter((d) => !usedTexts.has(d.text)));
  while (opts.length < 4) {
    opts.push(pool.length > 0 ? pool[opts.length % pool.length] : { emoji: "❓", text: "? " + opts.length });
  }
  return opts;
}

// === もんだい４ (Quick Response) templates for PHRASES ===
const Q4_TEMPLATES: { phrase: string; options: { emoji: string; text: string }[]; answerIndex: number }[] = [
  { phrase: "おはようございます。", options: [{ emoji: "🙂", text: "おはようございます。" }, { emoji: "😴", text: "おやすみなさい。" }, { emoji: "👋", text: "さようなら。" }], answerIndex: 0 },
  { phrase: "こんにちは。", options: [{ emoji: "🙂", text: "こんにちは。" }, { emoji: "🍚", text: "いただきます。" }, { emoji: "🚶", text: "いってきます。" }], answerIndex: 0 },
  { phrase: "ありがとうございます。", options: [{ emoji: "🙇", text: "どういたしまして。" }, { emoji: "😤", text: "だめです。" }, { emoji: "❓", text: "わかりません。" }], answerIndex: 0 },
  { phrase: "すみません。", options: [{ emoji: "🙆", text: "大丈夫です。" }, { emoji: "😊", text: "ありがとう。" }, { emoji: "👌", text: "いいです。" }], answerIndex: 0 },
  { phrase: "さようなら。", options: [{ emoji: "👋", text: "さようなら。" }, { emoji: "🌅", text: "おはよう。" }, { emoji: "🌙", text: "こんばんは。" }], answerIndex: 0 },
  { phrase: "お元気ですか。", options: [{ emoji: "💪", text: "はい、元気です。" }, { emoji: "😴", text: "ねます。" }, { emoji: "🍵", text: "おちゃをのみます。" }], answerIndex: 0 },
  { phrase: "お疲れ様です。", options: [{ emoji: "🙇", text: "お疲れ様です。" }, { emoji: "😊", text: "ありがとう。" }, { emoji: "👋", text: "いってきます。" }], answerIndex: 0 },
  { phrase: "いただきます。", options: [{ emoji: "🍚", text: "いただきます。" }, { emoji: "🍵", text: "ごちそうさま。" }, { emoji: "😋", text: "おいしい。" }], answerIndex: 0 },
  { phrase: "ごちそうさまでした。", options: [{ emoji: "🙏", text: "ごちそうさまでした。" }, { emoji: "🍚", text: "いただきます。" }, { emoji: "😊", text: "おいしいです。" }], answerIndex: 0 },
  { phrase: "いってきます。", options: [{ emoji: "👋", text: "いってらっしゃい。" }, { emoji: "🏃", text: "いってきます。" }, { emoji: "😊", text: "ただいま。" }], answerIndex: 0 },
  { phrase: "ただいま。", options: [{ emoji: "😊", text: "おかえりなさい。" }, { emoji: "🏠", text: "ただいま。" }, { emoji: "👋", text: "いってきます。" }], answerIndex: 0 },
  { phrase: "おやすみなさい。", options: [{ emoji: "🌙", text: "おやすみなさい。" }, { emoji: "🌅", text: "おはよう。" }, { emoji: "😊", text: "こんにちは。" }], answerIndex: 0 },
  { phrase: "お名前は何ですか。", options: [{ emoji: "👤", text: "田中です。" }, { emoji: "📍", text: "東京です。" }, { emoji: "🎂", text: "20歳です。" }], answerIndex: 0 },
  { phrase: "おいくつですか。", options: [{ emoji: "🎂", text: "25歳です。" }, { emoji: "📍", text: "大阪です。" }, { emoji: "👤", text: "鈴木です。" }], answerIndex: 0 },
  { phrase: "お国はどこですか。", options: [{ emoji: "🇯🇵", text: "日本です。" }, { emoji: "👤", text: "山田です。" }, { emoji: "🎂", text: "30歳です。" }], answerIndex: 0 },
  { phrase: "これは何ですか。", options: [{ emoji: "📖", text: "本です。" }, { emoji: "📍", text: "学校です。" }, { emoji: "👤", text: "先生です。" }], answerIndex: 0 },
  { phrase: "ここはどこですか。", options: [{ emoji: "🏫", text: "学校です。" }, { emoji: "📖", text: "本です。" }, { emoji: "🍚", text: "ご飯です。" }], answerIndex: 0 },
  { phrase: "何時ですか。", options: [{ emoji: "🕐", text: "3時です。" }, { emoji: "📅", text: "月曜日です。" }, { emoji: "🌡️", text: "25度です。" }], answerIndex: 0 },
  { phrase: "今日は何曜日ですか。", options: [{ emoji: "📅", text: "火曜日です。" }, { emoji: "🕐", text: "2時です。" }, { emoji: "🌡️", text: "寒いです。" }], answerIndex: 0 },
  { phrase: "今日の天気はどうですか。", options: [{ emoji: "☀️", text: "いい天気です。" }, { emoji: "📅", text: "水曜日です。" }, { emoji: "🕐", text: "4時です。" }], answerIndex: 0 },
  { phrase: "何を食べましたか。", options: [{ emoji: "🍜", text: "ラーメンを食べました。" }, { emoji: "📖", text: "本を読みました。" }, { emoji: "🏃", text: "走りました。" }], answerIndex: 0 },
  { phrase: "どこに行きますか。", options: [{ emoji: "🏪", text: "コンビニに行きます。" }, { emoji: "🍜", text: "ラーメンを食べます。" }, { emoji: "📖", text: "本を読みます。" }], answerIndex: 0 },
  { phrase: "これはいくらですか。", options: [{ emoji: "💰", text: "500円です。" }, { emoji: "🕐", text: "3時です。" }, { emoji: "📍", text: "東京です。" }], answerIndex: 0 },
  { phrase: "日本語ができますか。", options: [{ emoji: "👍", text: "少しできます。" }, { emoji: "❌", text: "行きません。" }, { emoji: "🍜", text: "ラーメンが好きです。" }], answerIndex: 0 },
  { phrase: "コーヒーを飲みませんか。", options: [{ emoji: "☕", text: "いいですね。" }, { emoji: "👎", text: "行きません。" }, { emoji: "😴", text: "おやすみ。" }], answerIndex: 0 },
  { phrase: "一緒に映画を見ませんか。", options: [{ emoji: "🎬", text: "いいですね。行きましょう。" }, { emoji: "📖", text: "本を読みます。" }, { emoji: "🍜", text: "ラーメンを食べます。" }], answerIndex: 0 },
  { phrase: "ご飯を食べましたか。", options: [{ emoji: "🍚", text: "はい、食べました。" }, { emoji: "❌", text: "いいえ、行きません。" }, { emoji: "📖", text: "本を読みます。" }], answerIndex: 0 },
  { phrase: "暑いですね。", options: [{ emoji: "😅", text: "本当に暑いですね。" }, { emoji: "🥶", text: "寒いですね。" }, { emoji: "🌧️", text: "雨ですね。" }], answerIndex: 0 },
  { phrase: "寒いですね。", options: [{ emoji: "🥶", text: "本当に寒いですね。" }, { emoji: "😅", text: "暑いですね。" }, { emoji: "☀️", text: "いい天気ですね。" }], answerIndex: 0 },
  { phrase: "大丈夫ですか。", options: [{ emoji: "👍", text: "はい、大丈夫です。" }, { emoji: "❌", text: "いいえ、行きません。" }, { emoji: "😊", text: "ありがとう。" }], answerIndex: 0 },
  { phrase: "ちょっと待ってください。", options: [{ emoji: "⏳", text: "はい、わかりました。" }, { emoji: "🏃", text: "行きます。" }, { emoji: "😊", text: "ありがとう。" }], answerIndex: 0 },
  { phrase: "ここに座ってもいいですか。", options: [{ emoji: "💺", text: "はい、どうぞ。" }, { emoji: "❌", text: "いいえ、だめです。" }, { emoji: "🚶", text: "行きましょう。" }], answerIndex: 0 },
  { phrase: "これは何ですか。", options: [{ emoji: "📱", text: "スマホです。" }, { emoji: "👤", text: "先生です。" }, { emoji: "🏠", text: "家です。" }], answerIndex: 0 },
  { phrase: "お母さんはいますか。", options: [{ emoji: "👩", text: "はい、います。" }, { emoji: "🏠", text: "家にいます。" }, { emoji: "📖", text: "本を読みます。" }], answerIndex: 0 },
  { phrase: "日曜日は何をしましたか。", options: [{ emoji: "🏃", text: "運動しました。" }, { emoji: "🍜", text: "ラーメンです。" }, { emoji: "📅", text: "月曜日です。" }], answerIndex: 0 },
  { phrase: "何のスポーツが好きですか。", options: [{ emoji: "⚽", text: "サッカーが好きです。" }, { emoji: "🍜", text: "ラーメンが好きです。" }, { emoji: "📖", text: "本が好きです。" }], answerIndex: 0 },
  { phrase: "好きな色は何ですか。", options: [{ emoji: "🔴", text: "赤が好きです。" }, { emoji: "🍜", text: "ラーメンが好きです。" }, { emoji: "⚽", text: "サッカーが好きです。" }], answerIndex: 0 },
  { phrase: "日本語の勉強は楽しいですか。", options: [{ emoji: "😊", text: "はい、とても楽しいです。" }, { emoji: "😫", text: "難しくて楽しくないです。" }, { emoji: "📖", text: "本を読んでいます。" }], answerIndex: 0 },
  { phrase: "もう帰りますか。", options: [{ emoji: "🏠", text: "はい、もう帰ります。" }, { emoji: "🍜", text: "ラーメンを食べます。" }, { emoji: "😊", text: "まだいます。" }], answerIndex: 0 },
  { phrase: "ご飯を食べましょう。", options: [{ emoji: "🍚", text: "はい、食べましょう。" }, { emoji: "📖", text: "本を読みます。" }, { emoji: "😴", text: "寝ます。" }], answerIndex: 0 },
  { phrase: "駅はどこですか。", options: [{ emoji: "🚉", text: "まっすぐ行ってください。" }, { emoji: "🍜", text: "ラーメンを食べます。" }, { emoji: "📖", text: "本を読んでいます。" }], answerIndex: 0 },
  { phrase: "明日は休みですか。", options: [{ emoji: "🎉", text: "はい、休みです。" }, { emoji: "🏫", text: "学校に行きます。" }, { emoji: "💼", text: "仕事があります。" }], answerIndex: 0 },
  { phrase: "何時に起きますか。", options: [{ emoji: "⏰", text: "6時に起きます。" }, { emoji: "🍚", text: "ご飯を食べます。" }, { emoji: "🏃", text: "運動します。" }], answerIndex: 0 },
  { phrase: "友達は何人いますか。", options: [{ emoji: "👥", text: "5人います。" }, { emoji: "📖", text: "本を読んでいます。" }, { emoji: "🏠", text: "家にいます。" }], answerIndex: 0 },
  { phrase: "誕生日はいつですか。", options: [{ emoji: "🎂", text: "4月3日です。" }, { emoji: "📍", text: "大阪です。" }, { emoji: "👤", text: "山田です。" }], answerIndex: 0 },
  { phrase: "どんな音楽が好きですか。", options: [{ emoji: "🎵", text: "Jポップが好きです。" }, { emoji: "⚽", text: "サッカーが好きです。" }, { emoji: "🍜", text: "ラーメンが好きです。" }], answerIndex: 0 },
  { phrase: "まだ仕事がありますか。", options: [{ emoji: "💼", text: "はい、まだあります。" }, { emoji: "🏠", text: "もう帰ります。" }, { emoji: "😊", text: "大丈夫です。" }], answerIndex: 0 },
  { phrase: "それはどこで買いましたか。", options: [{ emoji: "🏪", text: "コンビニで買いました。" }, { emoji: "📖", text: "図書館で借りました。" }, { emoji: "🍜", text: "ラーメン屋で食べました。" }], answerIndex: 0 },
  { phrase: "漢字が読めますか。", options: [{ emoji: "📖", text: "少し読めます。" }, { emoji: "❌", text: "行けません。" }, { emoji: "😊", text: "好きです。" }], answerIndex: 0 },
  { phrase: "お腹が空きましたか。", options: [{ emoji: "🍚", text: "はい、とても空きました。" }, { emoji: "😴", text: "眠いです。" }, { emoji: "💪", text: "元気です。" }], answerIndex: 0 },
];

// === もんだい２ (Key Point) templates for PHRASES ===
const Q2_TEMPLATES: { audio: string; question: string; options: { emoji: string; text: string }[]; answerIndex: number }[] = [
  { audio: "きのうは とても いい天気でした。わたしは こうえんに 行きました。", question: "きのうの天気はどうでしたか。", options: [{ emoji: "☀️", text: "いい天気でした。" }, { emoji: "🌧️", text: "雨でした。" }, { emoji: "❄️", text: "雪でした。" }], answerIndex: 0 },
  { audio: "毎朝 6時に 起きます。それから 歯を磨いて、ご飯を 食べます。", question: "毎朝 何時に 起きますか。", options: [{ emoji: "⏰", text: "6時" }, { emoji: "⏰", text: "7時" }, { emoji: "⏰", text: "8時" }], answerIndex: 0 },
  { audio: "この りんごは おいしいです。でも、100円です。安いです。", question: "りんごは いくらですか。", options: [{ emoji: "💰", text: "100円" }, { emoji: "💰", text: "200円" }, { emoji: "💰", text: "50円" }], answerIndex: 0 },
  { audio: "電車で 学校に 行きます。30分 かかります。", question: "何で 学校に 行きますか。", options: [{ emoji: "🚃", text: "電車" }, { emoji: "🚌", text: "バス" }, { emoji: "🚶", text: "歩き" }], answerIndex: 0 },
  { audio: "わたしの 国は フランスです。でも 今は 日本に 住んでいます。", question: "この人は 今 どこに 住んでいますか。", options: [{ emoji: "🇯🇵", text: "日本" }, { emoji: "🇫🇷", text: "フランス" }, { emoji: "🇺🇸", text: "アメリカ" }], answerIndex: 0 },
  { audio: "母は 料理が 上手です。毎日 美味しい ご飯を 作ります。", question: "お母さんは 何が 上手ですか。", options: [{ emoji: "🍳", text: "料理" }, { emoji: "🎵", text: "音楽" }, { emoji: "⚽", text: "スポーツ" }], answerIndex: 0 },
  { audio: "昨日は とても 寒かったです。気温は 5度でした。", question: "昨日の気温は 何度でしたか。", options: [{ emoji: "❄️", text: "5度" }, { emoji: "☀️", text: "15度" }, { emoji: "🌡️", text: "25度" }], answerIndex: 0 },
  { audio: "山田さんは 毎朝 ジョギングを します。1時間 走ります。", question: "山田さんは 毎朝 何を しますか。", options: [{ emoji: "🏃", text: "ジョギング" }, { emoji: "🏊", text: "泳ぐ" }, { emoji: "🚴", text: "自転車" }], answerIndex: 0 },
  { audio: "日曜日、本屋に 行きました。日本語の 本を 買いました。", question: "日曜日 どこに 行きましたか。", options: [{ emoji: "📚", text: "本屋" }, { emoji: "🏪", text: "コンビニ" }, { emoji: "🎬", text: "映画館" }], answerIndex: 0 },
  { audio: "日本語の勉強は 毎日 30分 します。", question: "毎日 どのくらい 勉強しますか。", options: [{ emoji: "⏰", text: "30分" }, { emoji: "⏰", text: "1時間" }, { emoji: "⏰", text: "2時間" }], answerIndex: 0 },
  { audio: "駅の前に 大きい スーパーが あります。", question: "駅の前に 何が ありますか。", options: [{ emoji: "🏪", text: "スーパー" }, { emoji: "🏛️", text: "銀行" }, { emoji: "🏥", text: "病院" }], answerIndex: 0 },
  { audio: "昨日は 友達と 映画を 見ました。とても 面白かったです。", question: "昨日は 誰と 映画を 見ましたか。", options: [{ emoji: "👥", text: "友達" }, { emoji: "👨‍👩‍👧", text: "家族" }, { emoji: "👩‍🏫", text: "先生" }], answerIndex: 0 },
  { audio: "今月は とても 忙しいです。仕事が 多いです。", question: "今月は どうですか。", options: [{ emoji: "😫", text: "忙しい" }, { emoji: "😊", text: "暇" }, { emoji: "😴", text: "疲れた" }], answerIndex: 0 },
  { audio: "来週の土曜日に 友達と 遊園地に 行きます。", question: "来週の土曜日 どこに 行きますか。", options: [{ emoji: "🎡", text: "遊園地" }, { emoji: "🏖️", text: "海" }, { emoji: "⛰️", text: "山" }], answerIndex: 0 },
  { audio: "図書館で 日本語の 雑誌を 読みました。", question: "図書館で 何を しましたか。", options: [{ emoji: "📖", text: "雑誌を読んだ" }, { emoji: "✍️", text: "勉強した" }, { emoji: "👀", text: "見た" }], answerIndex: 0 },
  { audio: "風邪を 引きました。頭が 痛いです。", question: "この人は どうしましたか。", options: [{ emoji: "🤒", text: "風邪" }, { emoji: "🤕", text: "怪我" }, { emoji: "😴", text: "眠い" }], answerIndex: 0 },
  { audio: "毎日 自転車で 会社に 行きます。20分 かかります。", question: "何で 会社に 行きますか。", options: [{ emoji: "🚲", text: "自転車" }, { emoji: "🚃", text: "電車" }, { emoji: "🚶", text: "歩き" }], answerIndex: 0 },
  { audio: "きのう 銀行に 行きました。お金を おろしました。", question: "きのう 銀行で 何を しましたか。", options: [{ emoji: "💰", text: "お金をおろした" }, { emoji: "💳", text: "カードを作った" }, { emoji: "📝", text: "書類を書いた" }], answerIndex: 0 },
  { audio: "妹は ピアノが 上手です。毎日 練習しています。", question: "妹さんは 何が 上手ですか。", options: [{ emoji: "🎹", text: "ピアノ" }, { emoji: "🎸", text: "ギター" }, { emoji: "🎤", text: "歌" }], answerIndex: 0 },
  { audio: "先週の日曜日は 雨でした。家で 本を 読みました。", question: "先週の日曜日 何を しましたか。", options: [{ emoji: "📖", text: "本を読んだ" }, { emoji: "📺", text: "テレビを見た" }, { emoji: "😴", text: "寝た" }], answerIndex: 0 },
];

// === もんだい１ (Scene Task) templates for DIALOGUES ===
const Q1_TEMPLATES: { scene: string; dialogue: string; question: string; options: { emoji: string; text: string }[]; answerIndex: number }[] = [
  { scene: "🏪🧑‍💼", dialogue: "店員: いらっしゃいませ。\n客: すみません、この靴は いくらですか。\n店員: 3000円です。", question: "この人は 何を 買いますか。", options: [{ emoji: "👞", text: "靴" }, { emoji: "👕", text: "シャツ" }, { emoji: "🎒", text: "バッグ" }], answerIndex: 0 },
  { scene: "🚉🧑‍🦰", dialogue: "田中: すみません、渋谷駅は どこですか。\n人: まっすぐ 行って、右です。\n田中: ありがとうございます。", question: "渋谷駅は どこですか。", options: [{ emoji: "⬆️➡️", text: "まっすぐ行って右" }, { emoji: "⬆️⬅️", text: "まっすぐ行って左" }, { emoji: "⬅️", text: "左" }], answerIndex: 0 },
  { scene: "🍜👩", dialogue: "店員: いらっしゃいませ。\n鈴木: ラーメンを ください。\n店員: はい、かしこまりました。", question: "鈴木さんは 何を 注文しましたか。", options: [{ emoji: "🍜", text: "ラーメン" }, { emoji: "🍣", text: "寿司" }, { emoji: "🍛", text: "カレー" }], answerIndex: 0 },
  { scene: "☕👫", dialogue: "佐藤: よかったら、コーヒーを 飲みませんか。\n山田: いいですね。行きましょう。", question: "二人は これから 何を しますか。", options: [{ emoji: "☕", text: "コーヒーを飲む" }, { emoji: "🍜", text: "ラーメンを食べる" }, { emoji: "🚶", text: "散歩する" }], answerIndex: 0 },
  { scene: "🏫👩‍🏫", dialogue: "先生: 宿題を 出しましたか。\n学生: はい、出しました。\n先生: じゃあ、次のページを 読んでください。", question: "学生は 何を しましたか。", options: [{ emoji: "📝", text: "宿題を出した" }, { emoji: "📖", text: "本を読む" }, { emoji: "✍️", text: "書く" }], answerIndex: 0 },
  { scene: "🌤️🏃", dialogue: "母: 今日は いい天気ですね。\n息子: そうですね。散歩に 行きましょうか。\n母: いいですね。", question: "二人は 何を しますか。", options: [{ emoji: "🚶", text: "散歩" }, { emoji: "🏃", text: "ジョギング" }, { emoji: "🚲", text: "自転車" }], answerIndex: 0 },
  { scene: "🏪🧒", dialogue: "子: お母さん、これが 欲しいです。\n母: これは ちょっと 高いですよ。\n子: お願いします。", question: "子どもは 何と 言いましたか。", options: [{ emoji: "🙏", text: "お願いします" }, { emoji: "😭", text: "いやです" }, { emoji: "👌", text: "いいです" }], answerIndex: 0 },
  { scene: "🍣🍵", dialogue: "田中: 日本の 食べ物は 何が 好きですか。\n山田: 寿司が 大好きです。\n田中: 私も 好きです。", question: "山田さんは 何が 好きですか。", options: [{ emoji: "🍣", text: "寿司" }, { emoji: "🍜", text: "ラーメン" }, { emoji: "🍛", text: "カレー" }], answerIndex: 0 },
  { scene: "🎬👥", dialogue: "A: 今週の土曜日、暇ですか。\nB: はい、暇です。\nA: 一緒に 映画を 見ませんか。\nB: いいですね。", question: "二人は いつ 映画を 見ますか。", options: [{ emoji: "📅", text: "土曜日" }, { emoji: "📅", text: "日曜日" }, { emoji: "📅", text: "金曜日" }], answerIndex: 0 },
  { scene: "🌡️🤒", dialogue: "医者: どうしましたか。\n患者: 頭が 痛いです。\n医者: じゃあ、この薬を 飲んでください。", question: "患者は どこが 痛いですか。", options: [{ emoji: "🤕", text: "頭" }, { emoji: "🤲", text: "手" }, { emoji: "🦶", text: "足" }], answerIndex: 0 },
  { scene: "🏠🧹", dialogue: "母: 部屋が 汚いですよ。\n子: すみません。掃除します。\n母: お願いします。", question: "子どもは これから 何を しますか。", options: [{ emoji: "🧹", text: "掃除" }, { emoji: "📖", text: "勉強" }, { emoji: "🍳", text: "料理" }], answerIndex: 0 },
  { scene: "🎂🎁", dialogue: "A: 明日は あなたの 誕生日ですね。\nB: そうなんです。楽しみです。\nA: プレゼントを あげます。", question: "明日は 何の日ですか。", options: [{ emoji: "🎂", text: "誕生日" }, { emoji: "🎄", text: "クリスマス" }, { emoji: "🎉", text: "パーティー" }], answerIndex: 0 },
  { scene: "☎️👩", dialogue: "鈴木: もしもし、田中さんは いますか。\n田中: はい、わたしです。\n鈴木: 明日の 約束は 3時でしたね。", question: "二人は 何について 話していますか。", options: [{ emoji: "📅", text: "約束の時間" }, { emoji: "🍜", text: "ラーメン" }, { emoji: "📖", text: "宿題" }], answerIndex: 0 },
  { scene: "🌧️☂️", dialogue: "A: あ、雨が 降っていますね。\nB: そうですね。傘を 持って いません。\nA: 私のを 貸しますよ。", question: "Bさんは 何を 持って いませんか。", options: [{ emoji: "☂️", text: "傘" }, { emoji: "🎒", text: "バッグ" }, { emoji: "📖", text: "本" }], answerIndex: 0 },
  { scene: "🗾✈️", dialogue: "A: 夏休みは どこに 行きますか。\nB: 北海道に 行きます。\nA: いいですね。何を しますか。\nB: ラーメンを 食べます。", question: "Bさんは 夏休み どこに 行きますか。", options: [{ emoji: "🗾", text: "北海道" }, { emoji: "🗾", text: "東京" }, { emoji: "🗾", text: "大阪" }], answerIndex: 0 },
  { scene: "📚🧑‍🎓", dialogue: "先生: 試験は いつですか。\n学生: 来週の 月曜日です。\n先生: 頑張ってください。", question: "試験は いつですか。", options: [{ emoji: "📅", text: "来週の月曜日" }, { emoji: "📅", text: "来週の火曜日" }, { emoji: "📅", text: "明日" }], answerIndex: 0 },
  { scene: "🏖️👪", dialogue: "父: 明日は 海に 行きましょうか。\n子: やったー！\n母: いいですね。お弁当を 作りましょう。", question: "家族は 明日 どこに 行きますか。", options: [{ emoji: "🏖️", text: "海" }, { emoji: "⛰️", text: "山" }, { emoji: "🏞️", text: "公園" }], answerIndex: 0 },
  { scene: "💻🧑‍💼", dialogue: "上司: この書類を コピーして ください。\n社員: はい。何部ですか。\n上司: 10部です。", question: "社員は 何を しますか。", options: [{ emoji: "📄", text: "コピー" }, { emoji: "✍️", text: "書く" }, { emoji: "📧", text: "メール" }], answerIndex: 0 },
  { scene: "🍳👩‍🍳", dialogue: "A: カレーの 作り方を 教えて ください。\nB: まず、野菜を 切ります。\nA: はい。\nB: それから、肉と 野菜を 炒めます。", question: "カレーの 最初の ステップは 何ですか。", options: [{ emoji: "🔪", text: "野菜を切る" }, { emoji: "🍳", text: "炒める" }, { emoji: "🍚", text: "ご飯を炊く" }], answerIndex: 0 },
  { scene: "👘🎆", dialogue: "A: 夏祭りに 行きませんか。\nB: いいですね。浴衣を 着て 行きます。\nA: 私も 浴衣を 着ます。", question: "二人は 何を 着て 行きますか。", options: [{ emoji: "👘", text: "浴衣" }, { emoji: "👔", text: "スーツ" }, { emoji: "👕", text: "Tシャツ" }], answerIndex: 0 },
  { scene: "⛩️📸", dialogue: "A: この神社は 有名ですか。\nB: はい、とても 有名です。\nA: 写真を 撮っても いいですか。\nB: はい、どうぞ。", question: "Aさんは 神社で 何を しますか。", options: [{ emoji: "📸", text: "写真を撮る" }, { emoji: "🙏", text: "お祈りする" }, { emoji: "👀", text: "見る" }], answerIndex: 0 },
  { scene: "🚗🅿️", dialogue: "A: 駐車場は どこですか。\nB: あそこに あります。\nA: ありがとうございます。", question: "Aさんは 何を 探していますか。", options: [{ emoji: "🅿️", text: "駐車場" }, { emoji: "🚉", text: "駅" }, { emoji: "🏪", text: "コンビニ" }], answerIndex: 0 },
  { scene: "🍰☕", dialogue: "店員: ご注文は？\n客: ケーキと コーヒーを ください。\n店員: かしこまりました。", question: "お客さんは 何を 注文しましたか。", options: [{ emoji: "🍰☕", text: "ケーキとコーヒー" }, { emoji: "🍜🥤", text: "ラーメンとジュース" }, { emoji: "🍣🍵", text: "寿司とお茶" }], answerIndex: 0 },
  { scene: "📱👤", dialogue: "A: すみません、電話を 貸して ください。\nB: はい、どうぞ。\nA: ありがとうございます。", question: "Aさんは 何を 借りますか。", options: [{ emoji: "📱", text: "電話" }, { emoji: "💰", text: "お金" }, { emoji: "📖", text: "本" }], answerIndex: 0 },
  { scene: "🎤🎶", dialogue: "A: カラオケに 行きませんか。\nB: すみません、ちょっと 用事が あります。\nA: そうですか。また 今度。", question: "Bさんは カラオケに 行きますか。", options: [{ emoji: "❌", text: "行かない" }, { emoji: "✅", text: "行く" }, { emoji: "🤔", text: "まだわからない" }], answerIndex: 0 },
];

// === もんだい３ (Expression) templates for DIALOGUES ===
const Q3_TEMPLATES: { scene: string; situation: string; options: { emoji: string; text: string }[]; answerIndex: number }[] = [
  { scene: "🚪➡️👤", situation: "朝、家を出るとき、何と言いますか。", options: [{ emoji: "👋", text: "いってきます。" }, { emoji: "🏠", text: "ただいま。" }, { emoji: "🌙", text: "おやすみ。" }], answerIndex: 0 },
  { scene: "🏠⬅️👤", situation: "家に帰ったとき、何と言いますか。", options: [{ emoji: "🏠", text: "ただいま。" }, { emoji: "👋", text: "いってきます。" }, { emoji: "🍚", text: "いただきます。" }], answerIndex: 0 },
  { scene: "🍚🙏", situation: "ご飯を食べるとき、何と言いますか。", options: [{ emoji: "🍚", text: "いただきます。" }, { emoji: "🙏", text: "ごちそうさま。" }, { emoji: "😋", text: "おいしい。" }], answerIndex: 0 },
  { scene: "🍽️🙏", situation: "ご飯を食べ終わったとき、何と言いますか。", options: [{ emoji: "🙏", text: "ごちそうさまでした。" }, { emoji: "🍚", text: "いただきます。" }, { emoji: "😊", text: "ありがとう。" }], answerIndex: 0 },
  { scene: "💤🌙", situation: "寝るとき、何と言いますか。", options: [{ emoji: "🌙", text: "おやすみなさい。" }, { emoji: "🌅", text: "おはよう。" }, { emoji: "😊", text: "こんにちは。" }], answerIndex: 0 },
  { scene: "🌅👤", situation: "朝、先生に会ったとき、何と言いますか。", options: [{ emoji: "🙇", text: "おはようございます。" }, { emoji: "😊", text: "こんにちは。" }, { emoji: "🌙", text: "こんばんは。" }], answerIndex: 0 },
  { scene: "🎁🙏", situation: "プレゼントをもらったとき、何と言いますか。", options: [{ emoji: "😊", text: "ありがとうございます。" }, { emoji: "🙇", text: "すみません。" }, { emoji: "😲", text: "すごい。" }], answerIndex: 0 },
  { scene: "🙇‍♂️", situation: "人にぶつかったとき、何と言いますか。", options: [{ emoji: "🙇", text: "すみません。" }, { emoji: "😊", text: "ありがとう。" }, { emoji: "👋", text: "さようなら。" }], answerIndex: 0 },
  { scene: "🕐❓", situation: "時間を知りたいとき、何と言いますか。", options: [{ emoji: "🕐", text: "今何時ですか。" }, { emoji: "📍", text: "どこですか。" }, { emoji: "💰", text: "いくらですか。" }], answerIndex: 0 },
  { scene: "📍❓", situation: "トイレの場所を知りたいとき、何と言いますか。", options: [{ emoji: "🚻", text: "トイレはどこですか。" }, { emoji: "🕐", text: "何時ですか。" }, { emoji: "💰", text: "いくらですか。" }], answerIndex: 0 },
  { scene: "💰❓", situation: "値段を知りたいとき、何と言いますか。", options: [{ emoji: "💰", text: "いくらですか。" }, { emoji: "📍", text: "どこですか。" }, { emoji: "🕐", text: "何時ですか。" }], answerIndex: 0 },
  { scene: "🤝👤", situation: "初めて会った人に、何と言いますか。", options: [{ emoji: "🙇", text: "はじめまして。" }, { emoji: "👋", text: "さようなら。" }, { emoji: "😊", text: "お元気ですか。" }], answerIndex: 0 },
  { scene: "🙏📝", situation: "お願いがあるとき、何と言いますか。", options: [{ emoji: "🙏", text: "お願いします。" }, { emoji: "😊", text: "ありがとう。" }, { emoji: "🙇", text: "すみません。" }], answerIndex: 0 },
  { scene: "🎉👤", situation: "友達の誕生日に、何と言いますか。", options: [{ emoji: "🎂", text: "お誕生日おめでとう。" }, { emoji: "🎄", text: "メリークリスマス。" }, { emoji: "🎍", text: "明けましておめでとう。" }], answerIndex: 0 },
  { scene: "🚶‍♂️👋", situation: "学校で友達と別れるとき、何と言いますか。", options: [{ emoji: "👋", text: "さようなら。" }, { emoji: "🌅", text: "おはよう。" }, { emoji: "🍚", text: "いただきます。" }], answerIndex: 0 },
  { scene: "😋❓", situation: "美味しそうな料理を見て、何と言いますか。", options: [{ emoji: "😋", text: "おいしそうですね。" }, { emoji: "😫", text: "まずそうですね。" }, { emoji: "😲", text: "高いですね。" }], answerIndex: 0 },
  { scene: "🤔❓", situation: "意味がわからないとき、何と言いますか。", options: [{ emoji: "🤔", text: "意味がわかりません。" }, { emoji: "👍", text: "わかりました。" }, { emoji: "😊", text: "大丈夫です。" }], answerIndex: 0 },
  { scene: "🙋‍♂️", situation: "教室で質問があるとき、何と言いますか。", options: [{ emoji: "🙋", text: "すみません、質問があります。" }, { emoji: "👋", text: "さようなら。" }, { emoji: "😴", text: "眠いです。" }], answerIndex: 0 },
  { scene: "👀📖", situation: "本を貸してほしいとき、何と言いますか。", options: [{ emoji: "📖", text: "この本を貸してください。" }, { emoji: "💰", text: "いくらですか。" }, { emoji: "📍", text: "どこですか。" }], answerIndex: 0 },
  { scene: "🏃‍♂️⏰", situation: "遅刻しそうなとき、何と言いますか。", options: [{ emoji: "😰", text: "遅れます！すみません！" }, { emoji: "😊", text: "大丈夫です。" }, { emoji: "😴", text: "眠いです。" }], answerIndex: 0 },
  { scene: "🙇‍♂️", situation: "人に道を教えてもらったとき、何と言いますか。", options: [{ emoji: "🙇", text: "ありがとうございます。" }, { emoji: "🤔", text: "わかりません。" }, { emoji: "👋", text: "さようなら。" }], answerIndex: 0 },
  { scene: "🤲📱", situation: "電話を借りたいとき、何と言いますか。", options: [{ emoji: "📱", text: "電話を借りてもいいですか。" }, { emoji: "💰", text: "いくらですか。" }, { emoji: "📍", text: "どこですか。" }], answerIndex: 0 },
  { scene: "🍺🥂", situation: "乾杯するとき、何と言いますか。", options: [{ emoji: "🍻", text: "乾杯！" }, { emoji: "🍚", text: "いただきます。" }, { emoji: "🙏", text: "ごちそうさま。" }], answerIndex: 0 },
  { scene: "🥶🧊", situation: "寒いとき、何と言いますか。", options: [{ emoji: "🥶", text: "寒いですね。" }, { emoji: "😅", text: "暑いですね。" }, { emoji: "🌧️", text: "雨ですね。" }], answerIndex: 0 },
  { scene: "😅☀️", situation: "暑いとき、何と言いますか。", options: [{ emoji: "😅", text: "暑いですね。" }, { emoji: "🥶", text: "寒いですね。" }, { emoji: "🌧️", text: "雨ですね。" }], answerIndex: 0 },
  { scene: "👋🚶", situation: "出かける人に、何と言いますか。", options: [{ emoji: "👋", text: "いってらっしゃい。" }, { emoji: "🏠", text: "おかえり。" }, { emoji: "😊", text: "ただいま。" }], answerIndex: 0 },
];

// === GENERATE 350 PHRASES ===
function generatePhrases(): JLTPListeningItem[] {
  const items: JLTPListeningItem[] = [];

  // Add all Q4 (quick response) templates
  for (const t of Q4_TEMPLATES) {
    if (items.length >= 350) break;
    items.push({ audio: t.phrase, question: "何と答えますか。", options: t.options, answerIndex: t.answerIndex, note: "正しい返事を選んでください。" });
  }

  // Add all Q2 (key point) templates
  for (const t of Q2_TEMPLATES) {
    if (items.length >= 350) break;
    items.push({ audio: t.audio, question: t.question, options: t.options, answerIndex: t.answerIndex });
  }

  // Generate more Q4-style with permutations
  const phrases = ["おはよう。", "こんばんは。", "元気？", "どうしたの？", "どこに行くの？", "何してるの？", "行こうよ。", "やったね！", "すごいね！", "大丈夫？"];
  const responses = [
    [{ emoji: "🙂", text: "おはよう。" }, { emoji: "🌙", text: "こんばんは。" }, { emoji: "👋", text: "さようなら。" }],
    [{ emoji: "🌙", text: "こんばんは。" }, { emoji: "🌅", text: "おはよう。" }, { emoji: "😊", text: "こんにちは。" }],
    [{ emoji: "💪", text: "元気だよ。" }, { emoji: "😴", text: "眠い。" }, { emoji: "🍚", text: "お腹すいた。" }],
    [{ emoji: "🤔", text: "何でもない。" }, { emoji: "😊", text: "大丈夫。" }, { emoji: "😭", text: "困った。" }],
    [{ emoji: "🏪", text: "コンビニ。" }, { emoji: "🏠", text: "家。" }, { emoji: "🏫", text: "学校。" }],
    [{ emoji: "📖", text: "勉強してる。" }, { emoji: "📺", text: "テレビを見てる。" }, { emoji: "😴", text: "寝てる。" }],
    [{ emoji: "👍", text: "行こう！" }, { emoji: "👎", text: "行かない。" }, { emoji: "🤔", text: "ちょっと待って。" }],
    [{ emoji: "🎉", text: "やったー！" }, { emoji: "😊", text: "すごい！" }, { emoji: "👍", text: "いいね！" }],
    [{ emoji: "😲", text: "本当にすごいね！" }, { emoji: "👍", text: "いいね！" }, { emoji: "😊", text: "やったね！" }],
    [{ emoji: "👍", text: "大丈夫だよ。" }, { emoji: "😭", text: "大丈夫じゃない。" }, { emoji: "🤔", text: "わからない。" }],
  ];
  for (let i = 0; i < phrases.length && items.length < 350; i++) {
    items.push({ audio: phrases[i], question: "何と答えますか。", options: responses[i], answerIndex: 0 });
  }

  // Fill remaining with more Q2 style passages
  const passages = [
    { audio: "田中さんは 毎日 朝6時に 起きます。", question: "田中さんは 毎日 何時に 起きますか。", opts: [{ emoji: "⏰", text: "6時" }, { emoji: "⏰", text: "7時" }, { emoji: "⏰", text: "5時" }], ai: 0 },
    { audio: "今日の 昼ごはんは うどんでした。", question: "昼ごはんは 何でしたか。", opts: [{ emoji: "🍜", text: "うどん" }, { emoji: "🍣", text: "寿司" }, { emoji: "🍛", text: "カレー" }], ai: 0 },
    { audio: "この 町には 大きい 公園が あります。", question: "この町に 何が ありますか。", opts: [{ emoji: "🏞️", text: "公園" }, { emoji: "🏪", text: "スーパー" }, { emoji: "🏫", text: "学校" }], ai: 0 },
    { audio: "山田さんは ピアノが 上手です。", question: "山田さんは 何が 上手ですか。", opts: [{ emoji: "🎹", text: "ピアノ" }, { emoji: "🎸", text: "ギター" }, { emoji: "🎤", text: "歌" }], ai: 0 },
    { audio: "私は 毎朝 パンを 食べます。", question: "毎朝 何を 食べますか。", opts: [{ emoji: "🍞", text: "パン" }, { emoji: "🍚", text: "ご飯" }, { emoji: "🥣", text: "シリアル" }], ai: 0 },
    { audio: "駅の前に 新しい カフェが できました。", question: "駅の前に 何が できましたか。", opts: [{ emoji: "☕", text: "カフェ" }, { emoji: "🏪", text: "コンビニ" }, { emoji: "📚", text: "本屋" }], ai: 0 },
    { audio: "田中さんは 毎日 日本語を 勉強しています。", question: "田中さんは 毎日 何を していますか。", opts: [{ emoji: "📖", text: "日本語の勉強" }, { emoji: "🏃", text: "運動" }, { emoji: "🍳", text: "料理" }], ai: 0 },
    { audio: "昨日、友達と 映画を 見ました。", question: "昨日 誰と 映画を 見ましたか。", opts: [{ emoji: "👥", text: "友達" }, { emoji: "👨‍👩‍👧", text: "家族" }, { emoji: "👩‍🏫", text: "先生" }], ai: 0 },
    { audio: "来週の日曜日は テストです。", question: "テストは いつですか。", opts: [{ emoji: "📅", text: "来週の日曜日" }, { emoji: "📅", text: "来週の土曜日" }, { emoji: "📅", text: "明日" }], ai: 0 },
    { audio: "日本の 夏は とても 暑いです。", question: "日本の夏は どうですか。", opts: [{ emoji: "😅", text: "暑い" }, { emoji: "🥶", text: "寒い" }, { emoji: "😊", text: "過ごしやすい" }], ai: 0 },
    { audio: "私は 犬が 好きです。家で 犬を 飼っています。", question: "この人は 何を 飼っていますか。", opts: [{ emoji: "🐕", text: "犬" }, { emoji: "🐈", text: "猫" }, { emoji: "🐰", text: "ウサギ" }], ai: 0 },
    { audio: "日本に 来て 3年です。日本語が 少し 話せます。", question: "この人は 何年 日本に 住んでいますか。", opts: [{ emoji: "3️⃣", text: "3年" }, { emoji: "1️⃣", text: "1年" }, { emoji: "5️⃣", text: "5年" }], ai: 0 },
    { audio: "昨日は 雨でした。今日は 晴れています。", question: "今日の天気は どうですか。", opts: [{ emoji: "☀️", text: "晴れ" }, { emoji: "🌧️", text: "雨" }, { emoji: "☁️", text: "曇り" }], ai: 0 },
    { audio: "冬は スキーが できます。北海道は 雪が 多いです。", question: "北海道の冬は 何が 多いですか。", opts: [{ emoji: "❄️", text: "雪" }, { emoji: "🌧️", text: "雨" }, { emoji: "☀️", text: "太陽" }], ai: 0 },
    { audio: "コンビニで お弁当を 買いました。450円でした。", question: "お弁当は いくらでしたか。", opts: [{ emoji: "💰", text: "450円" }, { emoji: "💰", text: "500円" }, { emoji: "💰", text: "400円" }], ai: 0 },
    { audio: "家から 駅まで 歩いて 10分です。", question: "家から駅まで どのくらい かかりますか。", opts: [{ emoji: "🚶", text: "10分" }, { emoji: "🚶", text: "20分" }, { emoji: "🚶", text: "5分" }], ai: 0 },
  ];

  while (items.length < 350) {
    const idx = items.length % passages.length;
    const p = passages[idx];
    items.push({ audio: p.audio, question: p.question, options: p.opts, answerIndex: p.ai });
  }

  items.forEach((item) => { item.options = ensure4opts(item.options); });
  return shuffle(items).slice(0, 350);
}

// === GENERATE 350 DIALOGUES ===
function generateDialogues(): JLTPListeningItem[] {
  const items: JLTPListeningItem[] = [];

  // Add all Q1 (scene task) templates
  for (const t of Q1_TEMPLATES) {
    if (items.length >= 350) break;
    items.push({ scene: t.scene, audio: t.dialogue, question: t.question, options: t.options, answerIndex: t.answerIndex });
  }

  // Add all Q3 (expression) templates
  for (const t of Q3_TEMPLATES) {
    if (items.length >= 350) break;
    items.push({ scene: t.scene, audio: t.situation, question: t.situation, options: t.options, answerIndex: t.answerIndex, note: "適切な表現を選んでください。" });
  }

  // Generate more Q1-style
  const moreQ1 = [
    { s: "🍜👤", d: "店員: ご注文は？\n客: ラーメンを ください。\n店員: はい。", q: "お客さんは 何を 注文しましたか。", o: [{ emoji: "🍜", text: "ラーメン" }, { emoji: "🍛", text: "カレー" }, { emoji: "🍣", text: "寿司" }], a: 0 },
    { s: "📚👩‍🏫", d: "先生: 宿題を 出してください。\n学生: はい、すみません。今 出します。", q: "学生は 何を しますか。", o: [{ emoji: "📝", text: "宿題を出す" }, { emoji: "📖", text: "本を読む" }, { emoji: "✍️", text: "書く" }], a: 0 },
    { s: "🏥😷", d: "医者: 風邪ですね。この薬を 飲んでください。\n患者: ありがとうございます。", q: "患者は どうしましたか。", o: [{ emoji: "😷", text: "風邪" }, { emoji: "🤕", text: "怪我" }, { emoji: "😴", text: "疲れ" }], a: 0 },
    { s: "☕🧑‍🤝‍🧑", d: "A: コーヒーは 好きですか。\nB: はい、大好きです。毎日 飲みます。", q: "Bさんは コーヒーを どのくらい 飲みますか。", o: [{ emoji: "☕", text: "毎日" }, { emoji: "📅", text: "週に2回" }, { emoji: "📅", text: "たまに" }], a: 0 },
    { s: "🏖️👨‍👩‍👧", d: "子: 海に 行きたい！\n母: じゃあ、日曜日に 行きましょう。\n父: いいですね。", q: "家族は いつ 海に 行きますか。", o: [{ emoji: "📅", text: "日曜日" }, { emoji: "📅", text: "土曜日" }, { emoji: "📅", text: "明日" }], a: 0 },
    { s: "🎮👦", d: "子: ゲームを して いいですか。\n母: 宿題が 終わったらね。", q: "子どもは 何を したいですか。", o: [{ emoji: "🎮", text: "ゲーム" }, { emoji: "📖", text: "勉強" }, { emoji: "🏃", text: "運動" }], a: 0 },
    { s: "🍰👩‍🍳", d: "A: このケーキ、自分で 作りました。\nB: すごい！美味しそう！", q: "ケーキは 誰が 作りましたか。", o: [{ emoji: "👩", text: "Aさん" }, { emoji: "👨", text: "Bさん" }, { emoji: "🏪", text: "お店" }], a: 0 },
    { s: "📱💬", d: "A: もしもし、今 どこ？\nB: 駅に います。もうすぐ 着きます。", q: "Bさんは 今 どこに いますか。", o: [{ emoji: "🚉", text: "駅" }, { emoji: "🏠", text: "家" }, { emoji: "🏫", text: "学校" }], a: 0 },
    { s: "🌧️🚶", d: "A: 雨ですね。傘を 持って いますか。\nB: いいえ、忘れました。\nA: じゃあ、これを使ってください。", q: "Bさんは 何を 忘れましたか。", o: [{ emoji: "☂️", text: "傘" }, { emoji: "🎒", text: "カバン" }, { emoji: "💰", text: "財布" }], a: 0 },
    { s: "🏪🧑‍🦰", d: "客: すみません、醤油は どこですか。\n店員: あちらです。\n客: ありがとうございます。", q: "お客さんは 何を 探していますか。", o: [{ emoji: "🥫", text: "醤油" }, { emoji: "🍚", text: "ご飯" }, { emoji: "🍜", text: "ラーメン" }], a: 0 },
    { s: "🗾✈️👤", d: "A: 旅行が 好きですか。\nB: はい。特に 京都が 好きです。", q: "Bさんは どこが 特に 好きですか。", o: [{ emoji: "⛩️", text: "京都" }, { emoji: "🗼", text: "東京" }, { emoji: "🏯", text: "大阪" }], a: 0 },
    { s: "🎌👩‍🎓", d: "A: 日本語を 勉強して どのくらいですか。\nB: 2年です。まだ まだです。", q: "Bさんは 日本語を どのくらい 勉強しましたか。", o: [{ emoji: "2️⃣", text: "2年" }, { emoji: "1️⃣", text: "1年" }, { emoji: "3️⃣", text: "3年" }], a: 0 },
    { s: "🐱🏠", d: "A: ペットを 飼って いますか。\nB: はい、猫を 2匹 飼っています。", q: "Bさんは 何を 飼って いますか。", o: [{ emoji: "🐱", text: "猫" }, { emoji: "🐕", text: "犬" }, { emoji: "🐰", text: "ウサギ" }], a: 0 },
    { s: "🏫📝", d: "A: テストは 難しかったですか。\nB: いいえ、とても 易しかったです。", q: "テストは どうでしたか。", o: [{ emoji: "😊", text: "易しかった" }, { emoji: "😫", text: "難しかった" }, { emoji: "🤔", text: "普通" }], a: 0 },
    { s: "🎵👩", d: "A: どんな 音楽が 好きですか。\nB: Jポップが 好きです。", q: "Bさんは どんな 音楽が 好きですか。", o: [{ emoji: "🎤", text: "Jポップ" }, { emoji: "🎸", text: "ロック" }, { emoji: "🎻", text: "クラシック" }], a: 0 },
    { s: "⚽👦", d: "A: 週末は 何を しますか。\nB: サッカーを します。", q: "Bさんは 週末 何を しますか。", o: [{ emoji: "⚽", text: "サッカー" }, { emoji: "🎬", text: "映画" }, { emoji: "📖", text: "読書" }], a: 0 },
    { s: "☕🚶", d: "A: 一緒に カフェに 行きませんか。\nB: すみません、今 忙しいです。\nA: そうですか。また 今度。", q: "Bさんは 今 どうですか。", o: [{ emoji: "😫", text: "忙しい" }, { emoji: "😊", text: "暇" }, { emoji: "😴", text: "眠い" }], a: 0 },
    { s: "🍚🍜", d: "A: 朝ごはんは 何を 食べましたか。\nB: ご飯と 味噌汁を 食べました。", q: "Bさんは 朝ごはんに 何を 食べましたか。", o: [{ emoji: "🍚", text: "ご飯と味噌汁" }, { emoji: "🍞", text: "パンと牛乳" }, { emoji: "🥣", text: "シリアル" }], a: 0 },
    { s: "🧳✈️", d: "A: 明日 日本に 帰ります。\nB: いいですね。お土産を 買ってください。", q: "Aさんは 明日 何を しますか。", o: [{ emoji: "✈️", text: "日本に帰る" }, { emoji: "🏪", text: "買い物" }, { emoji: "🏠", text: "家にいる" }], a: 0 },
    { s: "📺👀", d: "A: このドラマを 見て いますか。\nB: はい、毎週 見て います。\nA: 私も！", q: "二人は 何を 見て いますか。", o: [{ emoji: "📺", text: "ドラマ" }, { emoji: "🎬", text: "映画" }, { emoji: "📖", text: "本" }], a: 0 },
  ];

  for (const t of moreQ1) {
    if (items.length >= 350) break;
    items.push({ scene: t.s, audio: t.d, question: t.q, options: t.o, answerIndex: t.a });
  }

  // Fill remaining
  while (items.length < 350) {
    const idx = items.length % (Q1_TEMPLATES.length + Q3_TEMPLATES.length + moreQ1.length);
    if (idx < Q1_TEMPLATES.length) {
      const t = Q1_TEMPLATES[idx];
      items.push({ scene: t.scene, audio: t.dialogue, question: t.question, options: t.options, answerIndex: t.answerIndex });
    } else if (idx < Q1_TEMPLATES.length + Q3_TEMPLATES.length) {
      const t = Q3_TEMPLATES[idx - Q1_TEMPLATES.length];
      items.push({ scene: t.scene, audio: t.situation, question: t.situation, options: t.options, answerIndex: t.answerIndex, note: "適切な表現を選んでください。" });
    } else {
      const t = moreQ1[idx - Q1_TEMPLATES.length - Q3_TEMPLATES.length];
      items.push({ scene: t.s, audio: t.d, question: t.q, options: t.o, answerIndex: t.a });
    }
  }

  items.forEach((item) => { item.options = ensure4opts(item.options); });
  return shuffle(items).slice(0, 350);
}

let _cached: JLPTListeningData | null = null;

export function getListeningData(): JLPTListeningData {
  if (_cached) return _cached;
  _cached = { phrases: generatePhrases(), dialogues: generateDialogues() };
  return _cached;
}

export const LISTENING: JLPTListeningData = getListeningData();
