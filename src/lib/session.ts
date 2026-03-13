import { useSession } from '@tanstack/react-start/server'

type SessionData = {
  access_token?: string
  refresh_token?: string
}

export function useAppSession() {
  return useSession<SessionData>({
    name: 'auth_session', // The name of the cookie
    password: process.env.SESSION_SECRET!,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      httpOnly: true,
    },
  })
}