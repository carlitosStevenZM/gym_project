# Git workflow

How a change gets into `main`. Applies to the whole repo, both apps included.

## The rules

1. **Nothing is committed straight to `main`.** Every change goes through a branch and a pull request.
2. **Every PR needs at least one approval.** There are two of us, so it is always the other one.
3. **One PR may touch both apps.** If a feature needs the backend and the client, it ships together:
   what breaks is the contract between them, and that is better reviewed in one place than in two.
4. **Merge commits.** No squash, no rebase onto `main`. Conflicts are resolved in the merge, and the
   history keeps the shape the work actually had.
5. **Docs ship in the same PR as the code they describe.** The rule is in `AGENTS.md`; this is where
   it gets enforced, because the review is the only place anyone will notice.

## Branch names

`<type>/<short-description>`, lowercase, words joined by dashes. The type is the same vocabulary as
the commits below.

```
feat/routine-editor
fix/session-duplicate-date
docs/git-workflow
```

## Commit messages

**Conventional Commits**, with the app as the scope:

```
<type>(<scope>): <what changed, imperative, lowercase>
```

**Types:** `feat`, `fix`, `docs`, `refactor`, `test`, `chore`, `build`, `ci`, `perf`, `revert`.

**Scopes:** `mobile`, `backend`, `requirements`, and `repo` for the root (`AGENTS.md`, `README.md`,
`docs/`). A commit that genuinely touches both apps uses `mobile,backend`.

```
feat(mobile): add the routine editor screen
fix(backend): reject two sessions on the same date
docs(requirements): close D40 and bump the SRS to v1.8
chore(repo): add the git workflow
```

The body is optional and explains **why**. The diff already says what.

Why this convention and not another: it is the one you will meet outside this repo, so it is worth
learning once, and in a monorepo the scope does real work. It tells you which app a commit touched
without opening the diff, which is exactly what you lose when two apps share a history.

## Co-authoring with a model

**Allowed, not required.** If a model did a meaningful part of the work, credit it with a trailer at
the end of the message, after a blank line:

```
Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
```

GitHub reads that trailer and shows both authors on the commit. Claude Code adds it on its own when
it writes the commit. Nobody has to use it, and nobody has to explain not using it.

## The conflict you will actually hit

The two apps live in different folders, so you will rarely collide in code. You will collide in the
shared files, and above all in **SRS §4 and its changelog in §13**: two open PRs that each record a
decision will both write `D41`, on the same line, and git cannot help you there.

The rule: **the number is taken when the PR merges, not when it is opened.** Whoever merges second
renumbers their own row and their changelog line. It is a thirty second fix when you expect it and a
confusing one when you don't.

The same thing happens, more mildly, in `AGENTS.md` and the root `README.md`. Keep those edits in
their own small PR when you can, instead of riding along with a feature.

## Not here yet

No `CODEOWNERS`. With two people the approval is always the other one, so a file that routes reviews
has nothing to route. It earns its place when a third person does.
