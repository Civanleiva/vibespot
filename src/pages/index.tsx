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
        </div>
      </main>
    </>
  )
}

export default Home
