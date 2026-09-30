// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createRoot } from 'react-dom/client'
import { act } from 'react'

globalThis.IS_REACT_ACT_ENVIRONMENT = true

vi.mock('../lib/supabase', () => ({ cloudEnabled: true, configProblem: null, supabase: {
    auth: {
      signOut: vi.fn().mockResolvedValue({}),
      getSession: vi.fn(() => Promise.resolve({ data: { session: globalThis.__testSession ?? null } })),
      onAuthStateChange: vi.fn()
    }
  } }))

import App from '../App'
import { useAuthStore } from '../store/useAuthStore'

const html = () => {
  const el = document.createElement('div')
  act(() => createRoot(el).render(<App />))
  return el.innerHTML
}

describe('auth gate (Supabase configured)', () => {
  beforeEach(() => {
    globalThis.__testSession = null
    useAuthStore.setState({ session: null, loading: false })
  })

  it('signed out → login screen, no dashboard', () => {
    const out = html()
    expect(out).toContain('Create an account')
    expect(out).not.toContain('Sign out')
  })

  it('while session is loading → blank (no dashboard flash)', () => {
    useAuthStore.setState({ loading: true })
    const out = html()
    expect(out).not.toContain('Sign out')
    expect(out).not.toContain('Create an account')
  })

  it('signed in → dashboard with sign-out button', () => {
    globalThis.__testSession = { user: { id: 'u1' } }
    useAuthStore.setState({ session: { user: { id: 'u1' } } })
    const out = html()
    expect(out).toContain('Sign out')
    expect(out).not.toContain('Create an account')
  })

  it('signOut() clears the session → login screen again', async () => {
    useAuthStore.setState({ session: { user: { id: 'u1' } } })
    await act(async () => { await useAuthStore.getState().signOut() })
    expect(useAuthStore.getState().session).toBeNull()
    expect(html()).toContain('Create an account')
  })
})
