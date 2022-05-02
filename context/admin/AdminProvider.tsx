import React, { FC, ReactNode, useState } from 'react'
import { ICurrentAdmin } from '../../interfaces/current-admin'
import { AdminContext } from './adminContext'

export const AdminProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [currentAdmin, setCurrentAdmin] = useState<ICurrentAdmin>({
    id: '',
    firstName: '',
    lastName: '',
    email: '',
    dni: '',
  })

  return (
    <AdminContext.Provider
      value={{
        admin: currentAdmin,
        setCurrentAdmin,
      }}
    >
      {children}
    </AdminContext.Provider>
  )
}
