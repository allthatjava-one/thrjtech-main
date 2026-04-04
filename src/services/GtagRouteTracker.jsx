import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export default function GtagRouteTracker() {
  const location = useLocation()

  useEffect(() => {
    if (typeof window.gtag === 'function') {
      window.gtag('config', 'G-CTBF109J2G', {
        page_path: location.pathname + location.search
      })
    }
  }, [location])

  return null
}
