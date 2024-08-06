import { ParsedVersionDTO } from '~/api/backend/components/schemas'

export function formatParsedVersion(v: ParsedVersionDTO): string {
  return `${v.major}.${v.minor}.${v.patch}${v.tag ? `-${v.tag}.${v.prerelease}` : ''}`
}
