import Image from 'next/image'
import NextLink from 'next/link'
import { FC } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { NavIcon } from '../nav-icon/NavIcon'
import { faClose } from '@fortawesome/free-solid-svg-icons'
import { signOut } from 'next-auth/react'

export const Navbar: FC<{
  navIsOpen: boolean
  handleOpenNav: (value: boolean) => void
}> = ({ navIsOpen, handleOpenNav }) => {
  const logout = () => {
    signOut({
      callbackUrl: `${window.location.origin}/login`,
    })
    localStorage.removeItem('token')
  }

  return (
    <>
      {/* Desktop */}
      <nav className="hidden lg:flex flex-col items-center fixed z-50 min-h-full min-w-[148px] border-2 border-primary dark:border-blue-900 justify-between p-8 dark:bg-gray-800">
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
      {/* Mobile */}
      {navIsOpen && (
        <nav className="flex flex-col items-center fixed z-50 min-h-full w-full border-2 border-primary dark:border-blue-900 justify-between p-8 dark:bg-gray-800">
          <div className="flex justify-between w-full">
            <NextLink href="/admin" passHref>
              <a
                className="max-w-[78px]"
                onClick={handleOpenNav.bind(this, false)}
              >
                <Image
                  src="/images/logo2.png"
                  alt="logo"
                  width={196}
                  height={170}
                />
              </a>
            </NextLink>
            <button onClick={handleOpenNav.bind(this, false)}>
              <FontAwesomeIcon icon={faClose} width={20} color="white" />
            </button>
          </div>
          <div className="flex flex-col space-y-24">
            <NavIcon
              link="/admin"
              icon="home"
              onClick={handleOpenNav.bind(this, false)}
            />
            <NavIcon
              link="/admin/users"
              icon="list"
              onClick={handleOpenNav.bind(this, false)}
            />
            <NavIcon
              link="/admin/profile"
              icon="profile"
              onClick={handleOpenNav.bind(this, false)}
            />
          </div>
          <NavIcon onClick={logout} icon="logout" />
        </nav>
      )}
    </>
  )
}
