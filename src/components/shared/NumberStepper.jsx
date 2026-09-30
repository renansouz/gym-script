import { Minus, Plus } from 'lucide-react'

/**
 * Full-width row: label on the left, [-] value [+] on the right (justify-between),
 * so it never overflows on narrow phones (verified layout budget at 375px:
 * 375 - 32 page padding - 40 card padding = 303px; controls need ~176px).
 */
export default function NumberStepper({ label, value, onChange, step = 1, min = 0, suffix = '' }) {
  const set = (v) => onChange(Math.max(min, Number(v.toFixed ? v.toFixed(2) : v)))

  return (
    <div className="flex w-full items-center justify-between gap-3">
      <div className="flex flex-col min-w-0">
        <span className="text-xs uppercase tracking-wide text-base-600 font-semibold">{label}</span>
        {suffix && <span className="text-xs text-base-600">{suffix}</span>}
      </div>
      <div className="flex items-center gap-1 shrink-0">
        <button
          onClick={() => set(value - step)}
          className="h-12 w-12 flex items-center justify-center rounded-xl bg-base-800 active:bg-base-700 border border-base-700"
          aria-label={`Decrease ${label}`}
        >
          <Minus size={18} />
        </button>
        <input
          type="number"
          inputMode="decimal"
          value={value}
          onChange={(e) => set(e.target.value === '' ? 0 : parseFloat(e.target.value))}
          className="w-20 h-12 text-center bg-transparent text-2xl font-extrabold focus:outline-none"
          aria-label={label}
        />
        <button
          onClick={() => set(value + step)}
          className="h-12 w-12 flex items-center justify-center rounded-xl bg-base-800 active:bg-base-700 border border-base-700"
          aria-label={`Increase ${label}`}
        >
          <Plus size={18} />
        </button>
      </div>
    </div>
  )
}
