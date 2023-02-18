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
        <meta name="description" content="Generate playlists based on mood" />

        <meta itemProp="name" content="Vibespot" />
        <meta
          itemProp="description"
          content="Generate playlists based on mood"
        />
        <meta itemProp="image" content="" />

        <meta property="og:url" content="https://vibespot.vercel.app" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Vibespot" />
        <meta
          property="og:description"
          content="Generate playlists based on mood"
        />
        <meta property="og:image" content="" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Vibespot" />
        <meta
          name="twitter:description"
          content="Generate playlists based on mood"
        />
        <meta name="twitter:image" content="" />
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
