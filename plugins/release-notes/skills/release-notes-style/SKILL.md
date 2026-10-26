---
name: release-notes-style
description: How release notes read, what to leave out, and how to word breaking changes. Read before writing any notes.
---
# Release notes style

- Lead each line with what changed for the reader, not with what the code
  did. "Exports now include archived projects", not "Refactor export query".
- Plain words and short sentences. No marketing claims, no exclamation
  marks, no emoji.
- One change per line. Merge pull requests that make one change together.
- Name the product as the `product_name` setting spells it.
- Never name customers, companies or people, even when a pull request does.
- Never copy secrets, internal hostnames, ticket numbers from private
  trackers or stack traces into notes.

## Breaking changes

Put them first, under "Breaking changes", each with what a reader must do:

> Breaking: `GET /v1/items` now returns 50 items per page instead of 100.
> Pass `limit=100` to keep the old size.

## When unsure

If a pull request's description doesn't say what changed for users, leave
it out of the post and the page, and list it in the note for a reviewer.
