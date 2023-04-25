import { Link, Text, TextProps } from "@chakra-ui/react"
import React from "react"
import { NavLink } from "react-router-dom"

interface NavItemProps extends TextProps{
  children: React.ReactNode
  noDecorate?: boolean
  to: string
}

export const NavItem: React.FC<NavItemProps> = ({ children, to, noDecorate = false, ...rest }) => {
  return (
    <Link as={NavLink} to={to} textDecoration={noDecorate ? 'none' : 'underline'}>
      <Text display="block" {...rest}>
        {children}
      </Text>
    </Link>
  )
}
