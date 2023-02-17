import type { Session } from 'next-auth'

export const fetchSpotify = async <T>(
  url: string,
  session: Session | null
): Promise<T> => {
  if (!session) {
    return Error('No session provided') as T
  }

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${session.user.accessToken as string}`,
    },
  }).then(res => res.json() as T)

  return res
}
