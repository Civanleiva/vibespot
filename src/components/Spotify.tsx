import { useSession, signIn, signOut } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { fetchSpotify } from '../lib/fetch-spotify'

type Artist = {
  name: string
  id: string
  images: string[]
  genres: string[]
  popularity: number
}

type Data = {
  items: Artist[]
}

export default function Spotify() {
  const [artists, setArtists] = useState<Artist[]>()
  const [mood, setMood] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [playlist, setPlaylist] = useState<string>('')
  const { data: session } = useSession()

  useEffect(() => {
    void fetch('/api/artists')
      .then(res => res.json())
      .then((data: Data) => {
        if (data.items) setArtists(data.items)
      })
  }, [])

  const handleSelect = ({
    target: { value },
  }: React.ChangeEvent<HTMLSelectElement>) => {
    setMood(value)
  }

  const generatePlaylist = async () => {
    setPlaylist('')
    setLoading(true)
    const topTracks: { [key: string]: [] } = {}
    const tracks: { valence: number; uri: string }[] = []

    if (typeof artists !== 'undefined') {
      for (const artist of artists) {
        const artistTopTracks: { tracks: [] } = await fetchSpotify(
          'https://api.spotify.com/v1/artists/' +
            artist.id +
            '/top-tracks?market=US',
          session
        )
        topTracks[artist.id] = artistTopTracks.tracks
      }
    }
    for (const artist in topTracks) {
      const ids = topTracks[artist]
        ?.map((track: { id: string }) => {
          return track.id
        })
        .join()

      if (typeof ids !== 'undefined') {
        const audioFeatures: { audio_features: [] } = await fetchSpotify(
          'https://api.spotify.com/v1/audio-features?ids=' + ids,
          session
        )

        audioFeatures.audio_features.forEach(
          (feature: { valence: number; uri: string }) => {
            if (
              mood === 'happy' &&
              feature.valence > 0.667 &&
              tracks.length < 100
            ) {
              tracks.push(feature)
            } else if (
              mood === 'sad' &&
              feature.valence < 0.333 &&
              tracks.length < 100
            ) {
              tracks.push(feature)
            }
          }
        )
      }
    }

    await fetchSpotify(
      `https://api.spotify.com/v1/users/${
        session?.user.sub as string
      }/playlists`,
      session,
      'POST',
      {
        name: mood + ' playlist',
        description: `A playlist of ${mood} songs generated by Vibespot`,
        public: false,
      }
    ).then(async playlist => {
      const url = await fetch('/api/add-tracks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          playlist,
          trackUris: tracks.map(track => track.uri),
        }),
      }).then(res => res.json() as unknown as string)
      setPlaylist(url)
    })

    setLoading(false)
  }

  const renderButton = (loading: boolean, mood: string) => {
    if (mood === '') return null

    if (loading) {
      return (
        <div role="status">
          <svg
            aria-hidden="true"
            className="mr-2 h-8 w-8 animate-spin fill-primary text-gray-200 dark:text-gray-600"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill"
            />
          </svg>
          <span className="sr-only">Loading...</span>
        </div>
      )
    }
    return (
      <button
        className="bg-red-2 rounded-full border border-primary px-4 py-2 text-base text-primary hover:bg-primary hover:text-[#121212]"
        onClick={() => void generatePlaylist()}
      >
        Generate playlist
      </button>
    )
  }

  if (session) {
    return (
      <>
        {playlist !== '' && (
          <div
            id="toast-undo"
            className="absolute bottom-5 right-5 flex w-full max-w-xs items-center rounded-lg bg-white p-4 text-gray-500 shadow"
            role="alert"
          >
            <div className="text-sm font-normal">Playlist created</div>
            <div className="ml-auto flex items-center space-x-2">
              <a
                className="rounded-lg p-1.5 text-sm font-medium text-primary hover:bg-blue-100"
                href={playlist}
                target="_blank"
                rel="noreferrer"
              >
                OPEN
              </a>
              <button
                type="button"
                onClick={() => void setPlaylist('')}
                className="inline-flex h-8 w-8 rounded-lg bg-white p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-900 focus:ring-2 focus:ring-gray-300 dark:bg-gray-800 dark:text-gray-500 dark:hover:bg-gray-700"
                data-dismiss-target="#toast-undo"
                aria-label="Close"
              >
                <span className="sr-only">Close</span>
                <svg
                  aria-hidden="true"
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
              </button>
            </div>
          </div>
        )}
        <span className="undefined flex cursor-default items-center rounded-full border border-green-500 px-4 py-2 text-base text-green-500 ">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="mr-2"
            viewBox="0 0 16 16"
          >
            <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0zm3.669 11.538a.498.498 0 0 1-.686.165c-1.879-1.147-4.243-1.407-7.028-.77a.499.499 0 0 1-.222-.973c3.048-.696 5.662-.397 7.77.892a.5.5 0 0 1 .166.686zm.979-2.178a.624.624 0 0 1-.858.205c-2.15-1.321-5.428-1.704-7.972-.932a.625.625 0 0 1-.362-1.194c2.905-.881 6.517-.454 8.986 1.063a.624.624 0 0 1 .206.858zm.084-2.268C10.154 5.56 5.9 5.419 3.438 6.166a.748.748 0 1 1-.434-1.432c2.825-.857 7.523-.692 10.492 1.07a.747.747 0 1 1-.764 1.288z" />
          </svg>
          <span className="text-sm font-medium">
            Signed in as {session.user.name}
          </span>
        </span>
        <button
          className="bg-red-2 rounded-full border border-red-600 px-4 py-2 text-base text-red-600 hover:bg-red-600 hover:text-[#121212]"
          onClick={() => void signOut()}
        >
          Sign out
        </button>
        {session && (
          <div className="text-center">
            <label
              htmlFor="moods"
              className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
            >
              How are you feeling?
            </label>
            <select
              onChange={handleSelect}
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
            >
              <option defaultValue={''} className="hidden">
                Choose a mood
              </option>
              <option value="happy">Happy</option>
              {/* <option value="Angry">Angry</option> */}
              <option value="sad">Sad</option>
              {/* <option value="Neutral">Neutral</option> */}
            </select>
          </div>
        )}
        {renderButton(loading, mood)}
      </>
    )
  }
  return (
    <>
      <h3 className="text-primary">Not signed in</h3>
      <button
        className="bg-red-2 rounded-full border border-green-600 px-4 py-2 text-base text-green-600 hover:bg-green-600 hover:text-[#121212]"
        onClick={() => void signIn()}
      >
        Sign in
      </button>
    </>
  )
}
