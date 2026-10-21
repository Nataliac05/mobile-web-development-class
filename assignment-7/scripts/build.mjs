// Production build: compiles and minifies the app into deploy/, ready for Firebase Hosting.

import * as esbuild from "esbuild";
import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { minify as minifyCss } from "./minify.mjs";
import { baseOptions } from "./esbuild.config.mjs";

const OUT = "deploy";

function buildStamp(date) {
    const month = date.toLocaleString("en-US", { month: "short" });
    const time = date.toTimeString().slice(0, 5);
    return `${month} ${date.getDate()} ${date.getFullYear()} ${time}`;
}

await rm(OUT, { recursive: true, force: true });
await mkdir(OUT, { recursive: true });

// 1. Compile and minify the application code and styles.
await esbuild.build({
    ...baseOptions,
    outdir: OUT,
    entryNames: "app.min",
    minify: true,
    sourcemap: false,
    legalComments: "none",
    define: { "process.env.NODE_ENV": '"production"' },
});

// 2. Copy the libraries, minifying Daisy UI's stylesheet along the way.
await mkdir(`${OUT}/lib`, { recursive: true });
for (const file of ["react.production.min.js", "react-dom.production.min.js", "tuna-min.js"]) {
    await cp(`lib/${file}`, `${OUT}/lib/${file}`);
}
await writeFile(`${OUT}/lib/daisyui.min.css`, await minifyCss(await readFile("lib/daisyui.css", "utf8")));

// 3. Copy media and data, stamping the build into settings.json.
await cp("assets", `${OUT}/assets`, { recursive: true, filter: (src) => !src.endsWith(".gitkeep") });
await cp("data", `${OUT}/data`, { recursive: true });

const settings = JSON.parse(await readFile("data/settings.json", "utf8"));
settings.general.buildMode = "release";
settings.general.appVersion = `${settings.general.appVersion.split(" ")[0]} (${buildStamp(new Date())})`;
await writeFile(`${OUT}/data/settings.json`, JSON.stringify(settings));

for (const file of ["textEnglish.json", "textSpanish.json"]) {
    const json = JSON.parse(await readFile(`data/${file}`, "utf8"));
    await writeFile(`${OUT}/data/${file}`, JSON.stringify(json));
}

// 4. Point index.html at the minified files.
const html = (await readFile("index.html", "utf8"))
    .replace("lib/daisyui.css", "lib/daisyui.min.css")
    .replace("dev/main.css", "app.min.css")
    .replace("dev/main.js", "app.min.js")
    .replace(/>\s+</g, "><")
    .trim();
await writeFile(`${OUT}/index.html`, html + "\n");

console.log(`\nProduction build written to ${OUT}/`);
