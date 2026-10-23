/* Save links (sites with assets, components, inspiration). They show in the "Links" tab of index.html.
   npm run link -- <url> [<url>...] [--note "why"] [--cat "Category"] [--title "Name"]
   npm run link -- --paste              reads every URL from the clipboard (whole lists work, "url - note" lines too)
   npm run link -- --file list.txt      same, from a text file
   Re-adding a URL updates it instead of duplicating. Edit links.json by hand to re-categorise. */
const fs = require("fs"), path = require("path"), cp = require("child_process");
const file = path.join(__dirname, "links.json");
const links = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, "utf8")) : [];
const args = process.argv.slice(2), opt = {}, urls = [];
for (let i = 0; i < args.length; i++) args[i].startsWith("--") ? (opt[args[i].slice(2)] = (args[i + 1] && !args[i + 1].startsWith("--")) ? args[++i] : true) : urls.push(args[i]);
if (!args.length) { console.log(fs.readFileSync(__filename, "utf8").split("*/")[0].replace("/*", "")); process.exit(0); }

const norm = u => { u = u.trim().replace(/[)>.,;]+$/, ""); if (!/^https?:\/\//i.test(u)) u = "https://" + u; try { const x = new URL(u); x.protocol = "https:"; return x.href.replace(/\/$/, ""); } catch { return null; } };
const key = u => u.replace(/^https?:\/\/(www\.)?/, "").toLowerCase();
const title = u => { const x = new URL(u); return x.hostname.replace(/^www\./, "") + x.pathname.replace(/\/$/, ""); };

let items = urls.map(u => ({ url: norm(u) })).filter(x => x.url);
const text = opt.paste ? cp.execSync("pbpaste").toString() : opt.file ? fs.readFileSync(opt.file, "utf8") : "";
for (const line of text.split("\n")) {
  const m = line.match(/(https?:\/\/[^\s]+|(?:[a-z0-9-]+\.)+[a-z]{2,}(?:\/[^\s]*)?)\s*(?:[—–:-]+\s*(.+))?$/i);
  if (m && norm(m[1])) items.push({ url: norm(m[1]), note: (m[2] || "").trim() });
}
if (!items.length) { console.log("No URLs found."); process.exit(1); }
let added = 0, updated = 0;
for (const it of items) {
  const found = links.find(l => key(l.url) === key(it.url));
  const note = opt.note || it.note || "", cat = opt.cat || "", ttl = opt.title || "";
  if (found) { if (note) found.note = note; if (cat) found.cat = cat; if (ttl) found.title = ttl; updated++; }
  else { links.push({ url: it.url, title: ttl || title(it.url), note, cat: cat || "Unsorted", added: new Date().toISOString().slice(0, 10) }); added++; }
}
fs.writeFileSync(file, JSON.stringify(links, null, 2));
console.log(`links.json: ${added} added, ${updated} updated, ${links.length} total`);
cp.execSync("node build.js", { stdio: "inherit", cwd: __dirname });
