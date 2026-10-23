/* Reads every folder in items/, bundles demos into previews, and writes ONE file: index.html.
   Nothing to configure: a folder is a component, its files are the code. */
const fs = require("fs"), path = require("path"), esbuild = require("esbuild");
const root = __dirname, itemsDir = path.join(root, "items");
const KINDS = { tsx: "React", jsx: "React", vue: "Vue", svelte: "Svelte", html: "HTML", css: "CSS", ts: "TypeScript", js: "JavaScript" };
const CODE = /\.(tsx|jsx|ts|js|mjs|vue|svelte|html|css|scss|json|md)$/;
const SKIP = new Set(["meta.json", "README.md"]);

const alias = {
  name: "alias",
  setup(b) {
    b.onResolve({ filter: /^@\/components\/ui\// }, a => { const s = a.path.split("/").pop(); const own = path.join(itemsDir, s, s + ".tsx"); if (fs.existsSync(own)) return { path: own }; const d = fs.readdirSync(itemsDir).find(x => fs.existsSync(path.join(itemsDir, x, s + ".tsx"))); return { path: path.join(itemsDir, d || s, s + ".tsx") }; });
    b.onResolve({ filter: /^@\/lib\/utils$/ }, () => ({ path: path.join(root, "shared", "utils.ts") }));
  },
};

const TW = '<script src="https://cdn.tailwindcss.com"><\/script><script>tailwind.config={darkMode:"class",theme:{extend:{colors:{' +
  ["border","input","ring","background","foreground"].map(k => k + ':"hsl(var(--' + k + '))"').join(",") + "," +
  ["primary","secondary","muted","accent","card","popover","destructive"].map(k => k + ':{DEFAULT:"hsl(var(--' + k + '))",foreground:"hsl(var(--' + k + '-foreground))"}').join(",") +
  '},borderRadius:{lg:"var(--radius)",md:"calc(var(--radius) - 2px)",sm:"calc(var(--radius) - 4px)"}}}}<\/script>';

(async () => {
  const out = [];
  for (const slug of fs.readdirSync(itemsDir).filter(d => fs.statSync(path.join(itemsDir, d)).isDirectory()).sort()) {
    const dir = path.join(itemsDir, slug);
    const mp = path.join(dir, "meta.json");
    const meta = fs.existsSync(mp) ? JSON.parse(fs.readFileSync(mp, "utf8")) : {};
    const names = fs.readdirSync(dir).filter(f => CODE.test(f) && !SKIP.has(f));
    names.sort((a, b) => (a === "demo.tsx") - (b === "demo.tsx") || a.localeCompare(b));
    const files = names.map(n => ({ name: n, text: fs.readFileSync(path.join(dir, n), "utf8") }));
    const all = files.map(f => f.text).join("\n");
    const ext = e => files.some(f => f.name.endsWith("." + e));
    const kind = meta.kind || (ext("vue") ? "Vue" : ext("svelte") ? "Svelte" : ext("tsx") || ext("jsx") ? "React" : ext("html") ? "HTML" : ext("css") ? "CSS" : ext("ts") ? "TypeScript" : "JavaScript");
    const deps = [...new Set([...all.matchAll(/(?:from|import)\s*["']([^"'./@][^"']*|@[^"'/]+\/[^"']+)["']/g)].map(m => m[1].startsWith("@") ? m[1].split("/").slice(0, 2).join("/") : m[1].split("/")[0]))]
      .filter(d => !d.startsWith("@/")).sort();
    const tailwind = /className=["'`{][^>]*\b(flex|absolute|relative|grid|w-\[|h-\[|bg-[a-z]|text-[a-z0-9]|p[xy]?-\d|m[xy]?-\d|rounded|inset-)/.test(all);
    const notes = fs.existsSync(path.join(dir, "README.md")) ? fs.readFileSync(path.join(dir, "README.md"), "utf8") : "";

    let preview = null;
    if (meta.preview !== false) {
      if (files.some(f => f.name === "demo.tsx")) {
        const entry = `import React from "react";import {createRoot} from "react-dom/client";import Demo from ${JSON.stringify(path.join(dir, "demo.tsx"))};createRoot(document.getElementById("root")).render(<Demo/>);`;
        try {
          const r = await esbuild.build({ stdin: { contents: entry, resolveDir: root, loader: "tsx" }, bundle: true, write: false, minify: true, format: "iife", jsx: "automatic",
            plugins: [alias], nodePaths: [path.join(root, "node_modules")], define: { "process.env.NODE_ENV": '"production"' }, logLevel: "silent" });
          const js = r.outputFiles[0].text.replace(/<\/script/gi, "<\\/script");
          preview = `<!doctype html><html class="dark"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">${tailwind ? TW : ""}<style>:root{--background:0 0% 4%;--foreground:0 0% 96%;--card:0 0% 7%;--card-foreground:0 0% 96%;--popover:0 0% 7%;--popover-foreground:0 0% 96%;--primary:0 0% 96%;--primary-foreground:0 0% 9%;--secondary:0 0% 15%;--secondary-foreground:0 0% 96%;--muted:0 0% 15%;--muted-foreground:0 0% 64%;--accent:0 0% 15%;--accent-foreground:0 0% 96%;--destructive:0 63% 45%;--destructive-foreground:0 0% 98%;--border:0 0% 18%;--input:0 0% 18%;--ring:0 0% 60%;--radius:.5rem}html,body{margin:0;background:hsl(var(--background));color:hsl(var(--foreground));font-family:ui-sans-serif,system-ui,sans-serif}*{border-color:hsl(var(--border))}</style></head><body><div id="root"></div><script>${js}<\/script></body></html>`;
        } catch (e) { console.warn("  no preview for " + slug + ": " + String(e.message).split("\n")[0]); }
      } else if (kind === "HTML") {
        const h = files.find(f => f.name.endsWith(".html")); if (h) preview = h.text;
      }
    }
    out.push({ slug, title: meta.title || slug.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase()), kind, source: meta.source || "", description: meta.description || "",
      tags: meta.tags || [], added: meta.added || "", deps, tailwind, notes, files, preview });
  }
  out.sort((a, b) => (b.added || "").localeCompare(a.added || "") || a.title.localeCompare(b.title));
  const json = JSON.stringify(out).replace(/</g, "\\u003c").replace(/[\u2028\u2029]/g, c => "\\u" + c.charCodeAt(0).toString(16));
  const lp = path.join(root, "links.json");
  const linkList = fs.existsSync(lp) ? JSON.parse(fs.readFileSync(lp, "utf8")) : [];
  const linksJson = JSON.stringify(linkList).replace(/</g, "\\u003c");
  fs.writeFileSync(path.join(root, "index.html"), fs.readFileSync(path.join(root, "ui.html"), "utf8").replace("__DATA__", () => json).replace("__LINKS__", () => linksJson));
  console.log(`index.html: ${out.length} components, ${linkList.length} links, ${(fs.statSync(path.join(root, "index.html")).size / 1048576).toFixed(1)} MB`);
})();
