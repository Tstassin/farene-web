import { Outlet } from 'react-router-dom'
import { Authenticated } from '../components/auth/authenticated'

export const Me = () => {
  return (
    <Authenticated>
      <Outlet />
    </Authenticated>
  )
}