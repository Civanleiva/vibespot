import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import { fetchSpotify } from '../../lib/fetch-spotify'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req })

  const artists = await fetchSpotify(
    'https://api.spotify.com/v1/me/top/artists?limit=50',
    session
  )

  res.status(200).json(artists)
}
