import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import { fetchSpotify } from '../../lib/fetch-spotify'

interface AddTracksBody extends NextApiRequest {
  body: {
    playlist: { id: string; external_urls: { spotify: string } }
    trackUris: string[]
  }
}

function shuffle<T>(array: T[]) {
  array.sort(() => Math.random() - 0.5)
}

export default async function handler(
  req: AddTracksBody,
  res: NextApiResponse
) {
  const session = await getSession({ req })
  const { playlist, trackUris } = req.body

  shuffle(trackUris)

  await fetchSpotify(
    `https://api.spotify.com/v1/playlists/${playlist.id}/tracks`,
    session,
    'POST',
    { uris: trackUris }
  )

  res.status(200).json(playlist.external_urls.spotify)
}
