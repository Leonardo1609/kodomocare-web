import Link from 'next/link'
import { FC, useState } from 'react'
import { ParentAvatar } from '../parent-avatar/ParentAvatar'
import { toast } from 'react-toastify'
import { updateStatusParent } from '../../services/client/users'
import { user } from '@prisma/client'

export const ParentActions: FC<{ user: user }> = ({ user }) => {
  const [actionsUser, setActionsUser] = useState<user>(user)

  const toggleActive = async () => {
    try {
      const resp = await updateStatusParent(user.id)

      if (resp.status === 200) {
        toast.success(resp.data.message)
        setActionsUser((currentActionUser) => ({
          ...currentActionUser,
          status: resp.data.status!,
        }))
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message)
    }
  }

  return (
    <div className="mb-6 flex space-x-0 md:space-x-6 flex-col md:flex-row">
      <div className="md:max-w-[350px] w-full mb-3 md:mb-6">
        <ParentAvatar user={actionsUser} />
      </div>
      <div className="flex items-center flex-1 md:max-w-2xl justify-center space-x-6 text-white">
        <Link href={`/admin/users/user/${user.id}`}>
          <a className="bg-primary dark:bg-blue-800 rounded px-8 text-xl md:text-[25px] w-full md:w-auto text-center md:h-auto py-1">
            Acceder
          </a>
        </Link>
        {actionsUser.status === 0 ? (
          <button
            className="bg-red-400 dark:bg-red-600 rounded px-6 text-xl md:text-[25px] w-full md:w-auto text-center md:h-auto py-1"
            onClick={toggleActive}
          >
            Desactivar
          </button>
        ) : (
          <button
            className="bg-green-500 dark:bg-green-700 rounded px-6 text-xl md:text-[25px] w-full md:w-auto text-center md:h-auto py-1"
            onClick={toggleActive}
          >
            Activar
          </button>
        )}
      </div>
    </div>
  )
}
