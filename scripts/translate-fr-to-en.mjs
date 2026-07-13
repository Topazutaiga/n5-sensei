import { readFileSync, writeFileSync } from "fs";

async function translate(text) {
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=fr&tl=en&dt=t&q=${encodeURIComponent(text)}`;
  const res = await fetch(url);
  const data = await res.json();
  return data[0].map((t) => t[0]).join("");
}

async function processFile(filePath) {
  console.log(`\nProcessing ${filePath}...`);
  let content = readFileSync(filePath, "utf8");
  const regex = /mean:\s*"([^"]+)"/g;
  const matches = [];
  let m;
  while ((m = regex.exec(content)) !== null) {
    matches.push(m[1]);
  }
  if (matches.length === 0) { console.log("  no meanings found"); return; }

  console.log(`  translating ${matches.length} items...`);
  const translations = [];
  for (let i = 0; i < matches.length; i++) {
    try {
      const en = await translate(matches[i]);
      translations.push(en);
    } catch (e) {
      console.log(`  error translating "${matches[i]}": ${e.message}`);
      translations.push(matches[i]);
    }
    if ((i + 1) % 20 === 0) console.log(`  ${i + 1}/${matches.length}`);
  }

  let idx = 0;
  content = content.replace(/mean:\s*"([^"]+)"/g, (match) => {
    const en = translations[idx++].replace(/"/g, '\\"');
    return `${match},\n    meanEn: "${en}"`;
  });
  writeFileSync(filePath, content);
  console.log(`  done - wrote ${idx} english translations`);
}

async function main() {
  const base = "C:\\Users\\managercommerce\\Desktop\\Workspace\\n5-sensei\\src\\data";
  await processFile(`${base}/vocabulary.ts`);
  await processFile(`${base}/kanji.ts`);
  await processFile(`${base}/grammar.ts`);
  console.log("\nAll done!");
}

main().catch(console.error);
