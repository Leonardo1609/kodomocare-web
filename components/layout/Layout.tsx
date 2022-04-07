import { Flex, HStack, Link, Stack, Text, VStack } from '@chakra-ui/react'
import Head from 'next/head'
import Image from 'next/image'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import { FC } from 'react'
import { NavIcon } from '../nav-icon/NavIcon'

interface ILayout {
  title: string
  headTitle?: string
  children: React.ReactElement | React.ReactElement[]
}

export const Layout: FC<ILayout> = ({ title, headTitle, children }) => {
  const router = useRouter()

  const logout = () => {
    router.push('/login')
  }

  return (
    <>
      <Head>
        <title>{headTitle || 'KodomoCare'}</title>
      </Head>
      <Flex>
        <VStack
          position="fixed"
          as="nav"
          minH="full"
          minW={148}
          border="2px"
          borderColor="#5680E9"
          justifyContent="space-between"
          padding={8}
        >
          <NextLink href="/admin" passHref>
            <Link maxW={78}>
              <Image
                src="/images/logo2.png"
                alt="logo"
                width={196}
                height={170}
              />
            </Link>
          </NextLink>
          <VStack spacing={96 / 4}>
            <NavIcon link="/admin" icon="home" />
            <NavIcon link="/admin/list" icon="list" />
            <NavIcon link="/admin/profile" icon="profile" />
          </VStack>
          <NavIcon onClick={logout} icon="logout" />
        </VStack>
        <VStack w="full" marginLeft={148}>
          <HStack
            w="full"
            as="header"
            justifyContent="space-between"
            bg="#5680E9"
            paddingX={10}
            h={140}
          >
            <Text fontSize={50} color="white">
              {title}
            </Text>
            <HStack>
              <Text fontWeight="bold" fontSize={30} color="white">
                Administrador
              </Text>
              <Stack maxW={66} maxH={66}>
                <Image
                  src="/images/admin.png"
                  alt="admin"
                  width={132}
                  height={132}
                />
              </Stack>
            </HStack>
          </HStack>
          <Stack padding={12} w="full">
            {children}
          </Stack>
        </VStack>
      </Flex>
    </>
  )
}
