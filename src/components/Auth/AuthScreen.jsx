import { useState } from 'react'
import { useAuthStore } from '../../store/useAuthStore'
import Button from '../shared/Button'

// DRAFT COPY — review wording.
export default function AuthScreen() {
  const { signIn, signUp, resetPassword } = useAuthStore()
  const [mode, setMode] = useState('signin') // signin | signup
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(null)
  const [info, setInfo] = useState(null)

  const submit = async (e) => {
    e.preventDefault()
    setError(null)
    setInfo(null)
    if (mode === 'signup' && password.length < 8) return setError('Use at least 8 characters for your password.')
    setBusy(true)
    if (mode === 'signin') {
      setError(await signIn(email.trim(), password))
    } else {
      const r = await signUp(email.trim(), password)
      setError(r.error)
      if (r.needsConfirmation) setInfo('Check your email and tap the confirmation link, then come back and sign in.')
    }
    setBusy(false)
  }

  const forgot = async () => {
    if (!email) return setError('Enter your email first.')
    setError((await resetPassword(email.trim())) ?? null)
    setInfo('If that email has an account, a reset link is on its way.')
  }

  const input =
    'w-full h-14 px-4 rounded-2xl bg-base-800 border border-base-700 text-base focus:outline-none focus:ring-2 focus:ring-accent'

  return (
    <div className="min-h-full flex flex-col items-center justify-center px-4 py-10 max-w-md mx-auto w-full gap-6">
      <img src="/icons/icon-192.png" alt="Gym Script" className="h-24 w-24 rounded-full" />
      <div className="text-center">
        <h1 className="text-2xl font-extrabold tracking-tight">Gym Script</h1>
        <p className="text-sm text-base-600 mt-1">Log your best set. Beat your PR.</p>
      </div>

      <form onSubmit={submit} className="w-full flex flex-col gap-3">
        <input className={input} type="email" inputMode="email" autoComplete="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required aria-label="Email" />
        <input className={input} type="password" autoComplete={mode === 'signin' ? 'current-password' : 'new-password'} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required aria-label="Password" />
        {error && <p role="alert" className="text-sm text-danger px-1">{error}</p>}
        {info && <p className="text-sm text-accent-dim px-1">{info}</p>}
        <Button type="submit" disabled={busy} className="w-full">
          {busy ? 'Please wait…' : mode === 'signin' ? 'Sign in' : 'Create account'}
        </Button>
      </form>

      <div className="flex flex-col items-center gap-1">
        <button className="h-11 px-4 text-sm font-semibold text-accent-dim" onClick={() => { setMode(mode === 'signin' ? 'signup' : 'signin'); setError(null); setInfo(null) }}>
          {mode === 'signin' ? 'New here? Create an account' : 'Have an account? Sign in'}
        </button>
        {mode === 'signin' && (
          <button className="h-11 px-4 text-sm text-base-600" onClick={forgot}>Forgot password?</button>
        )}
      </div>
    </div>
  )
}
