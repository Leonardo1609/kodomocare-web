import { FC, useState } from 'react'
import { ParentAvatar } from '../parent-avatar/ParentAvatar'
import { user } from '@prisma/client'
import Link from 'next/link'
import { clientAxios } from '../../axios/clientAxios'
import { toast } from 'react-toastify'

export const ParentActions: FC<{ user: user }> = ({ user }) => {
  const [actionsUser, setActionsUser] = useState(user)

  const toggleActive = async () => {
    try {
      const resp = await clientAxios.put<{ message: string; status?: number }>(
        `/user/update-parent/toggle-active/${user.id}`
      )
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
    <div className="mb-6 flex space-x-6">
      <div className="max-w-[350px] w-full">
        <ParentAvatar user={actionsUser} />
      </div>
      <div className="flex flex-col md:flex-row items-center flex-1 max-w-2xl justify-center space-y-6 md:space-x-6 md:space-y-0">
        <Link href={`/admin/users/user/${user.id}`}>
          <a className="text-white bg-primary dark:bg-blue-800 rounded px-8 text-[25px] w-full md:w-auto">
            Acceder
          </a>
        </Link>
        {actionsUser.status ? (
          <button
            className="text-white bg-red-400 dark:bg-red-600 rounded px-6 text-[25px] w-full md:w-auto"
            onClick={toggleActive}
          >
            Desactivar
          </button>
        ) : (
          <button
            className="text-white bg-green-500 dark:bg-green-700 rounded px-6 text-[25px] w-full md:w-auto"
            onClick={toggleActive}
          >
            Activar
          </button>
        )}
      </div>
    </div>
  )
}
