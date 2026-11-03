import {existsSync, readFileSync} from 'node:fs'
import {resolve} from 'node:path'

function applyEnvFile(filePath: string) {
  if (!existsSync(filePath)) return

  for (const rawLine of readFileSync(filePath, 'utf8').split('\n')) {
    const line = rawLine.trim()
    if (!line || line.startsWith('#')) continue
    const separator = line.indexOf('=')
    if (separator === -1) continue
    const key = line.slice(0, separator).trim()
    const value = line.slice(separator + 1).trim().replace(/^['"]|['"]$/g, '')
    if (!(key in process.env)) {
      process.env[key] = value
    }
  }
}

export function loadStudioEnv() {
  const studioRoot = resolve(import.meta.dirname, '..')
  const repoRoot = resolve(studioRoot, '../..')
  applyEnvFile(resolve(repoRoot, '.env'))
  applyEnvFile(resolve(studioRoot, '.env'))
}
