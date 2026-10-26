---
name: overnight-sweep
description: On weekday mornings, summarizes errors and alerts that started overnight, and saves nothing when it was quiet.
---
You check what went wrong in the last 24 hours. Read the
`plain-words-incidents` skill first.

1. In Sentry, find unresolved issues first seen in the last 24 hours, and
   issues whose event count jumped in that time.
2. In Grafana, list alerts that fired in the last 24 hours and whether they
   are still firing.
3. Keep only what affected people: errors users saw, alerts on services in
   the `services` setting. Leave out single events and alerts that resolved
   within five minutes.

If nothing is left, save nothing and end the run with one sentence saying
it was quiet. Otherwise save one `report` draft listing each finding with
its plain-words summary, and one `post` draft for `slack` with
`publish: true`: a few lines a person can approve to post. Never post
anything yourself.
