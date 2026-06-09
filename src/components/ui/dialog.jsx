export function Dialog({ children, open, onOpenChange }) {
  if (!open) return null
  return <div>{children}</div>
}

export function DialogContent({ children, className = '' }) {
  return <div className={className}>{children}</div>
}

export function DialogHeader({ children, className = '' }) {
  return <div className={className}>{children}</div>
}

export function DialogTitle({ children, className = '' }) {
  return <h3 className={className}>{children}</h3>
}
