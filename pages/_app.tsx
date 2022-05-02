import '../styles/globals.css'
import 'react-toastify/dist/ReactToastify.css'
import NextNProgress from 'nextjs-progressbar'
import type { AppProps } from 'next/app'
import { AdminProvider } from '../context/admin/AdminProvider'
import { SessionProvider } from 'next-auth/react'
import { ToastContainer } from 'react-toastify'
import { NextPageWithLayout } from '../interfaces/layout'

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

function MyApp({
  Component,
  pageProps: { session, ...pageProps },
}: AppPropsWithLayout) {
  const getLayout = Component.getLayout || ((page) => page)
  return (
    <SessionProvider session={session}>
      <NextNProgress />
      <AdminProvider>{getLayout(<Component {...pageProps} />)}</AdminProvider>
      <ToastContainer autoClose={2500} theme="colored" />
    </SessionProvider>
  )
}

export default MyApp
