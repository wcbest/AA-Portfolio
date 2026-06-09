import { createContext, useContext } from 'react'

const SelectContext = createContext({ value: undefined, onChange: () => {} })

export function Select({ value, onValueChange, children }) {
  return (
    <SelectContext.Provider value={{ value, onValueChange }}>
      <div>{children}</div>
    </SelectContext.Provider>
  )
}

export function SelectTrigger({ children, className = '' }) {
  return <div className={className}>{children}</div>
}

export function SelectContent({ children, className = '' }) {
  return <div className={className}>{children}</div>
}

export function SelectItem({ value, children, className = '' }) {
  const ctx = useContext(SelectContext)
  return (
    <div onClick={() => ctx.onValueChange(value)} className={className} role="button">
      {children}
    </div>
  )
}

export function SelectValue({ placeholder = '' }) {
  const ctx = useContext(SelectContext)
  return <span>{ctx.value || placeholder}</span>
}
