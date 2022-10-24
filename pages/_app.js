// LIBRARY IMPORTS
import Head from 'next/head'
import "bootstrap/dist/css/bootstrap.min.css"
import "notiflix/dist/notiflix-3.2.5.min.css"
import "notiflix/dist/notiflix-3.2.5.min.js"
import 'react-datalist-input/dist/styles.css'

// CUSTOM IMPORTS
import { default as Navbar } from '../components/Navbar'
import "../styles/custom.scss"
import "../styles/globals.css"


function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>NightOut</title>
        <meta name="description" content="An easy way to plan a fun-filled night out with your friends!" />
        <meta name="author" content="Minjae Kwon" />
        <link rel="icon" href="/icon.svg" />
      </Head>
      <Navbar />
      <Component {...pageProps} />
    </>
  )
}

export default MyApp
