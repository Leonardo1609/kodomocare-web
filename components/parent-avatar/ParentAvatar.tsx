import { user } from '@prisma/client'
import Image from 'next/image'
import Link from 'next/link'
import { FC } from 'react'

export const ParentAvatar: FC<{ user: user; hasEditButton?: boolean }> = ({
  user,
  hasEditButton = false,
}) => {
  return (
    <div className="flex space-x-4">
      <div className="border border-primary dark:border-blue-800 rounded p-2 shadow-sm shadow-primary dark:shadow-blue-800">
        <Image
          src={`/images/avatars/profile/${user.avatar_image}`}
          alt="admin"
          width={132}
          height={132}
        />
      </div>
      <div className="dark:text-gray-300 leading-8 text-xl">
        <p>Nombres: {user.first_name}</p>
        <p>Apellidos: {user.last_name}</p>
        <p>DNI: {user.identification_number}</p>
        {hasEditButton && (
          <Link href={`/admin/users/user/edit-user/${user.id}`}>
            <a className="text-white bg-primary dark:bg-blue-800 rounded px-8 text-[25px] w-full md:w-auto inline-block mt-3">
              Editar
            </a>
          </Link>
        )}
      </div>
    </div>
  )
}
