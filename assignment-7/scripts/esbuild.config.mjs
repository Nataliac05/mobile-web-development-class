// Shared esbuild options. React, ReactDOM and Tuna are loaded from lib/ as globals,
// so the bundle only contains the application's own code.

export const baseOptions = {
    entryPoints: ["src/main.jsx"],
    bundle: true,
    format: "iife",
    target: ["es2020"],
    jsx: "transform",
    jsxFactory: "React.createElement",
    jsxFragment: "React.Fragment",
    loader: { ".js": "jsx" },
    logLevel: "info",
};
