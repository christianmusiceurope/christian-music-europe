/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_SANITY_PROJECT_ID: string;
  readonly PUBLIC_SANITY_DATASET: string;
  readonly PUBLIC_SANITY_API_VERSION: string;
  /** `sanity` when unset. Set to `fixture` for offline dev and tests. */
  readonly PUBLIC_CME_DATA_SOURCE?: string;
  /** `true` shows restricted photos in dev and preview builds. Ignored when MODE is production. */
  readonly PUBLIC_CME_ALLOW_PENDING_IMAGES?: string;
  /** `true` renders the local Sondae spotlight fixture on the homepage. */
  readonly PUBLIC_CME_SPOTLIGHT_FIXTURE?: string;
  /** `true` shows the newsletter header button and the bottom signup band. Hidden when unset. */
  readonly PUBLIC_CME_NEWSLETTER?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
