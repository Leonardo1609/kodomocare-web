import { FC } from 'react'
import { ParentAvatar } from '../parent-avatar/ParentAvatar'
import { user } from '@prisma/client'
import Link from 'next/link'

export const ParentActions: FC<{ user: user }> = ({ user }) => {
  return (
    <div className="mb-6 flex space-x-6">
      <ParentAvatar user={user} />
      <div className="flex flex-col md:flex-row items-center flex-1 max-w-2xl justify-center space-y-6 md:space-x-6 md:space-y-0">
        <Link href={`/admin/users/user/${user.id}`}>
          <a className="text-white bg-green-500 dark:bg-green-700 rounded px-8 text-[25px] w-full md:w-auto">
            Acceder
          </a>
        </Link>
        <button className="text-white bg-red-500 dark:bg-red-700 rounded px-6 text-[25px] w-full md:w-auto">
          Desactivar
        </button>
      </div>
    </div>
  )
}
