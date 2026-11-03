# Editorial rules

These rules are encoded in the content model and must be followed in Studio.

## Christian music is an editorial classification

Christian Music Europe covers worship, gospel, Christian pop/rock/metal/hip-hop/electronic, singer-songwriters, independent artists, and faith-oriented music in mainstream and independent scenes.

Inclusion is decided by editors (`inclusionStatus` on artists). **Never automatically infer or publicly assert an individual’s religious identity.**

## Geography

- **Countries cover the world.** European editorial scope is a boolean, not a reason to omit the United States or other countries.
- **Artist geography** lives on `countryAssociations` (origin, formed in, based in, active in, heritage, other).
- **Event geography** lives on the venue’s country (and city). Performing in Europe does not make an artist European.
- Country pages may feature artists editorially. That is not the same as an origin association.
- International artists (including US artists) may appear on European events.

## Live music

- A **festival** document is the series (name, organizer, countries).
- Each annual edition is an **event** that references the festival and a venue.
- Ticket and event status fields are operational, not a replacement for Sanity draft/published.

## Catalog

- One **release** type covers albums, EPs, and singles.
- Track order is stored on the release. Song → release links are optional convenience.
- **Music characteristics** (mood, energy, instrumentation, similarity notes) support later matching. Do not treat them as an automated recommendation engine.

## Sources and campaigns

- Prefer a source URL for facts (dates, tickets, identifiers).
- Campaign channel fields prepare website/Instagram/TikTok/X/YouTube copy. Social APIs are not connected. Do not mark content published externally unless a real URL exists.
- Media rights must be recorded before public reuse of assets.

## Draft vs workflow status

Use Sanity **Publish** to make a document live in the dataset. Fields such as playlist editorial status or campaign status describe internal process only.
