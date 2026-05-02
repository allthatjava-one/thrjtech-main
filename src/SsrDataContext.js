import { createContext, useContext } from 'react'

export const SsrDataContext = createContext(null)
export const useSsrData = () => useContext(SsrDataContext)
