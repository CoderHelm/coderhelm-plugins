# Build a plugin with your coding agent

Paste the brief below into a coding agent (Claude Code, Cursor, Copilot,
Codex or another) opened in a copy of this repository. Fill in the four
lines at the top; the agent does the rest and tells you what to connect and
approve in CoderHelm.

The agent reads [AGENTS.md](AGENTS.md) for the rules. Most agents read it on
their own; the brief tells them to anyway.

## Before you start

```bash
git clone https://github.com/CoderHelm/coderhelm-plugins my-plugins
cd my-plugins
npm ci
```

Or click **Use this template** on GitHub to get your own copy, public or
private.

## The brief

```text
Build a CoderHelm plugin in this repository.

What it should do: <one or two sentences>
When it runs: <a person's brief | a schedule, such as "Mondays 9:00 UTC" | each new release tag>
What it may touch: <the services it reads, and anything it may change, such as "reads GitHub; may post to Slack">
Where results go: <drafts to review in CoderHelm | a channel, issue or service, after approval>

How to work:
1. Read AGENTS.md in full first. It is the source of truth for every field,
   trigger, tool and limit. Use nothing it doesn't list.
2. Pick the example under plugins/ closest to this request and copy it to
   plugins/<new-name>/ as your starting point. Say which one you picked.
3. If the request needs something CoderHelm doesn't support (for example a
   trigger other than manual, schedule or github.release), choose the
   closest supported way, and say what you chose and why in the plugin's
   README and in your report.
4. Ask me only what you can't answer from the repository or from the four
   lines above. Put anything a team would type (channels, repositories,
   accounts, style guides) in settings instead of asking me.
5. Start read only. Make every tool that changes something outside
   CoderHelm consequential, so it waits for a person's approval.
6. Write plugin.yaml, the agents, any skills, and README.md as AGENTS.md
   describes.
7. Run `node tools/validate-plugin.mjs plugins/<new-name>` and
   `npm run check`. Fix and run again until both pass. Don't change tools/,
   scripts/ or other plugins.
8. Finish with a short report: which example you started from, what the
   plugin does, its tools with their risks, the validator's last line, and
   what I must connect, fill in and approve in CoderHelm to use it.
```

## Example 1: a weekly summary of merged pull requests in Slack

```text
Build a CoderHelm plugin in this repository.

What it should do: Every week, summarize the pull requests merged in our repositories, grouped by repository, in plain words for people outside engineering.
When it runs: Mondays at 9:00 UTC, and when someone asks for it by hand.
What it may touch: reads GitHub; may post to one Slack channel.
Where results go: a Slack channel, only after someone approves the post.

How to work:
1. Read AGENTS.md in full first. It is the source of truth for every field,
   trigger, tool and limit. Use nothing it doesn't list.
2. Pick the example under plugins/ closest to this request and copy it to
   plugins/<new-name>/ as your starting point. Say which one you picked.
3. If the request needs something CoderHelm doesn't support (for example a
   trigger other than manual, schedule or github.release), choose the
   closest supported way, and say what you chose and why in the plugin's
   README and in your report.
4. Ask me only what you can't answer from the repository or from the four
   lines above. Put anything a team would type (channels, repositories,
   accounts, style guides) in settings instead of asking me.
5. Start read only. Make every tool that changes something outside
   CoderHelm consequential, so it waits for a person's approval.
6. Write plugin.yaml, the agents, any skills, and README.md as AGENTS.md
   describes.
7. Run `node tools/validate-plugin.mjs plugins/<new-name>` and
   `npm run check`. Fix and run again until both pass. Don't change tools/,
   scripts/ or other plugins.
8. Finish with a short report: which example you started from, what the
   plugin does, its tools with their risks, the validator's last line, and
   what I must connect, fill in and approve in CoderHelm to use it.
```

What to expect: a plugin with a `schedule` trigger (`"0 9 * * MON"`) and a
`manual` one, read-only tools from the GitHub MCP server, a `post_summary`
HTTP tool to Slack's `chat.postMessage` marked consequential, a `publish`
output through it, and settings for the repositories and the channel id.

## Example 2: a changelog entry for labeled pull requests

```text
Build a CoderHelm plugin in this repository.

What it should do: When a pull request is labeled "changelog", draft a changelog entry for it in our changelog's style.
When it runs: when a pull request gets the label.
What it may touch: reads GitHub only.
Where results go: drafts to review in CoderHelm.

How to work:
1. Read AGENTS.md in full first. It is the source of truth for every field,
   trigger, tool and limit. Use nothing it doesn't list.
2. Pick the example under plugins/ closest to this request and copy it to
   plugins/<new-name>/ as your starting point. Say which one you picked.
3. If the request needs something CoderHelm doesn't support (for example a
   trigger other than manual, schedule or github.release), choose the
   closest supported way, and say what you chose and why in the plugin's
   README and in your report.
4. Ask me only what you can't answer from the repository or from the four
   lines above. Put anything a team would type (channels, repositories,
   accounts, style guides) in settings instead of asking me.
5. Start read only. Make every tool that changes something outside
   CoderHelm consequential, so it waits for a person's approval.
6. Write plugin.yaml, the agents, any skills, and README.md as AGENTS.md
   describes.
7. Run `node tools/validate-plugin.mjs plugins/<new-name>` and
   `npm run check`. Fix and run again until both pass. Don't change tools/,
   scripts/ or other plugins.
8. Finish with a short report: which example you started from, what the
   plugin does, its tools with their risks, the validator's last line, and
   what I must connect, fill in and approve in CoderHelm to use it.
```

What to expect: CoderHelm has no label trigger, so the agent should say so
and pick a supported way, such as a daily `schedule` that searches for
pull requests merged with the label in the last 24 hours (a run has no
memory of earlier runs), plus a `manual` trigger for one pull request. The result is read only and saves `page`
drafts.

## After the agent is done

1. Read the plugin's README and `plugin.yaml`. Check every tool marked
   `consequential` is one you want to approve each time.
2. Push your repository and add it as a source on the **Plugins** page
   (see the [README](README.md#add-this-repository-as-a-source)).
3. Install the plugin, connect what its README lists, fill in its
   settings, and start it once with a brief on a test team.
