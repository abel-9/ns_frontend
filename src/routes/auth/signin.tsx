import SigninScreen from '#/features/auth/screens/Signin'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/auth/signin')({
  component: RouteComponent,
})

function RouteComponent() {
  return <SigninScreen />
}
