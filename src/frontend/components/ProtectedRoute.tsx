import { Navigate } from 'react-router-dom'
import React, { useEffect, useState } from 'react'

export const ProtectedRoute = ({ children }: { children: React.ReactElement }): React.ReactElement => {
  const [authFlag, setAuthFlag] = useState<null | boolean>(null)
  useEffect(() => {
    async function getAuthFlag (): Promise<boolean> {
      const flag = await fetch('http://localhost:4000/isAuthenticated', {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      })
        .then(async response => await response.json())
        .then(response => { console.log(response); return response.response }).catch((error) => {
          throw error
        })
      setAuthFlag(flag)
      return flag
    }
    getAuthFlag().catch((err) => {
      throw err
    })
  }, [])

  if (authFlag !== null) {
    if (!authFlag) {
      return <Navigate to="/login" />
    }
    return children
  }
  return <></>
}
