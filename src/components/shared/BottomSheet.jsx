import { X } from 'lucide-react'

export default function BottomSheet({ open, onClose, title, children }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      <button
        aria-label="Close"
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-base-900 rounded-t-3xl border-t border-base-700 max-h-[85vh] flex flex-col animate-[slideUp_0.2s_ease-out]">
        <div className="flex items-center justify-between px-5 pt-4 pb-2">
          <h2 className="text-lg font-bold">{title}</h2>
          <button
            onClick={onClose}
            className="h-9 w-9 flex items-center justify-center rounded-full bg-base-800 active:bg-base-700"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>
        <div className="overflow-y-auto px-5 pb-8 pt-2 no-scrollbar" style={{ paddingBottom: 'calc(2rem + env(safe-area-inset-bottom, 0px))' }}>
          {children}
        </div>
      </div>
    </div>
  )
}
