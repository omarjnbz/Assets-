/* Add or update a component.
   npm run add -- <name> <file-or-folder>... [--title "T"] [--desc "D"] [--tags a,b] [--source "S"]
   npm run add -- <name> --paste <filename>      writes your clipboard into items/<name>/<filename>
   Any language: the files you give it are the component. Then it rebuilds index.html. */
const fs = require("fs"), path = require("path"), cp = require("child_process");
const [name, ...rest] = process.argv.slice(2);
if (!name) { console.log(fs.readFileSync(__filename, "utf8").split("*/")[0].replace("/*", "")); process.exit(0); }
const dir = path.join(__dirname, "items", name); fs.mkdirSync(dir, { recursive: true });
const opt = {}, paths = [];
for (let i = 0; i < rest.length; i++) rest[i].startsWith("--") ? (opt[rest[i].slice(2)] = rest[++i]) : paths.push(rest[i]);
for (const p of paths) {
  if (fs.statSync(p).isDirectory()) fs.cpSync(p, dir, { recursive: true, filter: s => !/node_modules|\.git(\/|$)/.test(s) });
  else fs.copyFileSync(p, path.join(dir, path.basename(p)));
}
if (opt.paste) fs.writeFileSync(path.join(dir, opt.paste), cp.execSync("pbpaste").toString());
const mp = path.join(dir, "meta.json"), m = fs.existsSync(mp) ? JSON.parse(fs.readFileSync(mp, "utf8")) : { added: new Date().toISOString().slice(0, 10) };
if (opt.title) m.title = opt.title; if (opt.desc) m.description = opt.desc; if (opt.source) m.source = opt.source; if (opt.tags) m.tags = opt.tags.split(",").map(s => s.trim());
fs.writeFileSync(mp, JSON.stringify(m, null, 2));
console.log("saved items/" + name); cp.execSync("node build.js", { stdio: "inherit", cwd: __dirname });
