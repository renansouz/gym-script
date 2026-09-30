import { create } from 'zustand'
import { supabase, cloudEnabled } from '../lib/supabase'

/** Auth state is NOT persisted by us: supabase-js keeps the session in localStorage itself (works offline). */
export const useAuthStore = create((set) => ({
  session: null,
  loading: cloudEnabled, // true until the first getSession resolves
  init() {
    if (!cloudEnabled) return
    supabase.auth.getSession().then(({ data }) => set({ session: data.session, loading: false }))
    supabase.auth.onAuthStateChange((_evt, session) => set({ session, loading: false }))
  },
  async signIn(email, password) {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    return error?.message ?? null
  },
  /** Returns { error, needsConfirmation } — with email confirmation on, no session is returned until the link is clicked. */
  async signUp(email, password) {
    const { data, error } = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: window.location.origin } })
    return { error: error?.message ?? null, needsConfirmation: !error && !data.session }
  },
  async resetPassword(email) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: window.location.origin })
    return error?.message ?? null
  },
  async signOut() {
    // 'local' scope: works offline and always clears this device's session.
    await supabase.auth.signOut({ scope: 'local' }).catch(() => {})
    set({ session: null })
  }
}))
