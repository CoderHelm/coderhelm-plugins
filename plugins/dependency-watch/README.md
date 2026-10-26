# dependency-watch

Every Monday, checks your repositories for vulnerable and outdated
dependencies and drafts one grouped issue. The issue is opened only after a
person approves its exact title and text; the plugin changes nothing else.

## What it does

- **Mondays at 13:00 UTC**, the `dependency-checker` agent goes through
  every repository in the `repos` setting: open Dependabot alerts, Snyk
  issues when Snyk is connected, and direct dependencies that are a major
  version or more than a year behind.
- It saves a `report` draft with everything it found, ranked by the
  `upgrade-triage` skill.
- When something needs action, it asks to open **one** grouped issue in
  `issue_repo`. That request waits in **Review** as an action; the issue
  opens only after a person approves it.
- **From a brief**, a person checks one repository now, security only or
  security and outdated.

It drafts the issue rather than a pull request: changing lockfiles needs a
package manager run, and plugins never run code. Assign the approved issue
to CoderHelm's coding agent if you want the upgrade done as a pull request.

## What it needs

| Need | Where | Required |
| --- | --- | --- |
| GitHub's MCP server | Connections page: add a server by address, `https://api.githubcopilot.com/mcp/`, named **GitHub MCP** so its id is `github-mcp`; sign in with an account that can read Dependabot alerts | Yes |
| Snyk | Connections page, Snyk card, a read-only token | No |

If your GitHub MCP server's tool for opening issues has another name (newer
versions call it `issue_write`), change the `allow` entry in your copy.

## Settings

| Key | Type | What to enter |
| --- | --- | --- |
| `repos` | string | The repositories to check, `owner/name`, comma separated |
| `issue_repo` | string | Where the grouped issue is opened, `owner/name` |
| `ignore` | string | Packages to leave out, with a reason each |

## What it can and can't do

| Tool | Risk | Runs |
| --- | --- | --- |
| `github-mcp__get_*`, `list_*`, `search_*` | read | Whenever the agent needs it |
| `snyk__list_*`, `get_*` | read | Whenever the agent needs it |
| `github-mcp__create_issue` | consequential | Only after a person approves the exact title and text |

It can't change files, open pull requests, dismiss alerts or comment.

## Cost

`budget.monthly_tokens` is 1,500,000, about four weekly runs over a few
repositories plus some briefs. Each run has 40 tool calls; with many
repositories, split them across two copies of the plugin or check fewer
each week.

## Install

1. On the **Plugins** page, add `https://github.com/CoderHelm/coderhelm-plugins`
   as a source, or your own copy.
2. Install **dependency-watch**.
3. Add the GitHub MCP server (and Snyk, if you use it) on the
   **Connections** page, fill in the settings, and list who approves under
   **Who approves what goes out**.
4. Try it with a brief on one repository and read the report in **Review**.
