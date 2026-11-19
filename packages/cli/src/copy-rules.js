/**
 * Recanica copy rules: AI jargon, filler, clichés and placeholder text.
 * One list, used by the repo copy lint (scripts/copy-lint.mjs), `recanica check` (source files)
 * and `recanica audit` / the docs audit (text actually rendered on the page).
 * Reasoning: docs/COPY_AUDIT.md. Each rule: [pattern, message, level].
 */
export const COPY_RULES = [
  [/\bseamless(ly)?\b/i, "“seamless”: say what actually happens", "error"],
  [/\bunlock(s|ing)?\b/i, "“unlock”: name the concrete benefit", "error"],
  [/\belevate(s|d)?\b/i, "“elevate”: vague; say what improves", "error"],
  [/\bleverag(e|es|ing)\b/i, "“leverage”: use “use”", "error"],
  [/\bempower(s|ing)?\b/i, "“empower”: say what people can do", "error"],
  [/\beffortless(ly)?\b/i, "“effortless”: claims, not facts", "error"],
  [/\bcutting[- ]edge\b|\bstate[- ]of[- ]the[- ]art\b|\bbest[- ]in[- ]class\b|\bworld[- ]class\b|\bnext[- ]level\b/i, "superlative filler", "error"],
  [/\bgame[- ]chang/i, "“game-changer”: filler", "error"],
  [/\brevolutioni[sz]/i, "“revolutionize”: filler", "error"],
  [/\bsupercharg/i, "“supercharge”: filler", "error"],
  [/\bstreamlin(e|ed|es|ing)\b/i, "“streamline”: say what gets faster or shorter", "error"],
  [/\bdelve\b|\btapestry\b|\bembark\b|\bsynerg/i, "LLM tell-tale word", "error"],
  [/\bin today'?s (fast[- ]paced|digital|ever)/i, "“in today's … world” opener", "error"],
  [/\bever[- ]evolving\b|\bdigital landscape\b/i, "cliché", "error"],
  [/\bwhether you'?re\b/i, "“whether you're X or Y”: pick the actual audience", "error"],
  [/\b(it'?s )?not just (a|an|another)\b/i, "“not just X, it's Y” construction", "error"],
  [/\bsay goodbye to\b|\blook no further\b|\bat your fingertips\b|\btake .{1,20} to the next level\b/i, "ad cliché", "error"],
  [/\blorem ipsum\b|\breplace this with\b|\byour (value proposition|tagline) here\b/i, "placeholder copy left in", "error"],
  [/\bbuilt for the way you\b|\bon autopilot\b|\bexplains itself\b|\bevery (number|detail) that matters\b/i, "cliché found in the 2026-11 audit", "error"],
  [/\bin (minutes|seconds|days), not (hours|days|weeks|months)\b/i, "“in X, not Y” rhythm: state the fact once", "error"],
  [/\bactually wants?\b|\bthat never happens\b/i, "filler intensifier", "error"],
  [/\brobust\b/i, "“robust”: say what it survives", "warn"],
  [/\binnovative\b|\bunparalleled\b|\bholistic\b/i, "self-praise", "warn"],
  [/\bAI[- ]powered\b|\bmagic(al)?\b/i, "hype; describe the result", "warn"],
  [/\bboost\b|\bskyrocket\b/i, "growth-hack verb; give a number", "warn"],
  [/\bjourney\b/i, "“journey”: usually filler", "warn"],
  [/ — .* — /, "two em dashes in one line: tell-tale rhythm; split the sentence", "warn"],
];

/** Serializable form for passing into a browser page. */
export const COPY_RULES_SOURCE = COPY_RULES.map(([re, msg, level]) => [re.source, re.flags, msg, level]);
