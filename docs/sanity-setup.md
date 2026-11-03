# Sanity Studio setup

Studio lives in `apps/studio` inside the npm workspace. It uses the existing Sanity project (`rg6onak7` when configured in env). Do not create a second cloud project.

## Environment variables

Copy examples, then fill local gitignored files:

```bash
cp .env.example .env
cp apps/studio/.env.example apps/studio/.env
```

| Variable | Purpose |
| --- | --- |
| `SANITY_STUDIO_PROJECT_ID` | Existing Sanity project ID |
| `SANITY_STUDIO_DATASET` | Dataset Studio edits (currently `production` unless you switch) |
| `SANITY_STUDIO_API_VERSION` | API date string |
| `SANITY_SEED_DATASET` | Seed target; defaults to `development` |
| `SANITY_API_WRITE_TOKEN` | Editor/write token for seeding only. Never commit it. |

Project IDs are not secrets. Tokens are. `.env` files are gitignored.

## Start Studio locally

From the repository root:

```bash
npm install
npm run dev:studio
```

Open [http://localhost:3333](http://localhost:3333) and sign in.

If the port refuses connections, nothing is listening: start `npm run dev:studio` again.

### CORS

In [sanity.io/manage](https://www.sanity.io/manage) for this project, add CORS origins with credentials:

- `http://localhost:3333`
- `http://localhost:4321`

Only add origins you control.

## Create content

Use the desk groups:

- **Music Catalog** — Artists, Releases, Songs, Genres
- **Geography** — Countries, Venues
- **Live Music** — Events, Festivals
- **Editorial** — Articles, Playlists, Charts
- **Publishing** — Campaigns

Create referenced documents first when the UI requires them (country before venue, venue before event, artist before release). Use **Publish** for Sanity’s built-in draft/published flow.

## Manage references

- Artist countries: add rows on **Country associations**. Mark at most one primary.
- Event location: set **Venue**. Do not copy artist countries onto the event.
- Festival editions: create an **Event** and set **Festival series**.
- Album tracks: order songs on the **Release** track listing. Optional reverse links live on the song.

## Seed development data

The seed script writes **fictional** documents with deterministic IDs and **refuses `production`**.

1. Create a token with write access (and dataset-create if `development` does not exist yet) at sanity.io/manage → API → Tokens.
2. Put it in `apps/studio/.env` as `SANITY_API_WRITE_TOKEN`.
3. Optionally set `SANITY_SEED_DATASET=development`.
4. Run:

```bash
npm run seed:development
```

Reruns use `createOrReplace` on the same IDs, so they do not duplicate seed documents.

Do not seed production without explicit approval.

## Typecheck and schema validation

```bash
npm run typecheck:studio
npm run build:studio
npm run schema:extract --workspace=studio
```

`sanity build` compiles Studio. It does not deploy. `sanity schema extract` writes a schema snapshot locally.

## Deploy Studio later

Not done in this pass. When you are ready:

1. Confirm the dataset and CORS for the real Studio host.
2. From `apps/studio`, `npx sanity deploy` (hosted Studio) **or** keep Studio in this repo and deploy with the site later.
3. Do not change WordPress, Bluehost, or DNS as part of Studio deploy.

## Switch Studio to the development dataset

To edit seed data in the Studio UI, set `SANITY_STUDIO_DATASET=development` in `apps/studio/.env` and restart `npm run dev:studio`. Point it back to `production` for live editorial work.
