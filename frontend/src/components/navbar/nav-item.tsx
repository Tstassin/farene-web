import { Link, Text, TextProps } from "@chakra-ui/react"
import React from "react"

interface NavItemProps extends TextProps{
  children: React.ReactNode
  to: string
}

export const NavItem: React.FC<NavItemProps> = ({ children, to = "/", ...rest }) => {
  return (
    <Link href={to}>
      <Text display="block" {...rest}>
        {children}
      </Text>
    </Link>
  )
}
