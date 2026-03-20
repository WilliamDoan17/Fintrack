import { createContext, useContext } from 'react'

interface NavigationContextType {
  backTo: string | null
  setBackTo: (path: string | null) => void
}

export const NavigationContext = createContext<NavigationContextType>({
  backTo: null,
  setBackTo: () => {}
})

export const useNavigation = () => useContext(NavigationContext)
