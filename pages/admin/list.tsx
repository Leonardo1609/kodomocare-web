import {
  Button,
  HStack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react'
import NextLink from 'next/link'
import React from 'react'
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
  return (
    <Layout title="Usuarios" headTitle="Usuarios">
      <TableContainer>
        <Table>
          <Thead>
            <Tr borderBottomColor="#5680E9" borderBottomWidth={3}>
              <Th
                paddingY="30px"
                textTransform="none"
                fontSize={25}
                color="black"
                fontWeight="normal"
                paddingLeft={0}
              >
                Usuarios
              </Th>
              <Th
                paddingY="30px"
                textTransform="none"
                fontSize={25}
                color="black"
                fontWeight="normal"
              >
                Cantidad de menores
              </Th>
              <Th
                paddingY="30px"
                textTransform="none"
                fontSize={25}
                color="black"
                fontWeight="normal"
              >
                Estado
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {users.map((user) => (
              <Tr key={user.id}>
                <Td paddingY="30px" fontSize={25} paddingLeft={0}>
                  {user.name}
                </Td>
                <Td paddingY="30px" fontSize={25}>
                  {user.numChilds}
                </Td>
                <Td
                  paddingY="30px"
                  fontSize={25}
                  color={user.active ? '#33893B' : '#FF0000'}
                >
                  {user.active ? 'Activo' : 'Inactivo'}
                </Td>
                <Td paddingY="30px">
                  <HStack spacing={4}>
                    <NextLink href={`./edit-user/${user.id}`} passHref>
                      <Button
                        as="a"
                        w="135px"
                        h="38px"
                        borderRadius={4}
                        color="white"
                        fontSize={15}
                        bg="#5680E9"
                      >
                        Modificar
                      </Button>
                    </NextLink>
                    <Button
                      w="135px"
                      h="38px"
                      borderRadius={4}
                      color="white"
                      fontSize={15}
                      bg="#FF0000"
                    >
                      Elminar
                    </Button>
                  </HStack>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Layout>
  )
}

export default List
