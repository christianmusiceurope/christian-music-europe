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
