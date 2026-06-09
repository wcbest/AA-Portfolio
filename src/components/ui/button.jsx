export function Button({ children, className = '', onClick, variant, size, disabled, ...rest }) {
  return (
    <button onClick={onClick} disabled={disabled} className={className} {...rest}>
      {children}
    </button>
  )
}
