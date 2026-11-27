import type {SlugIsUniqueValidator} from 'sanity'
import {ISO_ALPHA2} from './constants'

export const uniqueSlug: SlugIsUniqueValidator = (value, context) =>
  context.defaultIsUnique(value, context)

export function validateIsoCountryCode(code: string | undefined) {
  if (!code) return 'ISO 3166-1 alpha-2 code is required'
  if (!ISO_ALPHA2.test(code)) {
    return 'Use a two-letter uppercase ISO 3166-1 alpha-2 code (for example FI or US)'
  }
  return true
}

export function httpUrlRule(Rule: {uri: (options: {scheme: string[]}) => unknown}) {
  return Rule.uri({scheme: ['http', 'https']})
}

type CountryAssociationValue = {
  country?: {_ref?: string}
  primary?: boolean
}

const CREDIT_REQUIRED_LICENCES = new Set(['cc_by', 'cc_by_sa'])

export function validateImageCredit(credit: string | undefined, licence: string | undefined) {
  if (licence && CREDIT_REQUIRED_LICENCES.has(licence) && !credit?.trim()) {
    return 'Name the photographer or rights holder. CC BY and CC BY-SA require a credit.'
  }
  return true
}

export function validateImageRightsStatus(status: string | undefined) {
  if (status !== 'cleared') {
    return 'This photo is not cleared for the website. Choose Cleared only when the licence proof is on file.'
  }
  return true
}

export function validateImageExpiry(expiresAt: string | undefined) {
  if (!expiresAt) return true
  const today = new Date().toISOString().slice(0, 10)
  if (expiresAt < today) {
    return 'This permission date has passed. Renew it before treating the photo as cleared.'
  }
  return true
}

/** Warn when a social URL is set but the host is not the expected platform. Empty values are fine. */
export function validateSocialHost(value: string | undefined, hosts: readonly string[]) {
  if (!value?.trim()) return true
  let hostname: string
  try {
    hostname = new URL(value).hostname.toLowerCase().replace(/^www\./, '')
  } catch {
    return true
  }
  const matches = hosts.some((host) => hostname === host || hostname.endsWith(`.${host}`))
  if (!matches) {
    const names = hosts.join(' or ')
    return `This does not look like a ${names} link.`
  }
  return true
}

export function validateCountryAssociations(
  associations: CountryAssociationValue[] | undefined,
) {
  if (!associations?.length) return true

  const refs = associations
    .map((item) => item.country?._ref)
    .filter((ref): ref is string => Boolean(ref))
  const unique = new Set(refs)
  if (unique.size !== refs.length) {
    return 'Each country can only appear once in the association list'
  }

  const primaries = associations.filter((item) => item.primary)
  if (primaries.length > 1) {
    return 'At most one country association can be marked primary'
  }

  return true
}

const YOUTUBE_VIDEO_ID = /^[A-Za-z0-9_-]{11}$/

/** Accept only watch, shorts, live, embed, or youtu.be video links. Empty values are fine. */
export function validateYoutubeVideoUrl(value: string | undefined) {
  if (!value?.trim()) return true
  let parsed: URL
  try {
    parsed = new URL(value)
  } catch {
    return 'Use a full YouTube video URL, starting with https://'
  }
  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    return 'Use a full YouTube video URL, starting with https://'
  }

  const host = parsed.hostname.replace(/^www\./, '').toLowerCase()
  let id: string | null = null

  if (host === 'youtu.be') {
    id = parsed.pathname.split('/').filter(Boolean)[0] ?? null
  } else if (host === 'youtube.com' || host === 'youtube-nocookie.com' || host === 'm.youtube.com') {
    if (parsed.pathname === '/watch') {
      id = parsed.searchParams.get('v')
    } else {
      const [kind, videoId] = parsed.pathname.split('/').filter(Boolean)
      if (videoId && (kind === 'embed' || kind === 'shorts' || kind === 'live' || kind === 'v')) {
        id = videoId
      }
    }
  } else {
    return 'This does not look like a YouTube link.'
  }

  if (!id || !YOUTUBE_VIDEO_ID.test(id)) {
    return 'Paste a YouTube video link (watch, shorts, live, or youtu.be). Channel links are not accepted.'
  }
  return true
}
