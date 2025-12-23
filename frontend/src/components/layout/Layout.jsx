import Header from './Header'
import BottomNav from './BottomNav'
import './Layout.css'

function Layout({ children, hideHeader, hideNav }) {
  return (
    <div className="layout">
      {!hideHeader && <Header />}
      <main className={`layout-main ${hideHeader ? 'no-header' : ''}`}>
        {children}
      </main>
      {!hideNav && <BottomNav />}
    </div>
  )
}

export default Layout
