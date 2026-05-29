import { Outlet } from 'react-router-dom'
import ScrollToTop from './ScrollToTop.jsx'

const AppLayout = () => (
  <>
    <ScrollToTop />
    <Outlet />
  </>
)

export default AppLayout