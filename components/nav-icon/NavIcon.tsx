import { FC } from 'react'

import NextLink from 'next/link'
import { Link, Stack } from '@chakra-ui/react'
import Image from 'next/image'
import { useRouter } from 'next/router'

interface INavIcon {
  link?: string
  onClick?: () => void
  icon: 'home' | 'list' | 'profile' | 'logout'
}
export const NavIcon: FC<INavIcon> = ({ link, onClick, icon }) => {
  const { pathname } = useRouter()

  const src = `/icons/${icon}${pathname === link ? '-active' : ''}.svg`

  if (link) {
    return (
      <NextLink href={link} passHref>
        <Link maxW={50}>
          <Image src={src} alt={icon} width={100} height={100} />
        </Link>
      </NextLink>
    )
  }
  return (
    <Stack as="button" maxW={50} onClick={onClick}>
      <Image src={src} alt={icon} width={100} height={100} />
    </Stack>
  )
}
