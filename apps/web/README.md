# Web

Astro frontend for Christian Music Europe. Run `npm run dev:web` from the repository root. Setup notes live in the root README.

## Content source

Artist and catalogue-backed article pages read from either a local fixture or Sanity. The switch is `PUBLIC_CME_DATA_SOURCE`:

- `fixture` (default): no network call. `/artists/lin-d` is rendered from `src/fixtures/lin-d-proposal.json` plus the approved studio portrait metadata. Genre names are resolved with `src/fixtures/genres.json`. The Sweden association is resolved from the proposal's `country-se` reference. Related articles, releases, events and videos are empty until those documents exist. The portrait file is loaded from the Sanity CDN.
- `sanity`: GROQ queries in `src/lib/sanity.ts` read project `rg6onak7`, dataset `production`. Published documents only, unless `SANITY_API_READ_TOKEN` is present in the server environment. That token must not use the `PUBLIC_` prefix and must not be committed. With a token, the client uses the drafts perspective so unpublished documents such as LIN D can be read.

Copy `apps/web/.env.example` to `apps/web/.env` for local values. The example project id is public. Do not put secrets in `PUBLIC_` variables.

The homepage and `/articles/placeholder-interview` are the approved page templates. Placeholder badges mark example copy. They are not catalogue records.

Sanity and fixture photos are requested with their licence fields. A photo is rendered only when `rightsStatus` is `cleared`, unless `PUBLIC_CME_ALLOW_PENDING_IMAGES=true` on a dev or preview build. That flag also shows `restricted` photos and adds a Permission pending label. Production builds ignore the flag. The LIN D portrait is restricted, so the production build keeps the image placeholder.

`npm run typecheck --workspace=web` runs `astro check`. `npm run build:web` from the repository root builds the site.
