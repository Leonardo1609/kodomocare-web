import Head from 'next/head'
import { AdminContext } from '../../context/admin/adminContext'
import { FC, useContext, useEffect, useState } from 'react'
import { Header } from '../header/Header'
import { Navbar } from '../navbar/Navbar'
import { ReactNode } from 'react'
import { getUser } from '../../services/client/users'
import { useSession } from 'next-auth/react'

interface ILayout {
  title?: string
  headTitle?: string
  children?: ReactNode
}

export const Layout: FC<ILayout> = ({ title, headTitle, children }) => {
  const session = useSession()
  const { setCurrentAdmin } = useContext(AdminContext)
  const [navIsOpen, setNavIsOpen] = useState(false)

  const handleOpenNav = (value: boolean) => setNavIsOpen(value)

  useEffect(() => {
    if (session.data?.user) {
      localStorage.setItem('token', session.data.user.backendToken || '')
      getUser(session.data?.user.uid!)
        .then((resp) => {
          const {
            data: { user },
          } = resp
          if (resp.status === 200) {
            setCurrentAdmin({
              email: user.email,
              firstName: user.first_name,
              lastName: user.last_name,
              id: user.id,
              dni: user.identification_number,
            })
          }
        })
        .catch((err) => {
          console.log(err)
        })
    }
  }, [session, setCurrentAdmin])

  return (
    <>
      <Head>
        <title>{headTitle || 'KodomoCare'}</title>
        <link rel="icon" type="image/x-icon" href="/images/logo2.png" />
      </Head>
      <div className="flex min-w-full">
        <Navbar navIsOpen={navIsOpen} handleOpenNav={handleOpenNav} />
        <div className="flex flex-col w-full lg:ml-[148px]">
          <Header title={title} handleOpenNav={handleOpenNav} />
          <div className="py-10 px-6 lg:px-10 w-full bg-white dark:bg-gray-800 min-h-[calc(100vh-80px)] md:min-h-[calc(100vh-140px)]">
            {children}
          </div>
        </div>
      </div>
    </>
  )
}
