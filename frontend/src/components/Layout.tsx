import { Outlet } from 'react-router-dom'
import InstagramHeader from './InstagramHeader'

export default function Layout() {
  return (
    <div style={{ minHeight: '100vh' }}>
      <InstagramHeader />
      <main style={{ paddingTop: 60, maxWidth: 975, margin: '0 auto', padding: '60px 20px 20px' }}>
        <Outlet />
      </main>
    </div>
  )
}
