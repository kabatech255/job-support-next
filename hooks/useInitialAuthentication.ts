import { useContext, useEffect } from 'react'
import { AuthContext } from '@/provider/AuthProvider'
import { authOperation } from '@/globalState/user/operation'
import router from 'next/router'

const useInitialAuthentication = (canGuest: boolean = false) => {
  const { auth, dispatch } = useContext(AuthContext)

  useEffect(() => {
    let isMounted = true
    if (isMounted) {
      const init = async () => {
        const loggedInUser = await authOperation.currentUser(dispatch)
        if (loggedInUser === '' && !canGuest) {
          router.push('/login')
        }
        if (loggedInUser !== '' && router.pathname === '/login') {
          router.push('/')
        }
      }
      init()
    }
    return () => {
      isMounted = false
    }
  }, [])

  return {
    auth,
    dispatch,
  }
}

export default useInitialAuthentication
