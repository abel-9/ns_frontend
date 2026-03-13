import EmailVerificationScreen from '#/features/auth/screens/EmailVerification'
import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'

export const Route = createFileRoute('/auth/email-verification')({
  validateSearch: z.object({
    email: z.string().optional(),
  }),
  component: RouteComponent,
})

function RouteComponent() {
  return <EmailVerificationScreen />
}
