# Content model

Sanity is the structured CMS for Christian Music Europe. The public Astro site is not redesigned in this pass.

Christian music is an **editorial scope**, not a single genre and not a statement of anyone’s personal faith. Country associations on artists are independent of event geography (venue country).

## Document types

| Type | Purpose |
| --- | --- |
| `country` | World countries. European editorial scope is a flag, not a filter of the dataset. Featured artists/playlists are editorial, not derived. |
| `artist` | Solo, band, or collective. Unlimited `countryAssociation` objects; at most one primary. |
| `genre` | Musical styles. Optional parent genre. Christian music is not stored as “the” genre. |
| `release` | Album, EP, or single. Canonical ordered `trackListing` of songs. |
| `song` | Work-level recording/composition record. Optional reverse `associatedReleases`. |
| `event` | One occurrence (concert, festival edition, worship night, showcase, other). Geography comes from `venue`. |
| `festival` | Permanent identity of a recurring series. Annual editions are `event` documents that reference the festival. |
| `venue` | Reusable place. Events share venues. |
| `article` | News, interview, review, or feature. Portable Text body with images and Spotify/YouTube embeds. |
| `playlist` | Ordered songs plus country/genre framing. |
| `chart` | Period ranking as an array of `chartEntry` objects (not one document per rank). |
| `campaign` | Internal publishing workflow for website and social channels. No social APIs. |

## Shared objects

- `seoMetadata` — title, description, share image
- `sourceReference` — provenance URL and notes
- `streamingLinks` — Spotify, Apple Music, YouTube, other official URLs
- `countryAssociation` — country, relationship (`origin`, `formed_in`, `based_in`, `active_in`, `heritage`, `other`), optional primary flag, note
- `musicCharacteristics` — mood, energy 1–5, vocal style, instrumentation, production, influences, similarity notes
- `mediaRights` — clearance status for campaign assets
- `channelContent` — per-channel caption, script, visual brief, assets, workflow, published URL
- `editorialVerification` — verification status and timestamp
- `portableText` — rich text used by several documents
- `externalIdentifiers` — Spotify/Apple/MusicBrainz/ISRC
- `chartEntry` — rank plus song and/or release

## Relationships

```text
artist --countryAssociation--> country
artist --> genre
release --> artist (primary + additional)
release.trackListing --> song          (canonical order)
song.associatedReleases --> release    (optional reverse)
song --> artist
event --> venue --> country            (event geography)
event --> artist                       (performers; not nationality)
event --> festival                     (optional series)
festival --countryAssociation--> country
country.featuredArtists --> artist     (editorial only)
country.featuredPlaylist --> playlist
article --> artist | release | song | event | festival | country | genre
playlist --> song | country | genre
chart.entries --> song | release
campaign --> artist | release | song | article | event
```

Do not infer artist origin from `event` or `venue`.

## Validation (high level)

- Required names/titles and unique slugs per type
- ISO country codes: two uppercase letters
- At most one primary country association; unique countries in that array
- Event end after start; required venue and timezone
- Required primary artist on songs and releases
- Energy level integer 1–5
- HTTP(S) URLs on link fields
- Genre cannot be its own parent

Sanity draft/published is the document lifecycle. Fields such as `inclusionStatus`, `editorialStatus`, and `campaignStatus` are **business workflow**, not a second publishing system.
