const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const textsDir =
  process.env.TEXTS_DIR || "D:/Descargas/The Complete Book of Enoch, Standard English Version - Jay Winter/text";
const outPath = path.join(root, "src", "pages.json");

if (!fs.existsSync(textsDir)) {
  console.error(`No existe el directorio de textos: ${textsDir}`);
  console.error("Define TEXTS_DIR con la ruta a la carpeta texts del PDF.");
  process.exit(1);
}

function fixMojibake(s) {
  return (
    s
      .replace(/â€œ/g, "\u201c")
      .replace(/â€\x9d/g, "\u201d")
      .replace(/â€˜/g, "\u2018")
      .replace(/â€™/g, "\u2019")
      .replace(/â€”/g, "\u2014")
      .replace(/â€“/g, "\u2013")
      .replace(/Ã¢â‚¬â„¢/g, "\u2019")
      .replace(/Ã¢â‚¬Å“|Ã¢â‚¬Å"/g, '"')
      .replace(/Ã¢â‚¬â€/g, "\u2014")
      .replace(/[\uFFFD\u0092\u0093\u0094\u0091\u0096\u0097]/g, "'")
      .replace(/\u0092/g, "'")
      .trim()
  );
}

const files = fs
  .readdirSync(textsDir)
  .filter((f) => /^page_\d+\.txt$/.test(f))
  .sort();

const pages = files.map((f) => {
  const num = parseInt(f.match(/(\d+)/)[1], 10);
  let text = fs.readFileSync(path.join(textsDir, f), "utf8");
  text = fixMojibake(text);
  return { page: num, text };
});

fs.writeFileSync(outPath, JSON.stringify(pages, null, 2), "utf8");
console.log(`Wrote ${pages.length} pages to ${outPath}`);
