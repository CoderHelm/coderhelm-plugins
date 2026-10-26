# docs-sync

After each release, finds the merged pull requests that changed behavior
and drafts the documentation updates they need. Every proposal is a draft
in CoderHelm for a person to review; the plugin changes nothing anywhere
else.

## What it does

- **On a new release tag**, the `docs-checker` agent lists the pull
  requests the release merged, keeps the ones that change behavior a
  reader would notice (the `doc-impact` skill), finds the docs pages that
  mention what changed, and saves a `page` draft with the new text for
  each page that is now wrong, plus one `note` saying what it decided for
  every pull request.
- **From a brief**, a person names a repository and some pull requests to
  check now.

CoderHelm plugins start from a brief, a schedule or a release; there is no
"pull request merged" trigger today. A release covers every pull request
it merged; use a brief for one pull request right after it merges.

## What it needs

| Need | Where | Required |
| --- | --- | --- |
| GitHub's MCP server | Connections page: add a server by address, `https://api.githubcopilot.com/mcp/`, named **GitHub MCP** so its id is `github-mcp`; sign in with an account that can read the code and docs repositories | Yes |
| Release notes turned on | The repository's settings in CoderHelm | For the release trigger only |

## Settings

| Key | Type | What to enter |
| --- | --- | --- |
| `docs_repo` | string | The docs repository, `owner/name`; empty when docs live next to the code |
| `docs_paths` | string | Where docs live, comma separated (`docs/, README.md`) |
| `style_guide` | string | A link to your docs style guide, or a few sentences |

## What it can and can't do

| Tool | Risk | Runs |
| --- | --- | --- |
| `github-mcp__get_*`, `list_*`, `search_*` | read | Whenever the agent needs it |
| `save_draft` | write (in CoderHelm only) | Always |

It can't edit files, open pull requests or comment. A person applies an
approved proposal, or hands it to CoderHelm's coding agent as a task.

## Cost

`budget.monthly_tokens` is 1,000,000. A release run reads each merged pull
request's description and changed files, then the docs pages it touches;
large releases hit the run's 40 tool calls, and the note says which pull
requests were not checked.

## Install

1. On the **Plugins** page, add `https://github.com/CoderHelm/coderhelm-plugins`
   as a source, or your own copy.
2. Install **docs-sync**.
3. Add the GitHub MCP server on the **Connections** page and fill in the
   settings.
4. Try it with a brief on a pull request that changed an option, and read
   the drafts in **Review**.
