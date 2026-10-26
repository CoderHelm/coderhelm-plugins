# marketing

Drafts launch content from each release or brief: a blog post, three
LinkedIn variants, a launch email and an optional header image. An editor
approves one exact version before anything is posted or sent.

## What it does

- **On a release** (CoderHelm writes release notes for a new tag), the
  `launch-writer` agent reads the notes and drafts the blog post, the
  LinkedIn variants and the launch email.
- **Mondays at 14:00 UTC**, the `weekly-roundup` agent drafts one short
  LinkedIn roundup from what was published that week and how recent posts
  did. If nothing shipped, it saves nothing.
- **From a brief** (the plugin's page, **Write a brief**), a person asks
  for a specific announcement and picks the channels.
- **A week after a post goes out**, its numbers are read back from
  analytics as a lesson the next runs read.

## What it needs

| Need | Where | Required |
| --- | --- | --- |
| Sanity | Connections page, a token with draft access | No: without it, blog drafts stay in CoderHelm |
| PostHog | Connections page, a read-only key | No: without it, there are no lessons from earlier posts |
| LinkedIn | The plugin's `linkedin` setting | Only to publish posts |
| Email service | The plugin's `email` setting (a SendGrid key as written) | Only to send the launch email |
| Image service | The plugin's `images` setting | No |

See [connectors/README.md](connectors/README.md) for each one.

## Settings

| Key | Type | What to enter |
| --- | --- | --- |
| `brand_voice_doc` | string | A link to your brand voice document, or a few sentences about how you sound |
| `product_name` | string | The product's name as posts should spell it |
| `linkedin_author` | string | The LinkedIn URN posts are made as (`urn:li:organization:123`) |
| `email_from` | string | The verified sender address (`news@example.com`) |
| `email_to` | string | The one address launch emails go to, such as a list address |
| `linkedin` | connection (oauth2) | The LinkedIn account, scopes `w_member_social` and `w_organization_social` |
| `email` | connection (key) | The email service's API key |
| `images` | connection (key) | The image service's API key |

## What it can and can't do

| Tool | Risk | Runs |
| --- | --- | --- |
| `sanity__get_*`, `list_*`, `query_*` | read | Whenever the agent needs it |
| `sanity__create_draft` | write | Only if your team lets plugins save drafts without a person |
| `posthog__query_*`, `get_*` | read | Whenever the agent needs it |
| `generate_image` | write | Only if your team lets plugins save drafts without a person; it makes an image and publishes nothing |
| `publish_post` | consequential | Only after an editor approves one exact LinkedIn draft |
| `send_email` | consequential | Only after a person approves the exact subject and text |

It can't delete or publish anything in the CMS, can't read anything in
analytics beyond queries, and can't call any tool this manifest doesn't
list. The person who asked for a draft never approves it.

## Cost

`budget.monthly_tokens` is 2,000,000. A release run reads the notes and
writes about six drafts; the weekly run is smaller. Change the limit on the
plugin's page under **Monthly token limit**. The brand voice and claims
skills are stable text, so later calls read them from the prompt cache.

## Install

1. On the **Plugins** page, add `https://github.com/CoderHelm/coderhelm-plugins`
   as a source, or your own copy of this folder.
2. Install **marketing** from the catalog (a second admin approves when
   your team has two or more).
3. Fill in the settings, connect the accounts you want, and list the
   editors under **Who approves what goes out**.
4. Start it once with **Write a brief** and read the drafts in **Review**.

To post somewhere else, change `publish_post`'s `url`, `headers` and
`body` in your copy. A change that adds a tool, a scope, a trigger, a
connection or an output waits for an admin before it is used.
