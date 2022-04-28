import { ReactElement } from 'react'
import { Layout } from '../../components/layout/Layout'

const users = [
  {
    id: 1,
    name: 'Pepito Fernandez',
    numChilds: 3,
    active: true,
  },
  {
    id: 2,
    name: 'Pepito Fernandez',
    numChilds: 3,
    active: true,
  },
  {
    id: 3,
    name: 'Pepito Fernandez',
    numChilds: 3,
    active: false,
  },
]

const List = () => {
  return null
}

export default List

List.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout title="Apoderados" headTitle="Apoderados">
      {page}
    </Layout>
  )
}
