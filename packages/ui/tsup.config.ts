import { defineConfig } from "tsup";

// One output file per component (no bundling) so "use client" stays at the top of each module
// and consumers only ship what they import. Self-references (@rekanica/ui/...) stay external.
export default defineConfig({
  entry: ["src/components/*.tsx", "src/lib/*.ts", "src/hooks/*.ts"],
  outDir: "dist",
  format: ["esm"],
  dts: false, // declarations come from tsc (tsconfig.build.json)
  bundle: false,
  sourcemap: false,
  clean: true,
  target: "es2022",
  jsx: "automatic",
});
