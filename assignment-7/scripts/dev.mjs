// Development server with live rebuilds at http://localhost:8000.
// Pass --deploy to serve the production build in deploy/ instead.

import * as esbuild from "esbuild";
import { baseOptions } from "./esbuild.config.mjs";

const port = Number(process.env.PORT) || 8000;

if (process.argv.includes("--deploy")) {
    const context = await esbuild.context({ entryPoints: [], write: false });
    await context.serve({ servedir: "deploy", port });
    console.log(`Serving deploy/ at http://localhost:${port}`);
} else {
    const context = await esbuild.context({
        ...baseOptions,
        outdir: "dev",
        sourcemap: true,
    });
    await context.watch();
    await context.serve({ servedir: ".", port });
    console.log(`Dev server at http://localhost:${port}`);
}
