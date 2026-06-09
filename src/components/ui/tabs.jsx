export function Tabs({ children, defaultValue }) {
  return <div>{children}</div>
}

export function TabsList({ children, className = '' }) {
  return <div className={className}>{children}</div>
}

export function TabsTrigger({ children, value, className = '' }) {
  return <button type="button" className={className}>{children}</button>
}

export function TabsContent({ children, value, className = '' }) {
  return <div className={className}>{children}</div>
}
