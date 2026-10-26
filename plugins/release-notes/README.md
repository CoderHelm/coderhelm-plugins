# release-notes

Drafts release notes from the pull requests a release merged: a release
body for engineers, a changelog entry for your readers, and a note listing
anything a reviewer should check. Everything stays a draft in CoderHelm
until a person approves it; the plugin changes nothing anywhere else.

## What it does

- **On a new release tag** (any tag on a repository with release notes
  turned on in CoderHelm), the `release-writer` agent finds the merged
  pull requests since the previous release, reads them, and saves three
  drafts: a `post` (the release body), a `page` (the changelog entry) and
  a `note` (what to check before it goes out).
- **From a brief**, a person names the repository and the tags, and picks
  who the notes are for.

Each line comes from a pull request the agent read. Pull requests with a
label in `hidden_labels` are left out, and so are ones that only touch
tests, CI or formatting.

## What it needs

| Need | Where | Required |
| --- | --- | --- |
| GitHub's MCP server | Connections page: add a server by address, `https://api.githubcopilot.com/mcp/`, named **GitHub MCP** so its id is `github-mcp` | Yes |
| Release notes turned on | The repository's settings in CoderHelm | For the release trigger only |

Sign in to the GitHub MCP server with an account that can read the
repositories. If your server ends up with another id, change `ref:` in your
copy of `plugin.yaml`.

## Settings

| Key | Type | What to enter |
| --- | --- | --- |
| `audience` | string | Who reads your notes, in a sentence |
| `product_name` | string | The product's name as the notes spell it |
| `hidden_labels` | string | Labels to leave out, comma separated |

## What it can and can't do

| Tool | Risk | Runs |
| --- | --- | --- |
| `github-mcp__get_*`, `list_*`, `search_*` | read | Whenever the agent needs it |
| `save_draft` | write (in CoderHelm only) | Always |

It can't create or edit releases, tags, issues or files. To publish the
approved text, a person pastes it into the release or the changelog. To
let the plugin publish by itself after approval, add a consequential tool
and a `publish` output in your copy (see the `incident-summary` plugin for
the pattern); that change waits for an admin.

## Cost

`budget.monthly_tokens` is 1,000,000. A release with 20 merged pull
requests reads about 20 descriptions and writes three drafts. Releases
with hundreds of pull requests hit the run's 40 tool calls; the agent then
writes from what it read and says so in the note.

## Install

1. On the **Plugins** page, add `https://github.com/CoderHelm/coderhelm-plugins`
   as a source, or your own copy.
2. Install **release-notes**.
3. Add the GitHub MCP server on the **Connections** page and fill in the
   settings.
4. Try it with **Write a brief** on two existing tags, and read the drafts
   in **Review**.
