# Web

Astro frontend for Christian Music Europe. Run `npm run dev:web` from the repository root. Setup notes live in the root README.

## Content source

Artist and catalogue-backed article pages read from Sanity unless you opt into the local fixture. The switch is `PUBLIC_CME_DATA_SOURCE`:

- unset or `sanity` (default): GROQ queries in `src/lib/sanity.ts` read project `rg6onak7`, dataset `production`. Published documents only, unless `SANITY_API_READ_TOKEN` is present in the server environment. That token must not use the `PUBLIC_` prefix and must not be committed. With a token, the client uses the drafts perspective. Every published artist with a slug gets a page.
- `fixture`: offline opt-in, no network call. `/artists/lin-d` is rendered from `src/fixtures/lin-d-proposal.json` plus the approved studio portrait metadata. Genre names are resolved with `src/fixtures/genres.json`. The Sweden association is resolved from the proposal's `country-se` reference. The fixture also includes one development event, LIN D at Get Focused 2026, badged Development. Use this for offline dev and tests.

Copy `apps/web/.env.example` to `apps/web/.env` for local values. The example project id is public. Do not put secrets in `PUBLIC_` variables.

The homepage and `/articles/placeholder-interview` are the approved page templates. Placeholder badges mark example copy. They are not catalogue records.

Photos are rendered only when `rightsStatus` is `cleared`, unless `PUBLIC_CME_ALLOW_PENDING_IMAGES=true` on a dev or preview build. That flag also shows `restricted` photos and adds a Permission pending label. Production builds ignore the flag. A published artist with no photo, biography, releases, or events still builds: those sections use empty states.

`npm run typecheck --workspace=web` runs `astro check`. `npm run build:web` from the repository root builds the site.

## Europe dot map (`/countries`)

`src/pages/countries/index.astro` renders the dot-matrix map from `src/lib/map.ts`.

- The grid is `src/data/europe-dots.json`, generated from Natural Earth admin-1 boundaries by `scripts/europe-dots/build_grid.py` (instructions at the top of that script). Only European countries have dots. Regenerate it only when the grid design changes; the Natural Earth source files are not committed.
- Artists mode: published artists, country level only, from `countryAssociations` whose country has `europeanEditorialScope == true`. Countries with artists are lit in one flat purple (#7B2FF7); artist counts are not shown through colour. Each dot has an invisible full-cell hit area, so clicks between dots still select the country (or, in Events mode, the nearest event city in that country). Vatican City has no dots, so its artists show under Italy.
- Events mode: published, upcoming, non-cancelled events, placed on the dot nearest the venue. The venue `location` geopoint is used when set; otherwise the city is looked up in `src/data/venue-cities.json` (key `ISO:city`). Events that cannot be placed are listed under the map but get no dot, and the build logs a `[map]` warning. Drafts are never shown, even with a drafts token.
- URL parameters for sharing and testing: `?mode=events`, `?range=all`, `?country=FI`.
