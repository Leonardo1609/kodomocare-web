import { FC } from 'react'

import NextLink from 'next/link'
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
        <a className="max-w-[50px]">
          <Image src={src} alt={icon} width={100} height={100} />
        </a>
      </NextLink>
    )
  }
  return (
    <button className="max-w-[50px]" onClick={onClick}>
      <Image src={src} alt={icon} width={100} height={100} />
    </button>
  )
}
