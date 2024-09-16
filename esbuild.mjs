import * as esbuild from "esbuild";

import { Flags, Parser } from "@oclif/core";

import { copy } from "esbuild-plugin-copy";

const { flags } = await Parser.parse(process.argv.slice(2), {
  flags: {
    watch: Flags.boolean({ name: "watch", default: false }),
  },
});

const copyAssets = copy({
  assets: [
    { from: "src/_routes.json", to: "." },
    { from: "static/**", to: "." },
  ],
  watch: flags.watch,
});

let ctx = await esbuild.context({
  color: true,
  entryPoints: ["src/index.ts"],
  bundle: true,
  format: "esm",
  logLevel: "info",
  outfile: "_dist/_worker.js",
  plugins: [copyAssets],
  sourcemap: "external",
});

if (flags.watch) {
  await ctx.watch();

  const { promise, resolve } = Promise.withResolvers();
  process.on("SIGINT", () => {
    console.log("Exiting...");
    resolve();
  });
  console.log("Press Ctrl+C to exit...");
  await promise;
} else {
  await ctx.rebuild();
}

await ctx.dispose();
