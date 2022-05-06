import Image from 'next/image'
import { AdminContext } from '../../context/admin/adminContext'
import { FC, useContext } from 'react'
import { useSession } from 'next-auth/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from '@fortawesome/free-solid-svg-icons'

export const Header: FC<{
  title?: string
  handleOpenNav: (value: boolean) => void
}> = ({ title, handleOpenNav }) => {
  const session = useSession()
  const { admin } = useContext(AdminContext)

  return (
    <header className="flex items-center w-full justify-between bg-primary dark:bg-blue-900 px-6 md:px-10 h-20 md:h-[140px]">
      <h1 className="md:text-[50px] text-white text-base font-bold md:font-normal">
        {title}
      </h1>
      <div className="flex items-center space-x-2">
        {admin.id && (
          <>
            <span className="font-bold text-[30px] text-white hidden lg:inline-block">
              {`${admin.firstName.split(' ')[0]} ${
                admin.lastName.split(' ')[0]
              }`}
            </span>
            <span className="font-bold text-base md:text-[30px] text-white inline-block lg:hidden">
              {`${admin.firstName.charAt(0)}. ${admin.lastName.charAt(0)}.`}
            </span>
          </>
        )}
        <div className="max-w-[40px] max-h-[40px] md:max-w-[66px] md:max-h-[66px]">
          <Image
            src={`/images/avatars/profile/${session.data?.user?.image}`}
            alt="admin"
            width={132}
            height={132}
          />
        </div>
        <div className="block lg:hidden mt-2">
          <button onClick={handleOpenNav.bind(this, true)}>
            <FontAwesomeIcon icon={faBars} width={20} color="white" />
          </button>
        </div>
      </div>
    </header>
  )
}
