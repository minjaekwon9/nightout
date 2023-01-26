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
      <Navbar />
      <Component {...pageProps} />
    </>
  )
}

export default MyApp
