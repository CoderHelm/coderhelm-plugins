# incident-summary

Writes a plain-words summary of an incident from an alert, an error or a
log line, using your Sentry and Grafana data. A short version is posted to
your incident channel only after an incident lead approves the exact text.

## What it does

- **From a brief**, a person pastes the alert, error link or log line,
  names the service and severity if known, and picks the audience. The
  `incident-writer` agent looks it up, checks whether it is still
  happening, and saves a full `report` and a short `post`.
- **Weekday mornings at 13:00 UTC**, the `overnight-sweep` agent looks for
  errors and alerts that started in the last 24 hours. If it was quiet, it
  saves nothing.
- **After approval**, `post_summary` posts the approved text to the
  channel in `slack_channel`.

CoderHelm plugins start from a brief, a schedule or a release; there is no
alert webhook trigger today. Paste the alert into a brief, or let the
morning sweep find it.

## What it needs

| Need | Where | Required |
| --- | --- | --- |
| Sentry | Connections page, Sentry card, a read-only token | At least one of Sentry or Grafana |
| Grafana | Connections page, Grafana card, a Viewer service account token | At least one of Sentry or Grafana |
| Slack | The plugin's `slack` setting, a Slack app with `chat:write` invited to the channel | Only to post approved summaries |

## Settings

| Key | Type | What to enter |
| --- | --- | --- |
| `slack_channel` | string | The incident channel's id (`C0123456789`) |
| `services` | string | A few lines on your main services and who uses them |
| `slack` | connection (oauth2) | The Slack app summaries are posted as |

## What it can and can't do

| Tool | Risk | Runs |
| --- | --- | --- |
| `sentry__find_*`, `get_*`, `search_*` | read | Whenever the agent needs it |
| `grafana__list_*`, `get_*`, `query_*`, `search_*`, `find_*` | read | Whenever the agent needs it |
| `post_summary` | consequential | Only after an incident lead approves the exact text |

Slack answers some errors (a bot not invited to the channel, for
example) with success and an error inside, so after approving, check the
post appeared in the channel.

It can't resolve, assign or silence anything in Sentry or Grafana, and it
can't post anywhere but the one channel. Text from logs and errors is
treated as data; the skill tells the agent never to copy secrets or
hostnames into a summary.

## Cost

`budget.monthly_tokens` is 1,500,000. The morning sweep runs every
weekday; on a quiet day it stops after a few reads. A brief that pulls
large log queries costs more: the agent reads at most 12,000 characters of
each tool result.

## Install

1. On the **Plugins** page, add `https://github.com/CoderHelm/coderhelm-plugins`
   as a source, or your own copy.
2. Install **incident-summary**.
3. Connect Sentry or Grafana on the **Connections** page, fill in the
   settings, connect Slack, and list your incident leads under **Who
   approves what goes out**.
4. Try it with a brief on a past alert and read the drafts in **Review**.
