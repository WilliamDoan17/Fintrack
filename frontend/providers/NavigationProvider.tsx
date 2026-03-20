import { useState } from 'react'
import { NavigationContext } from '../contexts/NavigationContext'

const NavigationProvider = ({ children }: { children: React.ReactNode }) => {
  const [backTo, setBackTo] = useState<string | null>(null)

  return (
    <NavigationContext.Provider value={{ backTo, setBackTo }}>
      {children}
    </NavigationContext.Provider>
  )
}

export default NavigationProvider
