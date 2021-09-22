import { useRouter } from 'next/router'
import { useContext, useEffect } from 'react'
import { getRequest, requestUri } from '@/api'
import { User } from '@/interfaces/models'
import { AuthContext } from '@/provider/AuthProvider'
import { currentUserAction } from '@/globalState/user/action'

const useAuth = (canGuest: boolean = false) => {
  const router = useRouter()
  const { auth, dispatch } = useContext(AuthContext)

  useEffect(() => {
    let isMounted = true
    const func = async () => {
      const res = await getRequest<User | ''>(requestUri.currentUser)
      dispatch(currentUserAction(res))
      if (res === '' && !canGuest) {
        router.push('/login')
      }
    }
    func()
    return () => {
      isMounted = false
    }
  }, [])
  return { auth }
}

export default useAuth
