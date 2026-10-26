# Decisions

Owner decisions for the storefront, newest first. Read before proposing a change; changing a settled
decision needs the owner.

## 2026-10-26: No all-caps text on the default theme

Labels, buttons, eyebrows, status pills and step labels are sentence case, with no `uppercase`
class, no `text-transform: uppercase` and no caps-only letter-spacing. The owner asked for it after
the account, auth and shop pages were unified, so the whole storefront reads in one voice.
`scripts/check-tokens.mjs` fails on all-caps styling in default-theme files. The wine, organic, lime
and noor themes keep their own type treatment.
