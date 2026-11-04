# Christian Music Europe

Christian Music Europe is a discovery platform for Christian music, artists, releases and events across Europe.

This repository is a local-only monorepo:

- `apps/web` — Astro site (TypeScript + Tailwind CSS)
- `apps/studio` — Sanity Studio

The existing WordPress site and Bluehost hosting are unchanged. Nothing is deployed from this repo yet.

Sanity content model and Studio operations:

- [docs/content-model.md](docs/content-model.md)
- [docs/sanity-setup.md](docs/sanity-setup.md)
- [docs/editorial-rules.md](docs/editorial-rules.md)

## Requirements

- Node.js 22 or newer (this machine uses Node 24; see `.nvmrc`)
- npm 11 or newer

## Setup

1. Copy environment variables and fill in your existing Sanity project:

   ```bash
   cp .env.example .env
   cp .env.example apps/web/.env
   cp .env.example apps/studio/.env
   ```

2. Set `PUBLIC_SANITY_PROJECT_ID` / `SANITY_STUDIO_PROJECT_ID` and dataset names to match the Sanity project in [sanity.io/manage](https://www.sanity.io/manage).

3. Install dependencies from the repository root:

   ```bash
   npm install
   ```

## Local development

Run the public site:

```bash
npm run dev:web
```

Astro defaults to [http://localhost:4321](http://localhost:4321).

### Where pages get their content

`PUBLIC_CME_DATA_SOURCE` chooses the source for artist and article records:

| Value | Behaviour |
| --- | --- |
| `fixture` (default) | Render local fixtures in `apps/web/src/fixtures`. This includes the LIN D artist at `/artists/lin-d`, built from the proposal document. Use this while LIN D and the genre documents are still drafts. |
| `sanity` | Fetch published documents from project `rg6onak7`, dataset `production`, with GROQ. |

Drafts are not on the public API. To read them, set `SANITY_API_READ_TOKEN` in the server environment (no `PUBLIC_` prefix) and set `PUBLIC_CME_DATA_SOURCE=sanity`. Never commit the token. The homepage and the interview template at `/articles/placeholder-interview` are design pages: orange Placeholder badges are example slots, and grey From the site badges repeat titles from the approved homepage mockup.

The night photograph used in the masthead, country map and footer is `apps/web/public/brand/night-europe.jpg`. Its licence is unconfirmed. It is marked on the page as a placeholder image and must be replaced before launch.

### Photo workflow

Every editorial photo uses the `licensedImage` type in Studio: alt text, credit, source, licence, permission notes, optional expiry, and rights status. A production build shows a photo only when rights status is Cleared. The same rule applies in fixture mode and Sanity mode.

`PUBLIC_CME_ALLOW_PENDING_IMAGES=true` also shows photos marked `restricted`, with a visible Permission pending label. That flag applies to dev and preview builds only (`astro dev`, or `astro build --mode preview`). A production build ignores it. Leave the flag unset for launch. The LIN D studio portrait is restricted: permission from the artist's management is still pending, so it appears only when this flag is on.

Keep the originals and the licence proof in the Google Drive folder `CME Media`, and record each photo on the `CME Photo log` sheet. Upload the publishing copy to Sanity and fill the licensed image fields, including where that proof is kept. Alt text is required before publish. CC BY and CC BY-SA warn when the credit is empty. A status other than Cleared warns, and the site will not render that photo.

Campaign channel assets stay on the campaign `mediaRights` record. That object is the campaign workflow, not the public photo licence.

Run Sanity Studio:

```bash
npm run dev:studio
```

Studio defaults to [http://localhost:3333](http://localhost:3333).

## Sanity CORS

In Sanity manage, add these CORS origins with credentials enabled:

- `http://localhost:3333`
- `http://localhost:4321`

Only add origins you control.

## Scripts

| Script | Description |
| --- | --- |
| `npm run dev:web` | Start the Astro dev server |
| `npm run dev:studio` | Start Sanity Studio |
| `npm run build:web` | Build the Astro site |
| `npm run build:studio` | Build Sanity Studio |
| `npm run typecheck:studio` | Typecheck Studio |
| `npm run seed:development` | Seed fictional data into the development dataset |
