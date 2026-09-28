const VARIANTS = {
  primary: 'bg-accent text-base-950 active:bg-accent-dim',
  secondary: 'bg-base-800 text-gray-900 active:bg-base-700 border border-base-700',
  ghost: 'bg-transparent text-gray-900 active:bg-base-800',
  danger: 'bg-danger/10 text-danger active:bg-danger/20 border border-danger/30'
}

const SIZES = {
  lg: 'h-14 px-6 text-base rounded-2xl',
  md: 'h-11 px-4 text-sm rounded-xl',
  sm: 'h-9 px-3 text-sm rounded-lg'
}

export default function Button({
  children,
  variant = 'primary',
  size = 'lg',
  className = '',
  disabled = false,
  ...props
}) {
  return (
    <button
      disabled={disabled}
      className={`
        font-semibold flex items-center justify-center gap-2
        transition-colors select-none whitespace-nowrap
        disabled:opacity-40 disabled:pointer-events-none
        ${VARIANTS[variant]} ${SIZES[size]} ${className}
      `}
      {...props}
    >
      {children}
    </button>
  )
}
