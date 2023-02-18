import type { Session } from 'next-auth'

export const fetchSpotify = async <T>(
  url: string,
  session: Session | null,
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE',
  body?: { [key: string]: string | boolean | string[] }
): Promise<T> => {
  if (!session) {
    return Error('No session provided') as T
  }

  const res = await fetch(url, {
    method: method || 'GET',
    headers: {
      Authorization: `Bearer ${session.user.accessToken as string}`,
    },
    body: body ? JSON.stringify(body) : undefined,
  }).then(res => res.json() as T)

  return res
}
