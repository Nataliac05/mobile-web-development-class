import * as esbuild from "esbuild";

export async function minify(css) {
    const result = await esbuild.transform(css, { loader: "css", minify: true, legalComments: "none" });
    return result.code;
}
