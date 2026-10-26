---
name: doc-impact
description: Which code changes need a docs update, and how to write the proposal. Read before checking any pull request.
---
# Doc impact

## Needs a docs change

- A new, renamed or removed option, flag, setting, environment variable,
  command, endpoint, field or screen.
- A changed default, limit, error message a reader might search for, or
  permission.
- A change in what a step does, or in its order.
- Anything the pull request calls breaking.

## Usually doesn't

- Refactors, renames inside the code, tests, CI, formatting.
- Performance work, unless it changes a documented limit.
- Fixes that make the code do what the docs already say.

## Writing the proposal

- Propose the smallest change that makes the page true: the section, not
  the whole page.
- Keep the page's headings, tone and terms.
- Quote option names, values and commands exactly as the diff shows them.
- If you can't tell what the new behavior is from the diff and the
  description, don't guess: list it in the note as "needs an author's
  answer", with the question.
