export function Alert({ children, className = '', variant = 'default' }) {
  return <div className={className}>{children}</div>
}

export function AlertDescription({ children, className = '' }) {
  return <div className={className}>{children}</div>
}
