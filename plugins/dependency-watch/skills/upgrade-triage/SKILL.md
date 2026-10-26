---
name: upgrade-triage
description: How to rank and write up dependency findings so a maintainer can act in one pass. Read before writing the report or the issue.
---
# Upgrade triage

## Order

1. **Vulnerable and reachable**: a known vulnerability with a fixed
   version, in a runtime dependency.
2. **Vulnerable, development only**: the same, in a test or build tool.
3. **Far behind**: a direct dependency one or more major versions behind,
   or with no release in over a year (it may be abandoned).
4. **Minor updates**: list the count only, not each one.

## For each finding

- The package, the version in use and the version to move to.
- Why it matters, in one line: the advisory id and severity, or "two
  majors behind".
- Whether the upgrade looks breaking: read the upstream release notes for
  the versions in between, and quote the one line that says so.

## The issue

- A checklist, one box per package, grouped by repository, most urgent
  first.
- No more than 25 boxes. Put the rest in the report and say how many were
  left out.
- Never paste tokens, internal hostnames or private advisory text.
