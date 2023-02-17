import { type NextPage } from 'next'
import Head from 'next/head'
import { Inconsolata } from '@next/font/google'
import Spotify from '../components/Spotify'

const inconsolata = Inconsolata({
  subsets: ['latin'],
  variable: '--font-inter',
})

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Vibespot</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main
        className={`${inconsolata.variable} flex min-h-screen flex-col items-center justify-center bg-[#121212]`}
      >
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <h1 className="text-5xl font-extrabold tracking-tight text-primary sm:text-[5rem]">
            Vibespot
          </h1>
          <h2 className="text-2xl font-extralight text-white">
            Generate playlists based on mood
          </h2>
          <Spotify />
          <div className="text-center">
            <label
              htmlFor="moods"
              className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
            >
              Choose your mood
            </label>
            <select
              id="moods"
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
            >
              <option defaultValue={''}>Choose a mood</option>
              <option value="Happy">Happy</option>
              <option value="Angry">Angry</option>
              <option value="Sad">Sad</option>
              <option value="Neutral">Neutral</option>
            </select>
          </div>
        </div>
      </main>
    </>
  )
}

export default Home
