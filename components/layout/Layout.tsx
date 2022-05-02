import Head from 'next/head'
import Image from 'next/image'
import NextLink from 'next/link'
import { FC, useContext, useEffect } from 'react'
import { NavIcon } from '../nav-icon/NavIcon'
import { ReactNode } from 'react'
import { signOut, useSession } from 'next-auth/react'
import { AdminContext } from '../../context/admin/adminContext'
import { clientAxios } from '../../axios/clientAxios'
import { user } from '@prisma/client'

interface ILayout {
  title?: string
  headTitle?: string
  children?: ReactNode
}

export const Layout: FC<ILayout> = ({ title, headTitle, children }) => {
  const session = useSession()
  const { admin, setCurrentAdmin } = useContext(AdminContext)

  const logout = () => {
    signOut({
      callbackUrl: `${window.location.origin}/login`,
    })
  }

  useEffect(() => {
    if (session.data?.user) {
      clientAxios
        .get<{ user: user }>(`/user/profile/${session.data.user.uid}`)
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
      </Head>
      <div className="flex">
        <nav className="flex flex-col items-center fixed z-50 min-h-full min-w-[148px] border-2 border-primary dark:border-blue-900 justify-between p-8 dark:bg-gray-800">
          <NextLink href="/admin" passHref>
            <a className="max-w-[78px]">
              <Image
                src="/images/logo2.png"
                alt="logo"
                width={196}
                height={170}
              />
            </a>
          </NextLink>
          <div className="flex flex-col space-y-24">
            <NavIcon link="/admin" icon="home" />
            <NavIcon link="/admin/users" icon="list" />
            <NavIcon link="/admin/profile" icon="profile" />
          </div>
          <NavIcon onClick={logout} icon="logout" />
        </nav>
        <div className="flex flex-col w-full ml-[148px]">
          <header className="flex items-center w-full justify-between bg-primary dark:bg-blue-900 px-10 h-[140px]">
            <span className="text-[50px] text-white">{title}</span>
            <div className="flex items-center">
              <span className="font-bold text-[30px] text-white">
                {`${admin.firstName} ${admin.lastName}`}
              </span>
              <div className="max-w-[66px] max-h-[66px]">
                <Image
                  src={`/images/avatars/profile/${session.data?.user?.image}`}
                  alt="admin"
                  width={132}
                  height={132}
                />
              </div>
            </div>
          </header>
          <div className="p-12 w-full bg-white dark:bg-gray-800 min-h-[calc(100vh-140px)]">
            {children}
          </div>
        </div>
      </div>
    </>
  )
}
