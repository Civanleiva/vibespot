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
  const { data: session } = useSession()

  useEffect(() => {
    void fetch('/api/artists')
      .then(res => res.json())
      .then((data: Data) => {
        if (data.items) setArtists(data.items)
      })
  }, [])

  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setMood(e.target.value)
  }

  const generatePlaylist = async () => {
    const topTracks: { [key: string]: object[] } = {}
    if (typeof artists !== 'undefined') {
      for (const artist of artists) {
        const artistTopTracks = await fetchSpotify(
          'artists/' + artist.id + '/top-tracks',
          session
        )
        console.log(artistTopTracks)
        topTracks[artist.id] = []
      }
    }
  }

  if (session) {
    return (
      <>
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
          onClick={() => void signOut}
        >
          Sign out
        </button>
        {session && (
          <div className="text-center">
            <label
              htmlFor="moods"
              className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
            >
              Choose your mood
            </label>
            <select
              onChange={handleSelect}
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
            >
              <option defaultValue={''} className="hidden">
                Choose a mood
              </option>
              <option value="Happy">Happy</option>
              <option value="Angry">Angry</option>
              <option value="Sad">Sad</option>
              <option value="Neutral">Neutral</option>
            </select>
          </div>
        )}
        {mood !== '' && (
          <button
            className="bg-red-2 rounded-full border border-primary px-4 py-2 text-base text-primary hover:bg-primary hover:text-[#121212]"
            onClick={() => void generatePlaylist}
          >
            Generate playlist
          </button>
        )}
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
