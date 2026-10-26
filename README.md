# CoderHelm plugins

Example plugins for [CoderHelm](https://coderhelm.com). Add this repository
as a plugin source to install them as they are, or copy one into your own
repository and make it yours.

A **plugin** lets CoderHelm do work for any team, not only engineering. It
is a folder with a small manifest, `plugin.yaml`, plus Markdown skills and
agents. The manifest says which tools the plugin may use, what starts a
run, and what a run produces. A plugin is text plus approved tools: nothing
in it is run as code, a tool that isn't declared doesn't exist for it, and
anything that reaches people waits for a person to approve the exact
version.

## The plugins

| Plugin | What it does | Starts on | Can change outside CoderHelm |
| --- | --- | --- | --- |
| [`marketing`](plugins/marketing/) | Drafts launch posts, a blog post and a launch email from each release or brief | Release, Monday schedule, brief | Posts to LinkedIn and sends one email, each after approval |
| [`release-notes`](plugins/release-notes/) | Drafts release notes from the pull requests a release merged | Release, brief | Nothing |
| [`incident-summary`](plugins/incident-summary/) | Writes a plain-words incident summary from an alert, an error or a log line | Brief, weekday morning schedule | Posts to one Slack channel after approval |
| [`dependency-watch`](plugins/dependency-watch/) | Checks for vulnerable and outdated dependencies and drafts one grouped issue | Monday schedule, brief | Opens one GitHub issue after approval |
| [`docs-sync`](plugins/docs-sync/) | Proposes doc updates where merged pull requests changed behavior | Release, brief | Nothing |
| [`starter`](plugins/starter/) | A minimal template with every manifest field explained | Brief | Nothing |

Each plugin's README covers what it needs, its settings, what it can and
can't do, and its token budget.

## Add this repository as a source

You need the admin role in CoderHelm.

1. Open **Plugins** and scroll to **Sources**.
2. In **Repository**, enter `https://github.com/CoderHelm/coderhelm-plugins`.
3. Under **Follow**, pick **Tag** and enter a release tag from this
   repository (for example `v1.0.0`) to stay on a reviewed version, or
   **Branch** `main` to take changes as they merge.
4. Click **Add source**. The plugins appear under **Catalog**.
5. Click **Install** on the one you want. With two or more admins, a second
   admin approves the install.
6. On the plugin's page, fill in its settings, connect the accounts it
   asks for, and list who approves under **Who approves what goes out**.

Installing grants nothing by itself: the plugin can only use connections
your team makes, and only the tools its manifest allows.

## Copy one into your own repository

1. Make a repository: public, or private and readable by your team's
   CoderHelm GitHub App. You can also click **Use this template** on this
   repository.
2. Copy a folder, for example `plugins/starter/`, to `plugins/<your-plugin>/`.
   A source holds one plugin with `plugin.yaml` at the top, or many under
   `plugins/<name>/`; nothing deeper is read.
3. Change `name`, `description`, the agents and the skills. Keep team
   values (brand guides, channels, accounts) in settings, not in the files.
4. Run the validator (below) until it says `ok`.
5. Add your repository as a source as above. For a private repository,
   enter `owner/name`.

To have a coding agent build a plugin for you, read
[BUILD_WITH_AN_AGENT.md](BUILD_WITH_AN_AGENT.md). The rules agents follow
in this repository are in [AGENTS.md](AGENTS.md).

## Versions

- **Installs are pinned to content.** CoderHelm pins an installed plugin to
  a hash of its files and the commit they came from. `version` in
  `plugin.yaml` (`1.2` or `1.2.0`) is a label for people: raise it with
  every change.
- **A source follows a branch, a tag or one commit.** Public sources are
  checked every 15 minutes, and **Check now** checks at once.
- **Wording applies by itself; widening waits.** A new version that only
  changes text (skills, agent instructions, descriptions) applies and is
  logged. One that adds or widens a tool, trigger, connection, scope or
  output waits for an admin, and the plugin keeps running the approved
  version meanwhile.
- **This repository's releases** are tags on `main` (`v1.0.0`, `v1.1.0`).
  Following a tag keeps your team on a version until an admin moves it.
  Following `main` takes each change as it merges, under the rules above.

## Test

```bash
npm ci
npm run check                                  # every plugin, everything CI checks
node tools/validate-plugin.mjs plugins/starter # one plugin, CoderHelm's validator only
```

`npm run check` validates each `plugin.yaml` against the manifest schema,
runs CoderHelm's validator, adds checks the platform makes that the
validator does not (for example, that each trigger's `agent` names an
agent file), checks the layout, and checks the starter again with its
optional lines turned on.

`tools/` holds copies of the schema and validator that
[docs.coderhelm.com](https://docs.coderhelm.com/plugins/testing) publishes.
CI fails when they drift; `npm run refresh-tools` updates them.

In your own repository you only need the validator:

```bash
curl -fsSLO https://docs.coderhelm.com/tools/validate-plugin.mjs
node validate-plugin.mjs plugins/<your-plugin>
```

The validator checks the package. To check behavior, install the plugin on
a test team, start it with a brief, and read its drafts: nothing goes out
without an approval, so a test run is safe. See
[Test a plugin locally](https://docs.coderhelm.com/plugins/testing).

## Docs

- [What a plugin is](https://docs.coderhelm.com/plugins)
- [Build the marketing plugin](https://docs.coderhelm.com/plugins/walkthrough)
- [Repo layout](https://docs.coderhelm.com/plugins/layout) and the [manifest reference](https://docs.coderhelm.com/plugins/manifest-reference)
- [Skills, agents and tools](https://docs.coderhelm.com/plugins/skills-agents-tools)
- [Settings](https://docs.coderhelm.com/plugins/settings), [triggers](https://docs.coderhelm.com/plugins/triggers), [outputs](https://docs.coderhelm.com/plugins/outputs), [connections](https://docs.coderhelm.com/plugins/connections) and [budgets](https://docs.coderhelm.com/plugins/budgets)
- [Test a plugin](https://docs.coderhelm.com/plugins/testing), [versioning](https://docs.coderhelm.com/plugins/versioning), [public and private repos](https://docs.coderhelm.com/plugins/repos), [private marketplace](https://docs.coderhelm.com/plugins/marketplace) and [publishing](https://docs.coderhelm.com/plugins/publishing)
- [Security rules](https://docs.coderhelm.com/plugins/security)

## Contributing

Pull requests are welcome. `npm run check` must pass, each plugin needs a
README, and examples stay generic: no company or customer names, no real
accounts, `example.com` for addresses. Report a way around a plugin's
safety rules to security@coderhelm.com rather than in an issue.

## License

[MIT](LICENSE). Copy, change and ship these examples in your own
repositories, public or private.
