import { useEffect } from 'react'
import { useRouter, useNavigationContainerRef } from 'expo-router'
import { useRootNavigationState } from 'expo-router'

export default function Index() {
  const router = useRouter()
  const navigationState = useRootNavigationState()

  useEffect(() => {
    if (!navigationState?.key) return

    router.replace('/login')
  }, [navigationState])

  return null
}
