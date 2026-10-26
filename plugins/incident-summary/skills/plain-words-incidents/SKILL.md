---
name: plain-words-incidents
description: The shape and wording of an incident summary anyone can read. Read before writing any summary.
---
# Plain-words incident summaries

## Shape

1. **What happened**, in one sentence a customer could read.
2. **Who was affected**: which people or features, roughly how many.
3. **When**: start time, and end time or "still happening", in UTC.
4. **What we know about the cause**, or "not known yet".
5. **What happens next**: who is looking, and when the next update is.

## Words

- Say what people saw ("checkout failed for some people"), not the
  internals ("HTTP 502 from the payments service").
- Numbers only from what you read: event counts, user counts, times.
  Round them ("about 300 people").
- Say "we don't know yet" rather than guessing a cause.
- No blame, no names of people, no customer or company names.
- Never paste secrets, tokens, internal hostnames, email addresses or full
  stack traces. Link to the issue instead.

## Severity

Use the severity from the brief when there is one. Otherwise describe the
impact and leave severity to the incident lead.
