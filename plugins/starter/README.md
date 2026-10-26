# starter

A minimal plugin to copy, with every manifest field explained in
`plugin.yaml`. As it ships, it turns a brief into one short note in your
house style, reads only the knowledge bases attached to it, and saves the
note as a draft. Nothing leaves CoderHelm.

## What it does

- **From a brief**, the `note-writer` agent reads the `house-style` skill,
  follows the `checklist` command, searches attached knowledge bases if it
  needs background, and saves one `note` draft.

## What it needs

Nothing to connect. Attach a knowledge base on the plugin's page if you
want the agent to have background to quote.

## Settings

| Key | Type | What to enter |
| --- | --- | --- |
| `house_style` | string | A link to your writing guide, or a few sentences |

## What it can and can't do

| Tool | Risk | Runs |
| --- | --- | --- |
| `search_knowledge` | read | Whenever the agent needs it |
| `save_draft` | write (in CoderHelm only) | Always |

It can't reach any outside service. The optional fields in `plugin.yaml`
(lines starting with `#| `) show how to add a connection, an HTTP tool
that waits for approval, a schedule, a release trigger, a publish output
and results.

## Cost

`budget.monthly_tokens` is 200,000, plenty for a few notes a day.

## Make it yours

1. Copy this folder to `plugins/<your-plugin>/` in your own repository
   (public, or private on your team's GitHub App installation).
2. Change `name`, `description`, the agent and the skill.
3. Turn on the optional fields you need by deleting `#| `.
4. Run the validator (see the root README) until it says `ok`.
5. Add your repository as a source on the **Plugins** page and install it.
