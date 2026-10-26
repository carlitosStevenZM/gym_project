<!--
  Copy this file to its area folder and fill it in.
  The rules and the reasoning behind each section: documentation-standard.md
  Delete every <!-- ... --> comment, including this one, when you are done.
-->

# <Thing named in present tense>   <!-- e.g. "Deep links", not "Deep link migration plan" -->

Status: Current                    <!-- Current | Deprecated -->
Last verified: YYYY-MM-DD against <branch@commit>
Source of truth: `path/to/file.tsx:120` · `path/to/other.ts:44`   <!-- the code, plus any env or backend rule that decides the behaviour -->

## Purpose
<!-- One or two lines: what this covers and why it matters. -->

## How it works today
<!-- The meat. Present tense, current behaviour ONLY. Describe the mechanism as it IS.
     Cite code as `path:line`. Add a diagram only if it shows the real mechanism. -->

## Key files
- `path/to/file.tsx` — <role>
- `path/to/hook.ts` — <role>

## Gotchas and edge cases
- <non-obvious behaviour, Android and iOS differences, known traps>

## Design constraints
<!-- OPTIONAL. Only for a deliberate, non-obvious decision that has to be preserved: a current
     behaviour that is intentional and whose removal would cause a regression. One line each:
     "We do X because otherwise Y." Delete this heading if there are none. -->

## Known caveats
<!-- OPTIONAL. Only if you noticed something that looks wrong or risky while documenting.
     One line each. Do NOT fix it here, just record it. Delete this heading if empty. -->

## Related
- <links to sibling docs, and to the SRS decision or requirement this implements>
