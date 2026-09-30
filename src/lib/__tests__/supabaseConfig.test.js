import { describe, it, expect } from 'vitest'
import { resolveSupabaseConfig as r } from '../supabaseConfig'

describe('resolveSupabaseConfig', () => {
  it('neither set → local mode', () => expect(r('', '').status).toBe('local'))
  it('undefined values → local mode', () => expect(r(undefined, undefined).status).toBe('local'))
  it('valid pair → ok', () => expect(r('https://abc.supabase.co', 'sb_publishable_x')).toMatchObject({ status: 'ok', url: 'https://abc.supabase.co' }))
  it('strips /rest/v1 (Data API URL), trailing slash, quotes, spaces', () => {
    expect(r(' "https://abc.supabase.co/rest/v1/" ', 'k').url).toBe('https://abc.supabase.co')
  })
  it('only one var set → invalid, not silent fallback', () => {
    expect(r('https://abc.supabase.co', '').status).toBe('invalid')
    expect(r('', 'k').status).toBe('invalid')
  })
  it('garbage URL → invalid', () => expect(r('abc', 'k').status).toBe('invalid'))
  it('rejects secret keys', () => expect(r('https://abc.supabase.co', 'sb_secret_123').status).toBe('invalid'))
})
